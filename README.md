# hardware-compare · Hardware.ai

**English** | [中文](README.zh-CN.md)

A collection of static pages for **choosing hardware for local AI**: a GPU benchmark leaderboard, VRAM and bandwidth calculators, a real workstation build list, and a set of explainers on how model weights and context consume VRAM.

Everything is plain static HTML — no build step. Clone the repo and open it in a browser or serve it with any static file server.

🌐 **Live site**: <https://haokaibo.github.io/hardware-compare/> (deployed automatically by GitHub Actions, see `.github/workflows/deploy-pages.yml`)

## Pages

| Page | Path | Description |
| --- | --- | --- |
| AI GPU Benchmark | `index.html` | Main page. Filterable table plus a Chart.js scatter plot (LLM inference speed vs. price) |
| LLM VRAM Calculator | `pages/hardware/vram-calc.html` | Estimates VRAM usage from model size, precision, MoE active params and context length; covers inference, full training and LoRA fine-tuning |
| Bandwidth Ladder | `pages/hardware/bandwidth_ladder.html` | Compares PCIe, DDR5, VRAM and storage bandwidth, with log/linear scale switching |
| Motherboard Upgrade Calculator | `pages/hardware/motherboard_upgrade_calculator.html` | Works out the net cost of a staged motherboard upgrade path |
| RED ONE | `pages/hardware/red_one.html` | The actual parts list of a local AI workstation, with hardware photos |
| Weights & Context Calculator | `pages/concepts/calculator.html` | Calculates weights vs. KV cache space |
| The Math Behind It | `pages/concepts/context-math.html` | The math behind the calculator above, step by step |
| Inference Lifecycle | `pages/concepts/lifecycle.html` | A full request from input to output, broken into six stages with a time breakdown |
| PIPELINE ZERO | `pages/concepts/pipeline.html` | Software stack architecture, node topology and component matrix |

Pages are split into two groups: `pages/hardware/` (hardware and buying decisions, cross-linked navigation) and `pages/concepts/` (AI fundamentals, cross-linked navigation). The two groups are connected through `red_one.html`.

## Repository layout

```text
hardware-compare/
├── index.html                          # Main page (kept at repo root for static hosting)
├── favicon.svg
├── pages/
│   ├── hardware/                       # Hardware / buying decisions
│   │   ├── vram-calc.html
│   │   ├── bandwidth_ladder.html
│   │   ├── motherboard_upgrade_calculator.html
│   │   └── red_one.html
│   └── concepts/                       # AI fundamentals
│       ├── calculator.html
│       ├── context-math.html
│       ├── lifecycle.html
│       └── pipeline.html
├── assets/
│   ├── styles/
│   │   ├── theme.css                   # Shared theme tokens (brand colors, etc.)
│   │   ├── base.css                    # Shared base styles
│   │   ├── index.css                   # Page-specific styles below
│   │   ├── vram-calc.css
│   │   ├── bw-ladder.css
│   │   ├── mobo-calc.css
│   │   ├── calculator.css
│   │   ├── context-math.css
│   │   ├── lifecycle.css
│   │   └── pipeline.css
│   ├── scripts/
│   │   ├── i18n.js                     # Shared: EN / ZH language switching
│   │   ├── reveal.js                   # Shared: scroll reveal animations
│   │   ├── vram-calc.js
│   │   ├── bw-ladder.js
│   │   ├── mobo-calc.js
│   │   └── red-one.js
│   ├── images/                         # Hardware photos used by red_one.html
│   └── data/
│       └── gpu-dataset.js              # Shared GPU dataset
├── resources/
│   └── fiveserver.js                   # Editor Live Server injection, not project code
├── README.md                           # This file (English)
├── README.zh-CN.md                     # Chinese version
├── tasks.md                            # Structure notes + todo list
├── LICENSE
└── .github/  .claude/  .vscode/
```

## Run locally

Pick either:

```bash
# Python built-in server
python3 -m http.server 8000
# then open http://localhost:8000/

# or Node
npx serve .
```

You can also open `index.html` directly with an editor extension such as Live Server / Five Server in VS Code / VSCodium.

## Data source

- The shared dataset lives in `assets/data/gpu-dataset.js` and exports two arrays: `GPU_BENCHMARKS` (21 GPUs for the leaderboard) and `GPU_VRAM_LIST` (VRAM specs for the calculator). Both `index.html` and `vram-calc.html` use it.
- Adding a GPU only requires editing this one file.
- ⚠️ The numbers are reference/illustrative data, **not official measurements**. Verify them before citing.

## Tech stack

- Plain HTML + CSS + vanilla JavaScript, no build step.
- Charts: [Chart.js](https://www.chartjs.org/) loaded from a CDN.
- i18n: `assets/scripts/i18n.js` with roughly 440 EN/ZH dictionary entries. The EN / 中 toggle is injected into the navbar automatically, and the choice is persisted in `localStorage` under `hw-compare-lang` (English is the default).
- Shared theme and layout tokens in `assets/styles/theme.css` and `assets/styles/base.css`; scroll animations in `assets/scripts/reveal.js`.

## Deployment

Pushes to `main` that touch `index.html`, `favicon.svg`, `pages/**`, `assets/**` or the workflow file trigger `.github/workflows/deploy-pages.yml`. It stages only the published site files (`index.html`, `favicon.svg`, `pages/`, `assets/`) into `dist/`, adds `.nojekyll`, and deploys to GitHub Pages. Documentation and tooling such as `README.md`, `tasks.md`, `.github/` and `resources/` are not published.

## License

See [LICENSE](LICENSE) (Apache License 2.0).
