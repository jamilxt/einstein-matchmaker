# Proposals (live run)

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
| Year 1 | Map the current underwriting workflow, decision record structure, and explanation requirements; compare the existing SHAP-based summary with candidate explanation templates; define a test set of real decisions for controlled evaluation in Serbian. | A documented explanation specification, baseline evaluation protocol, and first bilingual explanation prototypes. | At least 3 explanation templates are implemented and assessed on a test set of at least 100 historical decisions, with a written compliance gap analysis for the current summary. |
| Year 2 | Develop and validate a production-oriented explanation generator that converts model drivers into plain-language Serbian and Macedonian text; test understandability with internal reviewers and borrower-facing scenarios; refine wording rules for different decision reasons. | A validated explanation module that can be integrated into the decision pipeline. | The best candidate explanation reaches at least 80% agreement from internal compliance review on a pass/fail checklist and is rated clearer than the current summary in user testing on at least 70% of test cases. |
| Year 3 | Integrate the explanation module into the live decision workflow, store explanations with decision records, and monitor quality and drift after deployment; document the operational and regulatory lessons for expansion to North Macedonia. | A production-ready bilingual explanation process with monitoring rules and deployment documentation. | The system generates an explanation automatically for 100% of sampled automated decisions in a pilot period, with no critical logging or rendering failures, and a monitoring report is accepted by Kredo Fintech’s compliance function. |

### What each side brings
- **Company:** Kredo Fintech brings its automated SME lending workflow, its current gradient-boosted scoring model, its SHAP-based internal summaries, transaction data, tax filings, sector benchmarks, borrower portal, and engineering stack (Python, dbt, Snowflake, Apache Airflow, scikit-learn, PostgreSQL, REST APIs for Open Banking data ingestion, Docker). The company also brings operational constraints from production use, a data team of five, and the requirement to support Serbian and Macedonian explanations.
- **Faculty:** Branislav Žarković brings expertise in credit scoring for thin-file and micro-enterprise borrowers, alternative and open-banking data, explainable AI in credit risk, and regulatory implications of machine-learning credit models, supported by his published work on scoring micro-enterprises with little credit history, explainable credit decisions, alternative data, open banking, and AI explainability in credit scoring.

### Why this pair
This pair fits because Kredo Fintech needs a production explanation solution for automated SME lending, and Branislav Žarković has directly relevant research and industry experience in credit risk, SME finance, explainable models, and regulatory expectations. His background as former head of risk and his research on explainability and alternative data make the collaboration well matched to a problem that is both technical and compliance-driven.

### What is new
The closest prior work is SYN-PUB-08747, ‘Explaining credit decisions to supervisors: a case study,’ together with SYN-PUB-08751 on AI Act explainability requirements and SYN-PUB-08754 on interpretability metrics. This industrial PhD goes beyond those works by designing and validating borrower-facing, automatically generated, bilingual explanation text for live production use in a regulated fintech workflow, rather than only supervisor-facing explanation or metric benchmarking.

### Data: what exists and what to collect
Kredo Fintech already has the current scoring model, SHAP-based internal summaries, borrower portal infrastructure, decision records, and live lending data from its over 1,400 funded loans. The company also states that its data team of five can support pipeline engineering and model monitoring. What still needs to be collected for the project is a labeled test set of decisions with explanation quality judgments, bilingual wording variants, and any additional review labels needed to compare explanation clarity, compliance, and challengeability. The proposal does not assume access to borrower feedback data unless it is collected during the project.

### First step
Next month, agree the exact explanation requirements with Kredo Fintech’s compliance function, sample a first set of historical decisions from the live model, and build a Serbian prototype that converts SHAP outputs into plain-language explanation drafts for review.

### Still to agree
The parties still need to agree the funding arrangement for the industrial PhD, who pays for the doctoral candidate’s time, how much company staff time Kredo Fintech can commit, whether any external support is needed for Macedonian localization, the scope of background IP on the existing scoring model and explanation templates, ownership of new results and software, publication review and delay terms, and the exact data access and security procedures for using historical and live decision records.

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
| Year 1 | Map the 38 active codebases into a variability model and identify recurring control fragments, safety-relevant differences, and stable library candidates; define the target abstraction for conveyor and sorting logic in TIA Portal terms. | A documented family model and a first reusable library concept covering the most common control patterns. | At least 20 of the 38 codebases are classified against the family model, and at least 5 reusable control patterns are confirmed by AutomVoj engineers as relevant for real installations. |
| Year 2 | Build and iterate a prototype transformation and generation workflow that can derive PLC variants from the family model and apply a representative safety patch across multiple codebases; validate on selected AutomVoj examples. | A working prototype that supports controlled reuse and patch propagation for selected installations. | A safety-related change can be propagated to at least 10 representative codebases with fewer manual edits than the current ad hoc process, and the resulting programs compile and pass AutomVoj review for those cases. |
| Year 3 | Harden the approach into a maintainable process, document refactoring and update rules, and evaluate maintenance effort, consistency, and engineer acceptance on additional codebases. | A validated method for maintaining PLC software families in ongoing industrial use. | AutomVoj can apply the workflow to at least 15 codebases in a follow-up update cycle, and engineers judge the approach usable for routine maintenance rather than a one-off research tool. |

### What each side brings
- **Company:** AutomVoj a.d. brings the industrial problem, access to its 38 active ladder-logic PLC codebases, its TIA Portal-based development environment, and the practical constraints of conveyor and sorting automation in food and beverage production. The company can also contribute review time from its senior PLC programmer and two senior automation engineers, within the limits of their project workload, plus validation on real systems at its Zrenjanin site.
- **Faculty:** R0995 brings expertise in IEC 61131-3 Structured Text tooling, model-driven engineering, software product lines, variability modelling, and PLC code generation, supported by prior work on metamodels, model transformations, incremental generation, and benchmarked PLC code generation. The Faculty of Technical Sciences also brings supervision, research methods, and access to the researcher’s existing PLC laboratory and modelling toolchain.

### Why this pair
This pair fits because AutomVoj’s exact pain point is fragmented PLC software that needs controlled reuse and safety patch propagation, while R0995’s research track is centered on IEC 61131-3, model transformations, product-line variability, and code generation for PLC software. The company offers a realistic industrial setting with many similar but diverging codebases, and the researcher offers a direct methodological match for making that variability explicit and maintainable.

### What is new
The closest prior work is SYN-PRJ-0390, Product-Line Code Generation Infrastructure for Configurable PLC Software, together with SYN-PUB-02958 on incremental model-to-text generation and SYN-PUB-10379 on extracting feature models from legacy PLC codebases. The new contribution beyond that work is to move from a general infrastructure and legacy-code extraction setting to a concrete industrial migration case with 38 live TIA Portal ladder-logic codebases, where the research must support safety-related patch propagation under daily commissioning constraints rather than only model-driven generation in the abstract. The proposal also extends SYN-PUB-10377 and SYN-PRJ-0391 by focusing on maintenance of an industrial PLC family in operation, not only on safety-aware modelling.

### Data: what exists and what to collect
The records state that AutomVoj already has 38 active PLC codebases, all in ladder logic in TIA Portal, and that the company can validate on its Zrenjanin site with its existing PLC development environment and engineering staff. The records do not say that a cleaned-up family model, reusable library, or transformed codebase set already exists, so those would need to be created from the company codebases and workshop knowledge. Any detailed training, annotation, or test dataset for family extraction would have to be collected during the project from the 38 installations and from engineer interviews and code review.

### First step
Next month, hold a scoping workshop with Dragan Ilić and the two senior automation engineers to select 5 to 8 representative codebases from the 38, define the recurring conveyor-control and safety patterns, and agree on what can be shared for analysis.

### Still to agree
The parties still need to agree on funding for the doctoral candidate and the candidate’s time allocation, the amount of AutomVoj engineer time that can be committed alongside live projects, access conditions for the 38 codebases and related commissioning notes, the handling of background IP in existing PLC libraries and templates, ownership of new results and generated artifacts, and the publication delay needed for AutomVoj to review sensitive material before publication.

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
The closest prior work from Martina Lačoková's record is SYN-PUB-09748 on incremental test suite maintenance for evolving CAN interface contracts, together with SYN-PUB-03011 on automated derivation of CAN-CL contracts from AUTOSAR system descriptions and SYN-PUB-09743 on generating minimum-size covering arrays for constrained parameter spaces. This project goes beyond that work by targeting a company-specific industrial gap: not just deriving or maintaining contract-oriented tests, but building a contract-guided generator that starts from real ARXML/COM artefacts and explicitly searches for cross-supplier interaction faults that survive ordinary 87–89% branch coverage.

### Data: what exists and what to collect
DriveLogic states that it already has full access to ARXML descriptions of all components in the project, the COM configuration, the CANoe environment, and LDRA coverage reports showing 87–89% branch coverage. The company also states that three of the last four delivered projects returned CAN communication faults during customer integration testing. What would still need to be collected for the research is a labelled set of boundary faults, sufficient historical project artefacts for reproducible evaluation, and a curated set of expected interface assumptions and test outcomes so the generator can be benchmarked against real defect cases.

### First step
Next month, select one current project with accessible ARXML and COM artefacts, extract a small set of interface parameters and assumptions, and jointly define the first evaluation oracle for 10 to 15 boundary-focused CANoe scenarios.

### Still to agree
The parties still need to agree the doctoral candidate's funding, including who pays for the candidate's time and any related university costs; the exact allocation of DriveLogic's senior engineer time beyond the stated roughly 40%; background IP and ownership of new tool code, test models, and generated artefacts; publication review and any delay window before public release; and the precise scope of data access, including which customer artefacts can be used, under what confidentiality constraints, and whether historical fault data can be anonymised for research use. The first-phase budget must also be confirmed, because DriveLogic states it would not start something costing more than €40,000 in the first phase.

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
