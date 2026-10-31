// Deadline fit: a proposal must meet the time limit the company itself states.
// Run 8 showed why: Kredo needs explanations "in production within about six months", and the
// live proposal put production in year 3. The claims check could not see that, because every
// fact in it was true; the plan just did not fit.
//
// The Writer fills `company_deadline` with the company's own words, or "none stated". This file
// checks, with no model:
//   - a quoted limit is really in the challenge text (no invented deadline)
//   - "none stated" is not used when the challenge plainly states one ("we need ... within N months")
//   - a limit under a year has a plan period, in months or weeks, that ends by then
// It recognises "within (about) N months/weeks" in English and "u roku od N meseci/nedelja" in
// Serbian. Limits phrased differently ("before next season", "by Q3") are only checked for
// quoting; a human still has to judge them.
import type { Dataset } from "../data/dataset"
import type { ProseIssue } from "./coverage"

const WORDS: Record<string, number> = {
	one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, eighteen: 18, "twenty-four": 24,
	jedan: 1, jednog: 1, dva: 2, dve: 2, tri: 3, četiri: 4, pet: 5, šest: 6, sedam: 7, osam: 8, devet: 9, deset: 10, jedanaest: 11, dvanaest: 12, osamnaest: 18,
}
const NUM = `(\\d+|${Object.keys(WORDS).join("|")})`
const SPAN = new RegExp(
	`(?:within|u roku od)\\s+(?:the next\\s+)?(?:about|roughly|around|oko|otprilike)?\\s*${NUM}(?:\\s*(?:to|-|–|do)\\s*${NUM})?\\s+(months?|weeks?|meseci|meseca|mesec|nedelja|nedelje)`,
	"iu",
)
// A sentence counts as a time limit only when it is about getting something done, not about how fast a part corrodes.
const INTENT = /\b(need|want|would like|looking for|require|deliver|deploy|testable|pilot|working|in place|production|outcome|target|usable|proof of concept|prototype|solution|resolve|close|demonstr)|\b(treba|želimo|potrebn|rok|demonstrir|uslov)/iu

const num = (s: string) => (/^\d+$/.test(s) ? Number(s) : (WORDS[s.toLowerCase()] ?? NaN))

/** Months in a phrase like "within about six months" or "u roku od šest nedelja" (weeks count as a fraction of a month). */
export function monthsIn(text: string): number | undefined {
	const m = text.match(SPAN)
	if (!m) return undefined
	const n = Math.max(num(m[1]), m[2] ? num(m[2]) : 0)
	if (!Number.isFinite(n)) return undefined
	return /week|nedelj/i.test(m[3]) ? n / 4.3 : n
}

/** The tightest time limit a challenge states for an outcome, if it states one this file can read. */
export function statedDeadline(text: string): { sentence: string; months: number } | undefined {
	let best: { sentence: string; months: number } | undefined
	for (const sentence of text.split(/(?<=[.!?])\s+/)) {
		// The intent has to come before the time span ("we need X within six months"), not after it
		// ("the probe corrodes within six weeks, so we have to replace it").
		const span = sentence.match(SPAN)
		const intent = sentence.match(INTENT)
		if (!span || !intent || intent.index! > span.index!) continue
		const months = monthsIn(sentence)
		if (months !== undefined && (!best || months < best.months)) best = { sentence: sentence.trim(), months }
	}
	return best
}

const norm = (s: string) =>
	s
		.toLowerCase()
		.replace(/[“”"'‘’]/g, "")
		.replace(/[—–]/g, "-")
		.replace(/\s+/g, " ")
		.replace(/[.\s]+$/, "")
		.trim()

/** The last month a plan period label covers ("Months 1 to 6" -> 6, "Weeks 1-8" -> about 1.9), or undefined for "Year 1". */
function periodEndMonths(label: string): number | undefined {
	const unit = label.match(/month|mesec|week|nedelj/i)
	if (!unit) return undefined
	const nums = [...label.matchAll(/\d+/g)].map((m) => Number(m[0]))
	if (!nums.length) return undefined
	const end = Math.max(...nums)
	return /week|nedelj/i.test(unit[0]) ? end / 4.3 : end
}

/** The last month a plan period covers, for "Year 3" (36) as well as "Months 19 to 36" (36). */
export function periodEnd(label: string): number | undefined {
	const year = label.match(/\b(?:year|godina)\s*(\d+)/i)
	if (year) return Number(year[1]) * 12
	return periodEndMonths(label)
}

/**
 * An industrial PhD runs about three years. Run 10 met Kredo's six-month limit by shrinking the whole
 * PhD plan to six months; the deadline needs a delivery period, not a shorter doctorate.
 */
export function checkPhdLength(proposal: Record<string, unknown>): ProseIssue[] {
	if (proposal.form !== "industrial_phd" || !Array.isArray(proposal.plan) || !proposal.plan.length) return []
	const ends = (proposal.plan as { period?: string; year?: number }[]).map((p) => (p.period ? periodEnd(p.period) : p.year ? p.year * 12 : undefined))
	if (ends.some((e) => e === undefined)) return [] // a label this check cannot read; leave it to the reader
	const last = Math.max(...(ends as number[]))
	if (last >= 36) return []
	return [
		{
			field: "plan",
			excerpt: (proposal.plan as { period?: string }[]).map((p) => p.period).join(", "),
			why: `an industrial PhD plan must run about three years, but this one ends after ${last} months: keep the early delivery period for the company and continue to Year 3`,
		},
	]
}

export function checkDeadline(ds: Dataset, pair: { challengeId: string }, proposal: Record<string, unknown>): ProseIssue[] {
	const value = proposal.company_deadline
	if (typeof value !== "string") return [] // recorded before this check existed
	const ch = ds.challenges.get(pair.challengeId)?.challenge
	if (!ch) return [] // reverse-search input: no dataset challenge to check against
	const challengeText = `${ch.text} ${ch.detail ?? ""}`
	const stated = statedDeadline(challengeText)
	const issues: ProseIssue[] = []
	const v = value.trim()

	let months: number | undefined
	if (/^none stated\.?$/i.test(v)) {
		if (stated)
			issues.push({
				field: "company_deadline",
				excerpt: stated.sentence.slice(0, 160),
				why: `the challenge states a time limit ("${stated.sentence.slice(0, 120)}"): quote it in company_deadline and plan to meet it`,
			})
		months = stated?.months
	} else {
		if (!norm(challengeText).includes(norm(v)))
			issues.push({ field: "company_deadline", excerpt: v.slice(0, 160), why: `company_deadline must quote the challenge word for word, or say "none stated"; "${v.slice(0, 80)}" is not in ${pair.challengeId}` })
		months = monthsIn(v) ?? stated?.months
	}

	// A limit under a year needs a plan period, in months or weeks, that ends by then.
	if (months !== undefined && months < 12) {
		const plan = Array.isArray(proposal.plan) ? (proposal.plan as { period?: string }[]) : []
		const fits = plan.some((p) => {
			const end = periodEndMonths(p.period ?? "")
			return end !== undefined && end <= months! + 0.01
		})
		if (!fits) {
			const m = Math.round(months * 10) / 10
			issues.push({
				field: "plan",
				excerpt: plan.map((p) => p.period).join(", "),
				why: `the company needs a result within ${m} months, but no plan period ends by then: add a period such as "Months 1 to ${Math.max(1, Math.floor(months))}" that delivers what the company asked for (a PhD can continue after it)`,
			})
		}
	}
	return issues
}
