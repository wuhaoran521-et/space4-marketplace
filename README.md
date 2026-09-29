# SPACE⁴

SPACE⁴ 是一个面向上海非标商业空间的 AI 原生发现与合作平台原型。首页把三维空间与可用时间组合在同一视觉模型中，并展示免费合作、低价竞拍与联合策展等核心机会。

## 本地运行

需要 Node.js 20.9 或更高版本。

```bash
npm install
npm run dev
```

打开 [http://127.0.0.1:3000](http://127.0.0.1:3000)。

## 质量检查

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## 部署

仓库包含 GitHub Pages 工作流。推送到 `main` 后，Actions 会构建 Next.js 静态站点并发布 `apps/web/out`。
