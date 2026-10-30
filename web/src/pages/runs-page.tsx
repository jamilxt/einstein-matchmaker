import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ReplayControls, RunStage, useReplay } from "@/components/run-stage"
import { api, type RunSummary, type RunView } from "@/lib/api"
import { secs, usd } from "@/lib/format"
import { cn } from "@/lib/utils"

export function RunsPage({ runs, selected, go }: { runs: RunSummary[]; selected: string | null; go: (hash: string) => void }) {
	const id = selected ?? runs[0]?.id ?? null
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Recorded runs</h1>
				<p className="max-w-[64ch] text-muted-foreground">Real runs against the OpenAI APIs, replayed from their trace. Nothing here calls a model, so you can watch as often as you like.</p>
			</div>
			<div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 xl:grid-cols-4">
				{runs.length === 0 &&
					Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-24 min-w-64 md:min-w-0" />)}
				{runs.map((r) => (
					<button
						key={r.id}
						type="button"
						ref={(el) => {
							if (el && r.id === id) el.scrollIntoView({ block: "nearest", inline: "nearest" })
						}}
						onClick={() => go(`#/runs/${r.id}`)}
						className="min-w-64 snap-start text-left md:min-w-0"
					>
						<Card className={cn("h-full gap-1 px-4 py-3 transition-colors hover:border-primary/50", r.id === id && "border-primary ring-1 ring-primary/30")}>
							<p className="text-sm font-medium">{r.label}</p>
							<p className="text-xs text-muted-foreground tabular">
								{r.proposals} proposals, peak {r.peakInFlight} agents, {secs(r.wallClockMs)}
							</p>
							<p className="text-xs text-muted-foreground tabular">
								{r.criticEnforcing ? "Critic on" : "Critic off"}, cost {usd(r.spendUsd)}
							</p>
						</Card>
					</button>
				))}
			</div>
			{id && <Replay key={id} id={id} />}
		</div>
	)
}

function Replay({ id }: { id: string }) {
	const [view, setView] = useState<RunView | null>(null)
	const [err, setErr] = useState<string | null>(null)
	useEffect(() => {
		api.run(id).then(setView, (e) => setErr(e.message))
	}, [id])
	if (err)
		return (
			<Alert variant="destructive">
				<AlertTitle>Could not load this run</AlertTitle>
				<AlertDescription>{err}</AlertDescription>
			</Alert>
		)
	if (!view)
		return (
			<div className="space-y-4">
				<Skeleton className="h-20 w-full" />
				<div className="grid gap-6 xl:grid-cols-2">
					<Skeleton className="h-72" />
					<Skeleton className="h-72" />
				</div>
			</div>
		)
	return <Loaded view={view} />
}

function Loaded({ view }: { view: RunView }) {
	const total = view.wallClockMs
	const r = useReplay(total)
	return (
		<RunStage
			trace={view.trace}
			now={r.now}
			total={total}
			view={view}
			criticEnforcing={view.criticEnforcing}
			runId={view.id}
			controls={<ReplayControls r={r} total={total} />}
			status={
				<>
					{view.reverse && view.input ? <>Search by {view.input.company}. </> : <>{view.shortlist.pairs} pairs over {view.shortlist.challenges} company challenges. </>}
					Models: {Object.values(view.models).filter((v, i, a) => a.indexOf(v) === i).join(", ")}.
				</>
			}
		/>
	)
}
