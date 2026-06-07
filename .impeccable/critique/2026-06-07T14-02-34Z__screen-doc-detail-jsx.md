---
target: screen-doc-detail.jsx
total_score: 30
p0_count: 0
p1_count: 2
timestamp: 2026-06-07T14-02-34Z
slug: screen-doc-detail-jsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Saving spinner + upload loading + linkage status |
| 2 | Match System / Real World | 3 | Category labels mapped, plain language |
| 3 | User Control and Freedom | 4 | Edit/cancel, confirm-delete, file remove confirms |
| 4 | Consistency and Standards | 2 | Title font inconsistent edit vs read; 3 uppercase mono labels |
| 5 | Error Prevention | 4 | Confirm before destructive, title validation |
| 6 | Recognition vs Recall | 4 | Cover, schema labels, sections |
| 7 | Flexibility and Efficiency | 3 | Edit toggle, cover crop, expense link |
| 8 | Aesthetic and Minimalist | 2 | DocInfoRow eyebrow repeats on EVERY field row (5-8 stacked uppercase mono) |
| 9 | Error Recovery | 3 | Toast on errors |
| 10 | Help and Documentation | 2 | Zero contextual hints |
| **Total** | | **30/40** | **Acceptable** |

## Anti-Patterns Verdict — fail

DocInfoRow label is the worst eyebrow: renders for every structured field in read mode. Flight doc shows 8 uppercase mono labels stacked. Plus 2 more in edit mode (CATEGORY, COST). Title font inconsistent (Cormorant edit, Geist read).

## Priority Issues

- [P1] DocInfoRow uppercase mono label cascades to N rows per doc. Fix: rewrite to sans semibold sentence-case 12.5px. Command: /impeccable quieter
- [P1] CATEGORY + COST eyebrows in edit mode. Fix: same. Command: bundled with quieter
- [P2] Title font inconsistency (edit Cormorant, read Geist). Fix: edit input uses className="serif". Command: /impeccable polish
- [P3] React.cloneElement to mark last DocInfoRow. Pure cleanup. Skip unless time permits.

## Persona Red Flags

**Casey**: Top buttons reachable. File pills borderline.
**Jordan**: Edit pencil unlabeled glass icon. Could miss it.

## Minor Observations

- category prop duplicated with doc.category.
- JSON.stringify in useEffect deps bypasses ref equality.
- "Change" vs "Replace" wording inconsistent.
