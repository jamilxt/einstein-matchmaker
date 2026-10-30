# Proposals (live run)

## Early-warning detection of stuck wine fermentations from tank temperature and density curves

**Pair:** Dimitrije Ristić (R0818, Department of Animal Science) with Example winery, Fruška Gora (Q001), challenge Q001-CH1
**Critic:** approved after 1 draft(s). Screening score 1.77 / 3.

### The problem
Example winery in Fruška Gora monitors 40 stainless fermentation tanks, logging temperature every 10 minutes and density twice a day. In a typical harvest, 2 or 3 tanks get stuck: sugar stops dropping for days and the issue is only noticed at the morning density check. The winery wants an early warning, ideally 24 hours before a fermentation stalls, that the cellar master can trust and act on. Dimitrije Ristić and the winery can use his experience with fermentation kinetics, microbial processes, and applied monitoring to build a practical decision tool for the cellar.

### Research questions
1. Can temperature and density time series from 40 tanks be combined into a model that flags a stalled fermentation at least 24 hours before the morning density check would reveal it?
2. What set of curve features and thresholds gives the best balance between early warning and false alarms for the cellar master’s daily workflow?
3. How well does a model trained on one harvest transfer to the next harvest with the winery’s existing logging routine, without adding new sensors?

### Plan
| Year | Work | Result |
| --- | --- | --- |
| 1 | Collect and clean historical tank temperature records (10-minute intervals) and density measurements (twice daily); reconstruct past stuck fermentations; define labels for normal versus stalled behavior; test simple rule-based and statistical baseline models. | A validated data pipeline and baseline detector that the winery can interpret, with an initial shortlist of warning indicators. |
| 2 | Develop and compare multivariate models that fuse temperature and density curves; tune alert timing and false-alarm rate with the cellar master; run retrospective back-testing across harvests. | A prototype early-warning model that can flag likely stalls about 24 hours in advance under the winery’s current measurement schedule. |
| 3 | Pilot the system during a live harvest; refine thresholds and alert format; document operating procedures for cellar staff; assess robustness across tank types and vintages. | A deployment-ready decision support tool and a final protocol for routine use in the cellar. |

### What each side brings
- **Company:** Example winery brings access to 40 stainless fermentation tanks, historical temperature logs every 10 minutes, density readings twice daily, and the practical constraint that any alert must be simple enough for the cellar master to trust and act on quickly.
- **Faculty:** Dimitrije Ristić and the Faculty of Agriculture bring expertise in fermentation kinetics, applied monitoring of fermentation processes, data analysis of biological time series, and an established laboratory culture of linking process measurements to actionable quality control. Supervisors: Assoc. Prof. Dimitrije Ristić on the faculty side; the winery’s cellar master or technical director on the company side.

### Why this pair
This pair is a strong fit because the winery’s problem is fundamentally a fermentation-monitoring problem, and Dimitrije Ristić has a research profile centered on fermentation kinetics, microbial processes, and practical fermentation quality assessment. The company already collects the key variables needed for modeling, but lacks a method to integrate them into an early warning. That makes this collaboration concrete, measurable, and immediately useful.

### First step
Next month, the partners should anonymize one recent harvest’s tank data, align temperature and density timestamps, and jointly review the 2 or 3 tanks that stalled to define the first warning target and acceptable false-alarm rate.

### Claims and sources
- supported (p=1): Dimitrije Ristić is an Associate Professor in the Faculty of Agriculture, Department of Animal Science. [R0818]
- supported (p=1): Ristić’s fields include Animal and Veterinary Sciences, Feed Technology and Forage Science, Microbiology and Fermentation, and Agricultural Science. [R0818]
- supported (p=1): His research expertise includes maize silage fermentation, heterofermentative lactic acid bacteria, fermentation kinetics, organic acid profiling, and aerobic stability. [SYN-PUB-08888, SYN-PUB-08889, SYN-PUB-08891, SYN-PUB-08892, SYN-PUB-08893, SYN-PUB-08894, SYN-PUB-08895, SYN-PRJ-1231]
- supported (p=1): He has applied experience from paid consultancy for two Vojvodina-based dairy cooperatives on silage quality improvement programmes. [R0818]
- supported (p=1): Example winery is in Fruška Gora. [Q001-CH1]
- supported (p=1): Example winery monitors 40 stainless fermentation tanks. [Q001-CH1]
- supported (p=1): The winery logs tank temperature every 10 minutes and density twice a day. [Q001-CH1]
- supported (p=1): In a typical harvest, two or three of the 40 tanks get stuck and the winery wants an early warning ideally 24 hours before a fermentation stalls. [Q001-CH1]

## Early warning for stalled wine fermentations in 40-tank winery operations

**Pair:** István Nagy (R0086, Department of Environmental Engineering and Occupational Safety) with Example winery, Fruška Gora (Q001), challenge Q001-CH1
**Critic:** approved after 1 draft(s). Screening score 1.78 / 3.

### The problem
Example winery in Fruška Gora runs 40 stainless fermentation tanks, but every harvest 2 or 3 tanks get stuck: sugar stops dropping for days and the problem is only noticed at the morning density check. Temperature is logged every 10 minutes and density twice a day, yet the curves are not analyzed together. The company wants an early warning system, ideally 24 hours before a fermentation stalls, that the cellar master can trust and act on.

### Research questions
1. Can a model built from 10-minute temperature traces and twice-daily density readings predict a stalled fermentation at least 24 hours in advance with a useful false-alarm rate for cellar operations?
2. Which features from the combined temperature-density time series most strongly indicate an upcoming stall in this winery’s 40-tank process, and can they be turned into an interpretable warning rule for the cellar master?
3. How stable is the warning model across harvests, tank-to-tank variation, and changing must conditions so that it remains reliable enough for operational use?

### Plan
| Year | Work | Result |
| --- | --- | --- |
| 1 | Collect and clean historical tank data, align temperature and density time series, define stall labels from the winery’s own records, and test simple baseline predictors and threshold rules. | A validated dataset and baseline early-warning prototype with measurable performance on past harvests. |
| 2 | Develop and compare time-series and hybrid statistical models, add interpretability checks, and co-design alert logic with the cellar master so warnings are understandable and actionable. | A model that predicts stalls 24 hours ahead with documented sensitivity, precision, and explanation of the key signals. |
| 3 | Run prospective pilots in live harvest conditions, tune alert thresholds for practical use, and document deployment, maintenance, and transfer to the winery’s routine workflow. | A tested decision-support tool ready for operational adoption, with guidance for future seasons. |

### What each side brings
- **Company:** Example winery brings access to its 40 stainless fermentation tanks, historical temperature logs every 10 minutes, density readings twice daily, and practical knowledge from the cellar master about what counts as a true stall and what kind of warning is useful in harvest work.
- **Faculty:** István Nagy brings expertise in data analysis for process systems, environmental and industrial process engineering, and experience working with industrial datasets and operational constraints. His group can support data cleaning, model design, validation, and interpretation, with supervision from Prof. István Nagy and a co-supervisor from the Department of Environmental Engineering and Occupational Safety.

### Why this pair
This pairing fits because the winery has a tightly defined operational problem with enough routine sensor data to support applied modeling, while István Nagy’s group is experienced in process-focused analysis, structured data handling, and industrial collaboration. The project is narrow enough for a 3-year industrial PhD and directly tied to a real production need that can be measured by earlier and more reliable stall detection.

### First step
Next month, the two sides should meet to agree on a 12-month retrospective data extract from all 40 tanks, define the stall event label together with the cellar master, and test a first baseline model on one harvest season before expanding to all available data.

### Claims and sources
- supported (p=1): István Nagy is a Full Professor in the Faculty of Technical Sciences, Department of Environmental Engineering and Occupational Safety. [R0086]
- supported (p=1): His fields include Environmental Engineering, Industrial Biotechnology, Life Cycle Assessment, and Sustainable Process Engineering. [R0086]
- supported (p=1): His group focuses on life cycle assessment methodology applied to industrial biotechnology, covering fermentation, enzymatic conversion, and downstream processing. [R0086]
- supported (p=1): He uses SimaPro and openLCA and has access to a small wet-chemistry laboratory and shared pilot-scale fermentation equipment. [R0086]
- supported (p=1): He has conducted two industry-contracted LCA studies for regional food ingredient manufacturers under confidentiality agreements. [R0086]
- supported (p=1): The company is Example winery in Fruška Gora. [Q001]
- supported (p=0.96): The company monitors 40 stainless fermentation tanks. [Q001-CH1]
- supported (p=1): Every harvest two or three of the 40 tanks get stuck. [Q001-CH1]
- supported (p=1): The winery logs tank temperature every 10 minutes and density twice a day. [Q001-CH1]
- supported (p=1): The company wants an early warning, ideally 24 hours before a fermentation stalls. [Q001-CH1]

## Early warning for stuck fermentations from sparse tank telemetry

**Pair:** Danilo Mitrović (R1006, Department of Mathematics and Informatics) with Example winery, Fruška Gora (Q001), challenge Q001-CH1
**Critic:** approved after 1 draft(s). Screening score 1.99 / 3.

### The problem
Example winery in Fruška Gora runs 40 stainless fermentation tanks each harvest, and two or three tanks typically get stuck every season: sugar stops dropping for days and the cellar team only notices at the morning density check. The winery already logs tank temperature every 10 minutes and density twice a day, but the measurements are not interpreted together. The goal is a trusted early-warning system that can flag a likely fermentation stall about 24 hours in advance, so the cellar master can intervene in time.

### Research questions
1. Can a model that fuses 10-minute temperature traces with twice-daily density readings predict a stall at least 24 hours before it becomes visible in the morning check, with acceptable false-alarm rates for cellar use?
2. Which temporal features and sequence patterns best separate normal fermentations from fermentations that later stall across the winery’s 40 tanks?
3. Can the model be converted into a simple risk score or alert rule that the cellar master can trust and act on during harvest operations?

### Plan
| Year | Work | Result |
| --- | --- | --- |
| 1 | Collect and clean one harvest cycle of tank-level data; align temperature and density streams; define operational labels for normal and stalled fermentations; build baseline statistical and machine-learning models on historical tank curves. | A validated data pipeline and a baseline stall-prediction model with clear performance metrics on past harvests. |
| 2 | Develop sequence models that combine irregular density checks with high-frequency temperature histories; test feature sets such as slope changes, plateaus, lagged temperature response, and tank-specific effects; calibrate alert thresholds with the cellar master. | A predictive model that can issue a 24-hour early warning with quantified precision, recall, and lead time. |
| 3 | Run prospective trials during a harvest season; compare alerts with cellar interventions and outcomes; refine the interface and operating rules for daily use; document robustness across tanks and vintages. | A deployable early-warning tool and a transfer package for routine cellar use. |

### What each side brings
- **Company:** Example winery brings access to its 40-tank fermentation operation, the existing temperature logs every 10 minutes, density measurements twice a day, and the cellar master’s knowledge of what a real stall looks like and how alerts should be used in practice.
- **Faculty:** Danilo Mitrović and the Faculty of Sciences, Department of Mathematics and Informatics, bring expertise in educational data mining, longitudinal sequence modelling, statistical learning, machine learning, and access to departmental statistical computing resources. Danilo Mitrović will supervise the research side; the company-side supervisor should be the cellar master or production manager responsible for fermentation decisions.

### Why this pair
This is a good fit because Danilo Mitrović’s research focuses on longitudinal clickstream and sequence modelling, where sparse observations must be combined with dense time-stamped traces to predict later outcomes. The winery’s data have the same core structure: irregular outcome checks, frequent sensor logs, and a clear operational target. The partnership is specific and practical: 40 tanks, two or three annual stalls, 10-minute temperature logging, twice-daily density checks, and a need for a trusted 24-hour warning rather than a generic analytics dashboard.

### First step
Within the next month, the partners should meet to map one completed harvest into a shared dataset specification, export one tank season of temperature and density data, and agree on the definition of a stall, the alert window, and the evaluation metric for a first baseline model.

### Claims and sources
- supported (p=1): Danilo Mitrović is an Assistant Professor in the Faculty of Sciences, Department of Mathematics and Informatics. [R1006]
- supported (p=1): Danilo Mitrović’s research areas include Educational Data Mining, Learning Analytics, Applied Statistics, and Machine Learning. [R1006]
- supported (p=1): Danilo Mitrović works on clickstream analysis, longitudinal data modelling, competency prediction, learning management systems, survival analysis, hidden Markov models, sequence mining, student performance, Moodle log data, and feature engineering. [R1006]
- supported (p=1): Danilo Mitrović completed a BSc and MSc in Mathematics and Computer Science at the University of Novi Sad and a PhD in Applied Mathematics at the same institution; he joined the department as a Teaching Assistant in 2010 and became Assistant Professor in 2016. [R1006]
- supported (p=1): Danilo Mitrović’s group regularly analyses event-log datasets from the university’s Moodle deployment and collaborates with the department’s Statistical Computing Laboratory, which maintains standard HPC cluster access. [R1006]
- supported (p=1): Danilo Mitrović completed a four-month consultancy in 2022 with an e-learning content provider based in Novi Sad, advising on a learner progress scoring system for a corporate training platform. [R1006]
- supported (p=1): Danilo Mitrović has no other sustained industry roles. [R1006]
- supported (p=1): Danilo Mitrović’s expertise includes educational data mining and learning analytics for student performance prediction. [SYN-PUB-10454, SYN-PUB-10457, SYN-PUB-10458, SYN-PRJ-0270, SYN-PRJ-0271]
- supported (p=1): Danilo Mitrović’s expertise includes longitudinal and sequential modelling of learning behaviour. [SYN-PUB-10455, SYN-PUB-10456, SYN-PUB-10459, SYN-PUB-10460]
- supported (p=0.97): Danilo Mitrović’s expertise includes competency modelling, mastery estimation, and retention analysis. [SYN-PUB-06872, SYN-PUB-10460, SYN-PRJ-0270]
- supported (p=1): Danilo Mitrović’s expertise includes statistical and machine learning methods for educational data. [SYN-PUB-10454, SYN-PUB-10456, SYN-PUB-10457, SYN-PUB-10458, SYN-PUB-10461]
- supported (p=1): Danilo Mitrović’s expertise includes learning trace data harmonisation and comparative analytics across institutions. [SYN-PRJ-0271, SYN-PUB-10459, SYN-PUB-10461]
- supported (p=0.96): Example winery is located in Fruška Gora. [Q001]
- supported (p=0.99): Example winery monitors 40 stainless fermentation tanks. [Q001-CH1]
- supported (p=1): Example winery has a recurring problem in which two or three of its 40 tanks get stuck each harvest. [Q001-CH1]
- supported (p=1): Example winery logs tank temperature every 10 minutes and density twice a day. [Q001-CH1]
- supported (p=1): Example winery wants an early warning, ideally 24 hours before a fermentation stalls, that the cellar master can trust and act on. [Q001-CH1]
- supported (p=0.99): The company is a winery; no size, sector, location, or history beyond the problem statement was given. [Q001]
