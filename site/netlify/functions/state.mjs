import { getStore } from "@netlify/blobs";
import activitiesData from "../../activities.json" with { type: "json" };

// ---- shared config (kept identical to the chart's own numbers) ----
const STORE_NAME = "henry-chart";
const DOC_KEY = "state";
const SPEND_CAP = 40;
const RATE_DAYS = 7; // Mon..Sun

// The day-by-day pay schedule (day 1 = baseRate, each following day adds
// increment) and the activity list both come from activities.json — the
// same file the page fetches — so nothing here is hardcoded any more.
function buildRates(baseRate, increment) {
  const rates = [];
  for (let i = 0; i < RATE_DAYS; i++) {
    rates.push(Number((baseRate + i * increment).toFixed(2)));
  }
  return rates;
}
const RATES = buildRates(activitiesData.baseRate, activitiesData.increment);

// Activity keys come from activities.json, capped at 6 so a stray extra
// entry can't silently break the ticks shape.
const ACTIVITY_LIST = activitiesData.activities.slice(0, 6);
const ACTIVITIES = ACTIVITY_LIST.map((a) => a.key);
const ACTIVITY_BY_KEY = {};
ACTIVITY_LIST.forEach((a) => { ACTIVITY_BY_KEY[a.key] = a; });
function multiplierFor(key) {
  const m = ACTIVITY_BY_KEY[key] && ACTIVITY_BY_KEY[key].multiplier;
  return typeof m === "number" ? m : 1;
}
const MAX_WRITE_ATTEMPTS = 6;

function isoWeekKey(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return d.getUTCFullYear() + "-W" + String(weekNo).padStart(2, "0");
}

function emptyTicks() {
  const t = {};
  ACTIVITIES.forEach((key) => { t[key] = [false, false, false, false, false, false, false]; });
  return t;
}

function isValidTicks(ticks) {
  return ticks && ACTIVITIES.every(
    (key) => Array.isArray(ticks[key]) && ticks[key].length === 7 && ticks[key].every((v) => typeof v === "boolean")
  );
}

function computeTotals(ticks) {
  let total = 0;
  ACTIVITIES.forEach((key) => {
    const mult = multiplierFor(key);
    let rank = 0;
    (ticks[key] || []).forEach((on) => {
      if (on) {
        total += RATES[rank] * mult;
        rank++;
      }
    });
  });
  const spend = Math.min(total, SPEND_CAP);
  const savings = Math.max(0, total - SPEND_CAP);
  return {
    total: Number(total.toFixed(2)),
    spend: Number(spend.toFixed(2)),
    savings: Number(savings.toFixed(2)),
  };
}

function normalize(data) {
  if (!data || !isValidTicks(data.ticks)) {
    return { week: isoWeekKey(new Date()), ticks: emptyTicks(), history: (data && Array.isArray(data.history)) ? data.history : [] };
  }
  return data;
}

function rolledForNow(state) {
  const currentWeek = isoWeekKey(new Date());
  if (state.week !== currentWeek) {
    return { week: currentWeek, ticks: emptyTicks(), history: state.history || [] };
  }
  return state;
}

// Reads the current entry (with its ETag) and applies the natural weekly
// rollover if the stored week is stale. Every write below is a
// compare-and-swap against the ETag we just read — if another tap (from
// this device or another one) wrote in between our read and our write, the
// write is rejected instead of silently overwriting the other change, and
// we retry against the fresh value. This is what actually fixes "tapping a
// second day undoes the first" — without it, two requests can each read the
// state before the other's write is visible and each save a version that's
// missing the other's tick.
async function readCurrent(store) {
  const result = await store.getWithMetadata(DOC_KEY, { type: "json" });
  return {
    data: result ? result.data : null,
    etag: result ? result.etag : undefined,
  };
}

function writeOptionsFor(etag) {
  return etag ? { onlyIfMatch: etag } : { onlyIfNew: true };
}

// Read-modify-write with retry. `mutate` receives the current (already
// week-rolled) state and returns the new state to save.
async function updateState(store, mutate) {
  for (let attempt = 0; attempt < MAX_WRITE_ATTEMPTS; attempt++) {
    const { data, etag } = await readCurrent(store);
    const current = rolledForNow(normalize(data));
    const next = mutate(current);
    const { modified } = await store.setJSON(DOC_KEY, next, writeOptionsFor(etag));
    if (modified) return next;
    // Someone else wrote in between our read and our write — loop and retry
    // against whatever is there now instead of clobbering it.
  }
  throw new Error("Could not save after multiple attempts — too much concurrent activity.");
}

// Read-only path (GET): apply the weekly rollover if needed, but don't force
// a write when nothing has changed.
async function getStateForRead(store) {
  const { data, etag } = await readCurrent(store);
  const normalized = normalize(data);
  const currentWeek = isoWeekKey(new Date());
  if (normalized.week === currentWeek) {
    return normalized;
  }
  const rolled = { week: currentWeek, ticks: emptyTicks(), history: normalized.history || [] };
  const { modified } = await store.setJSON(DOC_KEY, rolled, writeOptionsFor(etag));
  if (modified) return rolled;
  // Another request rolled it over first — just read the fresh result.
  const { data: freshData } = await readCurrent(store);
  return normalize(freshData);
}

function json(data, init) {
  return new Response(JSON.stringify(data), {
    ...init,
    // no-store: this is live, mutable state — never let a browser or CDN
    // cache serve a stale snapshot of it.
    headers: { "content-type": "application/json", "cache-control": "no-store", ...(init && init.headers) },
  });
}

export default async (req) => {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");

  if (!process.env.CHART_API_KEY || key !== process.env.CHART_API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Strong consistency: every read reflects the most recent write immediately,
  // rather than Blobs' default eventually-consistent (up to 60s stale) cache.
  const store = getStore({ name: STORE_NAME, consistency: "strong" });

  if (req.method === "GET") {
    const state = await getStateForRead(store);
    return json({ week: state.week, ticks: state.ticks });
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response("Bad request", { status: 400 });
    }

    if (body.action === "tick") {
      const { activity, day } = body;
      if (!ACTIVITIES.includes(activity) || !Number.isInteger(day) || day < 0 || day > 6) {
        return new Response("Bad request", { status: 400 });
      }
      try {
        const next = await updateState(store, (current) => {
          current.ticks[activity][day] = !current.ticks[activity][day];
          return current;
        });
        return json({ week: next.week, ticks: next.ticks });
      } catch (e) {
        return new Response("Conflict — please try again", { status: 409 });
      }
    }

    if (body.action === "reset") {
      try {
        const next = await updateState(store, (current) => {
          const totals = computeTotals(current.ticks);
          const history = current.history || [];
          history.push({
            timestamp: new Date().toISOString(),
            week: current.week,
            total: totals.total,
            spend: totals.spend,
            savings: totals.savings,
          });
          return { week: isoWeekKey(new Date()), ticks: emptyTicks(), history };
        });
        return json({ week: next.week, ticks: next.ticks });
      } catch (e) {
        return new Response("Conflict — please try again", { status: 409 });
      }
    }

    return new Response("Unknown action", { status: 400 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/state" };
