// Runs at deploy time (and via `netlify build` locally). Takes the committed
// template, index.template.html, and produces index.html — the file Netlify
// actually publishes — by substituting the real CHART_API_KEY value in from
// Netlify's environment variables. This keeps the real key out of git: only
// the placeholder ever gets committed.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));

const apiKey = process.env.CHART_API_KEY;
if (!apiKey) {
  console.error(
    "CHART_API_KEY is not set. Set it with `netlify env:set CHART_API_KEY <value>`, " +
    "then re-run this build (or use `netlify build`, which pulls it in automatically)."
  );
  process.exit(1);
}

const templatePath = join(here, "index.template.html");
const outputPath = join(here, "index.html");

const template = readFileSync(templatePath, "utf8");
if (!template.includes("__CHART_API_KEY__")) {
  console.error("index.template.html has no __CHART_API_KEY__ placeholder — nothing to substitute.");
  process.exit(1);
}

writeFileSync(outputPath, template.split("__CHART_API_KEY__").join(apiKey));
console.log("Wrote index.html from index.template.html (CHART_API_KEY substituted).");
