/* =============================================
   i18n — 中英文切换
   ============================================= */

const I18N_STORAGE_KEY = 'hw-compare-lang';

// ─── Translation Dictionary ─────────────────────
const LANG = {
  // ── Navigation (shared) ────────────────────
  'nav.gpu-matrix':               { zh: 'GPU 矩阵',            en: 'GPU Matrix' },
  'nav.bw-ladder':                { zh: '带宽阶梯',           en: 'BW Ladder' },
  'nav.vram-calc':                { zh: '显存计算器',         en: 'VRAM Calc' },
  'nav.mobo-calc':                { zh: '换板计算',           en: 'Mobo Calc' },
  'nav.red-one':                  { zh: 'RED ONE',             en: 'RED ONE' },
  'nav.logo-hardware-ai':         { zh: 'Hardware.ai',         en: 'Hardware.ai' },
  'nav.logo-red-one':             { zh: 'RED ONE',             en: 'RED ONE' },

  // ── RED ONE nav ────────────────────────────
  'nav.ryzen':                    { zh: '锐龙',                en: 'Ryzen' },
  'nav.gpu':                      { zh: '显卡',                en: 'GPU' },
  'nav.components':               { zh: '组件',                en: 'Components' },
  'nav.specs':                    { zh: '规格',                en: 'Specs' },
  'nav.stack':                    { zh: '软件矩阵',           en: 'SW Stack' },
  'nav.hardware-ai':              { zh: 'Hardware.ai',         en: 'Hardware.ai' },

  // ── Pipeline nav ───────────────────────────
  'nav.hardware':                 { zh: '硬件',                en: 'Hardware' },
  'nav.software-arch':            { zh: '软件架构',           en: 'Software' },
  'nav.topology':                 { zh: '节点拓扑',           en: 'Topology' },
  'nav.full-list':                { zh: '完整清单',           en: 'Full List' },

  // ── Lifecycle nav ──────────────────────────
  'nav.inference-lifecycle':      { zh: '推理生命周期',       en: 'Lifecycle' },
  'nav.time-breakdown':           { zh: '时间占比',           en: 'Breakdown' },

  // ── index.html ─────────────────────────────
  'index.hero-title':             { zh: 'AI 生产力 GPU 跑分榜', en: 'AI GPU Benchmark' },
  'index.hero-desc':              { zh: '覆盖消费级至数据中心级 GPU · 实测文生图 / 文生视频 / LLM 推理性能表现', en: 'Consumer to datacenter GPUs ·实测 text-to-image, text-to-video & LLM inference' },
  'index.filter-task':            { zh: '任务',                en: 'Task' },
  'index.filter-all':             { zh: '全部',                en: 'All' },
  'index.filter-t2i':             { zh: '文生图',             en: 'Img' },
  'index.filter-t2v':             { zh: '文生视频',           en: 'Video' },
  'index.filter-llm':             { zh: 'LLM 推理',           en: 'LLM' },
  'index.filter-vram':            { zh: '显存',                en: 'VRAM' },
  'index.filter-8':               { zh: '8GB+',                en: '8GB+' },
  'index.filter-16':              { zh: '16GB+',               en: '16GB+' },
  'index.filter-24':              { zh: '24GB+',               en: '24GB+' },
  'index.filter-budget':          { zh: '预算',                en: 'Budget' },
  'index.budget-all':             { zh: '不限',                en: 'Any' },
  'index.budget-800':             { zh: '≤$800',               en: '≤$800' },
  'index.budget-1500':            { zh: '≤$1500',              en: '≤$1500' },
  'index.view-table':             { zh: '性能指标总览',       en: 'Overview Table' },
  'index.view-chart':             { zh: '象限分析图',         en: 'Scatter Chart' },
  'index.table-rank':             { zh: '级',                  en: 'Tier' },
  'index.table-model':            { zh: '硬件型号',           en: 'Model' },
  'index.table-t2i':              { zh: '文生图 (it/s)',      en: 'Img (it/s)' },
  'index.table-t2v':              { zh: '文生视频',           en: 'Video' },
  'index.table-llm':              { zh: 'LLM 推理 (tok/s)',   en: 'LLM (tok/s)' },
  'index.table-price':            { zh: '参考价 (CAD)',       en: 'Price (CAD)' },
  'index.table-value':            { zh: '性价比',             en: 'Value' },
  'index.data-error-title':       { zh: '数据文件未能加载',   en: 'Data file failed to load' },
  'index.data-error-desc':        { zh: '请确保 data/gpu-dataset.js 文件存在，然后刷新页面重试。', en: 'Make sure data/gpu-dataset.js exists, then refresh.' },
  'index.champ-t2i':              { zh: '文生图冠军',         en: 'Img Champion' },
  'index.champ-t2v':              { zh: '文生视频冠军',       en: 'Video Champion' },
  'index.champ-llm':              { zh: 'LLM 推理冠军',       en: 'LLM Champion' },
  'index.champ-value':            { zh: '性价比之王',         en: 'Best Value' },
  'index.empty-filter':           { zh: '没有符合筛选条件的显卡', en: 'No GPUs match filters' },
  'index.oom':                    { zh: '显存不足',           en: 'OOM' },
  'index.recommend-tag':          { zh: '推荐',                en: 'Pick' },
  'index.footer-title':           { zh: '测算规格与基准说明：', en: 'Benchmark Notes:' },
  'index.footer-date':            { zh: '测试日期：2026年5月 | 宿主机环境：Ubuntu 24.04, CUDA 12.8, PyTorch 2.6', en: 'Date: 2026-05 | Host: Ubuntu 24.04, CUDA 12.8, PyTorch 2.6' },
  'index.footer-t2i':             { zh: '文生图',             en: 'Text-to-Image' },
  'index.footer-t2i-desc':        { zh: '基于 Flux.1-Dev (FP8 精度) 测算每秒迭代次数 (it/s)', en: 'Flux.1-Dev (FP8) — iterations per second (it/s)' },
  'index.footer-t2v':             { zh: '文生视频',           en: 'Text-to-Video' },
  'index.footer-t2v-desc':        { zh: '基于 GenVideoX-5B 渲染一段 5秒 720p 视频的完整执行耗时 (越小越好)', en: 'GenVideoX-5B — time to render 5s 720p video (lower is better)' },
  'index.footer-llm':             { zh: 'LLM推理',            en: 'LLM Inference' },
  'index.footer-llm-desc':        { zh: '基于 Llama-4-70B-Q4_K_M 测算首字输出后的持续生成速度 (tok/s)。', en: 'Llama-4-70B-Q4_K_M — sustained generation speed (tok/s).' },
  'index.scatter-price':          { zh: '参考价格 (CAD) — 越左越划算', en: 'Price (CAD) — left = better value' },
  'index.scatter-speed':          { zh: 'LLM 推理速度 (tok/s) — 越上越强劲', en: 'LLM speed (tok/s) — top = faster' },
  'index.chart-dataset-label':    { zh: 'GPU (2026年5月)',    en: 'GPU (May 2026)' },
  'index.chart-price-king':       { zh: ' (二手价格之王)',    en: ' (Price King)' },

  // ── red_one.html ───────────────────────────
  'red.title':                    { zh: 'RED ONE — 本地 AI 神经工作站', en: 'RED ONE — Local AI Neural Workstation' },
  'red.meta-desc':                { zh: 'RED ONE — 从零构建的本地 AI 神经工作站，搭载 AMD Ryzen 5 9600X 与 Radeon AI PRO R9700 32GB。', en: 'RED ONE — a local AI neural workstation built from scratch with AMD Ryzen 5 9600X & Radeon AI PRO R9700 32GB.' },
  'red.hero-eyebrow':             { zh: 'AMD Advantage Platform Integration', en: 'AMD Advantage Platform Integration' },
  'red.hero-title':               { zh: 'RED ONE',             en: 'RED ONE' },
  'red.hero-sub':                 { zh: '一台从零构建的本地 AI 神经工作站。Ryzen 主导调度，Radeon 承担推理，一切运算留在桌面之内。', en: 'A locally-built AI neural workstation. Ryzen orchestrates, Radeon accelerates — all computation stays on your desk.' },
  'red.hero-operator':            { zh: 'SYSTEM OPERATOR',     en: 'SYSTEM OPERATOR' },
  'red.hero-arch':                { zh: 'ARCHITECTURE',        en: 'ARCHITECTURE' },
  'red.hero-status':              { zh: 'STATUS',              en: 'STATUS' },
  'red.hero-arch-val':            { zh: 'x86_64 · NEURAL WORKSTATION', en: 'x86_64 · NEURAL WORKSTATION' },
  'red.hero-status-val':          { zh: 'STABLE · CALIBRATED', en: 'STABLE · CALIBRATED' },
  'red.scroll':                   { zh: 'SCROLL',              en: 'SCROLL' },
  'red.ribbon-line':              { zh: '<b>32GB</b> GDDR6  <span class="dot">·</span> <b>65W</b> CPU TDP <span class="dot">·</span> <b>PCIe 5.0</b>  <span class="dot">·</span> <b>1000W</b> ATX 3.1  <span class="dot">·</span> <b>6C/12T</b> Zen 5  <span class="dot">·</span> <b>256-bit</b>  ', en: '<b>32GB</b> GDDR6 VRAM <span class="dot">·</span> <b>65W</b> CPU TDP <span class="dot">·</span> <b>PCIe 5.0</b> Full Link <span class="dot">·</span> <b>1000W</b> ATX 3.1 PSU <span class="dot">·</span> <b>6C/12T</b> Zen 5 Arch <span class="dot">·</span> <b>256-bit</b> Bus' },

  // CPU section
  'red.cpu-kicker':               { zh: '01 · AMD Ryzen™',    en: '01 · AMD Ryzen™' },
  'red.cpu-title':                { zh: '中央神经中枢',       en: 'Central Neural Hub' },
  'red.cpu-desc':                 { zh: 'Ryzen 5 9600X 负责调度整套本地管线——从 n8n 编排到模型加载，一切复杂工作流的起点都在这里。', en: 'The Ryzen 5 9600X orchestrates the entire local pipeline — from n8n workflows to model loading.' },
  'red.cpu-block1-tag':           { zh: 'Ryzen 5 9600X',      en: 'Ryzen 5 9600X' },
  'red.cpu-block1-title':         { zh: 'Zen 5 架构<br>6 核心 / 12 线程', en: 'Zen 5<br>6 Cores / 12 Threads' },
  'red.cpu-block1-desc':          { zh: '基础频率 3.9GHz，最高加速可达 5.4GHz。极强的单核调度能力，驾驭本地 AI 管线与自动化工作流毫不吃力。', en: 'Base 3.9GHz, boost up to 5.4GHz. Exceptional single-core performance for AI pipelines & automation.' },
  'red.cpu-block2-title':         { zh: '4nm 工艺<br>精密制造', en: '4nm Process<br>Precision Manufacturing' },
  'red.cpu-block2-desc':          { zh: '台积电 4nm 制程带来的能效比，是整机长时间满载运行的基础，也是选择它而非更高功耗型号的原因。', en: 'TSMC 4nm delivers the efficiency that makes sustained full-load operation viable.' },
  'red.cpu-block3-title':         { zh: '65W TDP<br>为长期运行而生', en: '65W TDP<br>Built for Long Runs' },
  'red.cpu-block3-desc':          { zh: '相较更高功耗型号，65W 的设计换来更低的热量堆积与更长的平台寿命，这是安静运行数月推理任务的关键前提。', en: 'Lower heat buildup & longer platform lifespan — key for quiet months-long inference.' },
  'red.cpu-spec-arch':            { zh: '架构 / 制程',        en: 'Arch / Process' },
  'red.cpu-spec-cores':           { zh: '核心 / 线程',        en: 'Cores / Threads' },
  'red.cpu-spec-freq':            { zh: '基础 / 加速频率',    en: 'Base / Boost' },
  'red.cpu-spec-cache':           { zh: '缓存',                en: 'Cache' },
  'red.cpu-spec-igpu':            { zh: '核显',                en: 'iGPU' },
  'red.cpu-spec-socket':          { zh: '插槽 / TDP',         en: 'Socket / TDP' },

  // GPU section
  'red.gpu-kicker':               { zh: '02 · AMD Radeon™ AI PRO', en: '02 · AMD Radeon™ AI PRO' },
  'red.gpu-title':                { zh: '神经加速核心',       en: 'Neural Acceleration Core' },
  'red.gpu-desc':                 { zh: 'ASRock Creator Radeon AI PRO R9700 承担全部本地推理与生成任务，模型不必再为显存精简自己。', en: 'The ASRock Creator Radeon AI PRO R9700 handles all local inference & generation.' },
  'red.gpu-block1-tag':           { zh: 'Radeon AI PRO R9700', en: 'Radeon AI PRO R9700' },
  'red.gpu-block1-title':         { zh: '32GB GDDR6<br>256-bit 位宽', en: '32GB GDDR6<br>256-bit Bus' },
  'red.gpu-block1-desc':          { zh: '充裕的显存容量意味着 Qwen3-27B 这类模型可以整块加载，不必在推理途中反复换页。', en: 'Ample VRAM means models like Qwen3-27B load entirely without swapping during inference.' },
  'red.gpu-block2-title':         { zh: 'RDNA 4 架构<br>64 组计算单元', en: 'RDNA 4<br>64 Compute Units' },
  'red.gpu-block2-desc':          { zh: '面对扩散模型渲染或大参数语言模型推理，皆可全量运算，不必担心显存溢出而中断。', en: 'Handles diffusion rendering & large LLM inference at full capacity without OOM.' },
  'red.gpu-block3-title':         { zh: 'PCIe 5.0 x16<br>全速直连', en: 'PCIe 5.0 x16<br>Full-Speed Link' },
  'red.gpu-block3-desc':          { zh: '主板到显卡的全链路 5.0 带宽，配合 Blower 单向导流散热，专为持续满载的生成任务设计。', en: 'Full Gen5 bandwidth from board to GPU with blower cooling for sustained generation loads.' },
  'red.gpu-spec-arch':            { zh: '架构',                en: 'Architecture' },
  'red.gpu-spec-cu':              { zh: '计算单元',           en: 'Compute Units' },
  'red.gpu-spec-vram':            { zh: '显存',                en: 'VRAM' },
  'red.gpu-spec-clocks':          { zh: '加速 / 游戏频率',    en: 'Boost / Game Clock' },
  'red.gpu-spec-bus':             { zh: '总线',                en: 'Bus' },
  'red.gpu-spec-thermal':         { zh: '散热 / 输出',        en: 'Cooling / Output' },

  // Components section
  'red.comp-kicker':              { zh: '03 · Full Platform Build', en: '03 · Full Platform Build' },
  'red.comp-title':               { zh: '支撑起整机的<br>每一个部件', en: 'Every Component<br>That Powers It' },
  'red.comp-desc':                { zh: '从主板到散热，每一件都为长时间本地推理而选。', en: 'From motherboard to cooling — every part chosen for long-duration local inference.' },
  'red.comp-mobo-role':           { zh: 'Motherboard',         en: 'Motherboard' },
  'red.comp-memo-role':           { zh: 'Memory',              en: 'Memory' },
  'red.comp-storage-role':        { zh: 'Storage',             en: 'Storage' },
  'red.comp-case-role':           { zh: 'Case',                en: 'Case' },
  'red.comp-psu-role':            { zh: 'Power Supply',        en: 'Power Supply' },
  'red.comp-cooler-role':         { zh: 'CPU Cooler',          en: 'CPU Cooler' },
  'red.comp-memo-name':           { zh: '七彩虹 32GB DDR5 6000MHz', en: 'Colorful 32GB DDR5 6000MHz' },
  'red.comp-memo-sub':            { zh: 'Micron 镁光颗粒 · 单条', en: 'Micron Die · Single Stick' },
  'red.comp-memo-desc':           { zh: '镁光原厂颗粒保障稳定性，为本地大模型加载与多任务缓存预留充裕带宽。', en: 'Original Micron dies ensure stability for local model loading & multitasking cache.' },
  'red.comp-storage-name':        { zh: '雷克沙 Lexar THOR PRO 2TB', en: 'Lexar THOR PRO 2TB' },
  'red.comp-storage-sub':         { zh: 'M.2 NVMe · 系统主盘 · 最快速', en: 'M.2 NVMe · System Drive · Fastest' },
  'red.comp-storage-desc':        { zh: '四盘齐驱：雷克沙 2TB 主盘装载系统和模型权重，镁光 512GB / 雷克沙 512GB 做数据分盘，金维胜 128GB 作缓存。', en: 'Quad drives: Lexar 2TB for system & models, Micron 512GB / Lexar 512GB for data, Kimtigo 128GB for cache.' },
  'red.comp-mobo-chipset':        { zh: '芯片组',              en: 'Chipset' },
  'red.comp-mobo-ram':            { zh: '内存支持',           en: 'Memory Support' },
  'red.comp-mobo-slot':           { zh: '显卡插槽',           en: 'GPU Slot' },
  'red.comp-mobo-net':            { zh: '网络',                en: 'Networking' },
  'red.comp-mobo-slots':          { zh: 'M.2 插槽一览',       en: 'M.2 Slots Overview' },
  'red.comp-mobo-desc':           { zh: '承载 Ryzen 9000 系全速运行的主控中枢，PCIe 5.0 全链路直连显卡与硬盘。', en: 'The central hub for Ryzen 9000 series, with PCIe 5.0 full-link to GPU and storage.' },
  'red.comp-mobo-ram-val':        { zh: 'DDR5 双通道',        en: 'DDR5 Dual Channel' },
  'red.comp-chipset':             { zh: '芯片组',             en: 'Chipset' },
  'red.comp-memo-capacity':       { zh: '32GB（单条）',       en: '32GB (Single Stick)' },
  'red.comp-case-type-val':       { zh: '中塔 ATX',           en: 'Mid Tower ATX' },
  'red.comp-side-panel-val':      { zh: '钢化玻璃',           en: 'Tempered Glass' },
  'red.comp-memo-particles':      { zh: 'Micron 镁光',        en: 'Micron' },
  'red.comp-case-type':           { zh: '机箱类型',           en: 'Case Type' },
  'red.comp-side-panel':          { zh: '侧板',                en: 'Side Panel' },
  'red.comp-case-desc':           { zh: '高透风前面板设计，为满载运转的显卡与散热塔提供持续新鲜气流。', en: 'High-airflow front panel provides fresh air for sustained full-load GPU & cooler operation.' },
  'red.comp-psu-desc':            { zh: '充裕的功率余量覆盖 CPU 满载与 32GB 显存显卡的瞬时峰值功耗需求。', en: 'Ample headroom covers CPU full-load & 32GB GPU instantaneous peak draw.' },
  'red.comp-cooler-desc':         { zh: '5 热管双塔风冷架构，S-FDB 轴承静音 PWM 风扇，持续压制长时间推理负载下的核心温度。', en: '5-heatpipe dual-tower with S-FDB PWM fan, keeps core temps low during extended inference.' },
  'red.comp-capacity':            { zh: '容量',                en: 'Capacity' },
  'red.comp-specs':               { zh: '规格',                en: 'Spec' },
  'red.comp-parts':               { zh: '颗粒',                en: 'Die' },
  'red.comp-num-heatpipes':       { zh: '热管数量',           en: 'Heatpipes' },
  'red.comp-bearing':             { zh: '轴承',                en: 'Bearing' },
  'red.comp-platform':            { zh: '兼容平台',           en: 'Compatibility' },
  'red.comp-rated-power':         { zh: '额定功率',           en: 'Rated Power' },
  'red.comp-standard':            { zh: '标准',                en: 'Standard' },

  // Specs section
  'red.specs-kicker':             { zh: '04 · Full Bill of Materials', en: '04 · Full Bill of Materials' },
  'red.specs-title':              { zh: '完整硬件清单',       en: 'Full Hardware List' },
  'red.specs-desc':               { zh: '一张表看完整台机器。', en: 'The complete machine in one table.' },
  'red.specs-cpu':                { zh: 'CPU',                 en: 'CPU' },
  'red.specs-gpu':                { zh: 'GPU',                 en: 'GPU' },
  'red.specs-mobo':               { zh: '主板',                en: 'Motherboard' },
  'red.specs-ram':                { zh: '内存',                en: 'Memory' },
  'red.specs-storage':            { zh: '硬盘',                en: 'Storage' },
  'red.specs-case':               { zh: '机箱',                en: 'Case' },
  'red.specs-psu':                { zh: '电源',                en: 'PSU' },
  'red.specs-cooler':             { zh: '散热器',             en: 'Cooler' },
  'red.spec-detail-cpu':          { zh: '6C/12T · 基础 3.9GHz / 加速 5.4GHz · Socket AM5', en: '6C/12T · 3.9GHz Base / 5.4GHz Boost · Socket AM5' },
  'red.spec-detail-gpu':          { zh: '32GB GDDR6 · 256-bit · PCIe 5.0 x16', en: '32GB GDDR6 · 256-bit · PCIe 5.0 x16' },
  'red.spec-detail-mobo':         { zh: 'AMD X870 芯片组 · DDR5 · WiFi 内置', en: 'AMD X870 Chipset · DDR5 · WiFi Built-in' },
  'red.spec-detail-ram':          { zh: '32GB · DDR5-6000 · 镁光原厂颗粒', en: '32GB · DDR5-6000 · Micron Original Die' },
  'red.spec-detail-storage':      { zh: 'M.2 NVMe · PCIe 4.0 x4 · 2TB', en: 'M.2 NVMe · PCIe 4.0 x4 · 2TB' },
  'red.spec-detail-storage-sub':  { zh: '官翻 95新',           en: 'Refurb 95% New' },
  'red.spec-detail-case':         { zh: '中塔 ATX · 高气流前面板', en: 'Mid Tower ATX · High Airflow Front' },
  'red.spec-detail-case-sub':     { zh: '美商海盗船',         en: 'Corsair' },
  'red.spec-detail-psu':          { zh: '1000W · ATX 3.1 标准', en: '1000W · ATX 3.1 Standard' },
  'red.spec-detail-cooler':       { zh: '双塔风冷 · TL-C12C-S PWM 风扇 · S-FDB 轴承 · AM4/AM5', en: 'Dual-Tower Air · TL-C12C-S PWM · S-FDB Bearing · AM4/AM5' },

  // Stack section
  'red.stack-kicker':             { zh: '05 · Local Stack Activation', en: '05 · Local Stack Activation' },
  'red.stack-title':              { zh: '本地 AI 神经矩阵',  en: 'Local AI Neural Matrix' },
  'red.stack-desc':               { zh: '从文字到图像，从图像到成片，全部运算留在这台机器里。', en: 'From text to image, image to video — all compute stays on this machine.' },
  'red.stack-step1':              { zh: '本地大模型',         en: 'Local LLM' },
  'red.stack-step1-desc':         { zh: 'DeepSeek / Qwen 全离线沙箱环境，独立孤岛式推理核心。', en: 'DeepSeek / Qwen fully offline sandbox, isolated inference core.' },
  'red.stack-step2':              { zh: '文本至图像',        en: 'Text to Image' },
  'red.stack-step2-desc':         { zh: 'FLUX.1-schnell，本地秒级生图。', en: 'FLUX.1-schnell, local sub-second image generation.' },
  'red.stack-step3':              { zh: '时序视频生成',       en: 'Video Generation' },
  'red.stack-step3-desc':         { zh: 'Neural Video Gen，自动化序列输出。', en: 'Neural Video Gen, automated sequence output.' },
  'red.footer-line1':             { zh: '© 2026 RED ONE AMD INTEGRATION NODE. ALL RIGHTS RESERVED.', en: '© 2026 RED ONE AMD INTEGRATION NODE. ALL RIGHTS RESERVED.' },
  'red.footer-line2':             { zh: 'LEAD WITH RYZEN. ACCELERATE WITH RADEON. Powered by X870 Chipset.', en: 'LEAD WITH RYZEN. ACCELERATE WITH RADEON. Powered by X870 Chipset.' },

  // ── pipeline.html ──────────────────────────
  'pipe.title':                   { zh: 'PIPELINE ZERO — 软件架构与工作流', en: 'PIPELINE ZERO — Architecture & Workflow' },
  'pipe.hero-eyebrow':            { zh: 'LOCAL-FIRST · DISTRIBUTED AI ORCHESTRATION', en: 'LOCAL-FIRST · DISTRIBUTED AI ORCHESTRATION' },
  'pipe.hero-title':              { zh: 'PIPELINE&nbsp;ZERO', en: 'PIPELINE&nbsp;ZERO' },
  'pipe.hero-sub':                { zh: 'RED ONE 硬件之上运行的自动化编排系统 —— 三台机器各司其职，把 NASA 数据流转化为可发布的天文内容。', en: 'The automation orchestration system running on RED ONE hardware — three machines turning NASA data into publishable astronomy content.' },
  'pipe.hero-nodes':              { zh: '节点',                en: 'Nodes' },
  'pipe.hero-orch':               { zh: '编排',                en: 'Orchestration' },
  'pipe.hero-virt':               { zh: '虚拟化',             en: 'Virtualization' },
  'pipe.hero-llm':                { zh: '双 LLM',              en: 'Dual LLM' },
  'pipe.hero-accel':              { zh: '加速',                en: 'Acceleration' },
  'pipe.section-topo-kicker':     { zh: '· 三节点拓扑 ·',     en: '· Three-Node Topology ·' },
  'pipe.section-topo-title':      { zh: '算力分层，各司其职', en: 'Compute Layered by Role' },
  'pipe.section-topo-desc':       { zh: '不追求单机堆料，而是按任务的隐私等级与算力需求，把工作分派到最合适的节点。', en: 'Rather than stacking everything into one machine, tasks are dispatched by privacy & compute requirements.' },
  'pipe.node1-tag':               { zh: '节点 01 · 常驻编排层', en: 'Node 01 · Resident Orchestration' },
  'pipe.node1-title':             { zh: 'Geekom G3 —— Proxmox VE 调度中枢', en: 'Geekom G3 — Proxmox VE Scheduler' },
  'pipe.node1-desc':              { zh: '低功耗、7×24 常驻的家庭实验室节点。运行 Debian 13 LXC 容器化服务，n8n 工作流从 NASA RSS 源抓取文章、聚合去重，再转交 DeepSeek API 处理，最终把结构化 Markdown 写入 Samba 共享的 Obsidian 知识库。', en: 'Low-power 24/7 homelab node running Debian 13 LXC containers. n8n fetches NASA RSS, deduplicates, passes to DeepSeek API, writes Markdown to Samba-shared Obsidian.' },
  'pipe.node2-tag':               { zh: '节点 02 · 隐私推理层', en: 'Node 02 · Private Inference' },
  'pipe.node2-title':             { zh: 'Mac Mini M4 —— 本地私有推理', en: 'Mac Mini M4 — Local Private Inference' },
  'pipe.node2-desc':              { zh: '涉及隐私或本地专属内容的任务不出本地网络，交给这台 24GB 统一内存的 Mac Mini，通过 MLX 运行 Qwen 系列模型完成推理。同时承担视频剪辑，通过 USB4 与 AI 工作站直连。', en: 'Privacy-sensitive tasks stay local on this 24GB Mac Mini, running Qwen via MLX. Also handles video editing over USB4.' },
  'pipe.node3-tag':               { zh: '节点 03 · 生成核心', en: 'Node 03 · Generation Core' },
  'pipe.node3-title':             { zh: 'RED ONE —— 重算力按需唤醒', en: 'RED ONE — Heavy Compute On Demand' },
  'pipe.node3-desc':              { zh: '不常驻运行，只在需要重算力时被唤醒。承担 FLUX 图像生成、文本转语音与视频合成，由 Radeon AI PRO R9700 经 ROCm 驱动完成本地推理，完事后自动回到休眠。', en: 'Not always-on. Woken only for heavy compute — FLUX image gen, TTS, video synthesis via ROCm on Radeon AI PRO R9700, then back to sleep.' },
  'pipe.section-pipe-kicker':     { zh: '· 内容管线 ·',      en: '· Content Pipeline ·' },
  'pipe.section-pipe-title':      { zh: '从太空数据到可发布素材', en: 'From Space Data to Published Content' },
  'pipe.section-pipe-desc':       { zh: '调度层内跑的核心 n8n 工作流 —— 每一步都是一个独立、可单独调试的节点。', en: 'The core n8n workflow running in the orchestration layer — every step is an independent, debuggable node.' },
  'pipe.pipe-step1':              { zh: 'NASA RSS',            en: 'NASA RSS' },
  'pipe.pipe-step1-desc':         { zh: '抓取最新航天与天文资讯条目', en: 'Fetch latest space & astronomy articles' },
  'pipe.pipe-step2':              { zh: '聚合去重',           en: 'Aggregate & Dedupe' },
  'pipe.pipe-step2-desc':         { zh: '合并多源文章，按时间排序', en: 'Merge sources, sort by time' },
  'pipe.pipe-step3':              { zh: 'DeepSeek API',        en: 'DeepSeek API' },
  'pipe.pipe-step3-desc':         { zh: '摘要、翻译与结构化改写', en: 'Summarize, translate, restructure' },
  'pipe.pipe-step4':              { zh: 'Markdown 落盘',      en: 'Markdown to Disk' },
  'pipe.pipe-step4-desc':         { zh: '按日期生成结构化笔记文件', en: 'Generate dated structured notes' },
  'pipe.pipe-step5':              { zh: 'Obsidian 知识库',     en: 'Obsidian Vault' },
  'pipe.pipe-step5-desc':         { zh: '经 Samba 挂载，供后续脚本调用', en: 'Mounted via Samba for downstream scripts' },
  'pipe.pipe-status':             { zh: '当前联调中 · DeepSeek 节点数据接收有待修复', en: 'Integration in progress · DeepSeek node data receipt needs fix' },
  'pipe.comp-section-kicker':     { zh: '· 组件清单 ·',       en: '· Component Inventory ·' },
  'pipe.comp-section-title':      { zh: '支撑管线的每一层',   en: 'Every Layer of the Pipeline' },
  'pipe.comp-section-desc':       { zh: '没有实体照片可拍的部分 —— 但一样是这套系统真正的骨架。', en: 'No physical photos — but equally the backbone of this system.' },
  'pipe.stack-kicker':            { zh: '· 完整软件栈清单 ·', en: '· Full Software Stack ·' },
  'pipe.stack-title':             { zh: '每一层，各归其位',   en: 'Every Layer in Its Place' },
  'pipe.directive-k':             { zh: '架构理念',           en: 'Architecture Philosophy' },
  'pipe.directive-v':             { zh: '常驻服务留在低功耗节点，AI PC 只在真正需要重算力时被唤醒。', en: 'Always-on services stay on low-power nodes; the AI PC wakes only when heavy compute is needed.' },
  'pipe.footer-line1':            { zh: '驱动 CosmicSpaceDiary（宇宙空间日志）自动化内容创作', en: 'Driving CosmicSpaceDiary automated content creation' },

  // ── lifecycle.html ─────────────────────────
  'life.title':                   { zh: 'INFERENCE LIFECYCLE — 一次对话的处理生命周期', en: 'INFERENCE LIFECYCLE — One Conversation\'s Processing Lifecycle' },
  'life.hero-eyebrow':            { zh: 'ONE CONVERSATION TURN, DECOMPOSED', en: 'ONE CONVERSATION TURN, DECOMPOSED' },
  'life.hero-ttft':               { zh: '首字延迟',           en: 'Time To First Token' },
  'life.hero-tpot':               { zh: '逐字延迟',           en: 'Time Per Output Token' },
  'life.hero-stages':             { zh: '个可测阶段',         en: 'Measurable Stages' },
  'life.hero-data':               { zh: '实测数据',           en: 'Bench Data' },
  'life.hero-title':              { zh: 'INFERENCE&nbsp;<br/>LIFECYCLE', en: 'INFERENCE&nbsp;<br/>LIFECYCLE' },
  'life.hero-sub':                { zh: '从按下发送到屏幕上出现最后一个字 —— 一次人机对话背后，请求依次流过的每一个阶段，以及时间究竟花在了哪里。', en: 'From hitting send to the last character — every stage a request flows through, and where the time actually goes.' },
  'life.section-timeline-kicker': { zh: '· 处理管线 ·',       en: '· Processing Pipeline ·' },
  'life.section-timeline-title':  { zh: '一次请求，六个阶段', en: 'One Request, Six Stages' },
  'life.section-timeline-desc':   { zh: '用户按下发送后，请求依次流过以下节点，每一步都可以单独测量耗时。', en: 'After the user hits send, the request flows through these stages — each independently measurable.' },
  'life.step1':                   { zh: '用户输入',           en: 'User Input' },
  'life.step1-desc':              { zh: '文本经网络传输到推理服务', en: 'Text travels to inference service' },
  'life.step2':                   { zh: 'Tokenization',       en: 'Tokenization' },
  'life.step2-desc':              { zh: '文本切分为模型可处理的 token 序列', en: 'Text split into token sequence' },
  'life.step3':                   { zh: 'Prefill',             en: 'Prefill' },
  'life.step3-desc':              { zh: '并行处理全部输入 token，写入 KV Cache', en: 'Process all input tokens in parallel, write KV Cache' },
  'life.step4':                   { zh: 'Decode',              en: 'Decode' },
  'life.step4-desc':              { zh: '逐个生成输出 token，依赖上一步结果', en: 'Generate output tokens one by one' },
  'life.step5':                   { zh: 'Detokenization',     en: 'Detokenization' },
  'life.step5-desc':              { zh: 'token 还原为可读文本', en: 'Tokens back to readable text' },
  'life.step6':                   { zh: '流式返回',           en: 'Streaming' },
  'life.step6-desc':              { zh: '逐块推送到客户端，边生成边显示', en: 'Pushed to client chunk by chunk' },
  'life.section-breakdown-kicker': { zh: '· 时间占比 ·',      en: '· Time Breakdown ·' },
  'life.section-breakdown-title': { zh: '同样是一次对话，时间花在哪不一样', en: 'Same conversation, different time distribution' },
  'life.section-breakdown-desc':  { zh: 'Prompt 越长，Prefill 占比越高；输出越长，Decode 占比越高 —— 同一张显卡，在不同场景下"快"的定义完全不同。', en: 'Longer prompts → more Prefill. Longer outputs → more Decode. "Fast" means different things in different scenarios.' },
  'life.scenario1-title':         { zh: '短问答 · 长回复',   en: 'Short Query · Long Reply' },
  'life.scenario2-title':         { zh: '长文档 · 短摘要（RAG）', en: 'Long Doc · Short Summary (RAG)' },
  'life.section-detail-kicker':   { zh: '· 阶段详解 ·',       en: '· Stage Details ·' },
  'life.section-detail-title':    { zh: '每个阶段，决定速度的因素不同', en: 'Each stage, a different bottleneck' },
  'life.section-detail-desc':     { zh: 'Prefill 是并行计算密集型，Decode 是显存带宽密集型 —— 这也是同一张 GPU 在两项跑分上表现不同的根本原因。', en: 'Prefill is compute-bound; Decode is memory-bandwidth-bound.' },
  'life.section-metrics-kicker':  { zh: '· 关键指标 ·',       en: '· Key Metrics ·' },
  'life.section-metrics-title':   { zh: '评测报告里这些词到底在测什么', en: 'What these benchmark terms actually measure' },
  'life.directive-k':             { zh: '核心结论',           en: 'Key Takeaway' },
  'life.directive-v':             { zh: 'Prefill 决定长文档 / RAG 场景的响应速度，Decode 决定长对话 / 长输出场景的流畅度 —— 选硬件前，先看清自己的场景更接近哪一种。', en: 'Prefill defines long-doc/RAG response speed; Decode defines long-conversation fluency. Know your scenario before choosing hardware.' },
  'life.footer-line1':            { zh: '拆解 一次人机对话 背后的推理生命周期', en: 'Deconstructing the inference lifecycle of one human-AI conversation' },

  // ── vram-calc.html ─────────────────────────
  'vram.page-title':              { zh: 'LLM 显存计算器 - VRAM Calculator', en: 'LLM VRAM Calculator' },
  'vram.hero-title':              { zh: 'LLM 显存计算器',     en: 'LLM VRAM Calculator' },
  'vram.hero-desc':               { zh: '根据模型参数量、精度与使用场景，估算运行 LLM 所需的 GPU 显存', en: 'Estimate GPU VRAM needed for LLM inference/training by parameters, precision & use case' },
  'vram.input-title':             { zh: '参数设置',           en: 'Settings' },
  'vram.preset':                  { zh: '模型预设',           en: 'Model Preset' },
  'vram.params':                  { zh: '模型参数量',         en: 'Parameters' },
  'vram.active-params':           { zh: '活跃参数量',         en: 'Active Params' },
  'vram.precision':               { zh: '权重精度',           en: 'Precision' },
  'vram.scenario':                { zh: '使用场景',           en: 'Use Case' },
  'vram.inference':               { zh: '推理',                en: 'Inference' },
  'vram.full-train':              { zh: '完整训练',           en: 'Full Training' },
  'vram.lora':                    { zh: 'LoRA 微调',           en: 'LoRA Fine-Tune' },
  'vram.context':                 { zh: '上下文长度',         en: 'Context Length' },
  'vram.batch':                   { zh: 'Batch Size',          en: 'Batch Size' },
  'vram.advanced':                { zh: '高级设置',           en: 'Advanced Settings' },
  'vram.layers':                  { zh: '层数',                en: 'Layers' },
  'vram.hidden-dim':              { zh: '隐藏维度',           en: 'Hidden Dim' },
  'vram.activation-checkpoint':   { zh: '启用激活检查点 (Activation Checkpointing)', en: 'Enable Activation Checkpointing' },
  'vram.activation-hint':         { zh: '大幅减少训练时的激活值显存，但会略微降低训练速度', en: 'Greatly reduces activation VRAM during training, slightly slower' },
  'vram.result-title':            { zh: '计算结果',           en: 'Results' },
  'vram.total-vram':              { zh: '所需 GPU 显存',      en: 'Required GPU VRAM' },
  'vram.breakdown':               { zh: '显存构成',           en: 'Breakdown' },
  'vram.empty-result':            { zh: '调整参数后自动计算', en: 'Adjust parameters to calculate' },
  'vram.compatible-gpus':         { zh: '兼容显卡',           en: 'Compatible GPUs' },
  'vram.waiting':                 { zh: '等待输入参数…',     en: 'Waiting for input…' },
  'vram.details':                 { zh: '计算明细',           en: 'Calculation Details' },
  'vram.details-hint':            { zh: '在左侧输入参数后将显示详细计算过程', en: 'Enter parameters on the left to see detailed calculation' },
  'vram.model-preset-loading':    { zh: '加载中...',          en: 'Loading...' },
  'vram.data-error':              { zh: 'GPU 数据未能加载',   en: 'GPU data failed to load' },
  'vram.data-error-desc':         { zh: '请确保 data/gpu-dataset.js 文件存在，然后刷新页面重试。', en: 'Ensure data/gpu-dataset.js exists, then refresh.' },
  'vram.preset-custom':           { zh: '自定义',              en: 'Custom' },
  'vram.vendor.nvidia':           { zh: 'NVIDIA',              en: 'NVIDIA' },
  'vram.vendor.amd':              { zh: 'AMD',                 en: 'AMD' },
  'vram.vendor.apple':            { zh: 'Apple',               en: 'Apple' },
  'vram.status-compatible':       { zh: '✓ 可运行',          en: '✓ Compatible' },
  'vram.status-partial':          { zh: '△ 勉强可用',        en: '△ Marginal' },
  'vram.status-incompatible':     { zh: '✗ 显存不足',        en: '✗ Insufficient VRAM' },

  // VRAM calc breakdown & detail table labels (generated dynamically)
  'vram.bw.weights':              { zh: '模型权重',            en: 'Model Weights' },
  'vram.bw.kvcache':              { zh: 'KV Cache',            en: 'KV Cache' },
  'vram.bw.optimizer':            { zh: '优化器状态',          en: 'Optimizer State' },
  'vram.bw.gradients':            { zh: '梯度',                en: 'Gradients' },
  'vram.bw.activations':          { zh: '激活值',              en: 'Activations' },
  'vram.bw.lora-weights':         { zh: 'LoRA 权重',           en: 'LoRA Weights' },
  'vram.bw.lora-opt':             { zh: 'LoRA 优化器',         en: 'LoRA Optimizer' },
  'vram.bw.overhead':             { zh: '框架开销',            en: 'Overhead' },
  'vram.detail-params':           { zh: '模型参数量',          en: 'Parameter Count' },
  'vram.detail-precision':        { zh: '权重精度',            en: 'Precision' },
  'vram.detail-weights':          { zh: '模型权重',            en: 'Model Weights' },
  'vram.detail-kvcache':          { zh: 'KV Cache',            en: 'KV Cache' },
  'vram.detail-use-case':         { zh: '使用场景',            en: 'Use Case' },
  'vram.detail-total':            { zh: '所需总显存',          en: 'Total VRAM Required' },
  'vram.detail-layers':           { zh: '网络层数',            en: 'Network Layers' },
  'vram.detail-hidden':           { zh: '隐藏维度',            en: 'Hidden Dim' },
  'vram.detail-optimizer':         { zh: '优化器状态 (Adam)',   en: 'Optimizer State (Adam)' },
  'vram.table-item':              { zh: '项目',                en: 'Item' },
  'vram.table-value':             { zh: '数值',                en: 'Value' },
  'vram.table-note':              { zh: '备注',                en: 'Note' },
  'vram.note-moe':                { zh: '(MoE, 活跃: %sB)',    en: '(MoE, Active: %sB)' },
  'vram.note-bytes-per-param':    { zh: '%s 字节/参数',        en: '%s bytes/param' },
  'vram.note-kv-train':           { zh: '训练时也需缓存中间 KV', en: 'Also caches intermediate KV during training' },
  'vram.note-kv-inference':       { zh: '推理时存储 Key/Value', en: 'Stores Key/Value during inference' },
  'vram.note-fp16':               { zh: 'FP16 精度',           en: 'FP16 precision' },
  'vram.note-adam':               { zh: 'FP32 主权重 + 动量 + 方差', en: 'FP32 master weights + momentum + variance' },
  'vram.note-ac-enabled':         { zh: '已启用激活检查点',    en: 'Activation checkpointing enabled' },
  'vram.note-ac-disabled':        { zh: '未启用激活检查点',    en: 'Activation checkpointing disabled' },
  'vram.note-lora':               { zh: '~0.2% 参数量, FP16',  en: '~0.2% params, FP16' },
  'vram.note-lora-opt':           { zh: 'Adam, FP32',          en: 'Adam, FP32' },
  'vram.note-lora-finetune':      { zh: 'LoRA 微调',           en: 'LoRA fine-tune' },
  'vram.note-cuda-pytorch':       { zh: 'CUDA 上下文 + PyTorch 框架', en: 'CUDA context + PyTorch framework' },
  'vram.mode.inference':          { zh: '推理',                en: 'Inference' },
  'vram.mode.train':              { zh: '完整训练',            en: 'Full Training' },
  'vram.mode.lora':               { zh: 'LoRA 微调',           en: 'LoRA Fine-Tune' },

  // ── mobo-calc.html ─────────────────────────
  'mobo.page-title':              { zh: '换板成本计算器',     en: 'Mobo Upgrade Calculator' },
  'mobo.subtitle':                { zh: '单卡板过渡 → 明年底换双卡板,实际净支出是多少', en: 'Single-GPU board → dual-GPU board next year. What\'s the net cost?' },
  'mobo.now-label':               { zh: '现在:已买入',        en: 'Now: Already Purchased' },
  'mobo.board-buy-label':         { zh: '主板购入价',         en: 'Board Purchase Price' },
  'mobo.board-buy-hint':          { zh: '二手翻新,税前',      en: 'Refurbished, pre-tax' },
  'mobo.case-buy-label':          { zh: '机箱购入价',         en: 'Case Purchase Price' },
  'mobo.case-buy-hint':           { zh: 'Corsair 4000D Airflow', en: 'Corsair 4000D Airflow' },
  'mobo.sell-label':              { zh: '明年底:卖出旧件',    en: 'End of next year: Sell Old' },
  'mobo.board-resale-label':      { zh: '主板残值率',         en: 'Board Resale Rate' },
  'mobo.board-resale-hint':       { zh: '二手板买家较谨慎',   en: 'Buyers cautious on used boards' },
  'mobo.case-resale-label':       { zh: '机箱残值率',         en: 'Case Resale Rate' },
  'mobo.case-resale-hint':        { zh: '机箱磨损顾虑较少',   en: 'Cases depreciate less' },
  'mobo.buy-label':               { zh: '明年底:买入双卡新件', en: 'End of next year: Buy Dual-GPU' },
  'mobo.new-board-label':         { zh: 'ProArt B850-Creator Neo', en: 'ProArt B850-Creator Neo' },
  'mobo.new-board-hint':          { zh: '预计一年后价格',     en: 'Estimated price in 1 year' },
  'mobo.new-case-label':          { zh: '是否需要新机箱',     en: 'New case needed?' },
  'mobo.new-case-hint':           { zh: '4000D Airflow空间已够用', en: '4000D Airflow has space' },
  'mobo.direct-label':            { zh: '对照:现在直接买双卡板', en: 'Benchmark: Buy Dual-GPU now' },
  'mobo.direct-price-label':      { zh: '现在的双卡板价格',   en: 'Current dual-GPU board price' },
  'mobo.direct-hint':             { zh: '已查得的当前价',     en: 'Current market price' },
  'mobo.result-board-resale':     { zh: '回收:主板残值',      en: 'Recovery: Board resale' },
  'mobo.result-case-resale':      { zh: '回收:机箱残值',      en: 'Recovery: Case resale' },
  'mobo.result-new-board':        { zh: '支出:新主板',        en: 'Cost: New board' },
  'mobo.result-new-case':         { zh: '支出:新机箱(如需要)', en: 'Cost: New case (if needed)' },
  'mobo.result-net':              { zh: '明年换板这一步的净支出', en: 'Net cost of the upgrade next year' },
  'mobo.path-a':                  { zh: '路线一:先单卡过渡再换双卡(总计)', en: 'Path A: Single → Dual (total cost)' },
  'mobo.path-b':                  { zh: '路线二:现在直接上双卡板', en: 'Path B: Go dual-GPU now' },
  'mobo.diff':                    { zh: '差额',                en: 'Difference' },
  'mobo.diff-more':               { zh: '路线一比路线二多花',  en: 'Path A costs more than B' },
  'mobo.diff-less':               { zh: '路线一比路线二反而省下', en: 'Path A saves over B' },
  'mobo.diff-same':               { zh: '两条路线花费相同',    en: 'Both paths cost the same' },
  'mobo.footnote':                { zh: '所有数字均可编辑 — 到时候用实际报价/成交价替换即可', en: 'All numbers are editable — replace with actual quotes later' },

  // ── bw-ladder.html ─────────────────────────
  'bw.page-title':                { zh: '带宽阶梯 — PCIe / DDR5 / 显存 / 存储速度全景', en: 'Bandwidth Ladder — PCIe / DDR5 / VRAM / Storage' },
  'bw.hero-eyebrow':              { zh: '数据通路带宽参照表', en: 'Data Path Bandwidth Reference' },
  'bw.hero-title':                { zh: '从 <span>PCIe 通道</span> 到 <span>显存</span>，<br>速度差着几个数量级', en: 'From <span>PCIe Lane</span> to <span>VRAM</span> —<br>speed spans orders of magnitude' },
  'bw.meta-desc':                 { zh: 'PCIe / DDR5 / 显存 / 存储设备带宽对照表，对数刻度展示数据通路速度差距。', en: 'PCIe / DDR5 / VRAM / Storage bandwidth comparison on a log scale.' },
  'bw.equiv-desc':                { zh: '— 都约 16 GB/s，每升一代、通道减半，带宽打平', en: '— all ~16 GB/s; each generation halves lanes to maintain bandwidth' },
  'bw.hero-stat-range':           { zh: 'GB/s 覆盖范围（约4300倍）', en: 'GB/s coverage (~4300× range)' },
  'bw.hero-stat-types':           { zh: '类通路：PCIe / DDR5 / 显存 / 存储', en: 'path types: PCIe / DDR5 / VRAM / Storage' },
  'bw.hero-stat-scale':           { zh: '刻度，否则显存会把其他都压成一条线', en: 'scale, or VRAM flattens everything into a line' },
  'bw.hero-intro':                { zh: '同样叫"快"，PCIe 4.0 x4、双通道 DDR5 和显卡显存之间可能差出 10 倍以上。下面用对数刻度把它们摆在同一把尺子上，再看看大模型推理时，数据从显存被挤到内存、再被挤到硬盘时，速度是怎么断崖式下跌的。', en: 'They\'re all called "fast", but PCIe 4.0 x4, dual-channel DDR5, and GPU VRAM differ by 10× or more. This page lines them up on a log scale, then shows how speed collapses when data is squeezed from VRAM to RAM to SSD during LLM inference.' },
  'bw.page-title':                { zh: '带宽阶梯 — PCIe / DDR5 / 显存 / 存储速度全景', en: 'Bandwidth Ladder — PCIe / DDR5 / VRAM / Storage' },
  'bw.section-chart-title':       { zh: '带宽阶梯',           en: 'Bandwidth Ladder' },
  'bw.section-chart-desc':        { zh: '条形长度按 log₁₀(带宽) 绘制 —— 这意味着每往右移动一段固定距离，速度是乘以 10，不是加 10。刻度线标出了 1 / 10 / 100 / 1000 GB/s 这几个"十倍"分界点。', en: 'Bar length is log₁₀(bandwidth) — each equal step right means 10× speed, not +10. Ticks mark 1 / 10 / 100 / 1000 GB/s decade boundaries.' },
  'bw.legend-pcie':               { zh: 'PCIe 插槽',           en: 'PCIe Slot' },
  'bw.legend-ddr5':               { zh: 'DDR5 系统内存',      en: 'DDR5 System Memory' },
  'bw.legend-vram':               { zh: '显卡显存 (VRAM)',    en: 'GPU VRAM' },
  'bw.legend-storage':            { zh: '存储设备',           en: 'Storage' },
  'bw.mode-caption':              { zh: '刻度模式',           en: 'Scale' },
  'bw.mode-log':                  { zh: 'LOG',                en: 'LOG' },
  'bw.mode-linear':               { zh: 'LINEAR',             en: 'LINEAR' },
  'bw.mode-log-small':            { zh: '对数',               en: 'Log' },
  'bw.mode-linear-small':         { zh: '线性',               en: 'Linear' },
  'bw.diagram-title':             { zh: '数据路径全景',       en: 'Data Path Overview' },
  'bw.diagram-tag':               { zh: '谁跟谁直连 · 谁必须过桥', en: 'Who connects to whom' },
  'bw.diagram-desc':              { zh: 'CPU、GPU 各自守着自己的"地盘"——CPU 直连系统内存，GPU 直连显存。SSD 没有独立总线，插在 PCIe 上。实际的数据搬运是 <b>链式 DMA</b>：CPU 只负责发指令（指挥），数据先由 SSD 直通内存，再由内存直通显存，全程不经过 CPU。', en: 'CPU and GPU each have their own domain — CPU connects directly to system memory, GPU to VRAM. SSDs have no dedicated bus; they plug into PCIe. Actual data movement is <b>chain DMA</b>: the CPU only issues commands, data flows SSD → RAM → VRAM without touching the CPU.' },
  // ── Bandwidth ladder: data path SVG diagram ─
  'bw.diagram-domain-storage':    { zh: '存储',                en: 'Storage' },
  'bw.diagram-ssd-sub':           { zh: '模型文件',            en: 'Model Files' },
  'bw.diagram-domain-cpu':        { zh: 'CPU 的地盘',          en: 'CPU Domain' },
  'bw.diagram-ddr5':              { zh: 'DDR5 内存',           en: 'DDR5 Memory' },
  'bw.diagram-ddr5-sub':          { zh: '系统内存',            en: 'System Memory' },
  'bw.diagram-bus-memory':        { zh: '内存总线 · 96 GB/s',  en: 'Memory Bus · 96 GB/s' },
  'bw.diagram-domain-gpu':        { zh: 'GPU 的地盘',          en: 'GPU Domain' },
  'bw.diagram-vram':              { zh: '显存 VRAM',           en: 'VRAM' },
  'bw.diagram-bus-vram':          { zh: '显存总线 · 640 GB/s', en: 'VRAM Bus · 640 GB/s' },
  'bw.diagram-bus-ssd-dma':       { zh: 'SSD → 内存 DMA · 约 8 GB/s', en: 'SSD → RAM DMA · ~8 GB/s' },
  'bw.diagram-bus-ram-dma':       { zh: '内存 → 显存 DMA · 63 GB/s',  en: 'RAM → VRAM DMA · 63 GB/s' },
  'bw.diagram-bus-pcie':          { zh: 'PCIe 桥接 · 链路',    en: 'PCIe Bridge · Link' },
  'bw.diagram-note-cpu':          { zh: 'CPU 是“指挥者”，不直接搬数据', en: 'CPU conducts — data moves itself' },
  'bw.chart-tag':                 { zh: '对数刻度 · 单位 GB/s', en: 'Log scale · Unit GB/s' },
  'bw.journey-title':             { zh: '大模型推理：数据放在哪，速度差多少', en: 'LLM Inference: Where data lives = how fast it runs' },
  'bw.journey-tag':               { zh: '示意 · 按带宽比例估算', en: 'Estimated by bandwidth ratio' },
  'bw.journey-desc':              { zh: '27B 级别模型全部塞进 32GB 显存时，推理只在 GPU 内部完成，几乎不受这张表左边那些"慢通路"影响。一旦显存不够、需要 offload，数据就得沿着更窄的通路来回搬运——这张图展示的是这条通路本身的带宽差距，也是推理速度断崖式下跌的根源。', en: 'When a 27B model fits entirely in 32GB VRAM, inference stays inside the GPU, untouched by the slower paths on the left. Once VRAM runs out and offloading kicks in, data must travel over narrower pathways — this chart shows the bandwidth gap that causes the cliff-like drop in speed.' },
  'bw.equiv-title':               { zh: '一个容易记住的等价关系', en: 'An easy equivalence to remember' },

  // ── bw-ladder chart dynamic text ────────────
  'bw.chart.pcie-label':          { zh: 'R9700 显卡插槽',     en: 'R9700 GPU Slot' },
  'bw.chart.ddr5-dual':           { zh: 'DDR5 内存（双通道）', en: 'DDR5 (Dual Channel)' },
  'bw.chart.ddr5-single':         { zh: 'DDR5 内存（单通道，对照）', en: 'DDR5 (Single Channel, Ref)' },
  'bw.chart.dual-channel':        { zh: '双通道',             en: 'Dual Channel' },
  'bw.chart.dual-target':         { zh: '双通道 · 你的目标', en: 'Dual Channel · Your Target' },
  'bw.chart.dual-tomahawk':       { zh: '双通道 · Tomahawk Max 上限', en: 'Dual Channel · Tomahawk Max Cap' },
  'bw.chart.single-current':      { zh: '你现在的配置',       en: 'Your Current Setup' },
  'bw.chart.seq-read':            { zh: '顺序读',             en: 'Seq Read' },
  'bw.chart.seq-read-lexar':      { zh: '顺序读，如 Lexar Thor Pro', en: 'Seq Read, e.g. Lexar Thor Pro' },
  'bw.chart.gddr7':               { zh: 'GDDR7',              en: 'GDDR7' },
  'bw.chart.gddr6-yours':         { zh: 'GDDR6 · 你的主卡',  en: 'GDDR6 · Your Main GPU' },
  'bw.chart.your-config':         { zh: '你的配置',           en: 'Your Config' },
  'bw.chart.storage-hdd':         { zh: '存储设备',           en: 'Storage' },
  'bw.chart.vram':                { zh: 'GPU 显存 (VRAM)',    en: 'GPU VRAM' },
  'bw.chart.mode-hint-log':       { zh: '// 每格代表 ×10 —— 小数值也看得清', en: '// Each step = ×10 — small values stay visible' },
  'bw.chart.mode-hint-linear':    { zh: '// 真实比例，1:1 —— 小数值会被显存"碾平"', en: '// True linear scale — small values get flattened by VRAM' },

  // ── bw journey section ─────────────────────
  'bw.journey-speed-label':       { zh: '相对速度',           en: 'Relative Speed' },
  'bw.journey-stage1-title':      { zh: '全部在 GPU 显存',   en: 'All in GPU VRAM' },
  'bw.journey-stage1-metric':     { zh: '基准 1×',            en: 'Baseline 1×' },
  'bw.journey-stage1-label':      { zh: '模型权重、KV Cache 全部常驻显存，GPU 算力全速吞吐', en: 'Model weights & KV Cache fit entirely in VRAM, GPU at full throughput' },
  'bw.journey-stage1-relative':   { zh: '27B 模型 Q4 量化下，token 生成速度取决于 GPU 算力本身，不受内存/存储带宽制约。', en: 'With a 27B model at Q4, token generation speed depends only on GPU compute, not memory/storage bandwidth.' },
  'bw.journey-stage2-title':      { zh: '部分 offload 到系统内存', en: 'Partial Offload to RAM' },
  'bw.journey-stage2-bw':         { zh: '双通道 DDR5-6000 · 96 GB/s', en: 'Dual Channel DDR5-6000 · 96 GB/s' },
  'bw.journey-stage2-metric':     { zh: '↓ 约 6-7×',          en: '↓ ~6-7×' },
  'bw.journey-stage2-label':      { zh: '部分层放不进显存，llama.cpp 等工具把这些层丢给 CPU+内存算', en: 'Some layers don\'t fit in VRAM; llama.cpp offloads them to CPU+RAM' },
  'bw.journey-stage2-relative':   { zh: '每算一个 token 都要在 GPU 和内存之间来回搬数据，速度大致跟着带宽比例掉：640÷96 ≈ 6.7 倍，实际感知往往更慢。', en: 'Every token shuttles between GPU and RAM — speed drops roughly with the bandwidth ratio: 640÷96 ≈ 6.7× slower, often feels even worse.' },
  'bw.journey-stage3-title':      { zh: '继续 offload 到 SSD', en: 'Offload to SSD' },
  'bw.journey-stage3-bw':         { zh: 'NVMe Gen4 顺序读 · 约 7 GB/s', en: 'NVMe Gen4 Seq Read · ~7 GB/s' },
  'bw.journey-stage3-metric':     { zh: '↓ 约 90×',          en: '↓ ~90×' },
  'bw.journey-stage3-label':      { zh: '显存和内存都不够，只能靠 mmap/swap 从硬盘读取权重', en: 'VRAM and RAM insufficient, must read weights via mmap/swap from disk' },
  'bw.journey-stage3-relative':   { zh: 'SSD 顺序读取带宽只有显存的 1/90 左右，而且模型权重的访问模式接近随机读，实际比顺序读还要再慢一截——这一档基本只适合"能跑就行"，不适合日常使用。', en: 'SSD sequential read is ~1/90 of VRAM bandwidth, and model weight access is closer to random reads — even slower. This tier is barely usable for day-to-day work.' },
  'bw.journey-caveat':            { zh: '<b>关于这组数字：</b>①②③ 三档的相对速度是按各自通路的理论带宽比例简化估算的，用来直观展示"差一个数量级"是什么概念，不是某个具体模型的实测跑分——真实场景里还有显存/内存/SSD之间的调度开销、随机读放大等因素，实际速度通常比纯带宽比例算出来的更慢，尤其是③这一档。', en: '<b>About these numbers:</b> The three tiers are simplified estimates based on theoretical bandwidth ratios to illustrate orders of magnitude, not actual benchmark scores. Real-world scenarios involve scheduling overhead, random read amplification, etc., making actual speeds slower than the pure ratio suggests — especially for tier ③.' },
  'bw.journey-caveat-label':      { zh: '关于这组数字：',   en: 'About these numbers:' },
};

// ─── Core functions ────────────────────────────

function getSavedLang() {
  try { return localStorage.getItem(I18N_STORAGE_KEY) || 'en'; }
  catch { return 'zh'; }
}

function saveLang(lang) {
  try { localStorage.setItem(I18N_STORAGE_KEY, lang); } catch {}
}

function getCurrentLang() {
  return getSavedLang();
}

function t(key) {
  const lang = getCurrentLang();
  const entry = LANG[key];
  if (!entry) return key;
  return entry[lang] || entry['zh'] || key;
}

function applyTranslation() {
  const lang = getCurrentLang();

  // Update html lang attribute
  document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';

  // Update toggle buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Translate elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const text = t(key);
    if (el.dataset.i18nHtml === 'true') {
      el.innerHTML = text;
    } else {
      el.textContent = text;
    }
  });

  // Translate placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    el.placeholder = t(key);
  });

  // Fire custom event for pages that need dynamic re-render
  document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang } }));
}

function switchLang(lang) {
  if (lang === getCurrentLang()) return;
  saveLang(lang);
  applyTranslation();

  // Notify other scripts (charts, calculators, etc.)
  // Some pages need to re-render dynamic content
  if (window.i18nOnChange) {
    window.i18nOnChange(lang);
  }
}

// ─── Initialize (runs immediately) ─────────────

(function init() {
  // Create toggle if nav exists
  const navInner = document.querySelector('.nav-inner');
  if (navInner && !document.querySelector('.nav-lang')) {
    const langDiv = document.createElement('div');
    langDiv.className = 'nav-lang';
    langDiv.innerHTML = `
      <button class="lang-btn" data-lang="en">EN</button>
      <span class="lang-slash">/</span>
      <button class="lang-btn" data-lang="zh">中</button>
    `;
    navInner.appendChild(langDiv);

    langDiv.addEventListener('click', function(e) {
      const btn = e.target.closest('.lang-btn');
      if (!btn) return;
      switchLang(btn.dataset.lang);
    });
  }

  // Apply initial translation
  applyTranslation();
})();
