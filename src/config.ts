// Run configuration. Live API calls need BOTH the --live flag and ALLOW_LIVE=1,
// so nothing can spend money by accident. Default is the offline stub.
export const LIVE = process.argv.includes("--live") && process.env.ALLOW_LIVE === "1"
if (process.argv.includes("--live") && !LIVE) {
	console.error("Refusing --live without ALLOW_LIVE=1 in the environment.")
	process.exit(2)
}

export function argNum(name: string, fallback: number): number {
	const i = process.argv.indexOf(`--${name}`)
	return i >= 0 ? Number(process.argv[i + 1]) : fallback
}

/** Ablation switch: the Critic still checks and records, but lets everything through. */
export const CRITIC_ENFORCES = !process.argv.includes("--no-critic")

export const MODELS = {
	profiler: "gpt-5.4-mini",
	analyst: "gpt-5.4-mini",
	writer: "gpt-5.4-mini",
	decisions: "gpt-6-luna",
} as const

/** USD per 1M tokens. Sources: OpenAI model page for gpt-5.4-mini; OpenAI Decisions API announcement (Oct 22, 2026). */
export const PRICES: Record<string, { input: number; output: number }> = {
	"gpt-5.4-mini": { input: 0.75, output: 4.5 },
	"decisions:gpt-6-luna": { input: 0.1, output: 0 },
}

export const BUDGET_USD = Number(process.env.BUDGET_USD ?? 1)

export const TUNING = {
	challenges: argNum("challenges", 60), // how many company challenges to screen this run
	perChallenge: 3, // shortlist size per challenge
	proposals: argNum("proposals", 3), // how many pairs to carry to a written proposal
	screeners: 3,
	profilers: 2,
	analysts: 2,
	writers: 2,
	selectThreshold: 2.0, // Decisions score (0 none .. 3 strong) needed for early selection
	supportThreshold: 0.5, // Decisions predicate probability needed for a claim to count as supported
	maxRevisions: 2,
	jobTimeoutMs: Number(process.env.JOB_TIMEOUT_MS ?? 90_000),
	runTimeoutMs: Number(process.env.RUN_TIMEOUT_MS ?? 600_000),
	screenBatch: 6, // challenges per Decisions request (3 pair questions each)
}
