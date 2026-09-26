# The Rebuild Index

How often do students rebuild the same small tool from scratch, and is it growing faster than GitHub itself? This repository counts it from GitHub's own search API, against a GitHub-wide baseline, and re-runs monthly.

<!-- index:start -->
**Latest run: 2026-09-26.** From 2024 to 2025, new public repositories on GitHub grew 1.4×. New syllabus-to-calendar repositories grew 14× (3 → 43), about **11× faster than GitHub itself**. In 2026 so far, a new "student attendance tracker" repository appears roughly **every 87 minutes**.

| Tool | Repositories (all time) | New in 2024 → 2025 | Growth | vs GitHub's 1.4× |
|---|---:|---:|---:|---:|
| *All of GitHub (baseline)* | | 43,274,350 → 58,584,211 | 1.4× | 1× |
| Syllabus to calendar | 131 | 3 → 43 | 14× | 11× |
| University schedule planner | 134 | 10 → 27 | 2.7× | 2.0× |
| Citation generator | 593 | 66 → 144 | 2.2× | 1.6× |
| “For my university” (in the description) | 3,472 | 508 → 653 | 1.3× | 0.9× |
| Flashcard generator | 3,691 | 202 → 639 | 3.2× | 2.3× |
| GPA calculator | 7,693 | 943 → 1,674 | 1.8× | 1.3× |
| Student attendance tracker | 8,722 | 752 → 2,648 | 3.5× | 2.6× |

Small numbers, big multiples: syllabus-to-calendar went from 3 to 43, so read its multiple as a direction, not a precise rate. On stars: 98.5% of syllabus-to-calendar repos have 3 stars or fewer, but so do 99.1% of all repos GitHub created in 2025. Stars don't set these apart.
<!-- index:end -->

The write-up, with the year-by-year chart, is at **https://educagents.ai/rebuild-index**.

## What this does and doesn't show

- **A repository is not a student.** Some are tutorials, class assignments, templates or one person's second attempt. This counts rebuilding, not people.
- **Stars don't distinguish these repos.** Almost every new GitHub repo has 3 stars or fewer, student tools included, so the star split is reported against GitHub's base rate rather than as a finding.
- **Growth is compared with all of GitHub** (every public repo search returns for the same dates), because GitHub itself grows every year.
- **Counts are GitHub's `total_count`** and can be approximate for large result sets. Forks are excluded by GitHub search by default.
- **Queries are keyword searches** on names and descriptions, so they miss projects described differently and include a few that only mention the words. Every query string is in `data/rebuild-index.json`.
- The current year is year-to-date as of the retrieval date.

## Updates

A GitHub Actions workflow re-runs the counts on the 26th of every month and commits the new data and this table. Every figure carries its retrieval date; earlier runs are in the commit history.

## Run it yourself

Requires Node 18 or later. No dependencies.

```bash
GITHUB_TOKEN=your_token node rebuild-index.mjs
```

The token is optional (it raises GitHub's search rate limit). The script paces itself and writes `data/rebuild-index.json`.

## Licence

Code: MIT (see `LICENSE`). Data in `data/`: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Please link to https://educagents.ai/rebuild-index when you use it.

Published by [educagents](https://educagents.ai), which is building a place for students to publish the tools they build, so the next student doesn't have to start from zero.
