// Loads the EINSTEIN synthetic dataset and builds lookup maps.
// Every entity keeps its dataset id so any claim can be traced back to a record.
import { readFileSync } from "node:fs"
import { join } from "node:path"

export type Researcher = {
	id: string
	name: string
	title: string
	faculty: string
	department: string
	fields: string[]
	keywords: string[]
	bio: string
	publications: string[]
	projects: string[]
	patents: string[]
	open_to: string[]
	industry_experience: string
	notes: string
}

export type Challenge = { id: string; text: string; detail: string }

export type Company = {
	id: string
	name: string
	sector: string
	employees: number
	location: string
	about: string
	products: string[]
	tech: string[]
	challenges: Challenge[]
	plans: string
	rd_capacity: string
	past_collaborations: string
}

export type Publication = {
	id: string
	title: string
	abstract: string
	year: string
	venue: string
	keywords: string[]
	authors: { name: string; researcher_id?: string }[]
}

export type Project = {
	id: string
	title: string
	summary: string
	years: string
	programme: string
	participants: { researcher_id: string; role: string }[]
}

export type Patent = {
	id: string
	title: string
	abstract: string
	year: string
	status: string
	inventors: { researcher_id: string; name: string }[]
}

export type CompanyPage = { company_id: string; kind: string; title: string; date: string; text: string }

export class Dataset {
	readonly researchers = new Map<string, Researcher>()
	readonly companies = new Map<string, Company>()
	readonly challenges = new Map<string, { challenge: Challenge; company: Company }>()
	readonly publications = new Map<string, Publication>()
	readonly projects = new Map<string, Project>()
	readonly patents = new Map<string, Patent>()
	readonly pagesByCompany = new Map<string, CompanyPage[]>()

	static load(dir = join(process.cwd(), "data")): Dataset {
		const ds = new Dataset()
		const json = (f: string) => JSON.parse(readFileSync(join(dir, f), "utf-8"))
		const jsonl = (f: string) =>
			readFileSync(join(dir, f), "utf-8")
				.split("\n")
				.filter((l) => l.trim())
				.map((l) => JSON.parse(l))

		for (const r of json("researchers.json").researchers as Researcher[]) ds.researchers.set(r.id, r)
		for (const c of json("companies.json").companies as Company[]) {
			ds.companies.set(c.id, c)
			for (const ch of c.challenges ?? []) ds.challenges.set(ch.id, { challenge: ch, company: c })
		}
		for (const p of jsonl("publications.jsonl") as Publication[]) ds.publications.set(p.id, p)
		for (const p of json("projects.json").projects as Project[]) ds.projects.set(p.id, p)
		for (const p of json("patents.json").patents as Patent[]) ds.patents.set(p.id, p)
		for (const pg of jsonl("company-pages.jsonl") as CompanyPage[]) {
			const list = ds.pagesByCompany.get(pg.company_id) ?? []
			list.push(pg)
			ds.pagesByCompany.set(pg.company_id, list)
		}
		return ds
	}

	/** Which entity an id refers to, or undefined if it does not exist in the dataset. */
	kindOf(id: string): "researcher" | "company" | "challenge" | "publication" | "project" | "patent" | undefined {
		if (this.researchers.has(id)) return "researcher"
		if (this.companies.has(id)) return "company"
		if (this.challenges.has(id)) return "challenge"
		if (this.publications.has(id)) return "publication"
		if (this.projects.has(id)) return "project"
		if (this.patents.has(id)) return "patent"
		return undefined
	}

	/** True when the evidence id is linked to the given researcher in the dataset itself. */
	belongsToResearcher(evidenceId: string, researcherId: string): boolean {
		const pub = this.publications.get(evidenceId)
		if (pub) return pub.authors.some((a) => a.researcher_id === researcherId)
		const prj = this.projects.get(evidenceId)
		if (prj) return prj.participants.some((p) => p.researcher_id === researcherId)
		const pat = this.patents.get(evidenceId)
		if (pat) return pat.inventors.some((i) => i.researcher_id === researcherId)
		return false
	}

	/** True when the evidence id (challenge id or company id) is the given company's own record. */
	belongsToCompany(evidenceId: string, companyId: string): boolean {
		if (evidenceId === companyId) return true
		return this.challenges.get(evidenceId)?.company.id === companyId
	}

	/** Short text of any record, used as evidence for claim checks. */
	evidenceText(id: string): string | undefined {
		const pub = this.publications.get(id)
		if (pub)
			return `${pub.id} (${pub.year}, ${pub.venue}): ${pub.title}. Authors: ${pub.authors.map((a) => a.name + (a.researcher_id ? ` (${a.researcher_id})` : "")).join(", ")}. Keywords: ${pub.keywords.join(", ")}. ${pub.abstract}`
		const prj = this.projects.get(id)
		if (prj)
			return `${prj.id} (${prj.programme}, ${prj.years}): ${prj.title}. Participants: ${prj.participants.map((x) => `${this.researchers.get(x.researcher_id)?.name ?? x.researcher_id} (${x.researcher_id}, ${x.role})`).join(", ")}. ${prj.summary}`
		const pat = this.patents.get(id)
		if (pat)
			return `${pat.id} (${pat.status}, ${pat.year}): ${pat.title}. Inventors: ${pat.inventors.map((i) => `${i.name} (${i.researcher_id})`).join(", ")}. ${pat.abstract}`
		const ch = this.challenges.get(id)
		if (ch) return `${ch.challenge.id} (${ch.company.name}): ${ch.challenge.text} ${ch.challenge.detail}`
		const r = this.researchers.get(id)
		if (r)
			return `${r.id} ${r.name}, ${r.title}, ${r.faculty}, ${r.department}. Fields: ${r.fields.join(", ")}. Keywords: ${r.keywords.join(", ")}. ${r.bio} Industry experience: ${r.industry_experience}`
		const c = this.companies.get(id)
		if (c && /^Q\d+$/.test(c.id)) return `${c.id} ${c.name}: a company that described itself only through the problem statement it submitted. No size, sector, location or history was given.`
		if (c)
			return `${c.id} ${c.name}: ${c.sector}, ${c.employees ? `${c.employees} employees` : "size not stated"}, founded ${(c as any).founded ?? "n/a"}, based in ${c.location}. ${c.about} Products: ${c.products.join("; ")}. Tech: ${c.tech.join("; ")}. R&D capacity: ${c.rd_capacity} Past collaborations: ${c.past_collaborations}`
		return undefined
	}
}
