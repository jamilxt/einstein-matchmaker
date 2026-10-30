// Turns the final shared state into the artifacts judges read: summary numbers, a per-agent
// timeline with measured overlap, the Critic's record, and the proposals with their sources.
import { writeFileSync } from "node:fs"
import { join } from "node:path"
import { BUDGET_USD, CRITIC_ENFORCES, MODELS, TUNING } from "./config"
import { state } from "./runtime"

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
	const blockedClaims = attempts.flatMap((a) => a.checks.filter((c) => !c.supported))
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
		const p = r.final ?? r.attempts[r.attempts.length - 1]?.proposal
		md.push(`## ${p?.title ?? r.key}`, "")
		md.push(`**Pair:** ${researcher.name} (${researcher.id}, ${researcher.department}) with ${company.name} (${company.id}), challenge ${challenge.id}`)
		md.push(`**Critic:** ${r.verdict} after ${r.attempts.length} draft(s). Screening score ${sel.score.toFixed(2)} / 3.`, "")
		if (!p) continue
		md.push(`### The problem`, p.problem, "", `### Research questions`, ...p.research_questions.map((q, i) => `${i + 1}. ${q}`), "")
		md.push(`### Plan`, "| Year | Work | Result |", "| --- | --- | --- |", ...p.plan.map((x) => `| ${x.year} | ${x.work} | ${x.result} |`), "")
		md.push(`### What each side brings`, `- **Company:** ${p.company_brings}`, `- **Faculty:** ${p.faculty_brings}`, "")
		md.push(`### Why this pair`, p.why_this_pair, "", `### First step`, p.first_step, "")
		md.push(`### Claims and sources`)
		const last = r.attempts[r.attempts.length - 1]
		for (const c of last.checks) md.push(`- ${c.supported ? "supported" : "NOT supported"}${c.support !== undefined ? ` (p=${c.support})` : ""}: ${c.claim} [${c.evidence.join(", ")}]`)
		md.push("")
	}

	writeFileSync(join(runDir, "proposals.md"), md.join("\n"))
	writeFileSync(join(runDir, "timeline.txt"), timeline.join("\n") + "\n")

	console.log("\n" + timeline.join("\n"))
	console.log(
		`\npeak in flight: ${peak} jobs at ${(peakAt / 1000).toFixed(1)}s (${inFlightAtPeak.join(", ")})` +
			`\njobs overlapping another agent: ${overlapping}/${jobs.length}` +
			(CRITIC_ENFORCES
				? `\ncritic: ${summary.critic_record.drafts} drafts, ${summary.critic_record.revisionsRequested} sent back, ${summary.critic_record.claimsBlocked} claims blocked, `
				: `\ncritic OFF (ablation): ${summary.critic_record.drafts} drafts, would have sent back ${summary.critic_record.revisionsRequested}, flagged ${summary.critic_record.claimsBlocked} claims but blocked none, `) +
			`${summary.critic_record.unsupportedClaimsInFinalProposals} unsupported claims in final proposals` +
			`\nspend: $${summary.spend.usd} (${summary.spend.note})`,
	)
	return summary
}
