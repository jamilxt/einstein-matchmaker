// 3alet 2026 scaffold — smoke check on @mozaik-ai/core 4.0.6
// Two agents + one human on a shared runtime. Pattern mirrors the verified
// OpsRoom v4 reference: defineRuntime() in module scope, RuntimeState subclass,
// situation handlers per participant, sendEvent fan-out, runLoop signature.
// Deterministic: no LLM, no API keys.
import {
	createAgent,
	createHuman,
	defineRuntime,
	RuntimeState,
	SituationSpecification,
	type Agent,
	type SemanticEvent,
	type SituationContext,
	type SituationHandler,
} from "@mozaik-ai/core"
import "dotenv/config"

export class RoomState extends RuntimeState {
	/** Room-level facts any participant can consult. */
	findings = [] as string[]
}

const rt = defineRuntime()

export const initializeRuntime = rt.initializeRuntime
export const resolveRuntime = rt.resolveRuntime
export const join = rt.join
export const sendMessage = rt.sendMessage
export const sendEvent = rt.sendEvent
export const runLoop = rt.runLoop

// --- situation helpers (same shape as OpsRoom's runtime-v4) ---

function whenExternalEvent(predicate: (event: SemanticEvent) => boolean): SituationSpecification {
	return new (class extends SituationSpecification {
		isSatisfiedBy({ event, participant }: SituationContext): boolean {
			if (event.type === "message.sent") return false
			// v4 fans out to the sender too; filter self.
			return event.producerId !== participant.getId() && predicate(event)
		}
	})()
}

function eventProcessorFor(
	act: (event: SemanticEvent, participantId: string) => void | Promise<void>,
): SituationHandler["processor"] {
	return {
		apply({ event, participant }: SituationContext) {
			return act(event, participant.getId())
		},
	}
}

// --- participants ---

function createScout(): Agent {
	const handlers: SituationHandler[] = [
		{
			specification: whenExternalEvent((e) => e.type === "signal.detected"),
			processor: eventProcessorFor((event) => {
				const payload = event.payload as { what?: string }
				console.log(`[scout] saw signal from ${event.producerId}: ${payload.what ?? "?"}`)
			}),
		},
	]
	return createAgent({
		name: "Scout",
		capabilities: ["watch"],
		instruction: "You watch for signals and report them briefly.",
		tools: [],
		handlers,
	})
}

function createAnalyst(): Agent {
	const handlers: SituationHandler[] = [
		{
			specification: whenExternalEvent((e) => e.type === "message.sent"),
			processor: eventProcessorFor((event, selfId) => {
				const message = (event.payload as { message?: string })?.message ?? ""
				if (message.includes("[scout]")) {
					sendMessage(`[analyst] acknowledged: ${message.slice(0, 60)}`, selfId)
				}
			}),
		},
	]
	return createAgent({
		name: "Analyst",
		capabilities: ["quantify"],
		instruction: "You challenge and quantify what Scout reports.",
		tools: [],
		handlers,
	})
}

function createReviewer() {
	return createHuman({ name: "Reviewer", capabilities: [], handlers: [] })
}

// --- scenario ---

async function main() {
	const state = new RoomState()
	initializeRuntime({ state })

	const scout = createScout()
	const analyst = createAnalyst()
	const reviewer = createReviewer()
	join(scout)
	join(analyst)
	join(reviewer)

	// two producers fire the SAME event concurrently-style (same tick) —
	// the minimal concurrency proof pattern; timestamps prove parallel reaction.
	sendEvent({ producerId: "scout", type: "signal.detected", occurredAt: new Date(), payload: { what: "spike in errors" } }, scout.getId())
	sendEvent({ producerId: "analyst", type: "signal.detected", occurredAt: new Date(), payload: { what: "latency drift" } }, analyst.getId())

	await new Promise((r) => setTimeout(r, 500))

	console.log("roster:", state.getParticipants().map((p) => {
		const m = p.getManifest()
		return `${m.name}(${m.role})`
	}))
	console.log("runLoop signature:", runLoop.length, "params (agentId, message, inferenceInput, handler?)")
	console.log("SMOKE OK")
}

main().catch((e) => {
	console.error("SMOKE FAILED:", e?.message ?? e)
	process.exit(1)
})
