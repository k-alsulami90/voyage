---
target: screen-app-settings.jsx
total_score: 34
p0_count: 0
p1_count: 1
timestamp: 2026-06-08T08-45-47Z
slug: screen-app-settings-jsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Toast, toggle state, install card hides |
| 2 | Match System / Real World | 3 | "Pro Traveler" is SaaS cliché |
| 3 | User Control and Freedom | 4 | Confirm on destructive |
| 4 | Consistency and Standards | 3 | Profile hero-metric + 3 stat pills + footer mono |
| 5 | Error Prevention | 4 | Confirm reset/sign-out/delete |
| 6 | Recognition vs Recall | 4 | Icon + label rows |
| 7 | Flexibility and Efficiency | 3 | Per-field edit, dark/lang toggles |
| 8 | Aesthetic and Minimalist | 3 | One residual hero-metric (profile) |
| 9 | Error Recovery | 3 | Toast on save fail |
| 10 | Help and Documentation | 3 | Privacy + iOS hint |
| **Total** | | **34/40** | **Good** |

## Anti-Patterns Verdict — fail with one residual

Profile card has uppercase mono "PRO TRAVELER" eyebrow + 22px serif name + 3 statPill micro-pills (mono uppercase). Footer "BUILT IN MAKKAH" uppercase mono 0.16em tracked.

Dark card surface justified (single profile anchor, not stacked). Content shape is the slop.

## Priority Issues

- [P1] Profile card hero-metric: "PRO TRAVELER" eyebrow (marketing cliché) + 3 statPill mono uppercase pills. Fix: drop eyebrow, replace pills with sentence "N trips · M days · K countries". Command: /impeccable distill
- [P2] Footer "BUILT IN MAKKAH" uppercase mono 0.16em. Fix: sentence-case "Built in Makkah" no tracking, keep mono for v-number consistency. Command: bundled

## Persona Red Flags

**Casey**: Per-field expand-edit good.
**Jordan**: "Pro Traveler" implies a non-pro tier that doesn't exist.

## Minor Observations

- Avatar -4deg rotation is stylistic personality, not decorative tilt.
- "Built in Makkah" sentiment should stay — only the typography shout goes.
- statPill const can inline after the rewrite (single use).
