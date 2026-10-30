// OpenAI Decisions API client (POST /v1/decisions), plus an offline stub with the same shape.
// Decisions return typed answers (probability / score) instead of text: fast, cheap checks.
import { LIVE, MODELS, PRICES } from "./config"
import { tokenize } from "./data/shortlist"
import { state } from "./runtime"

export type Question =
	| { type: "predicate"; name: string; instructions: string }
	| { type: "score"; name: string; instructions: string; levels: { label: string; description?: string }[] }

export type Answer =
	| { type: "predicate"; name: string; probability: number }
	| { type: "score"; name: string; score: number; confidence: number }
	| { type: "refusal"; name: string }

export interface Decider {
	readonly live: boolean
	decide(input: string, questions: Question[]): Promise<Answer[]>
}

/** Hold the request's input cost (Decisions output is free) before it starts; refuse once the budget is spent. */
async function withBudget<T>(input: string, questions: Question[], call: () => Promise<T>): Promise<T> {
	const s = state()
	const est = (((input.length + JSON.stringify(questions).length) / 4) * 1.25 * PRICES[`decisions:${MODELS.decisions}`].input) / 1_000_000
	if (!s.reserve(est)) throw new Error("budget spent: Decisions request not sent")
	try {
		return await call()
	} finally {
		s.release(est)
	}
}

class LiveDecider implements Decider {
	readonly live = true
	decide(input: string, questions: Question[]): Promise<Answer[]> {
		return withBudget(input, questions, () => this.send(input, questions))
	}
	private async send(input: string, questions: Question[]): Promise<Answer[]> {
		const res = await fetch("https://api.openai.com/v1/decisions", {
			method: "POST",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
			body: JSON.stringify({ model: MODELS.decisions, input, questions }),
		})
		const body: any = await res.json()
		if (!res.ok) throw new Error(`decisions HTTP ${res.status}: ${JSON.stringify(body.error ?? body).slice(0, 300)}`)
		state().charge(`decisions:${MODELS.decisions}`, body.usage?.input_tokens ?? 0, 0)
		return body.answers as Answer[]
	}
}

/**
 * Offline stand-in. Answers from term overlap between question and evidence, with realistic latency.
 * It is NOT the model; it exists so the whole system can run, be tested and be judged without a key.
 */
class StubDecider implements Decider {
	readonly live = false
	decide(input: string, questions: Question[]): Promise<Answer[]> {
		return withBudget(input, questions, () => this.answer(input, questions))
	}
	private async answer(input: string, questions: Question[]): Promise<Answer[]> {
		await new Promise((r) => setTimeout(r, 120 + Math.random() * 380))
		state().charge(`decisions:${MODELS.decisions}`, Math.ceil((input.length + JSON.stringify(questions).length) / 4), 0)
		return questions.map((q) => {
			// Each question names the evidence block it is about: [[BLOCK]] ... marks the relevant span.
			const block = q.instructions.match(/\[\[(.+?)\]\]/)?.[1]
			const scope = block ? (input.split(`### ${block}`)[1]?.split("### ")[0] ?? input) : input
			const qt = new Set(tokenize(q.instructions.replace(/\[\[.+?\]\]/g, "")))
			const st = new Set(tokenize(scope))
			const overlap = [...qt].filter((t) => st.has(t)).length / Math.max(4, qt.size)
			if (q.type === "predicate") return { type: "predicate", name: q.name, probability: Number(Math.min(0.97, 0.15 + overlap * 1.6).toFixed(2)) }
			const score = Math.min(q.levels.length - 1, overlap * 14)
			return { type: "score", name: q.name, score: Number(score.toFixed(2)), confidence: 0.6 }
		})
	}
}

export const decider: Decider = LIVE ? new LiveDecider() : new StubDecider()
