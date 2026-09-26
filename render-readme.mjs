#!/usr/bin/env node
/**
 * Rewrites the summary between <!-- index:start --> and <!-- index:end -->
 * in README.md from data/rebuild-index.json. Run after rebuild-index.mjs.
 *
 * The headline is growth measured AGAINST GitHub's own growth. The star
 * share is shown next to GitHub's base rate, because on its own it isn't a
 * finding: about 99% of all new GitHub repos have 3 stars or fewer.
 */
import { readFileSync, writeFileSync } from "node:fs";

const d = JSON.parse(readFileSync("data/rebuild-index.json", "utf8"));
const thisYear = d.years[d.years.length - 1];
const y1 = thisYear - 1;
const y0 = thisYear - 2;
const fmt = (n) => n.toLocaleString("en-US");
const x = (n) => `${n >= 10 ? Math.round(n) : n.toFixed(1)}×`;
const b = d.baseline;
const ghGrowth = b.byYear[y1] / b.byYear[y0];
const growth = (c) => (c.byYear[y0] > 0 ? c.byYear[y1] / c.byYear[y0] : null);

const s = d.categories.find((c) => c.id === "syllabus-to-calendar");
const retrieved = new Date(`${d.retrieved}T00:00:00Z`);
const minutesSoFar = (retrieved - Date.UTC(thisYear, 0, 1)) / 60000;
const fastest = [...d.categories].sort((a, c) => c.byYear[thisYear] - a.byYear[thisYear])[0];
const everyMin = Math.round(minutesSoFar / fastest.byYear[thisYear]);
const lowShare = (100 * s.threeStarsOrFewer) / s.total;
const ghLowShare = (100 * b.threeStarsOrFewer) / b.byYear[b.threeStarsOrFewerShareYear];

const rows = d.categories
  .map((c) => {
    const g = growth(c);
    return `| ${c.label} | ${fmt(c.total)} | ${fmt(c.byYear[y0])} → ${fmt(c.byYear[y1])} | ${g ? x(g) : "n/a"} | ${g ? x(g / ghGrowth) : "n/a"} |`;
  })
  .join("\n");

const block = `<!-- index:start -->
**Latest run: ${d.retrieved}.** From ${y0} to ${y1}, new public repositories on GitHub grew ${x(ghGrowth)}. New syllabus-to-calendar repositories grew ${x(growth(s))} (${s.byYear[y0]} → ${s.byYear[y1]}), about **${x(growth(s) / ghGrowth)} faster than GitHub itself**. In ${thisYear} so far, a new "${fastest.label.toLowerCase()}" repository appears roughly **every ${everyMin} minutes**.

| Tool | Repositories (all time) | New in ${y0} → ${y1} | Growth | vs GitHub's ${x(ghGrowth)} |
|---|---:|---:|---:|---:|
| *All of GitHub (baseline)* | | ${fmt(b.byYear[y0])} → ${fmt(b.byYear[y1])} | ${x(ghGrowth)} | 1× |
${rows}

Small numbers, big multiples: syllabus-to-calendar went from ${s.byYear[y0]} to ${s.byYear[y1]}, so read its multiple as a direction, not a precise rate. On stars: ${lowShare.toFixed(1)}% of syllabus-to-calendar repos have 3 stars or fewer, but so do ${ghLowShare.toFixed(1)}% of all repos GitHub created in ${b.threeStarsOrFewerShareYear}. Stars don't set these apart.
<!-- index:end -->`;

const readme = readFileSync("README.md", "utf8");
if (!readme.includes("<!-- index:start -->")) throw new Error("README markers not found");
writeFileSync("README.md", readme.replace(/<!-- index:start -->[\s\S]*?<!-- index:end -->/, block));
console.error("README updated");
