# tasks.md — 现状与待办

> 本文档替代旧版规划。旧版仍在提 `graphcard-productivity-rank.html`、`app.py`、四份重复数据源等，这些都已不存在或已解决（见下）。

## 已完成

- ✅ **公共数据源**：抽出 `assets/data/gpu-dataset.js`，`index.html` 与 `vram-calc.html` 共用，不再各写一份。
- ✅ **公共主题**：抽出 `assets/styles/theme.css`（品牌色等变量）与 `assets/styles/base.css`。
- ✅ **公共脚本**：抽出 `assets/scripts/i18n.js`（中英文切换）与 `assets/scripts/reveal.js`（滚动动画）。
- ✅ **清理旧页面**：删除 `graphcard-productivity-rank.html`、`app.py`。
- ✅ **目录整理**：资产归入 `assets/`，页面按 `pages/hardware` 与 `pages/concepts` 分组，`index.html` 保持在根目录。

## 待办

### 🔴 高优先级

1. **补齐 README 的截图与数据来源标注** —— README 已补，仍缺页面截图。
2. **数据可信度** —— `assets/data/gpu-dataset.js` 目前是整理用的参考数据，需标注来源与更新时间，或替换为实测数据。

### 🟡 中等优先级

3. **red_one.html 导航是一处死胡同** —— 它只链回 `../../index.html`，从 concepts 组进入后无法返回原组。建议给两组页面加统一的「返回 / 相关页面」入口。
4. **移动端体验** —— `index.html` 的大表格在窄屏会溢出，需补 media query。
5. **导航组件统一** —— 硬件组与原理组的导航 HTML 结构仍各写各的，可抽成公共片段（纯静态下可用 JS 注入）。

### 🟢 低优先级

6. **排行榜搜索 / 排序** —— 按价格、VRAM、性能点击表头排序。
7. **Chart.js 多维度** —— 目前只有「LLM 推理速度 vs 价格」，可加文生图 / 文生视频维度切换。
8. **PWA / 离线支持** —— 已有 `favicon.svg`，可进一步加 manifest 与 Service Worker。
9. **CI/CD** —— 加 GitHub Actions 做 HTML 链接检查并部署到 GitHub Pages。

## 备注

- `resources/fiveserver.js` 是编辑器 Live Server 的注入脚本，非项目代码，可忽略或移出仓库。
- 本地起服务：`python3 -m http.server 8000`，或 `npx serve .`。
