# Proposals (live run)

## Industrial PhD on plain-language explanations for automated SME credit decisions at Kredo Fintech

**Pair:** Branislav Žarković (R0801, Department of Finance and Banking) with Kredo Fintech (C010), challenge C010-CH2
**Form:** Industrial PhD, from the researcher's consent: "industrial PhD supervision"
**Critic:** approved after 3 draft(s). Screening score 2.09 / 3.

### The problem
Kredo Fintech needs a compliant explanation format for automated credit decisions that can be generated at decision time, stored with the decision record, and shown in the borrower portal in Serbian and Macedonian. The current gradient-boosted model performs well, but the existing technical SHAP-based summary is not understandable enough for borrowers and does not satisfy the company’s compliance expectations. The practical problem is to turn model drivers into short, accurate, borrower-facing explanations that remain faithful to the decision and can be deployed in production within about six months.

### Research questions
1. How can feature attributions from Kredo Fintech’s current gradient-boosted model be transformed into plain-language explanations that borrowers understand and can challenge?
2. Can an explanation template achieve a measurable improvement in borrower comprehension while preserving fidelity to the automated decision and meeting Kredo Fintech’s compliance requirements?
3. What Serbian and Macedonian explanation wording and storage format can be integrated into decision-time underwriting without slowing the existing production workflow beyond agreed limits?

### Plan
| Period | Work | Result | Pass if |
| --- | --- | --- | --- |
| Months 1 to 6 | Map the current decision workflow, review the existing SHAP-based internal summary, define the explanation taxonomy, and design Serbian borrower-facing templates. Build a prototype that generates explanations at decision time and stores them with the decision record. Prepare a transfer check for Kredo Fintech’s Python, dbt, Snowflake, Airflow, scikit-learn, PostgreSQL, REST API and Docker environment. | A tested prototype explanation module, a Serbian wording set, and a storage specification that can be reviewed by compliance and engineering. | The prototype produces an explanation for at least 95% of test decisions, each explanation is under 120 words, and Kredo Fintech confirms that it can be executed in their own stack without manual rewriting. |
| Months 7 to 18 | Run iterative user testing with borrower-facing samples and internal review with compliance. Refine wording for clarity, challengeability, and fidelity. Add Macedonian rendering and confirm that both languages preserve the same decision logic and legal meaning. | A validated bilingual explanation format ready for controlled production use. | At least 70% of test participants correctly identify the main reason for a sample decision, and compliance signs off that the output meets the intended plain-language standard for Serbian and Macedonian. |
| Months 19 to 36 | Monitor explanation stability in production, assess error cases, and study whether the explanations affect borrower questions, complaints, or manual reviews. Write the doctoral thesis and produce publishable results on explanation quality for thin-file and micro-business lending. | A production-tested explanation method, thesis, and research outputs on explainability in SME credit scoring. | The deployed format remains available for all automated decisions in the agreed scope, with documented exception handling for edge cases, and the final thesis demonstrates fidelity, usability, and operational fit on Kredo Fintech’s data. |

### What each side brings
- **Company:** Kredo Fintech brings a regulated lending setting, its current automated underwriting flow, transaction data, tax filings, sector benchmarks, the existing gradient-boosted scoring model, the current SHAP-based internal summary, borrower portal integration needs, and access to its data team of five for implementation work within its production constraints.
- **Faculty:** Branislav Žarković brings expertise in credit scoring for thin-file borrowers, alternative data, explainable credit risk models, and regulatory implications of machine learning credit models, supported by his Faculty of Economics in Subotica role and his prior banking risk experience.

### Why this pair
This pair fits because Kredo Fintech needs a production-ready explanation layer for SME lending, while Branislav Žarković has published directly on explainability, alternative data, thin-file scoring, and the regulatory side of credit models. His industry background in bank risk also matches the operational and compliance nature of the problem.

### What is new
The closest prior work is SYN-PUB-08751, which addresses explainability requirements under the EU AI Act, and SYN-PUB-08754, which benchmarks scorecard interpretability metrics in credit risk practice. This project goes beyond those papers by turning explanation research into a live borrower-facing workflow for a Serbian fintech lender, with decision-time generation, bilingual Serbian-Macedonian delivery, storage alongside the decision record, and production validation in Kredo Fintech’s own underwriting stack.

### Data: what exists and what to collect
The records state that Kredo Fintech already uses transaction data, tax filings, sector benchmarks, and a gradient-boosted ensemble scoring model, and that it has experimented with SHAP values and a short internal technical summary. The records do not state that borrower comprehension test data, complaint data, or Macedonian explanation text already exist, so those would need to be collected during the project.

### The company's time limit
within about six months

### First step
Next month, agree the explanation output format, define a sample set of recent decisions for testing, and run a transfer check from the research prototype to Kredo Fintech’s Python, Snowflake, PostgreSQL and REST-based production environment.

### Still to agree
Funding for the doctoral candidate and supervision time; which side covers engineering time for implementation and testing; IP ownership and licensing for new explanation templates, software, and any background IP; publication review delay and confidentiality terms; access to decision records, SHAP outputs, borrower portal logs, and any user-testing participants; and the exact compliance sign-off process before any live deployment.

### Claims and sources
- supported (p=1): Branislav Žarković is a Full Professor at the Faculty of Economics in Subotica, Department of Finance and Banking. [R0801]
- supported (p=1): Branislav Žarković’s fields include credit risk and SME finance. [R0801]
- supported (p=1): Branislav Žarković is open to industrial PhD supervision. [R0801]
- supported (p=1): Branislav Žarković has prior industry experience as head of risk at a regional bank from 2005 to 2012. [R0801]
- supported (p=1): SYN-PUB-08746 is about scoring micro-enterprises with little credit history. [SYN-PUB-08746]
- supported (p=1): SYN-PUB-08748 is about alternative data in consumer credit scoring: evidence from a Serbian fintech lender. [SYN-PUB-08748]
- supported (p=1): SYN-PUB-08750 is about credit access barriers for women-owned SMEs in the Western Balkans. [SYN-PUB-08750]
- supported (p=1): SYN-PUB-08751 is about explainability requirements under the EU AI Act: implications for credit scoring vendors. [SYN-PUB-08751]
- supported (p=1): SYN-PUB-08752 is about incorporating cash-flow volatility into SME credit scoring: a machine learning approach. [SYN-PUB-08752]
- supported (p=1): SYN-PUB-08753 is about open banking data for thin-file borrower assessment: opportunities and regulatory constraints. [SYN-PUB-08753]
- supported (p=1): SYN-PUB-08754 is about benchmarking scorecard interpretability metrics in credit risk practice. [SYN-PUB-08754]
- supported (p=1): Kredo Fintech is a fintech company. [C010]
- supported (p=1): Kredo Fintech has 26 employees. [C010]
- supported (p=1): Kredo Fintech was founded in 2020. [C010]
- supported (p=1): Kredo Fintech is based in NTP Novi Sad. [C010]
- supported (p=1): Kredo Fintech operates from the Science and Technology Park in Novi Sad. [C010]
- supported (p=1): Kredo Fintech is regulated by the National Bank of Serbia. [C010]
- supported (p=1): Kredo Fintech has funded over 1,400 loans since launch. [C010]
- supported (p=1): Kredo Fintech’s default rate sits comfortably below the Serbian banking sector average for SME portfolios. [C010]
- supported (p=1): Kredo Fintech’s team of 26 works out of the Science and Technology Park in Novi Sad. [C010]
- supported (p=1): Kredo Fintech’s data team has five people. [C010]
- supported (p=1): Kredo Fintech provides Kredo SME Loans from 500 to 50,000 EUR for micro and small businesses. [C010]
- supported (p=1): Kredo Fintech provides Kredo Flex Line for businesses with at least six months of transaction history. [C010]
- supported (p=1): Kredo Fintech provides Kredo Score Report, a one-page creditworthiness summary a borrower can share with suppliers or landlords. [C010]
- supported (p=1): Kredo Fintech provides Kredo Portal, a borrower self-service dashboard for repayment tracking and document upload. [C010]
- supported (p=1): Kredo Fintech uses Python, dbt, Snowflake, Apache Airflow, scikit-learn, PostgreSQL, REST APIs for Open Banking data ingestion, and Docker. [C010]
- supported (p=1): Kredo Fintech’s underwriting pulls transaction data, tax filings, and sector benchmarks. [C010]
- supported (p=1): Kredo Fintech’s current main scoring model is a gradient-boosted ensemble. [C010-CH2]
- supported (p=1): Kredo Fintech has experimented with SHAP values to identify which features drove a decision. [C010-CH2]
- supported (p=1): Kredo Fintech generates a short internal summary that is written in technical language. [C010-CH2]
- supported (p=1): Kredo Fintech needs every automated credit decision to be accompanied by a plain-language explanation that a borrower can understand and, if they wish, challenge. [C010-CH2]
- supported (p=1): Kredo Fintech needs the explanation to be generated automatically at decision time, stored alongside the decision record, and rendered in the borrower portal in Serbian and Macedonian. [C010-CH2]
- supported (p=1): Kredo Fintech wants a compliant explanation format in place before it expands to North Macedonia. [C010-CH2]
- supported (p=1): Kredo Fintech wants something that works reliably in production within about six months. [C010-CH2]

## Industrial PhD on contract-driven integration testing for multi-supplier CAN stacks at DriveLogic Vojvodina d.o.o.

**Pair:** Martina Lačoková (R0919, Department of Computing and Control Engineering) with DriveLogic Vojvodina d.o.o. (C018), challenge C018-CH2
**Form:** Industrial PhD, from the researcher's consent: "industrial PhD supervision for candidates from embedded systems companies"
**Critic:** approved after 1 draft(s). Screening score 2.99 / 3.

### The problem
DriveLogic Vojvodina d.o.o. reports that its LDRA branch coverage is already 87–89%, yet CAN communication faults still appear after delivery, especially at boundaries between components from different suppliers. The concrete problem is to systematically find interface-assumption mismatches before shipping, using the ARXML descriptions, COM configuration, and CANoe environment that DriveLogic Vojvodina d.o.o. already works with, and to do so without exceeding the company’s stated first-phase budget of €40,000.

### Research questions
1. Can interface contracts extracted from ARXML and COM configurations be turned into measurable fault-targeting tests that reveal cross-supplier CAN interaction bugs earlier than current practice?
2. Do contract-directed test suites find more boundary faults than branch-coverage-driven integration tests at the same or lower test effort on DriveLogic Vojvodina d.o.o. projects?
3. Which contract properties and generation constraints give the best trade-off between fault detection, execution time, and maintainability in AUTOSAR Classic CAN integration testing?

### Plan
| Period | Work | Result | Pass if |
| --- | --- | --- | --- |
| Year 1 | Map the company’s current CAN integration workflow, define the contract model for ARXML/COM boundary assumptions, and build a prototype generator that produces test scenarios in the company’s own CANoe-based environment. Validate that generated tests transfer to DriveLogic Vojvodina d.o.o.’s toolchain before any result is claimed. | A working prototype that derives boundary-focused test scenarios from project descriptions and runs them in the company environment on at least one real integration case. | At least one company project yields a generated test set that executes in CANoe and exposes at least one previously undetected boundary case or reproduces a known supplier-interface fault with a smaller or equally sized suite than the current manually written integration tests. |
| Year 2 | Extend the generator to handle multiple supplier interface patterns, add ranking/prioritization for high-risk contracts, and compare generated suites against existing branch-coverage-oriented tests on several historical or ongoing projects. | An evaluated method for contract-directed integration testing with repeatable metrics for fault detection, effort, and coverage. | On at least two projects, the contract-directed suite finds more boundary faults per executed test case than the company’s current integration tests, or matches their fault yield with at least 20% fewer executed test cases. |
| Year 3 | Harden the method into a usable workflow for DriveLogic Vojvodina d.o.o., document adoption guidelines, and assess whether it can be embedded in the company’s normal pre-delivery test planning with acceptable engineering overhead. | A thesis-grade industrial method plus a practical workflow for recurring use on AUTOSAR Classic projects. | The company can apply the workflow to a new project without researcher intervention for the core generation step, and the team judges that the method fits within the stated phase-one budget envelope and normal project cadence. |

### What each side brings
- **Company:** DriveLogic Vojvodina d.o.o. brings real AUTOSAR Classic integration projects, access to ARXML descriptions, COM configuration, and the CANoe environment, plus the practical constraint that current integration test coverage is 87–89% branch coverage while supplier-boundary faults still escape to customer integration testing. The company can also provide part-time engineering input: up to one senior engineer at roughly 40% of their working week, if the work is tied directly to tools or methods used in active projects.
- **Faculty:** Martina Lačoková brings research experience in combinatorial interaction testing, CAN/CAN FD integration testing, formal interface contracts, runtime verification, and automated contract derivation. Her group also brings the CAN/LIN bus laboratory with vector hardware interfaces and a small cluster for constraint-solving workloads, together with supervision from the Faculty of Technical Sciences.

### Why this pair
This pairing fits because DriveLogic Vojvodina d.o.o. has the exact kind of recurring supplier-boundary problem that Martina Lačoková has studied in multi-supplier embedded systems, CAN integration testing, and interface contracts. The company has real AUTOSAR Classic projects and the needed descriptions and tooling, while the researcher has a strong fit with contract-based testing for CAN stacks and constrained test generation. The research can therefore be grounded in actual industrial cases instead of synthetic examples.

### What is new
The closest prior work for this topic is SYN-PUB-09744 on interface contract specification for multi-supplier CAN node integration and SYN-PUB-09748 on incremental maintenance for evolving CAN interface contracts. The novelty here is to move from contract specification and maintenance to an industrial PhD setting where those ideas are turned into a generator and evaluation workflow specifically for DriveLogic Vojvodina d.o.o.’s AUTOSAR Classic integration projects. In addition, the proposal focuses on producing tests from the company’s own ARXML, COM configuration, and CANoe environment to target assumptions between suppliers, rather than only describing the contracts or checking them after the fact.

### Data: what exists and what to collect
The records say that DriveLogic Vojvodina d.o.o. already has full access to ARXML descriptions of the components in the project, the COM configuration, and the CANoe environment. The records do not say that historical fault cases, labeled interaction-fault data, or a reusable test corpus are already collected, so those would have to be assembled from live or archived projects during the collaboration. The company also states that current LDRA reports consistently show 87–89% branch coverage before shipment, which can serve as the starting benchmark, but the records do not state that any dedicated contract-based test dataset already exists.

### The company's time limit
none stated

### First step
Next month, agree on one representative AUTOSAR Classic project, define the exact boundary assumptions to model from its ARXML and COM configuration, and run a small proof-of-concept in the company’s CANoe environment to confirm that generated scenarios execute on DriveLogic Vojvodina d.o.o.’s own toolchain.

### Still to agree
Funding and who pays for the doctoral candidate and supervision time; access rules for ARXML, COM configuration, and any archived project data; IP ownership for new generator code and any derived contract models; background IP boundaries for DriveLogic Vojvodina d.o.o.’s existing toolchain artifacts; publication review and any delay before public disclosure; whether the company’s up-to-40% senior-engineer support is available throughout the project or only in selected phases; and whether any safety- or release-related results must go through the company’s own review process before use on live projects.

### Claims and sources
- supported (p=1): Martina Lačoková is a Senior Research Associate in the Department of Computing and Control Engineering at the Faculty of Technical Sciences. [R0919]
- supported (p=1): Martina Lačoková’s fields include Software Engineering and Testing, Embedded and Real-Time Systems, Formal Methods and Verification, and Automotive and Industrial Control. [R0919]
- supported (p=1): Martina Lačoková’s expertise includes combinatorial interaction testing, t-way test generation, interface contract specification, compositional verification, CAN bus, multi-supplier integration, runtime assertion monitoring, covering arrays, and constraint solving. [R0919]
- supported (p=1): Martina Lačoková’s publication SYN-PUB-09744 is about interface contract specification for multi-supplier CAN node integration. [SYN-PUB-09744]
- supported (p=1): Martina Lačoková’s publication SYN-PUB-09748 is about incremental test suite maintenance for evolving CAN interface contracts. [SYN-PUB-09748]
- supported (p=1): Martina Lačoková’s publication SYN-PUB-03011 is about automated derivation of CAN-CL contracts from AUTOSAR system descriptions. [SYN-PUB-03011]
- supported (p=1): Martina Lačoková’s publication SYN-PUB-09750 is about monitoring overhead profiles for CAN-CL runtime contracts across six microcontroller families. [SYN-PUB-09750]
- supported (p=1): DriveLogic Vojvodina d.o.o. is an automotive and mobility software company based in Novi Sad. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. has 27 employees and was founded in 2004. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. focuses entirely on AUTOSAR-based embedded software for configuration, integration, and V-cycle testing for powertrain, body and chassis ECUs. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. works inside customer development environments and uses the customers’ toolchains and process rules. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o.’s products include AUTOSAR Classic BSW configuration and software component integration; V-cycle test planning, execution and coverage reporting for ECU software; CAN, LIN and Ethernet communication stack integration and validation; ECU flashing, diagnostic tooling and UDS/OBD-II protocol support; AUTOSAR toolchain migration and legacy codebase porting. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o.’s tools include AUTOSAR Classic R4.x, Vector DaVinci Configurator, CAPL scripting, CANoe and CANalyzer, TRACE32, Jenkins-based CI pipelines, LDRA Testbed, gcov, Python scripting, and PC-lint Plus. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. can dedicate one senior engineer part-time, roughly 40% of their working week, to a collaborative development or research activity tied directly to tools or methods used in active projects. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. has worked on software integration for more than forty OEM projects. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o.’s challenge is recurring CAN communication faults at supplier boundaries that pass individual module tests but appear during customer integration testing. [C018-CH2]
- supported (p=1): DriveLogic Vojvodina d.o.o. reports 87–89% branch coverage before shipment, but three of the last four delivered projects returned with CAN communication faults found during customer integration testing. [C018-CH2]
- supported (p=1): DriveLogic Vojvodina d.o.o. says it has full access to the ARXML descriptions of all components in the project, the COM configuration, and the CANoe environment. [C018-CH2]
- supported (p=1): DriveLogic Vojvodina d.o.o. states that it would not start something that cost more than €40,000 in the first phase. [C018-CH2]
- supported (p=0.98): The closest prior work for the novelty claim includes SYN-PUB-09744 and SYN-PUB-09748. [SYN-PUB-09744, SYN-PUB-09748]

## Not released: Veljko Pantelić with AutomVoj a.d.

**Pair:** Veljko Pantelić (R0995, Department of Computing and Control Engineering) with AutomVoj a.d. (C003), challenge C003-CH2
**Form:** Industrial PhD, from the researcher's consent: "industrial PhD supervision"
**Critic:** rejected after 3 draft(s). Screening score 2.96 / 3.

The Critic rejected the last draft, so no proposal was released. What it still found:
- [novelty] The closest prior work is SYN-PUB-02958, which handled incremental model-to-text generati...: the figure "02958" in novelty is not in any claim, so no record was checked for it
