# AGENT EXECUTION HEADER - REQUIRED
You are the implementation orchestrator for this report.
Activate subagents now: codebase-mapper, root-cause-analyst, fix-planner, verification-agent.
Use a reflexive loop for each finding: observe -> challenge assumptions -> validate with code evidence -> choose the smallest safe fix.
Treat every finding as actionable work, not commentary.
Prioritize execution strictly by `urgency` (`low`, `medium`, `high`, `very high`, `extremely high`).
For each fix, preserve behavior, define verification steps, and record any remaining risk.

## Executive Summary
Top cleanup wins by urgency:
1. Make sitemap generation deterministic and stop build-time dirtying of tracked files (`very high`).
2. Remove/ignore local skill-backup artifacts and narrow lint scope to project sources (`very high`).
3. Resolve package-manager drift (Bun vs npm lockfiles) and prune unused dependencies (`high`).
4. Remove orphaned assets and dead symbols that increase maintenance cost (`high` to `medium`).

## Findings Table
| ID | issue | urgency | location |
|---|---|---|---|
| F1 | Build mutates tracked `static/sitemap.xml` on every run via date-based lastmod | very high | `scripts/generate-sitemap.mjs:21-32`, `package.json:8-9`, `static/sitemap.xml` |
| F2 | Lint signal is polluted by local backup artifacts and broad check scope | very high | `.codex-skills-backup-20260225-145935/**`, `package.json:15` |
| F3 | Lockfile/package-manager drift (`bun.lock` + `package-lock.json`) while CI is Bun-only | high | `bun.lock`, `package-lock.json`, `.github/workflows/sitebuilder.yml:29-35` |
| F4 | Orphaned assets no longer mapped from datasource-driven routes | high | `static/og/from-digital-inclusion-to-it-appropriation.jpg`, `src/lib/assets/posters/schema_annotated.png`, `src/lib/assets/posters/test.mp4` |
| F5 | Dependency drift: packages likely unused or mis-scoped | medium | `package.json:18,23-24,30,41` |
| F6 | Dead/unused symbols and files increase code noise | medium | `src/routes/+layout.svelte:8`, `src/routes/about/+page.svelte:17,36`, `src/lib/index.ts:1` |

## Detailed Findings (Grouped by Category)

### Build Determinism

#### Finding F1
- issue: Sitemap generation writes a tracked file every build using the current date.
- why_this_is_an_issue: This introduces non-functional churn, causes dirty working trees after builds, and makes CI/build outputs non-deterministic.
- urgency: very high
- location: `scripts/generate-sitemap.mjs:21-32`, `package.json:8-9`, `static/sitemap.xml`
- evidence: `lastmod` is derived from `new Date()` (`scripts/generate-sitemap.mjs:21`) and written to `static/sitemap.xml` (`scripts/generate-sitemap.mjs:32`) on every `prebuild` (`package.json:8-9`). Current repo state shows `M static/sitemap.xml` after build.
- recommended_action: Make `lastmod` deterministic (e.g., source-content hash/git date) or move sitemap generation to CI artifact phase instead of tracked source mutation.
- owner: `frontend-platform`
- batch: `cleanup-pass-1-high-confidence`
- verification: Run `bun run build` twice without content changes; verify `git diff -- static/sitemap.xml` is empty.

### Tooling And Lint Hygiene

#### Finding F2
- issue: `lint` checks the whole repository, including local backup artifacts unrelated to the app.
- why_this_is_an_issue: Formatting failures become noisy and non-actionable, reducing trust in lint and slowing cleanup execution.
- urgency: very high
- location: `package.json:15`, `.codex-skills-backup-20260225-145935/**`
- evidence: `bun run lint` reports 60 style issues, many under `.codex-skills-backup-20260225-145935/...`; backup folder currently contains 71 files.
- recommended_action: Exclude backup/transient directories in `.prettierignore` and/or narrow lint scope to source/config paths (for example `src`, `scripts`, config files).
- owner: `frontend-platform`
- batch: `cleanup-pass-1-high-confidence`
- verification: Run `bun run lint`; confirm warnings no longer originate from `.codex-skills-backup-*` and output reflects app code only.

### Package Management

#### Finding F3
- issue: Repository carries both Bun and npm lockfiles while CI installs with Bun frozen lockfile.
- why_this_is_an_issue: Dual lockfiles drift over time and can produce inconsistent dependency resolution locally vs CI.
- urgency: high
- location: `bun.lock`, `package-lock.json`, `.github/workflows/sitebuilder.yml:29-35`
- evidence: CI workflow uses `bun install --frozen-lockfile` and `bun run build`; `package-lock.json` is also tracked.
- recommended_action: Standardize on Bun for this repo and remove `package-lock.json` (or adopt npm everywhere, but one manager only).
- owner: `frontend-platform`
- batch: `cleanup-pass-1-high-confidence`
- verification: After standardization, fresh install/build on CI and local produce identical lockfile behavior with no secondary lock updates.

### Orphaned Assets

#### Finding F4
- issue: Several binary assets are no longer referenced by datasource-derived route ids or source usage.
- why_this_is_an_issue: Orphaned assets bloat repository/storage and create confusion during content updates.
- urgency: high
- location: `static/og/from-digital-inclusion-to-it-appropriation.jpg`, `src/lib/assets/posters/schema_annotated.png`, `src/lib/assets/posters/test.mp4`, `scripts/generate-sitemap.mjs:14-20`
- evidence: Cross-check of `datasource.json` project ids against asset filenames reports: `og_unmatched=1` (`from-digital-inclusion-to-it-appropriation`) and `poster_unmatched=2` (`schema_annotated.png`, `test.mp4`). `rg` finds no source references for these names.
- recommended_action: Remove these assets if deprecated, or register explicit usage paths if intentionally retained.
- owner: `content-ops`
- batch: `cleanup-pass-2-needs-content-confirmation`
- verification: Re-run id-to-asset reconciliation; unmatched counts should be zero (or documented exceptions list).

### Dependency Scope And Usage

#### Finding F5
- issue: Dependency list includes likely-unused/stale packages.
- why_this_is_an_issue: Extra dependencies increase install surface, security scanning overhead, and upgrade burden.
- urgency: medium
- location: `package.json:18,23-24,30,41`, `svelte.config.js:1`, `vite.config.ts:1-5`, `src/app.css:2`
- evidence:
  - `@sveltejs/adapter-auto` present but adapter in use is `@sveltejs/adapter-static`.
  - `@vitejs/plugin-basic-ssl` is declared but not imported in Vite config.
  - `@types/locomotive-scroll` and runtime `locomotive-scroll` are declared; no source imports found.
  - `svgo` is declared with no direct script/config invocation (needs confirmation if transitive workflow dependency is intended).
- recommended_action: Remove clearly unused deps (`adapter-auto`, `plugin-basic-ssl`) in first pass; validate and then remove `locomotive-scroll` + types and `svgo` if no planned usage.
- owner: `frontend-platform`
- batch: `cleanup-pass-2-needs-confirmation`
- verification: `bun install`, `bun run check`, `bun run build` all pass after each dependency removal step.

### Dead Code Inventory

#### Finding F6
- issue: Unused symbols/files are present in route/layout code.
- why_this_is_an_issue: Dead code increases cognitive load and can hide true intent during future refactors.
- urgency: medium
- location: `src/routes/+layout.svelte:8`, `src/routes/about/+page.svelte:17,36`, `src/lib/index.ts:1`
- evidence:
  - `fly` and `slide` imported in layout are unused.
  - `isMobileFlag` is set in about page but never consumed in markup/logic.
  - `src/lib/index.ts` is an empty tracked file.
- recommended_action: Remove unused imports/variables and delete empty file if no upcoming public barrel export is planned.
- owner: `frontend-core`
- batch: `cleanup-pass-1-high-confidence`
- verification: `bun run check` remains clean; `git grep` for removed symbols returns no hits.

## Dead Code Inventory (Safe vs Needs Confirmation)
- safe to remove:
  - `src/lib/index.ts` (empty file)
  - Unused imports `fly`, `slide` in `src/routes/+layout.svelte`
  - Unused state `isMobileFlag` in `src/routes/about/+page.svelte`
  - `@sveltejs/adapter-auto`, `@vitejs/plugin-basic-ssl` (based on current config)
- needs confirmation:
  - `locomotive-scroll`, `@types/locomotive-scroll`, `svgo`
  - orphan assets listed in F4 (content team may intend future reuse)

## Execution Order
1. F1 deterministic sitemap output.
2. F2 lint scope cleanup and ignore transient directories.
3. F3 package-manager lockfile standardization.
4. F6 dead-symbol and empty-file cleanup.
5. F5 dependency pruning in small validated batches.
6. F4 orphan asset cleanup after content-owner confirmation.

## Verification Checklist
1. `bun run lint` passes with project-relevant files only.
2. `bun run check` returns 0 errors/0 warnings.
3. `bun run build` does not modify tracked files unexpectedly.
4. Only one lockfile strategy remains in repo and CI.
5. Asset reconciliation script reports zero unexpected unmatched files (or documented exceptions).

## Command Evidence
- `bun run check`: passes (`svelte-check found 0 errors and 0 warnings`).
- `bun run lint`: fails with broad warnings, including `.codex-skills-backup-20260225-145935/**` and non-source files.
- Repository status includes modified `static/sitemap.xml` after build.
- Asset reconciliation script output:
  - `og_unmatched 1` (`from-digital-inclusion-to-it-appropriation`)
  - `poster_unmatched 2` (`schema_annotated.png`, `test.mp4`)
