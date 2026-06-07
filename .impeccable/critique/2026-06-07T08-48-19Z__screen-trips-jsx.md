---
target: screen-trips.jsx
total_score: 27
p0_count: 0
p1_count: 3
timestamp: 2026-06-07T08-48-19Z
slug: screen-trips-jsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Skeleton load, smart-track status pill; trip cards don't show sync state |
| 2 | Match System / Real World | 3 | Plain language, "Up next" reads natural |
| 3 | User Control and Freedom | 3 | Scope chips + search clear; no swipe-between-scopes |
| 4 | Consistency and Standards | 3 | Two dark hero cards diverge in intent |
| 5 | Error Prevention | 3 | Mostly read-only, low surface area |
| 6 | Recognition vs Recall | 3 | Top Insights button is icon-only without text |
| 7 | Flexibility and Efficiency | 2 | No keyboard nav for power users |
| 8 | Aesthetic and Minimalist | 2 | Two dark hero cards + KPI tile grid + uppercase eyebrows = visual noise |
| 9 | Error Recovery | 3 | Toasts handle most surfaces |
| 10 | Help and Documentation | 2 | Zero contextual hints |
| **Total** | | **27/40** | **Acceptable** |

## Anti-Patterns Verdict — fail

Trips home still carries three of the bans: hero-metric template, identical card grid (stat trio), tiny uppercase tracked mono eyebrows. The v63 identity shift moved the surface aesthetic; this screen still has the structural slop underneath.

## Priority Issues

- [P1] Two competing dark statement cards (Smart Track + Global Insights Preview). Fix: demote Insights Preview to a quiet one-line invite. Command: /impeccable distill screen-trips.jsx
- [P1] Hero-metric template + KPI tile grid inside Insights Preview card. Same pattern v63 removed from Insights itself, still here. Command: /impeccable distill
- [P1] Uppercase mono eyebrows still inline at lines 152, 179 — SectionLabel fix didn't reach them. Command: /impeccable quieter
- [P2] Wrong headline metric — 56px serif number is `countries`; PRODUCT.md says money math is load-bearing.
- [P2] Layout-property `transition: width` on budget bar (line 381). Detector caught. Use transform: scaleX.

## Persona Red Flags

**Casey (Mobile)**: Insights button is top-right, unreachable by thumb. Search button is 30x30, under 44 floor.
**Jordan (First-Timer)**: Sparkle icon top-right is unlabeled. Stat-trio decoration isn't actionable. No "create trip" CTA visible on landing.

## Minor Observations

- "ALL TRIPS" eyebrow shouts without earning it.
- 9.5px mono uppercase labels are sub-AA contrast.
- Aurora gradient is generic SaaS-dashboard.
