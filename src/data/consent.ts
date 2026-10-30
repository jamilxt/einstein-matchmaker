// What kind of collaboration each researcher said yes to (`open_to`), read in English,
// Serbian Latin and Serbian Cyrillic. The proposal form follows the consent, never the other way round:
// someone open to joint projects but not to PhD supervision gets a joint-project proposal.
import type { Researcher } from "./dataset"

export type CollabForm = "industrial_phd" | "joint_project" | "contract_research"

const PATTERNS: Record<CollabForm, RegExp[]> = {
	industrial_phd: [
		/industrial\s+ph\.?\s?d/iu,
		/ph\.?\s?d\.?\s+(co-?)?supervision/iu,
		/(co-?)?supervision of industrial/iu,
		/industrijsk\p{L}*\s+doktor/iu,
		/doktor\p{L}*\s+.{0,30}industri/iu,
		/индустријск\p{L}*\s+доктор/iu,
	],
	joint_project: [/joint\s+(research\s+)?project/iu, /joint\s+project\s+(applications?|proposals?)/iu, /zajedni\p{L}*\s+(projek|prijav|istra)/iu, /заједнич\p{L}*\s+(пројек|пријав|истра)/iu],
	contract_research: [/contract\s+research/iu, /ugovor\p{L}*\s+istra/iu, /уговор\p{L}*\s+истра/iu],
}

export const FORM_LABEL: Record<CollabForm, string> = {
	industrial_phd: "Industrial PhD",
	joint_project: "Joint research project",
	contract_research: "Contract research",
}

/** Every form the researcher consented to, with their own wording (conditions often live in it). */
export function consentedForms(r: Researcher): { form: CollabForm; wording: string }[] {
	const out: { form: CollabForm; wording: string }[] = []
	for (const form of Object.keys(PATTERNS) as CollabForm[]) {
		const wording = (r.open_to ?? []).find((o) => PATTERNS[form].some((re) => re.test(o)))
		if (wording) out.push({ form, wording })
	}
	return out
}

/** The form a proposal for this researcher may take: an industrial PhD only with explicit consent to supervise one. */
export function proposalForm(r: Researcher): { form: CollabForm; wording: string } | null {
	const forms = consentedForms(r)
	return forms.find((f) => f.form === "industrial_phd") ?? forms.find((f) => f.form === "joint_project") ?? forms.find((f) => f.form === "contract_research") ?? null
}

export function isOpenToCollaboration(r: Researcher): boolean {
	return proposalForm(r) !== null
}
