# 进化心理学

戴维·巴斯《进化心理学：心理的新科学》的独立导读。在线阅读：

**https://brianbai1123.github.io/ep/**

它按商务印书馆第4版的顺序来讲：先打地基，再讲生存、择偶、养育与亲属、群居，最后收成一套可以检验的问法。每一站都读两遍。

1. **原书在讲什么**：跟着该章自己的论证，把模型和证据边界讲清楚。
2. **用简单的话再讲一遍**：先理解，找出核心观点，重建逻辑，用校园里能观察的事表达，再用三个问题检查能不能自己讲出来。

解释不是许可。择偶几站讲的是成人研究里的平均偏好，不是给未成年人的交往指南。文中的林可是为了把道理放进校园而写的人物，不是原书人物。本站不替代原书，也与作者及出版社没有隶属关系。

## 本地预览

```bash
npm install
npm run dev
```

打开 http://127.0.0.1:43173 。

本地模拟 GitHub Pages 子路径：

```bash
npm run build:gh
npx serve out
```

## 检查

```bash
npm test
npm run lint
npm run build
```

## 部署

推送到 `main` 后，GitHub Actions 会静态导出并发布到 Pages。仓库的 Pages 源是 **GitHub Actions**。站点子路径是 `/ep/`。

## 技术栈

Next.js 16（`output: 'export'`）+ React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui 的按钮。无后端、无数据库。正文在 `src/content/`。
