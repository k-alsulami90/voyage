---
target: screen-settings.jsx
total_score: 33
p0_count: 0
p1_count: 3
timestamp: 2026-06-08T08-39-11Z
slug: screen-settings-jsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Save spinner, copy ✓, archived state |
| 2 | Match System / Real World | 3 | "Crew/Travelers" friendly |
| 3 | User Control and Freedom | 4 | Per-field edit toggles, cancel, confirms |
| 4 | Consistency and Standards | 2 | Crew dark card hero + 3-cell role grid + 5 mono sub-labels |
| 5 | Error Prevention | 4 | Confirm destructive, explicit save |
| 6 | Recognition vs Recall | 4 | Icon labels, field hints |
| 7 | Flexibility and Efficiency | 4 | Per-field edit, currency conversion |
| 8 | Aesthetic and Minimalist | 2 | Dark-card-hero pattern still present |
| 9 | Error Recovery | 3 | Toast + inline error |
| 10 | Help and Documentation | 3 | FX hint, countries example |
| **Total** | | **33/40** | **Good** |

## Anti-Patterns Verdict — fail

Crew dark statement card with 3-cell role tally + hero-metric headline (same pattern removed from 6 other screens). Five uppercase mono sub-labels in EditableTripParams drawers. activeInvites + permission matrix footer + TRIP ID footer all uppercase mono.

## Priority Issues

- [P1] Crew dark statement card with 3-cell role tally grid + uppercase mono eyebrow + 20px serif "travelers" headline. Fix: drop card, keep avatars+invite, role counts as inline sentence. Command: /impeccable distill
- [P1] 5 uppercase mono sub-labels in EditableTripParams (Currency, Amount, Home currency, Local currency, USD→X rate). Fix: shared paramLabelStyle sentence-case sans semibold. Command: /impeccable quieter
- [P1] activeInvites mono header + permission matrix mono footer + TRIP ID footer. Fix: SectionLabel + sentence-case + tighter TRIP ID. Command: bundled with quieter

## Persona Red Flags

**Casey**: Per-field edit good UX. Multi-currency pill wrap scrolls.
**Jordan**: "Trip-scoped note" eyebrow opaque; role pills don't hint at permissions.

## Minor Observations

- 3-cell role tally redundant with per-member role pills.
- TRIP ID footer shows full UUID with 0.16em tracking — too verbose.
- Cover style picker (5 named styles) could be deprecated with real uploads.
