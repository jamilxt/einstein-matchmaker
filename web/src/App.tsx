import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { api, type RunSummary, type ServerConfig } from "@/lib/api"
import { cn } from "@/lib/utils"
import { RunsPage } from "@/pages/runs-page"
import { SearchPage } from "@/pages/search-page"
import { HowPage } from "@/pages/how-page"

const REPO_URL = "https://github.com/jamilxt/einstein-matchmaker"

function GitHubMark({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor" className={className}>
			<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
		</svg>
	)
}

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
	const onHow = hash.startsWith("#/how")
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
						<nav className="flex items-center gap-0.5 text-sm sm:gap-1">
							<NavLink active={!onRuns && !onHow} href="#/">
								<span className="sm:hidden">Search</span>
								<span className="hidden sm:inline">Find researchers</span>
							</NavLink>
							<NavLink active={onRuns} href="#/runs">
								<span className="sm:hidden">Runs</span>
								<span className="hidden sm:inline">Recorded runs</span>
							</NavLink>
							<NavLink active={onHow} href="#/how">
								<span className="sm:hidden">How</span>
								<span className="hidden sm:inline">How it works</span>
							</NavLink>
						</nav>
						<a
							href={REPO_URL}
							target="_blank"
							rel="noreferrer"
							className="ml-auto flex h-8 items-center gap-1.5 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
							aria-label="Source code on GitHub"
						>
							<GitHubMark className="size-4" />
							<span className="hidden md:inline">Source</span>
						</a>
						<button
							type="button"
							onClick={toggleTheme}
							className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
							aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
						>
							{dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
						</button>
					</div>
				</header>
				<main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-6 md:py-12">{onHow ? <HowPage go={go} /> : onRuns ? <RunsPage runs={runs} selected={runId} go={go} /> : <SearchPage config={config} runs={runs} go={go} />}</main>
				<footer className="border-t">
					<div className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted-foreground md:px-6">
						Built on Mozaik for the JigJoy and NTP Novi Sad hackathon. Researcher and company data is the synthetic EINSTEIN dataset.{" "}
						<a href={REPO_URL} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-foreground">
							Source code, traces and evaluation on GitHub
						</a>
						.
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
