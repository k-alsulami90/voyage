---
target: screen-add-doc.jsx
total_score: 33
p0_count: 0
p1_count: 1
timestamp: 2026-06-07T14-09-40Z
slug: screen-add-doc-jsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Saving spinner, cover preview, upload toast |
| 2 | Match System / Real World | 4 | "What is it?" reads casual, schema-driven steps |
| 3 | User Control and Freedom | 4 | Cancel + optional steps + inline error |
| 4 | Consistency and Standards | 3 | DocField uppercase mono label same pattern as elsewhere |
| 5 | Error Prevention | 4 | Title required, validated, optional clearly marked |
| 6 | Recognition vs Recall | 4 | Numbered steps + labels + placeholders + hints |
| 7 | Flexibility and Efficiency | 3 | Drag-and-drop file + datetime native input |
| 8 | Aesthetic and Minimalist | 2 | DocField eyebrow cascades 4-8x in flight schema |
| 9 | Error Recovery | 3 | Inline error block above save bar |
| 10 | Help and Documentation | 3 | Per-step hints + schema placeholders |
| **Total** | | **33/40** | **Good** |

## Anti-Patterns Verdict — pass with one residual

Numbered steps are load-bearing (real ordered flow: Category -> Title -> Details -> File -> Cost -> Cover). Sentence-case 1/2/3 in dark circles, NOT 01/02/03 saturated form. Acceptable per skill rule on numbered sections.

Residual: DocField uppercase mono label (load-bearing, cascades) + Optional badge eyebrow.

## Priority Issues

- [P1] DocField uppercase mono label. Same pattern as DocInfoRow fixed in v79. Renders for every structured field in step 3 (8 in flight schema). Fix: sentence-case sans semibold 12.5px. Command: /impeccable quieter
- [P2] "Optional" badge in DocStep uppercase mono 0.08em tracked. Fix: lowercase sans ink-mute. Command: bundled with quieter

## Persona Red Flags

**Casey**: File picker full-width. Cover step pills borderline OK.
**Jordan**: Numbered steps + hints + placeholders make this the easiest screen to onboard on.

## Minor Observations

- Step numbering uses manual logic (schema.secondaryFile ? '6' : '5'). Fragile.
- docFieldStyle const is DRY.
- "What is it?" step 1 title slightly different in tone than rest of app.
