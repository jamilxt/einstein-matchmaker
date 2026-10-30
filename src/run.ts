// Entry point. `npm start` runs offline (stub model, no key, no cost).
// `ALLOW_LIVE=1 npm start -- --live` uses the real OpenAI APIs, capped by BUDGET_USD.
import "dotenv/config"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join as joinPath } from "node:path"
import { BUDGET_USD, CRITIC_ENFORCES, LIVE, MODELS, TUNING } from "./config"
import { Dataset } from "./data/dataset"
import { ResearcherIndex, shortlistPairs } from "./data/shortlist"
import { buildTeam } from "./agents"
import { emit, initializeRuntime, join, MatchState, state } from "./runtime"
import { StubRunner } from "./stub-runner"
import { writeReport } from "./report"

async function main() {
	const st = new MatchState()
	initializeRuntime({ state: st, inferenceRunnerConfig: LIVE ? undefined : { runner: new StubRunner() } })
	const inputArg = process.argv.find((a) => a.startsWith("--input="))?.split("=")[1]
	const outArg = process.argv.find((a) => a.startsWith("--out="))?.split("=")[1]
	st.reverse = !!inputArg
	const runDir = outArg ?? joinPath("runs", `${st.runId}${st.reverse ? "-reverse" : ""}${LIVE ? "-live" : "-stub"}${CRITIC_ENFORCES ? "" : "-nocritic"}`)
	mkdirSync(runDir, { recursive: true })
	const tracePath = joinPath(runDir, "trace.jsonl")

	console.log(`mode: ${LIVE ? "LIVE (real OpenAI APIs)" : "STUB (offline, no key, no cost)"} | critic ${CRITIC_ENFORCES ? "enforcing" : "OFF (ablation)"} | budget $${BUDGET_USD}`)
	st.ds = Dataset.load()
	if (st.reverse) {
		// Reverse search: the company's own words become a citable record (Q001 / Q001-CH1).
		const input = JSON.parse(readFileSync(inputArg!, "utf-8")) as { company: string; problem: string }
		const company = {
			id: "Q001",
			name: input.company.trim().slice(0, 120) || "The company",
			sector: "not stated",
			employees: 0,
			location: "not stated",
			about: "Described only by the problem statement the company submitted.",
			products: [],
			tech: [],
			challenges: [{ id: "Q001-CH1", text: input.problem.trim().slice(0, 600), detail: input.problem.trim().slice(0, 4000) }],
			plans: "",
			rd_capacity: "not stated",
			past_collaborations: "not stated",
		}
		st.ds.companies.set(company.id, company as any)
		st.ds.challenges.set("Q001-CH1", { challenge: company.challenges[0], company: company as any })
	}
	const index = new ResearcherIndex(st.ds)
	const all = st.reverse ? shortlistPairs(st.ds, index, 9).filter((p) => p.challengeId === "Q001-CH1") : shortlistPairs(st.ds, index, TUNING.perChallenge)
	// Deterministic, spread-out sample of challenges so a run is cheap but not cherry-picked.
	const chIds = [...new Set(all.map((p) => p.challengeId))]
	const step = Math.max(1, Math.floor(chIds.length / TUNING.challenges))
	const picked = st.reverse ? new Set(["Q001-CH1"]) : new Set(chIds.filter((_, i) => i % step === 0).slice(0, TUNING.challenges))
	st.candidates = all.filter((p) => picked.has(p.challengeId))
	console.log(`shortlist: ${st.candidates.length} pairs over ${picked.size} challenges (${index.excluded.length} researchers excluded by open_to)`)

	const team = buildTeam(tracePath)
	join(team.auditor)
	for (const p of [team.coordinator, team.matchmaker, team.critic, ...team.screeners, ...team.profilers, ...team.analysts, ...team.writers]) join(p)

	const finished = new Promise<void>((resolve) => {
		const check = setInterval(() => {
			const s = state()
			const selected = [...s.selected.values()]
			const screeningOver = s.screeningDone >= s.candidates.length
			const allWritten = selected.length > 0 && selected.every((x) => x.status === "done")
			const enough = selected.length >= TUNING.proposals || screeningOver
			const running = [...s.jobs.values()].some((j) => j.status === "running")
			if ((enough && allWritten && !running) || (s.halted && !running) || (screeningOver && selected.length === 0)) {
				clearInterval(check)
				resolve()
			}
		}, 250)
		setTimeout(() => {
			clearInterval(check)
			console.log("[run] run timeout reached")
			resolve()
		}, TUNING.runTimeoutMs)
	})

	state().t0 = Date.now() // timeline starts when the team starts, not at data load
	emit("run.meta", team.coordinator.getId(), {
		reverse: st.reverse,
		live: LIVE,
		team: [...team.screeners, ...team.profilers, ...team.analysts, ...team.writers].map((a) => a.getManifest().name).concat(["Critic"]),
		candidates: st.candidates.map((c) => {
			const r = st.ds.researchers.get(c.researcherId)!
			return { key: `${c.researcherId}x${c.challengeId}`, researcherId: r.id, researcher: r.name, title: r.title, department: r.department, challengeId: c.challengeId, companyId: c.companyId, company: st.ds.companies.get(c.companyId)?.name }
		}),
	})
	emit("run.start", team.coordinator.getId(), { live: LIVE, critic: CRITIC_ENFORCES, models: MODELS, budget: BUDGET_USD })
	await finished
	state().finished = true
	emit("run.end", team.coordinator.getId(), { spendUsd: state().spend.usd })
	await new Promise((r) => setTimeout(r, 300))

	const summary = writeReport(runDir, LIVE)
	writeFileSync(joinPath(runDir, "summary.json"), JSON.stringify(summary, null, 2))
	console.log(`\nrun dir: ${runDir}`)
	process.exit(0)
}

main().catch((e) => {
	console.error("run failed:", e)
	process.exit(1)
})
