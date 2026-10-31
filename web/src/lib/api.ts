// Types mirror src/view.ts on the server.
export type TraceEvent = { t: number; type: string; by: string; data: any }
export type ViewClaim = { claim: string; evidence: string[]; support: number | null; supported: boolean; deterministic?: string[] }
export type Blocked = { claim: string; evidence: string[]; why: string }
export type ViewProposal = {
	key: string
	verdict: string
	drafts: number
	score: number | null
	researcherId: string
	researcher: string
	researcherTitle: string
	department: string
	companyId: string
	company: string
	challengeId: string
	title: string
	problem: string
	research_questions: string[]
	form: "industrial_phd" | "joint_project" | "contract_research" | null
	consent: string | null
	/** false when the Critic rejected the last draft: nothing is shown but the outcome and its reasons. */
	released: boolean
	plan: { period?: string; year?: number | string; work: string; result: string; pass_if?: string; owner?: string }[]
	baseline?: string
	risks?: { risk: string; stop_if: string }[]
	novelty: string
	data_status: string
	company_deadline?: string
	to_agree: string
	company_brings: string
	faculty_brings: string
	why_this_pair: string
	first_step: string
	claims: ViewClaim[]
	attempts: { attempt: number; verdict: string; blocked: Blocked[] }[]
}
export type Candidate = { key: string; researcherId: string; researcher: string; title: string; department: string; challengeId: string; companyId: string; company: string }
export type RunView = {
	id: string
	live: boolean
	criticEnforcing: boolean
	reverse: boolean
	input: { company: string; problem: string } | null
	wallClockMs: number
	spendUsd: number
	budgetUsd: number
	models: Record<string, string>
	concurrency: { jobs: number; peakInFlight: number; peakAtMs: number; inFlightAtPeak: string[]; jobsOverlappingAnotherAgent: number }
	critic: { drafts: number; revisionsRequested: number; claimsChecked: number; claimsBlocked: number; unsupportedClaimsInFinalProposals: number }
	shortlist: { pairs: number; challenges: number }
	candidates: Candidate[]
	jobs: { jobId: string; agent: string; kind: string; startedAt: number; finishedAt: number; status: string }[]
	proposals: ViewProposal[]
	trace: TraceEvent[]
}
export type RunSummary = {
	id: string
	label: string
	reverse: boolean
	live: boolean
	criticEnforcing: boolean
	proposals: number
	peakInFlight: number
	wallClockMs: number
	spendUsd: number
	company: string | null
	evidence: boolean
}
export type ServerConfig = { liveSearch: boolean; activeSearch: string | null; perSearchBudgetUsd: number; spentUsd: number; searches: number; totalBudgetUsd: number }
export type SourceRecord = { id: string; kind: string; text: string }

async function get<T>(url: string): Promise<T> {
	const r = await fetch(url)
	if (!r.ok) throw new Error((await r.json().catch(() => ({})))?.error ?? `Request failed (${r.status})`)
	return r.json()
}

export const api = {
	config: () => get<ServerConfig>("/api/config"),
	runs: () => get<RunSummary[]>("/api/runs"),
	run: (id: string) => get<RunView>(`/api/runs/${encodeURIComponent(id)}`),
	record: (id: string, run?: string) => get<SourceRecord>(`/api/record/${encodeURIComponent(id)}${run ? `?run=${encodeURIComponent(run)}` : ""}`),
	async search(company: string, problem: string): Promise<{ id: string }> {
		const r = await fetch("/api/search", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ company, problem }) })
		const body = await r.json().catch(() => ({}))
		if (!r.ok) throw new Error(body.error ?? `Search failed (${r.status})`)
		return body
	},
}
