# Proposals (live run)

## Industrial PhD on modular PLC standardization for AutomVoj’s 38 TIA Portal codebases

**Pair:** Veljko Pantelić (R0995, Department of Computing and Control Engineering) with AutomVoj a.d. (C003), challenge C003-CH2
**Form:** Industrial PhD, from the researcher's consent: "industrial PhD supervision"
**Critic:** approved after 1 draft(s). Screening score 2.96 / 3.

### The problem
AutomVoj a.d. needs a practical way to reduce the maintenance burden of 38 divergent PLC codebases and to apply safety patches across them without rewriting everything at once. Today, a safety-related patch can take three engineers two full weeks, and two sites still required special handling the last time this was done. The goal is to develop a maintainable modular reuse and migration approach for Siemens S7 / TIA Portal ladder logic that fits daily project load and can be sustained by the wider engineering team, not only by Dragan Ilić.

### Research questions
1. Can a modular library and code-structure pattern be defined that covers the common control logic in AutomVoj’s 38 PLC codebases while remaining compatible with TIA Portal ladder logic?
2. Can a staged migration approach reduce the effort of rolling out a safety patch across the installed base below the current three engineers for two full weeks, without requiring a full rewrite?
3. Can the resulting process and tooling be transferred to AutomVoj’s own Siemens S7 / TIA Portal platform and understood by more than one senior engineer?

### Plan
| Period | Owner | Work | Result | Pass if |
| --- | --- | --- | --- | --- |
| Year 1 | doctoral candidate | Map the 38 active codebases, measure current patch effort and divergence, define a reusable PLC module architecture, and build the first prototype library and migration rules in the university toolchain. | A documented baseline, a first reusable module set, and a prototype migration pipeline for selected common functions. | At least 10 representative codebases are classified by common function blocks and patch patterns, and a prototype can regenerate or adapt one selected safety-relevant change for at least 3 codebases in a controlled setting. |
| Year 2 | doctoral candidate | Extend the library and migration rules to a larger subset of the installed base, validate transfer to Siemens TIA Portal, and test maintainability with AutomVoj engineers on non-live examples. | A transfer-checked reuse approach that works on AutomVoj’s platform and can be explained and used by more than one engineer. | The approach is demonstrated on at least 15 codebases, and at least 2 AutomVoj engineers other than Dragan Ilić can apply the documented patch workflow on a training case without researcher help. |
| Year 3 | faculty supervisor | Consolidate the method, evaluate effort reduction and robustness, refine documentation, and prepare doctoral outputs and company-facing guidelines for future patching and reuse. | A validated industrial PhD contribution with a practical process for long-term maintenance of the PLC portfolio. | The final method shows a measurable reduction versus the baseline patch process, and the company accepts a documented workflow for future safety patches and code reuse. |

### What each side brings
- **Company:** AutomVoj brings the industrial problem, the 38 active ladder-logic PLC codebases, access to its in-house testing floor and engineering know-how, Siemens S7 / TIA Portal as the target environment, and practical feedback from engineers who have already performed the two-week safety patch process.
- **Faculty:** The faculty brings Veljko Pantelić’s expertise in IEC 61131-3, model-driven engineering, product-line variability, code generation, benchmarking, and a small PLC laboratory with Wago and Beckhoff controllers for method prototyping and controlled validation.

### Why this pair
This pair matches the problem tightly: AutomVoj’s need is to reduce divergence across many PLC codebases, and Veljko Pantelić has published repeatedly on PLC metamodeling, variability, incremental code generation, and product-line engineering for IEC 61131-3 systems. The company has a concrete Siemens/TIA Portal setting and a real maintenance bottleneck; the researcher has the methods to structure, measure, and automate reuse without proposing a full rewrite.

### What is new
The closest prior work is SYN-PUB-02958 on incremental model-to-text generation for PLC software and SYN-PUB-10379 on extracting feature models from legacy PLC codebases. This proposal goes beyond both by targeting an industrial migration path for a live portfolio of 38 Siemens TIA Portal ladder-logic codebases, with a safety-patch workflow that is explicitly checked on AutomVoj’s platform before being claimed as transferable. It also extends the researcher’s prior product-line focus from metamodels and legacy extraction to an applied, company-specific standardization and maintenance process.

### Data: what exists and what to collect
The records state that AutomVoj has 38 active PLC codebases, all written in ladder logic in TIA Portal, and that the last safety patch took three engineers two full weeks and still found two sites where the standard fix did not apply cleanly. The records do not state that structured annotations, version history, or explicit module boundaries already exist, so the first period must collect and classify the codebase variants, patch patterns, and maintainability baseline. The university side already has a small PLC lab with Wago and Beckhoff controllers, but this is not the company platform and must only be used for prototyping and transfer checks, not as a substitute for Siemens TIA Portal validation.

### Baseline: what the targets are compared against
The company’s current baseline is the manual process described in C003-CH2: one safety patch across the portfolio takes three engineers two full weeks, and the standard fix may fail to apply cleanly at some sites. No better quantitative figure is given in the records, so the first period must measure patch effort, divergence types, and the fraction of codebases covered by the current template-based approach.

### The company's time limit
none stated

### Risks and when to stop
- **The 38 codebases may be too heterogeneous for one reusable structure to cover all safety-relevant logic.** Stop if: If, after classifying the portfolio in Year 1, fewer than a meaningful subset such as 10 codebases share enough structure to support a common module set, the work should be narrowed to that subset only.
- **Transfer from the university prototype environment to AutomVoj’s Siemens TIA Portal workflow may fail.** Stop if: If the migration rules cannot be demonstrated on AutomVoj’s own platform for at least 3 representative codebases by the end of Year 1, the project should stop claiming platform transfer and be rescoped as a design study.
- **AutomVoj staff time may be too limited because technical development happens informally and key people are tied to live projects.** Stop if: If Dragan Ilić or other core engineers cannot provide regular review and validation time in the first year, the project should be reduced to an offline analysis and tooling prototype only.
- **The new approach may not beat the current patch effort enough to justify adoption.** Stop if: If the evaluated workflow does not reduce patch effort below the current three engineers for two full weeks on a representative change, the work should be reframed as documentation and partial reuse support rather than full migration.

### First step
In the next month, run a joint scoping workshop with Dragan Ilić and the project team to inventory the 38 codebases, select 3 to 5 representative installations, define the current patch workflow, and agree on the first measurable baseline.

### Still to agree
The parties still need to agree on funding for the doctoral candidate and the share of staff time from AutomVoj, access to source code and internal documentation, publication delay and approval of confidential material, ownership of new results and background IP, and the exact safety-review procedure before anything is transferred to a live installation.

### Claims and sources
- supported (p=1): Veljko Pantelić is an Assistant Professor in the Faculty of Technical Sciences, Department of Computing and Control Engineering. [R0995]
- supported (p=1): His fields include Software Engineering, Industrial Automation, Model-Driven Engineering, and Programming Languages and Compilers. [R0995]
- supported (p=1): His keywords include IEC 61131-3, model-driven engineering, software product lines, domain-specific languages, code generation, PLC programming, metamodeling, feature models, model transformation, Structured Text. [R0995]
- supported (p=1): He received his Ph.D. from the Faculty of Technical Sciences in 2019, and his doctoral work focused on metamodel-driven code generation pipelines targeting IEC 61131-3 Structured Text for programmable logic controllers. [R0995]
- supported (p=1): Since 2020 he has held an Assistant Professor position in the Department of Computing and Control Engineering. [R0995]
- supported (p=1): His research group uses Eclipse Modeling Framework, Xtext, Sirius, and a small PLC laboratory equipped with several Wago and Beckhoff controllers for validation experiments. [R0995]
- supported (p=1): AutomVoj a.d. is a robotics and industrial automation company based in Zrenjanin. [C003]
- supported (p=1): AutomVoj a.d. has 212 employees and was founded in 1983. [C003]
- supported (p=1): AutomVoj builds conveyor and sorting automation systems and focuses on PLC-based conveyor lines and automated sorting equipment for food and beverage producers. [C003]
- supported (p=1): AutomVoj’s technology stack includes Siemens S7-1500 and S7-300 PLC platforms and ladder logic programming in TIA Portal. [C003]
- supported (p=1): AutomVoj has no dedicated R&D department; technical development happens informally through project work led by the chief engineer and two senior automation engineers. [C003]
- supported (p=1): AutomVoj has 38 active PLC codebases written in ladder logic in TIA Portal. [C003-CH2]
- supported (p=1): A safety-related patch across those codebases last took three engineers two full weeks, and two sites had logic different enough that the standard fix did not apply cleanly. [C003-CH2]
- supported (p=1): AutomVoj needs a practical approach that does not require rewriting everything at once and that its team can maintain going forward. [C003-CH2]
- supported (p=1): The company challenge includes a need to reduce the maintenance burden of 38 divergent PLC codebases by introducing modular, reusable code structures. [C003-CH2]
- supported (p=1): The company challenge includes a need to create a practical migration approach for safety patches across existing installations. [C003-CH2]
- supported (p=1): The company challenge includes a need to establish a maintainable software engineering process or tooling for PLC standardization that can survive daily project load and limited R&D capacity. [C003-CH2]
- supported (p=0.96): The company challenge includes a need to reduce dependency on one senior PLC programmer by making the codebase understandable and supportable by the broader engineering team. [C003-CH2]
- supported (p=1): SYN-PUB-02958 is Incremental Model-to-Text Generation for PLC Software: Handling Configuration Changes Without Full Regeneration. [SYN-PUB-02958]
- supported (p=1): SYN-PUB-10379 is Towards Round-Trip Engineering for IEC 61131-3: Extracting Feature Models from Legacy PLC Codebases. [SYN-PUB-10379]
- supported (p=1): SYN-PUB-10372 is A Metamodel for IEC 61131-3 Structured Text: Design Rationale and Conformance Checking. [SYN-PUB-10372]
- supported (p=1): SYN-PUB-10374 is Variability Modelling in PLC Software Families Using Feature Models and Configuration Constraints. [SYN-PUB-10374]
- supported (p=1): SYN-PUB-10380 is A Benchmark Suite for PLC Code Generators: Construction, Metrics, and Baseline Results. [SYN-PUB-10380]

## Industrial PhD on contract-driven integration test generation for multi-supplier AUTOSAR CAN stacks at DriveLogic Vojvodina d.o.o.

**Pair:** Martina Lačoková (R0919, Department of Computing and Control Engineering) with DriveLogic Vojvodina d.o.o. (C018), challenge C018-CH2
**Form:** Industrial PhD, from the researcher's consent: "industrial PhD supervision for candidates from embedded systems companies"
**Critic:** approved after 1 draft(s). Screening score 2.99 / 3.

### The problem
DriveLogic Vojvodina d.o.o. reports that its LDRA reports consistently show 87–89% branch coverage before shipping, yet in the last four delivered projects, three later had CAN communication faults found during customer integration testing. The faults were at boundaries between components from different suppliers, and the company currently has no systematic way to generate tests that target the assumptions each component makes about the other. The industrial PhD will develop and validate a method and tooling chain that reads ARXML descriptions, COM configuration, and the CANoe environment and generates interface-contract-focused integration tests for AUTOSAR Classic CAN stacks.

### Research questions
1. Can interface contracts be derived from ARXML and COM configuration well enough to generate integration tests that expose multi-supplier CAN boundary faults earlier than current practice?
2. Do contract-targeted tests improve fault detection against DriveLogic Vojvodina d.o.o.'s current 87–89% branch-coverage-based baseline on real projects?
3. Can the generated tests be transferred into DriveLogic Vojvodina d.o.o.'s existing Vector/CANoe-based toolchain without unacceptable manual adaptation effort?

### Plan
| Period | Owner | Work | Result | Pass if |
| --- | --- | --- | --- | --- |
| Year 1 | doctoral candidate | Study two to three recent DriveLogic Vojvodina d.o.o. projects, define the current baseline measurement process if not already quantified for fault discovery, and build a first prototype that extracts candidate interface assumptions from ARXML and COM data. | A reproducible baseline description and a prototype generator for a small subset of CAN interface contracts. | At least one project is instrumented so that the current test baseline is measured explicitly, and the prototype generates a set of candidate tests for at least one multi-supplier interface with documented inputs and outputs. |
| Year 2 | doctoral candidate | Extend the prototype to generate contract-targeted combinatorial test suites for several interfaces, then compare them with the company’s existing manually written integration tests on historical or current projects. | A validated generation method with measurable comparison against current practice. | On at least two interfaces, the generated suite finds at least one boundary fault or achieves equal fault detection with no more than the same number of test cases as the company’s current suite, while remaining executable in CANoe with limited manual adaptation. |
| Year 3 | faculty supervisor | Harden the method, document transfer conditions, and verify that the approach fits the company’s process and toolchain for use in active projects, including any safety-related release gate if applicable. | A transferable method, thesis, and company-ready guidance package. | The final workflow is demonstrated on a DriveLogic Vojvodina d.o.o. project end-to-end, including export to the company toolchain and a documented comparison against the 87–89% branch-coverage baseline. |

### What each side brings
- **Company:** DriveLogic Vojvodina d.o.o. brings AUTOSAR-based embedded software projects, ARXML descriptions, COM configuration, the CANoe environment, and direct access to the team’s current integration-test process. The company states it can dedicate one senior engineer part-time, roughly 40% of their working week, to a collaborative activity tied to tools or methods used in active projects.
- **Faculty:** Martina Lačoková brings expertise in combinatorial interaction testing, interface contract specification, runtime monitoring, and compositional verification, plus a CAN/LIN bus laboratory with vector hardware interfaces and a small cluster for constraint-solving workloads.

### Why this pair
This pair is a strong fit because DriveLogic Vojvodina d.o.o. needs systematic contract-based test generation for AUTOSAR CAN interfaces, and Martina Lačoková’s research record directly covers constrained covering arrays, CAN interface contracts, runtime monitoring, and multi-supplier integration faults. The company works inside customer toolchains, and the researcher already works on methods that can be adapted to those toolchains.

### What is new
The closest published work is SYN-PUB-09744, which presents an interface contract specification framework for multi-supplier CAN node integration. This PhD would go beyond that by turning contract specification into an end-to-end, company-deployable generator that reads ARXML and COM data from a real AUTOSAR Classic workflow and produces executable integration tests for CANoe. It also extends the direction of SYN-PUB-09743 and SYN-PUB-09748 by moving from test generation and incremental maintenance in general toward contract-targeted test generation for a live industrial integration process at DriveLogic Vojvodina d.o.o. Another close anchor is SYN-PUB-09749, which studies cross-layer interaction faults; the new work would operationalize that fault understanding into a concrete generation-and-validation workflow.

### Data: what exists and what to collect
The records state that DriveLogic Vojvodina d.o.o. has full access to ARXML descriptions, COM configuration, and the CANoe environment for the projects in scope, and that its current reports show 87–89% branch coverage before shipping. The records also state that three of the last four delivered projects had customer-found CAN communication faults after delivery. What is not stated is a numeric fault-detection baseline for the current manual integration tests beyond those post-delivery fault cases, so measuring that baseline should be part of Year 1. Any additional historical test artifacts, fault logs, or project-specific datasets needed for validation are not stated in the record and would have to be collected if they are not already retained in the company projects.

### Baseline: what the targets are compared against
The comparison baseline is the company’s current practice: manually written integration tests based on the team’s reading of the interface specification, with LDRA branch coverage of 87–89% before shipping, and three post-delivery CAN communication faults in the last four delivered projects. Because the records do not give a numeric present-day fault-detection rate for the current manual tests, the first period should measure that explicitly.

### The company's time limit
none stated

### Risks and when to stop
- **The company may not be able to share enough historical project material, or access may be limited by customer confidentiality.** Stop if: If by the end of Year 1 the candidate cannot access at least one complete project’s ARXML, COM configuration, and relevant integration-test artifacts, the project should be rescoped to a smaller, anonymized case study.
- **Generated tests may transfer poorly into the company’s CANoe-based workflow and require too much manual adaptation.** Stop if: If after the first transfer check in Year 2 the generated suite needs more than one person-day per interface to run in CANoe, the work should stop as a thesis on offline generation only, or be narrowed to a specific interface pattern.
- **The method may not outperform the company’s current 87–89% branch-coverage-based process on real faults.** Stop if: If by the middle of Year 2 the generated tests do not detect any additional interface fault beyond the current baseline on at least one representative project, the research question should be narrowed to contract inference quality rather than fault detection superiority.
- **The senior engineer time available from the company may be insufficient for iterative validation on active projects.** Stop if: If the company cannot sustain roughly 40% of one senior engineer’s working week during the agreed collaboration phase, the validation plan should be reduced to one pilot project and extended timelines must be renegotiated.

### First step
Next month, agree on one pilot AUTOSAR project, collect its ARXML, COM configuration, and current integration-test artifacts, and define the exact baseline measurements for branch coverage and boundary-fault discovery.

### Still to agree
The parties still need to agree on funding for the doctoral candidate and any additional staff time, ownership of new results, treatment of background IP, publication review and delay rights, scope of data access and anonymization, and whether any safety-related changes require company safety review before execution on a live installation or project environment.

### Claims and sources
- supported (p=1): Martina Lačoková is a Senior Research Associate at the Faculty of Technical Sciences, Department of Computing and Control Engineering. [R0919]
- supported (p=1): Martina Lačoková’s fields include Software Engineering and Testing, Embedded and Real-Time Systems, Formal Methods and Verification, and Automotive and Industrial Control. [R0919]
- supported (p=1): Martina Lačoková’s expertise includes combinatorial interaction testing, interface contract specification, compositional verification, CAN bus, multi-supplier integration, runtime assertion monitoring, and covering arrays. [R0919]
- supported (p=1): Martina Lačoková has a Ph.D. from the Faculty of Technical Sciences, University of Novi Sad, awarded in 2014, with a thesis on combinatorial test generation for automotive communication middleware. [R0919]
- supported (p=1): Martina Lačoková’s group maintains a CAN/LIN bus laboratory with vector hardware interfaces and a small cluster for constraint-solving workloads. [R0919]
- supported (p=1): DriveLogic Vojvodina d.o.o. is an automotive and mobility software company with 27 employees, founded in 2004, based in Novi Sad. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. focuses entirely on AUTOSAR-based embedded software: configuration, integration, and V-cycle testing for powertrain, body and chassis ECUs. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. works directly inside the customer’s development environment, using the customer’s toolchains and process rules. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. uses AUTOSAR Classic (R4.x), Vector DaVinci Configurator, CAPL scripting, CANoe/CANalyzer, TRACE32, Jenkins, LDRA Testbed, gcov, Python scripting, and PC-lint Plus. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. can dedicate one senior engineer part-time, roughly 40% of their working week, to a collaborative development or research activity tied to tools or methods used in active projects. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. states that its LDRA reports consistently show 87–89% branch coverage before shipping. [C018-CH2]
- supported (p=1): DriveLogic Vojvodina d.o.o. states that in the last four delivered projects, three had CAN communication faults found during customer integration testing. [C018-CH2]
- supported (p=1): DriveLogic Vojvodina d.o.o. states that the faults were at boundaries between components from different suppliers. [C018-CH2]
- supported (p=1): DriveLogic Vojvodina d.o.o. states that it has full access to ARXML descriptions of all components in the project, the COM configuration, and the CANoe environment. [C018-CH2]
- supported (p=1): DriveLogic Vojvodina d.o.o. states that it would not start something that cost more than €40,000 in the first phase. [C018-CH2]
- supported (p=1): SYN-PUB-09744 is about interface contract specification for multi-supplier CAN node integration and provides a formal framework. [SYN-PUB-09744]
- supported (p=1): SYN-PUB-09743 is about generating minimum-size covering arrays for constrained parameter spaces in automotive middleware. [SYN-PUB-09743]
- supported (p=1): SYN-PUB-09748 is about incremental test suite maintenance for evolving CAN interface contracts. [SYN-PUB-09748]
- supported (p=1): SYN-PUB-09749 is about cross-layer interaction faults in multi-supplier embedded stacks and detection study. [SYN-PUB-09749]
- supported (p=1): SYN-PUB-02017 is about runtime assertion monitoring for CAN-based embedded systems using low-overhead instrumentation. [SYN-PUB-02017]
- supported (p=1): SYN-PUB-01450 is about compositional verification of embedded software stacks, including scalability limits and practical workarounds. [SYN-PUB-01450]

## Industrial PhD on plain-language, bilingual explanations for automated SME credit decisions at Kredo Fintech

**Pair:** Branislav Žarković (R0801, Department of Finance and Banking) with Kredo Fintech (C010), challenge C010-CH2
**Form:** Industrial PhD, from the researcher's consent: "industrial PhD supervision"
**Critic:** approved after 1 draft(s). Screening score 2.09 / 3.

### The problem
Kredo Fintech needs a compliant explanation format for every automated credit decision that can be generated at decision time, stored with the decision record, and shown in the borrower portal in Serbian and Macedonian. Its current gradient-boosted model performs well, but the existing technical summaries are not understandable to borrowers and are not yet satisfactory for compliance review. The company wants a solution that works reliably in production within about six months and supports expansion to North Macedonia.

### Research questions
1. Can a plain-language explanation template be generated automatically from Kredo Fintech’s current model outputs while preserving decision fidelity and borrower comprehensibility?
2. Does a bilingual explanation layer in Serbian and Macedonian meet the regulator-facing requirements at decision time and remain stable in production on Kredo Fintech’s platform?
3. Which explanation design gives the best trade-off between borrower understanding, compliance acceptance, and operational reliability compared with the current technical summary?

### Plan
| Period | Owner | Work | Result | Pass if |
| --- | --- | --- | --- | --- |
| Months 1 to 6 | doctoral candidate | Map the current scoring workflow, extract the existing SHAP-based and internal technical explanations, define the explanation schema, and build a prototype that renders borrower-facing explanations in Serbian and Macedonian at decision time. | A prototype explanation service integrated with the decision pipeline and portal, plus a test set of decisions with logged explanations in both languages. | At least 95% of sampled decisions receive an explanation automatically within the existing decision flow, and the explanation text is judged understandable by Kredo Fintech’s compliance officer, Dragana Vukić, on a predefined review checklist; if that cannot be achieved, the work is rescoping-only and not yet a production claim. |
| Months 7 to 12 | company data team | Run the prototype on a controlled batch of live or shadow decisions, log failures, latency, and explanation edits, and compare the new format with the current internal summary. | A measured comparison of reliability, timing, and compliance review outcomes against the current explanation practice. | The new format matches the existing decision record for all tested cases, adds no material delay to decisioning, and reduces compliance rework versus the current technical summary. |
| Year 2 | doctoral candidate | Refine the explanation generation rules, test robustness across borrower segments and edge cases, and evaluate whether the wording remains faithful when model inputs change or are sparse. | A validated explanation design with documented behavior under common edge cases and a clear governance procedure for updates. | The system remains stable across the predefined test suite, with no unexplained explanation failures in the validation batch and with documented handling rules for missing or sparse features. |
| Year 3 | faculty supervisor | Document the method, generalize the findings into publishable research on explainable credit decisions for thin-file SME lending, and support thesis completion and dissemination. | Completed industrial PhD dissertation and at least one publishable research output grounded in the Kredo Fintech case. | The dissertation is defended with a method that can be audited against the company deployment and the research questions are answered with evidence from the project. |

### What each side brings
- **Company:** Kredo Fintech brings its production lending platform, the current gradient-boosted scoring workflow, its SHAP-based internal summaries, the borrower portal, and access to the company’s data team of five. It also brings the specific regulatory and product constraints: automated decisions must be explained in plain language, the explanation must be stored with the decision record, and the output must work in Serbian and Macedonian.
- **Faculty:** Branislav Žarković brings expertise in credit scoring for thin-file borrowers and micro-enterprises, explainable AI in credit risk, alternative data, open banking, and regulatory compliance in credit governance, supported by his published work on scoring micro-enterprises, explaining credit decisions, alternative data, regulatory capital implications, explainability requirements, and interpretability metrics. He also brings supervisory and lending experience from being head of risk at a regional bank from 2005 to 2012.

### Why this pair
This pair matches a live production need at a regulated fintech with a researcher whose recent work directly covers explainable credit decisions, thin-file SME scoring, and regulatory expectations. Kredo Fintech already uses a model-based workflow and SHAP-style diagnostics, so the research can move beyond theory into a deployable explanation layer. The company’s six-month production pressure and the researcher’s domain and governance background make the collaboration unusually well aligned.

### What is new
The closest prior work is SYN-PUB-08747, which addresses explaining credit decisions to supervisors, and SYN-PUB-08751, which studies explainability requirements under the EU AI Act. This project is new because it focuses on borrower-facing, plain-language explanations generated at decision time inside a live fintech workflow, with bilingual delivery in Serbian and Macedonian and with deployment constraints from a regulated Serbian lender. It also extends the researcher’s prior work on thin-file and alternative-data scoring (SYN-PUB-08746, SYN-PUB-08748, SYN-PUB-08753) from model design to production explanation governance.

### Data: what exists and what to collect
The records state that Kredo Fintech uses transaction data, tax filings, and sector benchmarks in underwriting, and that it already generates SHAP-based internal summaries for decisions. The records do not state that a borrower-facing explanation dataset already exists. For this project, explanation logs, timing logs, and compliance review outcomes would need to be collected during prototype and pilot use; if Macedonian portal text is not already stored, those translations would also need to be created and tested.

### Baseline: what the targets are compared against
Today, Kredo Fintech has a gradient-boosted ensemble that performs well, but its explanation output is a technical internal summary that most borrowers find confusing. The company says that its default rate sits comfortably below the Serbian banking sector average for SME portfolios, but no exact figure is given in the records, so the explanation baseline is qualitative rather than numerical. Measuring the current explanation process, its latency, and its review burden should therefore be part of the first period.

### The company's time limit
within about six months

### Risks and when to stop
- **The new explanation text may not satisfy Kredo Fintech’s compliance officer or the National Bank of Serbia’s expectation of a plain-language explanation.** Stop if: If the prototype cannot produce a reviewer-approved explanation for the test batch by the end of Months 1 to 6, stop production integration and rescope to a narrower explanation template.
- **Bilingual delivery in Serbian and Macedonian may introduce translation errors or inconsistencies between the decision, the stored record, and the portal display.** Stop if: If the same decision cannot be rendered identically in structure and meaning in both languages in the validation set, stop the bilingual rollout and keep only Serbian until the wording is fixed.
- **The explanation layer may add operational latency or break the existing decision pipeline.** Stop if: If adding the explanation service causes unacceptable delays or repeated pipeline failures in pilot testing, stop deployment and redesign the architecture before any production use.
- **The final explanation method may not improve upon the current internal summary in a way that matters for compliance or operations.** Stop if: If the pilot shows no reduction in compliance rework or no improvement in borrower comprehension versus the current summary, stop scaling and keep the current process while narrowing the research question.

### First step
In the next month, the doctoral candidate and Kredo Fintech’s data team should document the current decision flow, sample the existing SHAP-based explanations, and define a short compliance checklist with Dragana Vukić for what counts as a plain-language borrower explanation.

### Still to agree
The partners still need to agree the industrial PhD funding arrangement, who pays the doctoral candidate’s time and any company-side staff time, the IP terms for new code and research outputs, background IP treatment, publication review delay, and the exact data access rules for decision logs, borrower portal text, and any translation resources. Because the company deadline is about six months, the first-period scope should be locked quickly.

### Claims and sources
- supported (p=1): Branislav Žarković is a Full Professor at the Faculty of Economics in Subotica, University of Novi Sad, in the Department of Finance and Banking. [R0801]
- supported (p=1): Branislav Žarković’s fields are credit risk and SME finance. [R0801]
- supported (p=1): Branislav Žarković’s keywords include credit scoring, thin-file borrowers, explainable models, alternative data, and regulation. [R0801]
- supported (p=1): Branislav Žarković leads research on credit risk and SME finance at the Faculty of Economics in Subotica, University of Novi Sad. [R0801]
- supported (p=1): Branislav Žarković served as head of risk at a regional bank from 2005 to 2012. [R0801]
- supported (p=1): Branislav Žarković has published on scoring micro-enterprises with little credit history. [SYN-PUB-08746]
- supported (p=1): Branislav Žarković has published on explaining credit decisions to supervisors: a case study. [SYN-PUB-08747]
- supported (p=1): Branislav Žarković has published on alternative data in consumer credit scoring: evidence from a Serbian fintech lender. [SYN-PUB-08748]
- supported (p=1): Branislav Žarković has published on regulatory capital implications of machine learning credit models: a stress-testing perspective. [SYN-PUB-08749]
- supported (p=1): Branislav Žarković has published on credit access barriers for women-owned SMEs in the Western Balkans. [SYN-PUB-08750]
- supported (p=1): Branislav Žarković has published on explainability requirements under the EU AI Act: implications for credit scoring vendors. [SYN-PUB-08751]
- supported (p=1): Branislav Žarković has published on incorporating cash-flow volatility into SME credit scoring: a machine learning approach. [SYN-PUB-08752]
- supported (p=1): Branislav Žarković has published on open banking data for thin-file borrower assessment: opportunities and regulatory constraints. [SYN-PUB-08753]
- supported (p=1): Branislav Žarković has published on benchmarking scorecard interpretability metrics in credit risk practice. [SYN-PUB-08754]
- supported (p=1): Kredo Fintech has 26 employees. [C010]
- supported (p=1): Kredo Fintech was founded in 2020. [C010]
- supported (p=1): Kredo Fintech is based in NTP Novi Sad. [C010]
- supported (p=1): Kredo Fintech provides online lending for firms with one to nine employees. [C010]
- supported (p=1): Kredo Fintech lends between 500 and 50,000 euros. [C010]
- supported (p=1): Kredo Fintech funded over 1,400 loans since launch. [C010]
- supported (p=1): Kredo Fintech’s default rate sits comfortably below the Serbian banking sector average for SME portfolios. [C010]
- supported (p=1): Kredo Fintech’s data team has five people. [C010]
- supported (p=1): Kredo Fintech is regulated by the National Bank of Serbia. [C010]
- supported (p=1): Kredo Fintech uses transaction data, tax filings, and sector benchmarks in underwriting. [C010]
- supported (p=1): Kredo Fintech’s current main scoring model is a gradient-boosted ensemble. [C010-CH2]
- supported (p=0.99): Kredo Fintech currently uses SHAP values to identify which features drove a particular decision. [C010-CH2]
- supported (p=1): Kredo Fintech generates a short internal summary for credit decisions, but it is written in technical language that most borrowers find confusing. [C010-CH2]
- supported (p=1): Kredo Fintech’s compliance officer, Dragana Vukić, is not satisfied that the current explanation meets the spirit of the regulator’s guidance. [C010-CH2]
- supported (p=1): Kredo Fintech has a hard requirement to have a compliant explanation format in place before it expands to North Macedonia. [C010-CH2]
- supported (p=1): Kredo Fintech needs the explanation to be generated automatically at decision time, stored alongside the decision record, and rendered in the borrower portal in Serbian and Macedonian. [C010-CH2]
- supported (p=1): Kredo Fintech wants a result that works reliably in production within about six months. [C010-CH2]
