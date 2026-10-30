// Turns a trace (recorded or streaming) into what the screen shows at time `now`.
// Replays and live searches both go through this one function, so they look identical.
import type { Candidate, TraceEvent } from "./api"

export const LANES = ["Screener-1", "Screener-2", "Screener-3", "Profiler-1", "Profiler-2", "Analyst-1", "Analyst-2", "Writer-1", "Writer-2", "Critic"] as const

export type LaneBar = { id: string; agent: string; kind: string; start: number; end: number; running: boolean; tone: "screen" | "profile" | "write" | "approve" | "revise" }
export type CriticEntry = { t: number; key: string; attempt: number; verdict: string; wouldHave?: string; blocked: { claim: string; evidence: string[]; why: string }[] }
export type PairState = { key: string; score?: number; selected: boolean; selectedAt?: number; finished: boolean; verdict?: string; revising: boolean }

export type Snapshot = {
	now: number
	bars: LaneBar[]
	inFlight: number
	peak: { n: number; at: number }
	screened: { done: number; total: number }
	pairs: Map<string, PairState>
	selectedOrder: string[]
	critic: CriticEntry[]
	finishedKeys: Set<string>
	candidates: Candidate[]
	ended: boolean
	spend?: number
	phase: "starting" | "screening" | "profiling" | "writing" | "done" | "idle"
}

export function candidatesFrom(trace: TraceEvent[]): Candidate[] {
	return trace.find((e) => e.type === "run.meta")?.data.candidates ?? []
}

export function derive(trace: TraceEvent[], now: number, fallbackCandidates: Candidate[] = []): Snapshot {
	const bars = new Map<string, LaneBar>()
	const pairs = new Map<string, PairState>()
	const critic: CriticEntry[] = []
	const selectedOrder: string[] = []
	const finishedKeys = new Set<string>()
	const reviewOpen = new Map<string, number>()
	let screened = { done: 0, total: 0 }
	let ended = false
	let spend: number | undefined
	const candidates = fallbackCandidates.length ? fallbackCandidates : candidatesFrom(trace)
	for (const c of candidates) pairs.set(c.key, { key: c.key, selected: false, finished: false, revising: false })

	for (const e of trace) {
		if (e.t > now) break
		const d = e.data
		switch (e.type) {
			case "job.started": {
				const tone = d.kind === "screen" ? "screen" : d.kind === "write" ? "write" : "profile"
				bars.set(d.jobId, { id: d.jobId, agent: d.agent, kind: d.kind, start: e.t, end: now, running: true, tone })
				break
			}
			case "job.finished": {
				const b = bars.get(d.jobId)
				if (b) Object.assign(b, { end: e.t, running: false })
				break
			}
			case "pair.screened": {
				const p: PairState = pairs.get(d.key) ?? { key: d.key, selected: false, finished: false, revising: false }
				p.score = d.score
				pairs.set(d.key, p)
				break
			}
			case "screen.progress":
				screened = { done: d.done, total: d.total }
				break
			case "pair.selected": {
				const p: PairState = pairs.get(d.key) ?? { key: d.key, selected: false, finished: false, revising: false }
				Object.assign(p, { selected: true, selectedAt: e.t, score: d.score })
				pairs.set(d.key, p)
				selectedOrder.push(d.key)
				break
			}
			case "critic.review.started":
				reviewOpen.set(`${d.key}#${d.attempt}`, e.t)
				bars.set(`critic-${d.key}-${d.attempt}`, { id: `critic-${d.key}-${d.attempt}`, agent: "Critic", kind: "review", start: e.t, end: now, running: true, tone: "approve" })
				break
			case "critic.verdict": {
				critic.push({ t: e.t, key: d.key, attempt: d.attempt, verdict: d.verdict, wouldHave: d.wouldHave, blocked: d.blocked ?? [] })
				const b = bars.get(`critic-${d.key}-${d.attempt}`)
				const sentBack = d.verdict === "revise" || d.wouldHave === "revise"
				if (b) Object.assign(b, { end: Math.max(e.t, b.start + 1), running: false, tone: sentBack ? "revise" : "approve" })
				const p = pairs.get(d.key)
				if (p) p.revising = d.verdict === "revise"
				break
			}
			case "proposal.finished": {
				finishedKeys.add(d.key)
				const p = pairs.get(d.key)
				if (p) Object.assign(p, { finished: true, verdict: d.verdict, revising: false })
				break
			}
			case "run.end":
				ended = true
				spend = d.spendUsd
				break
		}
	}
	const all = [...bars.values()].map((b) => (b.running ? { ...b, end: Math.max(now, b.start + 1) } : b))

	// Measured concurrency at `now` and the peak so far (jobs only, the same rule the report uses).
	const jobs = all.filter((b) => b.agent !== "Critic")
	const inFlight = jobs.filter((b) => b.start <= now && (b.running || b.end > now)).length
	const edges = jobs.flatMap((b) => [{ t: b.start, d: 1 }, ...(b.running ? [] : [{ t: b.end, d: -1 }])]).sort((a, b) => a.t - b.t || a.d - b.d)
	let cur = 0
	let peak = { n: 0, at: 0 }
	for (const x of edges) {
		cur += x.d
		if (cur > peak.n) peak = { n: cur, at: x.t }
	}

	const runningKinds = new Set(jobs.filter((b) => b.running).map((b) => b.tone))
	const phase: Snapshot["phase"] = ended ? "done" : runningKinds.has("write") ? "writing" : runningKinds.has("profile") ? "profiling" : runningKinds.has("screen") ? "screening" : trace.length ? "starting" : "idle"
	return { now, bars: all, inFlight, peak, screened, pairs, selectedOrder, critic, finishedKeys, candidates, ended, spend, phase }
}
