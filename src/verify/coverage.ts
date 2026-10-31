// Deterministic coverage check on the proposal TEXT, not only on the Writer's claims list.
// The claims check proves each listed claim against its records; this check makes sure the
// prose cannot carry facts that never went through that check:
//   - every figure in a fact section must appear in a claim (which the Critic then verifies)
//   - every named person must appear in this pair's own records
//   - no other researcher or company from the dataset may be named
//   - planned work may not be dated in the past
//   - a draft must list enough claims, about both sides
// No model involved, so it cannot be talked out of a verdict.
import type { Dataset } from "../data/dataset"
import type { Claim } from "./citations"
import { checkDeadline, checkPhdLength } from "./deadline"

export type ProseIssue = { field: string; excerpt: string; why: string }

/** Sections that state facts about the two parties. Figures here must be backed by a claim. */
export const FACT_FIELDS = ["title", "problem", "company_brings", "faculty_brings", "why_this_pair", "novelty", "data_status"] as const
/** Sections that look forward (targets, plans). They may propose numbers; dates in them must lie in the future. */
export const PLAN_FIELDS = ["research_questions", "plan", "first_step", "to_agree"] as const

type ProseProposal = Record<string, unknown> & { claims?: Claim[] }

function fieldText(p: ProseProposal, f: string): string {
	const v = p[f]
	if (typeof v === "string") return v
	if (Array.isArray(v)) return v.map((x) => (typeof x === "string" ? x : Object.values(x ?? {}).join(" "))).join(" \n ")
	return ""
}

/** Figures, normalised so "15,000", "15.000" and "15000" compare equal. Small bare integers (1 to 9) are ignored. */
export function figureMatches(text: string): { raw: string; n: string }[] {
	const out: { raw: string; n: string }[] = []
	for (const m of text.matchAll(/(?<![\p{L}\d])(\d{1,3}(?:[.,\u00a0 ]\d{3})+|\d+(?:[.,]\d+)?)(\s?%)?/gu)) {
		let n = m[1]
		if (/^\d{1,3}([.,\u00a0 ]\d{3})+$/.test(n)) n = n.replace(/[.,\u00a0 ]/g, "")
		else n = n.replace(",", ".")
		if (!m[2] && /^[1-9]$/.test(n)) continue
		out.push({ raw: m[0], n })
	}
	return out
}
export const figures = (text: string) => figureMatches(text).map((f) => f.n)

const excerptAround = (text: string, needle: string) => {
	const i = text.indexOf(needle)
	const a = Math.max(0, i - 50)
	return (a > 0 ? "..." : "") + text.slice(a, i + needle.length + 50).replace(/\s+/g, " ").trim() + "..."
}

export function checkProse(
	ds: Dataset,
	pair: { researcherId: string; companyId: string; challengeId: string },
	proposal: ProseProposal,
	today = new Date(),
): ProseIssue[] {
	const issues: ProseIssue[] = []
	const claims = proposal.claims ?? []

	// 1. Enough claims, about both sides.
	if (claims.length < 4) issues.push({ field: "claims", excerpt: `${claims.length} claims`, why: "too few claims: list every factual statement about either party with its source" })
	if (!claims.some((c) => c.evidence?.includes(pair.challengeId)))
		issues.push({ field: "claims", excerpt: "", why: `no claim cites the company's problem (${pair.challengeId})` })
	if (!claims.some((c) => c.about === "researcher"))
		issues.push({ field: "claims", excerpt: "", why: "no claim is about the researcher" })

	// 2. Every figure in a fact section appears in a claim.
	const claimFigures = new Set(claims.flatMap((c) => figures(c.text ?? "")))
	for (const f of FACT_FIELDS) {
		const text = fieldText(proposal, f)
		for (const { raw, n } of figureMatches(text)) {
			if (claimFigures.has(n)) continue
			issues.push({ field: f, excerpt: excerptAround(text, raw), why: `the figure "${raw.trim()}" in ${f} is not in any claim, so no record was checked for it` })
		}
	}

	// 3. People and companies named in the text belong to this pair.
	const own = [ds.evidenceText(pair.researcherId), ds.evidenceText(pair.companyId), ds.evidenceText(pair.challengeId), ...claims.flatMap((c) => c.evidence ?? []).map((id) => ds.evidenceText(id))]
		.filter(Boolean)
		.join("\n")
	const allText = [...FACT_FIELDS, ...PLAN_FIELDS].map((f) => fieldText(proposal, f)).join("\n")
	for (const r of ds.researchers.values()) {
		if (r.id === pair.researcherId || !allText.includes(r.name) || own.includes(r.name)) continue
		issues.push({ field: "text", excerpt: excerptAround(allText, r.name), why: `names ${r.name}, a researcher outside this pair` })
	}
	for (const c of ds.companies.values()) {
		if (c.id === pair.companyId || c.name.length < 6 || !allText.includes(c.name) || own.includes(c.name)) continue
		issues.push({ field: "text", excerpt: excerptAround(allText, c.name), why: `names ${c.name}, a company outside this pair` })
	}
	const firstNames = new Set([...ds.researchers.values()].map((r) => r.name.split(" ")[0]))
	for (const m of allText.matchAll(/(?<!\p{L})(\p{Lu}\p{Ll}+)\s+(\p{Lu}\p{Ll}+(?:-\p{Lu}\p{Ll}+)?)(?!\p{L})/gu)) {
		const full = `${m[1]} ${m[2]}`
		if (!firstNames.has(m[1]) || own.includes(full)) continue
		issues.push({ field: "text", excerpt: excerptAround(allText, full), why: `names ${full}, who does not appear in this pair's records` })
	}

	// 4. Planned work is not dated in the past.
	const year = today.getUTCFullYear()
	const quarter = Math.floor(today.getUTCMonth() / 3) + 1
	for (const f of PLAN_FIELDS) {
		const text = fieldText(proposal, f)
		// "Q1 2026", or a deadline phrase ("by 2025", "ahead of 2025"). Bare years are often history ("2023 records"), so they pass.
		for (const m of text.matchAll(/\bQ([1-4])\s?(20\d\d)\b|\b(?:by|before|until|ahead of|deadline of)\s+(?:the\s+)?(?:end of\s+)?()(20\d\d)\b/gi)) {
			const y = Number(m[2] ?? m[4])
			const q = m[1] ? Number(m[1]) : 4
			if (y < year || (y === year && q < quarter))
				issues.push({ field: f, excerpt: excerptAround(text, m[0]), why: `plans work for ${m[0]}, which is already past (today is ${today.toISOString().slice(0, 10)})` })
		}
	}

	// 5. The plan meets the time limit the company itself states (verify/deadline.ts).
	issues.push(...checkDeadline(ds, pair, proposal))
	// 6. An industrial PhD still runs about three years when an early delivery is added.
	issues.push(...checkPhdLength(proposal))

	// One issue per distinct reason is enough for the Writer to act on.
	const seen = new Set<string>()
	return issues.filter((i) => (seen.has(i.why) ? false : (seen.add(i.why), true)))
}
