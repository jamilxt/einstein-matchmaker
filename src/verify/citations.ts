// Deterministic half of the Critic: every claim must cite ids that exist and that belong
// to the right side of the pair. No model involved, so it cannot be talked out of a verdict.
import type { Dataset } from "../data/dataset"

export type Claim = {
	/** One factual sentence from the proposal. */
	text: string
	/** Who the claim is about. */
	about: "researcher" | "company"
	/** Dataset ids that back the claim (publications, projects, patents, challenge ids). */
	evidence: string[]
}

export type CitationIssue = {
	claimIndex: number
	kind: "no_evidence" | "unknown_id" | "wrong_owner"
	id?: string
	message: string
}

export function checkCitations(
	ds: Dataset,
	pair: { researcherId: string; companyId: string },
	claims: Claim[],
): CitationIssue[] {
	const issues: CitationIssue[] = []
	claims.forEach((claim, i) => {
		if (!claim.evidence?.length) {
			issues.push({ claimIndex: i, kind: "no_evidence", message: `claim ${i + 1} cites nothing` })
			return
		}
		for (const id of claim.evidence) {
			if (!ds.kindOf(id)) {
				issues.push({ claimIndex: i, kind: "unknown_id", id, message: `${id} does not exist in the dataset` })
				continue
			}
			// A claim may legitimately draw on both sides of the pair (e.g. "supervised by X and Y").
			// What must never happen is citing a record that belongs to neither party.
			const ownedByPair =
				id === pair.researcherId || ds.belongsToResearcher(id, pair.researcherId) || ds.belongsToCompany(id, pair.companyId)
			if (!ownedByPair) {
				issues.push({
					claimIndex: i,
					kind: "wrong_owner",
					id,
					message: `${id} belongs to neither ${pair.researcherId} nor ${pair.companyId}`,
				})
			}
		}
	})
	return issues
}
