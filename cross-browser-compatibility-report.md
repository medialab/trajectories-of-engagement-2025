# AGENT EXECUTION HEADER - REQUIRED
You are the implementation orchestrator for this report.
Activate subagents now: codebase-mapper, root-cause-analyst, fix-planner, verification-agent.
Use a reflexive loop for each finding: observe -> challenge assumptions -> validate with code evidence -> choose the smallest safe fix.
Treat every finding as actionable work, not commentary.
Prioritize execution strictly by `urgency` (`low`, `medium`, `high`, `very high`, `extremely high`).
For each fix, preserve behavior, define verification steps, and record any remaining risk.

## WebKit (Safari / iOS)

### Finding 1
- issue: Viewport-height sizing is mixed across `min-h-dvh`, `h-screen` (`100vh`), and fixed full-screen layers without fallback strategy.
- why_this_is_an_issue: iOS Safari has known toolbar/dynamic viewport behaviors where `100vh` and dynamic units can produce clipped content, jumpy transitions, or hidden controls during chrome expansion/collapse.
- urgency: very high
- location: `src/routes/+layout.svelte:48`, `src/routes/+page.svelte:43`, `src/lib/comps/canvas.svelte:170-181`
- evidence: Route wrapper uses `min-h-dvh`; home page root uses `h-screen`; Bezier canvas uses fixed `height: 100vh`.
- recommended_action: Standardize viewport sizing with fallback layering (for example `min-height: 100vh; min-height: 100dvh;`) and validate fixed overlays with safe-area/toolbar behavior on iOS.
- verification: On iOS Safari (current + one older major), navigate between routes while showing/hiding browser chrome; confirm no vertical clipping, no jump on orientation change, and no obscured controls.

### Finding 2
- issue: Clipboard copy action assumes `navigator.clipboard.writeText` support and permission without fallback/error handling.
- why_this_is_an_issue: Clipboard API availability differs by browser/security context; unsupported or denied calls fail silently, especially in older Safari/private contexts.
- urgency: high
- location: `src/lib/comps/btn.svelte:20-22`
- evidence: `navigator.clipboard.writeText(window.location.href);` is called directly with no feature detection, permission handling, or fallback path.
- recommended_action: Add capability checks and fallback (`execCommand('copy')` or temporary input selection) with user feedback on failure.
- verification: Test copy-link button on Safari iOS, Safari macOS, Firefox, and Chromium in secure + restricted contexts; confirm success/failure is surfaced deterministically.

### Finding 3
- issue: Home/canvas interaction layers aggressively disable touch defaults (`touch-action: none`, overscroll constraints) while hover behavior relies on pointer-enter/leave.
- why_this_is_an_issue: Mobile Safari touch gesture handling differs from desktop pointer flows; this can degrade scroll/gesture UX and make interactions feel blocked or inconsistent on touch devices.
- urgency: high
- location: `src/routes/+page.svelte:130-140`, `src/routes/+page.svelte:171-176`, `src/lib/comps/canvas.svelte:182-190`, `src/lib/comps/carousel.svelte:441-453`
- evidence: Multiple full-screen containers set `touch-action: none`; poster behavior uses `onpointerenter`/`onpointerleave` and hover scaling assumptions.
- recommended_action: Scope `touch-action: none` only to truly draggable zones, add explicit touch-friendly fallbacks (`pointerdown/up` or tap states), and preserve vertical page-scroll intent on mobile.
- verification: On iOS Safari and Android Chrome, test scroll, tap, drag, and route navigation from home carousel; confirm no gesture dead-zones and no blocked scrolling.

## Gecko (Firefox)

### Finding 4
- issue: `color-mix(...)` is used without a preceding fallback color token.
- why_this_is_an_issue: On older Gecko/WebKit builds lacking full support, computed value can degrade unexpectedly and alter table/container contrast.
- urgency: medium
- location: `src/routes/archive/+page.svelte:177-180`
- evidence: `.t_container` defines `background-color: color-mix(in srgb, var(--primary-light) 95%, transparent);`.
- recommended_action: Keep explicit fallback first (`background-color: var(--primary-light);`) and then override with `color-mix(...)` behind `@supports` if strict compatibility is required.
- verification: In Firefox ESR/older Safari target, confirm archive container background remains readable and visually consistent.

### Finding 5
- issue: `overflow-clip` utility is used for main page containers without fallback utility pairing.
- why_this_is_an_issue: `overflow: clip` support is newer than `overflow: hidden`; older engines may treat it differently and allow unintended overflow rendering.
- urgency: medium
- location: `src/app.css:38-40`
- evidence: `.main_container` applies `overflow-clip` via Tailwind utility.
- recommended_action: Pair with conservative fallback (`overflow-hidden`) for target engines that do not fully support `clip` semantics.
- verification: On Firefox ESR and older Safari builds, validate no unexpected horizontal/vertical bleed on animated/fixed layers.

## Cross-Engine Targeting / Transpilation

### Finding 6
- issue: Browser support policy is implicit; no explicit browserslist/target matrix is declared in package/build config.
- why_this_is_an_issue: Without explicit targets, transpilation/polyfill behavior follows tool defaults and may drift; required support for older Safari/Firefox/mobile devices is not enforceable.
- urgency: high
- location: `package.json:1-48`, `vite.config.ts:1-25`
- evidence: `package.json` has no `browserslist`; Vite config defines plugins only and no target policy.
- recommended_action: Define supported browsers explicitly (for example Browserslist + Vite target policy), and map required polyfills/fallbacks for that matrix.
- verification: Build artifacts validated against declared matrix via BrowserStack/Sauce or physical devices; confirm no syntax/API regressions in lowest supported versions.

## Compatibility Test Matrix (Must-Test Flows)

1. Engine: iOS Safari (current + previous major), Device: iPhone with dynamic toolbar.
   - Flows: home load, route transitions, carousel interaction, copy-link action.
   - Risk coverage: Findings 1, 2, 3.
2. Engine: Android Chrome (current + one low-end device), Device: touch-first.
   - Flows: carousel drag/tap, archive scrolling, project page media interactions.
   - Risk coverage: Findings 1, 3.
3. Engine: Firefox desktop (current + ESR).
   - Flows: archive visual rendering, page layout overflow behavior, copy-link fallback.
   - Risk coverage: Findings 2, 4, 5.
4. Engine: Safari macOS (current + one prior major).
   - Flows: route transition overlays, fixed canvas layering, copy-link behavior.
   - Risk coverage: Findings 1, 2, 3.
5. Engine: Chromium desktop (baseline control).
   - Flows: full smoke regression of `/`, `/about/`, `/archive/`, `/projects/[slug]`.
   - Risk coverage: validate fallback changes do not regress primary engine.

## Verification Checklist

1. Viewport sizing remains stable under browser chrome expansion/collapse on iOS Safari.
2. Copy-link action succeeds or provides explicit error feedback across engines.
3. Touch interactions do not block native scrolling unintentionally.
4. Archive background/contrast degrades gracefully where `color-mix` is unavailable.
5. Overflow behavior is consistent where `overflow: clip` is unsupported.
6. Declared browser target policy is enforced by build/transpile configuration.
