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

function listRuns() {
	const out: any[] = []
	for (const root of ROOTS) {
		if (!existsSync(root)) continue
		for (const id of readdirSync(root)) {
			const d = join(root, id)
			if (!existsSync(join(d, "run.json"))) continue
			try {
				const run = JSON.parse(readFileSync(join(d, "run.json"), "utf-8"))
				const input = existsSync(join(d, "input.json")) ? JSON.parse(readFileSync(join(d, "input.json"), "utf-8")) : null
				out.push({
					id,
					reverse: !!run.reverse,
					mode: run.summary.mode,
					critic: run.summary.critic,
					proposals: run.proposals.length,
					peakInFlight: run.summary.concurrency.peakInFlight,
					wallClockMs: run.summary.wallClockMs,
					spendUsd: run.summary.spend.usd,
					company: input?.company ?? null,
					modified: statSync(join(d, "run.json")).mtimeMs,
				})
			} catch {
				/* skip unreadable runs */
			}
		}
	}
	return out.filter((r) => r.mode === "live" || process.env.SHOW_STUB_RUNS === "1").sort((a, b) => b.modified - a.modified)
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
	let body: { company?: string; problem?: string }
	try {
		body = JSON.parse(await readBody(req))
	} catch {
		return json(res, 400, { error: "Send JSON with company and problem." })
	}
	const company = String(body.company ?? "").trim()
	const problem = String(body.problem ?? "").trim()
	if (problem.length < 80) return json(res, 400, { error: "Describe the problem in at least a few sentences (80+ characters)." })
	const id = `search-${new Date().toISOString().replace(/[:.]/g, "-")}`
	const dir = join("runs", id)
	mkdirSync(dir, { recursive: true })
	writeFileSync(join(dir, "input.json"), JSON.stringify({ company: company || "Unnamed company", problem }, null, 2))
	writeFileSync(join(dir, "trace.jsonl"), "")
	activeSearch = id
	const child = spawn(process.execPath, ["--import", "tsx", "src/run.ts", "--live", `--input=${join(dir, "input.json")}`, `--out=${dir}`], {
		env: { ...process.env, ALLOW_LIVE: "1", BUDGET_USD: String(PER_SEARCH_BUDGET) },
		stdio: ["ignore", "pipe", "pipe"],
	})
	const log: string[] = []
	child.stdout.on("data", (d) => log.push(String(d)))
	child.stderr.on("data", (d) => log.push(String(d)))
	child.on("exit", (code) => {
		writeFileSync(join(dir, "process.log"), log.join(""))
		try {
			const run = JSON.parse(readFileSync(join(dir, "run.json"), "utf-8"))
			const now = ledger()
			writeFileSync(LEDGER, JSON.stringify({ spentUsd: now.spentUsd + run.summary.spend.usd, searches: now.searches + 1 }, null, 2))
		} catch {
			writeFileSync(join(dir, "failed.json"), JSON.stringify({ code }))
		}
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
			res.write(`event: done\ndata: ${readFileSync(join(dir, "run.json"), "utf-8").replace(/\n/g, "")}\n\n`)
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
		if (req.method === "GET" && p === "/api/config") return json(res, 200, { liveSearch: LIVE_SEARCH, activeSearch, perSearchBudgetUsd: PER_SEARCH_BUDGET, ...ledger(), totalBudgetUsd: TOTAL_SEARCH_BUDGET })
		if (req.method === "GET" && p === "/api/runs") return json(res, 200, listRuns())
		if (req.method === "GET" && p.startsWith("/api/runs/")) {
			const id = p.slice("/api/runs/".length)
			const dir = runDir(id)
			if (!dir || !existsSync(join(dir, "run.json"))) return json(res, 404, { error: "unknown run" })
			const trace = readFileSync(join(dir, "trace.jsonl"), "utf-8").split("\n").filter(Boolean).map((l) => JSON.parse(l))
			const input = existsSync(join(dir, "input.json")) ? JSON.parse(readFileSync(join(dir, "input.json"), "utf-8")) : null
			return json(res, 200, { id, input, run: JSON.parse(readFileSync(join(dir, "run.json"), "utf-8")), trace })
		}
		if (req.method === "GET" && p.startsWith("/api/record/")) return record(decodeURIComponent(p.slice("/api/record/".length)), url.searchParams.get("run"), res)
		if (req.method === "POST" && p === "/api/search") return startSearch(req, res)
		if (req.method === "GET" && p.startsWith("/api/stream/")) return stream(p.slice("/api/stream/".length), res)
		if (req.method === "GET") return serveStatic(p, res)
		json(res, 405, { error: "method not allowed" })
	} catch (e: any) {
		json(res, 500, { error: e?.message ?? "error" })
	}
}).listen(PORT, HOST, () => console.log(`matchmaker UI on http://${HOST}:${PORT} (live search ${LIVE_SEARCH ? "ON" : "off"})`))
