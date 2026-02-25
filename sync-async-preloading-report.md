# AGENT EXECUTION HEADER - REQUIRED
You are the implementation orchestrator for this report.
Activate subagents now: codebase-mapper, root-cause-analyst, fix-planner, verification-agent.
Use a reflexive loop for each finding: observe -> challenge assumptions -> validate with code evidence -> choose the smallest safe fix.
Treat every finding as actionable work, not commentary.
Prioritize execution strictly by `urgency` (`low`, `medium`, `high`, `very high`, `extremely high`).
For each fix, preserve behavior, define verification steps, and record any remaining risk.

## Critical-Path Boundary Map

- Boot path: `src/routes/+layout.svelte` mounts global Tempus patching and Google Fonts stylesheet, then each route load imports `datasource.json`.
- Home route path: `src/routes/+page.ts` prepares all projects and poster URL mappings; `src/lib/comps/carousel.svelte` starts per-item texture promises and toggles global texture-ready state.
- Project route path: `src/routes/projects/[slug]/+page.ts` uses an eager glob for all poster assets, then selects two poster URLs for one project.
- Route transition path: `about`, `archive`, and `projects/[slug]` create Lenis instances via `setupLenis().then(...)` during `onMount` and destroy during teardown.

## Findings (Ordered by Urgency)

### 1) Carousel readiness is unlocked by the first completed texture, not by full critical texture set

- issue: The loader and pointer-interaction gates are released when any single texture resolves.
- why_this_is_an_issue: This is an async boundary race. Users can interact while many textures are still pending, causing partial renders, inconsistent pointer behavior, and visible pop-in under normal network variance.
- urgency: very high
- location: `src/lib/comps/carousel.svelte:340-343`, `src/routes/+page.svelte:48-55`, `src/routes/+page.svelte:110`
- evidence: `{@const texture = useTexture(poster as string).then((texture) => texture)}` followed by `{($isTextureReady = true)}` inside each awaited item; home page hides loader when `!$isTextureReady` becomes false.
- recommended_action: Replace per-item readiness toggling with aggregate readiness (for example: preload a defined critical subset with `Promise.all`, then set `$isTextureReady = true` once). Keep non-critical poster textures lazy/deferred.
- verification: Throttle network in devtools, reload home page, and confirm loader stays visible until the selected critical texture set is fully available and no mesh shows as blank during first interaction.

### 2) Home carousel starts unbounded concurrent texture fetch/decode work

- issue: Each renderable project starts its own texture promise path in the template, creating broad concurrent work without backpressure.
- why_this_is_an_issue: This over-saturates decode and GPU upload on slower devices, delaying first interactive frame and increasing frame drops during initial route paint.
- urgency: very high
- location: `src/lib/comps/carousel.svelte:337-342`
- evidence: `{#each renderableProjects ...}` with per-item `useTexture(...).then(...)` and `{#await texture ...}`; build output also reports a large client node (`nodes/2...js` about `770.93 kB`) and chunk-size warnings.
- recommended_action: Introduce staged texture loading (visible-first and neighbor-first windows) plus concurrency caps. Keep far items deferred until idle or interaction.
- verification: Measure first route paint and frame stability with CPU/network throttling before and after; ensure reduced simultaneous network requests and improved frame consistency.

### 3) Project page eagerly imports all poster modules to render one project

- issue: The `[slug]` page module creates a full eager poster map, even though only two poster URLs are needed for the current project.
- why_this_is_an_issue: This is an over-eager module-loading boundary that increases route parse/initialization cost and expands client/server chunks unnecessarily during project navigations.
- urgency: high
- location: `src/routes/projects/[slug]/+page.ts:4-7`, `src/routes/projects/[slug]/+page.ts:17-18`
- evidence: `import.meta.glob('/src/lib/assets/posters/*.png', { eager: true, import: 'default' })` then selecting only `id.png` and `id_annotated.png`.
- recommended_action: Replace eager glob map with direct URL construction and existence fallback, or a lazy glob lookup keyed by `params.slug` only. Keep only the required poster modules in route scope.
- verification: Build and compare route chunk composition/size; navigate between two project pages and confirm poster rendering remains correct without global poster map materialization.

### 4) Lenis initialization has a mount/unmount race with late async resolution

- issue: Multiple pages call `setupLenis().then(...)` without cancellation guards.
- why_this_is_an_issue: If unmount happens before promise resolution, cleanup runs with `lenis === null`, then late resolution assigns a live Lenis instance after teardown, risking leaked listeners and duplicate RAF work across quick navigations.
- urgency: high
- location: `src/routes/about/+page.svelte:30-41`, `src/routes/archive/+page.svelte:67-76`, `src/routes/projects/[slug]/+page.svelte:52-61`, `src/lib/utils.ts:31-50`
- evidence: promise assignment pattern (`setupLenis().then((l) => { lenis = l; })`) with cleanup relying on mutable outer variable.
- recommended_action: Add cancellation flag or `AbortController`-style guard around async Lenis setup and destroy immediately when resolved after unmount. Prefer a shared utility returning `{ instance, dispose }` with deterministic lifecycle.
- verification: Navigate rapidly between routes (including back/forward), then confirm only one Lenis instance and one scroll loop remain active in profiling.

### 5) Await blocks omit explicit error state handling

- issue: Await templates resolve happy-path values but provide no `{:catch}` branch.
- why_this_is_an_issue: Rejected async values collapse UX resilience and can surface as silent or console-only failures, leaving users with incomplete sections and no recovery messaging.
- urgency: medium
- location: `src/routes/about/+page.svelte:73-77`, `src/lib/comps/vid.svelte:84-133`
- evidence: `{#await ... then ...}` blocks with no catch branch.
- recommended_action: Add explicit `{:catch}` states with minimal user-safe fallback UI and logging hooks. If `aboutText` is synchronous, remove `{#await}` entirely and render directly.
- verification: Force rejection (mock invalid video URL parser branch / throw in markdown parser path) and confirm visible fallback plus no unhandled rejection noise.

### 6) Poster download async fetch has no timeout, status validation, or retry boundary

- issue: `downloadPoster` performs direct `fetch` and blob conversion without bounded failure behavior.
- why_this_is_an_issue: This async boundary can hang or fail silently on transient network/CDN errors; users get no feedback and repeated clicks can create redundant concurrent requests.
- urgency: medium
- location: `src/lib/comps/poster.svelte:33-54`
- evidence: `const response = await fetch(sourceURl); const blob = await response.blob();` with no `response.ok` check, timeout, or guard.
- recommended_action: Add timeout and `response.ok` handling, prevent duplicate in-flight downloads per button, and provide transient error/success UI.
- verification: Simulate offline and high-latency conditions; confirm bounded timeout, one in-flight request max, and clear user-visible error state.

## Highest-Impact Remediation Order

1. Fix carousel readiness gating and staged texture loading (`Findings 1-2`).
2. Remove eager poster glob from `[slug]` route and keep per-project assets scoped (`Finding 3`).
3. Harden Lenis async lifecycle with cancellation-safe teardown (`Finding 4`).
4. Add await catch-state resilience and simplify non-async await usage (`Finding 5`).
5. Add timeout/retry/status handling for poster download flow (`Finding 6`).

## Optional Build/Typecheck Evidence

- `bun run check`: completed with `0 errors` and `0 warnings`.
- `bun run build`: completed successfully; emitted chunk-size warning with client node over 500 kB, reinforcing async/module-loading pressure on the critical route path.
