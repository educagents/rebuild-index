#!/usr/bin/env node
/**
 * Rewrites the summary between <!-- index:start --> and <!-- index:end -->
 * in README.md from data/rebuild-index.json. Run after rebuild-index.mjs.
 */
import { readFileSync, writeFileSync } from "node:fs";

const data = JSON.parse(readFileSync("data/rebuild-index.json", "utf8"));
const lastYear = data.years[data.years.length - 1];
const since = (c) => c.byYear[String(lastYear - 1)] + c.byYear[String(lastYear)];
const pct = (a, b) => `${((100 * a) / b).toFixed(1)}%`;
const fmt = (n) => n.toLocaleString("en-US");
const s = data.categories.find((c) => c.id === "syllabus-to-calendar");

const block = [
  "<!-- index:start -->",
  `**Latest run: ${data.retrieved}.** GitHub holds **${fmt(s.total)} separate syllabus-to-calendar projects**. **${fmt(since(s))}** of them were created since January ${lastYear - 1}, and **${pct(s.threeStarsOrFewer, s.total)}** have three stars or fewer.`,
  "",
  `| Tool | Repositories | Created since Jan ${lastYear - 1} | 3 stars or fewer |`,
  "|---|---:|---:|---:|",
  ...data.categories.map(
    (c) => `| ${c.label} | ${fmt(c.total)} | ${fmt(since(c))} | ${pct(c.threeStarsOrFewer, c.total)} |`,
  ),
  "<!-- index:end -->",
].join("\n");

const readme = readFileSync("README.md", "utf8");
const next = readme.replace(/<!-- index:start -->[\s\S]*?<!-- index:end -->/, block);
if (next === readme && !readme.includes("<!-- index:start -->")) {
  throw new Error("README markers not found");
}
writeFileSync("README.md", next);
console.error("README updated");
