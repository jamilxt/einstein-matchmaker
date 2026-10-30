# Proposals (live run)

## In-line dough condition monitoring and pre-bake warning for a 18,000-loaf/day industrial bakery

**Pair:** Saša Kosanović (R0496, Department of Mechatronics, Robotics and Automation) with Primer: industrijska pekara, Novi Sad (test input) (Q001), challenge Q001-CH1
**Critic:** approved after 2 draft(s). Screening score 1.97 / 3.

### The problem
Primer, an industrial bakery in Novi Sad, bakes about 18,000 loaves per day, but 4% to 6% of production becomes scrap because the loaves end up too small or with cracked crust. The root issue is that dough humidity and temperature after fermentation vary from shift to shift, while the line currently measures only chamber temperature and fermentation time, not the dough state itself. Primer wants to know which data should be measured on the line and to receive an alert before the dough enters the oven so the baker can correct the process in time. This is a good industrial PhD topic because the challenge is concrete, measurable, and already tied to a real production rate, defect rate, and decision point on the line.

### Research questions
1. Which in-line measurements of dough condition before baking best predict under-volume and cracked-crust scrap at Primer’s 18,000-loaf/day line, beyond the currently measured chamber temperature and fermentation time?
2. Can a vision- and sensor-based model detect out-of-spec dough state before oven entry with enough accuracy to reduce the current 4% to 6% scrap rate?
3. What warning threshold and operator feedback format allow the baker to intervene in time without slowing the line or increasing false alarms?

### Plan
| Year | Work | Result |
| --- | --- | --- |
| 1 | Map the existing bread line, define the critical control point before oven entry, and run a measurement campaign on dough state, ambient conditions, chamber temperature, fermentation time, and final loaf quality. Build the first predictive model from historical and newly collected data. | A validated list of required measurements and a baseline model that predicts scrap risk before baking. |
| 2 | Develop and test an in-line sensing and warning prototype, likely combining camera-based inspection with process data. Tune the model for shift-to-shift variation and compare several alert thresholds with bakery operators. | A working prototype that issues pre-bake warnings and demonstrably improves detection of risky dough batches. |
| 3 | Deploy the system in pilot operation, measure impact on scrap, stability, and operator workload, and refine the model and user interface for routine use across shifts. | A pilot-validated decision-support system that reduces scrap and can be transferred to production use. |

### What each side brings
- **Company:** Primer brings the real production line, access to the 18,000-loaf/day process, the current measurements already recorded on the line, and bakery operators who can validate which warnings are useful in practice.
- **Faculty:** Saša Kosanović and the Faculty of Technical Sciences bring expertise in machine vision, deep learning, anomaly detection, and process monitoring, plus the research infrastructure for building and training in-line quality models. Saša Kosanović will supervise the academic side from FTN, and Primer should appoint a production or quality lead to supervise the industrial side.

### Why this pair
This pair fits unusually well because the challenge is about detecting a hidden process state before a quality defect appears, and Saša Kosanović’s work is specifically focused on in-situ quality monitoring, machine vision, anomaly detection, and real-time deployment of inspection systems. Primer’s line also offers the kind of stable, high-volume setting needed to turn a prediction model into a measurable industrial tool.

### First step
Next month, both sides should run a one-day scoping workshop at Primer to define the exact measurement points, agree on the target defect labels, and install a temporary data collection setup for dough images and process variables over at least two shifts.

### Claims and sources
- supported (p=1): Saša Kosanović is a senior research associate at the Faculty of Technical Sciences, Department of Mechatronics, Robotics and Automation. [R0496]
- supported (p=1): Saša Kosanović works on additive manufacturing quality monitoring, especially FDM 3D printing, using machine vision and deep learning. [SYN-PUB-05834, SYN-PUB-05839, SYN-PUB-05843, SYN-PRJ-0239, SYN-PAT-022]
- supported (p=0.99): Saša Kosanović has expertise in machine learning and computer vision for defect detection and classification. [SYN-PUB-05836, SYN-PUB-05837, SYN-PUB-05840, SYN-PUB-05844, SYN-PAT-022]
- supported (p=1): Saša Kosanović has expertise in embedded and real-time deployment of CNN-based inspection systems. [SYN-PUB-05838, SYN-PUB-05841, SYN-PRJ-0239, SYN-PAT-022]
- supported (p=0.96): Saša Kosanović has expertise in anomaly detection and learning from limited labeled data. [SYN-PUB-05837, SYN-PUB-05840, SYN-PUB-05844]
- supported (p=0.95): Saša Kosanović has expertise in mechatronics, automation, and process-control applications. [SYN-PUB-05841, SYN-PUB-05842, SYN-PRJ-0377]
- supported (p=0.99): Primer is an industrial bakery in Novi Sad. [Q001]
- supported (p=1): Primer bakes about 18,000 loaves per day. [Q001-CH1]
- supported (p=1): Primer has a scrap rate of 4% to 6% because loaves are too small or have cracked crust. [Q001-CH1]
- supported (p=1): Primer currently measures chamber temperature and fermentation time, but not the dough state itself. [Q001-CH1]
- supported (p=1): Primer wants pre-bake warning so the baker can correct the process before the dough enters the oven. [Q001-CH1]

## Real-time dough condition sensing and pre-bake warning for Primer’s bread line

**Pair:** Emilija Vranješ (R0749, Department of Computing and Control Engineering) with Primer: industrijska pekara, Novi Sad (test input) (Q001), challenge Q001-CH1
**Critic:** approved after 1 draft(s). Screening score 1.23 / 3.

### The problem
Primer’s industrial bread line in Novi Sad bakes about 18,000 loaves per day, but 4–6% of production is rejected because of too small volume or cracked crust. The bakery currently measures chamber temperature and fermentation time, but not the condition of the dough itself after fermentation. The concrete industrial problem is to identify which process variables should be measured on the line, and to build an early-warning model that tells the baker before the loaf enters the oven whether the process should be corrected.

### Research questions
1. Which measurable on-line variables best predict final loaf defects in Primer’s process, beyond the currently tracked chamber temperature and fermentation time, so that the false-negative rate for defect warnings can be kept low on a line producing about 18,000 loaves per day?
2. Can a model that combines process measurements with real-time classification estimate pre-bake risk with enough accuracy to reduce the current 4–6% scrap rate while remaining usable within the line’s shift-to-shift variability?
3. What sensor set and decision threshold provide the best trade-off between early warning, implementation cost, and operator actionability for a bakery process where dough state is currently unmeasured?

### Plan
| Year | Work | Result |
| --- | --- | --- |
| 1 | Map the bread line, define defect labels, and instrument a pilot section with additional measurements of dough and process conditions. Build the first predictive baseline using historical batches and current measurements, and compare simple statistical models with machine-learning classifiers. | A validated dataset, a first list of candidate variables to measure, and an initial warning model with documented accuracy and failure modes. |
| 2 | Refine the sensing setup and develop a robust pre-bake risk model that handles shift-to-shift variation. Test feature selection, calibration, and threshold tuning with bakery operators to ensure warnings are timely and understandable. | A prototype early-warning system that identifies high-risk loaves before oven entry and a recommended minimal sensor set for routine use. |
| 3 | Run extended pilot deployment on the production line, quantify reduction in scrap and operational impact, and harden the model for day-to-day use. Prepare transfer documentation and finalize the collaboration on a path to implementation. | A production-ready decision-support tool, measured reduction in scrap, and a deployment handbook for Primer. |

### What each side brings
- **Company:** Primer brings access to the bread line in Novi Sad, daily production at the scale of about 18,000 loaves, the existing measurements of chamber temperature and fermentation time, operator knowledge, and practical constraints on what can be sensed and changed during the shift.
- **Faculty:** Emilija Vranješ, docent at the Faculty of Technical Sciences, Department of Computing and Control Engineering, brings expertise in combinatorial optimization, operations research, computer intelligence, logistics and supply-chain planning, and, most importantly here, dynamic real-time decision support, data-driven optimization, and a research group with access to the Intelligent Systems Laboratory and its parallel computing cluster. Supervisors: on the university side, Emilija Vranješ; on the company side, Primer’s designated process/production supervisor to be appointed at project start.

### Why this pair
This pair fits because Primer has a concrete, measurable production problem with enough daily volume to support model training and validation, while Emilija Vranješ has proven experience in building operational decision-support tools and working with real operational data. Although her published focus is logistics and dynamic routing, the transferable core of her work is real-time optimization under uncertainty, which is directly relevant to pre-bake warning and process correction in a high-throughput line. Primer is not asking for generic analytics; it needs a practical sensing-and-warning system, which matches a researcher who can connect data, prediction, and operational decision rules.

### First step
Within the next month, the partners should run a scoping workshop on site to define the defect taxonomy, decide which batch-level variables can be recorded immediately, and select one pilot line segment for additional measurements. The output should be a short measurement protocol and a shared data template for the first 4–6 weeks of sampling.

### Claims and sources
- supported (p=1): Emilija Vranješ is a docent at the Faculty of Technical Sciences, Department of Computing and Control Engineering, University of Novi Sad. [R0749]
- supported (p=1): Her fields include combinatorial optimization, operations research, computer intelligence, and logistics and supply-chain management. [R0749]
- supported (p=1): Her keywords include dynamic vehicle routing, VRP with time windows, metaheuristics, hybridization of exact solvers, real-time replanning, order insertion, tabu search, branch-and-price, combinatorial optimization, and last-mile logistics. [R0749]
- supported (p=1): She completed her undergraduate degree at the Department of Computing and Control, Faculty of Technical Sciences, University of Novi Sad in 2012 and defended her doctorate in 2019 on hybrid metaheuristic approaches for dynamic vehicle routing with real-time order insertion. [R0749]
- supported (p=1): She has been employed as an assistant professor/docent at her home department since 2020. [R0749]
- supported (p=1): Her research group works on combinatorial optimization in logistics, especially vehicle routing with dynamic changes in demand, hybridization of exact solvers and metaheuristics, and applications in distribution logistics and emergency services. [R0749]
- supported (p=1): She uses the Intelligent Systems Laboratory infrastructure at FTN, including a parallel computing cluster. [R0749]
- supported (p=1): She participated in a 2017–2018 industry project optimizing routes for the regional courier company BrzaPošiljka d.o.o. from Novi Sad, where she developed a prototype for dynamic order assignment to drivers in real time. [R0749]
- supported (p=0.99): Primer is an industrial bakery in Novi Sad. [Q001]
- supported (p=1): Primer bakes about 18,000 loaves per day. [Q001-CH1]
- supported (p=1): Primer currently measures chamber temperature and fermentation time. [Q001-CH1]
- supported (p=1): Primer reports 4–6% scrap due to too small volume or cracked crust. [Q001-CH1]
- supported (p=1): Primer wants to know which data should be measured on the line and wants a warning before the loaf enters the oven so the baker can correct the process. [Q001-CH1]
- supported (p=1): The challenge is about improving process control around dough condition before baking. [Q001-CH1]

## Pre-bake dough warning system for an industrial bread line in Novi Sad

**Pair:** Đurđica Žigić (R0289, Food Safety and Quality Group) with Primer: industrijska pekara, Novi Sad (test input) (Q001), challenge Q001-CH1
**Critic:** approved after 2 draft(s). Screening score 1.56 / 3.

### The problem
Primer, an industrial bakery in Novi Sad, bakes about 18,000 loaves per day, but 4 to 6 percent of production becomes scrap because the dough after fermentation varies in moisture and temperature from shift to shift, leading to low loaf volume or cracked crust. The line already measures chamber temperature and fermentation time, but not the actual dough state before the oven. The practical need is to identify which in-line dough measurements best predict bake-out quality and to turn them into an early warning that lets the baker correct the process before the dough enters the oven. Đurđica Žigić at FINS is a good fit because her work centers on fermentation kinetics, texture and microstructure of fermented food systems, and translating lab findings into industrial recommendations. Supervisors: Đurđica Žigić on the research side; a designated process engineer and production manager at Primer on the company side.

### Research questions
1. Which 3 to 5 measurable dough variables at the end of fermentation best predict loaf volume and crust cracking on Primer's 18,000-loaf/day line, and can they reduce scrap from 4 to 6 percent?
2. Can a model built from chamber temperature, fermentation time, and selected dough-state measurements predict out-of-spec dough with enough lead time to warn the baker before loading the oven?
3. What on-line or at-line measurement setup is robust enough for shift-to-shift use in an industrial bakery without slowing production?

### Plan
| Year | Work | Result |
| --- | --- | --- |
| 1 | Map the current line, define quality failures, and run a measurement campaign on representative batches across shifts. Compare dough temperature, moisture, fermentation time, and simple at-line indicators of fermentation state with final loaf volume and crust defects. | A validated shortlist of the most informative dough measurements and a baseline dataset linking process conditions to scrap outcomes. |
| 2 | Build and test prediction models and warning thresholds using the first-year data. Evaluate whether the model can flag risky dough before the oven and whether the recommended measurements are practical for operators. | A prototype pre-bake warning tool with performance metrics and a recommended sensor/measurement set for the line. |
| 3 | Pilot the warning tool in routine production, tune thresholds by shift, and quantify operational impact. Translate the findings into a standard operating procedure and staff training materials. | Industrial validation showing reduced scrap risk, plus a deployable control protocol for Primer's bread line. |

### What each side brings
- **Company:** Primer brings the industrial bread line, daily production of about 18,000 loaves, access to shift-to-shift variation, process logs, and the operational context needed to test a warning system under real production constraints.
- **Faculty:** FINS brings Đurđica Žigić's expertise in fermented milk gels, acidification kinetics, rheology, texture analysis, and microstructure characterization, plus the analytical tools and know-how to turn measurements into predictive indicators.

### Why this pair
This pair fits because the company's problem is fundamentally about process variation, product structure, and pre-bake quality prediction, which aligns directly with Žigić's record in fermentation kinetics, texture analysis, and industrially relevant process recommendations. Primer has a clear and measurable loss rate, a high daily volume, and a need for a practical pre-oven decision aid; FINS has the right scientific capability to identify measurable state variables and convert them into an industrial control approach.

### First step
Next month, the two sides should run a one-day scoping workshop at Primer to define the failure modes, the available line data, and the smallest feasible sampling plan. Immediately after that, they should start a four-week pilot on a few production shifts to collect dough-state and quality data from batches with and without defects.

### Claims and sources
- supported (p=1): Đurđica Žigić is a research associate at the Food Safety and Quality Group of the Scientific Institute for Food Technologies (FINS). [R0289]
- supported (p=1): Her field spans Food Science and Technology, Dairy Biotechnology, Rheology and Texture Analysis, and Microbiology of Fermented Foods. [R0289]
- supported (p=0.99): Her expertise includes fermented dairy gel formulation and acidification kinetics. [SYN-PUB-03597, SYN-PUB-03602, SYN-PUB-03604, SYN-PRJ-1797]
- supported (p=0.98): Her expertise includes rheology, texture analysis, and gel structure of yoghurt and fermented milk. [SYN-PUB-03597, SYN-PUB-03599, SYN-PUB-03601, SYN-PUB-03603]
- supported (p=0.97): Her expertise includes exopolysaccharide-producing starter cultures for yoghurt functionality. [SYN-PUB-03598, SYN-PUB-03599, SYN-PUB-03601, SYN-PRJ-1796]
- supported (p=0.98): Her expertise includes microstructure characterization of fermented milk gels using confocal microscopy. [SYN-PUB-03600]
- supported (p=0.97): Her expertise includes product optimization and reformulation, including low-fat and blended dairy systems. [SYN-PUB-03599, SYN-PUB-03603, SYN-PUB-03604, SYN-PRJ-1796]
- supported (p=1): She completed her degree at the Faculty of Technology, University of Novi Sad in 2011 and defended her PhD at the University of Novi Sad in 2019 in food biotechnology, on the kinetics of acidification and rheological properties of fermented milk gels. [R0289]
- supported (p=1): Since 2013, she has worked in the Food Safety and Quality Group at FINS, focusing on the textural and rheological properties of fermented dairy products, especially starter cultures that produce exopolysaccharides. [R0289]
- supported (p=1): She uses oscillatory rheology, texture profile analysis, and confocal laser scanning microscopy. [R0289]
- supported (p=1): She participates in teaching in the master's course on technology of fermented dairy products. [R0289]
- supported (p=1): She has worked with dairy-industry partners in two project contracts, including pilot tests on 50 L fermenters under production conditions. [R0289]
- supported (p=1): She has experience translating laboratory findings into recommendations for industrial application in yoghurt technology. [R0289]
- supported (p=1): Primer is an industrial bakery in Novi Sad. [Q001]
- supported (p=1): Primer bakes about 18,000 loaves per day. [Q001-CH1]
- supported (p=1): Primer reports that 4 to 6 percent of production becomes scrap because of insufficient loaf volume or cracked crust. [Q001-CH1]
- supported (p=1): Primer currently measures chamber temperature and fermentation time, but not the dough state itself. [Q001-CH1]
- supported (p=1): Primer wants to know which data should be measured on the line and to receive an alert before the dough enters the oven so the baker can adjust the process. [Q001-CH1]
