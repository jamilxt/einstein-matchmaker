// Turns the final shared state into the artifacts judges read: summary numbers, a per-agent
// timeline with measured overlap, the Critic's record, and the proposals with their sources.
import { writeFileSync } from "node:fs"
import { join } from "node:path"
import { BUDGET_USD, CRITIC_ENFORCES, MODELS, TUNING } from "./config"
import { state } from "./runtime"
import { FORM_LABEL } from "./data/consent"

export function writeReport(runDir: string, live: boolean) {
	const s = state()
	const jobs = [...s.jobs.values()].filter((j) => j.finishedAt !== undefined)

	// Peak concurrency from job start/finish times.
	const edges = jobs.flatMap((j) => [
		{ t: j.startedAt, d: 1 },
		{ t: j.finishedAt!, d: -1 },
	])
	edges.sort((a, b) => a.t - b.t || a.d - b.d)
	let cur = 0
	let peak = 0
	let peakAt = 0
	for (const e of edges) {
		cur += e.d
		if (cur > peak) {
			peak = cur
			peakAt = e.t
		}
	}
	const inFlightAtPeak = jobs.filter((j) => j.startedAt <= peakAt && j.finishedAt! > peakAt).map((j) => `${j.agent}:${j.kind}`)
	const overlapping = jobs.filter((a) => jobs.some((b) => b !== a && b.agent !== a.agent && a.startedAt < b.finishedAt! && b.startedAt < a.finishedAt!)).length

	const recs = [...s.proposals.values()]
	const attempts = recs.flatMap((r) => r.attempts)
	const blockedClaims = attempts.flatMap((a) => a.checks.filter((c) => !c.supported && c.kind !== "prose"))
	const proseIssues = attempts.flatMap((a) => a.checks.filter((c) => !c.supported && c.kind === "prose"))
	const shippedUnsupported = recs
		.filter((r) => r.final)
		.flatMap((r) => r.attempts[r.attempts.length - 1].checks.filter((c) => !c.supported))

	const summary = {
		runId: s.runId,
		mode: live ? "live" : "stub",
		critic: CRITIC_ENFORCES ? "enforcing" : "off (ablation: checks recorded, nothing blocked)",
		models: MODELS,
		wallClockMs: s.now(),
		shortlist: { pairs: s.candidates.length, challenges: new Set(s.candidates.map((c) => c.challengeId)).size },
		screened: s.screened.size,
		selected: [...s.selected.values()].map((x) => ({ key: x.key, score: x.score, screener: x.screener, selectedAtMs: x.selectedAt })),
		concurrency: { jobs: jobs.length, peakInFlight: peak, peakAtMs: peakAt, inFlightAtPeak, jobsOverlappingAnotherAgent: overlapping },
		critic_record: {
			drafts: attempts.length,
			revisionsRequested: attempts.filter((a) => a.verdict === "revise").length,
			claimsChecked: attempts.reduce((n, a) => n + a.checks.length, 0),
			claimsBlocked: blockedClaims.length,
			proseIssuesBlocked: proseIssues.length,
			rejected: recs.filter((r) => r.verdict === "rejected").length,
			unsupportedClaimsInFinalProposals: shippedUnsupported.length,
			outcomes: recs.map((r) => ({ key: r.key, verdict: r.verdict, drafts: r.attempts.length })),
		},
		spend: {
			usd: Number(s.spend.usd.toFixed(5)),
			budgetUsd: BUDGET_USD,
			halted: s.halted,
			byModel: s.spend.byModel,
			note: live ? "metered from API-reported token usage" : "STUB run: estimated tokens at list price, nothing was spent",
		},
		tuning: TUNING,
	}

	// Timeline: one lane per agent, jobs as bars.
	const width = 72
	const total = Math.max(1, s.now())
	const lanes = new Map<string, string[]>()
	for (const j of jobs) {
		const lane = lanes.get(j.agent) ?? Array(width).fill(" ")
		const a = Math.floor((j.startedAt / total) * width)
		const b = Math.max(a + 1, Math.ceil((j.finishedAt! / total) * width))
		const ch = j.kind === "screen" ? "s" : j.kind === "write" ? "W" : "p"
		for (let x = a; x < Math.min(b, width); x++) lane[x] = ch
		lanes.set(j.agent, lane)
	}
	const timeline = [...lanes.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([agent, lane]) => `${agent.padEnd(12)} |${lane.join("")}|`)
	timeline.push(`${"".padEnd(12)}  0${"".padEnd(width - 8)}${(total / 1000).toFixed(1)}s`)
	timeline.push("s = Decisions screening, p = profiling (LLM + tool), W = writing (LLM, Critic-gated)")

	// Proposals with their sources.
	const md: string[] = [`# Proposals (${live ? "live run" : "STUB run: placeholder text, real dataset ids"})`, ""]
	for (const r of recs) {
		const sel = s.selected.get(r.key)!
		const researcher = s.ds.researchers.get(sel.researcherId)!
		const { company, challenge } = s.ds.challenges.get(sel.challengeId)!
		// Only an approved (or, in the ablation, unchecked) proposal is released. A rejected draft is not.
		const p = r.final
		const last = r.attempts[r.attempts.length - 1]
		md.push(`## ${p?.title ?? `Not released: ${researcher.name} with ${company.name}`}`, "")
		md.push(`**Pair:** ${researcher.name} (${researcher.id}, ${researcher.department}) with ${company.name} (${company.id}), challenge ${challenge.id}`)
		md.push(`**Form:** ${FORM_LABEL[sel.form]}, from the researcher's consent: "${sel.consent}"`)
		md.push(`**Critic:** ${r.verdict} after ${r.attempts.length} draft(s). Screening score ${sel.score.toFixed(2)} / 3.`, "")
		if (!p) {
			if (last) md.push("The Critic rejected the last draft, so no proposal was released. What it still found:", ...last.checks.filter((c) => !c.supported).map((c) => `- ${c.claim}: ${c.deterministic[0] ?? `support ${c.support}`}`), "")
			continue
		}
		md.push(`### The problem`, p.problem, "", `### Research questions`, ...p.research_questions.map((q, i) => `${i + 1}. ${q}`), "")
		md.push(`### Plan`, ...(p.plan.some((x) => x.owner) ? ["| Period | Owner | Work | Result | Pass if |", "| --- | --- | --- | --- | --- |", ...p.plan.map((x) => `| ${x.period ?? `Year ${x.year}`} | ${x.owner ?? ""} | ${x.work} | ${x.result} | ${x.pass_if ?? ""} |`)] : ["| Period | Work | Result | Pass if |", "| --- | --- | --- | --- |", ...p.plan.map((x) => `| ${x.period ?? `Year ${x.year}`} | ${x.work} | ${x.result} | ${x.pass_if ?? ""} |`)]), "")
		md.push(`### What each side brings`, `- **Company:** ${p.company_brings}`, `- **Faculty:** ${p.faculty_brings}`, "")
		md.push(`### Why this pair`, p.why_this_pair, "")
		if (p.novelty) md.push(`### What is new`, p.novelty, "")
		if (p.data_status) md.push(`### Data: what exists and what to collect`, p.data_status, "")
		if (p.baseline) md.push(`### Baseline: what the targets are compared against`, p.baseline, "")
		if (p.company_deadline) md.push(`### The company's time limit`, p.company_deadline, "")
		if (p.risks?.length) md.push(`### Risks and when to stop`, ...p.risks.map((r) => `- **${r.risk}** Stop if: ${r.stop_if}`), "")
		md.push(`### First step`, p.first_step, "")
		if (p.to_agree) md.push(`### Still to agree`, p.to_agree, "")
		md.push(`### Claims and sources`)
		for (const c of last.checks.filter((c) => c.kind !== "prose")) md.push(`- ${c.supported ? "supported" : "NOT supported"}${c.support !== undefined ? ` (p=${c.support})` : ""}: ${c.claim} [${c.evidence.join(", ")}]`)
		md.push("")
	}

	writeFileSync(join(runDir, "proposals.md"), md.join("\n"))
	const name = (id: string) => s.ds.researchers.get(id)
	writeFileSync(
		join(runDir, "run.json"),
		JSON.stringify(
			{
				summary,
				reverse: s.reverse,
				candidates: s.candidates.map((c) => {
					const r = name(c.researcherId)!
					const sc = s.screened.get(`${c.researcherId}x${c.challengeId}`)
					return { key: `${c.researcherId}x${c.challengeId}`, researcherId: c.researcherId, researcher: r.name, title: r.title, department: r.department, challengeId: c.challengeId, companyId: c.companyId, company: s.ds.companies.get(c.companyId)?.name, score: sc?.score ?? null }
				}),
				selected: [...s.selected.values()],
				researcherProfiles: Object.fromEntries(s.researcherProfiles),
				companyProfiles: Object.fromEntries(s.companyProfiles),
				proposals: recs.map((r) => ({ ...r, pair: s.selected.get(r.key) })),
				jobs: jobs,
			},
			null,
			1,
		),
	)
	writeFileSync(join(runDir, "timeline.txt"), timeline.join("\n") + "\n")

	console.log("\n" + timeline.join("\n"))
	console.log(
		`\npeak in flight: ${peak} jobs at ${(peakAt / 1000).toFixed(1)}s (${inFlightAtPeak.join(", ")})` +
			`\njobs overlapping another agent: ${overlapping}/${jobs.length}` +
			(CRITIC_ENFORCES
				? `\ncritic: ${summary.critic_record.drafts} drafts, ${summary.critic_record.revisionsRequested} sent back, ${summary.critic_record.claimsBlocked} claims blocked, ${proseIssues.length} text problems blocked, ${summary.critic_record.rejected} rejected, `
				: `\ncritic OFF (ablation): ${summary.critic_record.drafts} drafts, would have sent back ${summary.critic_record.revisionsRequested}, flagged ${summary.critic_record.claimsBlocked} claims but blocked none, `) +
			`${summary.critic_record.unsupportedClaimsInFinalProposals} unsupported claims in final proposals` +
			`\nspend: $${summary.spend.usd} (${summary.spend.note})`,
	)
	return summary
}
