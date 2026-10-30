export const secs = (ms: number, digits = 1) => `${(ms / 1000).toFixed(digits)}s`
export const usd = (n: number) => (n < 0.01 ? `$${n.toFixed(4)}` : `$${n.toFixed(3)}`)
export const surname = (name: string) => name.split(" ").slice(-1)[0]
export const pct = (p: number | null | undefined) => (p === null || p === undefined ? "" : p.toFixed(2))

/** Short human label for a dataset id, used on source chips. */
export function sourceKind(id: string): string {
	if (id.startsWith("SYN-PUB")) return "Paper"
	if (id.startsWith("SYN-PRJ")) return "Project"
	if (id.startsWith("SYN-PAT")) return "Patent"
	if (/^[CQ]\d+-CH\d+$/.test(id)) return "Challenge"
	if (/^[CQ]\d+$/.test(id)) return "Company"
	if (/^R\d+$/.test(id)) return "Researcher"
	return "Record"
}
