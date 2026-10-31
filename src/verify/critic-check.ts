// The Critic's claim check as a reusable function: deterministic id checks first,
// then one Decisions API request that asks, per claim, whether its cited records support it.
import type { Dataset } from "../data/dataset"
import { decider } from "../decisions"
import { TUNING } from "../config"
import { checkCitations, type Claim } from "./citations"

export type ClaimCheck = { claim: string; evidence: string[]; deterministic: string[]; support?: number; supported: boolean; matched?: "title" }

const fold = (s: string) =>
	s
		.normalize("NFKD")
		.replace(/\p{M}/gu, "")
		.toLowerCase()
		.replace(/[^\p{L}\d]+/gu, " ")
		.trim()
const FILLER = new Set(["is", "about", "titled", "entitled", "called", "the", "paper", "publication", "project", "patent", "a", "an", "on", "its", "title"])

/** True when the claim cites one publication, project or patent and says nothing but its id and exact title. */
export function titleOnly(ds: Dataset, claim: string, evidence: string[]): boolean {
	if (evidence.length !== 1) return false
	const id = evidence[0]
	const title = ds.publications.get(id)?.title ?? ds.projects.get(id)?.title ?? ds.patents.get(id)?.title
	if (!title) return false
	const c = fold(claim)
	const t = fold(title)
	if (t.split(" ").length < 4 || !c.includes(t)) return false
	const rest = c.replace(t, " ").replace(fold(id), " ").split(" ").filter(Boolean)
	return rest.every((w) => FILLER.has(w))
}

export async function checkClaims(ds: Dataset, pair: { researcherId: string; companyId: string }, claims: Claim[]): Promise<ClaimCheck[]> {
	const issues = checkCitations(ds, pair, claims)
	const checks: ClaimCheck[] = claims.map((c, i) => ({
		claim: c.text,
		evidence: c.evidence,
		deterministic: issues.filter((x) => x.claimIndex === i).map((x) => x.message),
		supported: false,
	}))
	// A claim that only names a cited record's own title ("SYN-PUB-08747 is about Explaining credit decisions
	// to supervisors") is checked by string match, not by the model: in live run 11 the model scored two such
	// exact-title claims 0 while scoring seven identical ones 1. Anything beyond the title still goes to the model.
	checks.forEach((c) => {
		if (c.deterministic.length === 0 && titleOnly(ds, c.claim, c.evidence)) {
			c.support = 1
			c.supported = true
			c.matched = "title"
		}
	})
	const toAsk = checks.map((c, i) => ({ c, i })).filter(({ c }) => c.deterministic.length === 0 && !c.matched)
	// Ask in small batches, concurrently. One request carrying every claim of a long draft (57 in live
	// run 10, with the same company record repeated in many blocks) scored plainly true facts near 0.
	// The planted-error evaluation ran at about 14 claims per request, so batches stay well below that.
	const batches: (typeof toAsk)[] = []
	for (let k = 0; k < toAsk.length; k += TUNING.claimBatch) batches.push(toAsk.slice(k, k + TUNING.claimBatch))
	await Promise.all(
		batches.map(async (batch) => {
			const blocks = batch.map(({ c, i }) => `### claim${i}\n${c.evidence.map((id) => ds.evidenceText(id)?.slice(0, 4000)).join("\n")}`)
			const questions = batch.map(({ c, i }) => ({
				type: "predicate" as const,
				name: `claim${i}`,
				instructions: `Using only the evidence in [[claim${i}]], is this statement supported: "${c.claim}"`,
			}))
			const answers = await decider.decide(blocks.join("\n\n"), questions)
			for (const a of answers) {
				if (a.type !== "predicate") continue
				const idx = Number(a.name.replace("claim", ""))
				checks[idx].support = a.probability
				checks[idx].supported = a.probability >= TUNING.supportThreshold
			}
		}),
	)
	return checks
}
