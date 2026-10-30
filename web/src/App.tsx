import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { api, type RunSummary, type ServerConfig } from "@/lib/api"
import { cn } from "@/lib/utils"
import { RunsPage } from "@/pages/runs-page"
import { SearchPage } from "@/pages/search-page"

function useHash() {
	const [hash, setHash] = useState(window.location.hash || "#/")
	useEffect(() => {
		const on = () => setHash(window.location.hash || "#/")
		window.addEventListener("hashchange", on)
		return () => window.removeEventListener("hashchange", on)
	}, [])
	return [hash, (h: string) => (window.location.hash = h)] as const
}

function useTheme() {
	const [dark, setDark] = useState(() => {
		const saved = localStorage.getItem("theme")
		return saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches
	})
	useEffect(() => {
		document.documentElement.classList.toggle("dark", dark)
		localStorage.setItem("theme", dark ? "dark" : "light")
	}, [dark])
	return [dark, () => setDark((d) => !d)] as const
}

export default function App() {
	const [hash, go] = useHash()
	const [dark, toggleTheme] = useTheme()
	const [config, setConfig] = useState<ServerConfig | null>(null)
	const [runs, setRuns] = useState<RunSummary[]>([])

	useEffect(() => {
		api.config().then(setConfig, () => setConfig(null))
		api.runs().then(setRuns, () => setRuns([]))
	}, [hash])

	const onRuns = hash.startsWith("#/runs")
	const runId = onRuns ? decodeURIComponent(hash.slice("#/runs/".length)) || null : null

	return (
		<TooltipProvider delayDuration={150}>
			<div className="flex min-h-[100dvh] flex-col">
				<header className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
					<div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 md:px-6">
						<a href="#/" className="flex items-center gap-2 font-semibold tracking-tight">
							<span className="grid size-6 place-items-center rounded-md bg-primary text-[13px] font-bold text-primary-foreground">E</span>
							<span className="hidden sm:inline">EINSTEIN Matchmaker</span>
						</a>
						<nav className="flex items-center gap-1 text-sm">
							<NavLink active={!onRuns} href="#/">
								Find researchers
							</NavLink>
							<NavLink active={onRuns} href="#/runs">
								Recorded runs
							</NavLink>
						</nav>
						<button
							type="button"
							onClick={toggleTheme}
							className="ml-auto grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
							aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
						>
							{dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
						</button>
					</div>
				</header>
				<main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-6 md:py-12">{onRuns ? <RunsPage runs={runs} selected={runId} go={go} /> : <SearchPage config={config} runs={runs} go={go} />}</main>
				<footer className="border-t">
					<div className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted-foreground md:px-6">
						Built on Mozaik for the JigJoy and NTP Novi Sad hackathon. Researcher and company data is the synthetic EINSTEIN dataset.
					</div>
				</footer>
			</div>
		</TooltipProvider>
	)
}

function NavLink({ active, href, children }: { active: boolean; href: string; children: React.ReactNode }) {
	return (
		<a href={href} className={cn("rounded-md px-2.5 py-1.5 transition-colors", active ? "bg-secondary font-medium text-foreground" : "text-muted-foreground hover:text-foreground")}>
			{children}
		</a>
	)
}
