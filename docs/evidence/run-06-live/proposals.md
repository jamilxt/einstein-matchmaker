# Proposals (live run)

## Industrial PhD on plain-language explanations for automated SME credit decisions at Kredo Fintech

**Pair:** Branislav Žarković (R0801, Department of Finance and Banking) with Kredo Fintech (C010), challenge C010-CH2
**Form:** Industrial PhD, from the researcher's consent: "industrial PhD supervision"
**Critic:** approved after 1 draft(s). Screening score 2.86 / 3.

### The problem
Kredo Fintech needs a compliant explanation format for every automated credit decision that is understandable to borrowers, challengeable in practice, and generated automatically at decision time in Serbian and, for the planned expansion, Macedonian. The current gradient-boosted ensemble scores well, and SHAP-based internal summaries exist, but the borrower-facing explanation is still too technical for the regulator’s expectation and the six-month production constraint.

### Research questions
1. Can a hybrid explanation pipeline turn model-level SHAP attributions into borrower-facing plain-language explanations that preserve decision fidelity for Kredo SME Loans and Kredo Flex Line decisions?
2. Which explanation template and wording style produces the best borrower comprehension and perceived fairness while remaining consistent with the underlying automated decision record?
3. What minimum evaluation protocol can Kredo Fintech use in production to verify that explanations are generated at decision time, stored with the decision, and rendered correctly in Serbian and Macedonian?

### Plan
| Period | Work | Result | Pass if |
| --- | --- | --- | --- |
| Year 1 | Map the current decision workflow, explanation points, and compliance requirements; formalize the explanation schema; build the first Serbian explanation generator on top of the existing SHAP summaries; define offline evaluation metrics for fidelity, readability, and completeness. | A prototype explanation pipeline that can be tested on historical decisions and reviewed by Kredo's compliance officer. | On a held-out test set, the prototype generates a structured explanation for at least 95% of automated decisions, and at least 80% of sampled outputs are rated understandable by internal review against a predefined rubric. |
| Year 2 | Refine the wording templates, add borrower-facing challenge cues, and test translation and localization rules for Macedonian; compare explanation variants on comprehension and consistency with the model output. | A bilingual explanation framework ready for pilot use in the borrower portal and decision archive. | The best variant improves borrower comprehension scores by at least 20% over the current internal technical summary, while preserving the original decision rationale in at least 90% of audit checks. |
| Year 3 | Run production pilot monitoring, error analysis, and compliance documentation; stabilize logging, versioning, and exception handling for live deployment; prepare the dissertation and implementation guide. | A deployed, monitored explanation module with documentation suitable for internal compliance and doctoral submission. | For three consecutive months of live pilot use, explanation generation succeeds for at least 99% of automated decisions, with zero missing stored explanations in the decision log and no unresolved compliance-critical defects. |

### What each side brings
- **Company:** Kredo Fintech brings a regulated lending use case, its current gradient-boosted credit model, existing SHAP-based internal summaries, decision logs, and engineering access through its data team of five. The company also brings the operational constraint that the solution must work in production within about six months, and the borrower portal where explanations will be rendered in Serbian and Macedonian.
- **Faculty:** Branislav Žarković brings supervision in credit scoring, thin-file borrowers, explainable and interpretable machine learning, alternative data, and regulatory aspects of credit models. His prior work includes explainable credit decisions, alternative data in Serbian fintech lending, regulatory capital implications of machine-learning credit models, and explainability requirements under the EU AI Act.

### Why this pair
Kredo Fintech already operates a model-driven, regulated lending process, and Branislav Žarković has directly relevant research on explainable credit decisions and supervisory expectations. The company has the exact production problem, while the researcher has the methodological and regulatory background to convert model explanations into borrower-facing language that fits Serbian lending practice.

### What is new
Compared with Branislav Žarković’s closest prior papers, especially SYN-PUB-08747, SYN-PUB-08751, and SYN-PUB-08754, this project goes beyond describing explainability requirements or benchmarking interpretability metrics. The new contribution is a production-grade, bilingual explanation pipeline that transforms model attributions into plain-language decision messages, stores them at decision time, and is evaluated in a live fintech workflow. It also extends his earlier work on alternative data and thin-file borrowers by focusing on operational deployment, not only model analysis or conceptual guidance.

### Data: what exists and what to collect
Kredo Fintech already has transaction data, tax filings, sector benchmarks, Open Banking ingestion through REST APIs, decision records, and existing SHAP-based internal summaries. The records do not say that a labeled borrower-comprehension dataset exists, so those evaluation labels would need to be collected during the project through internal testing and pilot review. The records also do not say that a Serbian-Macedonian translation corpus for credit explanations exists, so translation examples and review data would need to be created.

### First step
Next month, the parties should agree the explanation schema, select a pilot sample of historical decisions from the current model, and produce the first Serbian prototype messages for review by Kredo's compliance officer and the research supervisor.

### Still to agree
They still need to agree the doctoral candidate appointment and funding, who pays the candidate's time and any associated research costs, access rights to decision logs and borrower communication data, background IP in Kredo's scoring model and explanation templates, ownership of new results, publication review and delay terms, and whether the pilot can use live or only historical decisions during the first phase.

### Claims and sources
- supported (p=1): Branislav Žarković is a Full Professor at the Faculty of Economics in Subotica, University of Novi Sad, Department of Finance and Banking. [R0801]
- supported (p=1): His fields are credit risk and SME finance, with keywords including credit scoring, thin-file borrowers, explainable models, alternative data, and regulation. [R0801]
- supported (p=1): He has industry experience as former head of risk at a regional bank from 2005 to 2012. [R0801]
- supported (p=1): His publication SYN-PUB-08747 is about explaining credit decisions to supervisors. [SYN-PUB-08747]
- supported (p=1): His publication SYN-PUB-08751 is about explainability requirements under the EU AI Act and their implications for credit scoring vendors. [SYN-PUB-08751]
- supported (p=1): His publication SYN-PUB-08754 is about benchmarking scorecard interpretability metrics in credit risk practice. [SYN-PUB-08754]
- supported (p=1): His publication SYN-PUB-08748 is about alternative data in consumer credit scoring from a Serbian fintech lender. [SYN-PUB-08748]
- supported (p=1): His publication SYN-PUB-08752 is about incorporating cash-flow volatility into SME credit scoring. [SYN-PUB-08752]
- supported (p=1): His publication SYN-PUB-08753 is about open banking data for thin-file borrower assessment and regulatory constraints. [SYN-PUB-08753]
- supported (p=1): Kredo Fintech is a fintech founded in 2020, based in NTP Novi Sad, with 26 employees. [C010]
- supported (p=1): Kredo Fintech serves firms with one to nine employees and offers loans between 500 and 50,000 euros. [C010]
- supported (p=1): Kredo Fintech has funded over 1,400 loans and says its default rate is below the Serbian banking sector average for SME portfolios. [C010]
- supported (p=1): Kredo Fintech's data team has five people. [C010]
- supported (p=1): Kredo Fintech uses Python, dbt, Snowflake, Apache Airflow, scikit-learn, PostgreSQL, REST APIs for Open Banking data ingestion, and Docker. [C010]
- supported (p=0.96): Kredo Fintech is regulated by the National Bank of Serbia. [C010]
- supported (p=1): The challenge is to provide a plain-language explanation for every automated credit decision, generated automatically at decision time, stored with the decision, and shown in Serbian and Macedonian in the borrower portal. [C010-CH2]
- supported (p=1): The current main scoring model is a gradient-boosted ensemble, and the company has experimented with SHAP values and short internal summaries. [C010-CH2]
- supported (p=1): The company wants a working production solution within about six months. [C010-CH2]
- supported (p=1): The researcher is open to industrial PhD supervision. [R0801]

## Industrial PhD on contract-driven test generation for multi-supplier CAN integration at DriveLogic Vojvodina d.o.o.

**Pair:** Martina Lačoková (R0919, Department of Computing and Control Engineering) with DriveLogic Vojvodina d.o.o. (C018), challenge C018-CH2
**Form:** Industrial PhD, from the researcher's consent: "industrial PhD supervision for candidates from embedded systems companies"
**Critic:** approved after 1 draft(s). Screening score 3.00 / 3.

### The problem
DriveLogic Vojvodina d.o.o. reaches 87–89% branch coverage before shipment, yet the company still sees CAN communication faults after delivery, especially at boundaries between components from different suppliers. The practical problem is to generate integration test scenarios that target the assumptions encoded in interface contracts, rather than only confirming what engineers already believe to be correct from the ARXML and COM specification. The doctoral work will develop a method and tooling for contract-driven test generation and prioritization for AUTOSAR-based, multi-supplier CAN integration.

### Research questions
1. Can interface contracts be extracted or reconstructed from ARXML and COM configuration well enough to generate integration tests that expose cross-supplier interaction faults before shipment?
2. Does contract-driven test generation find more boundary faults than the company’s current manual COM-focused test design at the same or lower test effort?
3. Can the approach be integrated into DriveLogic’s existing CANoe-based workflow so that generated tests remain usable within the company’s current integration and V-cycle process?

### Plan
| Period | Work | Result | Pass if |
| --- | --- | --- | --- |
| Year 1 | Analyse DriveLogic’s current AUTOSAR/CAN integration workflow, select one active project as the pilot case, formalize the relevant interface assumptions, and prototype a generator that derives contract-based interaction tests from ARXML and COM configuration. The first version will be evaluated on historical fault cases and on the pilot project. | A validated problem model, a first prototype generator, and an initial mapping from interface contracts to executable CANoe test scenarios. | At least one pilot project is modelled end-to-end, and the prototype produces a test suite that reproduces or targets at least 2 of the 3 recent integration-fault patterns described by the company. |
| Year 2 | Extend the prototype with fault-targeting heuristics, test-suite reduction, and traceability from contract clauses to test cases. Compare generated tests with the company’s manually written integration tests on the pilot project and, if available, one additional project. | A stronger generator with measurable comparison results and a repeatable workflow for contract-driven integration testing. | The generated suite is accepted by DriveLogic engineers for execution in CANoe and detects at least one previously missed boundary fault pattern, or demonstrates equal fault detection with fewer executed tests than the manual baseline. |
| Year 3 | Stabilize the method into a tool-supported workflow, document usage guidelines, and evaluate transferability across projects with different supplier combinations. Prepare the dissertation and a publishable method description that fits the company’s confidentiality constraints. | A mature method, reusable tooling, and dissertation-ready evidence from industrial evaluation. | The workflow is applied on at least 2 projects or project variants, and the final evaluation shows a clear improvement in boundary-fault targeting over the baseline process defined with DriveLogic. |

### What each side brings
- **Company:** DriveLogic Vojvodina d.o.o. brings a real industrial setting in Novi Sad, access to AUTOSAR Classic integration work, ARXML descriptions, COM configuration, CANoe environment, and the engineering time of up to one senior engineer at roughly 40% of their working week. The company also brings the concrete problem context: 27 employees, 87–89% branch coverage before shipment, and the recurring CAN boundary-fault issue observed in the last four delivered projects.
- **Faculty:** Martina Lačoková brings research expertise in combinatorial interaction testing, interface contract specification, runtime monitoring, and compositional verification for CAN-based embedded systems, along with a CAN/LIN bus laboratory with vector hardware interfaces and a small cluster for constraint-solving workloads. Her prior work on constrained covering arrays, interface contracts, runtime monitoring, and incremental test maintenance is directly relevant to the proposed method.

### Why this pair
This pairing is a strong fit because DriveLogic’s challenge is exactly the kind of multi-supplier CAN integration problem Martina Lačoková has studied in her published work and projects, while the company has the industrial workflow, tooling, and live cases needed to turn that research into a usable method. The company’s need is practical and immediate, and the researcher’s background makes it realistic to build a contract-based solution that fits an AUTOSAR/CANoe environment.

### What is new
The closest prior work is SYN-PUB-09744, SYN-PUB-03011, and SYN-PRJ-0434, where the researcher addressed interface contract specification, automated derivation of CAN-CL contracts from AUTOSAR descriptions, and contract-based integration testing for multi-supplier CAN networks. The new contribution here is to move from contract specification and general integration testing to an industrially deployable generator that targets the specific cross-supplier boundary faults observed at DriveLogic, using the company’s ARXML, COM configuration, and CANoe workflow. The proposal also extends the earlier focus on test generation and monitoring into a fault-driven industrial validation setting with the company’s own recurring defect pattern.

### Data: what exists and what to collect
The company states that it has full access today to ARXML descriptions of all components in the project, the COM configuration, and the CANoe environment. It also has historical evidence from four delivered projects, including three cases with CAN communication faults found during customer integration testing, and LDRA coverage reports showing 87–89% branch coverage before shipment. What still needs to be collected for the research is a curated set of the relevant historical defect cases, a representative pilot-project data bundle, and the exact interface-contract assumptions needed to benchmark the generated tests against the manual baseline.

### First step
Next month, agree on one pilot project, define the exact subset of ARXML, COM, and CANoe artifacts to share, and run a joint workshop to turn the three recurring fault patterns into an initial test-generation specification.

### Still to agree
The parties still need to agree on funding and on who pays for the doctoral candidate’s time and supervision costs, on the treatment of background IP and new IP in any generator or method developed, on publication delay and confidentiality review for industrial results, and on the exact data-access procedure for ARXML, COM configuration, CANoe artifacts, and defect records. Because the company’s first-phase budget is capped at €40,000, any work beyond the agreed company time contribution of up to one senior engineer at roughly 40% of their working week must be explicitly covered in the agreement.

### Claims and sources
- supported (p=1): Martina Lačoková is a Senior Research Associate in the Department of Computing and Control Engineering at the Faculty of Technical Sciences, University of Novi Sad. [R0919]
- supported (p=1): Martina Lačoková’s research fields include Software Engineering and Testing, Embedded and Real-Time Systems, Formal Methods and Verification, and Automotive and Industrial Control. [R0919]
- supported (p=1): Martina Lačoková’s expertise includes combinatorial interaction testing, interface contract specification, compositional verification, runtime assertion monitoring, covering arrays, constraint solving, and embedded software. [R0919]
- supported (p=1): DriveLogic Vojvodina d.o.o. is an automotive and mobility software company based in Novi Sad. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. has 27 employees and was founded in 2004. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. focuses entirely on AUTOSAR-based embedded software for configuration, integration, and V-cycle testing for powertrain, body, and chassis ECUs. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. provides AUTOSAR Classic BSW configuration and software component integration, V-cycle test planning, execution and coverage reporting, CAN, LIN and Ethernet communication stack integration and validation, ECU flashing, diagnostic tooling and UDS/OBD-II protocol support, AUTOSAR toolchain migration, and legacy codebase porting. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. reports that it can dedicate one senior engineer part-time, roughly 40% of their working week, to a collaborative development or research activity. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. has delivered software integration work on more than forty OEM projects. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. says its LDRA reports consistently show 87–89% branch coverage before shipment. [C018-CH2]
- supported (p=1): DriveLogic Vojvodina d.o.o. reports that in the last four delivered projects, three came back with CAN communication faults found during customer integration testing. [C018-CH2]
- supported (p=1): DriveLogic Vojvodina d.o.o. says it has full access to the ARXML descriptions of all components in the project, the COM configuration, and the CANoe environment. [C018-CH2]
- supported (p=1): DriveLogic Vojvodina d.o.o. states that it would not start something costing more than €40,000 in the first phase. [C018-CH2]
- supported (p=1): SYN-PUB-09744 is about interface contract specification for multi-supplier CAN node integration. [SYN-PUB-09744]
- supported (p=1): SYN-PUB-03011 is about automated derivation of CAN-CL contracts from AUTOSAR system descriptions. [SYN-PUB-03011]
- supported (p=1): SYN-PRJ-0434 is about contract-based integration testing for multi-supplier CAN networks in small-series manufacturing. [SYN-PRJ-0434]
- supported (p=1): SYN-PUB-09743 is about generating minimum-size covering arrays for constrained parameter spaces in automotive middleware. [SYN-PUB-09743]
- supported (p=1): SYN-PUB-09745 evaluates strength-3 combinatorial test suites against real field faults in a CAN stack implementation. [SYN-PUB-09745]
- supported (p=1): SYN-PUB-09747 is a benchmark suite for constrained covering array generators. [SYN-PUB-09747]
- supported (p=1): SYN-PUB-09748 is about incremental test suite maintenance for evolving CAN interface contracts. [SYN-PUB-09748]
- supported (p=1): SYN-PUB-09749 is about cross-layer interaction faults in multi-supplier embedded stacks. [SYN-PUB-09749]
- supported (p=1): SYN-PUB-02017 is about runtime assertion monitoring for CAN-based embedded systems using low-overhead instrumentation. [SYN-PUB-02017]
- supported (p=1): SYN-PUB-09750 studies monitoring overhead profiles for CAN-CL runtime contracts across six microcontroller families. [SYN-PUB-09750]
- supported (p=1): SYN-PRJ-0435 is about embedded software dependability by compositional specification and testing. [SYN-PRJ-0435]

## Industrial PhD on incremental PLC software product-line reuse for AutomVoj a.d.'s 38 TIA Portal codebases

**Pair:** Veljko Pantelić (R0995, Department of Computing and Control Engineering) with AutomVoj a.d. (C003), challenge C003-CH2
**Form:** Industrial PhD, from the researcher's consent: "industrial PhD supervision"
**Critic:** approved after 1 draft(s). Screening score 2.99 / 3.

### The problem
AutomVoj a.d. needs a practical way to maintain and patch 38 active ladder-logic PLC codebases in TIA Portal without rewriting them all at once. A safety-related patch currently takes three engineers two full weeks, and the last update still left two sites where the standard fix did not apply cleanly. The research problem is to create an incremental reuse approach that can extract common structure from existing PLC programs, support modular libraries or product-line style variation, and reduce the effort of future safety and functional patches while remaining compatible with day-to-day commissioning work.

### Research questions
1. Can a variability-aware refactoring method extract reusable PLC structure from 38 existing ladder-logic codebases without requiring a full rewrite?
2. Can incremental code generation or synchronization reduce the effort of applying a safety patch below the current baseline of three engineers for two full weeks while preserving behavior across all customer-specific variants?
3. What library and traceability structure is sufficient for AutomVoj engineers to maintain future changes in TIA Portal with less divergence between codebases?

### Plan
| Period | Work | Result | Pass if |
| --- | --- | --- | --- |
| Year 1 | Inventory the 38 active codebases, classify recurring patterns and customer-specific variants, and define a pilot variability model for one representative conveyor line family. Build a small reference transformation or generation workflow that targets ladder logic in TIA Portal and validate it on the PLC laboratory setup available to the researcher. | A documented variability model for one line family, one pilot reusable library or transformation workflow, and an initial validation report from the lab. | At least 1 representative family is modeled; at least 5 recurring logic patterns are identified; and the pilot workflow can reproduce or adapt the selected family for at least 3 codebase variants without manual redesign of the whole program. |
| Year 2 | Extend the approach to incremental patching and traceability across multiple customer installations. Compare the effort of applying a standardized safety change against the current process and refine the reuse structure with feedback from AutomVoj's senior PLC programmer and commissioning engineers. | A working incremental patching method and a traceability scheme that links reusable elements to the affected installations. | A safety-related change can be propagated to at least 10 codebases with fewer manual edits than the current baseline, and the method preserves the intended behavior on all tested variants in the lab or on representative controller hardware. |
| Year 3 | Generalize the method to a broader subset of the 38 codebases, harden the tooling for day-to-day use, and evaluate maintainability, patch effort, and engineer acceptance in an industrial setting at AutomVoj. | A validated industrial PhD prototype, a measured comparison to the current maintenance process, and guidance for phased adoption across the installed base. | The approach is demonstrated on at least 20 codebases or equivalent representative variants, and the measured patch effort is reduced from the current three-engineer/two-week baseline by at least 50% on the studied change scenario. |

### What each side brings
- **Company:** AutomVoj a.d. brings the concrete industrial problem, access to its 38 active ladder-logic codebases, the knowledge of how those systems differ across customer installations, and in-house validation capacity at its Zrenjanin site. The company also brings practical constraints: a live commissioning environment, Siemens S7-1500 and S7-300 PLC platforms, TIA Portal ladder-logic programs, and engineers who understand which changes are safety-critical and which are acceptable refactorings.
- **Faculty:** Veljko Pantelić brings expertise in IEC 61131-3 Structured Text, model-driven engineering, software product lines, model transformations, and code generation, together with access to the Faculty of Technical Sciences' PLC laboratory and its EMF, Xtext, and Sirius toolchain. His prior work gives the methodological basis for metamodeling, variability modeling, incremental generation, and conformance checking in industrial automation software.

### Why this pair
This pair is a strong fit because AutomVoj's problem is specifically about repeated PLC maintenance across many diverged customer codebases, while Veljko Pantelić's research focuses on PLC software product lines, variability management, and code generation. The company has a real installed base with 38 codebases and a quantified maintenance pain point; the researcher has the modeling and transformation skills needed to turn that pain point into an incremental reuse method that can survive daily industrial work.

### What is new
The proposal extends Veljko Pantelić's closest prior work, especially SYN-PUB-10374 on variability modelling in PLC software families, SYN-PUB-02958 on incremental model-to-text generation, and SYN-PUB-10379 on extracting feature models from legacy PLC codebases. What is new here is the industrially grounded focus on ladder-logic codebases in TIA Portal at AutomVoj, the explicit target of patching 38 live installations, and an incremental maintenance workflow that starts from existing customer-specific programs rather than from a clean product-line architecture. The novelty is not just variability modeling, but a maintainable migration path for safety patches in a real installed base.

### Data: what exists and what to collect
The records state that AutomVoj already has 38 active PLC codebases in TIA Portal written in ladder logic, plus an in-house testing floor and controller platforms based on Siemens S7-1500 and S7-300. They also state that one senior PLC programmer, Dragan Ilić, understands the full picture. No dataset says that detailed source exports, defect logs, or historical change traces are already collected in a research-ready form, so those would need to be assembled from the active codebases, version histories where they exist, and engineer interviews before the method can be evaluated rigorously.

### First step
Next month, agree on one representative conveyor line family, obtain the corresponding PLC project files and change history where available, and run a joint scoping workshop with AutomVoj's chief engineer, Dragan Ilić, and the faculty researcher to identify the first recurring safety-change scenario to prototype.

### Still to agree
The parties still need to agree on funding for the doctoral candidate and the split of the candidate's time between research and company work, since the company record says technical development is currently handled informally by the chief engineer and two senior automation engineers. They also need to agree on background IP and ownership of any new transformation tool, library structure, or generated artifacts; publication rules and any publication delay for company-sensitive results; and the exact scope and schedule of data access, including which of the 38 codebases can be shared and under what confidentiality terms. If the work requires more company engineering time than the current informal allocation, that additional time also has to be agreed explicitly.

### Claims and sources
- supported (p=1): Veljko Pantelić is an Assistant Professor in the Department of Computing and Control Engineering at the Faculty of Technical Sciences. [R0995]
- supported (p=1): Pantelić's fields include Software Engineering, Industrial Automation, Model-Driven Engineering, Programming Languages and Compilers. [R0995]
- supported (p=1): Pantelić's record shows expertise in IEC 61131-3 Structured Text, model-driven engineering, software product lines, domain-specific languages, code generation, PLC programming, metamodeling, feature models, model transformation, and Structured Text. [R0995, SYN-PUB-10372, SYN-PUB-10373, SYN-PUB-10374, SYN-PUB-10375, SYN-PUB-10376, SYN-PUB-10377, SYN-PUB-02958, SYN-PUB-10378, SYN-PUB-10379, SYN-PUB-10380, SYN-PRJ-0390, SYN-PRJ-0391]
- supported (p=1): Pantelić's group uses Eclipse Modeling Framework, Xtext, Sirius, and a small PLC laboratory equipped with several Wago and Beckhoff controllers. [R0995]
- supported (p=1): AutomVoj a.d. is a robotics and industrial automation company based in Zrenjanin. [C003]
- supported (p=1): AutomVoj a.d. has 212 employees and was founded in 1983. [C003]
- supported (p=1): AutomVoj a.d. builds conveyor and sorting automation systems and its core business is PLC-based conveyor lines and automated sorting equipment for food and beverage producers. [C003]
- supported (p=1): AutomVoj a.d. works with Siemens S7-1500 and S7-300 PLC platforms, Ladder logic and structured text in TIA Portal, Siemens SINAMICS and SEW-EURODRIVE servo and frequency drive systems, EPLAN Electric P8, Profibus and Profinet, Siemens WinCC and Weintek panels, and AutoCAD Mechanical. [C003]
- supported (p=1): AutomVoj a.d. has 38 active PLC codebases in TIA Portal written in ladder logic. [C003-CH2]
- supported (p=0.94): A safety-related patch at AutomVoj a.d. currently takes three engineers two full weeks. [C003-CH2]
- supported (p=1): AutomVoj a.d. has one senior PLC programmer, Dragan Ilić, who understands the full picture. [C003-CH2]
- supported (p=1): AutomVoj a.d. has no dedicated R&D department; technical development happens informally through project work led by the chief engineer and two senior automation engineers. [C003]
- supported (p=1): AutomVoj a.d. has an in-house testing floor and all fabrication, assembly, and testing are under one roof at the Zrenjanin site. [C003]
- supported (p=1): AutomVoj a.d. has long-term supply relationships with component makers in Germany and Italy and carries enough spares stock to respond within 48 hours on any system it has installed. [C003]
- supported (p=1): AutomVoj a.d. completed a one-year joint development project with the Faculty of Technical Sciences in 2019 on drive energy monitoring. [C003]
- supported (p=0.99): Pantelić's closest prior work for this proposal includes SYN-PUB-10374 on variability modelling in PLC software families, SYN-PUB-02958 on incremental model-to-text generation, and SYN-PUB-10379 on extracting feature models from legacy PLC codebases. [SYN-PUB-10374, SYN-PUB-02958, SYN-PUB-10379]
- supported (p=0.91): The proposal focuses on patching 38 live installations and an incremental maintenance workflow starting from existing customer-specific programs. [C003-CH2, SYN-PUB-10374, SYN-PUB-02958, SYN-PUB-10379]
