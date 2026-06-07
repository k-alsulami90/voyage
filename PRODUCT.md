# Product

## Register

product

## Users

Gulf-region travelers (primary: Saudi, then UAE, KW, BH, QA, OM) who plan and pay for trips with family or friend groups. Bilingual by default (Arabic + English, with RTL as a first-class layout target, not a flag). Use the app on iPhone, installed as a PWA on the home screen, in airports / hotel lobbies / taxis. Often in shared-payment situations where someone covers the group and needs the math to be obvious.

The "job to be done" splits cleanly:
1. Before the trip: keep tickets / hotel confirmations / visas in one place. Set a budget.
2. During the trip: log expenses fast (often one-handed), see the running balance, know what's happening next (next flight, next check-in).
3. After the trip: settle up cleanly, look at where the money went, remember the trip.

## Product Purpose

A travel companion that handles the money + the documents + the day-by-day plan without making travel feel like a project management tool. Voyage exists because the alternatives (Booking + Splitwise + Notes + WhatsApp screenshots) are fragmented, and none of them feel like they were designed for someone who actually enjoys travel.

Success: the user opens the app at the airport, sees their boarding pass within one tap, and never has to dig through a thread.

## Brand Personality

Warm. Considered. Calm.

Travel as something to savour. Voyage carries the rhythm of a well-edited print magazine more than a productivity tool. Serif display + restrained sans for content. Confident color, used sparingly. The user feels like the app respects their taste.

Voice: short sentences. Plain Arabic / plain English. No marketing buzz. The app explains itself when needed and gets out of the way when not.

## Anti-references

Voyage should not look like:

- **Mainstream travel apps** (Booking, Kayak, Expedia, Hotels.com). No saturated brand-blue, no yellow CTAs, no rectangular photo-grid heroes, no "deals" pressure UI.
- **Generic SaaS dashboards** (Linear/Notion clones). No flat tables of identical tiles, no obvious "side nav + main pane + topbar" chrome, no "KPI tile grid" as the home page.
- **The AI-default cream-and-serif aesthetic** (the saturated 2026 reflex: warm near-white body bg + a single brand accent + serif display + sans body). The current Voyage tokens land close to this trap; the design needs to remain identifiably Voyage, not blend into the generic warm-editorial AI lane.
- **Over-ornamented cards** with nested radii, decorative borders, gratuitous gradients, or "premium" glass effects.

## Design Principles

1. **Money math is the load-bearing job.** Currency, balance, split, settle — these surfaces get the most careful design and the strongest typography. Everything else supports them.
2. **Arabic and English are equal.** Layout, typography, and copy work in both directions natively; nothing is "RTL'd later."
3. **Show, don't shout.** Color is a tool, not a personality. The app uses one or two committed accents (clay + a deep ink), not a palette of five.
4. **Density without clutter.** The user is sometimes in a taxi with one hand. Long lists need rhythm and breathing room; small status hints stay legible, not whispered.
5. **Specific over generic.** Each category (flights, hotels, rentals) has its own shape, not the same form template. Smart Track is "Now / in 25m / Today" because that's how the user actually thinks.

## Accessibility & Inclusion

WCAG AA on body text (≥4.5:1) and large text / icons (≥3:1) is a hard floor, especially on the warm-tinted backgrounds where muted-ink can drift toward "elegant but unreadable". Inputs hit 16px font-size minimum to dodge iOS auto-zoom.

Tap targets ≥44×44 on every interactive surface (iOS HIG). Avoid color-only signaling on charts — use shape or label too.

Reduced motion: every transition has a `prefers-reduced-motion` fallback (instant or crossfade). The splash scene is the canonical example: full keyframe choreography by default, flat instant load when the user has reduced-motion on.

The audience is bilingual; copy must work in both languages at the same density. Long Arabic words can break English-tight layouts; columns and labels are tested in both.
