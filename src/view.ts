// Builds the one JSON shape the web UI reads, for any recorded run.
// New runs carry run.json; the first four live runs (recorded before run.json existed) are
// rebuilt from their trace, summary and proposals.md, so every run replays the same way.
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import type { Dataset } from "./data/dataset"

export type ViewClaim = { claim: string; evidence: string[]; support: number | null; supported: boolean; deterministic?: string[] }
export type ViewProposal = {
	key: string
	verdict: string
	drafts: number
	score: number | null
	researcherId: string
	researcher: string
	researcherTitle: string
	department: string
	companyId: string
	company: string
	challengeId: string
	title: string
	problem: string
	research_questions: string[]
	plan: { year: number | string; work: string; result: string }[]
	company_brings: string
	faculty_brings: string
	why_this_pair: string
	first_step: string
	claims: ViewClaim[]
	attempts: { attempt: number; verdict: string; blocked: { claim: string; evidence: string[]; why: string }[] }[]
}
export type ViewCandidate = { key: string; researcherId: string; researcher: string; title: string; department: string; challengeId: string; companyId: string; company: string; retrieval?: number }
export type RunView = {
	id: string
	live: boolean
	criticEnforcing: boolean
	reverse: boolean
	input: { company: string; problem: string } | null
	wallClockMs: number
	spendUsd: number
	budgetUsd: number
	models: Record<string, string>
	concurrency: { jobs: number; peakInFlight: number; peakAtMs: number; inFlightAtPeak: string[]; jobsOverlappingAnotherAgent: number }
	critic: { drafts: number; revisionsRequested: number; claimsChecked: number; claimsBlocked: number; unsupportedClaimsInFinalProposals: number }
	shortlist: { pairs: number; challenges: number }
	candidates: ViewCandidate[]
	jobs: { jobId: string; agent: string; kind: string; startedAt: number; finishedAt: number; status: string }[]
	proposals: ViewProposal[]
	trace: { t: number; type: string; by: string; data: any }[]
}

function section(md: string, name: string): string {
	const m = md.match(new RegExp(`### ${name}\\n([\\s\\S]*?)(?=\\n### |$)`))
	return m ? m[1].trim() : ""
}

/** Parse one "## title" block of proposals.md (legacy runs only). */
function parseLegacyProposal(block: string) {
	const title = block.split("\n")[0].trim()
	const plan = section(block, "Plan")
		.split("\n")
		.filter((l) => /^\| \d/.test(l))
		.map((l) => {
			const [year, work, result] = l.trim().slice(1, -1).split("|").map((x) => x.trim())
			return { year: Number(year), work, result }
		})
	const brings = section(block, "What each side brings")
	return {
		title,
		problem: section(block, "The problem"),
		research_questions: section(block, "Research questions")
			.split("\n")
			.filter((l) => /^\d+\./.test(l))
			.map((l) => l.replace(/^\d+\.\s*/, "")),
		plan,
		company_brings: (brings.match(/- \*\*Company:\*\* ([\s\S]*?)(?=\n- \*\*Faculty|$)/) ?? [])[1]?.trim() ?? "",
		faculty_brings: (brings.match(/- \*\*Faculty:\*\* ([\s\S]*)$/) ?? [])[1]?.trim() ?? "",
		why_this_pair: section(block, "Why this pair"),
		first_step: section(block, "First step"),
		claims: [...block.matchAll(/^- (supported|NOT supported)(?: \(p=([\d.]+)\))?: (.+) \[([^\]]+)\]$/gm)].map((m) => ({
			claim: m[3],
			evidence: m[4].split(",").map((x) => x.trim()),
			support: m[2] !== undefined ? Number(m[2]) : null,
			supported: m[1] === "supported",
		})),
		key: (() => {
			const p = block.match(/\*\*Pair:\*\*.*?\((R\d+),.*?challenge ([\w-]+)/)
			return p ? `${p[1]}x${p[2]}` : title
		})(),
	}
}

export function buildView(ds: Dataset, id: string, dir: string): RunView {
	const trace = readFileSync(join(dir, "trace.jsonl"), "utf-8")
		.split("\n")
		.filter(Boolean)
		.map((l) => JSON.parse(l))
	const runJson = existsSync(join(dir, "run.json")) ? JSON.parse(readFileSync(join(dir, "run.json"), "utf-8")) : null
	const summary = runJson?.summary ?? JSON.parse(readFileSync(join(dir, "summary.json"), "utf-8"))
	const input = existsSync(join(dir, "input.json")) ? JSON.parse(readFileSync(join(dir, "input.json"), "utf-8")) : null
	const reverse = !!runJson?.reverse || !!input

	const companyName = (cid: string) => (cid.startsWith("Q") ? (input?.company ?? "Your company") : (ds.companies.get(cid)?.name ?? cid))
	const candidate = (researcherId: string, challengeId: string, companyId: string, retrieval?: number): ViewCandidate => {
		const r = ds.researchers.get(researcherId)
		return { key: `${researcherId}x${challengeId}`, researcherId, researcher: r?.name ?? researcherId, title: r?.title ?? "", department: r?.department ?? "", challengeId, companyId, company: companyName(companyId), retrieval }
	}
	// Candidates: every pair handed to a Screener.
	const candidates: ViewCandidate[] = trace
		.filter((e) => e.type === "screen.batch")
		.flatMap((e) => e.data.groups.flat())
		.map((c: any) => candidate(c.researcherId, c.challengeId, c.companyId, c.retrievalScore))

	// Jobs from the trace (identical to what the report measured).
	const open = new Map<string, any>()
	const jobs: RunView["jobs"] = []
	for (const e of trace) {
		if (e.type === "job.started") open.set(e.data.jobId, { jobId: e.data.jobId, agent: e.data.agent, kind: e.data.kind, startedAt: e.t })
		if (e.type === "job.finished" && open.has(e.data.jobId)) {
			jobs.push({ ...open.get(e.data.jobId), finishedAt: e.t, status: e.data.status })
			open.delete(e.data.jobId)
		}
	}

	const verdicts = trace.filter((e) => e.type === "critic.verdict").map((e) => e.data)
	const attemptsFor = (key: string) => verdicts.filter((v) => v.key === key).map((v) => ({ attempt: v.attempt, verdict: v.verdict, blocked: v.blocked ?? [] }))
	const selectedScore = new Map<string, number>(summary.selected.map((s: any) => [s.key, s.score]))
	const outcome = new Map<string, any>(summary.critic_record.outcomes.map((o: any) => [o.key, o]))

	let raw: any[]
	if (runJson) {
		raw = runJson.proposals.map((r: any) => {
			const p = r.final ?? r.attempts[r.attempts.length - 1]?.proposal ?? {}
			const last = r.attempts[r.attempts.length - 1]
			return { ...p, key: r.key, claims: (last?.checks ?? []).map((c: any) => ({ claim: c.claim, evidence: c.evidence, support: c.support ?? null, supported: c.supported, deterministic: c.deterministic })) }
		})
	} else {
		const md = readFileSync(join(dir, "proposals.md"), "utf-8")
		raw = md.split(/^## /m).slice(1).map(parseLegacyProposal)
	}

	const proposals: ViewProposal[] = raw.map((p) => {
		const [rid, chid] = p.key.split("x")
		const companyId = ds.challenges.get(chid)?.company.id ?? (chid.startsWith("Q") ? "Q001" : chid.split("-")[0])
		const c = candidate(rid, chid, companyId)
		const o = outcome.get(p.key)
		return {
			key: p.key,
			verdict: o?.verdict ?? "unknown",
			drafts: o?.drafts ?? 1,
			score: selectedScore.get(p.key) ?? null,
			researcherId: rid,
			researcher: c.researcher,
			researcherTitle: c.title,
			department: c.department,
			companyId,
			company: c.company,
			challengeId: chid,
			title: p.title ?? p.key,
			problem: p.problem ?? "",
			research_questions: p.research_questions ?? [],
			plan: p.plan ?? [],
			company_brings: p.company_brings ?? "",
			faculty_brings: p.faculty_brings ?? "",
			why_this_pair: p.why_this_pair ?? "",
			first_step: p.first_step ?? "",
			claims: p.claims ?? [],
			attempts: attemptsFor(p.key),
		}
	})

	return {
		id,
		live: summary.mode === "live",
		criticEnforcing: summary.critic === "enforcing",
		reverse,
		input,
		wallClockMs: summary.wallClockMs,
		spendUsd: summary.spend.usd,
		budgetUsd: summary.spend.budgetUsd,
		models: summary.models,
		concurrency: summary.concurrency,
		critic: summary.critic_record,
		shortlist: summary.shortlist,
		candidates,
		jobs,
		proposals,
		trace: trace.filter((e) => !["message_received.started", "message_received.completed", "participant.joined"].includes(e.type)),
	}
}
