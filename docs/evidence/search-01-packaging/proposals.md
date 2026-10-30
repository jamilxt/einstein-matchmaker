# Proposals (live run)

## Week-ahead bearing failure prediction for conveyor drive motors using vibration sensing and decision-ready maintenance alerts

**Pair:** Bogdan Bajić (R0045, Department of Mechatronics, Robotics and Automation) with Example packaging plant, Subotica (Q001), challenge Q001-CH1
**Critic:** approved after 2 draft(s). Screening score 3.00 / 3.

### The problem
Example packaging plant in Subotica has recurring unplanned bearing failures on conveyor drive motors roughly once per quarter, and each failure stops a packaging line for most of a shift. The plant can add vibration sensors to 24 motors, but it lacks in-house expertise to turn vibration data into a maintenance decision. The practical need is not only to detect faults, but to predict a bearing failure about one week ahead and to identify the minimum sensor and feature set needed to do so reliably for an industrial maintenance workflow.

### Research questions
1. Can a vibration-based model predict conveyor drive motor bearing failure 7 days in advance with sufficient reliability for maintenance action at 24 monitored motors?
2. Which sensor placement, sampling rate, and signal features provide the best trade-off between prediction accuracy, data volume, and deployment effort in a packaging line environment?
3. Can a low-power, on-edge diagnostic pipeline provide maintenance-ready alerts that are interpretable enough for plant staff to act on before a shutdown?

### Plan
| Year | Work | Result |
| --- | --- | --- |
| 1 | Install and validate vibration sensing on an initial subset of the 24 conveyor drive motors, establish baseline healthy signatures, and build the first fault-forecasting pipeline using Bogdan Bajić’s vibration analysis and embedded diagnostics methods. Define alarm thresholds and maintenance labels with the plant’s maintenance staff. | A working pilot on selected motors, a baseline dataset, and an initial model that distinguishes healthy operation from pre-failure behavior. |
| 2 | Expand to the full 24-motor scope, compare feature sets and sensor configurations, and tune the prediction horizon toward one-week-ahead warnings. Test transfer across motors and operating conditions, and refine explanations that link model outputs to actionable maintenance decisions. | A validated multi-motor model with documented sensor and feature requirements and measurable prediction performance for week-ahead warning. |
| 3 | Deploy the best-performing low-power inference pipeline, monitor false alarms and missed alarms during routine operation, and finalize a robust workflow for maintenance decision support. Package the methods for broader reuse in similar conveyor systems. | An industrially usable predictive maintenance system with quantified uptime benefit and a deployment guide for future rollout. |

### What each side brings
- **Company:** Example packaging plant in Subotica brings the real production environment, access to 24 conveyor drive motors for sensor deployment, maintenance records of roughly quarterly bearing failures, and practical constraints on what can be installed and acted upon during a shift. The company also brings operational staff who can validate whether warnings are useful and timely.
- **Faculty:** Bogdan Bajić and the Faculty of Technical Sciences bring expertise in vibration-based bearing fault detection, condition monitoring of rotating machinery, time-frequency analysis, machine learning classifiers, embedded implementation, and a laboratory with rotating machinery test rigs and vibration acquisition equipment. Bogdan Bajić will supervise the research side, while the company should appoint a maintenance or reliability lead to supervise industrial validation.

### Why this pair
This pair matches the problem closely: the company has a concrete bearing-failure issue with a clear operational cost, while Bogdan Bajić’s group has direct expertise in the exact technical stack needed—vibration diagnostics, predictive maintenance, and embedded on-edge inference. The company needs a practical maintenance decision system, not just a model, and the faculty has the tools and experience to build and validate one in a real industrial setting.

### First step
Next month, the partners should run a joint site visit to select the first motors to instrument, agree on sensor mounting points and data collection settings, and define what counts as a failure, a warning, and a successful maintenance intervention. At the same meeting, they should agree on a 3-month pilot dataset plan and a simple reporting format for weekly review.

### Claims and sources
- supported (p=1): Bogdan Bajić is an Assistant Professor in the Faculty of Technical Sciences, Department of Mechatronics, Robotics and Automation. [R0045]
- supported (p=1): Bogdan Bajić’s research fields include Mechanical Engineering, Electrical and Electronic Engineering, Signal Processing, Artificial Intelligence and Machine Learning. [R0045]
- supported (p=1): Bogdan Bajić works on condition monitoring, predictive maintenance, rotating machinery, vibration analysis, bearing fault detection, time-frequency analysis, embedded systems, fault classification, gearbox diagnostics, and feature extraction. [R0045]
- supported (p=1): Bogdan Bajić received his B.Sc. and M.Sc. degrees in Mechatronics Engineering from the Faculty of Technical Sciences, University of Novi Sad, in 2010 and 2012, and his Ph.D. from the same institution in 2018. [R0045]
- supported (p=1): His Ph.D. thesis was on vibration-based bearing fault detection using embedded signal processing. [R0045]
- supported (p=1): He was a postdoctoral researcher at the Faculty of Mechanical Engineering, University of Ljubljana, from 2018 to 2020. [R0045]
- supported (p=1): His group focuses on condition monitoring of rotating machinery through accelerometer arrays, time-frequency analysis, and machine learning classifiers running on low-power microcontrollers. [R0045]
- supported (p=1): He teaches undergraduate courses in Sensors and Measurement Systems and graduate courses in Predictive Maintenance. [R0045]
- supported (p=1): His laboratory operates a dedicated rotating machinery fault-simulation test rig, a multi-channel vibration data acquisition system, and single-board embedded platforms for on-edge inference. [R0045]
- supported (p=1): During the SensiDrive project, Bajić collaborated with a medium-sized food processing company in Novi Sad on a 14-month field trial of wireless sensor nodes, including installation, calibration, and follow-up fault confirmation. [R0045]
- supported (p=1): The company’s conveyor drive motor bearings fail without warning about once a quarter. [Q001-CH1]
- supported (p=1): Each bearing failure stops a packaging line for most of a shift. [Q001-CH1]
- supported (p=1): The company could add vibration sensors to 24 motors. [Q001-CH1]
- supported (p=1): The company wants to predict a bearing failure a week ahead. [Q001-CH1]
- supported (p=1): The company wants to know which data to collect for that prediction. [Q001-CH1]

## Predicting conveyor drive motor bearing failures one week ahead using vibration data at Example packaging plant, Subotica

**Pair:** Veljko Savić (R0135, Department of Production Engineering) with Example packaging plant, Subotica (Q001), challenge Q001-CH1
**Critic:** approved after 1 draft(s). Screening score 2.02 / 3.

### The problem
Example packaging plant, Subotica has recurring unplanned bearing failures on its conveyor drive motors about once per quarter, and each failure stops a packaging line for most of a shift. The plant is considering vibration sensors on 24 motors, but it lacks the in-house expertise to convert vibration data into a maintenance decision. The industrial PhD will build a practical condition-monitoring and decision framework that tells the plant which vibration data to collect and whether a bearing is likely to fail about a week in advance.

### Research questions
1. Can vibration signals from 24 conveyor drive motors predict bearing failure at least 7 days ahead with useful precision and recall under the plant’s current operating conditions?
2. Which subset of vibration features and sampling strategy provides the best trade-off between diagnostic accuracy, sensor cost, and maintenance workload?
3. Can a reliability model using the plant’s failure history and monitored signals estimate remaining useful life well enough to trigger maintenance before the next line-stopping event?

### Plan
| Year | Work | Result |
| --- | --- | --- |
| 1 | Map the conveyor drive motor fleet, collect failure and downtime history, install and validate vibration sensors on a pilot subset of motors, and build the first fault-detection dataset and baseline models. | A pilot monitoring system with labeled data, baseline detection thresholds, and an initial bearing-risk model for the selected motors. |
| 2 | Expand monitoring to the full set of 24 motors, compare feature sets and prediction horizons, and develop a decision rule that converts vibration trends into maintenance alerts and inspection priorities. | A validated week-ahead prediction method and a sensor/data recommendation for the plant. |
| 3 | Refine the reliability and remaining-life model using accumulated operating data, test the maintenance policy in routine use, and quantify reductions in unexpected stoppages and unnecessary inspections. | A plant-ready predictive maintenance procedure with documented impact on unplanned stops and maintenance scheduling. |

### What each side brings
- **Company:** Example packaging plant, Subotica brings access to 24 conveyor drive motors, its failure and downtime records, operating staff for sensor installation and testing, and the real production constraints of a line where each stop lasts most of a shift. The company also brings the practical question of which vibration data are worth collecting.
- **Faculty:** Veljko Savić and the Faculty of Technical Sciences bring expertise in condition-based maintenance, vibration-based fault detection, reliability modeling, and industrial maintenance decision support, plus experience with stochastic degradation and maintenance optimization for rotating equipment. Supervisor on the academic side: Prof. Veljko Savić. Company supervisor: the plant’s maintenance manager or designated technical lead.

### Why this pair
This pair fits because the company has a concrete, high-cost rotating-equipment failure problem and a small enough motor fleet to support an industrial PhD study, while Veljko Savić’s research directly covers vibration monitoring, reliability analysis, and maintenance decision-making for equipment failures under variable operating conditions. The project is narrow enough to deliver results in 3 years and practical enough to be implemented immediately in the plant.

### First step
Next month, the two sides should do a two-week scoping visit: list the 24 motors, define the bearing-failure event, collect at least one year of downtime and maintenance logs, choose 3–5 pilot motors for sensor installation, and agree on a data-collection protocol and alert definition.

### Claims and sources
- supported (p=1): Veljko Savić is an Associate Professor in the Faculty of Technical Sciences, Department of Production Engineering. [R0135]
- supported (p=1): Veljko Savić’s fields include Production and Industrial Engineering, Maintenance Engineering and Reliability, Biomass Processing Technology, and Applied Statistics and Stochastic Modelling. [R0135]
- supported (p=1): Veljko Savić’s expertise includes condition-based maintenance, predictive maintenance, reliability modeling, vibration monitoring, fault detection, and wear/degradation analysis. [R0135, SYN-PUB-01786, SYN-PUB-01790, SYN-PUB-01792, SYN-PUB-01793, SYN-PUB-01794, SYN-PUB-01795, SYN-PRJ-0333, SYN-PRJ-0334]
- supported (p=1): Veljko Savić completed undergraduate and master’s studies in Production Engineering at the Faculty of Technical Sciences, University of Novi Sad, in 2004 and 2007. [R0135]
- supported (p=1): Veljko Savić earned a PhD in 2013 from the Faculty of Technical Sciences with a dissertation on stochastic failure modelling for pellet press drive systems. [R0135]
- supported (p=1): Veljko Savić was appointed Assistant Professor in 2014 and promoted to Associate Professor in 2019. [R0135]
- supported (p=1): Veljko Savić’s group focuses on condition-based and predictive maintenance frameworks for biomass densification equipment. [R0135, SYN-PUB-01786, SYN-PUB-01790, SYN-PUB-01791, SYN-PUB-01792, SYN-PUB-01794, SYN-PUB-01795, SYN-PRJ-0333, SYN-PRJ-0334]
- supported (p=1): Veljko Savić’s group operates a small instrumented pilot pellet press and collaborates with the Laboratory for Quality and Reliability at FTN. [R0135]
- supported (p=1): Veljko Savić has provided consulting services to two agricultural cooperatives in Vojvodina on maintenance programme restructuring for pellet production lines. [R0135]
- supported (p=1): Veljko Savić collaborated with Bioenergo d.o.o. as an industry partner in the RELIODENSE project, including on-site instrumentation of a ring-die press. [R0135]
- supported (p=0.89): Q001 Example packaging plant is a very small packaging operation with 0 employees stated. [Q001-CH1]
- supported (p=1): Q001 Example packaging plant is located in Subotica. [Q001-CH1]
- supported (p=1): Q001 Example packaging plant faces recurring unplanned conveyor motor bearing failures that stop a packaging line for most of a shift. [Q001-CH1]
- supported (p=1): Q001 Example packaging plant could add vibration sensors to 24 motors. [Q001-CH1]
- supported (p=1): Q001 Example packaging plant wants to predict a bearing failure a week ahead and know which data to collect. [Q001-CH1]

## Vibration-Based Early Warning for Conveyor Motor Bearing Failures at Example Packaging Plant, Subotica

**Pair:** Vladana Radić (R0822, Department of Mechatronics, Robotics and Automation) with Example packaging plant, Subotica (Q001), challenge Q001-CH1
**Critic:** approved after 2 draft(s). Screening score 2.99 / 3.

### The problem
Example packaging plant in Subotica has recurring bearing failures on its conveyor drive motors about once per quarter, and each failure stops a packaging line for most of a shift. The plant can add vibration sensors to 24 motors, but it currently lacks the know-how to convert vibration data into a maintenance decision. The immediate operational goal is to predict a bearing failure one week ahead and identify the minimum data needed to do so reliably.

### Research questions
1. Can synchronized vibration data from 24 conveyor drive motors predict bearing failure at least 7 days in advance with actionable precision and recall for maintenance planning?
2. Which sensor set and signal features provide the best trade-off between early warning performance and installation/processing effort: single-axis vibration, multi-axis vibration, or vibration plus contextual machine-state data?
3. Can a health-index or remaining-useful-life model be calibrated for the plant’s conveyor motors so that warning thresholds are stable enough to support a maintenance decision before a planned line stop?

### Plan
| Year | Work | Result |
| --- | --- | --- |
| 1 | Install and validate the vibration sensing setup on the 24 motors, define failure labels from maintenance history and operating logs, and build a baseline fault-detection pipeline using vibration features and simple classifiers. | A working data collection and baseline detection system, plus an initial model that flags precursor patterns before bearing failure. |
| 2 | Compare feature sets and forecasting models, including multivariate time-series methods and remaining-useful-life estimation, and test how much lead time is achievable for one-week-ahead warnings. | A validated prediction model with measured lead time, false-alarm rate, and the recommended minimum sensor/data configuration. |
| 3 | Embed the selected method into a maintenance decision workflow, tune alarm thresholds with plant staff, and evaluate robustness over multiple failure cycles and operating conditions. | A practical decision-support procedure for maintenance scheduling, including threshold rules and documentation for plant deployment. |

### What each side brings
- **Company:** Example packaging plant provides the 24 conveyor drive motors, access for sensor installation, maintenance and downtime records, operating context, and real failure events needed to train and validate the model. The company also brings the operational constraint that each unplanned stop halts a packaging line for most of a shift, making a one-week warning especially valuable.
- **Faculty:** Prof. Vladana Radić and the Faculty of Technical Sciences bring expertise in condition monitoring, vibration analysis, signal processing, multivariate time-series analysis, and predictive maintenance for rotating machinery. Her group contributes the rotating machinery test laboratory, vibration measurement rigs, infrared thermography systems, multi-channel DAQ infrastructure, and experience in industrial diagnostics and remaining useful life estimation.

### Why this pair
This pair matches the problem directly: the company has a small but concrete fleet of 24 conveyor drive motors with repeated bearing failures, while Prof. Radić’s group specifically works on bearing fault detection, vibration-based diagnostics, and predictive maintenance for rotating machinery. The collaboration is especially well suited because the company needs not just sensors, but a method that turns vibration data into a maintenance decision, which is exactly the faculty’s area of expertise.

### First step
Next month, agree on the 24-motor sensor installation plan, select 2–3 candidate bearings or motor positions for the first pilot, and define the maintenance-event labels and data format so the first vibration dataset can be collected immediately. The academic supervisor would be Prof. Vladana Radić; the company supervisor would be the plant maintenance manager or technical lead designated by Example packaging plant. Publication and IP will be agreed up front: results can be published after company review for confidential details, while foreground IP from jointly developed methods will be handled in a written collaboration agreement.

### Claims and sources
- supported (p=1): Vladana Radić is a Full Professor in the Department of Mechatronics, Robotics and Automation at the Faculty of Technical Sciences. [R0822]
- supported (p=1): Her research fields include condition monitoring and predictive maintenance, signal processing and time-series analysis, mechatronics and rotating machinery, and machine learning for industrial applications. [R0822]
- supported (p=1): Her work includes vibration analysis, thermal signatures, rotating machinery, remaining useful life, fault prognosis, multivariate time-series, gearbox diagnostics, infrared thermography, and bearing fault detection. [R0822]
- supported (p=1): She joined the Department of Mechatronics, Robotics and Automation at the Faculty of Technical Sciences in 2010 and was promoted to Full Professor in 2021. [R0822]
- supported (p=1): Her group focuses on condition monitoring of rotating machinery using synchronized acquisition of vibration and thermal data, multivariate statistical process control, and data-driven fault prognosis including remaining useful life estimation. [R0822]
- supported (p=1): Her group operates a dedicated rotating machinery test laboratory equipped with vibration measurement rigs, infrared thermography systems, and a multi-channel DAQ infrastructure. [R0822]
- supported (p=1): She has collaborated with two Vojvodina-based industrial companies in grain handling and conveyor operations and has provided technical consulting to a domestic manufacturer of centrifugal pumps. [R0822]
- supported (p=1): Her expertise in condition monitoring and predictive maintenance for rotating machinery is evidenced by SYN-PUB-08925, SYN-PUB-08928, SYN-PUB-08930, SYN-PUB-07751, SYN-PRJ-0440, and SYN-PAT-045. [SYN-PUB-08925, SYN-PUB-08928, SYN-PUB-08930, SYN-PUB-07751, SYN-PRJ-0440, SYN-PAT-045]
- supported (p=1): Her expertise in vibration-based fault diagnosis and signal processing is evidenced by SYN-PUB-08925, SYN-PUB-08926, SYN-PUB-05845, SYN-PUB-08930, and SYN-PAT-045. [SYN-PUB-08925, SYN-PUB-08926, SYN-PUB-05845, SYN-PUB-08930, SYN-PAT-045]
- supported (p=1): Her expertise in multimodal sensing and infrared thermography for machine health assessment is evidenced by SYN-PUB-08927, SYN-PUB-08929, and SYN-PRJ-0441. [SYN-PUB-08927, SYN-PUB-08929, SYN-PRJ-0441]
- supported (p=1): Her expertise in remaining useful life estimation and fault prognosis is evidenced by SYN-PUB-08928, SYN-PUB-00593, SYN-PUB-08933, and SYN-PRJ-0440. [SYN-PUB-08928, SYN-PUB-00593, SYN-PUB-08933, SYN-PRJ-0440]
- supported (p=1): Her expertise in machine learning and data-driven industrial diagnostics is evidenced by SYN-PUB-05845, SYN-PUB-00593, SYN-PUB-08931, SYN-PUB-08932, SYN-PUB-08933, and SYN-PRJ-0440. [SYN-PUB-05845, SYN-PUB-00593, SYN-PUB-08931, SYN-PUB-08932, SYN-PUB-08933, SYN-PRJ-0440]
- supported (p=1): Example packaging plant is in Subotica. [Q001-CH1]
- supported (p=0.96): The company has 24 conveyor drive motors that could be fitted with vibration sensors. [Q001-CH1]
- supported (p=1): Bearings on the company’s conveyor drive motors fail about once a quarter. [Q001-CH1]
- supported (p=1): Each failure stops a packaging line for most of a shift. [Q001-CH1]
- supported (p=1): The company wants to predict a bearing failure one week ahead and know which data to collect. [Q001-CH1]
