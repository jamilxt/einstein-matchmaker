import { ShieldAlert, ShieldCheck } from "lucide-react"
import type { Candidate } from "@/lib/api"
import type { CriticEntry } from "@/lib/derive"
import { secs } from "@/lib/format"
import { SourceChip } from "@/components/source"

/** Every Critic decision so far, newest first, with the exact claims it blocked and why. */
export function CriticFeed({ entries, candidates, enforcing, onSource }: { entries: CriticEntry[]; candidates: Candidate[]; enforcing: boolean; onSource: (id: string) => void }) {
	const name = (key: string) => {
		const c = candidates.find((x) => x.key === key)
		return c ? `${c.researcher} with ${c.company}` : key
	}
	if (!entries.length)
		return (
			<p className="rounded-md bg-lane px-3 py-6 text-center text-sm text-muted-foreground">
				No drafts yet. The Critic reads each proposal before it is released and blocks any claim its cited records do not support.
			</p>
		)
	return (
		<ol className="space-y-3">
			{[...entries].reverse().map((e) => {
				const sentBack = e.verdict === "revise" || e.wouldHave === "revise"
				return (
					<li key={`${e.key}-${e.attempt}`} className="rounded-md border bg-card p-3">
						<div className="flex items-start gap-2">
							{sentBack ? <ShieldAlert className="mt-0.5 size-4 shrink-0 text-destructive" strokeWidth={1.75} /> : <ShieldCheck className="mt-0.5 size-4 shrink-0 text-ok" strokeWidth={1.75} />}
							<div className="min-w-0 flex-1">
								<div className="flex flex-wrap items-baseline justify-between gap-x-3">
									<p className="text-sm font-medium">
										{sentBack ? (enforcing ? "Sent back" : "Would have sent back") : "Approved"}: draft {e.attempt}
									</p>
									<span className="text-xs text-muted-foreground tabular">{secs(e.t)}</span>
								</div>
								<p className="truncate text-xs text-muted-foreground">{name(e.key)}</p>
								{e.blocked.length > 0 && (
									<ul className="mt-2 space-y-2">
										{e.blocked.map((b, i) => (
											<li key={i} className="border-l-2 border-destructive/60 pl-2.5 text-xs">
												<p className="text-foreground">{b.claim}</p>
												<p className="mt-0.5 text-muted-foreground">{explain(b.why)}</p>
												<div className="mt-1 flex flex-wrap gap-1">
													{b.evidence.slice(0, 4).map((id) => (
														<SourceChip key={id} id={id} onOpen={onSource} />
													))}
												</div>
											</li>
										))}
									</ul>
								)}
							</div>
						</div>
					</li>
				)
			})}
		</ol>
	)
}

/** Turn the Critic's terse reason into a sentence a company reader understands. */
function explain(why: string): string {
	const m = why.match(/^support ([\d.]+)$/)
	if (m) return `The cited records do not back this up (support ${Number(m[1]).toFixed(2)} of 1, needs 0.50).`
	return why.charAt(0).toUpperCase() + why.slice(1) + (why.endsWith(".") ? "" : ".")
}
