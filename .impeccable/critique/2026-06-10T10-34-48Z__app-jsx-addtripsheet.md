---
target: Add Trip sheet
total_score: 26
p0_count: 0
p1_count: 3
timestamp: 2026-06-10T10-34-48Z
slug: app-jsx-addtripsheet
---
# Critique — Add Trip sheet (app.jsx:1485 AddTripSheet)

## Design Health Score: 26/40 (Acceptable)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Loading spinner + live status pill good; no live day-count, date validity only on submit |
| 2 | Match System / Real World | 3 | "Budget in USD" while picker says "Local currency" — two money frames collide |
| 3 | User Control and Freedom | 3 | Native date pickers; no explicit Cancel, no draft recovery |
| 4 | Consistency and Standards | 2 | Different field style/label pattern/currency chips + emoji button vs every other crafted screen |
| 5 | Error Prevention | 3 | Smart defaults + required checks; end-before-start only caught on submit |
| 6 | Recognition Rather Than Recall | 2 | Cover art cannot be chosen here; USD-vs-local forces mental math |
| 7 | Flexibility and Efficiency | 3 | Date defaults + currency chips fast; nothing special |
| 8 | Aesthetic and Minimalist Design | 2 | Flat six-field stack, equal weight, no hero — unfinished default form |
| 9 | Error Recovery | 3 | Plain-language errors near button, form preserved |
| 10 | Help and Documentation | 2 | Placeholders help; no hint on budget/currency model, no cover guidance |

## Anti-Patterns Verdict
Looks unfinished/AI — the only crafted-era screen that still does. Two bans present:
- Uppercase mono tracked eyebrow on every field (labelStyle app.jsx:1508), 6 instances. The AI-form tell; appears nowhere else post-impeccable.
- Uniform-weight repeated row: six identical fields at gap 12, no hero. Violates PRODUCT.md principle #5.
Detector clean ([]) but false-negative-by-format: inline style objects invisible to class-based scan. No browser automation in harness.

## Priority Issues
- [P1] Uppercase mono eyebrow labels on every field. Banned + inconsistent with Settings' soft inline labels. Fix: adopt Settings field vocabulary. /impeccable typeset.
- [P1] No hierarchy / no hero / flat six-field stack. Concrete reason it looks unimproved. Fix: lead with live trip-card preview reusing window.CoverArt; demote fields beneath. /impeccable craft.
- [P1] Cover art not choosable at creation. Every trip defaults to kyoto; creation poorer than edit. createTrip already accepts coverStyle. Fix: visual cover picker. /impeccable craft.
- [P2] Budget-in-USD vs Local-currency mismatch. Money is load-bearing, most confusing part. SAR buried 6th in chip row for Saudi-first product. Fix: budget adopts chosen/home currency, convert on save; lead chips with SAR. /impeccable clarify + craft.
- [P2] Inconsistent field style/chips/emoji-button vs rest of app. Fix: unify on inputStyle + button vocabulary. /impeccable polish.

## Persona Red Flags
- Jordan (First-Timer): USD-vs-SAR confusion; generic result because cover choice hidden.
- Casey (mobile one-handed): six text fields, no draft recovery on interrupt/dismiss.
- Sam (a11y): labels NOT associated to inputs (no htmlFor/id); 10px ink-mute eyebrow borderline contrast.

## Minor Observations
- Bare * for required, no legend.
- Good placeholders, keep them.
- Status pill + missing day-count should merge ("7 nights · upcoming").

## Questions to Consider
- What if creating a trip felt like composing the card you'll stare at all week?
- Does budget need a separate USD frame, or just speak the picked currency?
- What is the hero on this sheet — and why is it currently nothing?
