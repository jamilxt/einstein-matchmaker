// The team. Every participant reacts to events on the shared runtime; nobody calls anybody.
//
//   Coordinator   splits the shortlist and hands batches to Screeners            (no model)
//   Screener x3   score each researcher-challenge pair with the Decisions API     (Decisions)
//   Matchmaker    picks strong, non-overlapping pairs the moment scores land,
//                 assigns Profiler / Analyst / Writer work                        (no model)
//   Profiler x2   build a cited researcher profile                                (LLM loop + tool)
//   Analyst x2    build a cited company-challenge profile                         (LLM loop + tool)
//   Writer x2     draft the proposal                                              (LLM loop)
//   Critic        intercepts every draft before it is committed: deterministic id
//                 checks + Decisions claim checks; sends it back or approves      (interception)
//   Auditor       writes every event to the trace and meters spend                (observer)
import {
	createAgent,
	createHuman,
	SituationSpecification,
	type Agent,
	type Human,
	type SituationContext,
	type SituationHandler,
	type Tool,
} from "@mozaik-ai/core"
import { appendFileSync } from "node:fs"
import { CRITIC_ENFORCES, LANG_RULE, MODELS, TODAY, TUNING } from "./config"
import { FORM_LABEL, proposalForm } from "./data/consent"
import { tokenize } from "./data/shortlist"
import { decider } from "./decisions"
import { runJob } from "./jobs"
import {
	emit,
	pairKey,
	state,
	type ClaimCheck,
	type CompanyProfile,
	type Proposal,
	type ResearcherProfile,
	type Screened,
	type Selection,
} from "./runtime"
import { type Claim } from "./verify/citations"
import { checkClaims } from "./verify/critic-check"
import { checkProse } from "./verify/coverage"

// ---------- small helpers ----------

class On extends SituationSpecification {
	constructor(private readonly types: string[], private readonly forMe = false) {
		super()
	}
	isSatisfiedBy({ event, participant }: SituationContext): boolean {
		if (!this.types.includes(event.type)) return false
		if (!this.forMe) return true
		return (event.payload as { assignee?: string })?.assignee === participant.getId()
	}
}

const handler = (types: string[], forMe: boolean, apply: (payload: any, self: { id: string }, ctx: SituationContext) => void): SituationHandler => ({
	specification: new On(types, forMe),
	processor: { apply: (ctx) => apply(ctx.event.payload, { id: ctx.participant.getId() }, ctx) },
})

function parseJson<T>(text: string): T {
	const start = text.indexOf("{")
	return JSON.parse(start >= 0 ? text.slice(start) : text) as T
}

const busy = new Map<string, number>()
const leastBusy = (ids: string[]) => ids.reduce((a, b) => ((busy.get(a) ?? 0) <= (busy.get(b) ?? 0) ? a : b))
const inc = (id: string, d: number) => busy.set(id, (busy.get(id) ?? 0) + d)

/** Titles of a researcher's own papers, projects and patents, so the Writer can say what is new beyond them. */
function ownWork(researcherId: string): string {
	const ds = state().ds
	const r = ds.researchers.get(researcherId)!
	return [
		...r.publications.slice(0, 15).map((id) => `${id}: ${ds.publications.get(id)?.title ?? ""}`),
		...r.projects.map((id) => `${id}: ${ds.projects.get(id)?.title ?? ""}`),
		...r.patents.map((id) => `${id}: ${ds.patents.get(id)?.title ?? ""}`),
	].join("\n")
}

// ---------- schemas ----------

const evidenceList = { type: "array", items: { type: "string" } }

const researcherProfileSchema = {
	name: "researcher_profile",
	strict: true,
	schema: {
		type: "object",
		additionalProperties: false,
		required: ["summary", "expertise"],
		properties: {
			summary: { type: "string" },
			expertise: {
				type: "array",
				items: { type: "object", additionalProperties: false, required: ["topic", "evidence"], properties: { topic: { type: "string" }, evidence: evidenceList } },
			},
		},
	},
}

const companyProfileSchema = {
	name: "company_profile",
	strict: true,
	schema: {
		type: "object",
		additionalProperties: false,
		required: ["summary", "needs"],
		properties: {
			summary: { type: "string" },
			needs: {
				type: "array",
				items: { type: "object", additionalProperties: false, required: ["need", "evidence"], properties: { need: { type: "string" }, evidence: evidenceList } },
			},
		},
	},
}

const proposalSchema = {
	name: "proposal",
	strict: true,
	schema: {
		type: "object",
		additionalProperties: false,
		required: ["title", "problem", "research_questions", "plan", "company_brings", "faculty_brings", "why_this_pair", "novelty", "data_status", "baseline", "company_deadline", "risks", "first_step", "to_agree", "claims"],
		properties: {
			title: { type: "string" },
			problem: { type: "string" },
			research_questions: { type: "array", items: { type: "string" } },
			plan: {
				type: "array",
				items: {
					type: "object",
					additionalProperties: false,
					required: ["period", "owner", "work", "result", "pass_if"],
					properties: { period: { type: "string" }, owner: { type: "string" }, work: { type: "string" }, result: { type: "string" }, pass_if: { type: "string" } },
				},
			},
			company_brings: { type: "string" },
			faculty_brings: { type: "string" },
			why_this_pair: { type: "string" },
			novelty: { type: "string" },
			data_status: { type: "string" },
			baseline: { type: "string" },
			company_deadline: { type: "string" },
			risks: {
				type: "array",
				items: { type: "object", additionalProperties: false, required: ["risk", "stop_if"], properties: { risk: { type: "string" }, stop_if: { type: "string" } } },
			},
			first_step: { type: "string" },
			to_agree: { type: "string" },
			claims: {
				type: "array",
				items: {
					type: "object",
					additionalProperties: false,
					required: ["text", "about", "evidence"],
					properties: { text: { type: "string" }, about: { type: "string", enum: ["researcher", "company"] }, evidence: evidenceList },
				},
			},
		},
	},
}

// ---------- tools (read-only views of the dataset) ----------

const researcherEvidenceTool: Tool = {
	type: "function",
	name: "get_researcher_evidence",
	description: "Return a researcher's record with their publications, projects and patents, each with its dataset id.",
	parameters: { type: "object", additionalProperties: false, required: ["id"], properties: { id: { type: "string" } } },
	strict: true,
	invoke: async ({ id }: { id: string }) => {
		const ds = state().ds
		const r = ds.researchers.get(id)
		if (!r) return `No researcher ${id}`
		const pubs = r.publications.slice(0, 12).map((p) => ds.evidenceText(p)?.slice(0, 600))
		const prj = r.projects.map((p) => ds.evidenceText(p)?.slice(0, 400))
		const pat = r.patents.map((p) => ds.evidenceText(p)?.slice(0, 300))
		return [
			`${r.id} ${r.name}, ${r.title}, ${r.faculty}, ${r.department}`,
			`Fields: ${r.fields.join("; ")}`,
			`Keywords: ${r.keywords.join("; ")}`,
			`Bio: ${r.bio}`,
			`Industry experience: ${r.industry_experience}`,
			`Open to: ${r.open_to.join("; ")}`,
			"Publications:",
			...pubs,
			"Projects:",
			...prj,
			"Patents:",
			...pat,
		].join("\n")
	},
}

const challengeEvidenceTool: Tool = {
	type: "function",
	name: "get_challenge_evidence",
	description: "Return a company challenge with the company's record and its most relevant web pages.",
	parameters: { type: "object", additionalProperties: false, required: ["id"], properties: { id: { type: "string" } } },
	strict: true,
	invoke: async ({ id }: { id: string }) => {
		const ds = state().ds
		const hit = ds.challenges.get(id)
		if (!hit) return `No challenge ${id}`
		const { challenge, company } = hit
		const q = new Set(tokenize(`${challenge.text} ${challenge.detail}`))
		const pages = (ds.pagesByCompany.get(company.id) ?? [])
			.map((p) => ({ p, s: tokenize(p.text).filter((t) => q.has(t)).length }))
			.sort((a, b) => b.s - a.s)
			.slice(0, 3)
			.map(({ p }) => `[${p.kind}, ${p.date}] ${p.title}: ${p.text.slice(0, 700)}`)
		return [
			/^Q\d+$/.test(company.id) ? (ds.evidenceText(company.id) ?? company.name) : `${company.id} ${company.name}: ${company.sector}, ${company.employees} employees, ${company.location}`,
			`About: ${company.about}`,
			`Tech: ${company.tech.join("; ")}`,
			`Challenge ${challenge.id}: ${challenge.text}`,
			`Detail: ${challenge.detail}`,
			`R&D capacity: ${company.rd_capacity}`,
			`Past collaborations: ${company.past_collaborations}`,
			"Relevant pages:",
			...pages,
		].join("\n")
	},
}

// ---------- participants ----------

export type Team = {
	coordinator: Human
	screeners: Agent[]
	matchmaker: Human
	profilers: Agent[]
	analysts: Agent[]
	writers: Agent[]
	critic: Human
	auditor: Human
}

export function buildTeam(tracePath: string): Team {
	const screeners: Agent[] = []
	const profilers: Agent[] = []
	const analysts: Agent[] = []
	const writers: Agent[] = []

	// Coordinator: deals the shortlist out to Screeners, grouped by challenge.
	const coordinator = createHuman({
		name: "Coordinator",
		capabilities: ["dispatch"],
		handlers: [
			handler(["run.start"], false, (_p, self) => {
				const groups = new Map<string, any[]>()
				for (const c of state().candidates) groups.set(c.challengeId, [...(groups.get(c.challengeId) ?? []), c])
				let all = [...groups.values()]
				// One challenge (reverse search): split its candidates so every Screener has work.
				if (all.length < screeners.length) all = all.flatMap((g) => Array.from({ length: Math.ceil(g.length / 3) }, (_, i) => g.slice(i * 3, i * 3 + 3)))
				const shards = screeners.map(() => [] as any[][])
				all.forEach((g, i) => shards[i % screeners.length].push(g))
				shards.forEach((groupsForScreener, i) => emit("screen.batch", self.id, { assignee: screeners[i].getId(), groups: groupsForScreener }))
			}),
		],
	})

	// Screeners: Decisions API, one request per few challenges, one score question per pair.
	for (let i = 0; i < TUNING.screeners; i++) {
		const screener = createAgent({
			name: `Screener-${i + 1}`,
			capabilities: ["decisions"],
			instruction: "[role:screener] Score researcher-challenge fit with the Decisions API.",
			tools: [],
			handlers: [
				handler(["screen.batch"], true, async (p, self) => {
					const groups: any[][] = p.groups
					const name = `Screener-${i + 1}`
					for (let b = 0; b < groups.length; b += TUNING.screenBatch) {
						if (state().halted || state().finished) return
						const batch = groups.slice(b, b + TUNING.screenBatch)
						const jobId = `screen-${name}-${b / TUNING.screenBatch + 1}`
						const s = state()
						s.jobs.set(jobId, { jobId, agent: name, kind: "screen", startedAt: s.now(), status: "running" })
						emit("job.started", self.id, { jobId, agent: name, kind: "screen" })
						const blocks: string[] = []
						const questions: any[] = []
						for (const g of batch) {
							const { challenge, company } = s.ds.challenges.get(g[0].challengeId)!
							blocks.push(`### ${challenge.id}\nCompany ${company.name} (${company.sector}). Challenge: ${challenge.text}`)
							for (const c of g) {
								const r = s.ds.researchers.get(c.researcherId)!
								blocks.push(`### ${c.researcherId}\n${r.name}, ${r.department}. Fields: ${r.fields.join("; ")}. Keywords: ${r.keywords.join("; ")}.`)
								questions.push({
									type: "score",
									name: pairKey(c),
									instructions: `How well can researcher [[${c.researcherId}]] help with company challenge ${challenge.id}? Judge only the expertise match to this specific challenge: ${challenge.text}`,
									levels: [
										{ label: "none", description: "unrelated field" },
										{ label: "weak", description: "same broad area, different problem" },
										{ label: "plausible", description: "methods apply with adaptation" },
										{ label: "strong", description: "directly works on this kind of problem" },
									],
								})
							}
						}
						try {
							const answers = await decider.decide(blocks.join("\n\n"), questions)
							for (const a of answers) {
								if (a.type !== "score") continue
								const c = s.candidates.find((x) => pairKey(x) === a.name)
								if (!c) continue
								const scr: Screened = { ...c, score: a.score, confidence: a.confidence, screener: name }
								s.screened.set(a.name, scr)
								s.screeningDone += 1
								emit("pair.screened", self.id, { key: a.name, score: a.score, confidence: a.confidence })
							}
							const j = s.jobs.get(jobId)!
							j.finishedAt = s.now()
							j.status = "done"
						} catch (e: any) {
							const j = s.jobs.get(jobId)!
							j.finishedAt = s.now()
							j.status = "failed"
							console.log(`[${name}] decisions failed: ${e?.message ?? e}`)
							s.screeningDone += batch.reduce((n, g) => n + g.length, 0)
						}
						emit("job.finished", self.id, { jobId, agent: name, kind: "screen", status: s.jobs.get(jobId)!.status })
						emit("screen.progress", self.id, { done: s.screeningDone, total: s.candidates.length })
					}
				}),
			],
		})
		screeners.push(screener)
	}

	// Matchmaker: selects pairs as scores stream in. Diversity rule: a researcher or company appears once.
	const select = (self: { id: string }, c: Screened) => {
		const s = state()
		if (s.selected.size >= TUNING.proposals) return
		if (s.usedResearchers.has(c.researcherId) || (!s.reverse && s.usedCompanies.has(c.companyId))) return
		s.usedResearchers.add(c.researcherId)
		s.usedCompanies.add(c.companyId)
		const key = pairKey(c)
		const profiler = leastBusy(profilers.map((a) => a.getId()))
		const analyst = leastBusy(analysts.map((a) => a.getId()))
		inc(profiler, 1)
		inc(analyst, 1)
		const consent = proposalForm(s.ds.researchers.get(c.researcherId)!)!
		const sel: Selection = { ...c, key, selectedAt: s.now(), profiler, analyst, status: "profiling", form: consent.form, consent: consent.wording }
		s.selected.set(key, sel)
		emit("pair.selected", self.id, { key, score: c.score, screener: c.screener })
		if (!s.researcherProfiles.has(c.researcherId) && !s.profileInFlight.has(c.researcherId)) {
			s.profileInFlight.add(c.researcherId)
			emit("profile.requested", self.id, { assignee: profiler, kind: "researcher", id: c.researcherId })
		}
		if (!s.companyProfiles.has(c.challengeId) && !s.profileInFlight.has(c.challengeId)) {
			s.profileInFlight.add(c.challengeId)
			emit("profile.requested", self.id, { assignee: analyst, kind: "company", id: c.challengeId })
		}
	}

	const matchmaker = createHuman({
		name: "Matchmaker",
		capabilities: ["select", "assign"],
		handlers: [
			handler(["pair.screened"], false, (p, self) => {
				const c = state().screened.get(p.key)
				if (c && c.score >= TUNING.selectThreshold) select(self, c)
			}),
			handler(["screen.progress"], false, (p, self) => {
				// Screening finished without enough early picks: take the best remaining pairs.
				if (p.done < p.total) return
				const rest = [...state().screened.values()].sort((a, b) => b.score - a.score)
				for (const c of rest) select(self, c)
				if (state().selected.size === 0) emit("run.nothing_selected", self.id, {})
			}),
			handler(["profile.ready"], false, (_p, self) => {
				const s = state()
				for (const sel of s.selected.values()) {
					if (sel.status !== "profiling") continue
					if (!s.researcherProfiles.has(sel.researcherId) || !s.companyProfiles.has(sel.challengeId)) continue
					sel.status = "writing"
					sel.writer = leastBusy(writers.map((a) => a.getId()))
					inc(sel.writer, 1)
					emit("proposal.requested", self.id, { assignee: sel.writer, key: sel.key })
				}
			}),
		],
	})

	for (let i = 0; i < TUNING.profilers; i++) {
		profilers.push(
			createAgent({
				name: `Profiler-${i + 1}`,
				capabilities: ["research-profile"],
				instruction:
					"[role:profiler] You profile a university researcher for possible industry collaboration. Call get_researcher_evidence first. " +
					"Then return 3 to 5 areas of demonstrated expertise. Every area must cite the dataset ids (publications SYN-PUB-*, projects SYN-PRJ-*, patents SYN-PAT-*) that show it, " +
					"taken only from the tool output. Never invent ids, papers or skills. Describe expertise, never judge the person's worth.",
				tools: [researcherEvidenceTool],
				handlers: [],
			}),
		)
	}
	for (let i = 0; i < TUNING.analysts; i++) {
		analysts.push(
			createAgent({
				name: `Analyst-${i + 1}`,
				capabilities: ["industry-profile"],
				instruction:
					"[role:analyst] You analyse one company challenge. Call get_challenge_evidence first. Return a short summary of the company and 2 to 4 concrete technical needs. " +
					"Every need must cite the challenge id or company id it comes from, taken only from the tool output. Never invent facts.",
				tools: [challengeEvidenceTool],
				handlers: [],
			}),
		)
	}
	for (let i = 0; i < TUNING.writers; i++) {
		writers.push(
			createAgent({
				name: `Writer-${i + 1}`,
				capabilities: ["proposal"],
				instruction:
					"[role:writer] You write a one-page collaboration proposal for one researcher-company pair, in the shape of a good industrial PhD topic. " +
					"The FORM (industrial PhD, joint research project or contract research) is given to you from the researcher's own consent: write exactly that form, never a different one. " +
					"Only an industrial PhD has a doctoral candidate and a faculty PhD supervisor; a joint project or contract research names a project lead on each side instead. " +
					"Sections: the concrete problem; 2 to 3 measurable research questions; a plan in periods (Year 1 to 3 for a PhD, months for a project); what each side brings; why this pair; " +
					"`novelty`: what is new beyond the researcher's own published work listed to you (name the closest of their papers and cite it in claims); " +
					"`data_status`: what data the records say exists today, and what would have to be collected (never call data available unless a record says so); " +
					"a first step for next month; `to_agree`: what still has to be agreed (funding and who pays for the candidate or staff time, IP in new results and background IP, publication delay, data access). " +
					"Every plan period has a `pass_if`: a measurable pass or fail target, and an `owner`: who delivers it (a role such as 'company engineer', 'doctoral candidate' or 'faculty supervisor', or a person named in the records). Targets are proposals, not facts. " +
					"Plan periods follow on with no gap in time (for example 'Months 1 to 6', 'Months 7 to 12', 'Year 2', 'Year 3'). " +
					"`baseline`: what the pass targets are compared against: how the company does this today and its own figures, from the records (cite them in claims); if the records give no figure, say so and make measuring it part of the first period. " +
					"`risks`: 2 to 4 real risks of this collaboration (data access, transfer to the company's platform, staff time, results not beating the baseline), each with `stop_if`: a concrete point at which the work should stop or be rescoped. " +
					"Be as specific as the example: use the company's own numbers and constraints from the challenge text. " +
					"Commit only the company staff, time, equipment and data the records offer, with their own limits (for example 'up to three months'); if the plan needs more, put it in `to_agree`. " +
					"You are told today's date: never plan work for a date that has passed; if the company names a deadline that is already past, say so and plan for the next cycle. " +
					"`company_deadline`: the time limit the company states for a result, copied word for word from the challenge text, or exactly 'none stated'. If that limit is shorter than the plan's first period, " +
					"start the plan with a period in months (for example 'Months 1 to 6') that delivers what the company asked for by then; an industrial PhD then continues to Year 3, so the whole plan still covers about three years. Never push the company's result past its own limit. " +
					"If the faculty's lab equipment, platform or toolchain differs from what the company records list (for example a different PLC vendor), add an explicit step that checks transfer to the company's own platform before any result is claimed for it. " +
					"For safety-related changes, nothing runs on a live installation until the company's own safety review approves it. " +
					"In the proposal text, refer to people and companies by name, never by their dataset id (ids belong only in `claims`). Name only people who appear in the records given to you. Do not attach a job title or role to a named person unless the same record explicitly links that person to that role; keep separately stated company roles separate from named people. " +
					LANG_RULE +
					"List every factual statement about either party in `claims` with the dataset id of the record that states it: " +
					"(only facts a record states about the researcher or the company; never statements about this proposal itself, such as its form, its dates or its structure) " +
					"company size, location, sector, products or capacity -> the company id (e.g. C003); the company's problem -> the challenge id (e.g. C003-CH2); " +
					"a researcher's title, department or role -> the researcher id (e.g. R0995); a researcher's expertise -> their publication, project or patent ids. Use only ids given to you. " +
					"Every figure that appears in the title, problem, what each side brings, why this pair, novelty or data status must also appear in one of your claims. " +
					"Propose a collaboration; never rank or grade people. If a Critic sends the draft back, fix exactly what it lists.",
				tools: [],
				handlers: [],
			}),
		)
	}

	// Critic: owns the review function every Writer job runs through (InterceptionHandler on model_message).
	const critic = createHuman({ name: "Critic", capabilities: ["verify"], handlers: [] })

	async function review(key: string, text: string, attempt: number) {
		const s = state()
		const sel = s.selected.get(key)!
		const proposal = parseJson<Proposal>(text)
		emit("critic.review.started", critic.getId(), { key, attempt, claims: proposal.claims?.length ?? 0 })
		const pair = { researcherId: sel.researcherId, companyId: sel.companyId }
		proposal.form = sel.form
		const claims: Claim[] = proposal.claims ?? []
		// Two checks: the listed claims against their records, and the text against the claims (verify/coverage.ts).
		const prose: ClaimCheck[] = checkProse(s.ds, { ...pair, challengeId: sel.challengeId }, proposal as any, TODAY).map((i) => ({
			claim: i.excerpt ? `[${i.field}] ${i.excerpt}` : `[${i.field}]`,
			evidence: [],
			deterministic: [i.why],
			supported: false,
			kind: "prose" as const,
		}))
		const checks: ClaimCheck[] = [...(await checkClaims(s.ds, pair, claims)), ...prose]
		const failed = checks.filter((c) => !c.supported)
		const rec = s.proposals.get(key) ?? { key, attempts: [] }
		s.proposals.set(key, rec)
		const canRevise = attempt <= TUNING.maxRevisions
		const verdict: "approve" | "revise" | "reject" = failed.length === 0 ? "approve" : canRevise ? "revise" : "reject"
		rec.attempts.push({ attempt, proposal, checks, verdict })
		emit("critic.verdict", critic.getId(), {
			key,
			attempt,
			verdict: CRITIC_ENFORCES ? verdict : "approve",
			wouldHave: verdict,
			blocked: failed.map((f) => ({ claim: f.claim.slice(0, 120), evidence: f.evidence, why: f.deterministic[0] ?? `support ${f.support}` })),
		})
		if (!CRITIC_ENFORCES) {
			rec.final = proposal
			rec.verdict = "shipped_unchecked"
			return { accept: true as const }
		}
		if (verdict === "approve") {
			rec.final = proposal
			rec.verdict = "approved"
			return { accept: true as const }
		}
		if (verdict === "reject") {
			rec.verdict = "rejected"
			return { accept: true as const } // end the loop; recorded as rejected, never released as a proposal
		}
		const bad = failed.filter((f) => f.kind !== "prose")
		const lines = bad.map((f, n) => `${n + 1}. "${f.claim}" cites ${f.evidence.join(", ") || "nothing"}: ${f.deterministic[0] ?? `the cited record does not support it (p=${f.support})`}`)
		const proseLines = failed.filter((f) => f.kind === "prose").map((f, n) => `${n + 1}. ${f.deterministic[0]}${f.claim.includes("]") && f.claim.length > 12 ? `: ${f.claim}` : ""}`)
		return {
			accept: false as const,
			correction:
				`CRITIC: revise the proposal.\n` +
				(lines.length ? `These claims are not supported by the records they cite:\n${lines.join("\n")}\n` : "") +
				(proseLines.length ? `These problems are in the proposal text itself:\n${proseLines.join("\n")}\nEvery figure and person in the text needs a claim with its source; otherwise remove it.\n` : "") +
				`If a claim is true, re-cite the record that actually states it (company facts: ${sel.companyId}; the problem: ${sel.challengeId}; the researcher's role: ${sel.researcherId}; expertise: their publication/project/patent ids). ` +
				`If no record states it, remove it. Return the full corrected proposal.`,
		}
	}

	// Wire job-running behaviour onto the LLM agents.
	for (const p of profilers) {
		p.setHandlers([
			handler(["profile.requested"], true, (pl, self) => {
				if (pl.kind !== "researcher") return
				runJob({
					jobId: `profile-${pl.id}`,
					kind: "profile_researcher",
					agent: p,
					model: MODELS.profiler,
					message: `TARGET: ${pl.id}\nProfile researcher ${pl.id}.`,
					tools: p.getTools(),
					structuredOutput: researcherProfileSchema,
					review: async (text) => {
						const prof = parseJson<Omit<ResearcherProfile, "researcherId">>(text)
						const ds = state().ds
						// Keep only expertise backed by this researcher's own records.
						prof.expertise = prof.expertise
							.map((e) => ({ ...e, evidence: e.evidence.filter((id) => ds.belongsToResearcher(id, pl.id)) }))
							.filter((e) => e.evidence.length)
						state().researcherProfiles.set(pl.id, { researcherId: pl.id, ...prof })
						return { accept: true }
					},
					done: (status) => {
						inc(self.id, -1)
						state().profileInFlight.delete(pl.id)
						emit("profile.ready", self.id, { kind: "researcher", id: pl.id, status })
					},
				})
			}),
		])
	}
	for (const a of analysts) {
		a.setHandlers([
			handler(["profile.requested"], true, (pl, self) => {
				if (pl.kind !== "company") return
				runJob({
					jobId: `profile-${pl.id}`,
					kind: "profile_company",
					agent: a,
					model: MODELS.analyst,
					message: `TARGET: ${pl.id}\nAnalyse company challenge ${pl.id}.`,
					tools: a.getTools(),
					structuredOutput: companyProfileSchema,
					review: async (text) => {
						const prof = parseJson<Omit<CompanyProfile, "challengeId" | "companyId">>(text)
						const ds = state().ds
						const companyId = ds.challenges.get(pl.id)!.company.id
						prof.needs = prof.needs.map((n) => ({ ...n, evidence: n.evidence.filter((id) => ds.belongsToCompany(id, companyId)) })).filter((n) => n.evidence.length)
						state().companyProfiles.set(pl.id, { challengeId: pl.id, companyId, ...prof })
						return { accept: true }
					},
					done: (status) => {
						inc(self.id, -1)
						state().profileInFlight.delete(pl.id)
						emit("profile.ready", self.id, { kind: "company", id: pl.id, status })
					},
				})
			}),
		])
	}
	for (const w of writers) {
		w.setHandlers([
			handler(["proposal.requested"], true, (pl, self) => {
				const s = state()
				const sel = s.selected.get(pl.key)!
				const rp = s.researcherProfiles.get(sel.researcherId)!
				const cp = s.companyProfiles.get(sel.challengeId)!
				runJob({
					jobId: `write-${pl.key}`,
					kind: "write",
					agent: w,
					model: MODELS.writer,
					message:
						`TARGET: ${pl.key}\nToday is ${TODAY.toISOString().slice(0, 10)}.\n` +
						`FORM: ${FORM_LABEL[sel.form]}. The researcher's consent, in their own words: "${sel.consent}". Respect any condition in it.\n` +
						`Researcher's own published work (for novelty):\n${ownWork(sel.researcherId)}\n\n` +
						`Researcher ${sel.researcherId}:\n${s.ds.evidenceText(sel.researcherId)}\nResearcher profile (cited):\n${JSON.stringify(rp)}\n\n` +
						`Company ${sel.companyId}:\n${s.ds.evidenceText(sel.companyId)}\nChallenge ${sel.challengeId}:\n${s.ds.evidenceText(sel.challengeId)}\n` +
						`Company challenge profile (cited):\n${JSON.stringify(cp)}\n\nWrite the proposal.`,
					structuredOutput: proposalSchema,
					review: (text, attempt) => review(pl.key, text, attempt),
					done: (status) => {
						inc(self.id, -1)
						sel.status = "done"
						emit("proposal.finished", self.id, { key: pl.key, status, verdict: s.proposals.get(pl.key)?.verdict })
					},
				})
			}),
		])
	}

	// Auditor: every event to the trace; meters LLM spend from inference.completed.
	const names = new Map<string, string>()
	const modelOf = (name: string) => (name.startsWith("Writer") ? MODELS.writer : name.startsWith("Analyst") ? MODELS.analyst : MODELS.profiler)
	const auditor = createHuman({
		name: "Auditor",
		capabilities: ["trace"],
		handlers: [
			{
				specification: new (class extends SituationSpecification {
					isSatisfiedBy() {
						return true
					}
				})(),
				processor: {
					apply({ event }) {
						const s = state()
						const p: any = event.payload
						if (event.type === "participant.joined") names.set(p.id, p.name)
						const who = names.get(event.producerId) ?? event.producerId
						if (event.type === "inference.completed" && p?.tokenUsage) s.charge(modelOf(who), p.tokenUsage.inputTokens, p.tokenUsage.outputTokens)
						const keep = !["inference.stream", "context_update.started"].includes(event.type)
						if (!keep) return
						const slim =
							event.type.startsWith("inference.") || event.type.startsWith("message_received") || event.type.startsWith("function_call") || event.type.startsWith("interception") || event.type === "model.answer"
								? { loopId: p?.loopId }
								: p
						appendFileSync(tracePath, JSON.stringify({ t: s.now(), type: event.type, by: who, ...(slim ? { data: slim } : {}) }) + "\n")
					},
				},
			},
		],
	})

	return { coordinator, screeners, matchmaker, profilers, analysts, writers, critic, auditor }
}
