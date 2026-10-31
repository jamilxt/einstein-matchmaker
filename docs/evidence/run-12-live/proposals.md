# Proposals (live run)

## Industrial PhD on plain-language, decision-time explanations for Kredo Fintech’s automated SME credit decisions

**Pair:** Branislav Žarković (R0801, Department of Finance and Banking) with Kredo Fintech (C010), challenge C010-CH2
**Form:** Industrial PhD, from the researcher's consent: "industrial PhD supervision"
**Critic:** approved after 2 draft(s). Screening score 2.09 / 3.

### The problem
Kredo Fintech needs a compliant explanation format for every automated credit decision that is generated at decision time, stored with the decision record, and shown in the borrower portal in Serbian and, for expansion, Macedonian. The current gradient-boosted ensemble performs well, but its outputs are hard to explain in plain terms, and the existing SHAP-based internal summary is too technical for borrowers and not satisfactory to compliance.

### Research questions
1. Which explanation template produces the highest borrower comprehension while still reflecting the main drivers of the model’s decision and allowing a challenge of the decision?
2. How well can a plain-language explanation be generated automatically at decision time from SHAP-based feature attributions, without reducing decision workflow reliability?
3. What translation and wording constraints are needed so the same explanation logic remains understandable and compliant in Serbian and Macedonian?

### Plan
| Period | Work | Result | Pass if |
| --- | --- | --- | --- |
| Months 1 to 6 | Map the current decision workflow and the existing SHAP summary; define a borrower-facing explanation schema; draft Serbian plain-language templates; and test them on historical decisions with internal compliance review. | A documented explanation specification, first Serbian template set, and pilot-ready evaluation protocol. | At least 90% of a reviewed sample of 100 historical decisions can be rendered into the new schema automatically, and the compliance review accepts the draft format for pilot testing. |
| Year 2 | Build and test the automatic explanation generator at decision time; compare alternative wording strategies for clarity, accuracy, and challengeability; add storage of the explanation alongside the decision record; and prepare Macedonian wording rules with a transfer check on Kredo’s own stack. | A production-ready Serbian explanation module with logged output, plus a verified Macedonian translation rule set for future rollout. | The module generates an explanation for 100% of test decisions within the decision-time workflow, stores it correctly in the decision record, and the same logic passes a transfer check on Kredo’s Python, Snowflake, PostgreSQL, and portal environment. |
| Year 3 | Run a controlled pilot in production on Kredo’s live decision flow after internal safety and compliance review; monitor borrower comprehension, complaint or challenge rate, and operational failure rate; refine wording and governance for expansion to North Macedonia. | Validated explanation process for production use in Serbia and an expansion-ready version for Macedonian deployment. | The pilot runs for at least 3 months with no unapproved live-use changes, explanation generation succeeds in at least 99% of automated decisions, and borrower understanding improves in a measured user test versus the current technical summary. |

### What each side brings
- **Company:** Kredo Fintech brings the live use case, its regulated automated lending process, the current gradient-boosted ensemble, existing SHAP-based internal summaries, the borrower portal, and the data team of five working with Python, dbt, Snowflake, Apache Airflow, scikit-learn, PostgreSQL, REST APIs, and Docker. The company also brings the stated production constraint that the explanation must work reliably within about six months and be suitable for Serbian and, later, Macedonian users.
- **Faculty:** Branislav Žarković brings expertise in credit scoring for thin-file borrowers and micro-enterprises, explainable and interpretable machine-learning models in credit risk, and regulatory and compliance implications of AI in credit scoring, supported by his work on scoring micro-enterprises, explaining credit decisions, open-banking-based lending, and explainability requirements under the EU AI Act.

### Why this pair
This pair combines Kredo Fintech’s regulated production lending system and decision-time implementation needs with Branislav Žarković’s research record on credit scoring, alternative data, explainability, and regulation. The fit is especially strong because the challenge is not to invent a new model, but to turn an already-performing model into a borrower-facing explanation process that is understandable and compliant in a live lending environment.

### What is new
The closest prior work is SYN-PUB-08747, where Branislav Žarković studied explaining credit decisions to supervisors, and SYN-PUB-08751 on explainability requirements under the EU AI Act. This project goes beyond those papers by focusing on a borrower-facing explanation that is generated automatically at decision time, stored with the decision record, and deployed in Kredo Fintech’s production workflow in Serbian and Macedonian. It also extends the earlier explainability work from supervisory framing to operational borrower comprehension and challengeability in a regulated fintech setting.

### Data: what exists and what to collect
Kredo Fintech states that it already has a live automated lending system, a current gradient-boosted ensemble, SHAP-based internal summaries, decision records, borrower portal infrastructure, and transaction data, tax filings, and sector benchmarks used in underwriting. The records do not state that historical explanations are already available in borrower-facing Serbian or Macedonian form, so those explanation examples would need to be collected or reconstructed from past decisions and internal logs. User comprehension data and any formal borrower challenge outcomes would also need to be collected during testing and pilot phases.

### The company's time limit
within about six months

### First step
Next month, the parties should run a joint workshop to map the current decision flow, review recent decisions and SHAP outputs, and agree on the first Serbian explanation template and compliance checklist.

### Still to agree
The parties still need to agree on funding for the doctoral candidate and supervision time, access to historical decision records and model logs, intellectual property in any new explanation templates and software, background IP boundaries, publication review and delay terms, and the exact data access and security procedure for using Kredo Fintech’s decision records and borrower-portal environment.

### Claims and sources
- supported (p=0.99): Branislav Žarković is a Full Professor in Finance and Banking at the Faculty of Economics in Subotica, University of Novi Sad, where he leads research on credit risk and SME finance. [R0801]
- supported (p=0.99): Branislav Žarković has expertise in credit scoring for thin-file borrowers and micro-enterprises, SME finance and credit access analysis, alternative data and open banking for lending decisions, explainable and interpretable machine-learning models in credit risk, and regulatory and compliance implications of AI in credit scoring. [SYN-PUB-08746, SYN-PUB-08747, SYN-PUB-08748, SYN-PUB-08749, SYN-PUB-08750, SYN-PUB-08751, SYN-PUB-08752, SYN-PUB-08753, SYN-PUB-08754]
- supported (p=1): Branislav Žarković is open to industrial PhD supervision and joint research projects with industry partners. [R0801]
- supported (p=1): Kredo Fintech is a fintech company with 26 employees, founded in 2020, based in NTP Novi Sad. [C010]
- supported (p=1): Kredo Fintech builds an online lending platform for firms with one to nine employees that need between 500 and 50,000 euros in days, not months. [C010]
- supported (p=1): Kredo Fintech pulls transaction data, tax filings, and sector benchmarks into underwriting, has funded over 1,400 loans since launch, and says its default rate sits below the Serbian banking sector average for SME portfolios. [C010]
- supported (p=1): Kredo Fintech’s team of 26 works out of the Science and Technology Park in Novi Sad, and its data team of five handles pipeline engineering and model monitoring. [C010]
- supported (p=1): Kredo Fintech is regulated by the National Bank of Serbia. [C010]
- supported (p=1): Kredo Fintech’s products include Kredo SME Loans, Kredo Flex Line, Kredo Score Report, and Kredo Portal. [C010]
- supported (p=1): Kredo Fintech’s technology stack includes Python, dbt, Snowflake, Apache Airflow, scikit-learn, PostgreSQL, REST APIs for Open Banking data ingestion, and Docker. [C010]
- supported (p=1): The challenge is that every automated credit decision must be accompanied by a plain-language explanation a borrower can understand and, if needed, challenge, but the current SHAP-based summary is too technical for borrowers and does not satisfy the compliance officer. [C010-CH2]
- supported (p=1): The explanation must be generated automatically at decision time, stored alongside the decision record, and rendered in the borrower portal in Serbian and, for expansion, Macedonian. [C010-CH2]
- supported (p=1): Kredo Fintech wants a solution that works reliably in production within about six months. [C010-CH2]
- supported (p=1): Branislav Žarković’s closest relevant published works include explaining credit decisions to supervisors, explainability requirements under the EU AI Act, scoring micro-enterprises with little credit history, alternative data in consumer credit scoring, and open banking data for thin-file borrower assessment. [SYN-PUB-08746, SYN-PUB-08747, SYN-PUB-08748, SYN-PUB-08751, SYN-PUB-08753]

## Industrial PhD on incremental product-line modernization for 38 TIA Portal ladder-logic PLC codebases at AutomVoj a.d.

**Pair:** Veljko Pantelić (R0995, Department of Computing and Control Engineering) with AutomVoj a.d. (C003), challenge C003-CH2
**Form:** Industrial PhD, from the researcher's consent: "industrial PhD supervision"
**Critic:** approved after 1 draft(s). Screening score 2.96 / 3.

### The problem
AutomVoj a.d. has 38 active PLC codebases in TIA Portal, each a customer-specific ladder-logic variant, and a safety-related patch currently takes three engineers two full weeks to adapt and test across the installed base. The concrete problem is to introduce a practical, maintainable reuse approach that can reduce cross-codebase patch effort without requiring a full rewrite of existing systems.

### Research questions
1. Can a feature-model-based variability representation be extracted from the 38 existing ladder-logic codebases with enough fidelity to capture the differences that matter for safety-related patches?
2. Can an incremental code-generation or synchronization workflow be built so that a safety patch can be propagated to all affected PLC variants without full regeneration and with traceable adaptation points?
3. Can the proposed approach be transferred to AutomVoj a.d.'s own Siemens TIA Portal and validated on real codebases so that the patching effort is reduced below the current three-engineer, two-week baseline?

### Plan
| Period | Work | Result | Pass if |
| --- | --- | --- | --- |
| Year 1 | Study the 38 active codebases and classify recurring variation points, then build an initial variability model and a first extraction/synchronization prototype for Siemens TIA Portal ladder logic. Run a transfer check on AutomVoj a.d.'s own PLC platform before claiming any result for company use. | A documented variability model for the initial codebase sample and a prototype that can reproduce selected existing ladder-logic differences in TIA Portal. | At least 10 representative codebases are analyzed, and the prototype can round-trip or regenerate at least 5 identified variation points without manual rework in the lab validation set. |
| Year 2 | Extend the prototype to incremental propagation of safety-related changes, define patch templates for recurring emergency-stop and related logic updates, and validate on a broader subset of the installed-base variants with Dragan Ilić's review of practical maintainability. | An incremental patching workflow that applies one defined safety change across multiple variants with traceable edits. | A safety patch is propagated to at least 20 codebases, and the average adaptation effort is reduced by at least 50 percent compared with the current three-engineer baseline on the same class of change. |
| Year 3 | Harden the method for routine use, document maintenance procedures, and evaluate the full workflow on AutomVoj a.d.'s 38 active codebases with an emphasis on preserving existing commissioning constraints and maintainability. | A deployable product-line modernization procedure for the installed base, including documentation, code templates, and evaluation results. | The workflow can support a safety-related update across all 38 active codebases with no live installation changes before AutomVoj a.d.'s own safety review approves them, and with all affected variants passing the agreed validation tests. |

### What each side brings
- **Company:** AutomVoj a.d. brings the concrete industrial problem, the 38 active TIA Portal ladder-logic codebases, its Siemens S7-1500 and S7-300 / TIA Portal environment, access to the in-house testing floor, and practical review by Dragan Ilić and the automation team.
- **Faculty:** The Faculty of Technical Sciences brings research supervision under Veljko Pantelić, model-driven engineering and PLC product-line expertise, and tooling experience with EMF, Xtext, Sirius, and PLC code generation and variability management.

### Why this pair
This pair matches a real industrial need in PLC modernization with a research program already centered on IEC 61131-3, variability management, and incremental generation. AutomVoj a.d. has the exact kind of legacy PLC landscape the research can address, while Veljko Pantelić has prior work on PLC metamodeling, product lines, and incremental generation that directly fits the problem.

### What is new
Compared with Veljko Pantelić's closest prior work, especially SYN-PUB-02958 on incremental model-to-text generation and SYN-PUB-10379 on extracting feature models from legacy PLC codebases, this project is new because it targets a live industrial base of 38 active ladder-logic codebases in Siemens TIA Portal and explicitly combines variability extraction with incremental safety-patch propagation and transfer to the company's own platform. It also goes beyond SYN-PRJ-0390 by focusing on legacy modernisation rather than only generation infrastructure, and beyond SYN-PUB-10377 by applying safety-aware product-line ideas to an operational retrofit workflow.

### Data: what exists and what to collect
The records state that AutomVoj a.d. currently has 38 active PLC codebases written in ladder logic in TIA Portal, and that the company has an in-house testing floor. The records do not state that any annotated training dataset, feature model, or extracted variability model already exists. The project would therefore need to collect and inspect representative codebases, change histories where available, and validation cases for recurring safety patches before a reusable model can be built.

### The company's time limit
none stated

### First step
In the next month, identify 10 representative PLC codebases from the 38 active systems, agree on one recurring safety-related change to study, and set up access to the relevant TIA Portal projects and test procedures for the first extraction exercise.

### Still to agree
Funding for the doctoral candidate and the allocation of staff time from AutomVoj a.d. and the Faculty of Technical Sciences; access to the 38 codebases and any related commissioning notes or change logs; background IP ownership for existing TIA Portal libraries and any newly created models, generators, or templates; publication review and delay terms; and the safety-review process before any result is tested on a live installation.

### Claims and sources
- supported (p=1): Veljko Pantelić is an Assistant Professor in the Department of Computing and Control Engineering at the Faculty of Technical Sciences. [R0995]
- supported (p=1): Veljko Pantelić's fields include Software Engineering, Industrial Automation, Model-Driven Engineering, Programming Languages and Compilers. [R0995]
- supported (p=1): Veljko Pantelić's keywords include IEC 61131-3, model-driven engineering, software product lines, domain-specific languages, code generation, PLC programming, metamodeling, feature models, model transformation, and Structured Text. [R0995]
- supported (p=1): Veljko Pantelić's group uses Eclipse Modeling Framework, Xtext, Sirius, and a small PLC laboratory equipped with several Wago and Beckhoff controllers for validation experiments. [R0995]
- supported (p=1): Veljko Pantelić's doctoral work focused on metamodel-driven code generation pipelines targeting IEC 61131-3 Structured Text for programmable logic controllers. [R0995]
- supported (p=1): SYN-PUB-10372 concerns a metamodel for IEC 61131-3 Structured Text with design rationale and conformance checking. [SYN-PUB-10372]
- supported (p=1): SYN-PUB-10373 concerns mapping UML Class Diagrams to IEC 61131-3 Function Blocks via ATL Transformations. [SYN-PUB-10373]
- supported (p=1): SYN-PUB-10374 concerns variability modelling in PLC software families using feature models and configuration constraints. [SYN-PUB-10374]
- supported (p=1): SYN-PUB-10375 concerns an Xtext grammar and IDE support for a subset of IEC 61131-3 Structured Text. [SYN-PUB-10375]
- supported (p=1): SYN-PUB-10376 concerns model-driven engineering for PLC software and a literature mapping study from 2005 to 2019. [SYN-PUB-10376]
- supported (p=1): SYN-PUB-10377 concerns integrating safety requirements into PLC product-line models using SysML parametric diagrams. [SYN-PUB-10377]
- supported (p=1): SYN-PUB-02958 concerns incremental model-to-text generation for PLC software and handling configuration changes without full regeneration. [SYN-PUB-02958]
- supported (p=1): SYN-PUB-10378 concerns DSL design for conveyor routing logic as a case study in abstraction level calibration. [SYN-PUB-10378]
- supported (p=1): SYN-PUB-10379 concerns round-trip engineering for IEC 61131-3 and extracting feature models from legacy PLC codebases. [SYN-PUB-10379]
- supported (p=1): SYN-PUB-10380 concerns a benchmark suite for PLC code generators, including construction, metrics, and baseline results. [SYN-PUB-10380]
- supported (p=1): SYN-PRJ-0390 concerns product-line code generation infrastructure for configurable PLC software. [SYN-PRJ-0390]
- supported (p=1): SYN-PRJ-0391 concerns safety-aware product-line modelling for certified automation software. [SYN-PRJ-0391]
- supported (p=1): C003 AutomVoj a.d. is a robotics and industrial automation company. [C003]
- supported (p=1): C003 AutomVoj a.d. has 212 employees. [C003]
- supported (p=1): C003 AutomVoj a.d. was founded in 1983. [C003]
- supported (p=1): C003 AutomVoj a.d. is based in Zrenjanin. [C003]
- supported (p=1): C003 AutomVoj a.d. builds conveyor and sorting automation systems from its base in Zrenjanin. [C003]
- supported (p=1): C003 AutomVoj a.d.'s core business is designing, manufacturing, and commissioning PLC-based conveyor lines and automated sorting equipment for food and beverage producers. [C003]
- supported (p=1): C003 AutomVoj a.d. works on chilled and ambient food production lines, fruit, vegetable, and packaged goods sorting and grading equipment, electrical control panels and drive cabinets, on-site commissioning, maintenance contracts, spare-parts supply, and system retrofits and capacity upgrades on legacy conveyor installations. [C003]
- supported (p=1): C003 AutomVoj a.d. uses Siemens S7-1500 and S7-300 PLC platforms, Ladder logic and structured text programming in TIA Portal, Siemens SINAMICS and SEW-EURODRIVE drive systems, EPLAN Electric P8, Profibus and Profinet, Siemens WinCC and Weintek panels, and AutoCAD Mechanical. [C003]
- supported (p=1): C003 AutomVoj a.d. has no dedicated R&D department and development happens informally through project work led by the chief engineer and two senior automation engineers. [C003]
- supported (p=1): C003-CH2 states that AutomVoj a.d. has 38 active PLC codebases in ladder logic written in TIA Portal. [C003-CH2]
- supported (p=1): C003-CH2 states that a safety-related patch currently takes three engineers two full weeks to adapt and test across the installed base. [C003-CH2]
- supported (p=1): C003-CH2 states that the company has to touch 38 separate codebases for such a patch and that two sites previously differed enough that the standard fix did not apply cleanly. [C003-CH2]
- supported (p=1): C003-CH2 states that the company has one senior PLC programmer, Dragan Ilić, who understands the full picture and also leads active commissioning projects. [C003-CH2]
- supported (p=1): C003-CH2 states that the company needs a practical approach that does not require rewriting everything at once and that the team can maintain going forward. [C003-CH2]

## Industrial PhD on contract-driven integration testing for multi-supplier CAN stacks at DriveLogic Vojvodina d.o.o.

**Pair:** Martina Lačoková (R0919, Department of Computing and Control Engineering) with DriveLogic Vojvodina d.o.o. (C018), challenge C018-CH2
**Form:** Industrial PhD, from the researcher's consent: "industrial PhD supervision for candidates from embedded systems companies"
**Critic:** approved after 1 draft(s). Screening score 2.99 / 3.

### The problem
DriveLogic Vojvodina d.o.o. reports 87% branch coverage but still sees CAN communication faults after delivery, especially at boundaries between components from different suppliers. The concrete problem is to turn ARXML descriptions, COM configuration, and the CANoe environment into systematic test scenarios that target interface assumptions between suppliers before shipping, while fitting DriveLogic’s current AUTOSAR Classic workflow and its first-phase budget cap of €40,000.

### Research questions
1. Can interface contracts inferred from ARXML and COM configuration predict which cross-supplier CAN interactions are most likely to fail in integration, and can that prediction be measured against delivered fault cases?
2. Can constrained combinatorial test generation produce interface-focused CAN test suites that find more boundary faults than the current manually written tests while staying within the same execution budget?
3. Can contract-derived tests be transferred into DriveLogic’s own CANoe-based process without losing relevance, and can the method be maintained incrementally as ARXML changes across projects?

### Plan
| Period | Work | Result | Pass if |
| --- | --- | --- | --- |
| Year 1 | Study DriveLogic’s ARXML, COM configuration, and CANoe-based test process on one current project or a representative project archive. Derive a contract model for cross-supplier CAN interactions, map it to the company’s interface assumptions, and build a first generator for interface-focused test scenarios. Run a transfer check on DriveLogic’s own CANoe environment before any result is claimed for the company workflow. | A prototype method that produces contract-targeted CAN test scenarios and a first set of measurable comparison results against existing manually written integration tests. | On at least one representative project, the prototype generates a test suite that covers all identified cross-supplier interface contracts and finds at least one interaction fault or fault-relevant discrepancy that is not covered by the current branch-coverage-oriented test set. |
| Year 2 | Extend the prototype to handle changing ARXML and COM configurations across project revisions, and add incremental maintenance so that existing contract tests are updated rather than rewritten. Evaluate the method on historical DriveLogic integration defects and on at least one new project cycle, using the company’s own toolchain and review process. | An incremental, company-compatible contract-testing workflow with documented maintenance effort and defect-detection results. | For at least two project variants, the maintained test suite changes by no more than the contract-relevant subset of test cases, while still detecting the known boundary-type fault pattern reported by DriveLogic in at least two of the four delivered projects. |
| Year 3 | Consolidate the method into a dissertation-level framework, refine acceptance criteria for when contract-derived tests are sufficient, and package guidance for adoption in DriveLogic’s regular V-cycle testing. If safety-related changes are involved, no live installation is used until DriveLogic’s own safety review approves it. | A validated industrial PhD outcome: a reusable workflow, evaluation across multiple projects, and thesis material grounded in DriveLogic’s toolchain and constraints. | DriveLogic can apply the workflow on a new AUTOSAR integration task with no more than one senior engineer part-time support, and the method demonstrates a repeatable reduction in late-found CAN interaction faults relative to the company’s current ad hoc test selection. |

### What each side brings
- **Company:** DriveLogic Vojvodina d.o.o. brings its Novi Sad-based AUTOSAR Classic integration setting, access to ARXML descriptions, COM configuration, and CANoe environment, plus practical integration cases from powertrain, body, or chassis ECU projects. The company can dedicate one senior engineer part-time, roughly 40% of that person’s working week, to a collaborative activity tied to active projects. The company also brings its established V-cycle testing practice, LDRA-based branch coverage reports, and the concrete problem of three late-found CAN faults in the last four delivered projects.
- **Faculty:** Martina Lačoková and the Faculty of Technical Sciences bring expertise in combinatorial interaction testing, constrained covering arrays, interface contract specification, compositional verification, runtime monitoring, and CAN/CAN FD integration testing. The group also brings a CAN/LIN bus laboratory with vector hardware interfaces and a small cluster for constraint-solving workloads, which can support method development and analysis before transfer to DriveLogic’s own platform.

### Why this pair
This pair matches a company problem about cross-supplier CAN boundary faults with a researcher whose published work directly addresses combinatorial test generation, interface contracts, incremental test maintenance, and runtime monitoring for embedded and automotive networks. DriveLogic’s AUTOSAR-only focus, its use of CANoe and ARXML, and its need for a method that targets assumptions between suppliers align closely with Martina Lačoková’s embedded-systems testing profile and prior industrially oriented work.

### What is new
Compared with Martina Lačoková’s closest published work, this proposal goes beyond SYN-PUB-09743 by moving from generating minimum-size covering arrays in constrained parameter spaces to generating contract-targeted tests from real DriveLogic ARXML and COM inputs. It goes beyond SYN-PUB-09744 and SYN-PUB-03011 by focusing on a full industrial transfer to the company’s own CANoe workflow for cross-supplier integration faults, not only formal specification or automated contract derivation. It also extends SYN-PUB-09748 by making incremental maintenance a central deliverable for changing project configurations, and it builds on SYN-PUB-09749 by turning the taxonomy of cross-layer faults into a repeatable detection workflow for a specific company setting. The novelty is therefore in the end-to-end industrialisation: reading the company’s descriptions, deriving interface contracts, generating tests aimed at the assumptions between suppliers, and validating transfer in DriveLogic’s environment.

### Data: what exists and what to collect
DriveLogic states that it has full access to the ARXML descriptions of all components in the project, the COM configuration, and the CANoe environment. It also has LDRA coverage reports showing 87% branch coverage before shipment and has observed three CAN communication faults in the last four delivered projects. What still has to be collected for the research is a structured record of the actual interface assumptions, the relevant historical fault cases, and the mapping from each fault to the contract condition that failed, together with any additional project revisions needed for validation. The company does not state that historical fault logs are already curated in research-ready form, so that curation would need to be collected as part of the project.

### The company's time limit
none stated

### First step
In the next month, select one representative DriveLogic AUTOSAR integration project, extract its ARXML and COM inputs, and define the first contract vocabulary with the company’s senior engineer so the prototype can be checked against DriveLogic’s own CANoe process.

### Still to agree
Funding for the industrial PhD candidate and the division of salary or scholarship costs; the exact amount of DriveLogic staff time beyond the stated 40% of one senior engineer; access rules for ARXML, COM, CANoe, and any historical defect records; background IP ownership for existing company toolchains and university methods; ownership and licensing of new results; publication delay for thesis-related papers and any company review period; whether additional computing or lab equipment beyond the faculty’s CAN/LIN lab and small cluster is needed; and the scope of any safety review if the method is ever tried on a live installation.

### Claims and sources
- supported (p=1): Martina Lačoková is a Senior Research Associate in the Department of Computing and Control Engineering at the Faculty of Technical Sciences. [R0919]
- supported (p=1): Her fields include Software Engineering and Testing, Embedded and Real-Time Systems, Formal Methods and Verification, and Automotive and Industrial Control. [R0919]
- supported (p=1): Her keywords include combinatorial interaction testing, t-way test generation, interface contract specification, compositional verification, CAN bus, multi-supplier integration, runtime assertion monitoring, covering arrays, constraint solving, and embedded software. [R0919]
- supported (p=1): She received her Ph.D. in 2014 from the Faculty of Technical Sciences, University of Novi Sad, with a thesis on combinatorial test generation for automotive communication middleware. [R0919]
- supported (p=1): Since 2015 she has held a Senior Research Associate position in the Department of Computing and Control Engineering. [R0919]
- supported (p=1): Her group focuses on test adequacy and compositional verification for embedded software assembled from components supplied by multiple vendors, with emphasis on CAN-based automotive and industrial networks. [R0919]
- supported (p=1): The group maintains a CAN/LIN bus laboratory with vector hardware interfaces and a small cluster for constraint-solving workloads. [R0919]
- supported (p=1): DriveLogic Vojvodina d.o.o. is an automotive and mobility software company based in Novi Sad. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. has 27 employees and was founded in 2004. [C018]
- supported (p=1): The company focuses entirely on AUTOSAR-based embedded software for configuration, integration, and V-cycle testing for powertrain, body and chassis ECUs. [C018]
- supported (p=1): Its products include AUTOSAR Classic BSW configuration and software component integration, V-cycle test planning, execution and coverage reporting for ECU software, CAN, LIN and Ethernet communication stack integration and validation, ECU flashing, diagnostic tooling and UDS/OBD-II protocol support, and AUTOSAR toolchain migration and legacy codebase porting. [C018]
- supported (p=1): The company uses AUTOSAR Classic (R4.x), Vector DaVinci Configurator, CAPL scripting, CANoe/CANalyzer, TRACE32 and JTAG-based ECU debugging, Jenkins-based CI pipelines, LDRA Testbed, gcov, Python scripting, and PC-lint Plus. [C018]
- supported (p=1): DriveLogic can dedicate one senior engineer part-time, roughly 40% of that person’s working week, to a collaborative development or research activity tied to active projects. [C018]
- supported (p=1): The company works on more than forty OEM projects and serves Tier-1 and Tier-2 suppliers delivering ECUs to European OEMs. [C018]
- supported (p=1): DriveLogic’s challenge states that its test coverage reports show 87% branch coverage but it still finds integration bugs in the CAN communication stack after delivery. [C018-CH2]
- supported (p=1): The challenge says that in the last four delivered projects, three came back with CAN communication faults found during customer integration testing. [C018-CH2]
- supported (p=1): The challenge says the fault was at a boundary between components from different suppliers, each conforming to spec individually but producing unexpected behaviour when connected. [C018-CH2]
- supported (p=1): The challenge states that DriveLogic has full access to the ARXML descriptions of all components in the project, the COM configuration, and the CANoe environment. [C018-CH2]
- supported (p=1): The challenge says the company would not start something that cost more than €40,000 in the first phase. [C018-CH2]
- supported (p=1): SYN-PUB-09743 is about generating minimum-size covering arrays for constrained parameter spaces in automotive middleware. [SYN-PUB-09743]
- supported (p=1): SYN-PUB-09744 is about interface contract specification for multi-supplier CAN node integration. [SYN-PUB-09744]
- supported (p=1): SYN-PUB-02017 is about runtime assertion monitoring for CAN-based embedded systems using low-overhead instrumentation. [SYN-PUB-02017]
- supported (p=1): SYN-PUB-01450 is about compositional verification of embedded software stacks. [SYN-PUB-01450]
- supported (p=1): SYN-PUB-09745 evaluates strength-3 combinatorial test suites against real field faults in a CAN stack implementation. [SYN-PUB-09745]
- supported (p=1): SYN-PUB-09746 is about specification and automated checking of timing contracts for multi-frame CAN FD messages. [SYN-PUB-09746]
- supported (p=1): SYN-PUB-09747 is a benchmark suite for constrained covering array generators. [SYN-PUB-09747]
- supported (p=1): SYN-PUB-09748 is about incremental test suite maintenance for evolving CAN interface contracts. [SYN-PUB-09748]
- supported (p=1): SYN-PUB-09749 is a taxonomy and detection study of cross-layer interaction faults in multi-supplier embedded stacks. [SYN-PUB-09749]
- supported (p=1): SYN-PUB-03011 is about automated derivation of CAN-CL contracts from AUTOSAR system descriptions. [SYN-PUB-03011]
- supported (p=1): SYN-PUB-09750 is about monitoring overhead profiles for CAN-CL runtime contracts across six microcontroller families. [SYN-PUB-09750]
- supported (p=1): SYN-PRJ-0434 is a project on contract-based integration testing for multi-supplier CAN networks in small-series manufacturing. [SYN-PRJ-0434]
- supported (p=1): SYN-PRJ-0435 is a project on embedded software dependability by compositional specification and testing. [SYN-PRJ-0435]
