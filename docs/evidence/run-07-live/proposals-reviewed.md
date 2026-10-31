# Proposals (human-reviewed copy of Run 7)

> **Synthetic-data disclaimer:** These are illustrative draft matches from a synthetic dataset. No named researcher or company has approved a proposal or committed data, funding, staff time, equipment, or access. Citations show what the synthetic records say; they are not evidence of a real partnership.

> **Review status:** The live-generated text remains unchanged in `proposals.md`, and the trace / Critic verdicts describe that original run. This separate copy contains offline human edits to make the plans more feasible and transparent. These edits were not sent back through the model Critic.

## Industrial PhD on plain-language explanations for automated SME credit decisions at Kredo Fintech

**Pair:** Branislav Žarković (R0801, Department of Finance and Banking) with Kredo Fintech (C010), challenge C010-CH2
**Form:** Industrial PhD, from the researcher's consent: "industrial PhD supervision"
**Critic:** approved after 2 draft(s). Screening score 2.86 / 3.

### The problem
Kredo Fintech needs a compliant explanation format for every automated credit decision that can be generated at decision time, stored with the decision record, and shown in the borrower portal in Serbian and Macedonian. The current gradient-boosted model performs well, but its SHAP-based summaries are too technical for borrowers and not yet satisfactory to compliance. The practical problem is to turn model outputs into clear, challengeable, production-ready explanations while staying aligned with the National Bank of Serbia’s expectations.

### Research questions
1. Which explanation template best balances plain-language understandability, regulatory completeness, and decision fidelity for Kredo Fintech’s automated SME credit decisions?
2. How well do different explanation methods translate model drivers into borrower-facing Serbian and Macedonian text that users can understand and challenge?
3. What automated evaluation and monitoring criteria can reliably detect when explanation quality or regulatory compliance drifts in production?

### Plan
| Period | Work | Result | Pass if |
| --- | --- | --- | --- |
| Year 1 | Within the first six months, map the workflow and decision records, agree compliance criteria, and build an offline bilingual prototype. Evaluate on at least 100 historical decisions only if Kredo authorizes access; otherwise use clearly labelled synthetic cases for technical testing and do not claim production validation. | A month-six prototype, compliance checklist, approved-data plan, and explicit go/no-go decision for a pilot. | By month six, the prototype and evaluation protocol are documented, and an authorized-data evaluation is completed if access is approved. Without approved data access and compliance sign-off, the production-readiness gate is not passed. |
| Year 2 | If the month-six gate passes and Kredo grants the required access, refine the generator and evaluate Serbian and Macedonian explanations with authorized internal reviewers; keep borrower-facing testing subject to consent and compliance approval. | A pilot-ready explanation module and documented evaluation results, not an assumed production deployment. | The pre-agreed compliance checklist is accepted by Kredo reviewers, and any user testing is conducted only with approved participants and consent. |
| Year 3 | Production integration is conditional on partner approval, lawful data access, and a passed compliance / security review. If those gates are not met, keep the deliverable at an offline or controlled pilot and document the blockers rather than claiming production readiness. | A production deployment only if all partner, compliance, data, and security gates pass; otherwise a validated controlled pilot and a clear evidence-based decision record. | Any live use requires documented authorization and sign-off from the appropriate Kredo reviewers; otherwise no production rollout is counted as a project outcome. |

### What each side brings
- **Company:** Kredo Fintech brings its automated SME lending workflow, its current gradient-boosted scoring model, its SHAP-based internal summaries, transaction data, tax filings, sector benchmarks, borrower portal, and engineering stack (Python, dbt, Snowflake, Apache Airflow, scikit-learn, PostgreSQL, REST APIs for Open Banking data ingestion, Docker). The company also brings operational constraints from production use, a data team of five, and the requirement to support Serbian and Macedonian explanations.
- **Faculty:** Branislav Žarković brings expertise in credit scoring for thin-file and micro-enterprise borrowers, alternative and open-banking data, explainable AI in credit risk, and regulatory implications of machine-learning credit models, supported by his published work on scoring micro-enterprises with little credit history, explainable credit decisions, alternative data, open banking, and AI explainability in credit scoring.

### Why this pair
This pair fits because Kredo Fintech needs a production explanation solution for automated SME lending, and Branislav Žarković has directly relevant research and industry experience in credit risk, SME finance, explainable models, and regulatory expectations. His background as former head of risk and his research on explainability and alternative data make the collaboration well matched to a problem that is both technical and compliance-driven.

### What is new
The closest prior work is SYN-PUB-08747, ‘Explaining credit decisions to supervisors: a case study,’ together with SYN-PUB-08751 on AI Act explainability requirements and SYN-PUB-08754 on interpretability metrics. This industrial PhD goes beyond those works by designing and validating borrower-facing, automatically generated, bilingual explanation text for live production use in a regulated fintech workflow, rather than only supervisor-facing explanation or metric benchmarking.

### Data: what exists and what to collect
The synthetic Kredo record describes a current scoring workflow, SHAP-based summaries, decision records, a borrower portal, more than 1,400 funded loans, and a five-person data team. This does not establish that a real company has granted access or staff time. The project still needs written authorization for any decision records, a labelled evaluation set, bilingual wording variants, and approved review procedures. Borrower feedback is not assumed; any collection would require separate approval and consent.

### First step
First agree the six-month deliverable, compliance criteria, and data-access permissions. Build an offline bilingual prototype on synthetic or otherwise approved test cases. Do not use historical borrower decisions until written authorization and the required privacy / compliance review are in place.

### Still to agree
The parties would still need to agree funding, candidate and staff time, Macedonian-language support, background and new IP, publication review, and secure data access. They must also confirm whether the six-month target is a prototype or a production pilot; production cannot be treated as a six-month commitment without authorized data, compliance approval, and an agreed deployment gate.

### Claims and sources
- supported (p=1): Branislav Žarković is a Full Professor at the Faculty of Economics in Subotica, University of Novi Sad, in the Department of Finance and Banking. [R0801]
- supported (p=1): Branislav Žarković’s fields are credit risk and SME finance, and his keywords include credit scoring, thin-file borrowers, explainable models, alternative data, and regulation. [R0801]
- supported (p=1): Branislav Žarković is open to industrial PhD supervision and joint research projects with industry partners. [R0801]
- supported (p=1): Branislav Žarković has industry experience as a former head of risk at a regional bank from 2005 to 2012. [R0801]
- supported (p=1): Branislav Žarković’s expertise includes credit scoring for thin-file and micro-enterprise borrowers, SME finance and credit access barriers, alternative data and open banking, explainable AI and interpretability, and regulatory and capital implications of machine-learning credit models. [SYN-PUB-08746, SYN-PUB-08747, SYN-PUB-08748, SYN-PUB-08749, SYN-PUB-08750, SYN-PUB-08751, SYN-PUB-08752, SYN-PUB-08753, SYN-PUB-08754]
- supported (p=1): Kredo Fintech is a fintech company with 26 employees, founded in 2020, based in NTP Novi Sad. [C010]
- supported (p=1): Kredo Fintech serves micro and small businesses with online loans from 500 to 50,000 EUR, and it also offers a revolving credit facility for businesses with at least six months of transaction history. [C010]
- supported (p=1): Kredo Fintech has funded over 1,400 loans and says its default rate is below the Serbian banking sector average for SME portfolios. [C010]
- supported (p=1): Kredo Fintech’s team of 26 works out of the Science and Technology Park in Novi Sad, and its data team has five people. [C010]
- supported (p=1): Kredo Fintech is regulated by the National Bank of Serbia. [C010]
- supported (p=1): Kredo Fintech uses transaction data, tax filings, sector benchmarks, Python, dbt, Snowflake, Apache Airflow, scikit-learn, PostgreSQL, REST APIs for Open Banking data ingestion, and Docker. [C010]
- supported (p=1): Kredo Fintech’s challenge is that every automated credit decision must be accompanied by a plain-language explanation that a borrower can understand and challenge, and the explanation must be generated at decision time, stored with the decision record, and rendered in Serbian and Macedonian. [C010-CH2]
- supported (p=1): Kredo Fintech’s main scoring model is a gradient-boosted ensemble, and it has experimented with SHAP values and internal summaries that are too technical for borrowers and not satisfactory to the compliance officer. [C010-CH2]
- supported (p=1): Kredo Fintech wants a compliant explanation format in place before it expands to North Macedonia, and it expects the work to be production-ready within about six months. [C010-CH2]
- supported (p=1): The closest prior works for novelty are SYN-PUB-08747 on explaining credit decisions to supervisors, SYN-PUB-08751 on explainability requirements under the EU AI Act, and SYN-PUB-08754 on benchmarking scorecard interpretability metrics. [SYN-PUB-08747, SYN-PUB-08751, SYN-PUB-08754]
- supported (p=0.65): The proposal uses the company’s stated production stack, data team of five, and the target of about six months for delivery. [C010, C010-CH2]

## Industrial PhD on reusable and safety-aware PLC software families for AutomVoj’s 38 TIA Portal ladder-logic codebases

**Pair:** Veljko Pantelić (R0995, Department of Computing and Control Engineering) with AutomVoj a.d. (C003), challenge C003-CH2
**Form:** Industrial PhD, from the researcher's consent: "industrial PhD supervision"
**Critic:** approved after 1 draft(s). Screening score 2.99 / 3.

### The problem
AutomVoj a.d. currently maintains 38 active PLC codebases for customer-specific conveyor and sorting installations, all written in ladder logic in TIA Portal. When a safety-related patch is needed, the company must touch all 38 codebases; the last such update took three engineers two full weeks, and two sites still needed special handling because their logic had drifted. The practical problem is to introduce a maintainable reuse approach that can support safety patches and future variants without rewriting everything at once.

### Research questions
1. How can AutomVoj’s existing ladder-logic installations be abstracted into a reusable product-line structure without interrupting ongoing commissioning work?
2. Can a model-driven transformation chain generate or update PLC code so that a safety patch can be propagated to all 38 codebases with fewer manual edits and fewer inconsistencies?
3. What modularisation and variability rules are sufficient to keep the generated or refactored PLC programs maintainable for future customer-specific changes?

### Plan
| Period | Work | Result | Pass if |
| --- | --- | --- | --- |
| Year 1 | First reconcile the hardware gap: the synthetic faculty record describes Wago / Beckhoff lab controllers, while the company record describes Siemens S7-1500 / S7-300 equipment. Select representative codebases and establish a Siemens-compatible offline test environment before designing transformations. | A family model, documented portability limits, and a Siemens-targeted offline test plan. | Classify at least 20 codebases only if authorized access is granted; verify candidate patterns in an offline Siemens-compatible environment. A lab result on different hardware alone does not count as deployment validation. |
| Year 2 | Build an offline transformation prototype and test representative changes only in the Siemens-compatible sandbox or an approved simulator. Treat any live PLC modification as out of scope until a documented safety case, independent validation, rollback plan, and written site authorization exist. | A controlled reuse prototype with test evidence and explicit safety boundaries. | Generated programs compile and pass agreed offline checks; no patch reaches an operating PLC without the required safety review, rollback plan, and written approval. |
| Year 3 | Harden the approach into a maintainable process, document refactoring and update rules, and evaluate maintenance effort, consistency, and engineer acceptance on additional codebases. | A validated method for maintaining PLC software families in ongoing industrial use. | AutomVoj can apply the workflow to at least 15 codebases in a follow-up update cycle, and engineers judge the approach usable for routine maintenance rather than a one-off research tool. |

### What each side brings
- **Company:** AutomVoj a.d. brings the industrial problem, access to its 38 active ladder-logic PLC codebases, its TIA Portal-based development environment, and the practical constraints of conveyor and sorting automation in food and beverage production. The company can also contribute review time from its senior PLC programmer and two senior automation engineers, within the limits of their project workload, plus validation on real systems at its Zrenjanin site.
- **Faculty:** R0995 brings expertise in IEC 61131-3 Structured Text tooling, model-driven engineering, software product lines, variability modelling, and PLC code generation, supported by prior work on metamodels, model transformations, incremental generation, and benchmarked PLC code generation. The Faculty of Technical Sciences also brings supervision, research methods, and access to the researcher’s existing PLC laboratory and modelling toolchain.

### Why this pair
This pair fits because AutomVoj’s exact pain point is fragmented PLC software that needs controlled reuse and safety patch propagation, while R0995’s research track is centered on IEC 61131-3, model transformations, product-line variability, and code generation for PLC software. The company offers a realistic industrial setting with many similar but diverging codebases, and the researcher offers a direct methodological match for making that variability explicit and maintainable.

### What is new
The closest prior work is SYN-PRJ-0390, Product-Line Code Generation Infrastructure for Configurable PLC Software, together with SYN-PUB-02958 on incremental model-to-text generation and SYN-PUB-10379 on extracting feature models from legacy PLC codebases. The new contribution beyond that work is to move from a general infrastructure and legacy-code extraction setting to a concrete industrial migration case with 38 live TIA Portal ladder-logic codebases, where the research must support safety-related patch propagation under daily commissioning constraints rather than only model-driven generation in the abstract. The proposal also extends SYN-PUB-10377 and SYN-PRJ-0391 by focusing on maintenance of an industrial PLC family in operation, not only on safety-aware modelling.

### Data: what exists and what to collect
The synthetic company record describes 38 active ladder-logic codebases in TIA Portal and Siemens S7-1500 / S7-300 equipment. The synthetic faculty record describes a PLC lab with Wago and Beckhoff controllers, so the current lab setup is not direct validation of the company target. Any company code access, site validation, or engineer review requires fresh written authorization. The family model, reusable library, and transformed code would need to be created; no cleaned set is established by the records.

### First step
First confirm that AutomVoj will authorize access to representative codebases and review time. Then select 5 to 8 cases, document the Siemens-versus-Wago/Beckhoff hardware gap, and agree on an offline test environment, safety boundary, rollback requirement, and what may be shared.

### Still to agree
The parties still need to agree on funding, candidate and engineer time, written authorization for code / site access, hardware and simulator availability, safety ownership, rollback and validation requirements, background and new IP, and publication review. The synthetic record does not establish any real commitment to provide these resources.

### Claims and sources
- supported (p=1): Veljko Pantelić is an Assistant Professor in the Faculty of Technical Sciences, Department of Computing and Control Engineering. [R0995]
- supported (p=1): R0995’s research covers Software Engineering, Industrial Automation, Model-Driven Engineering, and Programming Languages and Compilers, with keywords including IEC 61131-3, model-driven engineering, software product lines, domain-specific languages, code generation, PLC programming, metamodeling, feature models, model transformation, and Structured Text. [R0995]
- supported (p=1): R0995’s group uses Eclipse Modeling Framework, Xtext, Sirius, and a small PLC laboratory equipped with several Wago and Beckhoff controllers for validation experiments. [R0995]
- supported (p=1): R0995 has published work on IEC 61131-3 Structured Text tooling, model transformations, software product lines, incremental generation, legacy-code extraction, and PLC code generation benchmarking. [SYN-PUB-10372, SYN-PUB-10373, SYN-PUB-10374, SYN-PUB-10375, SYN-PUB-10376, SYN-PUB-10377, SYN-PUB-02958, SYN-PUB-10379, SYN-PUB-10380, SYN-PRJ-0390, SYN-PRJ-0391]
- supported (p=1): AutomVoj a.d. is a robotics and industrial automation company founded in 1983, based in Zrenjanin, with 212 employees. [C003]
- supported (p=1): AutomVoj a.d. designs, manufactures, and commissions PLC-based conveyor lines and automated sorting equipment for food and beverage producers. [C003]
- supported (p=1): AutomVoj a.d. works with Siemens S7-1500 and S7-300 PLC platforms and programs in Ladder logic and Structured Text in TIA Portal. [C003]
- supported (p=1): AutomVoj a.d. has 38 active PLC codebases in its installed base, all written in ladder logic in TIA Portal. [C003-CH2]
- supported (p=1): AutomVoj a.d. says that a safety-related patch across its codebases previously took three engineers two full weeks. [C003-CH2]
- supported (p=1): AutomVoj a.d. says that two sites still required special handling because their logic had drifted. [C003-CH2]
- supported (p=1): AutomVoj a.d. says it has no dedicated R&D department and that technical development happens informally through project work led by its chief engineer and two senior automation engineers. [C003]
- supported (p=0.93): AutomVoj a.d. can support validation on its Zrenjanin site and can contribute review time from one senior PLC programmer and two senior automation engineers within their project workload. [C003, C003-CH2]
- supported (p=0.96): The closest research background for the proposed novelty includes SYN-PRJ-0390, SYN-PUB-02958, SYN-PUB-10379, SYN-PUB-10377, and SYN-PRJ-0391. [SYN-PRJ-0390, SYN-PUB-02958, SYN-PUB-10379, SYN-PUB-10377, SYN-PRJ-0391]

## Industrial PhD on contract-guided test generation for multi-supplier CAN integration faults

**Pair:** Martina Lačoková (R0919, Department of Computing and Control Engineering) with DriveLogic Vojvodina d.o.o. (C018), challenge C018-CH2
**Form:** Industrial PhD, from the researcher's consent: "industrial PhD supervision for candidates from embedded systems companies"
**Critic:** approved after 1 draft(s). Screening score 3.00 / 3.

### The problem
DriveLogic Vojvodina d.o.o. reports that its LDRA coverage reports typically reach 87–89% branch coverage, yet integration bugs still appear after delivery in the CAN communication stack, especially at boundaries between components from different suppliers. The company needs a systematic method, or tooling, that can read ARXML descriptions, COM configuration, and CANoe setups and generate test scenarios that target interface assumptions between components from different sources rather than only exercising what engineers already expect from the specification.

### Research questions
1. Can interface contracts be derived from the available ARXML and COM artefacts in a form that is precise enough to generate fault-targeted CAN integration tests?
2. Can constrained covering-array based test generation increase the detection rate of cross-supplier interface faults compared with the company's current specification-driven integration tests, while staying within the existing CANoe and LDRA workflow?
3. Which contract-violation patterns and interaction parameters should be prioritised so that the resulting test suite is effective without exceeding the company's practical integration-testing budget and schedule?

### Plan
| Period | Work | Result | Pass if |
| --- | --- | --- | --- |
| Year 1 | Analyse representative AUTOSAR/CAN integration artefacts from ongoing projects, formalise interface assumptions as testable contracts, and prototype a generator that produces CANoe test scenarios from ARXML and COM configuration. Validate the prototype on a small historical fault set and on one active integration baseline. | A first working prototype that maps interface descriptions to executable interaction-focused test cases, plus an initial catalogue of boundary-fault patterns. | The prototype generates at least 20 executable CANoe scenarios from one project artefact set, and at least 5 scenarios are judged by DriveLogic engineers to target realistic boundary assumptions rather than generic functionality. |
| Year 2 | Refine the generator with constraint handling for AUTOSAR parameter spaces, rank candidate scenarios by likely fault relevance, and compare the generated suite against the company's current manually written integration tests on one or two active projects. | A validated generation approach with measurable comparison data against the current practice. | On the evaluation project(s), the generated suite finds at least one previously missed interaction defect or achieves strictly better defect-trigger coverage than the baseline manual suite at equal or lower test-count growth. |
| Year 3 | Stabilise the toolchain, document how it fits into DriveLogic's existing CANoe and LDRA workflow, and assess maintenance effort for evolving interface contracts across supplier changes and regression cycles. | A thesis-level method and a company-usable workflow for repeatable contract-guided integration testing. | DriveLogic can apply the workflow to a new contract change with less than 20% additional test authoring effort compared with the current manual approach, while preserving execution inside the existing CANoe-based process. |

### What each side brings
- **Company:** DriveLogic Vojvodina d.o.o. can provide access to ARXML descriptions, COM configuration, and CANoe environments from active AUTOSAR Classic integration projects, plus one senior engineer part-time, roughly 40% of their working week, for collaborative work tied to tools or methods used in active projects. The company also brings its practical knowledge of AUTOSAR Classic integration, CAN/LIN communication stack validation, V-cycle test planning, and its observed 87–89% branch coverage baseline.
- **Faculty:** Martina Lačoková brings research expertise in combinatorial interaction testing, constrained covering arrays, interface contract specification, runtime assertion monitoring, and compositional verification for CAN-based embedded systems. Her group also brings the CAN/LIN bus laboratory with vector hardware interfaces and a small cluster for constraint-solving workloads, which fits the proposed method development and validation.

### Why this pair
The pair is a strong fit because DriveLogic's problem is exactly about interaction faults at the boundaries between suppliers, while Martina Lačoková's research record focuses on combinatorial interaction testing, interface contracts, and runtime verification for multi-supplier CAN and AUTOSAR systems. The company has the kind of AUTOSAR artefacts and CANoe workflow needed for industrial validation, and the faculty side has the methods and laboratory support needed to turn those artefacts into a repeatable research contribution.

### What is new
The novelty must be tested against the researcher’s existing CAN work, including SYN-PRJ-0434 on contract-based integration testing for multi-supplier CAN networks, plus SYN-PUB-09748, SYN-PUB-03011, and SYN-PUB-09743. A defensible contribution would be a reproducible evaluation of whether a generator driven by permitted ARXML/COM artefacts finds cross-supplier boundary faults that the existing manual suite misses, under an equal test-count or execution budget. Agree and document that comparison before claiming novelty; do not present contract-guided testing itself as new.

### Data: what exists and what to collect
The synthetic DriveLogic record describes access to ARXML / COM / CANoe artefacts, 87–89% branch coverage, and CAN faults in three of the last four delivered projects. It does not grant research permission to use customer material. Before any such use, obtain written authorization and define confidentiality, retention, redaction, and publication rules. If customer faults cannot be shared, start with synthetic or public test cases and report that this does not validate performance on customer defects.

### First step
First confirm the project’s written data permissions and the €40,000 first-phase ceiling. Then choose one approved baseline, define a reproducible manual-test comparison and evaluation oracle, and build 10 to 15 boundary-focused scenarios. If customer artefacts or fault labels are not approved, keep the pilot synthetic and do not claim customer-defect detection.

### Still to agree
The parties still need to agree funding and university costs, confirm whether the roughly 40% engineer allocation is available, define background and new IP, publication review, and obtain written permission for each customer artefact or defect record. The first phase must be scoped to no more than the synthetic record’s €40,000 ceiling; any larger scope needs separate agreement and cannot be assumed.

### Claims and sources
- supported (p=1): Martina Lačoková is a Senior Research Associate in the Department of Computing and Control Engineering at the Faculty of Technical Sciences, University of Novi Sad. [R0919]
- supported (p=1): Her expertise includes combinatorial interaction testing, t-way test generation, interface contract specification, compositional verification, CAN bus, multi-supplier integration, runtime assertion monitoring, covering arrays, constraint solving, and embedded software. [R0919]
- supported (p=1): Her group maintains a CAN/LIN bus laboratory with vector hardware interfaces and a small cluster for constraint-solving workloads. [R0919]
- supported (p=1): Her research record includes work on generating minimum-size covering arrays for constrained parameter spaces, interface contract specification for multi-supplier CAN node integration, runtime assertion monitoring for CAN-based embedded systems, compositional verification of embedded software stacks, incremental test suite maintenance for evolving CAN interface contracts, automated derivation of CAN-CL contracts from AUTOSAR system descriptions, and monitoring overhead profiles for CAN-CL runtime contracts. [SYN-PUB-09743, SYN-PUB-09744, SYN-PUB-02017, SYN-PUB-01450, SYN-PUB-09748, SYN-PUB-03011, SYN-PUB-09750]
- supported (p=1): DriveLogic Vojvodina d.o.o. is an automotive and mobility software company based in Novi Sad with 27 employees, founded in 2004, focused on AUTOSAR-based embedded software. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. works on AUTOSAR Classic BSW configuration and software component integration, V-cycle test planning, execution and coverage reporting, CAN, LIN and Ethernet communication stack integration and validation, ECU flashing, diagnostic tooling and UDS/OBD-II protocol support, AUTOSAR toolchain migration, and legacy codebase porting. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. uses AUTOSAR Classic R4.x, Vector DaVinci Configurator, CAPL scripting, CANoe/CANalyzer, TRACE32, Jenkins-based CI pipelines, LDRA Testbed, gcov, Python scripting, and PC-lint Plus. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. can dedicate one senior engineer part-time, roughly 40% of their working week, to a collaborative development or research activity tied to tools or methods used in active projects. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. has delivered software integration work on more than forty OEM projects and mainly serves Tier-1 and Tier-2 suppliers for European OEM programs. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. reports that its LDRA coverage reports typically show 87% to 89% branch coverage before shipment, yet integration bugs still appear after delivery in the CAN communication stack. [C018-CH2]
- supported (p=1): DriveLogic Vojvodina d.o.o. reports that in the last four delivered projects, three came back with CAN communication faults found during customer integration testing, and each fault was at a boundary between components from different suppliers. [C018-CH2]
- supported (p=1): DriveLogic Vojvodina d.o.o. states that it has full access to the ARXML descriptions of all components in the project, the COM configuration, and the CANoe environment. [C018-CH2]
- supported (p=1): DriveLogic Vojvodina d.o.o. states that the first-phase budget would not exceed €40,000. [C018-CH2]
- supported (p=0.95): Martina Lačoková's closest listed prior works for this proposal are SYN-PUB-09748, SYN-PUB-03011, and SYN-PUB-09743. [SYN-PUB-09748, SYN-PUB-03011, SYN-PUB-09743]
