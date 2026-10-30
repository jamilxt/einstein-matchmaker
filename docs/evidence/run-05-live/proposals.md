# Proposals (live run)

## A per-driver telematics risk score for Pannonia Osiguranje-Tech’s motor pricing engine

**Pair:** Željko Mamužić (R0271, Department of Traffic Engineering) with Pannonia Osiguranje-Tech a.d. (C013), challenge C013-CH1
**Critic:** approved after 1 draft(s). Screening score 2.02 / 3.

### The problem
Pannonia Osiguranje-Tech a.d. already records detailed telematics events from about 9,400 black-box devices, but its pricing engine still treats drivers only by age band and vehicle category. The company’s PostgreSQL warehouse holds roughly 380 million trip-event rows over four years, including speed samples every two seconds plus hard-brake, sharp-cornering and night-driving flags, yet the pricing team of four has not been able to convert those raw events into a single per-driver risk score that can be mapped directly to a loading or discount. A first in-house points score did not materially move the loss ratio, and the company wants a better model that also accounts for trip length and inferred road type, with something operational before the next annual product filing in Q1 2026.

### Research questions
1. Can a per-driver risk score built from trip-event data, trip length and inferred road type predict future claim risk better than the current age-band/vehicle-category pricing rule, and by how much on holdout data?
2. Which aggregation of raw events into driver-level features gives the most stable and pricing-ready score: trip-level counts, exposure-normalised rates, or journey-context features derived from map matching and road-type inference?
3. How can the model output be calibrated into a single score that maps cleanly to a loading or discount and can be refreshed within the company’s quarterly rating process?

### Plan
| Year | Work | Result |
| --- | --- | --- |
| 1 | Clean and structure the telematics warehouse; define driver, trip and exposure variables; build road-type inference and baseline scoring models from the 380 million event rows; compare simple points scoring with statistically grounded alternatives. | A validated feature set and benchmark model, plus a reproducible data pipeline for driver-level scoring. |
| 2 | Develop and test stronger predictive models using trip length, route context and driving-event patterns; calibrate the score into pricing bands; run back-testing against claims and loss ratio outcomes on historical cohorts. | A calibrated per-driver telematics score with measurable lift over the current rule set. |
| 3 | Integrate the final score into the rating workflow; document governance, monitoring and refresh procedures; support a pilot release ahead of the Q1 2026 filing and evaluate production performance. | A deployable scoring module and implementation package for the rating engine. |

### What each side brings
- **Company:** Pannonia Osiguranje-Tech a.d. brings access to the anonymised telematics warehouse, domain knowledge of its current rating engine and underwriting process, and operational support from its pricing and IT teams. The company can provide the raw trip-event history, the telematics hardware context, and a realistic deployment path into the existing quarterly pricing cycle.
- **Faculty:** The Faculty of Technical Sciences, University of Novi Sad, brings Željko Mamužić’s expertise in vehicle telematics data integration, GPS trajectory analytics, ETA and real-time prediction, and transport data standards. His group also brings a telematics laboratory, instrumented vehicles, GPU-based trajectory processing, and access to the shared HPC cluster for large-scale experimentation.

### Why this pair
This pair is a strong fit because the company’s problem is exactly a data-to-model translation problem in vehicle telematics, and Željko Mamužić has deep expertise in telematics interoperability, GPS trajectory analytics and real-time transport modelling. Pannonia Osiguranje-Tech already has the volume of data needed for a robust model, while the Faculty has the methods and infrastructure to turn that data into a deployable scoring system. They have also worked together before on a flood-risk mapping prototype, so there is an existing basis for collaboration.

### First step
Next month, the two sides should run a one-day scoping workshop led by Mirela Bogdanović and Dragan Fekete for Pannonia Osiguranje-Tech, and by Željko Mamužić for the Faculty, to agree the data schema, define the training target, select the first 12 months of telematics history, and specify the score-to-pricing mapping for a pilot cohort.

### Claims and sources
- supported (p=1): Željko Mamužić is a Senior Research Associate in the Department of Traffic Engineering at the Faculty of Technical Sciences, University of Novi Sad. [R0271]
- supported (p=1): Željko Mamužić’s expertise includes vehicle telematics data integration and interoperability, GPS trajectory analytics and map matching, ETA estimation and real-time transit prediction, multisource sensor fusion and uncertainty-aware transport modeling, and cross-border freight telematics and federated data exchange. [SYN-PUB-03399, SYN-PUB-03400, SYN-PUB-03231, SYN-PUB-03404, SYN-PRJ-0034, SYN-PUB-03398, SYN-PUB-03403, SYN-PUB-03406, SYN-PUB-03401, SYN-PUB-03402, SYN-PUB-03405, SYN-PRJ-0035, SYN-PUB-03230]
- supported (p=1): Pannonia Osiguranje-Tech a.d. is an insurtech company based in Subotica, founded in 2009, with 187 employees. [C013]
- supported (p=1): Pannonia Osiguranje-Tech a.d. offers usage-based motor insurance with a telematics black-box device, smart-home property insurance, agricultural property insurance, group motor fleet policies for SME fleets up to 50 vehicles, and expat and short-stay property cover. [C013]
- supported (p=1): Pannonia Osiguranje-Tech a.d. uses proprietary PanTrack G2 telematics hardware, a PostgreSQL data warehouse, a Python-based batch scoring pipeline, Guidewire PolicyCenter, OpenStreetMap and QGIS, a REST API to MeteoVoj d.o.o., Power BI dashboards, and Salesforce CRM. [C013]
- supported (p=1): Pannonia Osiguranje-Tech a.d. has about 9,400 telematics devices and roughly 41,000 active policyholders. [C013]
- supported (p=1): Pannonia Osiguranje-Tech a.d. stores roughly 380 million trip-event rows covering the last four years and wants a per-driver telematics risk score that can be mapped directly to a loading or discount. [C013-CH1]
- supported (p=1): The company wants the score to account for trip length and inferred road type and to run in the rating engine before the next annual product filing in Q1 2026. [C013-CH1]
- supported (p=1): Pannonia Osiguranje-Tech a.d. previously completed a small ERASMUS+ project with the Faculty of Technical Sciences in 2021 to prototype a flood-risk mapping tool for the Sava floodplain. [C013]
- supported (p=1): Željko Mamužić completed undergraduate and master’s studies in Traffic Engineering at the Faculty of Technical Sciences, University of Novi Sad, and earned a PhD in 2013 on interoperability protocols for heterogeneous vehicle telematics systems. [R0271]
- supported (p=1): Željko Mamužić joined the department as a Research Associate in 2014 and was promoted to Senior Research Associate in 2019. [R0271]

## Lossless, ECG-aware compression for KL-Patch data to cut cloud storage without changing the regulated workflow

**Pair:** Branislav Stojanović (R0641, Department of Computing and Control Engineering) with Kardiolink a.d. (C005), challenge C005-CH2
**Critic:** approved after 1 draft(s). Screening score 2.28 / 3.

### The problem
Kardiolink a.d. in Novi Sad is generating roughly 2 TB of raw ECG data per month from KL-Patch devices, and its current lossless pipeline only achieves about 3:1 compression. That leaves the company spending about €7,400 per month on cloud storage today, with usage projected to rise to around 4,000 devices per month by Q2 next year. Because the current regulatory submission is built around lossless processing, Kardiolink needs a better lossless algorithm rather than a lossy redesign. The technical target is to exploit the quasi-periodic structure of ECG, baseline wander, and wearable-noise characteristics while preserving full signal fidelity for clinical reporting and regulatory continuity.

### Research questions
1. Can a new ECG-specific lossless compression pipeline reduce cloud-bound storage from 3:1 to at least 5:1 on KL-Patch 72 data, while remaining bit-exact on decompression and compatible with the existing clinical workflow?
2. Which preprocessing and prediction steps best exploit ECG structure across 30-minute segments from about 140,000 labelled examples: channel-wise differencing, adaptive baseline modelling, entropy coding, or segment-type switching?
3. Can the algorithm run within the existing KL-Patch firmware and upload workflow constraints, without increasing device-side power or memory use beyond the current embedded budget?

### Plan
| Year | Work | Result |
| --- | --- | --- |
| 1 | Collect and characterise the 140,000 30-minute ECG segments under NDA; build a baseline benchmark against the current 3:1 pipeline; design candidate lossless schemes tailored to three-channel 250 Hz ECG and evaluate compression ratio, CPU load, and memory footprint. | A validated benchmark suite and a shortlist of ECG-aware lossless methods with quantified gains over the current pipeline. |
| 2 | Develop and integrate the best-performing method into a prototype firmware and host-side decompression chain; test end-to-end on KL-Patch 72 data and compare storage, upload time, and reconstruction integrity against the existing workflow. | A working prototype that is compatible with Kardiolink’s current data path and demonstrates a substantial storage reduction on real data. |
| 3 | Harden the solution for regulatory and operational use: robustness testing across patient cohorts and noise conditions, documentation for technical-file update, and preparation of validation evidence for deployment at projected scale. | A deployment-ready lossless compression module and the evidence package needed for internal adoption and regulatory review. |

### What each side brings
- **Company:** Kardiolink a.d. brings a real production problem, access to the KL-Patch 72 data stream, approximately 140,000 labelled 30-minute ECG segments under NDA, and the practical constraints of a regulated medtech workflow already tied to lossless compression. The company also brings firmware, cloud, and clinical teams that can test whether a new method actually fits the product.
- **Faculty:** Branislav Stojanović brings expertise in embedded systems, signal processing, data compression, and anomaly-preserving methods for resource-constrained devices. His group has prior work on embedded signal compression, anomaly-aware lossy and lossless coding, adaptive sampling, and low-power IoT sensing, plus laboratory equipment for algorithm prototyping and embedded validation.

### Why this pair
This pair is well matched because the problem is not generic compression; it is ECG-specific, regulated, and constrained by firmware, storage cost, and clinical fidelity. Kardiolink has the exact data volume, device architecture, and regulatory context, while Branislav Stojanović has a research profile focused on compression algorithms for sensor streams and preserving diagnostic information under tight embedded constraints. That combination makes it realistic to build and validate an algorithm that is both scientifically novel and deployable.

### First step
Next month, the two sides should agree the data-sharing protocol under NDA, define the benchmark split on the 140,000 segments, and run a two-week baseline study on the current compression chain so they can lock the target metrics before algorithm development starts.

### Claims and sources
- supported (p=1): Branislav Stojanović is a Full Professor at the Faculty of Technical Sciences, Department of Computing and Control Engineering. [R0641]
- supported (p=1): Branislav Stojanović’s fields include Embedded Systems and IoT, Signal Processing, Data Compression, and Computer Engineering. [R0641]
- supported (p=1): Branislav Stojanović’s expertise includes embedded signal compression for resource-constrained sensor nodes. [SYN-PUB-07294, SYN-PUB-07295, SYN-PUB-03183, SYN-PUB-07297, SYN-PUB-07298, SYN-PUB-00967, SYN-PUB-07301, SYN-PUB-04195, SYN-PRJ-0150, SYN-PAT-009]
- supported (p=1): Branislav Stojanović’s expertise includes anomaly-preserving and fault-aware lossy compression. [SYN-PUB-07297, SYN-PUB-07302, SYN-PUB-04195, SYN-PRJ-0150, SYN-PAT-009]
- supported (p=0.98): Branislav Stojanović’s expertise includes adaptive sampling, edge processing, and low-power IoT sensing. [SYN-PUB-07296, SYN-PUB-07299, SYN-PUB-07300, SYN-PRJ-0151]
- supported (p=1): Branislav Stojanović’s expertise includes embedded implementations on microcontrollers and fixed-point DSP. [SYN-PUB-07294, SYN-PUB-03183, SYN-PUB-07298, SYN-PUB-07301]
- supported (p=1): Branislav Stojanović’s expertise includes industrial, structural health, and vibration monitoring applications. [SYN-PUB-07295, SYN-PUB-07297, SYN-PUB-04195, SYN-PRJ-0150, SYN-PUB-00967]
- supported (p=1): Kardiolink a.d. is a medtech and digital health company. [C005]
- supported (p=1): Kardiolink a.d. has 112 employees. [C005]
- supported (p=1): Kardiolink a.d. was founded in 2004. [C005]
- supported (p=1): Kardiolink a.d. is based in Novi Sad. [C005]
- supported (p=1): Kardiolink a.d. designs and manufactures cardiac monitoring devices in Novi Sad. [C005]
- supported (p=1): Kardiolink a.d.’s core product is the KL-Patch line, including the KL-Patch 72 single-use adhesive ECG monitoring patch. [C005]
- supported (p=1): Kardiolink a.d. also offers KL-Patch 14, KardioPortal, KL-Reader, and custom OEM patch manufacturing. [C005]
- supported (p=1): Kardiolink a.d. uses ADS1293 and ADS1298 analog front-end ICs, nRF52840 SoC, FreeRTOS on ARM Cortex-M4, modified SZ lossless ECG compression, AWS S3 and Glacier, IEC 62304-compliant toolchain, Altium Designer, Python, and MATLAB. [C005]
- supported (p=1): Kardiolink a.d. has twelve people working across hardware, firmware, and algorithm development and a shared lab for electronics prototyping, signal acquisition testing, and EMC pre-compliance testing. [C005]
- supported (p=1): Kardiolink a.d. deploys around 2,200 devices per month and projects around 4,000 devices per month by Q2 next year. [C005-CH2]
- supported (p=1): Each KL-Patch 72 device generates roughly 900 MB of raw 16-bit ECG samples over its wear period at 250 Hz across three channels. [C005-CH2]
- supported (p=1): Kardiolink a.d. generates roughly 2 TB of raw ECG signal per month from field devices. [C005-CH2]
- supported (p=1): Kardiolink a.d.’s current lossless compression gives about a 3:1 ratio and cloud storage costs have reached €7,400 per month. [C005-CH2]
- supported (p=1): Kardiolink a.d. has a labelled dataset of about 140,000 30-minute segments available under NDA for algorithm development and benchmarking. [C005-CH2]
- supported (p=1): Kardiolink a.d. needs a better lossless algorithm that understands ECG structure because its regulatory submission is built around lossless processing and changing to lossy would require a new clinical validation study and technical-file amendments. [C005-CH2]

## Prelazak FinPulsove rekoncilijacije sa satnog Spark batch procesa na near-real-time pipeline ispod 20 minuta

**Pair:** Andrea Malešević (R0217, Department of Mathematics and Informatics) with FinPuls Tehnologije d.o.o. (C021), challenge C021-CH1
**Critic:** approved after 1 draft(s). Screening score 2.03 / 3.

### The problem
FinPuls Tehnologije d.o.o. danas zatvara dnevni obračun za klijente sa 50.000 porudžbina dnevno za 70–90 minuta, iako finansijski timovi tih klijenata moraju da imaju brojke zatvorene do 08:30. Postojeći Spark batch poslovi rade na satnom intervalu; optimizacija Spark konfiguracije i partitioning-a donela je samo oko 12 minuta poboljšanja. FinPuls već prima podatke od Stripe, Adyen, Klarne i lokalnih acquirera kroz Kafka ingest, ali Kafka se ne koristi za samu rekoncilijaciju. Potreban je hibridni arhitekturni pristup koji zadržava tačnost i audibilnost, a skraćuje end-to-end vreme na manje od 20 minuta bez gubitka konzistentnosti.

### Research questions
1. Može li se postojeći Spark batch pipeline preoblikovati u hibridni micro-batch/streaming dizajn koji za klijente sa 50.000 porudžbina dnevno smanjuje end-to-end vreme rekoncilijacije sa 70–90 minuta na manje od 20 minuta uz istu tačnost?
2. Koji model obrade stanja i idempotentnog spajanja transakcija između četiri ili više payment providera daje najbolji kompromis između brzine, konzistentnosti i audit trail-a u FinPulsovom sistemu?
3. Koliki praktični dobitak donosi pomeranje rekoncilijacionog dela sa satnog Spark batch-a na Kafka-driven obradu u odnosu na postojeću optimizaciju partitioning-a, mereno na realnim klijentskim tokovima i produkcijskim SLA uslovima?

### Plan
| Year | Work | Result |
| --- | --- | --- |
| 1 | Mapiranje postojećeg toka podataka, definisanje metričkog modela za tačnost i kašnjenje, te izrada prototipa hibridnog pipeline-a nad Kafka ingest-om i postojećim Spark transformacijama. Andrea Malešević i Dragan Stanković vode tehnički dizajn i izbor modela obrade stanja. | Validiran prototip koji na reprezentativnom klijentskom skupu pokazuje gde nastaje najveće kašnjenje i koje delove procesa vredi prebaciti na near-real-time obradu. |
| 2 | Implementacija idempotentnog matching sloja, optimizacija stateful obrade i testiranje na jednom produkcijskom klijentu sa 50.000 dnevnih porudžbina. Uspostavljanje audit traga i mehanizama za rollback/replay. | Pilot verzija koja zatvara dnevni obračun za manje od 20 minuta i zadržava audibilnost za interne i eksterne revizore. |
| 3 | Stabilizacija rešenja, generalizacija za više provider formata, hardening za rad pod opterećenjem i dokumentovanje postupka migracije sa batch na hibridni model. Evaluacija troškova infrastrukture i operativnog rizika. | Produkcijski spreman modul za rekoncijaciju koji se može primeniti na više klijenata i predstavlja FinPulsov standardni put zatvaranja dana pre jutarnjeg sastanka. |

### What each side brings
- **Company:** FinPuls obezbeđuje stvarni produkcijski problem, pristup postojećem Spark/Kafka/DBT stack-u, istorijske tokove podataka sa četiri ili više providera i jasne SLA ograničenja: 50.000 porudžbina dnevno, zatvaranje pre 08:30 i cilj ispod 20 minuta. Tim takođe obezbeđuje 1–2 inženjera tokom do tri meseca za implementaciju i integraciju rezultata u postojeći sistem.
- **Faculty:** Andrea Malešević donosi ekspertizu iz distribuiranih sistema i baza podataka, optimizacije upita u visokopropusnim sistemima, projektovanja skalabilnih struktura podataka i performansnog benchmarkinga. Prirodno-matematički fakultet obezbeđuje istraživačku metodologiju, laboratorijsko okruženje sa klasterom od 24 čvora, kao i iskustvo u analizi konsistentnosti i performansi na realnim distribuiranim sistemima.

### Why this pair
Ovaj par je prirodan zato što FinPuls ima vrlo konkretan i merljiv problem migracije sa batch na hibridni model u sistemu gde brzina, konzistentnost i audit trail moraju da koegzistiraju, a Andrea Malešević upravo radi na optimizaciji upita, skalabilnim strukturama podataka i infrastrukturi javnih ključeva i distribuiranih sistema. FinPuls je dovoljno mali da brzo implementira rezultate, ali dovoljno operativno zreo da može da validira rešenje na stvarnim klijentima sa strogim rokovima. Andrea ima i ranije iskustvo procene arhitekture sistema za upravljanje sertifikatima, što pomaže pri radu sa strogošću konzistentnosti i produkcijskim migracijama.

### First step
Tokom narednog meseca, Andrea Malešević, Milena Vuković i Dragan Stanković treba da održe radionicu od 2 sata na kojoj će mapirati postojeći end-to-end tok od prijema podataka do finalnog izveštaja, označiti tačke gde se gubi vreme, definisati metrike uspeha i izabrati jedan klijentov dataset za pilot sa ciljem da se prvo meri poboljšanje na procesu od 50.000 porudžbina dnevno.

### Claims and sources
- supported (p=1): Andrea Malešević je docent na Prirodno-matematičkom fakultetu Univerziteta u Novom Sadu, na Departmanu za matematiku i informatiku. [R0217]
- supported (p=1): Andrea Malešević radi u oblastima distribuiranih sistema i baza podataka, algoritama i struktura podataka, mrežne bezbednosti i PKI. [R0217]
- supported (p=1): Andrea Malešević se bavi optimizacijom upita u visokopropusnim distribuiranim sistemima, skalabilnim strukturama podataka i efikasnim rešavanjem OCSP upita. [R0217, SYN-PRJ-0504, SYN-PUB-02768, SYN-PUB-01685, SYN-PUB-02770, SYN-PUB-02771, SYN-PUB-02772, SYN-PUB-02773]
- supported (p=1): Andrea Malešević koristi klaster od 24 čvora u Laboratoriji za distribuirane sisteme PMF-a i testna okruženja zasnovana na Apache Cassandri i PostgreSQL-u. [R0217]
- supported (p=1): Andrea Malešević je diplomirala matematiku 2012. godine i odbranila doktorsku disertaciju iz oblasti distribuiranih baza podataka 2019. godine na Prirodno-matematičkom fakultetu u Novom Sadu. [R0217]
- supported (p=1): Andrea Malešević je od 2020. radila kao asistent s doktoratom, a od 2023. kao docent na Departmanu za matematiku i informatiku. [R0217]
- supported (p=1): Andrea Malešević je imala šestomesečni konsultantski angažman 2020–2021. sa lokalnom firmom za razvoj softvera iz Novog Sada na proceni arhitekture sistema za upravljanje sertifikatima. [R0217]
- supported (p=1): FinPuls Tehnologije d.o.o. je fintech kompanija za B2B payment infrastructure i reconciliation, sa 12 zaposlenih, osnovana 2021. godine, sa sedištem u Novom Sadu. [C021]
- supported (p=1): FinPuls Tehnologije d.o.o. ima proizvode za platformu za rekoncijaciju plaćanja u realnom vremenu, konektore za Stripe, Adyen, Klarna i lokalne acquire-re, izveštajni modul sa revizijskim tragom i beta widget za cash-flow trendove. [C021]
- supported (p=1): FinPuls Tehnologije d.o.o. servisira deset aktivnih klijenata, uglavnom e-commerce operatere iz Nemačke, Austrije i Srbije, koji procesiraju između 10.000 i 80.000 porudžbina dnevno. [C021]
- supported (p=1): FinPulsova tehnologija uključuje Python, Apache Spark, Apache Kafka, PostgreSQL, TimescaleDB, AWS, dbt, Terraform, REST i webhook integracije. [C021]
- supported (p=1): FinPuls može da odvoji jednog do dva inženjera za istraživačku saradnju u trajanju do tri meseca. [C021]
- supported (p=1): FinPulsov konkretan problem je da poslovni klijenti sa 50.000 porudžbina dnevno zatvaraju dnevni obračun za 70–90 minuta, dok finansijski timovi imaju rok do 08:30, a cilj je da proces traje manje od 20 minuta bez gubitka tačnosti. [C021-CH1]
- supported (p=1): FinPuls već prima podatke od Stripe, Adyen, Klarne i lokalnih acquirera putem Kafka ingest-a, ali Kafka se ne koristi za samu rekoncijaciju. [C021-CH1]
- supported (p=1): FinPuls je već pokušao da optimizuje Spark konfiguraciju i partitioning strategiju, ali je dobitak bio oko 12 minuta. [C021-CH1]
- supported (p=1): FinPuls ima cilj da celokupan proces završi za manje od 20 minuta bez gubitka tačnosti. [C021-CH1]
- supported (p=1): FinPulsovi osnivači su Milena Vuković (CEO), Dragan Stanković (CTO) i Jovana Ilić (CPO). [C021]
- supported (p=1): FinPuls je osnovan u okviru Naučno-tehnološkog parka Novi Sad. [C021]
