// Plan shape: what a reviewer needs to judge a pilot, checked with no model.
// Added after comparing run 12 with how careful collaboration briefs are written:
//   - a baseline: what the targets are compared against (today's way of working, or "measure it first")
//   - risks, each with a point at which the work should stop
//   - an owner for every plan period (who delivers it)
//   - no gap in time between plan periods (run 12's Kredo plan went from month 6 straight to Year 2)
// Proposals recorded before these fields existed are left alone, so old runs still verify the same way.
import type { ProseIssue } from "./coverage"

/** First and last month a plan period covers: "Months 7 to 12" -> [7, 12], "Year 2" -> [13, 24], "Weeks 1 to 8" -> [1, 2]. */
export function periodSpan(label: string): [number, number] | undefined {
	const years = [...label.matchAll(/\b(?:years?|godin[aeu]?)\s*(\d+)(?:\s*(?:to|-|do|and|i)\s*(\d+))?/gi)][0]
	if (years) {
		const a = Number(years[1])
		const b = years[2] ? Number(years[2]) : a
		return [(a - 1) * 12 + 1, b * 12]
	}
	const unit = label.match(/month|mesec|week|nedelj/i)
	if (!unit) return undefined
	const nums = [...label.matchAll(/\d+/g)].map((m) => Number(m[0]))
	if (!nums.length) return undefined
	const toMonths = (n: number, start: boolean) => (/week|nedelj/i.test(unit[0]) ? (start ? Math.floor((n - 1) / 4.3) + 1 : Math.ceil(n / 4.3)) : n)
	return [toMonths(Math.min(...nums), true), toMonths(Math.max(...nums), false)]
}

const blank = (v: unknown) => typeof v !== "string" || v.trim().length < 12

export function checkPlanShape(proposal: Record<string, unknown>): ProseIssue[] {
	if (!("baseline" in proposal) && !("risks" in proposal)) return [] // recorded before this check existed
	const issues: ProseIssue[] = []
	const plan = Array.isArray(proposal.plan) ? (proposal.plan as { period?: string; owner?: string }[]) : []

	if (blank(proposal.baseline))
		issues.push({ field: "baseline", excerpt: "", why: "no baseline: say what the targets are compared against (today's way of working, from the records), or plan to measure it first" })

	const risks = Array.isArray(proposal.risks) ? (proposal.risks as { risk?: string; stop_if?: string }[]) : []
	if (risks.length < 2) issues.push({ field: "risks", excerpt: `${risks.length} risks`, why: "list at least two real risks of this collaboration, each with a point at which the work should stop" })
	risks.forEach((r, i) => {
		if (blank(r.risk) || blank(r.stop_if)) issues.push({ field: "risks", excerpt: `risk ${i + 1}`, why: `risk ${i + 1} needs both the risk and a concrete stop_if condition` })
	})

	plan.forEach((p, i) => {
		if (typeof p.owner !== "string" || p.owner.trim().length < 3)
			issues.push({ field: "plan", excerpt: p.period ?? `period ${i + 1}`, why: `plan period "${p.period ?? i + 1}" has no owner: say who delivers it (a role on either side, or a person named in the records)` })
	})

	// No gap in time between periods, read in order of start month.
	const spans = plan.map((p) => ({ label: p.period ?? "", span: periodSpan(p.period ?? "") }))
	if (spans.length > 1 && spans.every((s) => s.span)) {
		const sorted = [...spans].sort((a, b) => a.span![0] - b.span![0])
		for (let i = 1; i < sorted.length; i++) {
			const prevEnd = Math.max(...sorted.slice(0, i).map((s) => s.span![1]))
			const start = sorted[i].span![0]
			if (start > prevEnd + 1)
				issues.push({
					field: "plan",
					excerpt: `${sorted[i - 1].label}, then ${sorted[i].label}`,
					why: `the plan jumps from month ${prevEnd} ("${sorted[i - 1].label}") to month ${start} ("${sorted[i].label}"): add a period for months ${prevEnd + 1} to ${start - 1}, or relabel so the periods follow on`,
				})
		}
	}
	return issues
}
