// Web server for the matchmaker UI. Node built-ins only (no framework, nothing to install).
//
//   GET  /                     the app (public/)
//   GET  /api/runs             recorded runs that can be replayed (docs/evidence, runs/)
//   GET  /api/runs/:id         one run: run.json + its trace
//   GET  /api/record/:id       a dataset record by id (for clickable sources)
//   POST /api/search           start a live reverse search (only when ALLOW_LIVE_SEARCH=1)
//   GET  /api/stream/:id       Server-Sent Events: the run's trace as it is written
//
// Each search runs in its own child process (one Mozaik runtime per run) and writes the same
// trace format the replays use, so live and replay share one renderer.
import "dotenv/config"
import { spawn } from "node:child_process"
import { createReadStream, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { createServer, type IncomingMessage, type ServerResponse } from "node:http"
import { extname, join, resolve } from "node:path"
import { Dataset } from "./data/dataset"
import { buildView } from "./view"

const PORT = Number(process.env.PORT ?? 8791)
const HOST = process.env.HOST ?? "127.0.0.1"
const LIVE_SEARCH = process.env.ALLOW_LIVE_SEARCH === "1"
const PER_SEARCH_BUDGET = Number(process.env.SEARCH_BUDGET_USD ?? 0.1)
const TOTAL_SEARCH_BUDGET = Number(process.env.SEARCH_TOTAL_BUDGET_USD ?? 0.4)
const ROOTS = ["docs/evidence", "runs"]
const PUBLIC = resolve("public")
const LEDGER = "runs/search-ledger.json"

const ds = Dataset.load()
let activeSearch: string | null = null

const MIME: Record<string, string> = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".json": "application/json" }

function json(res: ServerResponse, status: number, body: unknown) {
	res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" })
	res.end(JSON.stringify(body))
}

function safeId(id: string): boolean {
	return /^[\w.-]{1,120}$/.test(id)
}

function runDir(id: string): string | null {
	if (!safeId(id)) return null
	for (const root of ROOTS) {
		const d = join(root, id)
		if (existsSync(join(d, "trace.jsonl"))) return d
	}
	return null
}

function ledger(): { spentUsd: number; searches: number } {
	try {
		return JSON.parse(readFileSync(LEDGER, "utf-8"))
	} catch {
		return { spentUsd: 0, searches: 0 }
	}
}

const LABELS: Record<string, string> = {
	"run-01-live": "Run 1: first live run",
	"run-02-live": "Run 2: richer Writer evidence",
	"run-03-live": "Run 3: strongest pairs, first-draft approvals",
	"run-04-live-nocritic": "Run 4: Critic off (ablation)",
	"run-05-live": "Run 5: before the review fixes",
	"run-06-live": "Run 6: final, text check and consent forms",
	"run-07-live": "Run 7: role-attribution retest",
	"search-01-packaging": "Search: packaging line, bearing failures",
	"search-02-winery": "Search: winery, stalled fermentations",
	"search-03-serbian-input": "Search: bakery, problem written in Serbian",
}

function listRuns() {
	const out: any[] = []
	for (const root of ROOTS) {
		if (!existsSync(root)) continue
		for (const id of readdirSync(root)) {
			const d = join(root, id)
			const sumPath = existsSync(join(d, "run.json")) ? join(d, "run.json") : join(d, "summary.json")
			if (!existsSync(sumPath) || !existsSync(join(d, "trace.jsonl"))) continue
			try {
				const raw = JSON.parse(readFileSync(sumPath, "utf-8"))
				const summary = raw.summary ?? raw
				const input = existsSync(join(d, "input.json")) ? JSON.parse(readFileSync(join(d, "input.json"), "utf-8")) : null
				// Batch runs worth replaying are curated in docs/evidence; from runs/ only searches are listed.
				if (root === "runs" && !input && process.env.SHOW_STUB_RUNS !== "1") continue
				out.push({
					runId: summary.runId,
					id,
					label: LABELS[id] ?? (input ? `Search: ${input.company}` : id),
					reverse: !!raw.reverse || !!input,
					live: summary.mode === "live",
					criticEnforcing: summary.critic === "enforcing",
					proposals: summary.critic_record.outcomes.length,
					peakInFlight: summary.concurrency.peakInFlight,
					wallClockMs: summary.wallClockMs,
					spendUsd: summary.spend.usd,
					company: input?.company ?? null,
					evidence: root === "docs/evidence",
					modified: statSync(sumPath).mtimeMs,
				})
			} catch {
				/* skip unreadable runs */
			}
		}
	}
	const seen = new Set<string>()
	return out
		.filter((r) => r.live || process.env.SHOW_STUB_RUNS === "1")
		// The same run can sit in runs/ and in docs/evidence; keep the curated copy (listed first).
		.sort((a, b) => Number(b.evidence) - Number(a.evidence))
		.filter((r) => (seen.has(r.runId ?? r.id) ? false : (seen.add(r.runId ?? r.id), true)))
		.sort((a, b) => Number(b.evidence) - Number(a.evidence) || a.id.localeCompare(b.id))
}

/** The Critic red-team evaluations (docs/evidence/critic-eval*), summarised for the UI. */
function evals() {
	const read = (d: string) => {
		const f = join("docs/evidence", d, "results.json")
		if (!existsSync(f)) return null
		const { summary, rows } = JSON.parse(readFileSync(f, "utf-8"))
		const truth = (r: any) => r.truth ?? r.kind === "true_claim"
		return {
			id: d,
			summary,
			misses: rows.filter((r: any) => !truth(r) && !r.blocked).map((r: any) => ({ claim: r.claim, evidence: r.evidence, support: r.support, note: r.note })),
			falseBlocks: rows.filter((r: any) => truth(r) && r.blocked).map((r: any) => ({ kind: r.kind, claim: r.claim, evidence: r.evidence, support: r.support })),
		}
	}
	return { easy: read("critic-eval"), hardBefore: read("critic-eval-hard-v1"), hardAfter: read("critic-eval-hard") }
}

function readBody(req: IncomingMessage): Promise<string> {
	return new Promise((ok, fail) => {
		let data = ""
		req.on("data", (c) => {
			data += c
			if (data.length > 20_000) {
				fail(new Error("body too large"))
				req.destroy()
			}
		})
		req.on("end", () => ok(data))
		req.on("error", fail)
	})
}

async function startSearch(req: IncomingMessage, res: ServerResponse) {
	if (!LIVE_SEARCH) return json(res, 403, { error: "Live search is switched off on this server. Replays are available." })
	if (activeSearch) return json(res, 409, { error: "A search is already running. Try again when it finishes.", id: activeSearch })
	const l = ledger()
	if (l.spentUsd + PER_SEARCH_BUDGET > TOTAL_SEARCH_BUDGET) return json(res, 402, { error: "The search budget for this demo is used up." })
	// Take the lock before awaiting the body, so two requests cannot both pass the checks above.
	const id = `search-${new Date().toISOString().replace(/[:.]/g, "-")}`
	activeSearch = id
	let body: { company?: string; problem?: string }
	try {
		body = JSON.parse(await readBody(req))
	} catch {
		activeSearch = null
		return json(res, 400, { error: "Send JSON with company and problem." })
	}
	const company = String(body.company ?? "").trim()
	const problem = String(body.problem ?? "").trim()
	if (problem.length < 80) {
		activeSearch = null
		return json(res, 400, { error: "Describe the problem in at least a few sentences (80+ characters)." })
	}
	const dir = join("runs", id)
	mkdirSync(dir, { recursive: true })
	writeFileSync(join(dir, "input.json"), JSON.stringify({ company: company || "Unnamed company", problem }, null, 2))
	writeFileSync(join(dir, "trace.jsonl"), "")
	const child = spawn(process.execPath, ["--import", "tsx", "src/run.ts", "--live", `--input=${join(dir, "input.json")}`, `--out=${dir}`], {
		env: { ...process.env, ALLOW_LIVE: "1", BUDGET_USD: String(PER_SEARCH_BUDGET) },
		stdio: ["ignore", "pipe", "pipe"],
	})
	const log: string[] = []
	child.stdout.on("data", (d) => log.push(String(d)))
	child.stderr.on("data", (d) => log.push(String(d)))
	child.on("exit", (code) => {
		writeFileSync(join(dir, "process.log"), log.join(""))
		// A search that died before writing its report may still have spent money: count it at its cap.
		let spent = PER_SEARCH_BUDGET
		try {
			spent = JSON.parse(readFileSync(join(dir, "run.json"), "utf-8")).summary.spend.usd
		} catch {
			writeFileSync(join(dir, "failed.json"), JSON.stringify({ code, countedAtCapUsd: PER_SEARCH_BUDGET }))
		}
		const now = ledger()
		writeFileSync(LEDGER, JSON.stringify({ spentUsd: now.spentUsd + spent, searches: now.searches + 1 }, null, 2))
		activeSearch = null
	})
	json(res, 202, { id })
}

function stream(id: string, res: ServerResponse) {
	const dir = runDir(id)
	if (!dir) return json(res, 404, { error: "unknown run" })
	res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-store", Connection: "keep-alive", "X-Accel-Buffering": "no" })
	let offset = 0
	let carry = ""
	const tick = () => {
		const path = join(dir, "trace.jsonl")
		const size = existsSync(path) ? statSync(path).size : 0
		if (size > offset) {
			const chunk = readFileSync(path).subarray(offset, size).toString("utf-8")
			offset = size
			const lines = (carry + chunk).split("\n")
			carry = lines.pop() ?? ""
			for (const line of lines) if (line.trim()) res.write(`event: trace\ndata: ${line}\n\n`)
		}
		if (existsSync(join(dir, "run.json"))) {
			res.write(`event: done\ndata: {}\n\n`)
			clearInterval(timer)
			res.end()
		} else if (existsSync(join(dir, "failed.json"))) {
			res.write(`event: failed\ndata: {}\n\n`)
			clearInterval(timer)
			res.end()
		}
	}
	const timer = setInterval(tick, 250)
	res.on("close", () => clearInterval(timer))
	tick()
}

function record(id: string, runId: string | null, res: ServerResponse) {
	if (/^Q001/.test(id) && runId) {
		const dir = runDir(runId)
		const input = dir && existsSync(join(dir, "input.json")) ? JSON.parse(readFileSync(join(dir, "input.json"), "utf-8")) : null
		if (input) return json(res, 200, { id, kind: id.includes("CH") ? "challenge" : "company", text: id.includes("CH") ? input.problem : input.company })
	}
	const kind = ds.kindOf(id)
	if (!kind) return json(res, 404, { error: "unknown id" })
	return json(res, 200, { id, kind, text: ds.evidenceText(id) })
}

function serveStatic(path: string, res: ServerResponse) {
	const file = resolve(PUBLIC, "." + (path === "/" ? "/index.html" : path))
	if (!file.startsWith(PUBLIC) || !existsSync(file) || !statSync(file).isFile()) {
		res.writeHead(404)
		return res.end("Not found")
	}
	res.writeHead(200, { "Content-Type": MIME[extname(file)] ?? "application/octet-stream", "Cache-Control": "no-cache" })
	createReadStream(file).pipe(res)
}

createServer(async (req, res) => {
	const url = new URL(req.url ?? "/", "http://local")
	const p = url.pathname
	try {
		// nginx marks requests from the public internet; live search stays VPN-only (replays are free).
		const isPublic = req.headers["x-einstein-access"] !== "vpn" && process.env.TRUST_ACCESS_HEADER === "1"
		const liveSearch = LIVE_SEARCH && !isPublic
		if (req.method === "GET" && p === "/api/config") return json(res, 200, { liveSearch, publicReplayOnly: isPublic, activeSearch, perSearchBudgetUsd: PER_SEARCH_BUDGET, ...ledger(), totalBudgetUsd: TOTAL_SEARCH_BUDGET })
		if (req.method === "GET" && p === "/api/runs") return json(res, 200, listRuns())
		if (req.method === "GET" && p === "/api/evals") return json(res, 200, evals())
		if (req.method === "GET" && p.startsWith("/api/runs/")) {
			const id = p.slice("/api/runs/".length)
			const dir = runDir(id)
			if (!dir || !(existsSync(join(dir, "run.json")) || existsSync(join(dir, "summary.json")))) return json(res, 404, { error: "unknown run" })
			return json(res, 200, buildView(ds, id, dir))
		}
		if (req.method === "GET" && p.startsWith("/api/record/")) return record(decodeURIComponent(p.slice("/api/record/".length)), url.searchParams.get("run"), res)
		if (req.method === "POST" && p === "/api/search") {
			if (!liveSearch) return json(res, 403, { error: "Live search is off on the public demo. Recorded runs replay at no cost; run it yourself with ALLOW_LIVE_SEARCH=1 (see README)." })
			return startSearch(req, res)
		}
		if (req.method === "GET" && p.startsWith("/api/stream/")) return stream(p.slice("/api/stream/".length), res)
		if (req.method === "GET") return serveStatic(p, res)
		json(res, 405, { error: "method not allowed" })
	} catch (e: any) {
		json(res, 500, { error: e?.message ?? "error" })
	}
}).listen(PORT, HOST, () => console.log(`matchmaker UI on http://${HOST}:${PORT} (live search ${LIVE_SEARCH ? "ON" : "off"})`))
