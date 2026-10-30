// The Critic's claim check as a reusable function: deterministic id checks first,
// then one Decisions API request that asks, per claim, whether its cited records support it.
import type { Dataset } from "../data/dataset"
import { decider } from "../decisions"
import { TUNING } from "../config"
import { checkCitations, type Claim } from "./citations"

export type ClaimCheck = { claim: string; evidence: string[]; deterministic: string[]; support?: number; supported: boolean }

export async function checkClaims(ds: Dataset, pair: { researcherId: string; companyId: string }, claims: Claim[]): Promise<ClaimCheck[]> {
	const issues = checkCitations(ds, pair, claims)
	const checks: ClaimCheck[] = claims.map((c, i) => ({
		claim: c.text,
		evidence: c.evidence,
		deterministic: issues.filter((x) => x.claimIndex === i).map((x) => x.message),
		supported: false,
	}))
	const toAsk = checks.map((c, i) => ({ c, i })).filter(({ c }) => c.deterministic.length === 0)
	if (toAsk.length) {
		const blocks = toAsk.map(({ c, i }) => `### claim${i}\n${c.evidence.map((id) => ds.evidenceText(id)?.slice(0, 4000)).join("\n")}`)
		const questions = toAsk.map(({ c, i }) => ({
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
	}
	return checks
}
