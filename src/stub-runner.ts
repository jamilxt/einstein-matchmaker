// Offline InferenceRunner used when not --live. It plays each role from the dataset itself so the
// full concurrent system runs end to end without a key. It is clearly labelled in every output.
// The stub Writer deliberately cites a wrong id on some first drafts, so the Critic path is exercised.
import {
	FunctionCallItem,
	FunctionCallOutputItem,
	InputTokenDetails,
	ModelMessageItem,
	OutputTokenDetails,
	TokenUsage,
	type InferenceInput,
	type InferenceOutput,
	type InferenceRunner,
	type SemanticEvent,
} from "@mozaik-ai/core"
import { state } from "./runtime"
import { statedDeadline } from "./verify/deadline"

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function texts(req: InferenceInput): { developer: string; users: string[]; lastIsToolOutput: boolean; toolOutput?: string } {
	const items = req.context.getItems() as any[]
	const developer = items.find((i) => i.role === "developer")?.content?.text ?? ""
	const users = items.filter((i) => i.role === "user").map((i) => i.content?.text ?? "")
	const last = items[items.length - 1]
	const lastIsToolOutput = last instanceof FunctionCallOutputItem
	return { developer, users, lastIsToolOutput, toolOutput: lastIsToolOutput ? (last as any).output?.text : undefined }
}

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

export class StubRunner implements InferenceRunner {
	async run(req: InferenceInput): Promise<InferenceOutput> {
		await sleep(400 + Math.random() * 1200)
		const { developer, users, lastIsToolOutput, toolOutput } = texts(req)
		const role = developer.match(/\[role:(\w+)\]/)?.[1] ?? "unknown"
		const user = users[users.length - 1] ?? ""
		const target = users[0]?.match(/TARGET: (\S+)/)?.[1] ?? ""
		let item: FunctionCallItem | ModelMessageItem

		if ((role === "profiler" || role === "analyst") && !lastIsToolOutput) {
			const tool = role === "profiler" ? "get_researcher_evidence" : "get_challenge_evidence"
			item = FunctionCallItem.rehydrate({ callId: `call_${hash(target + Date.now())}`, name: tool, args: JSON.stringify({ id: target }) })
		} else if (role === "profiler") {
			item = ModelMessageItem.rehydrate({ text: JSON.stringify(stubResearcherProfile(target, toolOutput ?? "")) })
		} else if (role === "analyst") {
			item = ModelMessageItem.rehydrate({ text: JSON.stringify(stubCompanyProfile(target)) })
		} else if (role === "writer") {
			const revising = user.startsWith("CRITIC")
			item = ModelMessageItem.rehydrate({ text: JSON.stringify(stubProposal(target, revising)) })
		} else {
			item = ModelMessageItem.rehydrate({ text: "{}" })
		}

		const inTok = Math.ceil(JSON.stringify(req.context.getItems()).length / 4)
		const outTok = Math.ceil(JSON.stringify(item).length / 4)
		const usage = new TokenUsage(inTok, outTok, inTok + outTok, new InputTokenDetails(0), new OutputTokenDetails(0))
		return { items: [item], tokenUsage: usage, rowResponse: { stub: true } }
	}

	// eslint-disable-next-line require-yield
	async *stream(): AsyncGenerator<SemanticEvent> {
		throw new Error("StubRunner does not stream")
	}
}

function stubResearcherProfile(researcherId: string, _evidence: string) {
	const ds = state().ds
	const r = ds.researchers.get(researcherId)!
	const pubs = r.publications.slice(0, 6).map((id) => ds.publications.get(id)!).filter(Boolean)
	return {
		summary: `[stub] ${r.name}, ${r.title}, ${r.department}. Works on ${r.fields.slice(0, 2).join(" and ")}.`,
		expertise: pubs.slice(0, 3).map((p) => ({ topic: p.keywords.slice(0, 2).join(", ") || p.title, evidence: [p.id] })),
	}
}

function stubCompanyProfile(challengeId: string) {
	const ds = state().ds
	const { challenge, company } = ds.challenges.get(challengeId)!
	return {
		summary: `[stub] ${company.name} (${company.sector}). ${challenge.text}`,
		needs: [{ need: challenge.text, evidence: [challenge.id] }],
	}
}

function stubProposal(key: string, revising: boolean) {
	const s = state()
	const [researcherId, challengeId] = key.split("x")
	const rp = s.researcherProfiles.get(researcherId)!
	const r = s.ds.researchers.get(researcherId)!
	const { challenge, company } = s.ds.challenges.get(challengeId)!
	const form = s.selected.get(key)?.form ?? "industrial_phd"
	const claims = [
		{ text: `${company.name} states: ${challenge.text}`, about: "company" as const, evidence: [challenge.id] },
		{ text: `${company.name} offers: ${company.rd_capacity}`, about: "company" as const, evidence: [company.id] },
		{ text: `${r.name} is ${r.title} in the ${r.department}.`, about: "researcher" as const, evidence: [r.id] },
		...rp.expertise.slice(0, 2).map((e) => ({ text: `${r.name} has published on ${e.topic}.`, about: "researcher" as const, evidence: e.evidence })),
	]
	const planted = !revising && hash(key) % 2 === 0
	if (planted) {
		// Planted mistakes: an id that does not exist, and a real paper by someone else.
		const foreign = [...s.ds.publications.values()].find((p) => !p.authors.some((a) => a.researcher_id === researcherId))!
		claims.push({ text: `${r.name} also led a widely cited study on this exact problem.`, about: "researcher", evidence: ["SYN-PUB-99999"] })
		claims.push({ text: `${r.name} authored "${foreign.title}".`, about: "researcher", evidence: [foreign.id] })
	}
	const deadline = statedDeadline(`${challenge.text} ${challenge.detail ?? ""}`)
	const early = deadline && deadline.months < 12 ? [`Months 1 to ${Math.max(1, Math.floor(deadline.months))}`] : []
	const periods = form === "industrial_phd" ? [...early, "Year 1", "Year 2", "Year 3"] : form === "joint_project" ? ["Months 1 to 6", "Months 7 to 18"] : ["Months 1 to 3", "Months 4 to 9"]
	return {
		title: `[stub] ${rp.expertise[0]?.topic ?? r.fields[0]} for ${company.name}`,
		// Planted prose mistake on some first drafts: a figure that no claim backs.
		problem: challenge.text + (planted ? " The company has 999999 employees." : ""),
		research_questions: [`[stub] Can ${r.fields[0]} methods address: ${challenge.text.slice(0, 80)}?`],
		plan: periods.map((period) => ({ period, work: `[stub] ${period} work`, result: `[stub] ${period} result`, pass_if: `[stub] ${period} target met` })),
		company_brings: `[stub] ${company.rd_capacity}`,
		faculty_brings: `[stub] ${r.department}`,
		why_this_pair: `[stub] ${rp.summary.replace(/\d+/g, "")}`,
		novelty: "[stub] what is new beyond the researcher's own papers",
		data_status: "[stub] data the records describe, and data to collect",
		company_deadline: deadline?.sentence ?? "none stated",
		first_step: "[stub] a two-day workshop at NTP",
		to_agree: "[stub] funding, IP, publication delay, data access",
		claims,
	}
}
