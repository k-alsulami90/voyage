---
target: screen-insights.jsx
total_score: 29
p0_count: 0
p1_count: 2
timestamp: 2026-06-07T14-54-47Z
slug: screen-insights-jsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Loading skeleton, current month/year highlighted |
| 2 | Match System / Real World | 3 | LifetimeOverview sentence reads natural |
| 3 | User Control and Freedom | 3 | YearlyChart metric toggle |
| 4 | Consistency and Standards | 2 | 8 inline uppercase mono section headers bypass SectionLabel |
| 5 | Error Prevention | 4 | Read-only |
| 6 | Recognition vs Recall | 3 | Charts have axis labels |
| 7 | Flexibility and Efficiency | 3 | Metric toggle |
| 8 | Aesthetic and Minimalist | 2 | 4-cell HighlightCards identical grid + 8 mono eyebrows |
| 9 | Error Recovery | 3 | Toast on load error |
| 10 | Help and Documentation | 3 | "TOTAL", sub-lines on cards |
| **Total** | | **29/40** | **Acceptable** |

## Anti-Patterns Verdict — fail

Eight inline uppercase mono section headers all matching pattern (Last 12 months, BY YEAR, BY CATEGORY, TOP TRIPS, PACE, TRIP STATUS, MEMBERS, TOTAL footer). SectionLabel was rewritten in v63 — none of these use it.

HighlightCards is a 4-cell identical-card-grid with hero-metric in each cell. The .toUpperCase() at line 411 is explicit slop generation — i18n returns sentence-case labels then code uppercases them.

LifetimeOverview already cleaned in v66 — reference example.

## Priority Issues

- [P1] HighlightCards 4-cell identical-card-grid + repeated hero-metric. Same pattern as Analytics Burn Rate just removed in v83. Fix: rebuild as editorial sentence in single light card. Command: /impeccable distill
- [P1] 8 inline uppercase mono section headers. Fix: replace with SectionLabel component. Command: /impeccable quieter
- [P2] TOTAL footer in CategoryBreakdown uppercase mono. Fix: sentence-case. Command: bundled

## Persona Red Flags

**Casey**: Long scroll. YearlyChart toggle pills 4x12 borderline.
**Jordan**: 8 sections labeled clearly.

## Minor Observations

- LifetimeOverview is gold standard; rest of screen should follow.
- voyage wordmark footer is justified brand moment.
- it.label.toUpperCase() at 411 explicitly manufactures slop.
