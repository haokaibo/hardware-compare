/* =============================================
   GPU Dataset - Shared Data Source
   hardware-compare project
   ============================================= */

/**
 * GPU benchmark dataset — consumer-grade GPUs tested for AI workloads.
 *
 * Fields:
 *   rank        – ranking position
 *   name        – GPU model name
 *   desc        – VRAM / power spec (shown in second line)
 *   imgVal      – image generation throughput (it/s)
 *   imgMax      – max reference for progress bar
 *   vidText     – video generation time ("38s") or "显存不足"
 *   vidPct      – progress bar percentage (0 for OOM)
 *   llmVal      – LLM inference speed (tok/s)
 *   llmMax      – max reference for progress bar
 *   price       – market price string
 *   ratio       – value-for-money score
 *   grade       – S/A/B/C rank badge
 *   isHighlight – true to visually highlight this row
 *   hasTag      – true to show a "推荐" tag badge
 */
const GPU_BENCHMARKS = [
  { rank: 1,  name: "RTX 5090",          desc: "32GB GDDR7 · 575W",     imgVal: 4.8, imgMax: 5.0, vidText: "38s",      vidPct: 90, llmVal: 68, llmMax: 70, price: "$2,999",         ratio: 72, grade: "S", isHighlight: false, hasTag: false },
  { rank: 2,  name: "RTX 5080",          desc: "16GB GDDR7 · 360W",     imgVal: 3.5, imgMax: 5.0, vidText: "58s",      vidPct: 70, llmVal: 49, llmMax: 70, price: "$1,499",         ratio: 81, grade: "A", isHighlight: false, hasTag: false },
  { rank: 3,  name: "RX 9070 XT",        desc: "16GB GDDR6 · 304W",     imgVal: 2.8, imgMax: 5.0, vidText: "74s",      vidPct: 55, llmVal: 31, llmMax: 70, price: "$799",           ratio: 88, grade: "A", isHighlight: false, hasTag: false },
  { rank: 4,  name: "RTX 3090",          desc: "24GB GDDR6X · 350W",    imgVal: 2.6, imgMax: 5.0, vidText: "82s",      vidPct: 48, llmVal: 38, llmMax: 70, price: "~$499 二手",    ratio: 96, grade: "A", isHighlight: true,  hasTag: true },
  { rank: 5,  name: "RTX 4070 Ti Super", desc: "16GB GDDR6X · 285W",    imgVal: 2.2, imgMax: 5.0, vidText: "96s",      vidPct: 35, llmVal: 27, llmMax: 70, price: "$899",           ratio: 74, grade: "B", isHighlight: false, hasTag: false },
  { rank: 6,  name: "RTX 4060 Ti",       desc: "16GB GDDR6 · 165W",     imgVal: 1.6, imgMax: 5.0, vidText: "133s",     vidPct: 15, llmVal: 19, llmMax: 70, price: "$599",           ratio: 62, grade: "B", isHighlight: false, hasTag: false },
  { rank: 7,  name: "RTX 4060",          desc: "8GB GDDR6 · 115W",      imgVal: 1.1, imgMax: 5.0, vidText: "显存不足",  vidPct: 0,  llmVal: 15, llmMax: 70, price: "$399",           ratio: 41, grade: "C", isHighlight: false, hasTag: false },
];

/**
 * GPU VRAM list for compatibility checking in the VRAM calculator.
 * vendor: "nvidia" | "amd" | "apple"
 */
const GPU_VRAM_LIST = [
  // NVIDIA
  { name: 'RTX 3060',         vram: 12,  vendor: 'nvidia' },
  { name: 'RTX 4060',         vram: 8,   vendor: 'nvidia' },
  { name: 'RTX 4060 Ti',      vram: 16,  vendor: 'nvidia' },
  { name: 'RTX 4070',         vram: 12,  vendor: 'nvidia' },
  { name: 'RTX 4070 Ti Super', vram: 16, vendor: 'nvidia' },
  { name: 'RTX 4080 Super',   vram: 16,  vendor: 'nvidia' },
  { name: 'RTX 4090',         vram: 24,  vendor: 'nvidia' },
  { name: 'RTX 5080',         vram: 16,  vendor: 'nvidia' },
  { name: 'RTX 5090',         vram: 32,  vendor: 'nvidia' },
  { name: 'RTX 3090',         vram: 24,  vendor: 'nvidia' },
  { name: 'RTX 6000 Ada',     vram: 48,  vendor: 'nvidia' },
  { name: 'A100 40GB',        vram: 40,  vendor: 'nvidia' },
  { name: 'A100 80GB',        vram: 80,  vendor: 'nvidia' },
  { name: 'H100 SXM',         vram: 80,  vendor: 'nvidia' },
  { name: 'H200 SXM',         vram: 141, vendor: 'nvidia' },
  { name: 'B200 SXM',         vram: 180, vendor: 'nvidia' },
  // AMD
  { name: 'RX 7900 XTX',      vram: 24,  vendor: 'amd' },
  { name: 'RX 9070 XT',       vram: 16,  vendor: 'amd' },
  { name: 'AI Pro R9700',     vram: 32,  vendor: 'amd' },
  // Apple
  { name: 'Mac M4 Max (统一内存)',  vram: 128, vendor: 'apple' },
  { name: 'Mac M3 Ultra (统一内存)', vram: 192, vendor: 'apple' },
];
