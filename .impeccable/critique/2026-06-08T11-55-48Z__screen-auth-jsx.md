---
target: screen-auth.jsx
total_score: 35
p0_count: 0
p1_count: 2
timestamp: 2026-06-08T11-55-48Z
slug: screen-auth-jsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Loading + banners + error |
| 2 | Match System / Real World | 4 | "Welcome back" / "Start ledger" friendly |
| 3 | User Control and Freedom | 4 | Mode toggle, forgot, resend, back |
| 4 | Consistency and Standards | 3 | Field labels + tagline + footer mono |
| 5 | Error Prevention | 4 | Defensive helper check, validation |
| 6 | Recognition vs Recall | 3 | IconGear for password is wrong |
| 7 | Flexibility and Efficiency | 3 | Mode toggle, forgot link |
| 8 | Aesthetic and Minimalist | 3 | Multiple mono labels; cover art strong |
| 9 | Error Recovery | 4 | Toast + inline + clear on switch |
| 10 | Help and Documentation | 3 | Inline notices |
| **Total** | | **35/40** | **Good** |

## Anti-Patterns Verdict — pass with minor

Aurora cover art is justified brand artwork (committed brand-moment per PRODUCT.md), not SaaS gradient. Glass form card is the right use case. Residual slop: 4 uppercase mono labels (Field cascades 4x in signup) + tagline mono + footer toggle mono + IconGear semantic mismatch for password.

## Priority Issues

- [P1] Field component label uppercase mono 0.14em tracked. Cascades 4x in signup. Fix: sentence-case sans semibold. Command: /impeccable quieter
- [P1] Header tagline + footer mode-switch uppercase mono. Fix: drop uppercase + tracking, sentence-case sans. Command: bundled
- [P2] IconGear for password semantic mismatch. Fix: lock icon or inline SVG. Command: /impeccable polish

## Persona Red Flags

**Casey**: Touch targets good.
**Jordan**: Strong first impression. Email confirm flow clear.

## Minor Observations

- 8 blossom dots in cover art are brand decoration; leave.
- authspin keyframe is one-off; should live in tokens.css.
- agreeTerms visual checkmark instead of toggleable checkbox.
