# Proposals (live run)

## Model-Driven PLC Tooling for Configurable Conveyor and Sorting Lines

**Pair:** Veljko Pantelić (R0995, Department of Computing and Control Engineering) with AutomVoj a.d. (C003), challenge C003-CH2
**Critic:** approved after 3 draft(s). Screening score 2.99 / 3.

### The problem
The collaboration targets a practical industrial automation problem: reducing engineering effort and commissioning risk in configurable PLC-based systems while keeping software adaptable across variants and preserving safety-relevant behavior. The research will focus on a model-driven workflow that can turn reusable system descriptions into correct IEC 61131-3 Structured Text, support variability across product variants, and strengthen validation in the PLC development process.

### Research questions
1. How can configurable PLC system variants be captured in a domain-specific model that is precise enough to generate IEC 61131-3 Structured Text?
2. How much can model-driven code generation reduce manual engineering and rework compared with current PLC development practices while preserving functional correctness across variants?
3. Which validation checks can be integrated into the toolchain to detect configuration and safety issues earlier in the PLC workflow?

### Plan
| Year | Work | Result |
| --- | --- | --- |
| 1 | Map recurring automation patterns from the company side, define a domain model, and prototype a Structured Text generation pipeline for one representative subsystem. | A validated metamodel and first generator prototype for configurable PLC modules. |
| 2 | Extend the toolchain to handle variability across several project families, add transformation rules and automated consistency checks, and test on live engineering cases. | A usable model-driven workflow for multiple project variants with measurable reductions in manual coding. |
| 3 | Add safety-aware validation and refinement, evaluate on commissioning and maintenance scenarios, and consolidate documentation for industrial adoption. | A mature prototype, evaluation results, and a deployment-ready process for engineering teams. |

### What each side brings
- **Company:** The company brings real industrial automation problems, access to PLC-based project cases, and a setting where the toolchain can be tested on practical customer-driven variants.
- **Faculty:** The faculty side brings expertise in IEC 61131-3 PLC metamodeling, model transformations, software product lines, automated code generation, and safety-aware automation software validation.

### Why this pair
This pair is a strong fit because the company works on configurable PLC-based automation systems, while the researcher’s profile is directly aligned with model-driven engineering for IEC 61131-3, variability management, and automated generation for PLC software. The combination makes it possible to study a concrete industrial problem with clear scientific questions and immediate practical value.

### First step
In the next month, the partners can select one recurring PLC subsystem, collect a small set of existing programs and configuration variants, and sketch the first domain model and generator scope together.

### Claims and sources
- supported (p=0.95): His work centers on software engineering for industrial automation, especially model-driven engineering, domain-specific languages, and PLC tooling for IEC 61131-3 Structured Text. [SYN-PUB-10372, SYN-PUB-10375]
- supported (p=0.86): He has expertise in IEC 61131-3 PLC metamodeling and Structured Text tooling. [SYN-PUB-10372, SYN-PUB-10375, SYN-PRJ-0390]
- supported (p=0.93): He has expertise in model transformations and model-driven engineering for industrial automation. [SYN-PUB-10373, SYN-PUB-10376, SYN-PRJ-0390]
- supported (p=0.87): He has expertise in software product lines and variability management for PLC software. [SYN-PUB-10374, SYN-PUB-10379, SYN-PRJ-0390]
- supported (p=0.82): He has expertise in incremental and automated code generation for configurable PLC systems. [SYN-PUB-02958, SYN-PUB-10380, SYN-PRJ-0390]
- supported (p=0.92): He has expertise in safety-aware automation software modeling and validation. [SYN-PUB-10377, SYN-PRJ-0391]

## Explainable, Regulation-Ready Credit Scoring for Micro and Small Businesses Using Alternative Data

**Pair:** Branislav Žarković (R0801, Department of Finance and Banking) with Kredo Fintech (C010), challenge C010-CH2
**Critic:** approved after 2 draft(s). Screening score 2.86 / 3.

### The problem
Kredo Fintech needs to improve automated lending for micro and small businesses while keeping decisions fast, accurate, and defensible under regulation. The core challenge is to strengthen a gradient-boosted credit scoring process for thin-file borrowers without sacrificing interpretability, fairness, or supervisory acceptability. This is especially important in fast online lending, where traditional financial statements and bureau histories are often incomplete and where alternative or open-banking data may improve prediction but complicate explanation and governance.

### Research questions
1. How much predictive lift can alternative and open-banking data add to Kredo Fintech’s current scoring model for micro and small business borrowers, relative to the existing automated baseline?
2. Which explainability methods provide the most stable and regulator-friendly explanations for gradient-boosted credit decisions on thin-file borrowers?
3. What model governance and monitoring framework best supports compliant use of AI/ML credit scoring in a regulated fintech lending environment?

### Plan
| Year | Work | Result |
| --- | --- | --- |
| 1 | Map the current decision process, data availability, and regulatory constraints; build a research dataset from historical applications; benchmark the current model against simple and explainable alternatives; define evaluation metrics for accuracy, calibration, rejection stability, and explanation quality. | A validated baseline, a shared dataset specification, and a first technical report on model performance and data gaps. |
| 2 | Develop and test enhanced models using alternative and open-banking data; compare feature sets for thin-file applicants; implement explainability tools and stress-test them for consistency across borrower segments and adverse scenarios. | A candidate scoring model with measurable uplift and a documented explanation layer suitable for internal and supervisory review. |
| 3 | Refine model governance, monitoring, and documentation; assess policy and compliance implications; pilot deployment in a controlled lending workflow; prepare implementation guidance and publication outputs. | A deployable model governance package, pilot results, and a joint academic-practitioner output. |

### What each side brings
- **Company:** Kredo Fintech brings a live lending use case, access to historical application and repayment data, an operational automated decisioning system based on gradient-boosted scoring, and a regulated fintech environment where solutions can be tested under real business constraints.
- **Faculty:** Branislav Žarković brings expertise in credit scoring for thin-file borrowers, explainable AI in credit decisions, alternative and open-banking data, SME credit risk, and the regulatory implications of AI/ML credit models, along with experience connecting research to banking and supervisory practice.

### Why this pair
This pair is unusually well matched because the company’s core problem is exactly the type of lending challenge the researcher has studied: automated credit decisions for thin-file micro and small business borrowers. Kredo Fintech provides a real regulated platform and data team, while the researcher contributes domain knowledge in scoring design, interpretability, and compliance. Together they can move from theory to an implementable model and governance framework.

### First step
Within the next month, the partners should run a joint scoping workshop to inventory available variables, sample the historical portfolio, define success metrics, and agree on data access, governance, and a pilot subgroup for the first benchmark study.

### Claims and sources
- supported (p=0.95): Branislav Žarković is a Full Professor in Finance and Banking at the Faculty of Economics in Subotica. [R0801]
- supported (p=0.89): He has expertise in credit scoring for thin-file borrowers and micro-enterprises. [R0801]
- supported (p=0.95): He has expertise in explainable AI and interpretability in credit decisions. [R0801]
- supported (p=0.78): He has expertise in alternative data and open-banking data for lending models. [R0801]
- supported (p=0.79): He has expertise in regulatory and supervisory implications of AI/ML credit models. [R0801]
- supported (p=0.65): He has expertise in SME credit risk, financial inclusion, and credit access barriers. [R0801]
- supported (p=1): Kredo Fintech uses automated credit decisioning. [C010-CH2]
- supported (p=1): Kredo Fintech uses a gradient-boosted scoring model. [C010-CH2]

## Contract-Based and Runtime-Assured Integration for AUTOSAR Classic ECU Projects

**Pair:** Martina Lačoková (R0919, Department of Computing and Control Engineering) with DriveLogic Vojvodina d.o.o. (C018), challenge C018-CH2
**Critic:** approved after 3 draft(s). Screening score 3.00 / 3.

### The problem
DriveLogic Vojvodina integrates AUTOSAR Classic embedded software for OEM-related ECU projects under customer-specific toolchains and process rules. In this setting, integration faults often arise not from individual components but from mismatches across supplier boundaries, configuration variants, and timing assumptions. The practical problem is to reduce late-cycle integration defects while keeping testing and verification lightweight enough for V-cycle delivery. This project will develop a contract-based and runtime-assisted integration approach that helps detect cross-layer faults earlier, focus testing on high-risk interface combinations, and provide evidence that integration assumptions hold across variants.

### Research questions
1. How can interface and timing contracts be expressed for AUTOSAR Classic integration so that they remain precise enough for verification but practical for industrial use?
2. Can combinatorial interaction testing over configuration, supplier, and interface parameters reduce the number of integration tests while preserving fault detection for cross-layer defects?
3. What low-overhead runtime monitors can detect contract violations during system and vehicle-level testing without disturbing real-time behavior?

### Plan
| Year | Work | Result |
| --- | --- | --- |
| 1 | Elicit recurring integration fault patterns from DriveLogic projects; define a contract template for AUTOSAR Classic interfaces; build an initial model of configuration and interaction parameters; pilot combinatorial test selection on one ECU subsystem. | A documented fault taxonomy, a usable contract notation, and a first test-selection prototype with an initial industrial case study. |
| 2 | Extend the approach to multiple supplier interfaces and timing-sensitive services; add runtime monitors for selected contract clauses; compare test effort and defect detection against current V-cycle practice. | A validated method that combines static contracts, interaction-based test generation, and runtime monitoring, evaluated on one or more real project artifacts. |
| 3 | Refine the method for broader reuse across AUTOSAR Classic projects; package guidance, templates, and tooling; measure transferability to new ECU variants and customer toolchains. | A deployable integration assurance workflow, tool support, and a thesis-ready body of empirical evidence. |

### What each side brings
- **Company:** DriveLogic Vojvodina brings industrial integration problems, access to ECU configuration and test artifacts, practical constraints from customer toolchains and process rules, and expert feedback on which assurance techniques fit day-to-day V-cycle work.
- **Faculty:** The researcher brings expertise in combinatorial interaction testing, contract-based specification for CAN and CAN FD integration, runtime verification, compositional verification, and analysis of cross-layer integration faults in multi-supplier embedded systems.

### Why this pair
This pairing is especially strong because the company’s work centers on embedded software integration and V-cycle testing, exactly where cross-supplier interface faults, configuration interactions, and timing assumptions are hard to manage. The researcher’s record is unusually aligned with those pain points: she has worked on interaction testing, contracts, runtime monitoring, and compositional verification for embedded and networked systems. Together, they can turn a hard industrial integration problem into a method that is both formally grounded and usable in production projects.

### First step
Within the next month, select one representative ECU subsystem and jointly collect its interface contracts, configuration parameters, and recent integration issues. Use that material to define a first contract template and a small set of high-risk interaction combinations for a pilot study.

### Claims and sources
- supported (p=0.97): Her expertise includes combinatorial interaction testing and constrained covering arrays. [SYN-PUB-09743, SYN-PUB-09745, SYN-PUB-09747]
- supported (p=0.96): Her expertise includes contract-based specification for CAN and CAN FD integration. [SYN-PUB-09744, SYN-PUB-09746, SYN-PUB-03011, SYN-PRJ-0434]
- supported (p=0.94): Her expertise includes runtime verification and low-overhead monitoring for embedded systems. [SYN-PUB-02017, SYN-PUB-09750, SYN-PRJ-0434]
- supported (p=0.95): Her expertise includes compositional verification and formal methods for embedded software. [SYN-PUB-01450, SYN-PRJ-0435]
- supported (p=0.88): Her expertise includes cross-layer integration faults in multi-supplier embedded stacks. [SYN-PUB-09749, SYN-PRJ-0434, SYN-PRJ-0435]
- supported (p=1): DriveLogic Vojvodina d.o.o. is the company named in the target challenge. [C018-CH2]
