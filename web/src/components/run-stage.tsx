import { useEffect, useMemo, useRef, useState } from "react"
import { Pause, Play, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AgentLanes } from "@/components/agent-lanes"
import { CriticFeed } from "@/components/critic-feed"
import { MatchMap } from "@/components/match-map"
import { ProposalView } from "@/components/proposal-view"
import { useSourceSheet } from "@/components/source"
import type { Candidate, RunView, TraceEvent } from "@/lib/api"
import { derive } from "@/lib/derive"
import { secs, surname, usd } from "@/lib/format"
import { cn } from "@/lib/utils"

const SPEEDS = [1, 2, 4]

export function useReplay(total: number, autoplay = true) {
	const [now, setNow] = useState(0)
	const [playing, setPlaying] = useState(autoplay)
	const [speed, setSpeed] = useState(2)
	const last = useRef<number | null>(null)
	useEffect(() => {
		if (!playing) return
		last.current = performance.now()
		const id = window.setInterval(() => {
			const t = performance.now()
			const dt = (t - (last.current ?? t)) * speed
			last.current = t
			setNow((n) => {
				const next = Math.min(total, n + dt)
				if (next >= total) setPlaying(false)
				return next
			})
		}, 50)
		return () => window.clearInterval(id)
	}, [playing, speed, total])
	return {
		now,
		playing,
		speed,
		setSpeed,
		toggle: () => {
			if (now >= total) setNow(0)
			setPlaying((p) => !p)
		},
		restart: () => {
			setNow(0)
			setPlaying(true)
		},
		seek: (t: number) => {
			setNow(t)
		},
		end: () => {
			setNow(total)
			setPlaying(false)
		},
	}
}

type Props = {
	trace: TraceEvent[]
	now: number
	total: number
	view?: RunView | null
	candidates?: Candidate[]
	criticEnforcing: boolean
	runId?: string
	controls?: React.ReactNode
	status?: React.ReactNode
}

/** The shared run screen: numbers, agent lanes, match map, Critic feed and proposals. */
export function RunStage({ trace, now, total, view, candidates, criticEnforcing, runId, controls, status }: Props) {
	const snap = useMemo(() => derive(trace, now, candidates ?? view?.candidates ?? []), [trace, now, candidates, view])
	const { show, sheet } = useSourceSheet(runId)
	const blockedSoFar = snap.critic.reduce((n, e) => n + e.blocked.length, 0)
	const finished = view && snap.ended
	const proposals = (view?.proposals ?? []).filter((p) => snap.finishedKeys.has(p.key) || finished)
	const [tab, setTab] = useState<string | undefined>(undefined)
	const activeTab = tab && proposals.some((p) => p.key === tab) ? tab : proposals[0]?.key

	return (
		<div className="space-y-6">
			{sheet}
			<div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-3 lg:grid-cols-5">
				<Stat label="Agents working right now" value={String(snap.inFlight)} sub={`peak ${snap.peak.n}`} highlight={snap.inFlight > 1} />
				<Stat label="Elapsed" value={secs(now)} sub={finished ? "finished" : snap.phase} />
				<Stat label="Pairs screened" value={`${snap.screened.done}`} sub={`of ${snap.screened.total || snap.candidates.length || "..."}`} />
				<Stat label={criticEnforcing ? "Claims blocked by the Critic" : "Claims the Critic flagged"} value={String(blockedSoFar)} sub={`${snap.critic.length} draft${snap.critic.length === 1 ? "" : "s"} reviewed`} />
				<Stat
					label="Unsupported claims shipped"
					value={finished ? String(view!.critic.unsupportedClaimsInFinalProposals) : "..."}
					sub={finished ? `spend ${usd(view!.spendUsd)}` : "after the last review"}
					className="col-span-2 sm:col-span-1"
				/>
			</div>

			{(controls || status) && (
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="text-sm text-muted-foreground">{status}</div>
					{controls}
				</div>
			)}

			<div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
				<Card>
					<CardHeader>
						<CardTitle>Agents at work</CardTitle>
						<CardDescription>The working agents on one shared Mozaik runtime. Each bar is one job, timed from the trace.</CardDescription>
					</CardHeader>
					<CardContent>
						<AgentLanes snap={snap} total={total} />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Who fits the problem</CardTitle>
						<CardDescription>Shortlisted researchers around each company challenge.</CardDescription>
					</CardHeader>
					<CardContent>
						<MatchMap snap={snap} />
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
				<Card className="min-w-0">
					<CardHeader>
						<CardTitle>Proposals</CardTitle>
						<CardDescription>Industrial PhD or joint-project proposals, in the form each researcher agreed to. Released only after the Critic has checked the claims and the text.</CardDescription>
					</CardHeader>
					<CardContent>
						{proposals.length === 0 ? (
							<WritingPlaceholder keys={snap.selectedOrder} candidates={snap.candidates} />
						) : (
							<Tabs value={activeTab} onValueChange={setTab}>
								<TabsList className="h-auto w-full flex-wrap justify-start">
									{proposals.map((p) => (
										<TabsTrigger key={p.key} value={p.key} className="flex-none">
											{surname(p.researcher)} × {p.company.split(" ")[0]}
										</TabsTrigger>
									))}
								</TabsList>
								{proposals.map((p) => (
									<TabsContent key={p.key} value={p.key} className="pt-4">
										<ProposalView p={p} onSource={show} />
									</TabsContent>
								))}
							</Tabs>
						)}
					</CardContent>
				</Card>
				<Card className="min-w-0">
					<CardHeader>
						<CardTitle>The Critic</CardTitle>
						<CardDescription>{criticEnforcing ? "Checks every claim against its cited records, and every figure and name in the text against the claims, before a proposal leaves the system." : "Ablation run: the Critic only records what it would have blocked."}</CardDescription>
					</CardHeader>
					<CardContent>
						<CriticFeed entries={snap.critic} candidates={snap.candidates} enforcing={criticEnforcing} onSource={show} />
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

function Stat({ label, value, sub, highlight, className }: { label: string; value: string; sub?: string; highlight?: boolean; className?: string }) {
	return (
		<div className={cn("bg-card px-4 py-3", className)}>
			<div className="text-xs text-muted-foreground">{label}</div>
			<div className={cn("mt-1 text-2xl font-semibold tracking-tight tabular transition-colors", highlight && "text-primary")}>{value}</div>
			{sub && <div className="text-xs text-muted-foreground tabular">{sub}</div>}
		</div>
	)
}

function WritingPlaceholder({ keys, candidates }: { keys: string[]; candidates: Candidate[] }) {
	if (!keys.length) return <p className="py-6 text-sm text-muted-foreground">Proposals appear here once the Matchmaker picks the strongest pairs.</p>
	return (
		<div className="space-y-4">
			{keys.map((k) => {
				const c = candidates.find((x) => x.key === k)
				return (
					<div key={k} className="space-y-2">
						<p className="text-sm">
							<span className="font-medium">{c?.researcher ?? k}</span>
							<span className="text-muted-foreground"> with {c?.company ?? ""}: being profiled and written</span>
						</p>
						<Skeleton className="h-3 w-full" />
						<Skeleton className="h-3 w-4/5" />
					</div>
				)
			})}
		</div>
	)
}

export function ReplayControls({ r, total }: { r: ReturnType<typeof useReplay>; total: number }) {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<Button size="sm" onClick={r.toggle} className="min-w-24">
				{r.playing ? <Pause className="size-4" /> : <Play className="size-4" />}
				{r.playing ? "Pause" : r.now >= total ? "Replay" : "Play"}
			</Button>
			<Button size="sm" variant="outline" onClick={r.restart} aria-label="Restart">
				<RotateCcw className="size-4" />
			</Button>
			<div className="flex rounded-md border p-0.5">
				{SPEEDS.map((s) => (
					<button
						key={s}
						type="button"
						onClick={() => r.setSpeed(s)}
						className={cn("rounded-[5px] px-2 py-1 text-xs tabular transition-colors", r.speed === s ? "bg-secondary font-medium text-foreground" : "text-muted-foreground hover:text-foreground")}
					>
						{s}x
					</button>
				))}
			</div>
			<input
				type="range"
				min={0}
				max={total}
				step={50}
				value={r.now}
				onChange={(e) => r.seek(Number(e.target.value))}
				className="w-full accent-[var(--primary)] sm:w-40"
				aria-label="Scrub through the run"
			/>
			<Button size="sm" variant="ghost" onClick={r.end}>
				Skip to end
			</Button>
		</div>
	)
}
