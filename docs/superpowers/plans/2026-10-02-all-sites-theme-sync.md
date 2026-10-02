# 全站字体与三主题同步实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让首页把当前主题单向传给八个阅读站，并让尚未改造的七站使用同一字体配置、宣纸/青瓷/夜读三主题及各自独立的持久化状态。

**Architecture:** 首页把现有 7habit URL 改写器泛化为受支持路径表。五个 Next.js 站复用 7habit 的“纯主题解析模块 + head 首屏脚本 + React 切换器”结构；两个静态站使用等价的 head 内联首屏脚本和原生模块切换器。所有仓库保留自身布局与部署方式。

**Tech Stack:** Next.js 16、React 19、TypeScript、Tailwind CSS v4、原生 HTML/CSS/JavaScript、Node test runner、GitHub Pages。

## Global Constraints

- 主题 ID 只能是 `paper`、`celadon`、`night`。
- 主题名称只能是“宣纸”“青瓷”“夜读”。
- 色样依次为 `["#f3efe6","#1c3d36"]`、`["#e5ede9","#1d4a5c"]`、`["#161412","#8fc7b0"]`。
- 字体角色为 Noto Sans SC 400/600/700、Noto Serif SC 600/700/900、Cormorant Garamond 500/600 normal/italic、LXGW WenKai Screen。
- 主题优先级固定为：合法 URL 参数 > 本站合法存储值 > `paper`。
- 合法 URL 参数写回本站键；非法参数不污染存储；localStorage 异常不得阻止主题应用。
- 子站不得写入 `principles:theme`，也不得写入其他子站的键。
- 首页只改写同源的八个受支持路径，并保留已有 query/hash。
- 每个行为改动必须先写测试并确认 RED，再写实现确认 GREEN。
- 修改任何 Next.js 文件前，先读 `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md`、`node_modules/next/dist/docs/01-app/02-guides/scripts.md` 和 `node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`。

所有 Next.js 子站的 `src/lib/theme.ts` 使用以下精确接口，只替换 `THEME_KEY`：

```ts
export const THEME_KEY = "<site>:theme";
export const THEMES = [
  { id: "paper", name: "宣纸", swatch: ["#f3efe6", "#1c3d36"] },
  { id: "celadon", name: "青瓷", swatch: ["#e5ede9", "#1d4a5c"] },
  { id: "night", name: "夜读", swatch: ["#161412", "#8fc7b0"] },
] as const;
export type ThemeId = (typeof THEMES)[number]["id"];
const isTheme = (value: string | null): value is ThemeId =>
  THEMES.some(({ id }) => id === value);
export function resolveTheme(query: string | null, stored: string | null): ThemeId {
  return isTheme(query) ? query : isTheme(stored) ? stored : "paper";
}
```

`THEME_BOOTSTRAP_SCRIPT` 必须内联相同判定：读取 `new URLSearchParams(location.search).get("theme")`，以 try/catch 读取本站键，只在 query 合法时以 try/catch 写回；paper 移除 `data-theme`，其余写入该属性。

三个主题的阅读站语义变量固定为：

```css
:root {
  --background:#f3efe6; --foreground:#1c1916; --pine:#1c3d36;
  --pine-soft:#e5f0eb; --clay:#8a4b32; --band:#efe4d2;
  --line:#e0d5c4; --muted:#5c554c; --paper:#f7f3eb;
  --ink:#1c1916; --on-pine:#f7f3eb; --selection:#d7ebe3;
}
:root[data-theme="celadon"] {
  --background:#e5ede9; --foreground:#16201d; --pine:#1d4a5c;
  --pine-soft:#dcebf0; --clay:#9c5236; --band:#d6e4de;
  --line:#c3d4cc; --muted:#4c5b55; --paper:#f1f6f3;
  --ink:#14201c; --on-pine:#f1f6f3; --selection:#c7dfe8;
}
:root[data-theme="night"] {
  --background:#161412; --foreground:#e9e2d5; --pine:#8fc7b0;
  --pine-soft:#1f2e29; --clay:#e0a07c; --band:#2a251f;
  --line:#38322a; --muted:#a69d90; --paper:#1f1c18;
  --ink:#efe8db; --on-pine:#13201c; --selection:#2f4a40;
}
```

---

### Task 1: 泛化首页的主题链接桥接

**Repository:** `/tmp/home-theme`

**Files:**
- Modify: `src/lib/theme-links.ts`
- Modify: `tests/book.test.mjs`

**Interfaces:**
- Produces: `withReadingTheme(href: string, theme: ThemeId, origin: string): string`
- Keeps: `THEMES`, `ThemeId`, `isThemeId`
- Consumed by: `src/components/theme-link-sync.tsx`

- [ ] **Step 1: 写失败测试**

把测试导入改为 `withReadingTheme`，用表驱动覆盖：

```js
const paths = [
  "/7habit/habit-1/#plain",
  "/ruiprincipal/reality/?from=room#plain",
  "/ep/cooperate/",
  "/sunzi/#chapter/3",
  "/zhouyi-reading-cards/#gua/60",
  "/lijiu/?from=room#golden-mean",
  "/cgt/1/",
  "/36/1/",
];

for (const path of paths) {
  const themed = withReadingTheme(`${origin}${path}`, "night", origin);
  const url = new URL(themed);
  assert.equal(url.searchParams.get("theme"), "night");
  assert.equal(url.hash, new URL(`${origin}${path}`).hash);
  assert.equal(url.searchParams.get("from"), new URL(`${origin}${path}`).searchParams.get("from"));
}
assert.equal(withReadingTheme(`${origin}/unknown/`, "night", origin), `${origin}/unknown/`);
assert.equal(withReadingTheme("https://example.com/cgt/", "night", origin), "https://example.com/cgt/");
```

- [ ] **Step 2: 运行测试确认 RED**

Run: `npm test`

Expected: FAIL，因为 `withReadingTheme` 尚未导出，且非 7habit 路径尚未改写。

- [ ] **Step 3: 写最小实现**

在 `theme-links.ts` 定义精确路径表：

```ts
const READING_PATHS = [
  "/7habit/",
  "/ruiprincipal/",
  "/ep/",
  "/sunzi/",
  "/zhouyi-reading-cards/",
  "/lijiu/",
  "/cgt/",
  "/36/",
] as const;

export function withReadingTheme(href: string, theme: ThemeId, origin: string): string {
  const url = new URL(href);
  if (url.origin !== origin || !READING_PATHS.some((path) => url.pathname.startsWith(path))) {
    return href;
  }
  url.searchParams.set("theme", theme);
  return url.href;
}
```

把 `theme-link-sync.tsx` 的调用改为新函数名；不要改变现有事件 detail 和 MutationObserver 行为。

- [ ] **Step 4: 验证 GREEN**

Run: `npm test && npm run lint && npx next typegen && npx tsc --noEmit && npm run build:gh && git diff --check`

Expected: 现有 18 项及新增表驱动断言全部 PASS，其他命令 exit 0。

- [ ] **Step 5: 提交**

```bash
git add src/lib/theme-links.ts src/components/theme-link-sync.tsx tests/book.test.mjs
git commit -m "Pass the home theme to every reading site"
```

---

### Task 2: 原则站主题改造

**Repository:** `/tmp/theme-ruiprincipal`

**Branch:** `cursor/ruiprincipal-theme-sync-3ee2`

**Files:**
- Create: `src/lib/theme.ts`
- Create: `src/components/theme-switcher.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/components/reading-shell.tsx`
- Modify: `src/components/chapter-view.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `tests/book.test.mjs`

**Interfaces:**
- Produces: `THEME_KEY = "ruiprincipal:theme"`, `resolveTheme(queryTheme, storedTheme)`, `THEME_BOOTSTRAP_SCRIPT`, `ThemeSwitcher`

- [ ] **Step 1: 创建分支并安装字体**

```bash
git checkout -b cursor/ruiprincipal-theme-sync-3ee2
npm install lxgw-wenkai-screen-web@latest
```

- [ ] **Step 2: 写失败测试**

在 `tests/book.test.mjs` 增加 `resolveTheme` 优先级的四项断言，以及源码契约：

```js
assert.equal(resolveTheme("night", "paper"), "night");
assert.equal(resolveTheme(null, "celadon"), "celadon");
assert.equal(resolveTheme("invalid", "night"), "night");
assert.equal(resolveTheme(null, null), "paper");
assert.equal(THEME_KEY, "ruiprincipal:theme");
assert.doesNotMatch(THEME_BOOTSTRAP_SCRIPT, /principles:theme/);
```

并读取 layout/CSS/switcher，断言 head 内首屏脚本、`suppressHydrationWarning`、三主题选择器、四种字体及三个 radio 标签。

- [ ] **Step 3: 运行测试确认 RED**

Run: `npm test`

Expected: FAIL，`src/lib/theme.ts` 不存在。

- [ ] **Step 4: 实现状态与首屏**

按全局主题模块模板实现 `src/lib/theme.ts`，键为 `ruiprincipal:theme`。在 layout 中加入 Cormorant Garamond、LXGW WenKai CSS、`THEME_BOOTSTRAP_SCRIPT`、head 内联脚本和 `suppressHydrationWarning`。

- [ ] **Step 5: 实现视觉和切换器**

将首页三套变量逐值加入 `globals.css`，增加 `--on-pine`、`--selection`、`.font-kai`、`.font-num`。在侧栏标题下挂载 `ThemeSwitcher`，其事件名为 `ruiprincipal-theme-change`，角色为 `radiogroup`/`radio`。标题保持现有布局；章节序号使用 `.font-num`，导读文字使用 `.font-kai`。

- [ ] **Step 6: 验证 GREEN 并提交**

Run: `npm test && npm run lint && npx next typegen && npx tsc --noEmit && npm run build:gh && git diff --check`

```bash
git add package.json package-lock.json src tests/book.test.mjs
git commit -m "Add unified typography and themes to Principles"
```

---

### Task 3: 进化心理学站主题改造

**Repository:** `/tmp/theme-ep`

**Branch:** `cursor/ep-theme-sync-3ee2`

**Files:**
- Create: `src/lib/theme.ts`
- Create: `src/components/theme-switcher.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/components/reading-shell.tsx`
- Modify: `src/components/chapter-view.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `tests/book.test.mjs`

**Interfaces:**
- Produces: `THEME_KEY = "ep:theme"`、`resolveTheme(queryTheme, storedTheme)`、`THEME_BOOTSTRAP_SCRIPT`、`ThemeSwitcher`；事件名 `ep-theme-change`

- [ ] **Step 1: 创建分支、安装最新版 `lxgw-wenkai-screen-web`**
- [ ] **Step 2: 先写解析、隔离、首屏、字体和 radio 契约测试**

测试必须断言：

```js
assert.equal(resolveTheme("night", "paper"), "night");
assert.equal(resolveTheme(null, "celadon"), "celadon");
assert.equal(resolveTheme("invalid", "night"), "night");
assert.equal(resolveTheme(null, null), "paper");
assert.equal(THEME_KEY, "ep:theme");
assert.doesNotMatch(THEME_BOOTSTRAP_SCRIPT, /principles:theme|ruiprincipal:theme/);
```

并读取 layout/CSS/switcher，断言 head 内脚本、hydration 抑制、三个主题选择器、四字体和三个 radio 标签。

- [ ] **Step 3: 运行 `npm test`，确认因主题模块缺失而 RED**
- [ ] **Step 4: 按全局模板实现 `theme.ts`、layout 首屏脚本和三主题 CSS；切换器使用事件名 `ep-theme-change` 并挂在侧栏标题下**
- [ ] **Step 5: 运行完整验证**

Run: `npm test && npm run lint && npx next typegen && npx tsc --noEmit && npm run build:gh && git diff --check`

- [ ] **Step 6: 提交**

```bash
git add package.json package-lock.json src tests/book.test.mjs
git commit -m "Add unified typography and themes to Evolutionary Psychology"
```

---

### Task 4: 菜根谭站主题改造

**Repository:** `/tmp/theme-cgt`

**Branch:** `cursor/cgt-theme-sync-3ee2`

**Files:**
- Create: `src/lib/theme.ts`
- Create: `src/components/theme-switcher.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/components/reading-shell.tsx`
- Modify: `src/components/entry-view.tsx`
- Modify: `src/components/overview-view.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `tests/book.test.mjs`

**Interfaces:**
- Produces: `THEME_KEY = "cgt:theme"`；事件名 `cgt-theme-change`

- [ ] **Step 1: 创建分支并安装最新版楷体包**
- [ ] **Step 2: 先写主题解析、独立键、首屏、字体和 radio 契约测试**

测试断言 query `night` 优先、stored `celadon` 次之、非法 query 回退 stored、无有效值回退 paper；键精确为 `cgt:theme`；bootstrap 不包含其他站的键；layout/CSS/switcher 包含首屏脚本、三主题、四字体和三个 radio。
- [ ] **Step 3: 运行 `npm test` 确认 RED**
- [ ] **Step 4: 按全局模板实现状态、head 首屏脚本和三主题变量；切换器使用 `cgt-theme-change` 并挂在侧栏标题下**
- [ ] **Step 5: 给则数使用数字字体，题词/导读使用楷体；不改任何原文、注释、译文或五步内容**
- [ ] **Step 6: 运行完整验证并提交**

Run: `npm test && npm run lint && npx next typegen && npx tsc --noEmit && npm run build:gh && git diff --check`

```bash
git add package.json package-lock.json src tests/book.test.mjs
git commit -m "Add unified typography and themes to Caigentan"
```

---

### Task 5: 三十六计站主题改造

**Repository:** `/tmp/theme-36`

**Branch:** `cursor/36-theme-sync-3ee2`

**Files:**
- Create: `src/lib/theme.ts`
- Create: `src/components/theme-switcher.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/components/reading-shell.tsx`
- Modify: `src/components/entry-view.tsx`
- Modify: `src/components/overview-view.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `tests/book.test.mjs`

**Interfaces:**
- Produces: `THEME_KEY = "36:theme"`；事件名 `36-theme-change`

- [ ] **Step 1: 创建分支并安装最新版楷体包**
- [ ] **Step 2: 先写键为 `36:theme` 的解析、隔离、首屏、字体和 radio 契约测试**

测试断言四种解析结果、bootstrap 不包含其他站的键，并读取 layout/CSS/switcher 验证 head 首屏脚本、三主题、四字体和三个 radio。
- [ ] **Step 3: 运行 `npm test` 确认 RED**
- [ ] **Step 4: 按全局模板实现状态、head 首屏脚本和三主题变量；切换器使用 `36-theme-change` 并挂在侧栏标题下**
- [ ] **Step 5: 给计数/序号使用数字字体，序言/导读使用楷体；不修改三十六计内容**
- [ ] **Step 6: 运行完整验证并提交**

Run: `npm test && npm run lint && npx next typegen && npx tsc --noEmit && npm run build:gh && git diff --check`

```bash
git add package.json package-lock.json src tests/book.test.mjs
git commit -m "Add unified typography and themes to Thirty-Six Stratagems"
```

---

### Task 6: 历久站替换为三主题

**Repository:** `/tmp/theme-lijiu`

**Branch:** `cursor/lijiu-theme-sync-3ee2`

**Files:**
- Create: `src/lib/theme.ts`
- Rewrite: `src/components/theme-toggle.tsx`
- Delete: `src/components/theme-provider.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: relevant `tests/*.test.mjs`

**Interfaces:**
- Produces: `THEME_KEY = "lijiu:theme"`；事件名 `lijiu-theme-change`
- Replaces: `ThemeToggle` 的二元 light/dark API with 三个 radio 选项

- [ ] **Step 1: 创建分支并安装最新版楷体包**
- [ ] **Step 2: 写失败测试**

测试 `resolveTheme` 四种优先级、键隔离、layout 不再引用 `ThemeProvider`、源码不再包含 `next-themes`/`.dark`、三主题 radio 和四字体契约。

- [ ] **Step 3: 运行 `npm test` 确认 RED**
- [ ] **Step 4: 实现 `theme.ts` 和 layout 首屏脚本，删除 ThemeProvider 包裹**
- [ ] **Step 5: 把 `ThemeToggle` 改为三选一切换器，并保留页面中现有挂载位置**
- [ ] **Step 6: 把两套 `:root/.dark` 变量映射为 `:root`、`:root[data-theme="celadon"]`、`:root[data-theme="night"]`；工作台专用变量在三主题中都给出明确值**
- [ ] **Step 7: 删除未使用的 `next-themes` 依赖；加入 Cormorant 和 LXGW 字体；保留现有本地隶书字体用途**
- [ ] **Step 8: 完整验证并提交**

Run: `npm test && npm run lint && npx next typegen && npx tsc --noEmit && npm run build:gh && git diff --check`

```bash
git add package.json package-lock.json src tests
git commit -m "Replace Lijiu light and dark modes with three themes"
```

---

### Task 7: 孙子兵法静态站主题改造

**Repository:** `/tmp/theme-sunzi`

**Branch:** `cursor/sunzi-theme-sync-3ee2`

**Files:**
- Create: `js/theme.mjs`
- Create: `tests/theme.test.mjs`
- Modify: `index.html`
- Modify: `css/style.css`

**Interfaces:**
- Produces: `THEME_KEY = "sunzi:theme"`, `resolveTheme(query, stored)`, `applyTheme(theme)`, `initThemeSwitcher()`

- [ ] **Step 1: 创建分支并写失败测试**

`tests/theme.test.mjs` 导入 `resolveTheme`，断言四种优先级；读取 HTML/CSS，断言 head 内首屏脚本、独立键、三个 radio、三主题变量、字体 URL 与已有 `#chapter/` hash 路由仍存在。

- [ ] **Step 2: 运行 RED**

Run: `node --test tests/theme.test.mjs`

Expected: FAIL，因为 `js/theme.mjs` 不存在。

- [ ] **Step 3: 实现纯主题模块**

```js
export const THEME_KEY = "sunzi:theme";
export const THEMES = ["paper", "celadon", "night"];
export function resolveTheme(query, stored) {
  return THEMES.includes(query) ? query : THEMES.includes(stored) ? stored : "paper";
}
```

`applyTheme` 对 paper 移除 `data-theme`，其他值写属性；`initThemeSwitcher` 绑定 header 中三个 radio，更新 `aria-checked` 和本站存储。

- [ ] **Step 4: 实现首屏与视觉**

在 CSS 之前加入同步内联脚本，键为 `sunzi:theme`。header 增加三选一控件并以 module script 引入 `theme.mjs`。CSS 增加 Google Fonts URL 和 LXGW WenKai CDN/包产物可用 URL，定义四字体角色及首页同值主题变量；把现有颜色引用改到语义变量，不改布局和 hash 路由。

- [ ] **Step 5: 验证与提交**

Run: `node --test tests/theme.test.mjs && python3 -m http.server 4171`（浏览器验证后停止服务）

```bash
git add index.html css/style.css js/theme.mjs tests/theme.test.mjs
git commit -m "Add unified typography and themes to Sunzi"
```

---

### Task 8: 周易静态站主题改造

**Repository:** `/tmp/theme-zhouyi`

**Branch:** `cursor/zhouyi-theme-sync-3ee2`

**Files:**
- Create: `js/theme.mjs`
- Create: `tests/theme.test.mjs`
- Modify: `index.html`
- Modify: `css/style.css`

**Interfaces:**
- Produces: `THEME_KEY = "zhouyi-reading-cards:theme"`、`THEMES`、`resolveTheme(query, stored)`、`applyTheme(theme)`、`initThemeSwitcher()`；必须保留 `#gua/<id>` 路由

- [ ] **Step 1: 创建分支并写键为 `zhouyi-reading-cards:theme` 的失败测试**
- [ ] **Step 2: 运行 `node --test tests/theme.test.mjs` 确认 RED**
- [ ] **Step 3: 实现主题模块、head 同步首屏脚本和三个 radio**
- [ ] **Step 4: 加入四字体与三主题语义变量；不改变六十四卦内容、卡片结构和 hash 路由**
- [ ] **Step 5: 运行 Node 测试并用本地 HTTP 服务验证 `?theme=night#gua/60` 同时保留主题和定位**
- [ ] **Step 6: 提交**

```bash
git add index.html css/style.css js/theme.mjs tests/theme.test.mjs
git commit -m "Add unified typography and themes to Zhouyi"
```

---

### Task 9: 跨站集成、审查、推送和部署

**Repositories:** 上述八个工作目录

- [ ] **Step 1: 对八个仓库分别运行新鲜的完整验证**

Next.js 仓库运行：

```bash
npm test
npm run lint
npx next typegen
npx tsc --noEmit
npm run build:gh
git diff --check
```

静态仓库运行：

```bash
node --test tests/theme.test.mjs
git diff --check
```

- [ ] **Step 2: 做逐仓库代码审查**

检查 Critical/Important 问题，重点是 storage 键隔离、首屏顺序、历久旧主题残留、静态站 hash 路由和首页八路径白名单。发现问题时先补失败测试再修复并复审。

- [ ] **Step 3: 本地同源浏览器集成**

把八站生产输出挂到一个同源 HTTP 根目录，Playwright 表驱动验证三主题 × 八站，覆盖普通链接、iframe、“新页面打开”、锚点、刷新、非法参数、storage 异常、console/page error、桌面和移动端。

- [ ] **Step 4: 推送每个功能分支并建立/更新草稿 PR**

每个仓库使用 `git push -u origin <branch>`；PR 描述列出实际测试结果和对应截图。

- [ ] **Step 5: 按顺序上线**

先把七个子站 fast-forward 到各自 `main` 并推送，等待各自 Pages workflow 成功；再把首页 fast-forward 到 `main` 并推送。

- [ ] **Step 6: 线上回读**

逐站请求线上 HTML/JS/CSS，确认新的存储键、三主题变量和字体存在；再用浏览器从首页进入每站，验证主题和锚点。只有八站全部通过后才宣告完成。
