---
title: Montessori-informed kids' incentive scheme (draft)
status: draft — pending George's review
last updated: 2026-09-05
---

# Purpose

A positive-incentive "earned income" scheme for Henry (~10) and Sophie (~7), grounded in Montessori principles, focused on schoolwork and extracurricular effort rather than ordinary household participation. Includes a day-based "streak" mechanic for habit-forming activities like music and reading.

# Decisions confirmed with George

- **Currency:** real money, tracked on a ledger, paid out at a regular settle-up (not points/tokens).
- **Paid vs expected split:** strict Montessori line — normal self-care and family participation (own bed, own bag, own dishes, etc.) stays unpaid; only schoolwork/extracurricular effort and genuinely optional "above and beyond" jobs are paid.
- **Activities:** Violin, schoolwork, and reading for Henry (see rollout below). Table tennis and general sport were offered but not chosen.
- **Streak shape:** the escalating base-plus-increment reward-for-consistency mechanic is a confirmed, load-bearing part of the design — it stays even as the per-activity/per-day details get revised (see note below).
- **Reward trigger for schoolwork:** effort and consistency (showing up and doing the work), not grades or results — protects intrinsic motivation, a core Montessori concern.
- **Scope:** both kids, age-scaled — same framework, smaller numbers and shorter streak caps for Sophie given she's younger.
- **Existing system:** none — this is a fresh start.
- **Budget:** not fixed by George — starting numbers below are a proposal, not a commitment.
- **Ongoing, not goal-bound:** Henry's chart is a perpetual weekly earning chart, not a countdown to a fixed savings target — it resets every week, indefinitely. (He does have his own $125 goal he's saving toward, but the chart itself doesn't track or display that countdown.)
- **Device:** Henry views and taps his chart on an iPad, so it's built touch-first (large tap targets, no hover-only states).
- **Minimum time per session:** Violin 15 min · Schoolwork 30 min · Reading 1 hour (reading needs to start before "reading time" to hit the full hour).
- **Per-activity, not pooled (4 Sept 2026):** George identified that a pooled/shared session pool let Henry hit his weekly target using only his two easiest activities and skip violin entirely. Fixed by giving each activity its own Mon–Sun calendar — see structure below.
- **Parent vs kid view:** only parents can reset the week. Gated with a `?parent=1` query string on the chart's link rather than a PIN or login — the plain link is Henry's kid view (no reset control shown), the same link with `?parent=1` appended is the parent view (adds the "Reset week" button and a "Parent view" tag). Worth knowing: this is a convenience gate, not real security — a curious kid could type `?parent=1` into the address bar themselves. Fine for the stated purpose (stopping accidental/impulsive resets), not a lockable permission.
- **$40/week spending cap (4 Sept 2026):** any money earned above $40 in a week is automatically routed to savings rather than paid out as spending money. He still earns and is credited for all of it — the split only affects where it goes.
- **Shared, stateless chart (5 Sept 2026):** the chart no longer stores anything in the browser it's opened in — ticking a box on Henry's iPad now shows up immediately on a parent's phone too. See "Data & hosting" below.
- **Reset history (5 Sept 2026):** every time "Reset week" is pressed, the week's total/to-spend/to-savings split is timestamped and logged for George's own records. It is *not* shown on the chart itself — George can pull it separately (see below).

# Proposed structure

## Tier 0 — Unpaid (normal life participation)

Montessori treats caring for yourself and contributing to the shared home as ordinary participation in family life, not paid labour. Proposed unpaid baseline (George/Emily to confirm or amend):

- Making their own bed
- Tidying their own room to an agreed basic standard
- Packing/unpacking their own school bag
- Clearing their own plate / loading their own dishes
- Being kind and respectful (grace and courtesy) — never monetised

Open question: where does daily homework itself sit — unpaid baseline (just what a student does) or inside the paid streak below? **Addressed** — "Schoolwork" is the paid layer for Henry (maths online such as IXL, or an agreed offline task, minimum 30 min); general homework otherwise stays unpaid baseline unless George says otherwise.

## Tier 1 — Streak-based paid activities (general framework)

Core mechanic (confirmed, keep this): on the *n*-th distinct day *of that specific activity* in the week, that day pays **base + (n − 1) × increment** — pay escalates the more days you do that particular activity, and everything resets fresh each week with no penalty for a quiet one.

**Design history for Henry, in order:**
1. First pass used three separate per-activity streaks, each capped at 5 distinct days/week — but the cap made the numbers small.
2. Pooled the three activities into one shared session pool to simplify — but this let Henry hit his weekly target using only two of the three activities, skipping the third (violin) entirely. Not acceptable — each activity needs to stand on its own.
3. Extended the shared pool to 12 sessions across 3 tiers with a bonus zone, then added minimum times and a parent/kid view — all still on the shared-pool model, so the skip-an-activity problem remained.
4. **4 Sept 2026 — un-pooled:** each activity now has its own Mon–Sun calendar (7 days), so Henry can't cover for skipping violin by doing extra reading. The escalating "multiplier" (same $2.00 base / $0.50 increment) and the three-tier structure both carried over, just applied per activity instead of to a shared pool.

**Henry (10) — current model:** each activity (Violin, Schoolwork, Reading) has its own independent weekly counter, Monday to Sunday. A day only counts once per activity (can't double-tap the same activity twice in a day for double pay), but different activities are fully independent — doing violin and reading on the same day pays both. Within each activity, the *n*-th day done that week pays:

Day 1 $2.00 · 2 $2.50 · 3 $3.00 · 4 $3.50 · 5 $4.00 · 6 $4.50 · 7 $5.00 → **max $24.50/week per activity**

Tiered within each activity's own week (redefined to fit 7 days evenly, rather than reusing the old 4/4/4 split which would have made the bonus tier unreachable in a 7-day week). Tier 1 and Tier 3 use deliberately contrasting colours on the chart (cool slate vs plum) so they're easy to tell apart at a glance, and Tier 2 keeps the gold/orange "weekly target" colour clear of both:

| Tier | Days (that activity) | Zone |
|---|---|---|
| **Tier 1** | 1–3 | Getting going |
| **Tier 2** | 4–5 | Weekly target |
| **Tier 3** | 6–7 | Bonus |

With all three activities running independently, that's a possible **21 sessions/week** (3 activities × 7 days) and a theoretical max of **$73.50/week** if he did all three every single day — which is exactly why the $40 spending cap below matters; hitting just the "target" tier (5 days) on all three activities already totals $45, past the cap.

**Sophie (7) — original per-activity formula, not yet revised for this structure:** base $0.50, increment $0.25, capped at 4 days/week per activity → max $3.50/week per activity.

## The $40/week spending cap

Henry earns and is credited for everything he does, but only the first **$40** of a week's total is paid out as spending money. Anything earned past that is automatically set aside as savings. He still sees the full total on the chart — it's split into "to spend" and "to savings" so the distinction is visible, not hidden.

## Henry's rollout — interactive weekly chart

Designed for iPad viewing, and (as of 5 Sept 2026) shared across every device rather than tied to one:

- A **"3 ways to earn" reference strip** sits between the header and the tracker — each activity shows its icon, its minimum time (Violin 15 min, Schoolwork 30 min, Reading 1 hour), and a short qualifying note. Reading's note reminds him he needs to start before "reading time" to get the full hour in.
- Below that, a **Mon–Sun calendar grid**: one row per activity (Violin / Schoolwork / Reading), seven tappable day cells each. Tapping a day marks it done; the price shown locks in based on how many days of *that activity* are ticked so far that week (by calendar order, Monday first), coloured by tier (cool slate "getting going" → gold "target" → dashed plum "bonus").
- A **totals bar** showing this week's grand total, how much of that is spendable (capped at $40), and how much has gone to savings.
- **Kid view (the plain link):** ticking, live totals — no reset control.
- **Parent view (link + `?parent=1`):** everything kid view has, plus a "Parent view" tag and a "Reset week" button.
- **The chart itself holds no data.** Every tap and the reset both go straight to the shared backend described below, so the iPad, a parent's phone, and any other device all show the same live state — no more per-device drift.
- The remaining explanatory text (how the mechanic works, how payout works) stays in collapsible accordions below the tracker — that's the "read once" material.
- No $125 countdown is shown on the chart itself — it's designed to run indefinitely.

Schoolwork was generalised from "IXL" specifically to **maths online (IXL or similar) or an agreed offline task** — the exact offline alternative still needs to be agreed with George (open item below).

## Data & hosting (added 5 Sept 2026)

The chart is now a small Netlify site rather than a single self-contained HTML file:

- **`index.html`** — the chart itself. Holds no local data; on load it fetches the current week's ticks from the backend, and every tap/reset writes straight back to it.
- **A Netlify Function (`netlify/functions/state.mjs`)** — the one API endpoint (`/api/state`) the page talks to. Handles reading the current state, toggling a single day, and running the reset (see below).
- **Netlify Blobs** — the actual shared storage. A browser can't read or write a plain file on a server, and Netlify's own serverless functions can't durably write to disk either, so the data lives in Netlify's built-in JSON-capable key/value store instead. From George's side this behaves like "a JSON file everyone shares" — it's just not literally a file on disk.
- **Reset history, stored not shown:** every time Reset week is pressed, the *server* (not the page) recomputes that week's total/to-spend/to-savings from the stored ticks and appends `{ timestamp, week, total, spend, savings }` to a history list inside the same store — so the numbers can't be edited from the page itself. Nothing about this history appears on the chart; George can pull it with `netlify blobs:get henry-chart state --output state.json` from his own terminal whenever he wants to see it.
- **Not a real lock, deliberately:** every request to the backend has to include a shared API key as a query-string parameter, so the data endpoint isn't something a stranger could stumble onto or guess. Like `?parent=1`, this is a "don't make it easy to find" measure, not real security — the key lives in the page's own source, same trade-off George already accepted for the parent gate.
- **Where it lives:** deployed on Netlify (continuing the deployment already underway on George's PC) rather than George's home lab, at his preference. Reachable from the public internet — no home-wifi restriction was added.
- The previous Claude-hosted, single-device version of the chart still exists as a snapshot but is no longer the one to use day-to-day — the Netlify link is now the canonical chart for the family to bookmark.

Local copies of the site (`henry-earning-chart.html` — the old single-device version — and the new `site/` folder with `index.html`, `netlify.toml`, `package.json`, and `netlify/functions/state.mjs`) and this scheme (`montessori-incentive-scheme.md`) are saved on George's PC at `C:\Users\George\Documents\projects\incentive-chart\`.

## Tier 2 — One-off "above and beyond" jobs

Optional, genuinely extra jobs beyond normal contribution (e.g. washing the car, garden help, a big declutter, helping set up for a family event). Flat rate agreed *before* the job starts — proposed $2–$5 for Sophie-sized tasks, $3–$8 for Henry-sized tasks — paid on completion. No streak mechanic; these are episodic, not habits.

## Tracking & payout

Henry's tracking is now the interactive weekly chart above (self-ticked, shared across devices, auto-resetting). Proposed payout: a weekly family "settle-up" where he shows his total and gets paid — up to $40 as spending money, the rest into savings — then the chart resets. Mum or Dad use the parent link to reset early if needed, otherwise it resets itself at the start of the new week (parents spot-check rather than police — Montessori-style autonomy and control of error). Every manual reset is timestamped and logged server-side (see "Data & hosting") for George's own records. Payout method (cash jar vs bank transfer, and how the savings portion is actually banked) not yet decided. Sophie's tracking/payout approach not yet designed.

# Open items still needing George's input

1. What's the agreed **offline schoolwork task** for days Henry doesn't do maths online? (Online default is IXL or similar, 30 min minimum.)
2. Cash jar, bank transfer, or hybrid for the spending portion — and where/how does the savings portion actually get banked (a real savings account, a separate ledger line, etc.)?
3. Final unpaid-baseline list — what do George/Emily actually expect day-to-day from each child that should stay firmly unpaid?
4. Confirm the $2.00 base / $0.50 increment / per-activity 7-day structure and the redefined 3/2/2 tier split feel right.
5. Confirm the $40/week spending cap is the right number — a full "target" week across all three activities already exceeds it ($45), so most engaged weeks will send something to savings.
6. Whether Sophie gets the same per-activity, tiered, perpetual-chart treatment (and her own minimum times, parent/kid link, and spending cap), or keeps the original simpler model — not yet decided.
7. Does Henry still want his own $125 goal tracked somewhere (even though the weekly chart itself won't show it)?
8. Whether the old Claude-hosted, single-device chart link should be retired now that the Netlify version is canonical, or kept around as a backup/demo.
