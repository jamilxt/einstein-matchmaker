# Critic evaluation, hard set (STUB decider: wiring test only, numbers are meaningless)

9 researcher-company pairs from every live run. Subtle errors planted; true claims generated directly from dataset records (never seen by the Critic before).

- Planted errors caught: **8 / 53**
- True claims wrongly blocked: **0 / 72**
- 9 concurrent Critic checks in 406 ms; spend $0.00682

| Planted error | Caught |
| --- | --- |
| off_by_one_size | 0 / 9 |
| wrong_title | 0 / 9 |
| wrong_city | 0 / 9 |
| wrong_sector | 0 / 9 |
| neighbour_field | 0 / 9 |
| same_field_foreign_paper | 8 / 8 |

| True claim type | Wrongly blocked |
| --- | --- |
| true_title | 0 / 9 |
| true_field | 0 / 9 |
| true_publication | 0 / 9 |
| true_topic | 0 / 9 |
| true_size | 0 / 9 |
| true_city | 0 / 9 |
| true_sector | 0 / 9 |
| true_challenge | 0 / 9 |

## Misses (planted errors that got through)

- **off_by_one_size** (p=0.84; real: 26): Kredo Fintech has 27 employees. [C010]
- **wrong_title** (p=0.97; real: Full Professor): Branislav Žarković is an Assistant Professor in the Department of Finance and Banking. [R0801]
- **wrong_city** (p=0.61; real: NTP Novi Sad): Kredo Fintech is based in Zrenjanin. [C010]
- **wrong_sector** (p=0.75; real: Fintech): Kredo Fintech works in Cybersecurity. [C010]
- **neighbour_field** (p=0.68; field of a colleague in Faculty of Economics in Subotica): Branislav Žarković has published on information systems. [SYN-PUB-08746, SYN-PUB-08747]
- **off_by_one_size** (p=0.95; real: 12): FinPuls Tehnologije d.o.o. has 13 employees. [C021]
- **wrong_title** (p=0.95; real: docent): Andrea Malešević is an Assistant Professor in the Department of Mathematics and Informatics. [R0217]
- **wrong_city** (p=0.75; real: Novi Sad): FinPuls Tehnologije d.o.o. is based in Zrenjanin. [C021]
- **wrong_sector** (p=0.68; real: Fintech — B2B payment infrastructure and reconciliation): FinPuls Tehnologije d.o.o. works in Cybersecurity. [C021]
- **neighbour_field** (p=0.55; field of a colleague in Prirodno-matematički fakultet): Andrea Malešević has published on statistička fizika i kondenzovana materija. [SYN-PUB-02765, SYN-PUB-02766]
- **off_by_one_size** (p=0.95; real: 27): DriveLogic Vojvodina d.o.o. has 28 employees. [C018]
- **wrong_title** (p=0.95; real: Senior Research Associate): Martina Lačoková is an Assistant Professor in the Department of Computing and Control Engineering. [R0919]
- **wrong_city** (p=0.75; real: Novi Sad): DriveLogic Vojvodina d.o.o. is based in Zrenjanin. [C018]
- **wrong_sector** (p=0.68; real: Automotive and mobility software): DriveLogic Vojvodina d.o.o. works in Cybersecurity. [C018]
- **neighbour_field** (p=0.51; field of a colleague in Faculty of Technical Sciences): Martina Lačoková has published on discrete mathematics. [SYN-PUB-09743, SYN-PUB-09744]
- **off_by_one_size** (p=0.97; real: 187): Pannonia Osiguranje-Tech a.d. has 188 employees. [C013]
- **wrong_title** (p=0.88; real: Senior Research Associate): Željko Mamužić is an Assistant Professor in the Department of Traffic Engineering. [R0271]
- **wrong_city** (p=0.95; real: Subotica): Pannonia Osiguranje-Tech a.d. is based in Zrenjanin. [C013]
- **wrong_sector** (p=0.86; real: Insurtech — usage-based motor and property insurance): Pannonia Osiguranje-Tech a.d. works in Cybersecurity. [C013]
- **neighbour_field** (p=0.51; field of a colleague in Faculty of Technical Sciences): Željko Mamužić has published on discrete mathematics. [SYN-PUB-03398, SYN-PUB-03399]
- **off_by_one_size** (p=0.75; real: 212): AutomVoj a.d. has 213 employees. [C003]
- **wrong_title** (p=0.97; real: Assistant Professor): Veljko Pantelić is an Associate Professor in the Department of Computing and Control Engineering. [R0995]
- **wrong_city** (p=0.95; real: Zrenjanin): AutomVoj a.d. is based in Novi Sad. [C003]
- **wrong_sector** (p=0.55; real: Robotics and industrial automation): AutomVoj a.d. works in Cybersecurity. [C003]
- **neighbour_field** (p=0.51; field of a colleague in Faculty of Technical Sciences): Veljko Pantelić has published on discrete mathematics. [SYN-PUB-10372, SYN-PUB-10373]
- **off_by_one_size** (p=0.95; real: 31): Suncokret Eko d.o.o. has 32 employees. [C007]
- **wrong_title** (p=0.97; real: Associate Professor): Veljko Savić is an Assistant Professor in the Department of Production Engineering. [R0135]
- **wrong_city** (p=0.75; real: Novi Sad): Suncokret Eko d.o.o. is based in Zrenjanin. [C007]
- **wrong_sector** (p=0.68; real: Cleantech — biomass and organic waste valorisation): Suncokret Eko d.o.o. works in Cybersecurity. [C007]
- **neighbour_field** (p=0.51; field of a colleague in Faculty of Technical Sciences): Veljko Savić has published on discrete mathematics. [SYN-PUB-01784, SYN-PUB-01785]
- **off_by_one_size** (p=0.84; real: 67): ArmaturaSec d.o.o. has 68 employees. [C001]
- **wrong_title** (p=0.97; real: Full Professor): Krisztina Kiss is an Assistant Professor in the Department of Computing and Control Engineering. [R1008]
- **wrong_city** (p=0.95; real: Zrenjanin): ArmaturaSec d.o.o. is based in Novi Sad. [C001]
- **wrong_sector** (p=0.51; real: Cybersecurity): ArmaturaSec d.o.o. works in Game development. [C001]
- **neighbour_field** (p=0.51; field of a colleague in Faculty of Technical Sciences): Krisztina Kiss has published on discrete mathematics. [SYN-PUB-10472, SYN-PUB-10473]
- **off_by_one_size** (p=0.75; real: 112): Kardiolink a.d. has 113 employees. [C005]
- **wrong_title** (p=0.97; real: Full Professor): Branislav Stojanović is an Assistant Professor in the Department of Computing and Control Engineering. [R0641]
- **wrong_city** (p=0.61; real: Novi Sad): Kardiolink a.d. is based in Zrenjanin. [C005]
- **wrong_sector** (p=0.75; real: Medtech and digital health): Kardiolink a.d. works in Cybersecurity. [C005]
- **neighbour_field** (p=0.51; field of a colleague in Faculty of Technical Sciences): Branislav Stojanović has published on discrete mathematics. [SYN-PUB-07294, SYN-PUB-07295]
- **off_by_one_size** (p=0.95; real: 9): Kristal Voda preduzetnik has 10 employees. [C015]
- **wrong_title** (p=0.97; real: Associate Professor): Goran Radulović is an Assistant Professor in the Department of Applied and Engineering Chemistry. [R0679]
- **wrong_city** (p=0.68; real: Zrenjanin): Kristal Voda preduzetnik is based in Novi Sad. [C015]
- **wrong_sector** (p=0.68; real: Water quality testing and on-site treatment equipment for food industry): Kristal Voda preduzetnik works in Cybersecurity. [C015]
- **neighbour_field** (p=0.51; field of a colleague in Faculty of Technology): Goran Radulović has published on chemical engineering. [SYN-PUB-07641, SYN-PUB-07642]

## False blocks (true claims the Critic rejected)

