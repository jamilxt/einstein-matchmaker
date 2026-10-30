import { CheckCircle2, CircleAlert } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { ViewProposal } from "@/lib/api"
import { SourceChip } from "@/components/source"

/** One proposal laid out like the EINSTEIN example topic, with every claim and its sources. */
export function ProposalView({ p, onSource }: { p: ViewProposal; onSource: (id: string) => void }) {
	const approved = p.verdict === "approved"
	return (
		<article className="space-y-6">
			<header className="space-y-3">
				<div className="flex flex-wrap items-center gap-2">
					<Badge variant={approved ? "default" : "outline"} className={approved ? "bg-ok text-ok-foreground" : ""}>
						{approved ? "Critic approved" : p.verdict === "shipped_unchecked" ? "Critic off" : p.verdict}
					</Badge>
					<span className="text-xs text-muted-foreground tabular">
						{p.drafts} draft{p.drafts === 1 ? "" : "s"}
						{p.score !== null && <> · fit {p.score.toFixed(2)} / 3 ({fitWord(p.score)})</>}
					</span>
				</div>
				<h3 className="text-xl font-semibold leading-snug tracking-tight text-balance md:text-2xl">{p.title}</h3>
				<dl className="grid gap-3 text-sm sm:grid-cols-2">
					<div className="rounded-md bg-lane p-3">
						<dt className="text-xs text-muted-foreground">Researcher</dt>
						<dd className="font-medium">{p.researcher}</dd>
						<dd className="text-xs text-muted-foreground">
							{p.researcherTitle}, {p.department}
						</dd>
					</div>
					<div className="rounded-md bg-lane p-3">
						<dt className="text-xs text-muted-foreground">Company</dt>
						<dd className="font-medium">{p.company}</dd>
						<dd className="font-mono text-xs text-muted-foreground">challenge {p.challengeId}</dd>
					</div>
				</dl>
			</header>

			<Section title="The problem">
				<p>{p.problem}</p>
			</Section>
			<Section title="Research questions">
				<ol className="list-decimal space-y-1.5 pl-5 marker:text-muted-foreground">
					{p.research_questions.map((q, i) => (
						<li key={i}>{q}</li>
					))}
				</ol>
			</Section>
			<Section title="Three-year plan">
				<ol className="space-y-3">
					{p.plan.map((y) => (
						<li key={String(y.year)} className="grid gap-1 sm:grid-cols-[4.5rem_1fr]">
							<span className="text-xs font-medium text-primary tabular sm:pt-0.5">Year {y.year}</span>
							<div>
								<p>{y.work}</p>
								<p className="mt-1 text-muted-foreground">
									<span className="font-medium text-foreground">Result:</span> {y.result}
								</p>
							</div>
						</li>
					))}
				</ol>
			</Section>
			<Section title="What each side brings">
				<div className="grid gap-4 md:grid-cols-2">
					<div>
						<p className="mb-1 text-xs font-medium text-muted-foreground">Company</p>
						<p>{p.company_brings}</p>
					</div>
					<div>
						<p className="mb-1 text-xs font-medium text-muted-foreground">Faculty</p>
						<p>{p.faculty_brings}</p>
					</div>
				</div>
			</Section>
			<Section title="Why this pair">
				<p>{p.why_this_pair}</p>
			</Section>
			<Section title="First step">
				<p>{p.first_step}</p>
			</Section>

			<Separator />
			<section className="space-y-3">
				<div>
					<h4 className="text-sm font-semibold">Claims and their sources</h4>
					<p className="text-xs text-muted-foreground">Each factual claim was checked against the records it cites. Open a source to read it.</p>
				</div>
				<ul className="space-y-2.5">
					{p.claims.map((c, i) => (
						<li key={i} className="flex gap-2.5 text-sm">
							{c.supported ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-ok" strokeWidth={1.75} /> : <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" strokeWidth={1.75} />}
							<div className="min-w-0 space-y-1">
								<p>{c.claim}</p>
								<div className="flex flex-wrap items-center gap-1">
									{c.evidence.slice(0, 6).map((id) => (
										<SourceChip key={id} id={id} onOpen={onSource} />
									))}
									{c.evidence.length > 6 && <span className="text-[11px] text-muted-foreground">+{c.evidence.length - 6} more</span>}
									{c.support !== null && <span className="ml-1 text-[11px] text-muted-foreground tabular">support {c.support.toFixed(2)}</span>}
								</div>
							</div>
						</li>
					))}
				</ul>
			</section>
		</article>
	)
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<section className="space-y-2 text-sm leading-relaxed">
			<h4 className="text-sm font-semibold">{title}</h4>
			<div className="max-w-[72ch] text-foreground/90">{children}</div>
		</section>
	)
}

function fitWord(score: number): string {
	return score >= 2.5 ? "strong" : score >= 1.5 ? "moderate" : "partial"
}
