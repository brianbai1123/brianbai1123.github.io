# 7habit 字体、三主题与单向同步设计

## 目标

让 `https://brianbai1123.github.io/7habit/` 使用首页 `https://brianbai1123.github.io/` 的字体配置与宣纸、青瓷、夜读三套主题；从首页进入 7habit 时，无论普通链接、弹窗 iframe 还是弹窗里的“新页面打开”，7habit 都采用首页当前主题。

同步是单向的：

- 首页主题可以覆盖 7habit 的主题。
- 7habit 内切换主题不会修改首页主题。
- 用户直接打开或刷新 7habit 时，保留 7habit 自己上次选择的主题。

## 现状

首页已经具备：

- `principles:theme` 主题存储键；
- 宣纸、青瓷、夜读三套 CSS 变量；
- Noto Sans SC、Noto Serif SC、Cormorant Garamond 与 LXGW WenKai Screen；
- 普通链接及 `PreviewDialog` iframe 两种进入 7habit 的路径。

7habit 当前只有宣纸配色，仅配置 Noto Sans SC 和 Noto Serif SC，也没有主题切换器。

两个站点位于同一 origin，但不能直接共用一个存储键：共用会让 7habit 的选择反向修改首页，不符合单向同步要求。

## 方案

### 1. 首页为 7habit 链接附加主题

首页新增客户端链接同步组件：

- 读取首页当前主题；
- 找出所有同源且路径位于 `/7habit/` 下的链接；
- 将链接规范为带 `theme=paper|celadon|night` 的地址；
- 首页主题变化后立即重新写入这些链接；
- 用 MutationObserver 处理后续动态出现的链接。

组件修改链接本身，而不是只拦截普通点击，因此以下入口使用同一个地址：

- 普通点击；
- Ctrl/Command 点击；
- 复制链接；
- `PreviewDialog` 的 iframe；
- 弹窗中的“新页面打开”。

非 7habit 链接不变；原有 query 和 hash 必须保留。

### 2. 7habit 主题优先级

7habit 使用独立键 `7habit:theme`。首屏内联脚本按以下顺序选主题：

1. URL 中合法的 `theme` 参数；
2. `7habit:theme` 中合法的保存值；
3. 宣纸。

如果 URL 带合法主题，立即写入 `7habit:theme`。这样站内后续导航即使不继续携带参数，也会保持刚从首页继承的主题。

非法参数不写入存储，回退到 7habit 自己的保存值；存储不可用时仍能在当前页面应用 URL 主题。

URL 参数保留，不自动清除，便于检查、复制和复现。

### 3. 7habit 主题切换器

7habit 新增和首页视觉、交互一致的三段式切换器：

- 宣纸；
- 青瓷；
- 夜读。

切换只修改 `data-theme` 和 `7habit:theme`，不触碰 `principles:theme`。

切换器放在阅读侧栏的站名区域；移动端侧栏头部同样可见。它使用 radiogroup 语义，并以 `aria-checked` 表示当前选择。

### 4. 字体配置

7habit 与首页保持同一字体角色：

- 正文：Noto Sans SC 400/600/700；
- 标题：Noto Serif SC 600/700/900；
- 数字：Cormorant Garamond 500/600，正常体和斜体；
- 楷体：LXGW WenKai Screen。

增加 `font-kai` 和 `font-num` 工具类。页面中的步骤编号、站数等结构性数字使用 `font-num`；标题继续使用 `font-serif`；正文继续使用 `font-sans`。安装首页同版本的 `lxgw-wenkai-screen-web`。

### 5. 三套配色

7habit 复制首页的主题变量，避免两个站对同一主题名称产生不同视觉：

- 宣纸：暖纸底、深松绿、陶土；
- 青瓷：灰青底、蓝绿强调色；
- 夜读：深褐黑底、浅青绿强调色。

补齐 `--on-pine`、`--selection` 与 `color-scheme`。所有现有组件继续通过语义变量取色，不散落主题专用颜色。

### 6. 边界与失败处理

- localStorage 不可用：主题仍在当前页面生效，只是不持久化。
- URL 主题非法：忽略，不污染存储。
- 首页 JavaScript 尚未执行：链接暂时保持原地址；水合后立即规范化。
- 外部链接、其他书站链接、站内锚点：不修改。
- 7habit 自己切换主题后回到首页：首页读取自己的 `principles:theme`，保持不变。

## 测试

### 自动测试

首页：

- 只改写 `/7habit/` 链接；
- 三个合法主题都正确附加；
- 原 query 和 hash 保留；
- 非 7habit 链接不变。

7habit：

- URL 合法主题优先；
- 无参数时读取 `7habit:theme`；
- 两者都无效时回退宣纸；
- URL 合法主题写入 7habit 自己的键；
- 切换器不引用或修改 `principles:theme`；
- 字体依赖、字体变量和三套主题均存在。

### 浏览器验证

桌面端和移动端验证：

1. 首页在宣纸、青瓷、夜读下分别普通进入 7habit；
2. 首页弹窗 iframe 与首页主题一致；
3. 弹窗“新页面打开”与首页主题一致；
4. Ctrl/Command 新标签页使用带主题地址；
5. 在 7habit 内切换后返回首页，首页主题不变；
6. 直接打开、刷新及站内导航保留 7habit 自己的主题；
7. 三套主题的文字、边框、选中态均清晰；
8. 正文、标题、数字与楷体角色和首页一致；
9. 页面无控制台错误和 hydration 错误。

## 发布

首页和 7habit 分别提交、推送和部署。先部署 7habit，再部署首页链接同步，避免首页开始发送主题参数时目标站还不能处理。
