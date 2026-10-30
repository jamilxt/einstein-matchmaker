import { useState } from "react"
import { BookOpen, Building2, FileText, FlaskConical, Lightbulb, UserRound } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { api, type SourceRecord } from "@/lib/api"
import { sourceKind } from "@/lib/format"

const ICON: Record<string, typeof FileText> = { Paper: BookOpen, Project: FlaskConical, Patent: Lightbulb, Challenge: FileText, Company: Building2, Researcher: UserRound }

/** A clickable citation. Opens the exact record the claim was checked against. */
export function SourceChip({ id, onOpen }: { id: string; onOpen: (id: string) => void }) {
	const kind = sourceKind(id)
	const Icon = ICON[kind] ?? FileText
	return (
		<button
			type="button"
			onClick={() => onOpen(id)}
			className="inline-flex items-center gap-1 rounded-sm border bg-card px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground active:scale-[0.98]"
			title={`Open ${kind.toLowerCase()} ${id}`}
		>
			<Icon className="size-3" strokeWidth={1.75} />
			{id}
		</button>
	)
}

export function useSourceSheet(runId?: string) {
	const [open, setOpen] = useState(false)
	const [rec, setRec] = useState<SourceRecord | null>(null)
	const [err, setErr] = useState<string | null>(null)
	const show = (id: string) => {
		setOpen(true)
		setRec(null)
		setErr(null)
		api.record(id, runId).then(setRec, (e) => setErr(String(e.message ?? e)))
	}
	const sheet = (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetContent className="w-full sm:max-w-lg">
				<SheetHeader>
					<SheetTitle className="font-mono text-base">{rec?.id ?? "Source"}</SheetTitle>
					<SheetDescription>{rec ? `${sourceKind(rec.id)} record from the EINSTEIN dataset, exactly as the Critic read it.` : "Loading the record..."}</SheetDescription>
				</SheetHeader>
				<div className="overflow-y-auto px-4 pb-6 text-sm leading-relaxed">
					{err && <p className="text-destructive">{err}</p>}
					{!rec && !err && (
						<div className="space-y-2">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-11/12" />
							<Skeleton className="h-4 w-4/5" />
						</div>
					)}
					{rec && <p className="whitespace-pre-wrap">{rec.text}</p>}
				</div>
			</SheetContent>
		</Sheet>
	)
	return { show, sheet }
}
