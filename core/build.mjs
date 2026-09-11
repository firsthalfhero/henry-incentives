// Runs at deploy time (and via `netlify build` locally), invoked as
// `node ../../core/build.mjs` from each child's own directory (their
// netlify.toml sets that as `[build] command`, with Netlify's base directory
// = that child's directory, so `process.cwd()` here is the calling child's
// own folder). Reads the ONE shared template, index.template.html, plus that
// child's OWN theme.css and CHART_API_KEY, and produces index.html — the
// file Netlify actually publishes — in the child's own directory.
//
// This keeps two things out of git: the real CHART_API_KEY (only the
// placeholder __CHART_API_KEY__ is ever committed) and any generated output
// (index.html is git-ignored per child).
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url)); // core/ — always, regardless of caller
const outDir = process.cwd(); // the invoking child's own directory

const apiKey = process.env.CHART_API_KEY;
if (!apiKey) {
  console.error(
    "CHART_API_KEY is not set. Set it with `netlify env:set CHART_API_KEY <value>`, " +
    "then re-run this build (or use `netlify build`, which pulls it in automatically)."
  );
  process.exit(1);
}

const templatePath = join(here, "index.template.html");
const themePath = join(outDir, "theme.css");
const outputPath = join(outDir, "index.html");

const template = readFileSync(templatePath, "utf8");
if (!template.includes("__CHART_API_KEY__")) {
  console.error("index.template.html has no __CHART_API_KEY__ placeholder — nothing to substitute.");
  process.exit(1);
}
if (!template.includes("/* __THEME_VARS__ */")) {
  console.error("index.template.html has no /* __THEME_VARS__ */ placeholder — nothing to substitute.");
  process.exit(1);
}
if (!existsSync(themePath)) {
  console.error(`No theme.css found at ${themePath} — every child directory needs its own theme.css.`);
  process.exit(1);
}
const themeCss = readFileSync(themePath, "utf8");

let output = template.split("__CHART_API_KEY__").join(apiKey);
output = output.replace("/* __THEME_VARS__ */", themeCss);

writeFileSync(outputPath, output);
console.log(`Wrote ${outputPath} from ${templatePath} (CHART_API_KEY + theme.css substituted).`);
