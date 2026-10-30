# Critic evaluation, hard set (live (OpenAI Decisions API, gpt-6-luna))

9 researcher-company pairs from every live run. Subtle errors planted; true claims generated directly from dataset records (never seen by the Critic before).

- Planted errors caught: **52 / 53**
- True claims wrongly blocked: **12 / 72**
- 9 concurrent Critic checks in 829 ms; spend $0.00707

| Planted error | Caught |
| --- | --- |
| off_by_one_size | 9 / 9 |
| wrong_title | 9 / 9 |
| wrong_city | 9 / 9 |
| wrong_sector | 9 / 9 |
| neighbour_field | 8 / 9 |
| same_field_foreign_paper | 8 / 8 |

| True claim type | Wrongly blocked |
| --- | --- |
| true_title | 0 / 9 |
| true_field | 0 / 9 |
| true_publication | 9 / 9 |
| true_topic | 3 / 9 |
| true_size | 0 / 9 |
| true_city | 0 / 9 |
| true_sector | 0 / 9 |
| true_challenge | 0 / 9 |

## Misses (planted errors that got through)

- **neighbour_field** (p=0.61; field of a colleague in Faculty of Technical Sciences): Martina Lačoková has published on discrete mathematics. [SYN-PUB-09743, SYN-PUB-09744]

## False blocks (true claims the Critic rejected)

- **true_publication** (p=0.49): Goran Radulović co-authored "Effect of Carbonate Alkalinity on Absorbance Readings in the 1,10-Phenanthroline Iron(II) Method at Elevated pH" (2010). [SYN-PUB-07641]
- **true_publication** (p=0.03): Veljko Savić co-authored "Weibull-based failure rate estimation for flat-die pellet presses processing mixed agricultural residues" (2011). [SYN-PUB-01784]
- **true_publication** (p=0.4): Željko Mamužić co-authored "A Comparison of Map-Matching Algorithms for Low-Frequency GPS Traces in Urban Road Networks" (2011). [SYN-PUB-03398]
- **true_topic** (p=0.34): Željko Mamužić has published on map matching. [SYN-PUB-03398]
- **true_publication** (p=0.41): Branislav Žarković co-authored "Scoring micro-enterprises with little credit history" (2023). [SYN-PUB-08746]
- **true_topic** (p=0.43): Branislav Žarković has published on Scoring micro-enterprises with little credit history. [SYN-PUB-08746]
- **true_publication** (p=0.42): Veljko Pantelić co-authored "A Metamodel for IEC 61131-3 Structured Text: Design Rationale and Conformance Checking" (2015). [SYN-PUB-10372]
- **true_topic** (p=0.43): Veljko Pantelić has published on IEC 61131-3. [SYN-PUB-10372]
- **true_publication** (p=0.36): Krisztina Kiss co-authored "Statistical Baseline Modelling of Modbus/TCP Traffic in a Substation Automation Network" (2010). [SYN-PUB-10472]
- **true_publication** (p=0.48): Martina Lačoková co-authored "Generating Minimum-Size Covering Arrays for Constrained Parameter Spaces in Automotive Middleware" (2013). [SYN-PUB-09743]
- **true_publication** (p=0.28): Branislav Stojanović co-authored "Piecewise Linear Approximation for Sensor Data Reduction on 8-bit Microcontrollers" (2010). [SYN-PUB-07294]
- **true_publication** (p=0.05): Andrea Malešević co-authored "Efikasnost B+-stabla nasuprot LSM-stablu u okruženjima s intenzivnim čitanjem: empirijska analiza" (2014). [SYN-PUB-02765]
