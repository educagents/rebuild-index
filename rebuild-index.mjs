#!/usr/bin/env node
/**
 * The Rebuild Index: how often students rebuild the same small tool.
 *
 *   GITHUB_TOKEN=... node rebuild-index.mjs
 *
 * Runs seven GitHub repository-search queries for common student tools and
 * records, for each: the total, the count by year created, and how many
 * have 3 stars or fewer. Writes data/rebuild-index.json.
 *
 * Method notes:
 *  - GitHub's search API excludes forks by default, so a fork is not
 *    counted as a rebuild.
 *  - total_count is GitHub's figure and can be approximate for large
 *    result sets.
 *  - A repository is not a student and a star is not a user. This measures
 *    rebuilding, not people.
 *
 * Token: optional. Search allows 30 requests a minute with a token and 10
 * without; the script paces itself either way. It never logs the token.
 *
 * Published by educagents: https://educagents.ai/rebuild-index
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, "data", "rebuild-index.json");

const CATEGORIES = [
  { id: "syllabus-to-calendar", label: "Syllabus to calendar", q: "syllabus parser OR syllabus to calendar in:name,description" },
  { id: "university-schedule-planner", label: "University schedule planner", q: "university schedule planner in:name,description" },
  { id: "citation-generator", label: "Citation generator", q: "citation generator in:name,description" },
  { id: "for-my-university", label: "“For my university” (in the description)", q: "\"for my university\" in:description" },
  { id: "flashcard-generator", label: "Flashcard generator", q: "flashcard generator in:name,description" },
  { id: "gpa-calculator", label: "GPA calculator", q: "\"GPA calculator\" in:name,description" },
  { id: "attendance-tracker", label: "Student attendance tracker", q: "attendance tracker student in:name,description" },
];

const today = new Date();
const thisYear = today.getUTCFullYear();
const YEARS = Array.from({ length: thisYear - 2019 + 1 }, (_, i) => 2019 + i);

const token = process.env.GITHUB_TOKEN;
const PACE_MS = token ? 2200 : 6500;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function count(q) {
  const url = `https://api.github.com/search/repositories?per_page=1&q=${encodeURIComponent(q)}`;
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "educagents-rebuild-index",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.status === 403 || res.status === 429) {
      const reset = Number(res.headers.get("x-ratelimit-reset")) * 1000;
      const wait = Math.max(5000, reset ? reset - Date.now() + 1000 : 60000);
      console.error(`  rate limited, waiting ${Math.round(wait / 1000)}s`);
      await sleep(wait);
      continue;
    }
    if (!res.ok) throw new Error(`GitHub ${res.status} for query: ${q}`);
    const body = await res.json();
    await sleep(PACE_MS);
    return { total: body.total_count, incomplete: Boolean(body.incomplete_results) };
  }
  throw new Error(`gave up after retries: ${q}`);
}

const results = [];
for (const c of CATEGORIES) {
  console.error(`${c.label}`);
  const total = await count(c.q);
  const lowStars = await count(`${c.q} stars:0..3`);
  const byYear = {};
  for (const y of YEARS) {
    const end = y === thisYear ? today.toISOString().slice(0, 10) : `${y}-12-31`;
    byYear[y] = (await count(`${c.q} created:${y}-01-01..${end}`)).total;
  }
  results.push({
    id: c.id,
    label: c.label,
    query: c.q,
    total: total.total,
    approximate: total.incomplete || lowStars.incomplete,
    threeStarsOrFewer: lowStars.total,
    byYear,
  });
  console.error(`  total ${total.total} · ≤3 stars ${lowStars.total}`);
}

const out = {
  retrieved: today.toISOString().slice(0, 10),
  source: "https://api.github.com/search/repositories",
  notes: [
    "Forks are excluded (GitHub search default).",
    "total_count is GitHub's figure and can be approximate for large result sets.",
    "A repository is not a person; this measures rebuilding, not students.",
    `${thisYear} is year-to-date as of the retrieval date.`,
  ],
  years: YEARS,
  categories: results,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.error(`wrote ${OUT}`);
