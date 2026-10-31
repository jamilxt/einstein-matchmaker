// Offline guard tests: no key, no model, no cost. Each case tries to get something past a guard
// that the Critic's claim check alone would miss, plus controls that must pass.
//   npm run test:guards
import { spawnSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import { Dataset } from "./data/dataset"
import { consentedForms, proposalForm } from "./data/consent"
import { MatchState } from "./runtime"
import { checkProse } from "./verify/coverage"
import { checkDeadline, checkPhdLength, statedDeadline } from "./verify/deadline"
import { checkPlanShape, periodSpan } from "./verify/plan-shape"
import { checkClaims, titleOnly } from "./verify/critic-check"
import { decider } from "./decisions"
import { TUNING } from "./config"

const ds = Dataset.load()
const today = new Date("2026-10-30T12:00:00Z")
let failed = 0
const results: { name: string; pass: boolean; detail: string }[] = []
function expect(name: string, pass: boolean, detail = "") {
	results.push({ name, pass, detail })
	if (!pass) failed++
	console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`)
}

// A real approved proposal to mutate: run 5, FinPuls (R0217 x C021-CH1).
const run5 = JSON.parse(readFileSync("docs/evidence/run-05-live/run.json", "utf-8"))
const base = run5.proposals.find((p: any) => p.key === "R0217xC021-CH1").final
const pair = { researcherId: "R0217", companyId: "C021", challengeId: "C021-CH1" }
const clone = () => JSON.parse(JSON.stringify(base))

console.log("== Text coverage (verify/coverage.ts)")
{
	const p = { ...clone(), problem: "Kristal Voda has 999999 employees and owns a nuclear reactor.", claims: [] }
	const issues = checkProse(ds, pair, p, today)
	expect("fabricated prose with an empty claims list is blocked", issues.length > 0, issues.map((i) => i.why).join("; ").slice(0, 160))
}
{
	const p = clone()
	p.problem += " The company already processes 7,300,000 transactions a day."
	const issues = checkProse(ds, pair, p, today)
	expect("an invented figure in the problem is blocked", issues.some((i) => i.why.includes("7,300,000")))
}
{
	const p = clone()
	// An invented person with a common first name from the dataset (the check keys on known first names).
	const invented = "Milan Testović"
	p.company_brings += ` ${invented} will co-supervise from the company side.`
	const issues = checkProse(ds, pair, p, today)
	expect("a person missing from the pair's records is blocked", issues.some((i) => i.why.includes(invented)), issues.map((i) => i.why).join("; ").slice(0, 120))
}
{
	const p = clone()
	const other = [...ds.researchers.values()].find((r) => r.id !== "R0217" && r.name.split(" ").length === 2)!
	p.why_this_pair += ` ${other.name} could join as a second supervisor.`
	const issues = checkProse(ds, pair, p, today)
	expect("a researcher outside the pair is blocked", issues.some((i) => i.why.includes(other.name)), other.name)
}
{
	const p = clone()
	p.plan[p.plan.length - 1].work += " Support a pilot release ahead of the Q1 2026 filing."
	const issues = checkProse(ds, pair, p, today)
	expect("a plan dated in the past (Q1 2026) is blocked", issues.some((i) => i.why.includes("already past")))
}
{
	const run5Pannonia = run5.proposals.find((p: any) => p.key === "R0271xC013-CH1").final
	const issues = checkProse(ds, { researcherId: "R0271", companyId: "C013", challengeId: "C013-CH1" }, run5Pannonia, today)
	expect("the real run 5 Pannonia draft (pilot ahead of Q1 2026) would now be sent back", issues.some((i) => i.why.includes("Q1 2026")))
}

console.log("== Controls: approved live proposals must pass the text check")
let controls = 0
let controlFlags = 0
for (const dir of ["run-05-live", "search-01-packaging", "search-02-winery", "search-03-serbian-input"]) {
	const f = `docs/evidence/${dir}/run.json`
	if (!existsSync(f)) continue
	const run = JSON.parse(readFileSync(f, "utf-8"))
	for (const r of run.proposals) {
		if (!r.final || r.key === "R0271xC013-CH1") continue
		const [researcherId, challengeId] = r.key.split("x")
		const issues = checkProse(ds, { researcherId, companyId: r.pair.companyId, challengeId }, r.final, today)
		controls++
		if (issues.length) {
			controlFlags++
			console.log(`   flagged control ${dir} ${r.key}: ${issues.map((i) => i.why).join("; ")}`)
		}
	}
}
expect(`approved live proposals pass the text check (${controls - controlFlags}/${controls})`, controlFlags === 0)

console.log("== Deadline fit (verify/deadline.ts)")
{
	// The real run 8 Kredo proposal: true facts, but production in year 3 for a six-month need.
	const run8 = JSON.parse(readFileSync("docs/evidence/run-08-live/run.json", "utf-8"))
	const kredo = run8.proposals.find((p: any) => p.key === "R0801xC010-CH2").final
	const kPair = { researcherId: "R0801", companyId: "C010", challengeId: "C010-CH2" }
	const quote = "we need something that works reliably in production within about six months"
	const withQuote = { ...JSON.parse(JSON.stringify(kredo)), company_deadline: quote }
	expect(
		"the real run 8 Kredo plan (production in year 3, need within six months) is sent back",
		checkDeadline(ds, kPair, withQuote).some((i) => i.why.includes("no plan period ends by then")),
	)
	const noneStated = { ...JSON.parse(JSON.stringify(kredo)), company_deadline: "none stated" }
	expect("\"none stated\" is refused when the challenge states a time limit", checkDeadline(ds, kPair, noneStated).some((i) => i.why.includes("states a time limit")))
	const invented = { ...JSON.parse(JSON.stringify(kredo)), company_deadline: "within three months" }
	expect("a time limit the challenge does not contain is refused", checkDeadline(ds, kPair, invented).some((i) => i.why.includes("word for word")))
	const fixed = { ...withQuote, plan: [{ period: "Months 1 to 6", work: "w", result: "r", pass_if: "p" }, ...withQuote.plan] }
	expect("the same plan with a 'Months 1 to 6' delivery period passes", checkDeadline(ds, kPair, fixed).length === 0)
	const automvoj = run8.proposals.find((p: any) => p.key === "R0995xC003-CH2").final
	expect(
		"a challenge with no stated limit accepts \"none stated\" (run 8 AutomVoj)",
		checkDeadline(ds, { challengeId: "C003-CH2" }, { ...automvoj, company_deadline: "none stated" }).length === 0,
	)
	// Controls over the whole dataset: the correct answer must never be blocked.
	let wrong = 0
	let limited = 0
	for (const { challenge } of ds.challenges.values()) {
		const d = statedDeadline(`${challenge.text} ${challenge.detail ?? ""}`)
		if (d) limited++
		const plan = [...(d && d.months < 12 ? [{ period: `Months 1 to ${Math.max(1, Math.floor(d.months))}` }] : []), { period: "Year 1" }, { period: "Year 2" }]
		if (checkDeadline(ds, { challengeId: challenge.id }, { company_deadline: d?.sentence ?? "none stated", plan }).length) wrong++
	}
	expect(`correct answers pass for all ${ds.challenges.size} challenges (${limited} state a readable limit)`, wrong === 0, `${wrong} blocked`)
	// Live run 10: the Writer met Kredo's six-month limit by shrinking the whole PhD plan to six months.
	const run10 = JSON.parse(readFileSync("docs/evidence/run-10-live/run.json", "utf-8"))
	const k10 = run10.proposals.find((p: any) => p.key === "R0801xC010-CH2")
	const short = { ...k10.attempts[k10.attempts.length - 1].proposal, form: "industrial_phd" }
	expect("the real run 10 Kredo PhD plan that ends after 6 months is sent back", checkProse(ds, kPair, short, today).some((i) => i.why.includes("three years")))
	const full = { ...short, plan: [...short.plan, { period: "Year 2", work: "w", result: "r", pass_if: "p" }, { period: "Year 3", work: "w", result: "r", pass_if: "p" }] }
	expect("the same plan continued to Year 3 meets both the six-month limit and the PhD length", checkDeadline(ds, kPair, full).length === 0 && checkPhdLength(full).length === 0)
	expect("a six-month joint project is not held to the PhD length", checkPhdLength({ ...short, form: "joint_project" }).length === 0)
}

console.log("== Ids in the text, and exact-title claims (verify/coverage.ts, verify/critic-check.ts)")
{
	// Live run 11: "SYN-PUB-02958" in the novelty text was read as the figure 02958; AutomVoj was rejected for it.
	const run11 = JSON.parse(readFileSync("docs/evidence/run-11-live/run.json", "utf-8"))
	const av = run11.proposals.find((p: any) => p.key === "R0995xC003-CH2")
	const aPair = { researcherId: "R0995", companyId: "C003", challengeId: "C003-CH2" }
	const last = { ...av.attempts[av.attempts.length - 1].proposal, form: "industrial_phd" }
	const lastIssues = checkProse(ds, aPair, last, today)
	expect("the real run 11 AutomVoj draft is no longer blocked for a cited id read as a figure", !lastIssues.some((i) => i.why.includes("02958")), lastIssues.map((i) => i.why).join("; ").slice(0, 160))
	const first = { ...av.attempts[0].proposal, form: "industrial_phd" }
	expect("its first draft, which cites both ids it names, passes the id rule too", !checkProse(ds, aPair, first, today).some((i) => i.why.includes("SYN-")))
	const uncited = { ...last, novelty: `${last.novelty} It also builds on SYN-PUB-10380.` }
	expect(
		"an id in the text that no claim cites is sent back, with a message the Writer can act on",
		checkProse(ds, aPair, uncited, today).some((i) => i.why.includes("SYN-PUB-10380") && i.why.includes("no claim cites it")),
	)
	expect("an exact-title claim is matched without the model", titleOnly(ds, "SYN-PUB-08747 is about explaining credit decisions to supervisors: a case study.", ["SYN-PUB-08747"]))
	expect("a title claim with anything more still goes to the model", !titleOnly(ds, "SYN-PUB-08747 is about explaining credit decisions to supervisors: a case study, which cut defaults by 40%.", ["SYN-PUB-08747"]))
	expect("a title cited to a different record is not matched", !titleOnly(ds, "SYN-PUB-08749 is about explaining credit decisions to supervisors: a case study.", ["SYN-PUB-08749"]))
}

console.log("== Plan shape (verify/plan-shape.ts)")
{
	// Run 12's approved Kredo plan went from "Months 1 to 6" straight to "Year 2". Given the new fields, the gap is caught.
	const run12 = JSON.parse(readFileSync("docs/evidence/run-12-live/run.json", "utf-8"))
	const kredo = run12.proposals.find((p: any) => p.key.endsWith("C010-CH2")).final
	const good = {
		baseline: "Today the company explains declines with a fixed reason-code list; the records give no figure for appeal rates, so Months 1 to 6 measure it first.",
		risks: [
			{ risk: "Supervisor rules on explanations change during the project.", stop_if: "the regulator's guidance makes the planned format unusable, rescope at the next review" },
			{ risk: "Explanations do not help loan officers decide faster.", stop_if: "the month 6 user test shows no gain over today's reason codes" },
		],
	}
	const withOwners = (plan: any[]) => plan.map((x: any) => ({ ...x, owner: "doctoral candidate with the company data lead" }))
	const gap = checkPlanShape({ ...kredo, ...good, plan: withOwners(kredo.plan) })
	expect("run 12 Kredo's jump from month 6 to Year 2 is caught", gap.some((i) => i.why.includes("jumps from month 6")), kredo.plan.map((x: any) => x.period).join(", "))
	const filled = withOwners([kredo.plan[0], { period: "Months 7 to 12", work: "w", result: "r", pass_if: "p" }, ...kredo.plan.slice(1)])
	expect("the same plan with months 7 to 12 added passes", checkPlanShape({ ...kredo, ...good, plan: filled }).length === 0, checkPlanShape({ ...kredo, ...good, plan: filled }).map((i) => i.why).join("; ").slice(0, 120))
	const bare = checkPlanShape({ ...kredo, baseline: "", risks: [{ risk: "Something could go wrong here.", stop_if: "" }], plan: kredo.plan })
	const fields = new Set(bare.map((i) => i.field))
	expect("no baseline, one risk without a stop point, and periods without owners are all caught", fields.has("baseline") && fields.has("risks") && bare.some((i) => i.why.includes("no owner")), [...fields].join(","))
	expect("proposals recorded before these fields existed are left alone", checkPlanShape(kredo).length === 0)
	expect("period labels are read as month spans", JSON.stringify([periodSpan("Months 7 to 12"), periodSpan("Year 2"), periodSpan("Weeks 1 to 8"), periodSpan("Years 2 to 3")]) === "[[7,12],[13,24],[1,2],[13,36]]")
}

console.log("== Critic request size (verify/critic-check.ts)")
{
	// Live run 10: one request with all 57 claims of the AutomVoj draft scored true facts ("212 employees") near 0.
	const run10 = JSON.parse(readFileSync("docs/evidence/run-10-live/run.json", "utf-8"))
	const a = run10.proposals.find((p: any) => p.key === "R0995xC003-CH2").attempts[0].proposal
	const sizes: number[] = []
	const original = decider.decide.bind(decider)
	;(decider as any).decide = async (_input: string, qs: any[]) => (sizes.push(qs.length), qs.map((q) => ({ type: "predicate", name: q.name, probability: 1 })))
	const checks = await checkClaims(ds, { researcherId: "R0995", companyId: "C003" }, a.claims)
	;(decider as any).decide = original
	const answered = checks.filter((c) => c.support !== undefined || c.deterministic.length).length
	expect(
		`the run 10 draft's ${a.claims.length} claims go out in requests of at most ${TUNING.claimBatch}`,
		sizes.length > 1 && Math.max(...sizes) <= TUNING.claimBatch && answered === a.claims.length,
		`${sizes.length} requests, sizes ${sizes.join("/")}, ${answered} answered`,
	)
}

console.log("== Consent (data/consent.ts)")
{
	const r = ds.researchers.get("R0679")!
	expect("Goran Radulović (no PhD supervision in open_to) gets a joint project, not a PhD", proposalForm(r)?.form === "joint_project", consentedForms(r).map((f) => f.form).join(","))
	const counts: Record<string, number> = {}
	let none = 0
	for (const x of ds.researchers.values()) {
		const f = proposalForm(x)
		if (!f) none++
		else counts[f.form] = (counts[f.form] ?? 0) + 1
	}
	const cyr = [...ds.researchers.values()].filter((x) => x.open_to.some((o) => /[\u0400-\u04FF]/.test(o)) && proposalForm(x)).length
	expect("Serbian (Latin and Cyrillic) consent wording is read", cyr > 0, `${cyr} researchers with Cyrillic wording included`)
	expect("researchers with no matching consent are excluded", none > 0, `${JSON.stringify(counts)}, excluded ${none}`)
	const phdOnlyWithConsent = [...ds.researchers.values()].every((x) => proposalForm(x)?.form !== "industrial_phd" || consentedForms(x).some((f) => f.form === "industrial_phd"))
	expect("an industrial PhD is only proposed with explicit PhD consent", phdOnlyWithConsent)
}

console.log("== Budget (runtime.ts, config.ts)")
{
	const s = new MatchState()
	const cap = Number(process.env.BUDGET_USD ?? 1)
	const a = s.reserve(cap * 0.6)
	const b = s.reserve(cap * 0.6)
	expect("two concurrent calls cannot both hold more than the budget", a && !b && s.halted, `first ${a}, second ${b}, halted ${s.halted}`)
	const bad = spawnSync(process.execPath, ["--import", "tsx", "src/run.ts"], { env: { ...process.env, BUDGET_USD: "abc" }, encoding: "utf-8" })
	expect("a non-numeric BUDGET_USD is refused", bad.status === 2, (bad.stderr || "").trim().slice(0, 80))
}

console.log("== Watchdog (jobs.ts)")
{
	// The stub model takes 0.4 to 1.6 s per call; a 300 ms watchdog stalls every LLM job.
	const r = spawnSync(process.execPath, ["--import", "tsx", "src/run.ts", "--challenges", "6"], {
		env: { ...process.env, OPENAI_API_KEY: "", JOB_TIMEOUT_MS: "300", RUN_TIMEOUT_MS: "20000" },
		encoding: "utf-8",
		timeout: 120_000,
	})
	const dir = r.stdout.match(/run dir: (\S+)/)?.[1]
	const run = dir && existsSync(`${dir}/run.json`) ? JSON.parse(readFileSync(`${dir}/run.json`, "utf-8")) : null
	const stalled = run?.jobs.filter((j: any) => j.status === "stalled").length ?? 0
	const released = run?.proposals.filter((p: any) => p.final).length ?? -1
	expect("stalled jobs end their loop and release nothing", !!run && stalled > 0 && released === 0, `run ${dir ? "finished" : "missing"}, ${stalled} stalled, ${released} released`)
}

console.log(`\n${results.length - failed}/${results.length} passed`)
process.exit(failed ? 1 : 0)
