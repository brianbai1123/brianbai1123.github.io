# 7habit Theme Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give 7habit the reading room’s fonts and three themes, with one-way theme inheritance from every home-page link.

**Architecture:** The home site rewrites every same-origin `/7habit/` anchor with a validated `theme` query parameter. The 7habit site consumes that parameter into its own storage key before first paint, then manages its theme independently.

**Tech Stack:** Next.js 16.3.3 static export, React 19, TypeScript, Tailwind CSS 4, Node test runner, Playwright.

## Global Constraints

- Valid themes are exactly `paper`, `celadon`, and `night`.
- Home storage stays `principles:theme`; 7habit uses `7habit:theme`.
- 7habit must never write `principles:theme`.
- Theme query parameters remain visible in the URL.
- Existing query parameters and hashes must survive home-link rewriting.
- Publish 7habit before the home link bridge.

---

### Task 1: Home link theme bridge

**Files:**
- Create: `src/lib/theme-links.ts`
- Create: `src/components/theme-link-sync.tsx`
- Modify: `src/components/theme-switcher.tsx`
- Modify: `src/components/principles-page.tsx`
- Modify: `tests/book.test.mjs`

**Interfaces:**
- Produces: `with7HabitTheme(href: string, theme: ThemeId, origin: string): string`
- Produces: `ThemeLinkSync`, a client component that keeps rendered 7habit anchors synchronized.
- Emits: browser event `principles:theme-change` with `detail` equal to the selected `ThemeId`.

- [ ] **Step 1: Write failing tests**

Add tests that require `with7HabitTheme` to:

```js
assert.equal(
  with7HabitTheme("https://brianbai1123.github.io/7habit/habit-1/#plain", "night", origin),
  "https://brianbai1123.github.io/7habit/habit-1/?theme=night#plain",
);
assert.equal(
  with7HabitTheme("https://brianbai1123.github.io/7habit/path/?from=room#plain", "celadon", origin),
  "https://brianbai1123.github.io/7habit/path/?from=room&theme=celadon#plain",
);
assert.equal(with7HabitTheme("https://example.com/7habit/", "night", origin), "https://example.com/7habit/");
assert.equal(with7HabitTheme("https://brianbai1123.github.io/cgt/1/", "night", origin), "https://brianbai1123.github.io/cgt/1/");
```

Also inspect source to require `ThemeLinkSync` in the page and the theme-change event in the switcher.

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test`

Expected: FAIL because `src/lib/theme-links.ts` and `ThemeLinkSync` do not exist.

- [ ] **Step 3: Implement minimal bridge**

Implement the pure URL function, then a client component that:

```ts
function sync() {
  const theme = read the validated principles:theme or "paper";
  for (const anchor of document.querySelectorAll<HTMLAnchorElement>("a[href]")) {
    const themed = with7HabitTheme(anchor.href, theme, location.origin);
    if (themed !== anchor.href) anchor.href = themed;
  }
}
```

Run it on mount, on `principles:theme-change`, and after child-list DOM mutations. Dispatch the event from `ThemeSwitcher.choose()` after applying and saving the theme. Mount `ThemeLinkSync` beside `PreviewDialog`.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `npm test && npm run lint && npx tsc --noEmit && npm run build`

Expected: all commands exit 0.

- [ ] **Step 5: Commit**

```bash
git add src tests
git commit -m "Pass the home theme through every 7habit link"
```

---

### Task 2: 7habit theme resolver and first-paint bootstrap

**Files:**
- Create: `src/lib/theme.ts`
- Create: `src/components/theme-switcher.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `tests/book.test.mjs`

**Interfaces:**
- Produces: `THEME_KEY = "7habit:theme"`
- Produces: `ThemeId`, `THEMES`, `resolveTheme(queryTheme, storedTheme)`
- Produces: `THEME_BOOTSTRAP_SCRIPT`
- Produces: `ThemeSwitcher`

- [ ] **Step 1: Write failing resolver tests**

Cover:

```js
assert.equal(resolveTheme("night", "paper"), "night");
assert.equal(resolveTheme(null, "celadon"), "celadon");
assert.equal(resolveTheme("invalid", "night"), "night");
assert.equal(resolveTheme(null, "invalid"), "paper");
assert.equal(THEME_KEY, "7habit:theme");
assert.ok(!THEME_BOOTSTRAP_SCRIPT.includes("principles:theme"));
```

Inspect layout source to require an inline pre-paint script and `suppressHydrationWarning`.

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test`

Expected: FAIL because `src/lib/theme.ts` does not exist.

- [ ] **Step 3: Implement resolver, bootstrap, and switcher**

The bootstrap must:

```js
var query = new URLSearchParams(location.search).get("theme");
var stored = localStorage.getItem("7habit:theme");
var theme = valid(query) ? query : valid(stored) ? stored : "paper";
if (valid(query)) localStorage.setItem("7habit:theme", query);
if (theme === "paper") document.documentElement.removeAttribute("data-theme");
else document.documentElement.setAttribute("data-theme", theme);
```

Wrap storage access in `try/catch`, while still applying a valid query theme if storage fails. The switcher writes only `7habit:theme`.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `npm test && npm run lint && npx tsc --noEmit`

Expected: all commands exit 0.

- [ ] **Step 5: Commit**

```bash
git add src tests
git commit -m "Add independent three-theme state to 7habit"
```

---

### Task 3: 7habit typography and theme visuals

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/reading-shell.tsx`
- Modify: `src/components/chapter-view.tsx`
- Modify: `tests/book.test.mjs`

**Interfaces:**
- Consumes: `ThemeSwitcher` and the theme bootstrap from Task 2.
- Produces: CSS variables and font roles matching the home site.

- [ ] **Step 1: Write failing source-contract tests**

Require:

```js
assert.match(layout, /Cormorant_Garamond/);
assert.match(layout, /lxgw-wenkai-screen-web/);
assert.match(css, /data-theme=\"celadon\"/);
assert.match(css, /data-theme=\"night\"/);
assert.match(css, /\\.font-kai/);
assert.match(css, /\\.font-num/);
assert.match(shell, /ThemeSwitcher/);
assert.match(chapter, /font-num/);
```

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test`

Expected: FAIL because the dependency, fonts, theme CSS, switcher placement, and numeric classes are absent.

- [ ] **Step 3: Add dependency and copy the exact home design tokens**

Run:

```bash
npm install lxgw-wenkai-screen-web@latest
```

Then:

- import LXGW WenKai CSS;
- configure Noto Serif SC weight 900 and Cormorant Garamond;
- copy the home `:root`, celadon, and night variables exactly;
- add `font-kai` and `font-num`;
- mount the switcher in the sidebar heading;
- use `font-num` on station and step numbers;
- use `font-kai` on the sidebar description and chapter lead.

- [ ] **Step 4: Run tests and build**

Run: `npm test && npm run lint && npx tsc --noEmit && npm run build:gh`

Expected: all commands exit 0 and static export succeeds.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src tests
git commit -m "Match 7habit typography and themes to the reading room"
```

---

### Task 4: Browser integration verification

**Files:**
- Create outside repositories: `/tmp/pw/7habit-theme-sync.mjs`

**Interfaces:**
- Consumes: static exports from both sites.
- Produces: assertions and screenshots for direct links, iframe links, persistence, and one-way isolation.

- [ ] **Step 1: Build and serve both exports under one origin**

Copy home output to `/tmp/theme-serve/` and 7habit output to `/tmp/theme-serve/7habit/`, then serve one HTTP origin.

- [ ] **Step 2: Verify all three inherited themes**

For each home theme:

- select it;
- assert every visible 7habit anchor contains the matching query;
- open a normal link and verify 7habit `data-theme`;
- return and open the preview iframe, then verify its `data-theme`;
- inspect the popup “new page” href.

- [ ] **Step 3: Verify one-way isolation and persistence**

- switch 7habit from the inherited theme to another;
- assert `7habit:theme` changed and `principles:theme` did not;
- reload and directly reopen 7habit without a query; assert its own theme remains;
- return home and assert the home theme remains unchanged.

- [ ] **Step 4: Verify visual states**

Capture desktop and mobile screenshots of the 7habit switcher and representative chapter content in paper, celadon, and night. Assert no page errors, console errors, or hydration warnings.

- [ ] **Step 5: Final verification**

Run in each repository:

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build:gh
```

Expected: all commands exit 0.

---

### Task 5: Publish in dependency order

**Files:**
- No source changes.

- [ ] **Step 1: Push and deploy 7habit**

Push the 7habit feature branch and deploy its main branch only after its browser checks pass.

- [ ] **Step 2: Verify live 7habit**

Check all three direct query themes and independent persistence on `https://brianbai1123.github.io/7habit/`.

- [ ] **Step 3: Push and deploy home**

Push the home feature branch and deploy the home main branch after the target site is live.

- [ ] **Step 4: Verify live cross-site paths**

Repeat direct link, popup iframe, popup new-page link, one-way isolation, and direct-refresh checks against the live origin.

- [ ] **Step 5: Update pull requests**

Update each branch’s pull request description with implementation details, test output, screenshots, and deployment evidence.
