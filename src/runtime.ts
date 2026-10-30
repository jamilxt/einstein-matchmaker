// Shared runtime state. Every participant reads and writes this one object;
// there is no hidden second store and no central scheduler.
import { defineRuntime, RuntimeState, SemanticEvent } from "@mozaik-ai/core"
import type { Dataset } from "./data/dataset"
import type { CandidatePair } from "./data/shortlist"
import type { Claim } from "./verify/citations"
import { BUDGET_USD, PRICES } from "./config"

export const pairKey = (p: { researcherId: string; challengeId: string }) => `${p.researcherId}x${p.challengeId}`

export type Screened = CandidatePair & { score: number; confidence: number; screener: string }

export type Selection = Screened & {
	key: string
	selectedAt: number
	profiler: string
	analyst: string
	writer?: string
	status: "profiling" | "writing" | "done"
}

export type ResearcherProfile = { researcherId: string; summary: string; expertise: { topic: string; evidence: string[] }[] }
export type CompanyProfile = { challengeId: string; companyId: string; summary: string; needs: { need: string; evidence: string[] }[] }

export type Proposal = {
	title: string
	problem: string
	research_questions: string[]
	plan: { year: number; work: string; result: string }[]
	company_brings: string
	faculty_brings: string
	why_this_pair: string
	first_step: string
	claims: Claim[]
}

export type ClaimCheck = { claim: string; evidence: string[]; deterministic: string[]; support?: number; supported: boolean }

export type ProposalRecord = {
	key: string
	attempts: { attempt: number; proposal: Proposal; checks: ClaimCheck[]; verdict: "approve" | "revise" | "reject" }[]
	final?: Proposal
	verdict?: "approved" | "rejected" | "shipped_unchecked"
}

export type JobRecord = {
	jobId: string
	agent: string
	kind: string
	startedAt: number
	finishedAt?: number
	status: "running" | "done" | "stalled" | "halted" | "failed"
	retried?: boolean
}

export class MatchState extends RuntimeState {
	runId = new Date().toISOString().replace(/[:.]/g, "-")
	t0 = Date.now()
	ds!: Dataset
	candidates: CandidatePair[] = []
	screened = new Map<string, Screened>()
	screeningDone = 0
	selected = new Map<string, Selection>()
	usedResearchers = new Set<string>()
	usedCompanies = new Set<string>()
	researcherProfiles = new Map<string, ResearcherProfile>()
	companyProfiles = new Map<string, CompanyProfile>()
	profileInFlight = new Set<string>()
	proposals = new Map<string, ProposalRecord>()
	jobs = new Map<string, JobRecord>()
	spend = { usd: 0, byModel: {} as Record<string, { input: number; output: number; usd: number; calls: number }> }
	halted = false
	finished = false

	now(): number {
		return Date.now() - this.t0
	}

	/** Meter one model call. Halts the run once the budget is spent. */
	charge(model: string, inputTokens: number, outputTokens: number): void {
		const price = PRICES[model] ?? { input: 0, output: 0 }
		const usd = (inputTokens * price.input + outputTokens * price.output) / 1_000_000
		const m = (this.spend.byModel[model] ??= { input: 0, output: 0, usd: 0, calls: 0 })
		m.input += inputTokens
		m.output += outputTokens
		m.usd += usd
		m.calls += 1
		this.spend.usd += usd
		if (this.spend.usd >= BUDGET_USD && !this.halted) {
			this.halted = true
			console.log(`[budget] $${this.spend.usd.toFixed(4)} >= cap $${BUDGET_USD}: halting new model calls`)
		}
	}
}

export const { initializeRuntime, resolveRuntime, resolveParticipant, join, sendEvent, runLoop } = defineRuntime<MatchState>()

export const state = (): MatchState => resolveRuntime().state

export function emit(type: string, producerId: string, payload: Record<string, unknown>): void {
	sendEvent(SemanticEvent.create(type, producerId, payload), producerId)
}
