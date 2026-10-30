# Critic red-team evaluation (live (OpenAI Decisions API, gpt-6-luna))

Source proposals: `docs/evidence/run-03-live/proposals.md` (approved in a live run). Errors were planted in copies of their claims; true claims were re-checked unchanged.

- Planted errors caught: **18 / 18**
- True claims wrongly blocked: **0 / 35**
- Wall clock: 783 ms for 6 concurrent Critic checks; spend $0.00385

| Error type | Caught |
| --- | --- |
| invented_id | 3 / 3 |
| foreign_record | 3 / 3 |
| off_topic_expertise | 3 / 3 |
| fabricated_company_fact | 3 / 3 |
| inflated_researcher_fact | 3 / 3 |
| changed_number | 3 / 3 |

## Every planted error

- **invented_id** CAUGHT (SYN-PUB-99902 does not exist in the dataset): Krisztina Kiss’s expertise includes industrial cybersecurity, network traffic analysis, machine learning and statistical modelling, industrial control systems, anomaly detection, one-class classification, SCADA security, statistical baseline modelling, Modbus, DNP3, unsupervised learning, network intrusion detection, and protocol traffic analysis. [SYN-PUB-99902]
- **foreign_record** CAUGHT (SYN-PUB-00001 belongs to neither R1008 nor C001): Krisztina Kiss’s expertise includes industrial cybersecurity, network traffic analysis, machine learning and statistical modelling, industrial control systems, anomaly detection, one-class classification, SCADA security, statistical baseline modelling, Modbus, DNP3, unsupervised learning, network intrusion detection, and protocol traffic analysis. [SYN-PUB-00001]
- **off_topic_expertise** CAUGHT (support p=0.05): Krisztina Kiss has published extensively on formal methods and program verification. [SYN-PUB-10472, SYN-PUB-10473]
- **fabricated_company_fact** CAUGHT (support p=0): ArmaturaSec d.o.o. already runs a 25-person in-house machine-learning research team. [C001]
- **inflated_researcher_fact** CAUGHT (support p=0.02): Krisztina Kiss has supervised ten industrial PhD theses with ArmaturaSec d.o.o.. [R1008]
- **changed_number** CAUGHT (support p=0): ArmaturaSec d.o.o. is a 201-person cybersecurity company based in Zrenjanin, founded in 2008. [C001]
- **invented_id** CAUGHT (SYN-PUB-99900 does not exist in the dataset): His expertise includes condition-based and predictive maintenance for biomass densification equipment, reliability and failure modelling of pellet mills and briquetting presses, wear and degradation analysis, condition monitoring, and stochastic/statistical modelling for maintenance decision support. [SYN-PUB-99900]
- **foreign_record** CAUGHT (SYN-PUB-00001 belongs to neither R0135 nor C007): His expertise includes condition-based and predictive maintenance for biomass densification equipment, reliability and failure modelling of pellet mills and briquetting presses, wear and degradation analysis, condition monitoring, and stochastic/statistical modelling for maintenance decision support. [SYN-PUB-00001]
- **off_topic_expertise** CAUGHT (support p=0): Veljko Savić has published extensively on formal methods and program verification. [SYN-PUB-01784, SYN-PUB-01785]
- **fabricated_company_fact** CAUGHT (support p=0): Suncokret Eko d.o.o. already runs a 25-person in-house machine-learning research team. [C007]
- **inflated_researcher_fact** CAUGHT (support p=0.01): Veljko Savić has supervised ten industrial PhD theses with Suncokret Eko d.o.o.. [R0135]
- **changed_number** CAUGHT (support p=0): Suncokret Eko d.o.o. has 93 employees and was founded in 2017. [C007]
- **invented_id** CAUGHT (SYN-PUB-99901 does not exist in the dataset): His research profile includes portable photometric methods for groundwater and water-quality monitoring. [SYN-PUB-99901]
- **foreign_record** CAUGHT (SYN-PUB-00001 belongs to neither R0679 nor C015): His research profile includes portable photometric methods for groundwater and water-quality monitoring. [SYN-PUB-00001]
- **off_topic_expertise** CAUGHT (support p=0): Goran Radulović has published extensively on formal methods and program verification. [SYN-PUB-07641, SYN-PUB-07642]
- **fabricated_company_fact** CAUGHT (support p=0): Kristal Voda preduzetnik already runs a 25-person in-house machine-learning research team. [C015]
- **inflated_researcher_fact** CAUGHT (support p=0): Goran Radulović has supervised ten industrial PhD theses with Kristal Voda preduzetnik. [R0679]
- **changed_number** CAUGHT (support p=0): Kristal Voda has 9 employees and was founded in 2002. [C015]

## True claims the Critic blocked (false positives)

