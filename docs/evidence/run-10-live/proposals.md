# Proposals (live run)

## Not released: Branislav Žarković with Kredo Fintech

**Pair:** Branislav Žarković (R0801, Department of Finance and Banking) with Kredo Fintech (C010), challenge C010-CH2
**Form:** Industrial PhD, from the researcher's consent: "industrial PhD supervision"
**Critic:** rejected after 3 draft(s). Screening score 2.09 / 3.

The Critic rejected the last draft, so no proposal was released. What it still found:
- Branislav Žarković’s expertise includes alternative data and open banking in lending.: support 0.44

## Industrial PhD on contract-aware integration testing for multi-supplier CAN stacks at DriveLogic Vojvodina d.o.o.

**Pair:** Martina Lačoková (R0919, Department of Computing and Control Engineering) with DriveLogic Vojvodina d.o.o. (C018), challenge C018-CH2
**Form:** Industrial PhD, from the researcher's consent: "industrial PhD supervision for candidates from embedded systems companies"
**Critic:** approved after 2 draft(s). Screening score 2.99 / 3.

### The problem
DriveLogic Vojvodina d.o.o. reports 87% branch coverage and still sees CAN communication faults after delivery: in the last four delivered projects, three returned with integration bugs at boundaries between components from different suppliers. The company has ARXML descriptions, COM configuration, and CANoe, but no systematic way to generate tests that target the assumptions each side makes about the other. The research problem is to turn those artifacts into contract-aware integration tests that reveal cross-supplier interface faults before shipping, without disturbing the company’s AUTOSAR Classic process or customer toolchains.

### Research questions
1. Can interface contracts be inferred from ARXML and COM configuration well enough to generate tests that expose cross-supplier CAN boundary faults better than the current spec-reading approach?
2. Which contract-aware combinatorial test strategy gives the best fault yield under the company’s practical constraint of not exceeding the first-phase budget of €40,000?
3. How accurately can the generated tests reproduce the kinds of interaction faults seen in the company’s last four delivered projects, while preserving the current 87% to 89% branch-coverage baseline?

### Plan
| Period | Work | Result | Pass if |
| --- | --- | --- | --- |
| Months 1 to 6 | Collect one or two representative AUTOSAR/CAN integration cases from DriveLogic Vojvodina d.o.o., model the existing interface assumptions from ARXML and COM configuration, and adapt the researcher’s contract and combinatorial-test methods to the company’s CANoe-based environment. Prepare a prototype generator and check that it transfers to the company platform, not only the university laboratory setup. | A working prototype that produces candidate contract-aware integration tests on the company’s own AUTOSAR/CANoe toolchain for at least one representative project. | The prototype reads the selected ARXML and COM inputs and generates at least 20 executable test scenarios; at least 80% of them run in CANoe without manual rewriting, and at least one scenario is accepted by the company as a realistic boundary-fault probe. |
| Months 7 to 18 | Extend the prototype to cover multiple supplier boundary patterns, rank generated tests by likely interaction risk, and compare them with the company’s current integration tests on historical fault cases and a held-out project. Measure whether the new tests find faults earlier or with fewer tests than the current approach. | A validated test-generation method with quantified fault-detection results on company-relevant cases. | On a held-out case, the new method finds at least one interaction fault missed by the company’s current test selection, while keeping generated test volume within the same order of magnitude as the current integration suite; if no new fault is found, the method must still match the current suite’s fault-revealing power on all available historical cases. |
| Months 19 to 36 | Harden the method into a repeatable workflow for DriveLogic Vojvodina d.o.o., document how it fits into their AUTOSAR integration process, and add a transfer check for use on their own customer environments. Prepare the industrial PhD results for publication with company review of any confidential details and evaluate whether the approach can be reused on future projects. | A company-ready workflow and research results suitable for dissertation writing and publication. | The workflow is usable by a DriveLogic engineer with the company’s own tools and data on a new project without university intervention for the core generation step; the company confirms that the process fits its AUTOSAR Classic and CANoe constraints before any result is claimed for operational use. |

### What each side brings
- **Company:** DriveLogic Vojvodina d.o.o. brings 27 employees, AUTOSAR Classic integration experience, access to ARXML descriptions, COM configuration, and CANoe, plus practical cases where branch coverage has been 87% to 89% but cross-supplier CAN faults still escaped.
- **Faculty:** Martina Lačoková brings expertise in combinatorial interaction testing, interface contract specification, runtime monitoring, compositional verification, and tool-supported testing for CAN-based multi-supplier embedded systems, supported by the Faculty of Technical Sciences CAN/LIN laboratory with vector hardware interfaces and a small cluster for constraint-solving workloads.

### Why this pair
This pair fits because the company’s problem is exactly the kind of multi-supplier CAN boundary fault that Martina Lačoková has studied in her work on interface contracts, constrained covering arrays, and incremental test maintenance, while the company provides real AUTOSAR Classic cases, toolchain access, and an integration setting where the method can be validated against the actual 87% to 89% branch-coverage ceiling.

### What is new
The closest prior work is SYN-PUB-09744, which gives a formal framework for interface contract specification for multi-supplier CAN node integration, and SYN-PUB-09743, which generates minimum-size covering arrays for constrained parameter spaces. This proposal goes beyond those papers by targeting an industrial workflow that automatically derives fault-directed integration tests from the company’s ARXML and COM artifacts, then validates the resulting tests against the company’s own historical boundary faults and CANoe-based constraints. It also extends SYN-PUB-09748’s incremental maintenance idea from test suites in general to a practical contract-aware generator for DriveLogic Vojvodina d.o.o.’s AUTOSAR Classic process.

### Data: what exists and what to collect
The records say DriveLogic Vojvodina d.o.o. already has ARXML descriptions of all components in the project, COM configuration, and a CANoe environment, and that it has historical evidence of three CAN integration fault returns in the last four delivered projects alongside 87% to 89% branch coverage. The records do not say that labeled fault datasets, formal interface contracts, or previously generated contract-aware tests already exist, so those would have to be created or extracted during the project.

### The company's time limit
none stated

### First step
Next month, select one representative delivered project and one current project with DriveLogic Vojvodina d.o.o., extract the relevant ARXML and COM artifacts, and define a small set of boundary-fault scenarios to use as the first validation baseline in CANoe.

### Still to agree
Funding for the industrial PhD candidate and the company engineer time, including whether DriveLogic Vojvodina d.o.o. covers the first-phase effort up to €40,000 or part of it; access rules for ARXML, COM configuration, CANoe test assets, and any historical project data; publication review and delay terms for confidential company material; ownership and licensing of new results and any background IP; and the exact scope of the company’s engineer time versus any additional support that would need separate agreement.

### Claims and sources
- supported (p=1): Martina Lačoková is a Senior Research Associate in the Department of Computing and Control Engineering at the Faculty of Technical Sciences. [R0919]
- supported (p=1): Martina Lačoková’s fields include Software Engineering and Testing, Embedded and Real-Time Systems, Formal Methods and Verification, and Automotive and Industrial Control. [R0919]
- supported (p=1): Martina Lačoková’s work centers on combinatorial interaction testing, interface contract specification, compositional verification, runtime assertion monitoring, and dependent embedded systems testing for CAN-based automotive and industrial networks. [R0919, SYN-PUB-09743, SYN-PUB-09744, SYN-PUB-02017, SYN-PUB-01450, SYN-PUB-09745, SYN-PUB-09746, SYN-PUB-09748, SYN-PUB-09749, SYN-PUB-03011, SYN-PUB-09750, SYN-PRJ-0434, SYN-PRJ-0435]
- supported (p=1): DriveLogic Vojvodina d.o.o. is an automotive and mobility software company based in Novi Sad. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. has 27 employees and was founded in 2004. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. focuses on AUTOSAR-based embedded software, including configuration, integration, and V-cycle testing for powertrain, body and chassis ECUs. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. works mainly with Tier-1 and Tier-2 suppliers and uses customer toolchains and environments. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. provides AUTOSAR Classic BSW configuration and software component integration, V-cycle test planning, execution and coverage reporting, CAN, LIN and Ethernet communication stack integration and validation, ECU flashing, diagnostic tooling and UDS/OBD-II protocol support, AUTOSAR toolchain migration, and legacy codebase porting. [C018]
- supported (p=1): DriveLogic Vojvodina d.o.o. has a challenge where 87% to 89% branch coverage still coexists with CAN communication faults found during customer integration testing, including three such returns in the last four delivered projects. [C018-CH2]
- supported (p=1): DriveLogic Vojvodina d.o.o. has full access to ARXML descriptions, COM configuration, and the CANoe environment for the problem addressed in the challenge. [C018-CH2]
- supported (p=1): DriveLogic Vojvodina d.o.o. stated that it would not start work costing more than €40,000 in the first phase. [C018-CH2]
- supported (p=1): Martina Lačoková’s publication SYN-PUB-09744 is about interface contract specification for multi-supplier CAN node integration. [SYN-PUB-09744]
- supported (p=1): Martina Lačoková’s publication SYN-PUB-09743 is about generating minimum-size covering arrays for constrained parameter spaces in automotive middleware. [SYN-PUB-09743]
- supported (p=1): Martina Lačoková’s publication SYN-PUB-09748 is about incremental test suite maintenance for evolving CAN interface contracts. [SYN-PUB-09748]
- supported (p=1): Martina Lačoková’s publication SYN-PUB-03011 is about automated derivation of CAN-CL contracts from AUTOSAR system descriptions. [SYN-PUB-03011]

## Not released: Veljko Pantelić with AutomVoj a.d.

**Pair:** Veljko Pantelić (R0995, Department of Computing and Control Engineering) with AutomVoj a.d. (C003), challenge C003-CH2
**Form:** Industrial PhD, from the researcher's consent: "industrial PhD supervision"
**Critic:** rejected after 3 draft(s). Screening score 2.96 / 3.

The Critic rejected the last draft, so no proposal was released. What it still found:
- AutomVoj a.d. completed a one-year joint development project with Fakultet tehničkih nauka in Novi Sad in 2019 on drive energy monitoring.: support 0
- The 2019 project resulted in an internal measurement tool and was not published or commercialised.: support 0
- [novelty] ...jko Pantelić’s closest prior publication, SYN-PUB-02958, by targeting extraction and reuse from already d...: the figure "02958" in novelty is not in any claim, so no record was checked for it
