---
target: screen-analytics.jsx
total_score: 29
p0_count: 1
p1_count: 4
timestamp: 2026-06-07T14-38-14Z
slug: screen-analytics-jsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Burn-pct +/-, chart selection, today highlight |
| 2 | Match System / Real World | 3 | "Day 5" reads natural |
| 3 | User Control and Freedom | 3 | Bar tap select; no filters |
| 4 | Consistency and Standards | 2 | 4 hero-metric instances + 2 dark statement cards + 9 mono eyebrows |
| 5 | Error Prevention | 4 | Read-only |
| 6 | Recognition vs Recall | 3 | Chart legend + numbered days |
| 7 | Flexibility and Efficiency | 3 | Bar tap detail |
| 8 | Aesthetic and Minimalist | 1 | Highest slop density of any screen |
| 9 | Error Recovery | 3 | No errors |
| 10 | Help and Documentation | 3 | Chart legend |
| **Total** | | **29/40** | **Acceptable** |

## Anti-Patterns Verdict — heavy fail

Most pattern-dense screen in chain. 4 hero-metric templates (Daily Avg hero, Peak Day card, Lowest Day card, Top Transaction card). Identical 4-cell card grid in Burn Rate summary (each cell is its own mini hero-metric = 8 total instances). 2 dark statement cards stacked (Daily Avg + Burn Rate). 9 uppercase mono tracked eyebrows scattered inline. The actual viz (bar chart + day-by-day list + pie) is excellent; the chrome wrapping them is slop.

## Priority Issues

- [P0] Burn Rate 4-cell identical grid (Spent/Remaining/Daily avg/Projected) -- both identical-card-grid AND 4 mini hero-metrics. Last impression of analytics = SaaS dashboard. Fix: rebuild as editorial sentence with bolded inline numbers. Command: /impeccable distill
- [P1] Daily Average hero (44px serif + uppercase mono eyebrow). Fix: editorial sentence in dark card. Command: bundled
- [P1] Peak/Lowest 2-up card grid -- duplicates info already in chart (peak bar is highlighted). Fix: drop grid, annotate chart inline. Command: bundled
- [P1] Top Transaction uppercase mono eyebrow. Fix: drop eyebrow, "Top expense" quiet label. Command: /impeccable quieter
- [P1] 9 uppercase mono tracked eyebrows. Fix: sentence-case sans cascade. Command: bundled

## Persona Red Flags

**Casey**: Long scroll. Bar chart bars 18px tappable.
**Jordan**: "Projected" assumes pace continues -- no inline explanation.

## Minor Observations

- Hero burn-pct color uses ad-hoc oklch (should use --clay / --moss tokens).
- "Running total" polyline could be slightly thicker.
- Selected day detail card uses rgba white inside dark card.
