import { LANES, type Snapshot } from "@/lib/derive"
import { secs } from "@/lib/format"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const TONE: Record<string, string> = {
	screen: "bg-chart-3",
	profile: "bg-chart-2",
	write: "bg-primary",
	approve: "bg-ok",
	revise: "bg-destructive",
}
const KIND_LABEL: Record<string, string> = {
	screen: "Screening pairs (Decisions API)",
	profile_researcher: "Building a cited researcher profile",
	profile_company: "Structuring the company need",
	write: "Writing the proposal",
	review: "Checking every claim against its sources",
}

/** One lane per agent; bars are real job start and end times from the trace. */
export function AgentLanes({ snap, total }: { snap: Snapshot; total: number }) {
	const span = Math.max(total, snap.now, 1)
	const x = (t: number) => `${Math.min(100, (t / span) * 100)}%`
	const w = (a: number, b: number) => `${Math.max(0.6, ((b - a) / span) * 100)}%`
	const ticks = Array.from({ length: 5 }, (_, i) => (span / 4) * i)

	return (
		<div className="space-y-3">
			<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
				<Legend tone="screen" label="Screening" />
				<Legend tone="profile" label="Profiling" />
				<Legend tone="write" label="Writing" />
				<Legend tone="approve" label="Critic approved" />
				<Legend tone="revise" label="Critic sent back" />
			</div>
			<div className="relative">
				<div className="space-y-1.5">
					{LANES.map((lane) => {
						const bars = snap.bars.filter((b) => b.agent === lane)
						const busy = bars.some((b) => b.running)
						return (
							<div key={lane} className="grid grid-cols-[5.5rem_1fr] items-center gap-3 sm:grid-cols-[7rem_1fr]">
								<div className={cn("truncate text-xs tabular transition-colors", busy ? "font-medium text-foreground" : "text-muted-foreground")}>{lane}</div>
								<div className="relative h-5 rounded-sm bg-lane">
									{bars.map((b) => (
										<Tooltip key={b.id}>
											<TooltipTrigger asChild>
												<div
													className={cn("absolute inset-y-0.5 rounded-[3px] transition-[width] duration-150", TONE[b.tone], b.running && "opacity-80")}
													style={{ left: x(b.start), width: w(b.start, b.end) }}
												/>
											</TooltipTrigger>
											<TooltipContent>
												<div className="font-medium">{KIND_LABEL[b.kind] ?? b.kind}</div>
												<div className="tabular opacity-80">
													{secs(b.start)} to {b.running ? "now" : secs(b.end)}
												</div>
											</TooltipContent>
										</Tooltip>
									))}
								</div>
							</div>
						)
					})}
				</div>
				{/* playhead */}
				<div className="pointer-events-none absolute inset-y-0 left-[6.25rem] right-0 sm:left-[7.75rem]">
					<div className="absolute inset-y-0 w-px bg-foreground/40" style={{ left: x(snap.now) }} />
					{snap.peak.n > 1 && (
						<div className="absolute -top-1 bottom-0 w-px border-l border-dashed border-primary/70" style={{ left: x(snap.peak.at) }} />
					)}
				</div>
			</div>
			<div className="grid grid-cols-[5.5rem_1fr] gap-3 sm:grid-cols-[7rem_1fr]">
				<div />
				<div className="relative h-4 text-[11px] text-muted-foreground tabular">
					{ticks.map((t, i) => (
						<span key={i} className={cn("absolute", i === 0 ? "" : i === ticks.length - 1 ? "-translate-x-full" : "-translate-x-1/2")} style={{ left: x(t) }}>
							{secs(t, 0)}
						</span>
					))}
				</div>
			</div>
			{snap.peak.n > 1 && (
				<p className="text-xs text-muted-foreground">
					Dashed line: <span className="font-medium text-foreground">{snap.peak.n} jobs running at the same moment</span> at {secs(snap.peak.at)}.
				</p>
			)}
		</div>
	)
}

function Legend({ tone, label }: { tone: string; label: string }) {
	return (
		<span className="inline-flex items-center gap-1.5">
			<span className={cn("h-2 w-3 rounded-[2px]", TONE[tone])} />
			{label}
		</span>
	)
}
