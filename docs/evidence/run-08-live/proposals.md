# Proposals (live run)

## Industrial PhD on contract-driven generation of CAN integration tests for multi-supplier AUTOSAR stacks at DriveLogic Vojvodina d.o.o.

**Pair:** Martina Lačoková (R0919, Department of Computing and Control Engineering) with DriveLogic Vojvodina d.o.o. (C018), challenge C018-CH2
**Form:** Industrial PhD, from the researcher's consent: "industrial PhD supervision for candidates from embedded systems companies"
**Critic:** approved after 2 draft(s). Screening score 3.00 / 3.

### The problem
DriveLogic Vojvodina d.o.o. currently reaches 87–89% branch coverage before shipment, yet three of the last four delivered projects still had CAN communication faults discovered during customer integration testing. The recurring issue is boundary behavior between components from different suppliers: each part conforms to its own specification, but their interaction fails when connected. The company has ARXML descriptions, COM configuration, and a CANoe environment, but no systematic method to generate tests that target the assumptions one component makes about another. The goal is to develop a contract-based testing method and supporting tooling that reads existing AUTOSAR descriptions and produces test scenarios aimed at interface contracts between suppliers, with practical use inside DriveLogic’s current project workflow.

### Research questions
1. Can interface contracts for multi-supplier AUTOSAR/CAN components be derived automatically from ARXML, COM configuration, and existing interface descriptions with sufficient precision to guide test generation?
2. Can constrained covering-array based test generation improve detection of cross-supplier CAN interaction faults compared with DriveLogic’s current manually designed integration tests while staying within the company’s existing CANoe-based workflow?
3. Can the resulting generated tests be executed with low enough setup and maintenance effort to fit a company process that currently uses LDRA, CANoe/CANalyzer, and customer toolchains?

### Plan
| Period | Work | Result | Pass if |
| --- | --- | --- | --- |
| Year 1 | Map DriveLogic’s current AUTOSAR/CAN integration artifacts to a formal contract model; define fault classes for cross-supplier interaction bugs; build a prototype that extracts test-relevant parameters and constraints from ARXML and COM configuration; prepare a first test-generation pipeline that targets the company’s existing CANoe environment. | A validated contract model for one representative project and a prototype generator that produces candidate integration tests from real project descriptions. | On one selected DriveLogic project, the prototype extracts at least 90% of the agreed test-relevant interface parameters from ARXML/COM artifacts and generates at least 20 candidate tests that company engineers judge as executable in CANoe with only minor adaptation. |
| Year 2 | Extend the prototype to constrained covering-array generation for interface assumptions and interaction faults; compare generated tests with the company’s current manually written integration tests on historical or ongoing project data; refine the contract rules based on feedback from DriveLogic engineers. | A repeatable method for generating focused integration tests and an evidence set showing which interaction faults are covered by the generated suite. | The generated suite detects at least one realistic cross-supplier interaction fault in a pilot evaluation or, if no live fault is available, matches or exceeds the fault-revealing power of the company’s existing test set on at least one historical case study while staying within the same execution budget. |
| Year 3 | Package the method as a lightweight workflow for DriveLogic, including documentation and a reusable tool chain; validate maintenance effort when components or supplier interfaces change; prepare industrial dissertation results and publication material with company review. | A deployable testing workflow for contract-driven CAN integration testing and a defended industrial PhD thesis with documented industrial validation. | DriveLogic can apply the workflow to at least one evolving project with no more than one engineer day of adaptation per interface change, and the final evaluation shows clear reduction in uncovered interaction-risk cases relative to manual test design. |

### What each side brings
- **Company:** DriveLogic Vojvodina d.o.o. brings a real industrial setting in Novi Sad, 27 employees, AUTOSAR Classic integration expertise, existing CAN, LIN and Ethernet stack work, ARXML descriptions, COM configuration, CANoe, LDRA-based coverage reports, and the ability to dedicate one senior engineer part-time, roughly 40% of their working week, to a collaborative research activity tied to active projects.
- **Faculty:** Martina Lačoková brings expertise in combinatorial interaction testing, interface contract specification, runtime monitoring, compositional verification, and tool-supported contract derivation for CAN-based embedded systems, together with access to the Faculty of Technical Sciences environment and its CAN/LIN bus laboratory and small cluster for constraint-solving workloads.

### Why this pair
This pair matches the problem closely: DriveLogic’s challenge is about unseen interaction faults at supplier boundaries in AUTOSAR/CAN integration, and Martina Lačoková’s work directly covers contract-based integration testing, constrained covering arrays, and runtime verification for multi-supplier embedded stacks. The company can supply real project artifacts and an execution environment, while the researcher can supply the formal and algorithmic methods needed to turn those artifacts into targeted tests.

### What is new
The project goes beyond Martina Lačoková’s closest prior work by turning her published methods on constrained covering arrays and interface contracts into an operational industrial workflow for a real AUTOSAR integration setting. Relative to SYN-PUB-09743, the novelty is not only generating minimum-size covering arrays for constrained parameter spaces, but doing so from industrial ARXML and COM artifacts for supplier-boundary faults. Relative to SYN-PUB-09744 and SYN-PUB-03011, the novelty is not only specifying or deriving contracts, but using them directly to generate executable CANoe test scenarios for a specific company process. Relative to SYN-PUB-09748, the novelty is in maintenance and evolution of generated tests inside a live industrial workflow rather than only incremental maintenance of test suites in the abstract. Relative to SYN-PUB-09749 and SYN-PRJ-0434, the novelty is a focused industrial PhD at DriveLogic with evaluation against the company’s actual 87–89% branch-coverage workflow and recurring post-delivery CAN faults. The closest publication set is therefore SYN-PUB-09743, SYN-PUB-09744, SYN-PUB-09748, SYN-PUB-09749, SYN-PUB-03011, and SYN-PRJ-0434.

### Data: what exists and what to collect
DriveLogic already has ARXML descriptions of all components in the project, the COM configuration, the CANoe environment, and LDRA coverage reports showing 87–89% branch coverage before shipment. The company also reports that in the last four delivered projects, three had CAN communication faults found during customer integration testing. What still needs to be collected for the research is a structured corpus of representative interface descriptions, selected historical or ongoing integration cases, examples of supplier-boundary faults, and a labeled set of contract assumptions and expected behaviors for at least one pilot project. No claim is made here that historical fault data is already organized for research use; that collection and labeling would be part of the project setup.

### First step
Next month, agree on one pilot AUTOSAR/CAN project at DriveLogic, gather its ARXML, COM configuration, and existing CANoe test assets, and run a joint workshop to identify the first set of interface assumptions and recurring boundary-fault patterns to encode into the prototype.

### Still to agree
Funding for the candidate and the split between university supervision time and DriveLogic engineer time; whether DriveLogic pays any part of the candidate’s industrial salary or project costs; access conditions for ARXML, COM, CANoe, and any historical integration-fault evidence; IP ownership for new tooling, generated tests, and derived contract models, including background IP from both sides; publication delay and review window before submission of papers or the dissertation; and the exact scope of data that can be stored, anonymized, and reused beyond the pilot project.

### Claims and sources
- supported (p=1): DriveLogic Vojvodina d.o.o. is an automotive and mobility software company based in Novi Sad with 27 employees and was founded in 2004. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. focuses entirely on AUTOSAR-based embedded software, including configuration, integration, V-cycle test planning, execution and coverage reporting, CAN/LIN/Ethernet integration and validation, ECU flashing, diagnostic tooling and UDS/OBD-II support, toolchain migration, and legacy codebase porting. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. can dedicate one senior engineer part-time, roughly 40% of their working week, to a collaborative development or research activity tied to active projects. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. reports 87–89% branch coverage before shipment and has found CAN communication faults in three of the last four delivered projects during customer integration testing. [C018-CH2]
- supported (p=1): DriveLogic Vojvodina d.o.o. has full access to ARXML descriptions of all components in the project, the COM configuration, and the CANoe environment, and would not start work costing more than €40,000 in the first phase. [C018-CH2]
- supported (p=1): Martina Lačoková is a Senior Research Associate in the Faculty of Technical Sciences, Department of Computing and Control Engineering. [R0919]
- supported (p=1): Martina Lačoková’s research fields include Software Engineering and Testing, Embedded and Real-Time Systems, Formal Methods and Verification, and Automotive and Industrial Control. [R0919]
- supported (p=1): Martina Lačoková’s expertise includes combinatorial interaction testing, t-way test generation, interface contract specification, compositional verification, CAN bus, multi-supplier integration, runtime assertion monitoring, covering arrays, constraint solving, and embedded software. [R0919]
- supported (p=1): Martina Lačoková’s published work includes SYN-PUB-09743, SYN-PUB-09744, SYN-PUB-02017, SYN-PUB-01450, SYN-PUB-09745, SYN-PUB-09746, SYN-PUB-09747, SYN-PUB-09748, SYN-PUB-09749, SYN-PUB-03011, and SYN-PUB-09750. [SYN-PUB-09743, SYN-PUB-09744, SYN-PUB-02017, SYN-PUB-01450, SYN-PUB-09745, SYN-PUB-09746, SYN-PUB-09747, SYN-PUB-09748, SYN-PUB-09749, SYN-PUB-03011, SYN-PUB-09750]
- supported (p=0.96): Martina Lačoková’s closest publication set for the proposed project is SYN-PUB-09743, SYN-PUB-09744, SYN-PUB-09748, SYN-PUB-09749, SYN-PUB-03011, and SYN-PRJ-0434. [SYN-PUB-09743, SYN-PUB-09744, SYN-PUB-09748, SYN-PUB-09749, SYN-PUB-03011, SYN-PRJ-0434]
- supported (p=1): Martina Lačoková’s group maintains a CAN/LIN bus laboratory with vector hardware interfaces and a small cluster for constraint-solving workloads. [R0919]
- supported (p=1): The company challenge is to find a systematic way to generate tests that target interface contracts between components from different sources in AUTOSAR/CAN integration. [C018-CH2]
- supported (p=1): The challenge says DriveLogic has ARXML descriptions, COM configuration, and CANoe, but no systematic method for generating tests aimed at component assumptions across suppliers. [C018-CH2]

## Industrial PhD on plain-language explanations for automated SME credit decisions at Kredo Fintech

**Pair:** Branislav Žarković (R0801, Department of Finance and Banking) with Kredo Fintech (C010), challenge C010-CH2
**Form:** Industrial PhD, from the researcher's consent: "industrial PhD supervision"
**Critic:** approved after 1 draft(s). Screening score 2.86 / 3.

### The problem
Kredo Fintech needs a compliant explanation format for automated credit decisions that a borrower can understand and challenge, in Serbian and, for planned expansion, Macedonian. Its current gradient-boosted scoring model performs well, and SHAP is already used internally, but the existing explanation summary is too technical for borrowers and not yet satisfactory for compliance. The solution must be generated automatically at decision time, stored with the decision record, and work reliably in production within about six months, while fitting Kredo Fintech’s modest budget and existing lending workflow.

### Research questions
1. How can feature-level model explanations be translated into plain-language borrower explanations that remain faithful to the decision logic while being understandable to non-technical micro- and small-business borrowers?
2. Which explanation template and wording strategy best satisfies the needs of borrowers and compliance for automated credit decisions in Serbian, with a maintainable path to Macedonian, when tested on Kredo Fintech’s live decision flow?
3. What minimum set of explanation elements can be generated automatically at decision time and stored with the decision record without degrading model performance or operational latency in production?

### Plan
| Period | Work | Result | Pass if |
| --- | --- | --- | --- |
| Year 1 | Map the current decision workflow, explanation needs, and compliance constraints; review the existing SHAP-based internal summary; define the explanation schema and borrower-facing language principles; build a prototype that turns model outputs into plain-language Serbian explanations. | A validated explanation specification and first prototype integrated into a test version of the decision flow. | A prototype explanation can be generated automatically for at least 95% of test decisions, is stored with the decision record, and passes an internal review by Kredo Fintech’s compliance officer and data team against a predefined checklist. |
| Year 2 | Run iterative testing with real decision cases from Kredo Fintech; compare at least two explanation variants for clarity, challengeability, and regulatory fit; refine Serbian wording and prepare the Macedonian version of the template. | A tested explanation template set in Serbian, with a translation-ready Macedonian structure, plus documented performance and usability findings. | At least 80% of tested borrowers or internal reviewers rate the chosen explanation as understandable, and the explanation adds no more than a small, agreed latency to decision-time generation in the test environment. |
| Year 3 | Deploy the selected explanation format in production; monitor stability, complaint/challenge patterns, and operational handling; document the final method and academic results for the industrial PhD thesis. | A production-ready explanation module and thesis-ready evidence on explainable SME credit decisions in a regulated fintech setting. | The production system generates compliant explanations for live automated decisions for three consecutive months without critical failures, and Kredo Fintech confirms the format can support the North Macedonia rollout. |

### What each side brings
- **Company:** Kredo Fintech brings an active automated SME lending platform, a 26-person team, a data team of five, the current gradient-boosted scoring model, existing SHAP-based internal summaries, decision records, and practical constraints from regulated lending in Novi Sad. It also brings a real deployment context for Kredo SME Loans, Kredo Flex Line, Kredo Score Report, and Kredo Portal, with the need to render explanations in Serbian and later Macedonian.
- **Faculty:** Branislav Žarković brings expertise in credit scoring for thin-file and micro-enterprise borrowers, alternative data and open banking for lending decisions, explainable and interpretable credit risk models, and regulatory implications of AI and credit models, supported by his publications on scoring micro-enterprises with little credit history, explaining credit decisions to supervisors, alternative data in consumer credit scoring, explainability requirements under the EU AI Act, and benchmarking scorecard interpretability metrics. He also brings industrial PhD supervision experience and practical banking insight from being a former head of risk at a regional bank.

### Why this pair
This pair matches a live regulatory problem with a researcher who has direct, relevant experience in credit explainability and SME lending. Kredo Fintech needs a production-ready explanation layer for automated lending, and Branislav Žarković’s work already addresses credit decisions, explainability, alternative data, and regulatory expectations. The company can supply real decision cases and operational constraints; the researcher can turn those into a defensible method that works in production.

### What is new
The closest prior work is SYN-PUB-08747, 'Explaining credit decisions to supervisors: a case study,' together with SYN-PUB-08751, 'Explainability requirements under the EU AI Act: implications for credit scoring vendors.' This industrial PhD goes beyond those publications by converting explainability from supervisor-facing analysis into borrower-facing, production-grade text generation tied to decision-time deployment, decision storage, and bilingual delivery for Serbian and Macedonian. It also extends the research from general compliance discussion to a tested explanation template embedded in a live fintech workflow.

### Data: what exists and what to collect
Kredo Fintech states that it has funded over 1,400 loans and uses transaction data, tax filings, sector benchmarks, and a gradient-boosted scoring model with SHAP-based internal summaries. It also has decision records and a borrower portal, and its data team of five can support pipeline engineering and model monitoring. What still needs to be collected for the PhD is a research-ready sample of past decision records, explanation outputs, and review labels for clarity and compliance, plus any borrower feedback needed to test readability in Serbian and later Macedonian.

### First step
In the next month, the researcher and Kredo Fintech should agree the explanation specification for a small test set, select a sample of decision cases, and run a first Serbian prototype on the company’s existing SHAP-based summaries.

### Still to agree
They still need to agree the funding package for the industrial PhD, including who pays for the candidate’s time and any company staff time beyond the data team of five; access rules for decision records and any personal or sensitive data; background IP and ownership of new explanation code, templates, and thesis results; publication delay for company review; and whether Macedonian implementation will be included in the initial scope or reserved for a later phase.

### Claims and sources
- supported (p=1): R0801 Branislav Žarković is a Full Professor at the Faculty of Economics in Subotica, Department of Finance and Banking, University of Novi Sad. [R0801]
- supported (p=0.72): R0801 has expertise in credit risk, SME finance, credit scoring, thin-file borrowers, explainable models, alternative data, and regulation. [R0801, SYN-PUB-08746, SYN-PUB-08747, SYN-PUB-08748, SYN-PUB-08749, SYN-PUB-08750, SYN-PUB-08751, SYN-PUB-08752, SYN-PUB-08753, SYN-PUB-08754]
- supported (p=1): R0801 is open to industrial PhD supervision. [R0801]
- supported (p=1): R0801 has industry experience as former head of risk at a regional bank from 2005 to 2012. [R0801]
- supported (p=1): C010 Kredo Fintech is a fintech founded in 2020, based in NTP Novi Sad, with 26 employees. [C010]
- supported (p=1): C010 serves micro and small businesses with loans between 500 and 50,000 EUR. [C010]
- supported (p=1): C010 has funded over 1,400 loans and says its default rate is below the Serbian banking sector average for SME portfolios. [C010]
- supported (p=0.96): C010 is regulated by the National Bank of Serbia and plans expansion to North Macedonia. [C010, C010-CH2]
- supported (p=1): C010 uses a gradient-boosted ensemble scoring model and SHAP values for internal explanations. [C010-CH2]
- supported (p=1): C010 has a data team of five. [C010]
- supported (p=1): C010’s products include Kredo SME Loans, Kredo Flex Line, Kredo Score Report, and Kredo Portal. [C010]
- supported (p=1): C010 uses Python, dbt, Snowflake, Apache Airflow, scikit-learn, PostgreSQL, REST APIs for Open Banking data ingestion, and Docker. [C010]
- supported (p=1): C010-CH2 requires a plain-language explanation for every automated credit decision, generated at decision time, stored with the decision record, and rendered in Serbian and Macedonian. [C010-CH2]
- supported (p=0.99): C010-CH2 says the current technical summary is too confusing for most borrowers and not yet satisfactory to the compliance officer Dragana Vukić. [C010-CH2]
- supported (p=1): C010-CH2 says the explanation must be in place before expansion to North Macedonia and within about six months. [C010-CH2]
- supported (p=1): SYN-PUB-08747 is 'Explaining credit decisions to supervisors: a case study.' [SYN-PUB-08747]
- supported (p=1): SYN-PUB-08751 is 'Explainability requirements under the EU AI Act: implications for credit scoring vendors.' [SYN-PUB-08751]
- supported (p=1): SYN-PUB-08746 is 'Scoring micro-enterprises with little credit history.' [SYN-PUB-08746]
- supported (p=1): SYN-PUB-08748 is 'Alternative data in consumer credit scoring: evidence from a Serbian fintech lender.' [SYN-PUB-08748]
- supported (p=1): SYN-PUB-08752 is 'Incorporating cash-flow volatility into SME credit scoring: a machine learning approach.' [SYN-PUB-08752]
- supported (p=1): SYN-PUB-08753 is 'Open banking data for thin-file borrower assessment: opportunities and regulatory constraints.' [SYN-PUB-08753]
- supported (p=1): SYN-PUB-08754 is 'Benchmarking scorecard interpretability metrics in credit risk practice.' [SYN-PUB-08754]

## Industrial PhD on incremental reuse and safety patching for 38 drifting PLC codebases at AutomVoj a.d.

**Pair:** Veljko Pantelić (R0995, Department of Computing and Control Engineering) with AutomVoj a.d. (C003), challenge C003-CH2
**Form:** Industrial PhD, from the researcher's consent: "industrial PhD supervision"
**Critic:** approved after 2 draft(s). Screening score 2.99 / 3.

### The problem
AutomVoj a.d. has 38 active PLC codebases for customer installations, all written in ladder logic in TIA Portal, and a safety-related patch currently takes three engineers two full weeks because each codebase must be found, adapted, and tested separately. The practical problem is to introduce modular reuse and structured change management without rewriting the installed base at once, so that future safety patches can be propagated faster and with less manual effort.

### Research questions
1. Can a variability model be built for the 38 active PLC codebases that captures the stable common parts and the customer-specific differences with enough precision to support patch propagation?
2. Can safety-related changes be applied incrementally so that a patch can be generated or guided for each affected codebase without full regeneration or a full rewrite?
3. Can the proposed approach reduce the current effort from three engineers for two full weeks per patch cycle to a repeatable process that AutomVoj can maintain during live project work?

### Plan
| Period | Work | Result | Pass if |
| --- | --- | --- | --- |
| Year 1 | Inventory a representative subset of the 38 active codebases, identify recurring ladder-logic patterns, and derive a variability model and common library structure that fits AutomVoj's existing TIA Portal practice. Use the PLC laboratory at the Faculty of Technical Sciences for small validation cases and compare the model against actual customer variants. | A first reusable model of shared logic and customer-specific variation points, plus a validated subset of candidate reusable components for ladder logic in TIA Portal. | At least 10 codebases are analysed; at least 6 recurring logic patterns are documented; and the model can explain at least 80% of the selected differences in the analysed subset. |
| Year 2 | Develop an incremental patching workflow that maps one safety change into the variant model and then into the affected codebases, with tests that can be run on representative installations. Validate the workflow on a patch scenario similar to the emergency-stop sequence change described by AutomVoj. | A prototype process for propagating safety changes across multiple PLC codebases without rewriting each one from scratch. | A single safety change can be applied to at least 5 codebases through the workflow, and the required engineering effort is reduced to no more than one engineer for one week for the prototype case. |
| Year 3 | Harden the approach on AutomVoj's real maintenance flow, refine the library and model based on engineer feedback, and document a maintenance process that can be used by the chief engineer and senior automation engineers without special research support. | A maintainable reuse and patching method for the installed base, together with thesis results and company-ready guidelines. | The approach is demonstrated on at least 12 codebases, and AutomVoj can describe a repeatable process that its team can carry out without the doctoral candidate for a full patch cycle. |

### What each side brings
- **Company:** AutomVoj a.d. brings the concrete maintenance problem, the 38 active PLC codebases written in ladder logic in TIA Portal, the in-house testing floor in Zrenjanin, and access to practical validation through its conveyor and sorting systems for food and beverage customers. The company also offers the time of its chief engineer, two senior automation engineers, and Dragan Ilić for review and validation within the limits of ongoing project work.
- **Faculty:** The Faculty of Technical Sciences brings Veljko Pantelić's expertise in IEC 61131-3, model-driven engineering, software product lines, DSL design, and incremental code generation, plus the small PLC laboratory with Wago and Beckhoff controllers, and the existing toolchain experience with EMF, Xtext, and Sirius.

### Why this pair
This pair combines a real maintenance bottleneck at AutomVoj a.d. with research capability that directly matches the problem of PLC variability and incremental code generation. The company already has 38 drifting codebases and a documented need to avoid rewriting everything at once, while the researcher has prior work on PLC metamodeling, variability modelling, incremental model-to-text generation, and product-line code generation infrastructure, making the collaboration tightly aligned.

### What is new
Compared with the researcher's prior work, the new contribution is not another general PLC metamodel or generic product-line method, but an industrially grounded workflow for a legacy ladder-logic installed base that must be patched incrementally under live maintenance constraints. The closest prior papers are SYN-PUB-10374 on variability modelling in PLC software families, SYN-PUB-02958 on incremental model-to-text generation for PLC software, and SYN-PUB-10379 on extracting feature models from legacy PLC codebases. This proposal goes beyond those papers by focusing on a concrete industrial setting with 38 active codebases, a measurable maintenance bottleneck, and a target of propagating a safety patch across real customer variants without full regeneration or full rewrite.

### Data: what exists and what to collect
AutomVoj a.d. states that 38 active PLC codebases exist today and that the last safety patch touched three engineers for two full weeks. The records do not say that source code, test logs, or installation histories are already compiled into a research dataset, so those materials would need to be collected and curated during the project from the live codebases and from engineer knowledge. The Faculty of Technical Sciences already has a small PLC laboratory with Wago and Beckhoff controllers for validation experiments.

### First step
In the next month, agree on a pilot set of 3 to 5 representative codebases with Dragan Ilić and the chief engineer, export the first versions from TIA Portal, and jointly define one concrete safety patch scenario to use as the baseline case.

### Still to agree
The parties still need to agree the industrial PhD funding arrangement, who pays the doctoral candidate and how much company time can be committed by the chief engineer, the two senior automation engineers, and Dragan Ilić, the exact access rules for the 38 codebases and any related test data, the publication delay for thesis-related outputs, and ownership and licensing of new results versus background IP in AutomVoj's existing ladder-logic assets and any reusable libraries or tools produced in the project.

### Claims and sources
- supported (p=1): Veljko Pantelić is an Assistant Professor in the Department of Computing and Control Engineering at the Faculty of Technical Sciences. [R0995]
- supported (p=0.99): Veljko Pantelić's expertise includes IEC 61131-3 PLC metamodeling and Structured Text tooling. [SYN-PUB-10372, SYN-PUB-10375, SYN-PRJ-0390]
- supported (p=1): Veljko Pantelić's expertise includes model-driven engineering and model-to-text / code generation for PLC software. [SYN-PUB-10373, SYN-PUB-02958, SYN-PUB-10380, SYN-PRJ-0390]
- supported (p=1): Veljko Pantelić's expertise includes software product lines and variability management in industrial automation. [SYN-PUB-10374, SYN-PUB-10377, SYN-PUB-10379, SYN-PRJ-0390, SYN-PRJ-0391]
- supported (p=1): Veljko Pantelić's expertise includes domain-specific language design and IDE support for industrial control programming. [SYN-PUB-10375, SYN-PUB-10378, SYN-PRJ-0390]
- supported (p=0.93): Veljko Pantelić's expertise includes safety-aware automation software and industrial PLC validation. [SYN-PUB-10377, SYN-PRJ-0391, SYN-PRJ-0095]
- supported (p=1): AutomVoj a.d. is a robotics and industrial automation company based in Zrenjanin. [C003]
- supported (p=1): AutomVoj a.d. has 212 employees and was founded in 1983. [C003]
- supported (p=1): AutomVoj a.d. builds conveyor and sorting automation systems and ships systems to customers in Serbia, Hungary, Romania, Austria, Slovenia, Croatia, and Slovakia. [C003]
- supported (p=1): AutomVoj a.d. designs, manufactures, commissions, and supports PLC-based conveyor lines and automated sorting equipment for food and beverage producers. [C003]
- supported (p=1): AutomVoj a.d. has no dedicated R&D department and technical development happens informally through project work led by its chief engineer and two senior automation engineers. [C003]
- supported (p=1): AutomVoj a.d. has 38 active codebases across its installed base, all written in ladder logic in TIA Portal. [C003-CH2]
- supported (p=1): AutomVoj a.d. says a safety-related patch currently takes three engineers two full weeks, and the last such patch still left two sites where the logic differed enough that the standard fix did not apply cleanly. [C003-CH2]
- supported (p=1): AutomVoj a.d. says it needs a practical approach that does not require rewriting everything at once and can be maintained going forward. [C003-CH2]
- supported (p=1): AutomVoj a.d. has an in-house testing floor in Zrenjanin and long-term supply relationships with component makers in Germany and Italy. [C003]
- supported (p=1): AutomVoj a.d. uses Siemens S7-1500 and S7-300 PLC platforms, Ladder logic and structured text programming in TIA Portal, Siemens SINAMICS and SEW-EURODRIVE drives, EPLAN Electric P8, Profibus and Profinet networking, Siemens WinCC and Weintek panels, and AutoCAD Mechanical. [C003]
- supported (p=0.99): The Faculty of Technical Sciences uses Eclipse Modeling Framework, Xtext, Sirius, and a small PLC laboratory with Wago and Beckhoff controllers for validation experiments. [R0995]
- supported (p=0.88): The closest prior works for the novelty claim are SYN-PUB-10374, SYN-PUB-02958, and SYN-PUB-10379. [SYN-PUB-10374, SYN-PUB-02958, SYN-PUB-10379]
