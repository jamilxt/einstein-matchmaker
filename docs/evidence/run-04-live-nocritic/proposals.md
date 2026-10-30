# Proposals (live run)

## Turning 380 million telematics trip events into a per-driver risk score for motor pricing

**Pair:** Željko Mamužić (R0271, Department of Traffic Engineering) with Pannonia Osiguranje-Tech a.d. (C013), challenge C013-CH1
**Critic:** shipped_unchecked after 1 draft(s). Screening score 2.02 / 3.

### The problem
Pannonia Osiguranje-Tech a.d. already records rich telematics behaviour from about 9,400 PanTrack G2 devices, including speed samples every two seconds, hard-brake flags, sharp-cornering flags and night-driving flags, and stores roughly 380 million trip-event rows in PostgreSQL. Yet the pricing team still prices drivers only by age band and vehicle category, so a cautious 24-year-old and an aggressive one may pay the same. An in-house points score tried last year did not materially move loss ratio. The company now needs a robust, explainable scoring method that converts raw trip events into a single per-driver risk score that can be used directly as a loading or discount in the rating engine, with trip length and road type accounted for as far as the available data allow, and with something production-ready before the next annual product filing in Q1 2026.

### Research questions
1. How can 380 million telematics trip-event rows be transformed into a stable per-driver risk score that improves separation of expected loss while remaining simple enough for pricing use?
2. Which feature set best explains driving risk in this dataset: raw event counts, exposure-normalized measures by trip length, road-type-adjusted indicators, or a combination of all three?
3. What calibration approach yields a score that can be mapped directly onto a pricing loading or discount and monitored for drift after deployment?

### Plan
| Year | Work | Result |
| --- | --- | --- |
| 1 | Joint data audit and feature engineering on the anonymised PostgreSQL telematics warehouse; define trip, driver and exposure logic; benchmark several transparent scoring baselines against the current age-vehicle bracket approach. | A validated research dataset and a shortlist of candidate score definitions with initial predictive lift. |
| 2 | Develop and compare explainable models that normalize for trip length and inferred road type; test calibration, stability, and pricing interpretability with the company’s pricing team; design the mapping from score to tariff factors. | A chosen model family, documented scoring rule, and a pilot-ready pricing table for the rating engine. |
| 3 | Pilot integration into the rating engine before the Q1 2026 filing; monitor score drift, calibration, and business impact; finalize governance, documentation, and handover for operational use. | A production-ready per-driver risk score, monitoring protocol, and implementation package for the pricing team. |

### What each side brings
- **Company:** Pannonia Osiguranje-Tech a.d. brings 187 employees, about 41,000 policyholders, 9,400 active telematics devices, and access to roughly 380 million anonymised trip-event rows in PostgreSQL under a data-processing agreement. The company also brings the practical constraints of a four-person pricing team, a Q1 2026 filing deadline, and an existing rating engine that needs a score it can actually use.
- **Faculty:** The Faculty of Technical Sciences brings Željko Mamužić, Senior Research Associate in the Department of Traffic Engineering, whose expertise includes vehicle telematics, GPS trajectory analytics, real-time ETA estimation, heterogeneous data fusion, and telematics data interoperability. He can lead the modelling work, supervise feature design around trip structure and road context, and connect the project to methods used in transport data engineering and trajectory analytics.

### Why this pair
This pair is a strong fit because the company has exactly the kind of telematics volume and operational pricing need that can benefit from transport-data methods, while the researcher has the specific background in vehicle telematics, GPS trajectory analytics, map matching, heterogeneous data fusion, and interoperable transport data needed to turn raw trips into a pricing-ready score. The company also already stores the data needed for the project and has a near-term product filing deadline, making the problem concrete and measurable rather than exploratory.

### First step
In the first month, the partners should sign the data-processing agreement, define the unit of analysis and anonymisation rules, and jointly sample a representative subset of trips to build a first benchmark dataset with driver labels, trip length, and road-type proxies. That dataset should be used to reproduce the current points-based score and compare it with 2-3 transparent alternatives.

### Claims and sources
- supported (p=1): Pannonia Osiguranje-Tech a.d. is an insurtech company based in Subotica with 187 employees, founded in 2009. [C013]
- supported (p=1): Pannonia Osiguranje-Tech serves about 41,000 active policyholders across Serbia, Bosnia-Herzegovina and North Macedonia. [C013]
- supported (p=1): Pannonia Osiguranje-Tech has telematics hardware fitted in about 9,400 vehicles and uses PanTrack G2 devices transmitting via GPRS. [C013]
- supported (p=1): Pannonia Osiguranje-Tech stores roughly 380 million trip-event rows in PostgreSQL and wants to use them for motor pricing. [C013-CH1]
- supported (p=1): Pannonia Osiguranje-Tech has a four-person pricing team and a six-person IT team, with no dedicated research unit. [C013]
- supported (p=1): Pannonia Osiguranje-Tech wants a per-driver risk score before the next annual product filing due in the first quarter of 2026. [C013-CH1]
- supported (p=1): Željko Mamužić is a Senior Research Associate at the Faculty of Technical Sciences, Department of Traffic Engineering. [R0271]
- supported (p=1): Željko Mamužić's fields include Intelligent Transport Systems, Traffic Engineering, Data Engineering and Interoperability, and Geospatial Computing. [R0271]
- supported (p=1): Željko Mamužić's expertise includes vehicle telematics data interoperability and standards, GPS trajectory analytics and map matching, real-time ETA estimation, and heterogeneous data fusion for transport systems. [SYN-PUB-03399, SYN-PUB-03400, SYN-PUB-03231, SYN-PRJ-0034, SYN-PUB-03398, SYN-PUB-03403, SYN-PUB-03406, SYN-PUB-03401, SYN-PUB-03230, SYN-PUB-03402, SYN-PUB-03405, SYN-PRJ-0035]
- supported (p=1): Željko Mamužić teaches courses in Intelligent Transport Systems and Traffic Flow Theory. [R0271]
- supported (p=1): Željko Mamužić has a small telematics laboratory with a test fleet of instrumented vehicles, a GPU workstation for trajectory processing, and access to the Faculty's shared HPC cluster. [R0271]

## Real-time hybrid reconciliation for multi-provider e-commerce payments

**Pair:** Andrea Malešević (R0217, Department of Mathematics and Informatics) with FinPuls Tehnologije d.o.o. (C021), challenge C021-CH1
**Critic:** shipped_unchecked after 1 draft(s). Screening score 2.03 / 3.

### The problem
FinPuls Tehnologije d.o.o. currently runs payment reconciliation as hourly Spark batch jobs. For clients with 50,000 daily orders across Stripe, Adyen, Klarna and local acquirers, the full cycle from data arrival to final report takes 70–90 minutes, while finance teams require the previous day’s numbers closed by 08:30. FinPuls has already optimized Spark configuration and partitioning, gaining only about 12 minutes, and wants a solution that can finish end-to-end in under 20 minutes without losing correctness. The company already has Kafka for ingestion, but not for reconciliation itself, and lacks in-house experience with a production migration from batch to a hybrid batch/streaming design under strict consistency requirements.

### Research questions
1. Can a hybrid reconciliation architecture using Kafka as a streaming backbone reduce end-to-end closing time from 70–90 minutes to under 20 minutes for 50,000-order merchants while preserving exact-match correctness?
2. Which state-management and windowing strategy best preserves reconciliation consistency when late, duplicated, or provider-specific records arrive from Stripe, Adyen, Klarna and local acquirers?
3. What implementation pattern in the existing Python/Spark/PostgreSQL/AWS stack yields the best trade-off between latency, operational complexity, and auditability for production deployment?

### Plan
| Year | Work | Result |
| --- | --- | --- |
| 1 | Map the current batch pipeline, define correctness constraints, and build a prototype hybrid flow on a representative 50,000-order dataset using Kafka for incremental reconciliation and PostgreSQL/TimescaleDB for audit state. | A validated architecture and benchmark showing where the current 70–90 minute cycle is lost, plus a prototype that can process the target workload significantly faster. |
| 2 | Develop and test reconciliation algorithms for idempotency, late-arriving events, and provider mismatches; compare streaming-window, micro-batch, and hybrid approaches under real data distributions. | A production-ready method with measurable latency and accuracy results, plus implementation guidelines for FinPuls’ stack. |
| 3 | Integrate the chosen design into the FinPuls platform, run phased deployment with one to two engineers over a pilot client set, and harden monitoring, rollback, and audit trails. | A deployed system that targets sub-20-minute closing time, with documented operational procedures and reproducible evaluation. |

### What each side brings
- **Company:** FinPuls brings the production problem, access to real reconciliation workloads and provider feeds, its existing Spark/Kafka/PostgreSQL/AWS stack, and 1–2 engineers for up to three months of implementation-focused collaboration. Supervising on the company side: Dragan Stanković, CTO.
- **Faculty:** Andrea Malešević brings expertise in distributed systems and databases, high-throughput query processing, scalable data structures, and load balancing/sharding strategies, together with access to the PMF 24-node cluster and test environments based on Apache Cassandra and PostgreSQL. Supervising on the faculty side: Andrea Malešević.

### Why this pair
This pair is a strong fit because the company’s bottleneck is not generic fintech reporting but a data-intensive, correctness-sensitive migration from hourly batch processing toward near-real-time reconciliation. Andrea Malešević’s research profile is directly centered on distributed databases, scalable systems, and high-throughput processing, which matches FinPuls’ need for a production-safe hybrid design. FinPuls, in turn, has a clear operational constraint, a bounded stack, and real client workloads large enough to make the research measurable.

### First step
Next month, run a joint scoping workshop to freeze one reference client workflow, extract the last 30 days of reconciliation data, define the exact correctness criteria and latency budget, and set up a side-by-side benchmark of the current Spark batch job versus a minimal Kafka-backed incremental prototype.

### Claims and sources
- supported (p=1): Andrea Malešević is a docent at the Department of Mathematics and Informatics, Prirodno-matematički fakultet, University of Novi Sad. [R0217]
- supported (p=1): Andrea Malešević’s fields include Distributed Systems and Databases, Algorithms and Data Structures, Network Security and PKI, and Computer Science Theory. [R0217]
- supported (p=0.97): Andrea Malešević’s research expertise includes distributed systems and distributed databases for certificate-status infrastructure, OCSP and PKI performance optimization, algorithms and scalable data structures, and load balancing/sharding in high-throughput systems. [SYN-PUB-02767, SYN-PUB-02770, SYN-PUB-02772, SYN-PUB-02773, SYN-PRJ-0504, SYN-PRJ-0505, SYN-PUB-02768, SYN-PUB-01685, SYN-PUB-02771, SYN-PUB-02765, SYN-PUB-02769, SYN-PUB-02766]
- supported (p=1): FinPuls Tehnologije d.o.o. is a fintech company focused on B2B payment infrastructure and reconciliation, with 12 employees, founded in 2021, based in Novi Sad. [C021]
- supported (p=1): FinPuls serves 10 active clients, mainly e-commerce operators from Germany, Austria, and Serbia, and processes payment data from multiple providers. [C021]
- supported (p=1): FinPuls’s products include a real-time payment reconciliation platform, connector package for Stripe, Adyen, Klarna and local acquirers, an audit-trail reporting module, and a beta cash-flow tracking widget. [C021]
- supported (p=1): FinPuls’s technical stack includes Python with Apache Spark, Apache Kafka, PostgreSQL and TimescaleDB, AWS (EKS, S3, Lambda), dbt, Terraform, REST and webhook integrations. [C021]
- supported (p=1): The challenge is that reconciliation jobs across Stripe, Adyen, Klarna and local acquirers take 70–90 minutes for clients with 50,000 daily orders, while finance teams need the previous day’s numbers closed by 08:30 and the target is under 20 minutes without accuracy loss. [C021-CH1]
- supported (p=1): FinPuls has already optimized Spark configuration and partitioning, gaining about 12 minutes but not enough to meet the deadline. [C021-CH1]
- supported (p=1): FinPuls has Kafka available for ingestion but not yet for the reconciliation step, and it lacks in-house experience with a production migration from batch to hybrid batch/streaming under strict consistency requirements. [C021-CH1]
- supported (p=1): FinPuls can dedicate one to two engineers for up to three months to an implementation-focused research collaboration. [C021]
- supported (p=1): Andrea Malešević uses a 24-node cluster in the PMF Laboratory for Distributed Systems and test environments based on Apache Cassandra and PostgreSQL. [R0217]
- supported (p=1): Andrea Malešević has experience from a 2020–2021 consulting engagement on architecture assessment for a certificate-management system. [R0217]
- NOT supported: The proposed collaboration would be supervised by Andrea Malešević on the faculty side and Dragan Stanković, CTO, on the company side. [C021, R0217]
- NOT supported: An agreed-up-front publication and IP approach should allow academic publication of general methods and benchmarks while protecting FinPuls client data, implementation details, and product-specific code through prior review and company approval. [C021, R0217]

## Lossless, ECG-aware compression for KL-Patch cloud scaling

**Pair:** Branislav Stojanović (R0641, Department of Computing and Control Engineering) with Kardiolink a.d. (C005), challenge C005-CH2
**Critic:** shipped_unchecked after 1 draft(s). Screening score 2.28 / 3.

### The problem
Kardiolink a.d. currently ingests about 2 TB of raw ECG data per month from KL-Patch devices. Its present lossless pipeline achieves only 3:1 compression, leaving cloud storage costs at about €7,400 per month. With deployment rising from roughly 2,200 devices per month to a projected 4,000 per month by Q2 next year, the current approach will become materially more expensive. The company cannot switch to lossy compression without a new clinical validation study and technical file amendments, so the immediate need is a better lossless algorithm that exploits ECG structure: quasi-periodicity, baseline wander, and wearable-noise characteristics, while remaining compatible with the existing regulatory position.

### Research questions
1. Can an ECG-aware lossless compressor outperform the current 3:1 baseline on Kardiolink’s 140,000-segment labelled dataset while preserving bit-exact reconstruction of all 16-bit samples?
2. Which combination of signal preprocessing, prediction, and entropy coding yields the best compression ratio on KL-Patch 72 data across patients, devices, and recording conditions, without exceeding the compute and power budget of the current firmware and upload pipeline?
3. Can a selective segment-level codec strategy reduce monthly cloud storage cost enough to support 4,000 devices per month while remaining implementable within the existing IEC 62304-oriented toolchain and regulatory constraints?

### Plan
| Year | Work | Result |
| --- | --- | --- |
| 1 | Profile the current compression pipeline on the 140,000-segment dataset; build a reproducible benchmarking suite; identify ECG-specific redundancies and failure cases of the existing modified SZ-based approach; screen candidate lossless methods based on predictive coding and adaptive entropy coding. | A validated baseline report, dataset split, and shortlist of algorithmic candidates with measured compression, runtime, and memory use. |
| 2 | Design and implement one or two ECG-aware lossless codecs; integrate them into a prototype firmware/cloud pipeline; test robustness across channels, wear durations, noise levels, and patient variability; compare against the current 3:1 performance and storage costs. | A prototype compressor achieving a higher average ratio than the current pipeline, with documented runtime and deployment constraints. |
| 3 | Harden the selected method for product use; perform regression testing, interoperability testing, and evidence generation for regulatory documentation; quantify savings at 2,200 and 4,000 devices per month; prepare release-ready implementation guidance. | A production-ready compression module, validation package, and cost model showing expected cloud savings at projected scale. |

### What each side brings
- **Company:** Kardiolink brings the real-world problem, access to the KL-Patch 72 signal characteristics, and the labelled dataset of about 140,000 30-minute ECG segments under NDA. It also brings product and regulatory constraints, the existing modified SZ-based pipeline, the cloud-cost target, and the in-house firmware, cloud, and clinical workflow context needed to make the solution deployable.
- **Faculty:** Branislav Stojanović brings expertise in embedded systems, data compression, adaptive sampling, anomaly-preserving signal processing, and resource-constrained implementation. His group can benchmark and redesign compression methods for MCU-class hardware, prototype algorithms in MATLAB/Python, and validate implementation feasibility on ARM Cortex-M development boards and related lab equipment.

### Why this pair
This pair fits because the company’s need is specifically a lossless, signal-aware compression problem, and the researcher’s published expertise is directly in lossless compression for sensor streams, adaptive signal processing, edge/MCU constraints, and anomaly-preserving monitoring. Kardiolink already works in Novi Sad and operates a product stack that combines wearable ECG hardware, embedded firmware, and cloud storage, while the researcher has prior industrial consulting experience on embedded firmware architecture and LPWAN optimization, making the collaboration practical and locally grounded.

### First step
Within the next month, the two sides should sign an NDA and data-processing agreement, appoint supervisors, and run a joint kickoff workshop. On the company side: a firmware/signal-processing lead and a regulatory/quality representative. On the faculty side: Branislav Stojanović as academic supervisor, with one additional assistant or PhD mentor from the department if required. The workshop should freeze the benchmark protocol, define the train/validation/test split, and export a first anonymised sample of the 140,000-segment dataset for baseline reproduction.

### Claims and sources
- supported (p=1): Branislav Stojanović is a Full Professor in the Faculty of Technical Sciences, Department of Computing and Control Engineering. [R0641]
- supported (p=1): His expertise includes embedded systems and resource-constrained IoT processing. [SYN-PUB-07294, SYN-PUB-03183, SYN-PUB-00967, SYN-PRJ-0151, SYN-PAT-009]
- supported (p=1): His expertise includes lossy data compression for sensor and telemetry streams. [SYN-PUB-07294, SYN-PUB-07295, SYN-PUB-03183, SYN-PUB-07297, SYN-PUB-07299, SYN-PUB-04195, SYN-PRJ-0150, SYN-PAT-009]
- supported (p=0.98): His expertise includes adaptive sampling, signal processing, and embedded feature extraction. [SYN-PUB-07296, SYN-PUB-07298, SYN-PUB-00967, SYN-PUB-07300, SYN-PUB-07295]
- supported (p=1): His expertise includes anomaly-preserving monitoring for industrial and structural health applications. [SYN-PUB-07297, SYN-PUB-04195, SYN-PRJ-0150, SYN-PAT-009]
- supported (p=0.96): His expertise includes edge computing and resource budgeting for IoT/MCU systems. [SYN-PUB-07301, SYN-PUB-07302, SYN-PRJ-0151, SYN-PRJ-0503]
- supported (p=1): Kardiolink a.d. is a medtech and digital health company based in Novi Sad. [C005]
- supported (p=1): Kardiolink a.d. has 112 employees and was founded in 2004. [C005]
- supported (p=1): Kardiolink designs and manufactures cardiac monitoring devices and related cloud software. [C005]
- supported (p=1): Its core product line includes KL-Patch 72, a single-use adhesive ECG monitoring patch for up to 72 hours. [C005]
- supported (p=1): Its technology stack includes ADS1293 and ADS1298 analog front ends, nRF52840 SoC, FreeRTOS on ARM Cortex-M4, and lossless ECG compression using a modified SZ algorithm. [C005]
- supported (p=1): Kardiolink deploys around 2,200 devices per month and is projected to reach 4,000 devices per month by Q2 next year. [C005-CH2]
- supported (p=0.99): Kardiolink currently generates roughly 2 TB of raw ECG signal per month and spends about €7,400 per month on cloud storage. [C005-CH2]
- supported (p=1): Kardiolink’s current lossless compression achieves about 3:1, and the company needs a better lossless ECG-aware algorithm. [C005-CH2]
- supported (p=1): Kardiolink has a labelled dataset of about 140,000 30-minute ECG segments available under NDA for algorithm development and benchmarking. [C005-CH2]
