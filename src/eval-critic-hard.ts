// Harder, less biased Critic evaluation.
//  - Planted errors are SUBTLE: off-by-one numbers, a neighbouring field from the same faculty,
//    a real paper by another researcher in the same field, a wrong academic title, a wrong city,
//    a wrong sector.
//  - True claims are generated straight from dataset records (never seen or approved by the Critic),
//    so the false-block rate is not inflated by selection.
//  - Pairs come from every live run's proposals.
//
//   ALLOW_LIVE=1 npx tsx src/eval-critic-hard.ts --live
import "dotenv/config"
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { LIVE, TUNING } from "./config"
import { Dataset } from "./data/dataset"
import { initializeRuntime, MatchState, state } from "./runtime"
import type { Claim } from "./verify/citations"
import { checkClaims } from "./verify/critic-check"

type Pair = { researcherId: string; companyId: string; challengeId: string; run: string }
type Item = { kind: string; truth: boolean; claim: Claim; note: string }

function pairsFromRuns(): Pair[] {
	const seen = new Set<string>()
	const out: Pair[] = []
	for (const run of readdirSync("docs/evidence").filter((d) => d.startsWith("run-")).sort()) {
		const md = readFileSync(join("docs/evidence", run, "proposals.md"), "utf-8")
		for (const m of md.matchAll(/\*\*Pair:\*\*.*?\((R\d+),.*?\((C\d+)\), challenge (C\d+-CH\d+)/g)) {
			const key = `${m[1]}x${m[3]}`
			if (seen.has(key)) continue
			seen.add(key)
			out.push({ researcherId: m[1], companyId: m[2], challengeId: m[3], run })
		}
	}
	// --same-pairs: keep the pair set of the published evaluation, so a repeat measures the same 125 claims
	// even though later runs (8 to 12) added new pairs to docs/evidence.
	if (process.argv.includes("--same-pairs")) {
		const base = JSON.parse(readFileSync(join("docs", "evidence", "critic-eval-hard", "results.json"), "utf-8"))
		const keep = new Set<string>(base.rows.map((r: any) => r.pair))
		return out.filter((p) => keep.has(`${p.researcherId}x${p.challengeId}`))
	}
	return out
}

const lc = (s: string) => s.toLowerCase()

function items(ds: Dataset, p: Pair): Item[] {
	const r = ds.researchers.get(p.researcherId)!
	const c = ds.companies.get(p.companyId)!
	const ch = ds.challenges.get(p.challengeId)!.challenge
	const pub0 = ds.publications.get(r.publications[0])!
	const ownText = lc([...r.fields, ...r.keywords, r.bio].join(" "))

	// Neighbour field: same faculty, a field this researcher does not list or mention.
	const neighbour = [...ds.researchers.values()]
		.filter((x) => x.id !== r.id && x.faculty === r.faculty)
		.flatMap((x) => x.fields)
		.find((f) => !ownText.includes(lc(f)) && !ownText.includes(lc(f.split(" ")[0])))
	// Same-field paper by somebody else.
	const sameFieldPub = [...ds.publications.values()].find(
		(x) => !x.authors.some((a) => a.researcher_id === r.id) && x.keywords.some((k) => r.keywords.map(lc).includes(lc(k))),
	)
	const titles = ["Assistant Professor", "Associate Professor", "Full Professor"]
	const wrongTitle = titles.find((t) => t !== r.title) ?? "Full Professor"
	const otherCity = [...ds.companies.values()].map((x) => x.location).find((l) => l !== c.location)!
	const otherSector = [...ds.companies.values()].map((x) => x.sector).find((s) => s !== c.sector)!
	const firstSentence = ch.text.split(/(?<=[.!?])\s/)[0]

	const truths: Item[] = [
		{ kind: "true_title", truth: true, claim: { text: `${r.name} is ${/^[AEIOU]/.test(r.title) ? "an" : "a"} ${r.title} in the ${r.department}.`, about: "researcher", evidence: [r.id] }, note: "from researcher record" },
		{ kind: "true_field", truth: true, claim: { text: `${r.name} works in ${r.fields[0]}.`, about: "researcher", evidence: [r.id] }, note: "from researcher record" },
		{ kind: "true_publication", truth: true, claim: { text: `${r.name} co-authored "${pub0.title}" (${pub0.year}).`, about: "researcher", evidence: [pub0.id] }, note: "from publication record" },
		{ kind: "true_topic", truth: true, claim: { text: `${r.name} has published on ${pub0.keywords[0] ?? pub0.title}.`, about: "researcher", evidence: [pub0.id] }, note: "keyword of own paper" },
		{ kind: "true_size", truth: true, claim: { text: `${c.name} has ${c.employees} employees.`, about: "company", evidence: [c.id] }, note: "from company record" },
		{ kind: "true_city", truth: true, claim: { text: `${c.name} is based in ${c.location}.`, about: "company", evidence: [c.id] }, note: "from company record" },
		{ kind: "true_sector", truth: true, claim: { text: `${c.name} works in ${c.sector}.`, about: "company", evidence: [c.id] }, note: "from company record" },
		{ kind: "true_challenge", truth: true, claim: { text: `${c.name} says: "${firstSentence}"`, about: "company", evidence: [ch.id] }, note: "first sentence of the challenge" },
	]
	const planted: Item[] = [
		{ kind: "off_by_one_size", truth: false, claim: { text: `${c.name} has ${c.employees + 1} employees.`, about: "company", evidence: [c.id] }, note: `real: ${c.employees}` },
		{ kind: "wrong_title", truth: false, claim: { text: `${r.name} is ${/^[AEIOU]/.test(wrongTitle) ? "an" : "a"} ${wrongTitle} in the ${r.department}.`, about: "researcher", evidence: [r.id] }, note: `real: ${r.title}` },
		{ kind: "wrong_city", truth: false, claim: { text: `${c.name} is based in ${otherCity}.`, about: "company", evidence: [c.id] }, note: `real: ${c.location}` },
		{ kind: "wrong_sector", truth: false, claim: { text: `${c.name} works in ${otherSector}.`, about: "company", evidence: [c.id] }, note: `real: ${c.sector}` },
	]
	if (neighbour)
		planted.push({ kind: "neighbour_field", truth: false, claim: { text: `${r.name} has published on ${lc(neighbour)}.`, about: "researcher", evidence: r.publications.slice(0, 2) }, note: `field of a colleague in ${r.faculty}` })
	if (sameFieldPub)
		planted.push({ kind: "same_field_foreign_paper", truth: false, claim: { text: `${r.name} co-authored "${sameFieldPub.title}".`, about: "researcher", evidence: [sameFieldPub.id] }, note: `real paper by someone else in the same field (${sameFieldPub.id})` })
	return [...truths, ...planted]
}

async function main() {
	const st = new MatchState()
	initializeRuntime({ state: st })
	st.ds = Dataset.load()
	const pairs = pairsFromRuns()
	const rows: any[] = []
	const t0 = Date.now()
	await Promise.all(
		pairs.map(async (p) => {
			const its = items(st.ds, p)
			const checks = await checkClaims(st.ds, { researcherId: p.researcherId, companyId: p.companyId }, its.map((i) => i.claim))
			checks.forEach((c, i) =>
				rows.push({ pair: `${p.researcherId}x${p.challengeId}`, run: p.run, kind: its[i].kind, truth: its[i].truth, note: its[i].note, claim: c.claim, evidence: c.evidence, support: c.support, deterministic: c.deterministic, blocked: !c.supported }),
			)
		}),
	)
	const ms = Date.now() - t0
	const planted = rows.filter((r) => !r.truth)
	const truths = rows.filter((r) => r.truth)
	const tally = (list: any[], pick: (r: any) => boolean) => {
		const o: Record<string, { hit: number; total: number }> = {}
		for (const r of list) {
			const k = (o[r.kind] ??= { hit: 0, total: 0 })
			k.total += 1
			if (pick(r)) k.hit += 1
		}
		return o
	}
	const summary = {
		mode: LIVE ? "live (OpenAI Decisions API, gpt-6-luna)" : "STUB decider: wiring test only, numbers are meaningless",
		pairs: pairs.length,
		supportThreshold: TUNING.supportThreshold,
		plantedErrors: { caught: planted.filter((r) => r.blocked).length, total: planted.length, byKind: tally(planted, (r) => r.blocked) },
		trueClaims: { wronglyBlocked: truths.filter((r) => r.blocked).length, total: truths.length, byKind: tally(truths, (r) => r.blocked) },
		wallClockMs: ms,
		spendUsd: Number(state().spend.usd.toFixed(5)),
	}
	// --out=<name> writes a repeat next to the published result instead of over it.
	const out = process.argv.find((a) => a.startsWith("--out="))?.split("=")[1]
	const dir = join("docs", "evidence", LIVE ? (out ?? "critic-eval-hard") : "critic-eval-hard-stub")
	mkdirSync(dir, { recursive: true })
	writeFileSync(join(dir, "results.json"), JSON.stringify({ summary, rows }, null, 2))
	const md = [
		`# Critic evaluation, hard set (${summary.mode})`,
		"",
		`${pairs.length} researcher-company pairs from every live run. Subtle errors planted; true claims generated directly from dataset records (never seen by the Critic before).`,
		"",
		`- Planted errors caught: **${summary.plantedErrors.caught} / ${summary.plantedErrors.total}**`,
		`- True claims wrongly blocked: **${summary.trueClaims.wronglyBlocked} / ${summary.trueClaims.total}**`,
		`- ${pairs.length} concurrent Critic checks in ${ms} ms; spend $${summary.spendUsd}`,
		"",
		"| Planted error | Caught |",
		"| --- | --- |",
		...Object.entries(summary.plantedErrors.byKind).map(([k, v]) => `| ${k} | ${v.hit} / ${v.total} |`),
		"",
		"| True claim type | Wrongly blocked |",
		"| --- | --- |",
		...Object.entries(summary.trueClaims.byKind).map(([k, v]) => `| ${k} | ${v.hit} / ${v.total} |`),
		"",
		"## Misses (planted errors that got through)",
		"",
		...planted.filter((r) => !r.blocked).map((r) => `- **${r.kind}** (p=${r.support}; ${r.note}): ${r.claim} [${r.evidence.join(", ")}]`),
		"",
		"## False blocks (true claims the Critic rejected)",
		"",
		...truths.filter((r) => r.blocked).map((r) => `- **${r.kind}** (${r.deterministic[0] ?? `p=${r.support}`}): ${r.claim} [${r.evidence.join(", ")}]`),
	]
	writeFileSync(join(dir, "results.md"), md.join("\n") + "\n")
	console.log(JSON.stringify(summary, null, 2))
	for (const r of planted.filter((x) => !x.blocked)) console.log(`MISSED ${r.kind}: ${r.claim.slice(0, 140)} (p=${r.support}; ${r.note})`)
	for (const r of truths.filter((x) => x.blocked)) console.log(`FALSE BLOCK ${r.kind}: ${r.claim.slice(0, 140)} (${r.deterministic[0] ?? `p=${r.support}`})`)
	process.exit(0)
}

main().catch((e) => {
	console.error(e)
	process.exit(1)
})
