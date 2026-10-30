// Phase 1 self-test: load data, build the shortlist, exercise the citation checker. No API calls.
import { Dataset } from "./data/dataset"
import { ResearcherIndex, shortlistPairs } from "./data/shortlist"
import { checkCitations } from "./verify/citations"

const t0 = Date.now()
const ds = Dataset.load()
const tLoad = Date.now() - t0
const index = new ResearcherIndex(ds)
const pairs = shortlistPairs(ds, index, 3)
const tIndex = Date.now() - t0 - tLoad

console.log(
	`loaded ${ds.researchers.size} researchers, ${ds.companies.size} companies, ${ds.challenges.size} challenges, ` +
		`${ds.publications.size} publications, ${ds.projects.size} projects, ${ds.patents.size} patents in ${tLoad}ms`,
)
console.log(`indexed ${index.size} researchers open to collaboration (${index.excluded.length} excluded by open_to) in ${tIndex}ms`)
console.log(`shortlist: ${pairs.length} candidate pairs (3 per challenge)`)

for (const chId of ["C001-CH1", [...ds.challenges.keys()][200]]) {
	const { challenge, company } = ds.challenges.get(chId)!
	console.log(`\n${chId} ${company.name}: ${challenge.text.slice(0, 110)}...`)
	for (const p of pairs.filter((x) => x.challengeId === chId)) {
		const r = ds.researchers.get(p.researcherId)!
		console.log(`  ${p.researcherId} ${r.name} | ${r.fields.slice(0, 2).join("; ")} | score ${p.retrievalScore} | ${p.matchedTerms.slice(0, 6).join(", ")}`)
	}
}

// Citation checker: one good claim, one invented id, one real id owned by someone else.
const pair = pairs.find((p) => p.challengeId === "C001-CH1")!
const r = ds.researchers.get(pair.researcherId)!
const otherPub = [...ds.publications.values()].find((p) => !p.authors.some((a) => a.researcher_id === r.id))!
const issues = checkCitations(ds, pair, [
	{ text: "Has published on the topic.", about: "researcher", evidence: [r.publications[0]] },
	{ text: "Holds an invented paper.", about: "researcher", evidence: ["SYN-PUB-99999"] },
	{ text: "Cites someone else's paper.", about: "researcher", evidence: [otherPub.id] },
	{ text: "Company needs anomaly detection.", about: "company", evidence: ["C001-CH1"] },
	{ text: "Cites nothing.", about: "company", evidence: [] },
])
console.log("\ncitation checker:", issues.map((i) => `${i.kind}${i.id ? ":" + i.id : ""}`).join(", "))
const expect = ["unknown_id:SYN-PUB-99999", `wrong_owner:${otherPub.id}`, "no_evidence"]
const got = issues.map((i) => `${i.kind}${i.id ? ":" + i.id : ""}`)
console.log(expect.every((e) => got.includes(e)) && got.length === 3 ? "CHECKER OK" : "CHECKER FAILED")
