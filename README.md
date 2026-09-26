# The Rebuild Index

How often do students rebuild the same small tool from scratch? This repository counts it, from GitHub's own search API, and re-runs monthly.

<!-- index:start -->
**Latest run: 2026-09-26.** GitHub holds **131 separate syllabus-to-calendar projects**. **104** of them were created since January 2025, and **98.5%** have three stars or fewer.

| Tool | Repositories | Created since Jan 2025 | 3 stars or fewer |
|---|---:|---:|---:|
| Syllabus to calendar | 131 | 104 | 98.5% |
| University schedule planner | 134 | 82 | 97.0% |
| Citation generator | 593 | 327 | 96.5% |
| “For my university” (in the description) | 3,472 | 1,134 | 98.8% |
| Flashcard generator | 3,690 | 1,397 | 99.1% |
| GPA calculator | 7,693 | 3,353 | 98.4% |
| Student attendance tracker | 8,722 | 7,085 | 98.5% |
<!-- index:end -->

The write-up, with the year-by-year chart, is at **https://educagents.ai/rebuild-index**.

## What this does and doesn't show

- **A repository is not a student.** Some are tutorials, class assignments, templates or one person's second attempt. This counts rebuilding, not people.
- **A star is not a user.** Stars are the closest public signal of anyone else finding a project, not a measure of use.
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
