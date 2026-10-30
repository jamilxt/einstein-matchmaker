# EINSTEIN Matchmaker

A team of concurrent [Mozaik](https://github.com/jigjoy-ai/mozaik) agents that finds University of Novi Sad researchers and NTP Novi Sad companies worth an industrial PhD together, and writes a concrete, cited proposal for each pair. A Critic agent intercepts every draft and blocks any claim that the record it cites does not support.

Built for the **EINSTEIN track** of the JigJoy and NTP Novi Sad hackathon (30 to 31 October 2026), on the official synthetic dataset.

- **13 Mozaik participants on one runtime.** Screening, profiling, writing and review overlap. At the peak, 9 jobs ran at once, and in every live batch run all 21 jobs overlapped another agent's work.
- **Proposals in the shape of the EINSTEIN example topic.** Each has the company's own numbers, measurable research questions, a 3-year plan, supervisors, a first step, and a claim-by-claim source list.
- **A Critic that we measured.** It caught 52 of 53 subtle planted errors and wrongly blocked 0 of 72 true claims ([results](docs/evidence/critic-eval-hard/results.md)).
- **Two ways in:** a batch run over 60 company challenges, and **Reverse Search**, where a company types its problem and gets matched researchers.
- **A web UI** that streams a live search or replays any recorded run: agent lanes, a match map, the Critic's decisions, and proposals with clickable sources.

## Screenshots

**Agents at work.** A replay of live run 1 at 17 s. The lanes are real job start and end times from the trace. The dashed line marks the peak, 9 jobs at once, and the Critic lane shows one draft sent back (red) and one approved (green).

![Agent lanes and match map during a replay of run 1](docs/screenshots/02-agents-at-work.png)

**Proposals and the Critic.** Each proposal is laid out like the EINSTEIN example topic. The Critic feed lists every draft it sent back, the exact claim it blocked, and why.

![A proposal next to the Critic's decisions](docs/screenshots/03-proposal-and-critic.png)

**Every source is one click away.** This is the record exactly as the Critic read it.

![The source record sheet](docs/screenshots/04-source-record.png)

**Reverse Search.** A company describes its problem in its own words.

![Reverse Search form](docs/screenshots/01-find-researchers.png)

**The same team on one problem.** Fifteen candidates sit around the company's challenge, and the three chosen ones are in bold.

![Reverse Search running](docs/screenshots/05-reverse-search.png)

**How it works.** The architecture, inside the app.

![How it works page](docs/screenshots/06-how-it-works.png)

**The Critic evaluation**, including the bug it found and the one miss.

![Critic evaluation](docs/screenshots/07-critic-evaluation.png)

**On a phone, in dark mode.**

<p>
  <img src="docs/screenshots/08-mobile-dark-run.png" alt="Mobile, dark mode, run summary" width="380">
  &nbsp;
  <img src="docs/screenshots/09-mobile-dark-proposal.png" alt="Mobile, dark mode, proposal" width="380">
</p>

## What the brief asks for, and where it is

| Deliverable | Where |
| --- | --- |
| Architecture diagram | [Architecture](#architecture) below, and the **How it works** page in the web UI |
| Trace of one full run showing where the Critic stepped in | [`docs/evidence/run-01-live/trace.jsonl`](docs/evidence/run-01-live/trace.jsonl), walked through in [The Critic in a real run](#the-critic-in-a-real-run) |
| At least three proposals for three different pairs | [`docs/evidence/run-03-live/proposals.md`](docs/evidence/run-03-live/proposals.md). There are 15 batch proposals across five live runs, plus 9 from Reverse Search |
| How it plugs into the EINSTEIN network and EINSTEIN Stars | [EINSTEIN network and EINSTEIN Stars](#einstein-network-and-einstein-stars) |
| What it does, architecture, how to run | This README |

## How to run

You need Node.js 20 or newer and git. Nothing below needs an API key unless it says **live**.

```bash
git clone https://github.com/jamilxt/einstein-matchmaker
cd einstein-matchmaker
npm ci
npm run setup:data        # clones jigjoy-ai/einstein-matchmaker-data next to the repo and links ./data
```

**Offline run (no key, no cost).** The full agent team runs on a deterministic stub model, with real dataset IDs, real concurrency, and the real Critic logic:

```bash
npm start                 # batch: 60 challenges, 180 pairs, 3 proposals
npm run start:nocritic    # same, with the Critic only recording what it would block (ablation)
npx tsx src/run.ts --input=examples/conveyor.json   # Reverse Search for one company problem
```

Proposals are in English by default, even for companies that write in Serbian. Add `--lang=sr` to any run for Serbian (Latin script).

Each run writes `runs/<id>/` with `trace.jsonl` (every event), `summary.json`, `timeline.txt`, `proposals.md` and `run.json`.

**Web UI (replays need no key):**

```bash
npm run serve             # http://127.0.0.1:8791
```

The UI is prebuilt in `public/`. To rebuild it: `cd web && npm ci && cd .. && npm run build:web`.

**Live run (real OpenAI APIs).** Live mode needs both the `--live` flag and `ALLOW_LIVE=1`, so nothing spends money by accident. `BUDGET_USD` is a hard stop: every model call is metered from the API-reported token usage, and the run halts when the budget is spent.

```bash
cp .env.example .env      # add OPENAI_API_KEY
ALLOW_LIVE=1 BUDGET_USD=0.50 npm start -- --live
ALLOW_LIVE=1 BUDGET_USD=0.10 npx tsx src/run.ts --live --input=examples/vinarija.json
ALLOW_LIVE=1 ALLOW_LIVE_SEARCH=1 npm run serve     # turns on the search form in the UI
```

To run the Critic evaluation: `ALLOW_LIVE=1 npm run eval:critic:hard -- --live`. It costs about $0.01.

## Architecture

```mermaid
flowchart LR
    DS[("EINSTEIN dataset<br/>1,047 researchers · 153 companies<br/>10,779 papers · 1,823 projects · 111 patents")]
    SL["Shortlist<br/>BM25 over papers, projects, patents<br/>open_to filter first<br/><i>no model</i>"]
    CO["Coordinator<br/>splits work<br/><i>no model</i>"]
    S1["Screener 1"]
    S2["Screener 2"]
    S3["Screener 3"]
    MM["Matchmaker<br/>picks strong, non-overlapping pairs<br/>as scores arrive<br/><i>no model</i>"]
    P["Profiler x2<br/>cited researcher profile<br/><i>gpt-5.4-mini + tool</i>"]
    A["Analyst x2<br/>structured company need<br/><i>gpt-5.4-mini + tool</i>"]
    W["Writer x2<br/>proposal + claims with record ids<br/><i>gpt-5.4-mini</i>"]
    CR{"Critic<br/>intercepts each draft<br/>id checks + Decisions predicates"}
    OUT["Proposals<br/>every claim sourced"]
    AU["Auditor<br/>trace + spend meter"]

    DS --> SL --> CO
    CO --> S1 & S2 & S3
    S1 & S2 & S3 -- "pair.screened (Decisions API, gpt-6-luna)" --> MM
    MM -- "profile.requested" --> P & A
    P & A -- "profile.ready" --> MM
    MM -- "proposal.requested" --> W
    W -- "draft" --> CR
    CR -- "blocked claims + reasons<br/>(max 2 revisions)" --> W
    CR -- "approved" --> OUT
    AU -.-|observes every event| CO
```

**Agent roles**

| Participant | Count | Model | Job |
| --- | --- | --- | --- |
| Coordinator | 1 | none | Splits the shortlist into batches and hands them to Screeners |
| Screener | 3 | OpenAI Decisions API (`gpt-6-luna`) | Scores each researcher and challenge pair for fit, 0 to 3, with a confidence |
| Matchmaker | 1 | none | Picks a strong pair the moment its score lands, keeps researchers and companies from repeating, and assigns Profiler, Analyst and Writer work |
| Profiler | 2 | `gpt-5.4-mini` + tool | Builds a researcher profile in which every expertise item cites the researcher's own records |
| Analyst | 2 | `gpt-5.4-mini` + tool | Turns the company record, challenge and web pages into a structured, cited need |
| Writer | 2 | `gpt-5.4-mini` | Writes the proposal and lists every factual claim with the dataset ID that states it |
| Critic | 1 | ID checks + Decisions API | Intercepts the Writer's answer before it is committed. It approves the draft, or sends it back with each blocked claim and the reason |
| Auditor | 1 | none | Writes every runtime event to `trace.jsonl` and meters spend per model |

**How they coordinate on Mozaik** ([`src/agents.ts`](src/agents.ts), [`src/jobs.ts`](src/jobs.ts), [`src/runtime.ts`](src/runtime.ts)):

- **Shared state, no direct calls.** All participants live on one runtime with a shared `MatchState`. They react to semantic events (`screen.batch`, `pair.screened`, `pair.selected`, `profile.requested`, `profile.ready`, `proposal.requested`, `critic.verdict`). Nobody calls anybody, and nothing waits for a whole stage to finish.
- **Early selection.** The Matchmaker doesn't wait for all 180 scores. In every live run it picked its first pair before screening ended (0.5 to 1.9 s in, with screening ending at 2.0 to 4.3 s), so profiling overlapped the rest of screening.
- **The Critic is an interception, not a later stage.** Each Writer job runs its loop with an `InterceptionHandler` on the model's final message. If a claim fails, the handler injects a correction listing the exact claims and reasons, and the same loop continues. True facts get re-cited to the right record, and anything no record states is removed. After 2 revisions an unfixable draft is rejected rather than shipped.
- **One job, one fresh `ModelContext`.** Two live loops sharing one memory cross-contaminated in testing. Each job also gets a watchdog, because `runLoop` swallows failures ([mozaik#114](https://github.com/jigjoy-ai/mozaik/issues/114)), and a budget halt that ends the loop cleanly instead of redirecting to `idle` ([mozaik#113](https://github.com/jigjoy-ai/mozaik/issues/113)).

### Why the Decisions API, in results and cost

Two jobs in this system are judgements, not writing: "how well does this researcher fit this challenge, 0 to 3?" and "does this record support this claim, yes or no?". We send both to the OpenAI Decisions API (`gpt-6-luna`) and keep `gpt-5.4-mini` for the jobs that must write text (profiles, company needs, proposals).

**Cost.** Across the 8 live runs in `docs/evidence`, metered from API-reported token usage:

| | Decisions API | gpt-5.4-mini |
| --- | --- | --- |
| Requests | 106 | 121 |
| Input tokens read | 612,622 | about 159,000 |
| Cost | **$0.061 (12% of spend)** | $0.434 (88% of spend) |

- The Decisions API did most of the reading (every pair to screen, every claim with its evidence) for an eighth of the bill. Its input costs $0.10 per million tokens and its output is free.
- The same 612,622 input tokens sent to `gpt-5.4-mini` would cost $0.46 for the input alone, 7.5 times more, before paying for any output. That is price arithmetic, not a run we did: we never built a chat-model screener to compare quality.
- The full hard Critic evaluation, 125 claims with their evidence, cost $0.007.

**Speed.** Three Screeners score all 180 shortlisted pairs in 2.0 to 4.3 s in the live runs. The Critic checked all 125 evaluation claims in 1.4 s. Fast screening is what lets the Matchmaker pick pairs early and start profiling while screening is still running.

**Results.** The answer comes back typed: a score on a fixed scale, or a probability that a claim is supported. Nothing has to be parsed out of free text, and no answer can drift into a paragraph. That gave us:

- **A threshold we can set and test.** The Critic blocks a claim when its support probability is below 0.5. That is what made the planted-error evaluation possible: 52 of 53 errors caught, 0 of 72 true claims wrongly blocked, and the one miss is visible as a number (0.55).
- **Scores the UI can show honestly.** A fit of 1.8 of 3 is shown as moderate, as in the winery search, instead of a model's confident prose.
- **Cheap red-teaming.** Because checks cost fractions of a cent, we could rerun the whole evaluation after each fix.

The limit: a decision model only judges, so the Critic explains a block with the claim, the cited record and the score, not a written argument. The Writer gets exactly that list when a draft is sent back.

## Evidence

All of it is committed under [`docs/evidence/`](docs/evidence) and can be replayed in the UI.

| Run | Critic | Peak jobs at once | Jobs overlapping | Drafts sent back | Claims blocked | Unsupported shipped | Time | Cost |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [run-01-live](docs/evidence/run-01-live) | on | 9 | 21/21 | 5 of 8 | 17 | 0 | 32.6 s | $0.076 |
| [run-02-live](docs/evidence/run-02-live) | on | 9 | 21/21 | 4 of 7 | 10 | 0 | 36.6 s | $0.092 |
| [run-03-live](docs/evidence/run-03-live) | on | 9 | 21/21 | 0 of 3 | 0 | 0 | 19.1 s | $0.054 |
| [run-04-live-nocritic](docs/evidence/run-04-live-nocritic) | off | 9 | 21/21 | (would have: 1) | (flagged: 2) | 2 | 20.1 s | $0.056 |
| [run-05-live](docs/evidence/run-05-live) | on | 9 | 21/21 | 0 of 3 | 0 | 0 | 23.6 s | $0.062 |
| [search-01-packaging](docs/evidence/search-01-packaging) | on | 6 | 10/10 | 2 of 5 | 2 | 0 | 30.6 s | $0.063 |
| [search-02-winery](docs/evidence/search-02-winery) | on | 4 | 10/10 | 0 of 3 | 0 | 0 | 21.6 s | $0.034 |
| [search-03-serbian-input](docs/evidence/search-03-serbian-input) | on | 4 | 10/10 | 2 of 5 | 2 | 0 | 30.6 s | $0.060 |

What changed between runs, and why we kept every one:

- **Run 1:** most blocks were true facts cited to the wrong record, such as a company's staff count cited to its challenge text. The Writer re-cited them.
- **Run 2:** exposed a bug of ours. Evidence records were cut at 900 characters before the Critic read them, so some true facts looked unsupported. Fixed.
- **Run 3:** with complete evidence and clearer citation rules, all three proposals passed on the first draft. The Critic still checked all 35 claims.
- **Run 4 (Critic off):** both flagged claims turned out to be false alarms by the checker (claims that cite both sides of the pair, such as "supervised by X and Y"). Fixed afterwards.

- **Run 5 (final, all fixes):** all three proposals passed on the first draft, with 51 claims checked. The Matchmaker happened to pick the same three pairs as run 4, so runs 4 and 5 compare the same pairs with the Critic off and on. The fit scores (2.0 to 2.3) are lower than run 3's (2.9 to 3.0): the Matchmaker takes the first pair over its 2.0 threshold instead of waiting for all 180 scores. That is the price of early selection. The FinPuls proposal came out in Serbian because FinPuls wrote its challenge in Serbian. Proposals are now written in English by default; pass `--lang=sr` for Serbian (Latin script).

The natural runs are too small to measure the Critic, which is why we tested it directly.

### The Critic, measured

[`src/eval-critic-hard.ts`](src/eval-critic-hard.ts) takes the 9 pairs from the live runs. For each pair it plants 6 kinds of subtle error into claims and writes 8 kinds of true claim straight from the dataset, so the Critic has never seen or approved them. Then it asks the Critic about all of them, concurrently.

| | Before fix ([v1](docs/evidence/critic-eval-hard-v1/results.md)) | After fix ([v2](docs/evidence/critic-eval-hard/results.md)) |
| --- | --- | --- |
| Planted errors caught | 52 / 53 | **52 / 53** |
| True claims wrongly blocked | 12 / 72 | **0 / 72** |

| Planted error | Caught |
| --- | --- |
| Staff count off by one | 9 / 9 |
| Wrong academic title | 9 / 9 |
| Wrong city | 9 / 9 |
| Wrong sector | 9 / 9 |
| A real paper by someone else in the same field | 8 / 8 |
| A colleague's neighbouring field | 8 / 9 |

- **The bug v1 found:** all 12 false blocks were true claims about who wrote a paper. Paper records reached the Critic without their author list. We now pass authors, project participants and patent inventors with every record.
- **The one miss:** "Martina Lačoková has published on discrete mathematics" scored 0.55 against a 0.50 bar. Her cited papers are on verification and covering arrays, which is close to combinatorics. It is a borderline case and a genuine miss.
- **An earlier, easier set** (invented IDs, invented company facts, large number changes) scored 18/18 ([results](docs/evidence/critic-eval/results.md)). We replaced it because its errors were too easy and its true claims came from drafts the Critic had already approved.

### The Critic in a real run

From [`run-01-live/trace.jsonl`](docs/evidence/run-01-live/trace.jsonl), proposal for Veljko Pantelić (R0995) with AutomVoj (C003, challenge C003-CH2):

1. **16.1 s, draft 1: sent back, 6 claims blocked.** For example, "Veljko Pantelić is an Assistant Professor in Computing and Control Engineering" was cited to a paper (`SYN-PUB-10372`) that does not state his title (support 0). An expertise claim cited to five papers scored 0.29.
2. **Draft 2: sent back again** with the remaining failures.
3. **Draft 3: approved.** The broad expertise claim was split into five narrower ones, each citing the papers and project that state it (support 0.82 to 0.95). The Writer dropped the title claim instead of re-citing it to his researcher record. That was a true fact lost, and it is why the correction message now says: if a fact is true, cite the record that states it; delete it only if no record does.

Search the trace for `critic.verdict` to see every decision, or replay run 1 in the UI and watch the Critic lane.

### Proposals

From run 3 ([full text](docs/evidence/run-03-live/proposals.md)):

1. **Condition window and pre-conditioning strategy for reliable sunflower-husk pelletising at Suncokret Eko d.o.o.** Veljko Savić (R0135, Production Engineering) with Suncokret Eko (C007). The press breaks down about once a month at roughly 15,000 EUR per incident because husk moisture ranges from 8% to 22%.
2. **Matrix-robust field calibration for portable turbidity and nitrate testing in hard Banat groundwater.** Goran Radulović (R0679, Applied and Engineering Chemistry) with Kristal Voda (C015). The kits were specified for up to about 300 mg/L CaCO3, but wells reach 550 mg/L and turbidity reads 20 to 30% high.
3. **Site-specific unsupervised anomaly detection for Modbus and BACnet traffic on embedded OT appliances.** Krisztina Kiss (R1008, Computing and Control Engineering) with ArmaturaSec (C001).

Each proposal ends with its claims, the record IDs each one cites, and the Critic's support score.

## Reverse Search

A company describes its problem in plain words. The text becomes a citable record (`Q001`, `Q001-CH1`), so every claim about the company still traces back to what the company actually wrote. The same team then runs on that one challenge: a 15-pair shortlist, three Screeners, profiles, writing and the Critic. The result is up to three researchers with a fit score, a reason and a full proposal each.

The three example problems in [`examples/`](examples) are test inputs written for this demo, not real companies. The bakery search ([`examples/pekara-sr.json`](examples/pekara-sr.json)) is written in Serbian. All three proposals came back in English, the default, with the problem's figures carried over (18,000 loaves a day, 4 to 6 percent scrap). The input's company label starts with "Primer", Serbian for "example", and the Writer read that as the company's name. The winery search is a useful honest case: the dataset has no strong wine-fermentation researcher, so the best fits are only moderate (about 1.8 of 3), and the UI labels them that way instead of overselling.

## EINSTEIN network and EINSTEIN Stars

EINSTEIN is a Horizon Europe Excellence Initiative (grant 101136377, 2024 to 2028) of nine institutions in Serbia, Austria, the Netherlands and Denmark, coordinated by the University of Novi Sad. NTP Novi Sad hosts its consortium meetings and the EINSTEIN Stars final. Its aim is to turn UNS into a hub for regional development and to connect research with business. EINSTEIN Stars is its competitive programme for UNS PhD students and young researchers whose work has strong industrial potential. The 2025 call received 8 applications.

**What exists today (built and tested here):**

- **A front door for NTP companies.** Reverse Search is a form an NTP company can fill in during or after an EINSTEIN event. Within about 30 seconds it returns researchers who fit, each with a proposal the company can read. The batch mode can scan every open challenge from NTP members at once.
- **Consent as a hard filter.** Researchers are only proposed for collaboration forms they have said yes to (`open_to`). In the network this becomes a profile setting each researcher controls.
- **Proposals reviewers can verify.** Every claim cites a record, so an NTP innovation officer or a UNS tech-transfer officer can check a proposal in minutes before anyone is contacted.

**How it would plug in (proposed, not built):**

1. **Real data, same agents.** Swap the synthetic dataset for a UNS researcher registry, enriched from ORCID, OpenAlex, CORDIS and Lens (the APIs listed in the dataset's `docs/apis.md`). The agents read every record through `src/data/dataset.ts`, so that loader is where the change happens.
2. **A person approves before outreach.** An NTP or EINSTEIN coordinator approves each pair before the Writer runs or before anyone is emailed. The Critic's record makes that review quick.
3. **Partner universities as co-supervisors.** The same search over OpenAlex profiles at the consortium's partner universities (DTU, WUR, JKU) could suggest an international co-supervisor for each industrial PhD. That fits EINSTEIN's internationalisation goal.
4. **EINSTEIN Stars: an industrial partner for every pitch, and a wider funnel.**
   - **Each Stars applicant pitches with a company.** We run the matcher from their research outward, so they arrive at the pitch with a named NTP company, that company's own problem statement, and a cited first-step plan. A jury of industry and investors can judge that.
   - **More eligible researchers hear about the call.** We run it from company challenges inward: when a company problem matches an eligible PhD student's or recent PhD's work, the system can draft an invitation to apply.
   - **The jury still decides.** The system never scores or ranks applicants. It only proposes pairs and explains the fit.

## Responsible use of data

- **People are never ranked.** Only researcher and challenge pairs get a fit score, and the UI says so.
- **`open_to` is applied before any model sees a profile.** 46 researchers are excluded this way.
- **Every claim about a person or company must cite a dataset ID.** The Critic checks it against that record, and the record is one click away in the UI.
- **Only the official synthetic dataset is used.** No real personal data is processed.
- **Cost is capped.** Live runs need `--live` plus `ALLOW_LIVE=1`, are capped by `BUDGET_USD`, and live web search has per-search and total caps. Replays never call a model.
- **No secrets are stored in the repo.** The key lives in `.env`, which is git-ignored.

## Limitations

- On borderline topics the Critic can let a neighbouring-field claim through (1 of 53 planted errors).
- Natural Critic-on versus Critic-off runs are too small to show a difference, so the planted-error evaluation is the real measurement.
- Fit scores come from a model and are a starting point for a human conversation, not a decision.
- Reverse Search shortlists by keywords first. A problem described in very different words from the researchers' papers can miss people, and the Decisions screening only reorders what the shortlist found.

## Built with

- [`@mozaik-ai/core`](https://www.npmjs.com/package/@mozaik-ai/core) 4.2.0
- OpenAI `gpt-5.4-mini` and the Decisions API (`gpt-6-luna`)
- TypeScript on Node.js
- Web UI: React 19, Tailwind CSS 4 and shadcn/ui, served by a small Node server with no framework

While building this we reported a documentation mismatch in Mozaik ([mozaik#130](https://github.com/jigjoy-ai/mozaik/issues/130), the `context_update` event renamed to `message_received`), fixed it in the docs ([mozaik-docs#2](https://github.com/jigjoy-ai/mozaik-docs/pull/2), merged), and proposed first-class support for decision models ([mozaik#131](https://github.com/jigjoy-ai/mozaik/issues/131)).

AI coding assistants were used while building this project.

## License

[MIT](LICENSE). The dataset belongs to its authors at [jigjoy-ai/einstein-matchmaker-data](https://github.com/jigjoy-ai/einstein-matchmaker-data).
