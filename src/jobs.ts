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
import { TUNING } from "./config"
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
	const finish = (status: "done" | "halted" | "stalled" | "failed") => {
		if (finished) return
		finished = true
		clearTimeout(watchdog)
		const r = s.jobs.get(spec.jobId)!
		r.finishedAt = s.now()
		r.status = status
		emit("job.finished", spec.agent.getId(), { jobId: spec.jobId, agent: name, kind: spec.kind, status })
		spec.done(status)
	}

	const watchdog = setTimeout(() => finish("stalled"), TUNING.jobTimeoutMs)

	const context = ModelContext.create().addContextItem(DeveloperMessageItem.create(spec.agent.getDeveloperMessage()))
	const input: InferenceInput = { model: spec.model, context, tools: spec.tools ?? [], structuredOutput: spec.structuredOutput }
	let attempt = 0

	const handler: InterceptionHandler = {
		isSatisfiedBy(t: ExecutableTransition) {
			if (finished) return false
			return t.nextStateId === "model_message" || (t.nextStateId === "inference" && s.halted)
		},
		async handle(t: ExecutableTransition): Promise<ExecutableTransition> {
			if (t.nextStateId === "inference") {
				// Budget spent: end the loop cleanly through model_message. Never redirect to "idle" (mozaik#113).
				finish("halted")
				return { nextStateId: "model_message", input: { answer: ModelMessageItem.rehydrate({ text: '{"halted":true}' }) } }
			}
			const text = (t.input as { answer: ModelMessageItem }).answer.content.text
			try {
				attempt += 1
				const v = await spec.review(text, attempt)
				if (!v.accept && !s.halted) {
					return { nextStateId: "message_received", input: { content: v.correction, input } }
				}
				finish("done")
			} catch (e: any) {
				console.log(`[job ${spec.jobId}] review failed: ${e?.message ?? e}`)
				finish("failed")
			}
			return t
		},
	}

	runLoop(spec.agent.getId(), spec.message, input, handler)
}
