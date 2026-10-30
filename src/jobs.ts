// One agent turn = one job. Each job gets its own fresh ModelContext (two live loops sharing one
// memory cross-contaminate), its own InterceptionHandler bound to the job, and a watchdog,
// because runLoop swallows failures (jigjoy-ai/mozaik#114): a dead loop otherwise looks like a quiet one.
import {
	DeveloperMessageItem,
	ModelContext,
	ModelMessageItem,
	type Agent,
	type ExecutableTransition,
	type InferenceInput,
	type InterceptionHandler,
	type StructuredOutputFormat,
	type Tool,
} from "@mozaik-ai/core"
import { OUTPUT_ALLOWANCE_TOKENS, PRICES, TUNING } from "./config"
import { emit, runLoop, state } from "./runtime"

export type AnswerVerdict = { accept: true } | { accept: false; correction: string }

export type JobSpec = {
	jobId: string
	kind: string
	agent: Agent
	model: string
	message: string
	tools?: Tool[]
	structuredOutput?: StructuredOutputFormat
	/** Called with the model's final text before it is committed. Return a correction to send it back. */
	review: (text: string, attempt: number) => Promise<AnswerVerdict>
	/** Called once when the job ends (accepted, halted, stalled). */
	done: (outcome: "done" | "halted" | "stalled" | "failed") => void
}

export function runJob(spec: JobSpec): void {
	const s = state()
	const name = spec.agent.getManifest().name
	const rec = { jobId: spec.jobId, agent: name, kind: spec.kind, startedAt: s.now(), status: "running" as const }
	s.jobs.set(spec.jobId, rec)
	emit("job.started", spec.agent.getId(), { jobId: spec.jobId, agent: name, kind: spec.kind })

	let finished = false
	/** Set when the job ended without an accepted answer (budget, watchdog, error): the loop must stop at its next step. */
	let abort: "halted" | "stalled" | "failed" | null = null
	let held = 0
	const releaseHeld = () => {
		s.release(held)
		held = 0
	}
	const finish = (status: "done" | "halted" | "stalled" | "failed") => {
		if (finished) return
		finished = true
		if (status !== "done") abort = status
		clearTimeout(watchdog)
		releaseHeld()
		const r = s.jobs.get(spec.jobId)!
		r.finishedAt = s.now()
		r.status = status
		emit("job.finished", spec.agent.getId(), { jobId: spec.jobId, agent: name, kind: spec.kind, status })
		spec.done(status)
	}

	// runLoop swallows failures (mozaik#114), so a timeout is the only signal. It also stops the loop:
	// the next transition is redirected to a final message, so no further inference starts and no late
	// answer is reviewed or committed. A request already in flight cannot be cancelled from here.
	const watchdog = setTimeout(() => finish("stalled"), TUNING.jobTimeoutMs)

	const context = ModelContext.create().addContextItem(DeveloperMessageItem.create(spec.agent.getDeveloperMessage()))
	const input: InferenceInput = { model: spec.model, context, tools: spec.tools ?? [], structuredOutput: spec.structuredOutput }
	let attempt = 0
	const price = PRICES[spec.model] ?? { input: 0, output: 0 }
	const endLoop = (why: string): ExecutableTransition => ({ nextStateId: "model_message", input: { answer: ModelMessageItem.rehydrate({ text: JSON.stringify({ [why]: true }) }) } }) as ExecutableTransition

	const handler: InterceptionHandler = {
		isSatisfiedBy(t: ExecutableTransition) {
			if (abort) return t.nextStateId === "inference" || t.nextStateId === "model_message"
			if (finished) return false
			return t.nextStateId === "model_message" || t.nextStateId === "inference" || held > 0
		},
		async handle(t: ExecutableTransition): Promise<ExecutableTransition> {
			// Ended early: close the loop through model_message. Never redirect to "idle" (mozaik#113).
			if (abort) return endLoop(abort)
			if (t.nextStateId === "inference") {
				releaseHeld() // previous call (if any) has been charged by now
				const inputTokens = JSON.stringify(context.getItems()).length / 4
				const est = (inputTokens * price.input + OUTPUT_ALLOWANCE_TOKENS * price.output) / 1_000_000
				if (!s.reserve(est)) {
					finish("halted")
					return endLoop("halted")
				}
				held = est
				return t
			}
			releaseHeld() // the inference this job held budget for has completed
			if (t.nextStateId !== "model_message") return t
			const text = (t.input as { answer: ModelMessageItem }).answer.content.text
			try {
				attempt += 1
				const v = await spec.review(text, attempt)
				if (abort) return endLoop(abort) // the watchdog fired while the Critic was reviewing
				if (!v.accept && !s.halted) {
					return { nextStateId: "message_received", input: { content: v.correction, input } } as ExecutableTransition
				}
				finish(s.halted && !v.accept ? "halted" : "done")
			} catch (e: any) {
				console.log(`[job ${spec.jobId}] review failed: ${e?.message ?? e}`)
				finish("failed")
				return endLoop("failed")
			}
			return t
		},
	}

	runLoop(spec.agent.getId(), spec.message, input, handler)
}
