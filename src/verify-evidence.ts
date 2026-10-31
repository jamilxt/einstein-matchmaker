// Re-checks every committed evidence folder without a key, a model or the network.
// It does not trust summary.json: it recomputes the numbers from the raw trace and the
// recorded Critic checks, then compares them with the summaries and the README table.
//   npm run verify:evidence
// Exit code 1 on any mismatch. What it proves: the published numbers follow from the
// committed traces, and released proposals still pass today's deterministic checks.
// What it cannot prove: that the traces came from a real API (they are plain files).
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { Dataset } from "./data/dataset"
import { checkCitations } from "./verify/citations"
import { checkProse } from "./verify/coverage"

const ROOT = "docs/evidence"
let failures = 0
const out: string[] = []
function log(line: string) {
	out.push(line)
	console.log(line)
}
function check(label: string, ok: boolean, detail = "") {
	if (!ok) failures++
	log(`${ok ? "ok  " : "FAIL"}  ${label}${detail ? `  (${detail})` : ""}`)
}

type Ev = { t: number; type: string; by: string; data: any }
const readTrace = (dir: string): Ev[] =>
	readFileSync(join(dir, "trace.jsonl"), "utf-8")
		.split("\n")
		.filter((l) => l.trim())
		.map((l) => JSON.parse(l))

// ---- 1. Concurrency and Critic record, recomputed from each trace -------------------------
type Recomputed = { peak: number; overlapping: number; jobs: number; drafts: number; sentBack: number; blocked?: number; wallMs: number; usd?: number }

function recompute(dir: string, summary: any): Recomputed {
	const ev = readTrace(dir)
	// Job intervals from job.started / job.finished, matched by jobId.
	const starts = new Map<string, { t: number; agent: string }>()
	const jobs: { agent: string; s: number; f: number }[] = []
	for (const e of ev) {
		if (e.type === "job.started") starts.set(e.data.jobId, { t: e.t, agent: e.data.agent })
		if (e.type === "job.finished") {
			const s = starts.get(e.data.jobId)
			if (s) jobs.push({ agent: s.agent, s: s.t, f: e.t })
		}
	}
	const edges = jobs.flatMap((j) => [
		{ t: j.s, d: 1 },
		{ t: j.f, d: -1 },
	])
	edges.sort((a, b) => a.t - b.t || a.d - b.d)
	let cur = 0
	let peak = 0
	for (const e of edges) peak = Math.max(peak, (cur += e.d))
	const overlapping = jobs.filter((a) => jobs.some((b) => b !== a && b.agent !== a.agent && a.s < b.f && b.s < a.f)).length

	const verdicts = ev.filter((e) => e.type === "critic.verdict")
	const sentBack = verdicts.filter((e) => (e.data.wouldHave ?? e.data.verdict) === "revise").length
	const runEnd = ev.find((e) => e.type === "run.end")

	// Blocked claims (excluding text-check issues) need the full checks, which run.json keeps.
	let blocked: number | undefined
	if (existsSync(join(dir, "run.json"))) {
		const run = JSON.parse(readFileSync(join(dir, "run.json"), "utf-8"))
		const attempts = run.proposals.flatMap((p: any) => p.attempts)
		blocked = attempts.flatMap((a: any) => a.checks.filter((c: any) => !c.supported && c.kind !== "prose")).length
		check(`${dir}: run.json has one attempt per critic.verdict event`, attempts.length === verdicts.length, `${attempts.length} vs ${verdicts.length}`)
	} else if (summary.critic_record.proseIssuesBlocked === undefined) {
		// Runs recorded before the text check existed: every blocked entry in the trace is a claim.
		blocked = verdicts.reduce((n, e) => n + (e.data.blocked?.length ?? 0), 0)
	}
	return { peak, overlapping, jobs: jobs.length, drafts: verdicts.length, sentBack, blocked, wallMs: summary.wallClockMs, usd: runEnd?.data?.spendUsd }
}

// ---- 2. README evidence table ---------------------------------------------------------------
function readmeRows(): Map<string, string[]> {
	const rows = new Map<string, string[]>()
	for (const line of readFileSync("README.md", "utf-8").split("\n")) {
		const m = line.match(/^\| \[([a-z0-9-]+)\]\(docs\/evidence\/[a-z0-9-]+\) \|(.*)\|$/)
		if (m) rows.set(m[1], m[2].split("|").map((c) => c.trim()))
	}
	return rows
}

const ds = Dataset.load()
const table = readmeRows()
const runs = readdirSync(ROOT)
	.filter((d) => /^(run|search)-\d+/.test(d) && existsSync(join(ROOT, d, "trace.jsonl")))
	.sort()

log("== 1. Numbers recomputed from each trace, against summary.json and the README table")
for (const name of runs) {
	const dir = join(ROOT, name)
	const summary = JSON.parse(readFileSync(join(dir, "summary.json"), "utf-8"))
	const r = recompute(dir, summary)
	const c = summary.concurrency
	const cr = summary.critic_record
	check(`${name}: peak jobs in flight ${r.peak}`, r.peak === c.peakInFlight, `summary says ${c.peakInFlight}`)
	check(`${name}: ${r.overlapping}/${r.jobs} jobs overlap another agent`, r.overlapping === c.jobsOverlappingAnotherAgent && r.jobs === c.jobs, `summary says ${c.jobsOverlappingAnotherAgent}/${c.jobs}`)
	check(`${name}: ${r.drafts} drafts, ${r.sentBack} sent back`, r.drafts === cr.drafts && r.sentBack === cr.revisionsRequested, `summary says ${cr.drafts}, ${cr.revisionsRequested}`)
	if (r.blocked !== undefined) check(`${name}: ${r.blocked} claims blocked`, r.blocked === cr.claimsBlocked, `summary says ${cr.claimsBlocked}`)
	if (r.usd !== undefined) check(`${name}: spend $${r.usd.toFixed(5)} in run.end`, Math.abs(r.usd - summary.spend.usd) < 1e-5, `summary says $${summary.spend.usd}`)
	check(`${name}: at least two agents ran at once`, r.peak >= 2 && r.overlapping >= 2)

	const row = table.get(name)
	if (!row) {
		check(`${name}: listed in the README evidence table`, false)
		continue
	}
	// Columns: Critic | Peak | Overlapping | Sent back | Claims blocked | Failing at release | Time | Cost
	const [, peak, overl, sentBack, blocked, , time, cost] = row
	const enforcing = summary.critic === "enforcing"
	const expectSentBack = enforcing ? `${r.sentBack} of ${r.drafts}` : `(would have: ${r.sentBack})`
	const expectBlocked = enforcing ? `${cr.claimsBlocked}` : `(flagged: ${cr.claimsBlocked})`
	const readmeOk =
		peak === String(r.peak) &&
		overl === `${r.overlapping}/${r.jobs}` &&
		sentBack === expectSentBack &&
		blocked === expectBlocked &&
		time === `${(r.wallMs / 1000).toFixed(1)} s` &&
		cost === `$${summary.spend.usd.toFixed(3)}`
	check(`${name}: README row matches`, readmeOk, readmeOk ? "" : `README: ${[peak, overl, sentBack, blocked, time, cost].join(" | ")}`)
}

// ---- 3. Released proposals against today's deterministic checks -----------------------------
log("\n== 2. Every released proposal from the batch runs, re-checked with no model")
for (const name of runs.filter((n) => n.startsWith("run-"))) {
	const file = join(ROOT, name, "run.json")
	if (!existsSync(file)) continue
	const run = JSON.parse(readFileSync(file, "utf-8"))
	for (const p of run.proposals) {
		if (!p.final) {
			check(`${name} ${p.key}: no text released for a rejected proposal`, p.verdict === "rejected")
			continue
		}
		const pair = { researcherId: p.pair.researcherId, companyId: p.pair.companyId, challengeId: p.pair.challengeId }
		const citation = checkCitations(ds, pair, p.final.claims ?? [])
		check(`${name} ${p.key}: all ${p.final.claims?.length ?? 0} cited ids exist and belong to the pair`, citation.length === 0, citation.map((i) => i.message).join("; "))
		// The text check exists from run 6 on. The proposal date is the run date, so "past" is judged as of then.
		const runDate = new Date(run.summary?.runId?.slice(0, 10) ?? summary0(name))
		if (Number(name.slice(4, 6)) >= 6) {
			const prose = checkProse(ds, pair, p.final, runDate)
			check(`${name} ${p.key}: text check passes`, prose.length === 0, prose.map((i) => i.why).join("; ").slice(0, 200))
		}
	}
}
function summary0(name: string) {
	return JSON.parse(readFileSync(join(ROOT, name, "summary.json"), "utf-8")).runId.slice(0, 10)
}

// ---- 4. Critic evaluation, replayed from the recorded scores ----------------------------------
log("\n== 3. Critic evaluation replayed from recorded scores (no model call)")
const evalFile = join(ROOT, "critic-eval-hard", "results.json")
const ev = JSON.parse(readFileSync(evalFile, "utf-8"))
const threshold = ev.summary.supportThreshold
const rows: any[] = ev.rows
const blockedAt = (r: any, t: number) => r.deterministic.length > 0 || (r.support ?? 0) < t
const planted = rows.filter((r) => !r.truth)
const truths = rows.filter((r) => r.truth)
const caught = planted.filter((r) => blockedAt(r, threshold)).length
const falseBlocks = truths.filter((r) => blockedAt(r, threshold)).length
check(`replayed at threshold ${threshold}: ${caught}/${planted.length} planted errors caught`, caught === ev.summary.plantedErrors.caught && planted.length === ev.summary.plantedErrors.total)
check(`replayed at threshold ${threshold}: ${falseBlocks}/${truths.length} true claims blocked`, falseBlocks === ev.summary.trueClaims.wronglyBlocked && truths.length === ev.summary.trueClaims.total)
check("every recorded verdict follows from its recorded score", rows.every((r) => r.blocked === blockedAt(r, threshold)))

// Which layer catches what: the id/ownership rules alone, versus rules plus the support score.
// The rules layer is re-run here on today's dataset, not read from the file.
const rulesOnly = (r: any) => {
	const [rid, cid] = r.pair.split("x")
	return checkCitations(ds, { researcherId: rid, companyId: cid.split("-")[0] }, [{ text: r.claim, about: "researcher", evidence: r.evidence }]).length > 0
}
const layers = [
	{ name: "ID and ownership rules only", caught: planted.filter(rulesOnly).length, fb: truths.filter(rulesOnly).length },
	{ name: `Rules + support score (threshold ${threshold})`, caught, fb: falseBlocks },
]
// How close the decisions are: the same recorded scores at other thresholds.
const sweep = [0.3, 0.4, 0.5, 0.6, 0.7].map((t) => ({ t, caught: planted.filter((r) => blockedAt(r, t)).length, fb: truths.filter((r) => blockedAt(r, t)).length }))
const scored = (xs: any[]) => xs.filter((r) => r.deterministic.length === 0).map((r) => r.support as number)
const maxPlanted = Math.max(...scored(planted).filter((s) => s < 1))
const minTrue = Math.min(...scored(truths))
for (const l of layers) log(`      ${l.name}: ${l.caught}/${planted.length} caught, ${l.fb}/${truths.length} false blocks`)
for (const s of sweep) log(`      threshold ${s.t.toFixed(1)}: ${s.caught}/${planted.length} caught, ${s.fb}/${truths.length} false blocks`)
log(`      lowest score on a true claim: ${minTrue}; highest score on a planted error: ${maxPlanted}`)

writeFileSync(
	join(ROOT, "critic-eval-hard", "replay.md"),
	[
		"# Critic evaluation, replayed offline",
		"",
		"Generated by `npm run verify:evidence` from the scores recorded in [`results.json`](results.json). No model is called: the verdicts are recomputed from each claim's recorded support score, and the ID and ownership rules are re-run on the dataset.",
		"",
		"## Which layer catches what",
		"",
		"| Layer | Planted errors caught | True claims blocked |",
		"| --- | --- | --- |",
		...layers.map((l) => `| ${l.name} | ${l.caught} / ${planted.length} | ${l.fb} / ${truths.length} |`),
		"",
		"The planted errors cite records that exist and belong to the pair, except the paper by someone else, so the rules alone catch only that kind. Every other catch comes from the support score.",
		"",
		"## The same recorded scores at other thresholds",
		"",
		"| Threshold | Planted errors caught | True claims blocked |",
		"| --- | --- | --- |",
		...sweep.map((s) => `| ${s.t.toFixed(1)}${s.t === threshold ? " (used)" : ""} | ${s.caught} / ${planted.length} | ${s.fb} / ${truths.length} |`),
		"",
		`Lowest score given to a true claim: ${minTrue}. Highest score given to a planted error: ${maxPlanted}. A threshold above ${maxPlanted} would catch every planted error in this set, but the gap is one borderline case and this set is small, so I kept the 0.5 threshold chosen before the evaluation instead of tuning it to the test.`,
		"",
	].join("\n"),
)

log(`\n${failures === 0 ? "All evidence checks passed." : `${failures} check(s) failed.`}`)
process.exit(failures === 0 ? 0 : 1)
