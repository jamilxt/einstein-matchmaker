# Critic evaluation, hard set (live (OpenAI Decisions API, gpt-6-luna))

9 researcher-company pairs from every live run. Subtle errors planted; true claims generated directly from dataset records (never seen by the Critic before).

- Planted errors caught: **53 / 53**
- True claims wrongly blocked: **0 / 72**
- 9 concurrent Critic checks in 595 ms; spend $0.00723

| Planted error | Caught |
| --- | --- |
| off_by_one_size | 9 / 9 |
| wrong_title | 9 / 9 |
| wrong_city | 9 / 9 |
| wrong_sector | 9 / 9 |
| neighbour_field | 9 / 9 |
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


## False blocks (true claims the Critic rejected)

