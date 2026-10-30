import { useMemo, useState } from "react"
import type { Candidate } from "@/lib/api"
import type { Snapshot } from "@/lib/derive"
import { surname } from "@/lib/format"
import { cn } from "@/lib/utils"

type Node = { c: Candidate; x: number; y: number }
type Cluster = { challengeId: string; company: string; x: number; y: number; nodes: Node[] }

/**
 * The match map: each company challenge in the middle of its cluster, the researchers the
 * search proposed around it. Line weight follows the screening score; colour follows what the
 * Critic did with the pair. Flat SVG, readable on a phone.
 */
export function MatchMap({ snap, focusChallenges }: { snap: Snapshot; focusChallenges?: string[] }) {
	const [hover, setHover] = useState<string | null>(null)
	const W = 560
	const H = 300

	const clusters: Cluster[] = useMemo(() => {
		const byCh = new Map<string, Candidate[]>()
		for (const c of snap.candidates) byCh.set(c.challengeId, [...(byCh.get(c.challengeId) ?? []), c])
		const selectedChs = [...new Set(snap.selectedOrder.map((k) => k.split("x")[1]))]
		const ids = (focusChallenges?.length ? focusChallenges : selectedChs.length ? selectedChs : [...byCh.keys()]).slice(0, 3)
		return ids.map((ch, i) => {
			const cx = ((i + 0.5) / ids.length) * W
			const cy = H / 2
			const list = byCh.get(ch) ?? []
			const r = ids.length === 1 ? 108 : 66
			const nodes = list.map((c, j) => {
				const a = -Math.PI / 2 + (j / Math.max(1, list.length)) * Math.PI * 2
				return { c, x: cx + Math.cos(a) * r * (ids.length === 1 ? 1.9 : 1), y: cy + Math.sin(a) * r * (ids.length === 1 ? 1 : 1.5) }
			})
			return { challengeId: ch, company: list[0]?.company ?? ch, x: cx, y: cy, nodes }
		})
	}, [snap.candidates, snap.selectedOrder, focusChallenges])

	if (!clusters.length)
		return <div className="grid h-48 place-items-center rounded-md bg-lane text-sm text-muted-foreground">Waiting for the shortlist...</div>

	const hovered = hover ? snap.candidates.find((c) => c.key === hover) : null
	const hp = hover ? snap.pairs.get(hover) : undefined

	return (
		<div className="space-y-2">
			<svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Map of candidate researchers around each company challenge">
				{clusters.map((cl) => (
					<g key={cl.challengeId}>
						{cl.nodes.map((n) => {
							const p = snap.pairs.get(n.c.key)
							const s = p?.score
							const state = p?.revising || (p?.finished && p?.verdict === "rejected") ? "revise" : p?.finished ? "ok" : p?.selected ? "selected" : s !== undefined ? "screened" : "pending"
							return (
								<line
									key={n.c.key}
									x1={cl.x}
									y1={cl.y}
									x2={n.x}
									y2={n.y}
									className={cn(
										"transition-all duration-300",
										state === "pending" && "stroke-border",
										state === "screened" && "stroke-chart-3",
										state === "selected" && "stroke-primary",
										state === "ok" && "stroke-ok",
										state === "revise" && "stroke-destructive",
									)}
									strokeDasharray={state === "pending" ? "3 4" : undefined}
									strokeWidth={state === "pending" ? 1 : 1 + ((s ?? 0) / 3) * (p?.selected ? 4 : 2.2)}
									strokeOpacity={state === "screened" ? 0.35 + ((s ?? 0) / 3) * 0.5 : 1}
								/>
							)
						})}
						{cl.nodes.map((n) => {
							const p = snap.pairs.get(n.c.key)
							const on = p?.selected
							return (
								<g
									key={n.c.key}
									transform={`translate(${n.x},${n.y})`}
									onMouseEnter={() => setHover(n.c.key)}
									onMouseLeave={() => setHover(null)}
									onClick={() => setHover(n.c.key)}
									className="cursor-pointer"
								>
									<circle r={on ? 10 : 7} className={cn("transition-all duration-300", on ? (p?.finished && p?.verdict === "rejected" ? "fill-destructive" : p?.finished ? "fill-ok" : p?.revising ? "fill-destructive" : "fill-primary") : "fill-card stroke-muted-foreground/60")} strokeWidth={1.2} />
									<text y={n.y < cl.y - 4 ? (on ? -16 : -12) : on ? 26 : 21} textAnchor="middle" className={cn("text-[13px]", on ? "fill-foreground font-medium" : "fill-muted-foreground")}>
										{surname(n.c.researcher)}
									</text>
								</g>
							)
						})}
						<g transform={`translate(${cl.x},${cl.y})`}>
							<rect x={-60} y={-19} width={120} height={38} rx={6} className="fill-foreground" />
							<text textAnchor="middle" y={-2} className="fill-background text-[12px] font-medium">
								{cl.company.length > 15 ? `${cl.company.slice(0, 14)}...` : cl.company}
							</text>
							<text textAnchor="middle" y={12} className="fill-background/70 font-mono text-[10px]">
								{cl.challengeId}
							</text>
						</g>
					</g>
				))}
			</svg>
			<div className="min-h-10 rounded-md bg-lane px-3 py-2 text-xs">
				{hovered ? (
					<span>
						<span className="font-medium">{hovered.researcher}</span>
						<span className="text-muted-foreground">
							{" "}
							{hovered.title}, {hovered.department}.{" "}
						</span>
						{hp?.score !== undefined ? <span className="tabular">Fit for {hovered.company}: {hp.score.toFixed(2)} / 3</span> : <span className="text-muted-foreground">Not screened yet.</span>}
					</span>
				) : (
					<span className="text-muted-foreground">Tap a researcher to see who they are and how well the pair fits. Thicker line, stronger fit.</span>
				)}
			</div>
		</div>
	)
}
