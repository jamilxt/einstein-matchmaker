import { useEffect, useRef, useState } from "react"
import { ArrowRight, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RunStage } from "@/components/run-stage"
import { api, type RunSummary, type RunView, type ServerConfig, type TraceEvent } from "@/lib/api"
import { usd } from "@/lib/format"

// Test inputs written for this demo (not real companies). Also in examples/*.json.
const EXAMPLES = [
	{
		label: "Winery: stalled fermentations",
		company: "Example winery, Fruška Gora",
		problem:
			"Every harvest two or three of our 40 stainless fermentation tanks get stuck: sugar stops dropping for days and we only notice at the morning density check. We log tank temperature every 10 minutes and density twice a day, but nobody looks at the curves together. We want an early warning, ideally 24 hours before a fermentation stalls, that our cellar master can trust and act on.",
	},
	{
		label: "Delivery vans: noisy GPS",
		company: "Example parcel firm, Novi Sad",
		problem:
			"Our 60 vans send a GPS point every 30 seconds, but in the old town and between tall buildings the points jump by 50 to 100 metres and sometimes drop out for minutes. We bill customers by stop time and plan routes from historic trips, so wrong positions cost us money. We need reliable stop detection and arrival times from noisy, low-frequency GPS traces.",
	},
	{
		label: "Packaging line: bearing failures",
		company: "Example packaging plant, Subotica",
		problem:
			"Bearings on our conveyor drive motors fail without warning about once a quarter and each stop halts a packaging line for most of a shift. We could add vibration sensors to 24 motors, but we have no one who knows how to turn vibration data into a maintenance decision. We want to predict a bearing failure a week ahead and know which data to collect.",
	},
]

type Phase = "idle" | "starting" | "running" | "done" | "error"

export function SearchPage({ config, runs, go }: { config: ServerConfig | null; runs: RunSummary[]; go: (hash: string) => void }) {
	const [company, setCompany] = useState("")
	const [problem, setProblem] = useState("")
	const [phase, setPhase] = useState<Phase>("idle")
	const [error, setError] = useState<string | null>(null)
	const [runId, setRunId] = useState<string | null>(null)
	const [trace, setTrace] = useState<TraceEvent[]>([])
	const [view, setView] = useState<RunView | null>(null)
	const [now, setNow] = useState(0)
	const clock = useRef({ t: 0, at: 0 })
	const stageRef = useRef<HTMLDivElement>(null)

	const recordedSearch = runs.find((r) => r.reverse)
	const live = !!config?.liveSearch
	const remaining = config ? Math.max(0, config.totalBudgetUsd - config.spentUsd) : 0
	const tooShort = problem.trim().length < 80

	// Live clock: last trace timestamp plus wall time since it arrived.
	useEffect(() => {
		if (phase !== "running") return
		const id = window.setInterval(() => {
			if (clock.current.at) setNow(clock.current.t + (Date.now() - clock.current.at))
		}, 100)
		return () => window.clearInterval(id)
	}, [phase])

	async function submit(e: React.FormEvent) {
		e.preventDefault()
		if (tooShort) return
		setError(null)
		setPhase("starting")
		setTrace([])
		setView(null)
		setNow(0)
		try {
			const { id } = await api.search(company, problem)
			setRunId(id)
			setPhase("running")
			clock.current = { t: 0, at: 0 } // the clock starts with the first event, not the click
			stageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
			const es = new EventSource(`/api/stream/${id}`)
			es.addEventListener("trace", (m) => {
				const ev = JSON.parse((m as MessageEvent).data) as TraceEvent
				clock.current = { t: ev.t, at: Date.now() }
				setTrace((t) => [...t, ev])
			})
			es.addEventListener("done", async () => {
				es.close()
				const v = await api.run(id)
				setView(v)
				setNow(v.wallClockMs)
				setPhase("done")
			})
			es.addEventListener("failed", () => {
				es.close()
				setError("The search stopped before it finished. Nothing more will be spent; try again in a minute.")
				setPhase("error")
			})
		} catch (err: any) {
			setError(err.message ?? String(err))
			setPhase("error")
		}
	}

	const busy = phase === "starting" || phase === "running"

	return (
		<div className="space-y-10">
			<section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
				<div className="space-y-3 pt-2">
					<h1 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">Describe a problem. Meet the researchers who can solve it.</h1>
					<p className="max-w-[56ch] text-muted-foreground">
						A team of AI agents searches 1,047 University of Novi Sad researchers, checks who fits, and drafts a proposal: an industrial PhD or a joint project, depending on what each researcher agreed to. Every claim links to the record it came from.
					</p>
					<div className="grid gap-4 pt-4 text-sm sm:grid-cols-2">
						<Fact title="Fit, not fame" body="Pairs are scored on how well the expertise matches your problem. People are never ranked against each other." />
						<Fact title="Only who said yes" body="Each researcher only gets the kind of collaboration they said yes to. Nobody else is proposed." />
						<Fact title="Claims you can check" body="A Critic agent blocks any sentence its sources do not support." />
						<Fact title="Seconds, not weeks" body="Screening, profiling and writing run in parallel, so a search takes well under a minute." />
					</div>
				</div>

				<form onSubmit={submit} className="space-y-4 rounded-lg border bg-card p-5 shadow-sm shadow-primary/5 md:p-6">
					<div className="space-y-2">
						<Label htmlFor="company">Company</Label>
						<Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Vinarija Kovač" maxLength={120} disabled={busy} />
					</div>
					<div className="space-y-2">
						<Label htmlFor="problem">The problem, in your own words</Label>
						<Textarea
							id="problem"
							value={problem}
							onChange={(e) => setProblem(e.target.value)}
							rows={7}
							className="min-h-40"
							maxLength={4000}
							disabled={busy}
							placeholder="What goes wrong, how often, what it costs, what data you already have, and what a good outcome looks like."
							aria-describedby="problem-help"
						/>
						<p id="problem-help" className="flex justify-between text-xs text-muted-foreground">
							<span>Numbers help: volumes, error rates, deadlines.</span>
							<span className="tabular">{problem.trim().length} / 80 min</span>
						</p>
					</div>
					<div className="space-y-2">
						<p className="text-xs text-muted-foreground">Or start from an example (test inputs, not real companies):</p>
						<div className="flex flex-wrap gap-2">
							{EXAMPLES.map((x) => (
								<button
									key={x.label}
									type="button"
									disabled={busy}
									onClick={() => {
										setCompany(x.company)
										setProblem(x.problem)
									}}
									className="rounded-md border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground active:scale-[0.98] disabled:opacity-50"
								>
									{x.label}
								</button>
							))}
						</div>
					</div>

					{!live && config && (
						<Alert>
							<AlertTitle>Live search is switched off here</AlertTitle>
							<AlertDescription>
								Each search calls paid AI models, so this public copy only replays recorded runs. To run your own,{" "}
								<a href="https://github.com/jamilxt/einstein-matchmaker#how-to-run" target="_blank" rel="noreferrer" className="underline underline-offset-2">
									clone the repo
								</a>{" "}
								and add an OpenAI key.
								{recordedSearch && (
									<Button variant="link" className="h-auto p-0" onClick={() => go(`#/runs/${recordedSearch.id}`)}>
										Watch a recorded search
									</Button>
								)}
							</AlertDescription>
						</Alert>
					)}
					{error && (
						<Alert variant="destructive">
							<AlertTitle>Search did not run</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
						<p className="text-xs text-muted-foreground tabular">{live && config ? `Up to ${usd(config.perSearchBudgetUsd)} per search. ${usd(remaining)} left in the demo budget. Searches are saved and replayable, so use a test description.` : ""}</p>
						<Button type="submit" disabled={!live || busy || tooShort} className="sm:min-w-44">
							{busy ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
							{busy ? "Searching" : "Find researchers"}
						</Button>
					</div>
				</form>
			</section>

			<div ref={stageRef} className="scroll-mt-20">
				{phase !== "idle" && phase !== "error" && (
					<section className="space-y-4">
						<h2 className="text-xl font-semibold tracking-tight">{phase === "done" ? "Your matches" : "The team is working on your problem"}</h2>
						<RunStage
							trace={view?.trace ?? trace}
							now={view ? view.wallClockMs : now}
							total={view ? view.wallClockMs : Math.max(30_000, now + 2000)}
							view={view}
							criticEnforcing
							runId={runId ?? undefined}
							status={phase === "done" ? <>Finished. You can replay this search any time from Recorded runs.</> : trace.length ? <>Live. Events stream from the running agents.</> : <>Starting the agent team and loading the dataset...</>}
						/>
					</section>
				)}
			</div>
		</div>
	)
}

function Fact({ title, body }: { title: string; body: string }) {
	return (
		<div className="space-y-1 border-l-2 border-primary/40 pl-3">
			<p className="font-medium">{title}</p>
			<p className="text-muted-foreground">{body}</p>
		</div>
	)
}
