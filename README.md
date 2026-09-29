# hardware-compare · Hardware.ai

面向 **本地 AI（Local AI）硬件选型** 的静态站点集合，包含 GPU 跑分榜、显存/带宽计算器、装机清单，以及一组讲清「权重与上下文如何吃显存」的原理科普页。

纯静态实现，无需构建：克隆后直接用浏览器或任意静态服务器打开即可。

🌐 **在线访问**：<https://haokaibo.github.io/hardware-compare/>（由 GitHub Actions 自动部署，见 `.github/workflows/deploy-pages.yml`）

## 页面一览

| 页面 | 路径 | 说明 |
| --- | --- | --- |
| AI 生产力 GPU 跑分榜 | `index.html` | 主页面。表格 + Chart.js 象限图（LLM 推理速度 vs 价格） |
| LLM 显存计算器 | `pages/hardware/vram-calc.html` | 按模型/量化/上下文估算显存占用 |
| 带宽阶梯 | `pages/hardware/bandwidth_ladder.html` | PCIe 与显存带宽对比 |
| 换板成本计算器 | `pages/hardware/motherboard_upgrade_calculator.html` | 主板升级的隐性成本核算 |
| RED ONE | `pages/hardware/red_one.html` | 一台本地 AI 工作站的实际配置单（含硬件实拍） |
| 权重与上下文计算器 | `pages/concepts/calculator.html` | 权重 / KV Cache 空间计算 |
| 计算原理 | `pages/concepts/context-math.html` | 上面那个计算器背后的数学推导 |
| 推理生命周期 | `pages/concepts/lifecycle.html` | 一次对话从输入到输出的完整处理过程 |
| PIPELINE ZERO | `pages/concepts/pipeline.html` | 软件栈架构、拓扑与组件矩阵 |

页面分为两组：`pages/hardware/`（硬件/选型，导航互通）与 `pages/concepts/`（AI 原理科普，导航互通），两组通过 `red_one.html` 相互连接。

## 目录结构

```text
hardware-compare/
├── index.html                          # 主页面（保持在根目录，便于静态托管）
├── favicon.svg
├── pages/
│   ├── hardware/                       # 硬件 / 选型
│   │   ├── vram-calc.html
│   │   ├── bandwidth_ladder.html
│   │   ├── motherboard_upgrade_calculator.html
│   │   └── red_one.html
│   └── concepts/                       # AI 原理科普
│       ├── calculator.html
│       ├── context-math.html
│       ├── lifecycle.html
│       └── pipeline.html
├── assets/
│   ├── styles/
│   │   ├── theme.css                   # 公共主题变量（品牌色等）
│   │   ├── base.css                    # 公共基础样式
│   │   ├── index.css                   # 以下为各页面专属样式
│   │   ├── vram-calc.css
│   │   ├── bw-ladder.css
│   │   ├── mobo-calc.css
│   │   ├── calculator.css
│   │   ├── context-math.css
│   │   ├── lifecycle.css
│   │   └── pipeline.css
│   ├── scripts/
│   │   ├── i18n.js                     # 公共：中英文切换
│   │   ├── reveal.js                   # 公共：滚动渐显动画
│   │   ├── vram-calc.js
│   │   ├── bw-ladder.js
│   │   ├── mobo-calc.js
│   │   └── red-one.js
│   ├── images/                         # red_one.html 的硬件实拍图
│   └── data/
│       └── gpu-dataset.js              # 共享 GPU 数据集
├── resources/
│   └── fiveserver.js                   # 编辑器 Live Server 注入，非项目代码
├── README.md
├── tasks.md                            # 结构说明 + 待办
├── LICENSE
└── .github/  .claude/  .vscode/
```

## 本地运行

任选一种：

```bash
# Python 自带
python3 -m http.server 8000
# 然后打开 http://localhost:8000/

# 或 Node
npx serve .
```

也可以直接用编辑器插件（VS Code / VSCodium 的 Live Server / Five Server）打开 `index.html`。

## 数据来源

- 共享数据集位于 `assets/data/gpu-dataset.js`，导出 `GPU_BENCHMARKS`（跑分榜）与 `GPU_VRAM_LIST`（显存计算器）两套数组，`index.html` 与 `vram-calc.html` 共同引用。
- 新增显卡只需改这一个文件。
- ⚠️ 当前数值为整理用的参考/示意数据，**非官方实测**，引用前请自行核实。

## 技术栈

- 纯 HTML + CSS + 原生 JavaScript，无构建步骤。
- 图表：[Chart.js](https://www.chartjs.org/)（通过 CDN 引入）。
- 国际化：`assets/scripts/i18n.js`，约 400 条中英文字典，语言选择存于 `localStorage`。

## 许可

见 [LICENSE](LICENSE)。
