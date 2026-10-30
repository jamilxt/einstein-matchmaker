// Deterministic shortlist: BM25 over researcher evidence, queried with each company challenge.
// No LLM here. The point is to cut ~1,047 x 489 possible pairs down to a few hundred
// worth a model's attention, and to respect each researcher's stated openness to industry work.
import type { Dataset, Researcher } from "./dataset"

const STOP = new Set(
	"a an the and or of to in on for with by from at as is are be we our us they their this that these those it its into using use used can not no our have has had more most than such which who what when where how also any all per via new based between within without about over under".split(
		" ",
	),
)

export function tokenize(text: string): string[] {
	return (text.toLowerCase().match(/[a-z0-9][a-z0-9+#.-]*/g) ?? [])
		.map((t) => t.replace(/[.-]+$/, ""))
		.filter((t) => t.length > 2 && !STOP.has(t))
}

// Consent is read in src/data/consent.ts (English, Serbian Latin and Cyrillic wording).
import { isOpenToCollaboration } from "./consent"
export { isOpenToCollaboration }

type Doc = { id: string; tf: Map<string, number>; len: number }

export class ResearcherIndex {
	private docs: Doc[] = []
	private df = new Map<string, number>()
	private avgLen = 0
	readonly excluded: string[] = []

	constructor(private readonly ds: Dataset) {
		for (const r of ds.researchers.values()) {
			if (!isOpenToCollaboration(r)) {
				this.excluded.push(r.id)
				continue
			}
			const parts = [
				r.fields.join(" "),
				r.fields.join(" "), // fields and keywords weighted twice: they are the researcher's own summary
				r.keywords.join(" "),
				r.keywords.join(" "),
				r.bio,
				r.notes,
				...r.publications.map((id) => {
					const p = ds.publications.get(id)
					return p ? `${p.title} ${p.keywords.join(" ")}` : ""
				}),
				...r.projects.map((id) => ds.projects.get(id)?.title ?? ""),
				...r.patents.map((id) => ds.patents.get(id)?.title ?? ""),
			]
			const toks = tokenize(parts.join(" "))
			const tf = new Map<string, number>()
			for (const t of toks) tf.set(t, (tf.get(t) ?? 0) + 1)
			for (const t of tf.keys()) this.df.set(t, (this.df.get(t) ?? 0) + 1)
			this.docs.push({ id: r.id, tf, len: toks.length })
		}
		this.avgLen = this.docs.reduce((s, d) => s + d.len, 0) / Math.max(1, this.docs.length)
	}

	get size(): number {
		return this.docs.length
	}

	search(query: string, k: number): { researcherId: string; score: number; matched: string[] }[] {
		const q = [...new Set(tokenize(query))]
		const N = this.docs.length
		const k1 = 1.2
		const b = 0.75
		const scored = this.docs.map((d) => {
			let score = 0
			const matched: string[] = []
			for (const t of q) {
				const f = d.tf.get(t)
				if (!f) continue
				const df = this.df.get(t) ?? 0
				const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5))
				score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.len) / this.avgLen)))
				matched.push(t)
			}
			return { researcherId: d.id, score, matched }
		})
		return scored
			.filter((s) => s.score > 0)
			.sort((a, b) => b.score - a.score)
			.slice(0, k)
	}
}

export type CandidatePair = {
	challengeId: string
	companyId: string
	researcherId: string
	retrievalScore: number
	matchedTerms: string[]
}

/** Top-k researchers for every challenge. Pairs, never a ranking of people. */
export function shortlistPairs(ds: Dataset, index: ResearcherIndex, perChallenge = 3): CandidatePair[] {
	const out: CandidatePair[] = []
	for (const { challenge, company } of ds.challenges.values()) {
		const query = `${challenge.text} ${challenge.detail} ${company.tech.join(" ")}`
		for (const hit of index.search(query, perChallenge)) {
			out.push({
				challengeId: challenge.id,
				companyId: company.id,
				researcherId: hit.researcherId,
				retrievalScore: Number(hit.score.toFixed(3)),
				matchedTerms: hit.matched.slice(0, 12),
			})
		}
	}
	return out
}
