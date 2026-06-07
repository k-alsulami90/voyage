---
target: screen-docs.jsx
total_score: 34
p0_count: 0
p1_count: 1
timestamp: 2026-06-07T14-16-40Z
slug: screen-docs-jsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | StatusDot + kind badge + search active state |
| 2 | Match System / Real World | 3 | "Vault" reads naturally |
| 3 | User Control and Freedom | 4 | Filter + sort + search + view + clear back |
| 4 | Consistency and Standards | 3 | Cost display duplicated; SortMenu icon mismatch |
| 5 | Error Prevention | 4 | Confirm before delete, search clearable |
| 6 | Recognition vs Recall | 4 | Filter counts + sort labels + view icons |
| 7 | Flexibility and Efficiency | 4 | Sort + filter + search + grid/list |
| 8 | Aesthetic and Minimalist | 3 | StatusDot label uppercase mono cascades |
| 9 | Error Recovery | 3 | Toast on delete error |
| 10 | Help and Documentation | 3 | Empty + filter-narrowed contextual CTA |
| **Total** | | **34/40** | **Good** |

## Anti-Patterns Verdict — pass with one residual

No hero-metric, no identical card grid, no glass overuse. One residual: StatusDot label uppercase mono cascades on every tile/row.

## Priority Issues

- [P1] StatusDot label uppercase mono. Renders on every doc tile and row (8 docs = 8 stacked eyebrows). Fix: drop uppercase + mono. Lowercase sans 10px ink-mute. Command: /impeccable quieter
- [P2] Cost display ternary duplicated between DocTileGrid and DocRowList. Fix: extract fmtDocCost helper. Command: /impeccable polish
- [P2] SortMenu uses IconSwap (currency-exchange icon, wrong semantic for sorting). Fix: drop icon or use IconFilter. Command: /impeccable polish
- [P2] View toggle pills 32x28 (under HIG floor). Fix: 36x32. Command: /impeccable adapt
- [P3] FAB duplicates inline grid Add tile. Fix: drop inline tile. Command: /impeccable distill

## Persona Red Flags

**Casey**: View toggle 32x28 small.
**Jordan**: Empty state with CTA excellent. Sort/view labeled.

## Minor Observations

- "Newest" sort relies on implicit loadDocuments contract.
- Sort dropdown uses outside-click scrim — clean.
- Grid kind badge 9px — small but only shown when file exists.
