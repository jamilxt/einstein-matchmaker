// Red-team evaluation of the Critic. Takes the claims of real approved proposals (a live run),
// plants known errors in copies of them, and measures: how many planted errors the Critic catches,
// and how many true claims it wrongly blocks. Only the Critic runs here (Decisions API + id checks).
//
//   offline:  npm run eval:critic            (stub decider, for wiring only; numbers mean nothing)
//   live:     ALLOW_LIVE=1 npm run eval:critic -- --live
import "dotenv/config"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { LIVE, TUNING } from "./config"
import { Dataset } from "./data/dataset"
import { initializeRuntime, MatchState, state } from "./runtime"
import type { Claim } from "./verify/citations"
import { checkClaims } from "./verify/critic-check"

const SOURCE = process.argv.find((a) => a.startsWith("--source="))?.split("=")[1] ?? "docs/evidence/run-03-live/proposals.md"

type Parsed = { researcherId: string; companyId: string; challengeId: string; claims: Claim[] }

function parseProposals(md: string): Parsed[] {
	return md
		.split(/^## /m)
		.slice(1)
		.map((sec) => {
			const pair = sec.match(/\*\*Pair:\*\*.*?\((R\d+),.*?\((C\d+)\), challenge (C\d+-CH\d+)/)!
			const claims = [...sec.matchAll(/^- supported \(p=[\d.]+\): (.+) \[([^\]]+)\]$/gm)].map((m) => {
				const evidence = m[2].split(",").map((x) => x.trim())
				const about: Claim["about"] = evidence.some((e) => e.startsWith("C")) ? "company" : "researcher"
				return { text: m[1], about, evidence }
			})
			return { researcherId: pair[1], companyId: pair[2], challengeId: pair[3], claims }
		})
}

type Mutant = { kind: string; claim: Claim; note: string }

function mutate(ds: Dataset, p: Parsed, n: number): Mutant[] {
	const r = ds.researchers.get(p.researcherId)!
	const c = ds.companies.get(p.companyId)!
	const ch = ds.challenges.get(p.challengeId)!.challenge
	const expertise = p.claims.find((x) => x.evidence.some((e) => e.startsWith("SYN-PUB")))!
	const ownPubs = r.publications.slice(0, 2)
	const foreignPub = [...ds.publications.values()].find((x) => !x.authors.some((a) => a.researcher_id === r.id) && x.keywords.length > 0)!
	const distant = [...ds.researchers.values()].find((x) => x.faculty !== r.faculty && x.fields.length > 0)!
	const numbered = p.claims.find((x) => x.evidence.includes(p.companyId) && /\b\d{2,4}\b/.test(x.text))
	const out: Mutant[] = [
		{ kind: "invented_id", claim: { ...expertise, evidence: [`SYN-PUB-9990${n}`] }, note: "true statement, citation to a paper that does not exist" },
		{ kind: "foreign_record", claim: { ...expertise, evidence: [foreignPub.id] }, note: `true statement, citation to ${foreignPub.id} by someone else` },
		{
			kind: "off_topic_expertise",
			claim: { text: `${r.name} has published extensively on ${distant.fields[0].toLowerCase()}.`, about: "researcher", evidence: ownPubs },
			note: `expertise from another faculty (${distant.fields[0]}) cited to the researcher's own real papers`,
		},
		{
			kind: "fabricated_company_fact",
			claim: { text: `${c.name} already runs a 25-person in-house machine-learning research team.`, about: "company", evidence: [p.companyId] },
			note: "invented company capability, cited to the real company record",
		},
		{
			kind: "inflated_researcher_fact",
			claim: { text: `${r.name} has supervised ten industrial PhD theses with ${c.name}.`, about: "researcher", evidence: [p.researcherId] },
			note: "invented track record, cited to the real researcher record",
		},
	]
	if (numbered) {
		const changed = numbered.text.replace(/\b(\d{2,4})\b/, (m) => String(Number(m) >= 1900 && Number(m) <= 2030 ? Number(m) - 9 : Number(m) * 3))
		out.push({ kind: "changed_number", claim: { ...numbered, text: changed }, note: `number altered: "${numbered.text.slice(0, 60)}..."` })
	} else {
		out.push({
			kind: "changed_number",
			claim: { text: `${ch.text.slice(0, 40)}... affects about 9,000 units a day.`, about: "company", evidence: [p.challengeId] },
			note: "invented quantity attached to the real challenge",
		})
	}
	return out
}

async function main() {
	const st = new MatchState()
	initializeRuntime({ state: st })
	st.ds = Dataset.load()
	const proposals = parseProposals(readFileSync(SOURCE, "utf-8"))
	const rows: any[] = []
	const t0 = Date.now()
	await Promise.all(
		proposals.map(async (p, n) => {
			const pair = { researcherId: p.researcherId, companyId: p.companyId }
			const mutants = mutate(st.ds, p, n)
			// Two concurrent Critic checks per proposal: the untouched true claims, and the planted errors.
			const [trueChecks, mutantChecks] = await Promise.all([checkClaims(st.ds, pair, p.claims), checkClaims(st.ds, pair, mutants.map((m) => m.claim))])
			trueChecks.forEach((c) => rows.push({ pair: `${p.researcherId}x${p.challengeId}`, kind: "true_claim", claim: c.claim, evidence: c.evidence, support: c.support, deterministic: c.deterministic, blocked: !c.supported }))
			mutantChecks.forEach((c, i) =>
				rows.push({ pair: `${p.researcherId}x${p.challengeId}`, kind: mutants[i].kind, note: mutants[i].note, claim: c.claim, evidence: c.evidence, support: c.support, deterministic: c.deterministic, blocked: !c.supported }),
			)
		}),
	)
	const ms = Date.now() - t0
	const planted = rows.filter((r) => r.kind !== "true_claim")
	const truths = rows.filter((r) => r.kind === "true_claim")
	const byKind: Record<string, { caught: number; total: number }> = {}
	for (const r of planted) {
		const k = (byKind[r.kind] ??= { caught: 0, total: 0 })
		k.total += 1
		if (r.blocked) k.caught += 1
	}
	const summary = {
		mode: LIVE ? "live (OpenAI Decisions API, gpt-6-luna)" : "STUB decider: wiring test only, numbers are meaningless",
		source: SOURCE,
		supportThreshold: TUNING.supportThreshold,
		plantedErrors: { caught: planted.filter((r) => r.blocked).length, total: planted.length, byKind },
		trueClaims: { wronglyBlocked: truths.filter((r) => r.blocked).length, total: truths.length },
		wallClockMs: ms,
		spendUsd: Number(state().spend.usd.toFixed(5)),
	}
	const dir = join("docs", "evidence", LIVE ? "critic-eval" : "critic-eval-stub")
	mkdirSync(dir, { recursive: true })
	writeFileSync(join(dir, "results.json"), JSON.stringify({ summary, rows }, null, 2))
	const md = [
		`# Critic red-team evaluation (${summary.mode})`,
		"",
		`Source proposals: \`${SOURCE}\` (approved in a live run). Errors were planted in copies of their claims; true claims were re-checked unchanged.`,
		"",
		`- Planted errors caught: **${summary.plantedErrors.caught} / ${summary.plantedErrors.total}**`,
		`- True claims wrongly blocked: **${summary.trueClaims.wronglyBlocked} / ${summary.trueClaims.total}**`,
		`- Wall clock: ${ms} ms for ${proposals.length * 2} concurrent Critic checks; spend $${summary.spendUsd}`,
		"",
		"| Error type | Caught |",
		"| --- | --- |",
		...Object.entries(byKind).map(([k, v]) => `| ${k} | ${v.caught} / ${v.total} |`),
		"",
		"## Every planted error",
		"",
		...planted.map((r) => `- **${r.kind}** ${r.blocked ? "CAUGHT" : "MISSED"} (${r.deterministic[0] ?? `support p=${r.support}`}): ${r.claim} [${r.evidence.join(", ")}]`),
		"",
		"## True claims the Critic blocked (false positives)",
		"",
		...(truths.filter((r) => r.blocked).map((r) => `- (${r.deterministic[0] ?? `support p=${r.support}`}) ${r.claim} [${r.evidence.join(", ")}]`) || []),
	]
	writeFileSync(join(dir, "results.md"), md.join("\n") + "\n")
	console.log(JSON.stringify(summary, null, 2))
	for (const r of planted.filter((x) => !x.blocked)) console.log(`MISSED ${r.kind}: ${r.claim} (p=${r.support})`)
	for (const r of truths.filter((x) => x.blocked)) console.log(`FALSE BLOCK: ${r.claim.slice(0, 120)} (p=${r.support})`)
	process.exit(0)
}

main().catch((e) => {
	console.error(e)
	process.exit(1)
})
