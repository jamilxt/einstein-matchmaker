import { Fragment, useEffect, useState } from "react"
import { ArrowDown, ArrowRight, CornerDownLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type Stage = { name: string; count?: string; model: string; job: string; tone?: "gate" | "plain" | "data" }

// Mirrors src/agents.ts and src/run.ts.
const STAGES: Stage[] = [
	{ name: "Shortlist", model: "no model", job: "Keyword search (BM25) over papers, projects and patents. Consent comes first: each researcher gets only the collaboration form they said yes to.", tone: "data" },
	{ name: "Screeners", count: "×3", model: "Decisions API", job: "Score each researcher and challenge pair for fit, 0 to 3, in parallel batches." },
	{ name: "Matchmaker", model: "no model", job: "Picks a strong pair the moment its score arrives, while screening is still running." },
	{ name: "Profilers, Analysts", count: "×2, ×2", model: "gpt-5.4-mini + tools", job: "Build a cited researcher profile and a structured company need, side by side." },
	{ name: "Writers", count: "×2", model: "gpt-5.4-mini", job: "Draft the proposal in the consented form (industrial PhD, joint project or contract research) and list every factual claim with the record it came from." },
	{ name: "Critic", model: "ID and text checks + Decisions API", job: "Intercepts each draft. Blocks claims the cited records do not support, figures or names in the text that no checked claim backs, and plans that miss the company's own time limit. Checks claims in parallel batches of 8. Sends the draft back up to twice, then rejects it.", tone: "gate" },
]

type EvalSet = {
	id: string
	summary: { pairs?: number; plantedErrors: { caught: number; total: number; byKind: Record<string, { caught?: number; hit?: number; total: number }> }; trueClaims: { wronglyBlocked: number; total: number; byKind?: Record<string, { hit: number; total: number }> }; spendUsd: number }
	misses: { claim: string; support: number; note: string }[]
	falseBlocks: { kind: string; claim: string }[]
}
type Replay = {
	threshold: number
	planted: number
	trueClaims: number
	layers: { name: string; caught: number; fb: number }[]
	sweep: { t: number; caught: number; fb: number }[]
	maxPlantedScore: number
	repeats?: { id: string; caught: number; planted: number; fb: number; trueClaims: number; borderline?: number }[]
}
type Evals = { easy: EvalSet | null; hardBefore: EvalSet | null; hardAfter: EvalSet | null; replay?: Replay | null }

const KIND: Record<string, string> = {
	off_by_one_size: "Staff count off by one",
	wrong_title: "Wrong academic title",
	wrong_city: "Wrong city",
	wrong_sector: "Wrong sector",
	neighbour_field: "A colleague's field",
	same_field_foreign_paper: "Same-field paper by someone else",
	true_publication: "Who co-authored a paper",
	true_topic: "Topic of their own paper",
}

export function HowPage({ go }: { go: (hash: string) => void }) {
	const [evals, setEvals] = useState<Evals | null>(null)
	useEffect(() => {
		fetch("/api/evals")
			.then((r) => r.json())
			.then(setEvals, () => setEvals({ easy: null, hardBefore: null, hardAfter: null }))
	}, [])
	const after = evals?.hardAfter
	const before = evals?.hardBefore

	return (
		<div className="space-y-14">
			<section className="max-w-3xl space-y-3">
				<h1 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">How the matchmaker works</h1>
				<p className="text-muted-foreground">
					Thirteen Mozaik participants share one runtime and one state. They react to each other's events instead of waiting in a fixed pipeline, so screening, profiling and writing overlap. A
					Critic sits between the writers and the reader. It checks every claim against the record it cites, and the text against the claims.
				</p>
			</section>

			<section className="space-y-5">
				<h2 className="text-xl font-semibold tracking-tight">Architecture</h2>
				<div className="rounded-lg border bg-card p-4 md:p-6">
					<div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
						<span className="rounded-md border px-2 py-1">EINSTEIN dataset: 1,047 researchers, 153 companies, 10,779 papers</span>
						<span className="rounded-md border px-2 py-1">Coordinator hands out work</span>
						<span className="rounded-md border px-2 py-1">Auditor records the trace and meters spend</span>
					</div>
					<ol className="grid gap-2 lg:grid-cols-[repeat(6,minmax(0,1fr))] lg:gap-0">
						{STAGES.map((s, i) => (
							<Fragment key={s.name}>
								<li className="relative flex lg:pr-6">
									<div
										className={cn(
											"flex w-full flex-col gap-2 rounded-md border p-3",
											s.tone === "gate" && "border-primary bg-accent",
											s.tone === "data" && "border-dashed bg-lane",
										)}
									>
										<div className="flex items-baseline justify-between gap-2">
											<span className="font-medium">{s.name}</span>
											{s.count && <span className="shrink-0 text-xs text-muted-foreground tabular">{s.count}</span>}
										</div>
										<Badge variant="outline" className="h-auto max-w-full font-mono text-[10px] font-normal whitespace-normal">
											{s.model}
										</Badge>
										<p className="text-xs leading-relaxed text-muted-foreground">{s.job}</p>
									</div>
									{i < STAGES.length - 1 && <ArrowRight className="absolute top-1/2 right-0.5 hidden size-4 -translate-y-1/2 text-muted-foreground lg:block" />}
								</li>
								{i < STAGES.length - 1 && (
									<li aria-hidden className="flex justify-center lg:hidden">
										<ArrowDown className="size-4 text-muted-foreground" />
									</li>
								)}
							</Fragment>
						))}
					</ol>
					<p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
						<CornerDownLeft className="mt-0.5 size-3.5 shrink-0 text-primary" />
						When the Critic blocks a claim, the draft goes back to the same Writer with the exact claim and reason. True facts get re-cited to the right record; anything no record states is removed.
					</p>
				</div>
			</section>

			<section className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>The agents really run together</CardTitle>
						<CardDescription>Measured from job start and end times in the trace, not claimed.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4 text-sm">
						<div className="grid grid-cols-3 gap-px overflow-hidden rounded-md border bg-border text-center">
							<Num value="9" label="jobs in flight at the peak" />
							<Num value="21/21" label="jobs overlapped another agent" />
							<Num value="0.5s" label="first pair picked in run 3, screening still running" />
						</div>
						<p className="text-muted-foreground">
							In every live run, all three Screeners, both Profilers and both Analysts were working at the same moment. Writers start as soon as their pair's two profiles exist, not when
							the whole batch is done.
						</p>
						<button type="button" onClick={() => go("#/runs/run-03-live")} className="text-sm font-medium text-primary hover:underline">
							Watch it in the run 3 replay
						</button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Responsible use of people's data</CardTitle>
						<CardDescription>Rules the code enforces, not just promises.</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="space-y-3 text-sm">
							<Rule title="Consent decides the form">An industrial PhD is only proposed to researchers who said yes to supervising one. Others get the joint project or contract research they agreed to, read in English and Serbian. 25 researchers open to none of these are left out before any model sees them.</Rule>
							<Rule title="Pairs, not people">The system scores how well a pair fits a problem. It never ranks researchers against each other.</Rule>
							<Rule title="Every claim has a source">Each listed claim is checked against its records, and every figure and named person in the text must be backed by a checked claim. A draft that still fails after two revisions is not released.</Rule>
							<Rule title="Cost and abuse limits">Each model call reserves its estimated cost first, so a run stops before it passes its budget. Live searches have a cap per search and in total, and the public demo only replays. Search inputs are stored with their run, so use test descriptions only.</Rule>
						</ul>
					</CardContent>
				</Card>
			</section>

			<section className="space-y-5">
				<div className="max-w-3xl space-y-2">
					<h2 className="text-xl font-semibold tracking-tight">Does the Critic actually work?</h2>
					<p className="text-muted-foreground">
						I planted subtle errors into claims about nine researcher and company pairs from the live runs, and mixed them with true claims written straight from the dataset. Then I asked the Critic
						to check all of them.
					</p>
				</div>
				{!after || !before ? (
					<Skeleton className="h-64 w-full" />
				) : (
					<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border">
								<Num big value={`${after.summary.plantedErrors.caught}/${after.summary.plantedErrors.total}`} label="planted errors caught" />
								<Num big value={`${after.summary.trueClaims.wronglyBlocked}/${after.summary.trueClaims.total}`} label="true claims wrongly blocked" />
							</div>
							<div className="rounded-md border p-4 text-sm">
								<p className="font-medium">The first version of this test found a bug</p>
								<p className="mt-1 text-muted-foreground">
									The Critic wrongly blocked <span className="font-medium text-foreground tabular">{before.summary.trueClaims.wronglyBlocked} of {before.summary.trueClaims.total}</span> true claims,
									every one about who wrote a paper. Paper records reached the Critic without their author list. After adding authors, inventors and project members to the evidence it
									blocked none, with the same catch rate.
								</p>
							</div>
							{after.misses.map((m, i) => (
								<div key={i} className="rounded-md border border-destructive/40 p-4 text-sm">
									<p className="font-medium">The one miss</p>
									<p className="mt-1">"{m.claim}"</p>
									<p className="mt-1 text-muted-foreground">
										Support {m.support.toFixed(2)}, just over the 0.50 bar. Her cited papers are on verification and covering arrays, which sit close to combinatorics, so the model
										was unsure. In two repeated runs it scored {(evals?.replay?.repeats ?? []).slice(1).map((x) => x.borderline?.toFixed(2)).join(" and ") || "the same"} and was caught. A borderline case I report rather than hide.
									</p>
								</div>
							))}
						</div>
						<Card>
							<CardHeader>
								<CardTitle>Caught, by type of planted error</CardTitle>
								<CardDescription>{after.summary.pairs} pairs from the live runs. Test cost {`$${after.summary.spendUsd.toFixed(3)}`}.</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
									{Object.entries(after.summary.plantedErrors.byKind).map(([k, v]) => {
										const hit = v.hit ?? v.caught ?? 0
										return (
											<li key={k} className="flex items-baseline justify-between gap-3 border-b pb-2">
												<span>{KIND[k] ?? k}</span>
												<span className={cn("font-medium tabular", hit < v.total ? "text-destructive" : "text-ok")}>
													{hit}/{v.total}
												</span>
											</li>
										)
									})}
								</ul>
								{evals?.easy && (
									<p className="mt-4 text-xs text-muted-foreground">
										An earlier, easier set (invented IDs, invented company facts, large number changes): {evals.easy.summary.plantedErrors.caught}/{evals.easy.summary.plantedErrors.total} caught.
										I replaced it with the set above because its errors were too easy and its true claims came from already-approved drafts.
									</p>
								)}
							</CardContent>
						</Card>
					</div>
				)}
				{evals?.replay && <ReplayCard r={evals.replay} />}
			</section>

			<section className="space-y-5">
				<div className="max-w-3xl space-y-2">
					<h2 className="text-xl font-semibold tracking-tight">What the Critic did in the live runs</h2>
					<p className="text-muted-foreground">Real runs, replayable. The numbers changed as I fixed things, and I kept every run.</p>
				</div>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					<RunNote go={go} id="run-01-live" title="Run 1" stat="5 of 8 drafts sent back, 17 claims blocked">
						Most blocks were true facts cited to the wrong record, such as a company's staff count cited to its challenge. The Writer re-cited them. 0 unsupported claims shipped.
					</RunNote>
					<RunNote go={go} id="run-02-live" title="Run 2" stat="4 of 7 drafts sent back, 10 claims blocked">
						Exposed a bug of mine: evidence was cut at 900 characters, so some true facts looked unsupported. Fixed after this run.
					</RunNote>
					<RunNote go={go} id="run-03-live" title="Run 3" stat="3 of 3 approved on the first draft">
						With better evidence and Writer instructions, nothing needed blocking. The Critic still checked all 35 claims.
					</RunNote>
					<RunNote go={go} id="run-04-live-nocritic" title="Run 4, Critic off" stat="2 claims flagged, shipped anyway">
						Both flags turned out to be checker false alarms (claims citing both sides of the pair), fixed afterwards. Natural runs are too small to measure the Critic, which is why
						I test it with planted errors.
					</RunNote>
					<RunNote go={go} id="run-05-live" title="Run 5" stat="3 of 3 approved on the first draft">
						The same three pairs as run 4, with the Critic on: 51 claims checked, none blocked. One plan was dated in the past, which the later text check now catches.
					</RunNote>
					<RunNote go={go} id="run-06-live" title="Run 6" stat="60 claims and 3 texts checked">
						The first run with the text check and consent-based forms. A later review found a title mix-up in one first step. It is corrected in the run 7 proposal, but there is still no general deterministic role check.
					</RunNote>
					<RunNote go={go} id="run-07-live" title="Run 7, role-attribution retest" stat="60 claims checked, 1 sent back">
						All three proposals passed after one claim was revised. The new Writer instruction avoids the earlier title mix-up in this run, but this is not a general role-verification guarantee.
					</RunNote>
					<RunNote go={go} id="run-10-live" title="Run 10, my Critic bug" stat="2 of 3 rejected, all 16 blocks wrong">
						One request carried all 57 claims of a draft, and the model scored true facts near 0 ("212 employees": 0.04). The Critic now sends at most 8 claims per request.
					</RunNote>
					<RunNote go={go} id="run-12-live" title="Run 12" stat="3 of 3 approved, 0 claims blocked">
						The deadline check sent Kredo's first draft back for planning in years against a six-month need; the second draft opened with Months 1 to 6. It checks timing, not what the period delivers.
					</RunNote>
					<RunNote go={go} id="run-13-live" title="Run 13, final" stat="3 of 3 approved on the first draft">
						Every proposal now has a baseline, risks with a point to stop, and an owner per period, and a plan-shape check blocks gaps between periods. Kredo runs Months 1 to 6, then 7 to 12. The check confirms the sections exist, not that they are good.
					</RunNote>
				</div>
			</section>
		</div>
	)
}

function Num({ value, label, big }: { value: string; label: string; big?: boolean }) {
	return (
		<div className="bg-card px-3 py-3">
			<div className={cn("font-semibold tracking-tight tabular", big ? "text-3xl text-primary" : "text-2xl")}>{value}</div>
			<div className="text-xs text-muted-foreground">{label}</div>
		</div>
	)
}

function Rule({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<li className="border-l-2 border-primary/40 pl-3">
			<p className="font-medium">{title}</p>
			<p className="text-muted-foreground">{children}</p>
		</li>
	)
}

function RunNote({ id, title, stat, children, go }: { id: string; title: string; stat: string; children: React.ReactNode; go: (h: string) => void }) {
	return (
		<button type="button" onClick={() => go(`#/runs/${id}`)} className="text-left">
			<Card className="h-full gap-2 px-4 py-4 transition-colors hover:border-primary/50">
				<p className="text-sm font-medium">{title}</p>
				<p className="text-sm tabular">{stat}</p>
				<p className="text-xs leading-relaxed text-muted-foreground">{children}</p>
				<p className="mt-auto text-xs font-medium text-primary">Replay</p>
			</Card>
		</button>
	)
}

// Offline replay of the recorded evaluation scores (docs/evidence/critic-eval-hard/replay.json).
function ReplayCard({ r }: { r: Replay }) {
	const [rules, both] = r.layers
	const allAt = r.sweep.find((s) => s.t > r.threshold && s.caught === r.planted && s.fb === 0)
	return (
		<Card>
			<CardHeader>
				<CardTitle>Which check does the work, and how close the calls are</CardTitle>
				<CardDescription>
					Recomputed with no model call from the scores recorded in this test. Run <code className="font-mono text-xs">npm run verify:evidence</code> to get the same numbers.
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-6 md:grid-cols-2">
				<div className="space-y-3 text-sm">
					<p className="font-medium">By layer</p>
					<ul className="space-y-2">
						<li className="flex items-baseline justify-between gap-3 border-b pb-2">
							<span>ID and ownership rules alone</span>
							<span className="font-medium tabular">
								{rules.caught}/{r.planted}
							</span>
						</li>
						<li className="flex items-baseline justify-between gap-3 border-b pb-2">
							<span>Rules plus the support score</span>
							<span className="font-medium tabular">
								{both.caught}/{r.planted}
							</span>
						</li>
					</ul>
					<p className="text-muted-foreground">
						The rules only catch a paper that belongs to someone else. Every other planted error cites the right record and says something false about it, so it takes the support score
						to catch it.
					</p>
				</div>
				<div className="space-y-3 text-sm">
					<p className="font-medium">Same scores, other thresholds</p>
					<table className="w-full text-left">
						<thead className="text-xs text-muted-foreground">
							<tr className="border-b">
								<th className="pb-2 font-normal">Threshold</th>
								<th className="pb-2 font-normal">Errors caught</th>
								<th className="pb-2 font-normal">True claims blocked</th>
							</tr>
						</thead>
						<tbody className="tabular">
							{r.sweep.map((s) => (
								<tr key={s.t} className={cn("border-b", s.t === r.threshold && "font-medium")}>
									<td className="py-1.5">
										{s.t.toFixed(1)}
										{s.t === r.threshold && (
											<Badge variant="secondary" className="ml-2">
												used
											</Badge>
										)}
									</td>
									<td className="py-1.5">
										{s.caught}/{r.planted}
									</td>
									<td className="py-1.5">
										{s.fb}/{r.trueClaims}
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<p className="text-muted-foreground">
						{allAt && `A threshold of ${allAt.t.toFixed(1)} would also catch the one miss (score ${r.maxPlantedScore.toFixed(2)}). `}I kept {r.threshold.toFixed(1)}, set before the test,
						rather than tune it to a {r.planted}-case set.
					</p>
				</div>
			</CardContent>
			{r.repeats && r.repeats.length > 1 && (
				<CardContent className="border-t pt-4 text-sm">
					<p className="font-medium">Repeated {r.repeats.length} times on the same {r.planted + r.trueClaims} claims</p>
					<ul className="mt-2 grid gap-2 sm:grid-cols-3">
						{r.repeats.map((x, i) => (
							<li key={x.id} className="rounded-md border p-3">
								<span className="text-muted-foreground">Run {i + 1}: </span>
								<span className="font-medium tabular">
									{x.caught}/{x.planted}
								</span>{" "}
								caught,{" "}
								<span className="font-medium tabular">
									{x.fb}/{x.trueClaims}
								</span>{" "}
								true claims blocked
							</li>
						))}
					</ul>
					<p className="mt-2 text-muted-foreground">
						Only the borderline neighbour-field claim changed its verdict, scoring {r.repeats.map((x) => x.borderline?.toFixed(2)).join(", ")} against the {r.threshold.toFixed(2)} bar. No true claim was blocked in any run.
					</p>
				</CardContent>
			)}
		</Card>
	)
}
