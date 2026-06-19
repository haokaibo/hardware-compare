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
 *   vendor      – "nvidia" | "amd" | "apple"
 */
const GPU_BENCHMARKS = [
  { rank: 1,  name: "B200 SXM",           desc: "180GB HBM3e · 700W",       imgVal: 6.5, imgMax: 7.0, vidText: "22s",   vidPct: 95, llmVal: 85,  llmMax: 90, price: "~$50,000",      ratio: 20, grade: "S", isHighlight: false, hasTag: false, vendor: "nvidia" },
  { rank: 2,  name: "H200 SXM",           desc: "141GB HBM3e · 700W",      imgVal: 6.0, imgMax: 7.0, vidText: "26s",   vidPct: 92, llmVal: 78,  llmMax: 90, price: "~$40,000",      ratio: 22, grade: "S", isHighlight: false, hasTag: false, vendor: "nvidia" },
  { rank: 3,  name: "H100 SXM",           desc: "80GB HBM3 · 700W",        imgVal: 5.5, imgMax: 7.0, vidText: "30s",   vidPct: 88, llmVal: 72,  llmMax: 90, price: "~$30,000",      ratio: 24, grade: "S", isHighlight: false, hasTag: false, vendor: "nvidia" },
  { rank: 4,  name: "A100 80GB",          desc: "80GB HBM2e · 400W",       imgVal: 5.0, imgMax: 7.0, vidText: "36s",   vidPct: 85, llmVal: 65,  llmMax: 90, price: "~$20,000",      ratio: 28, grade: "S", isHighlight: false, hasTag: false, vendor: "nvidia" },
  { rank: 5,  name: "A100 40GB",          desc: "40GB HBM2e · 400W",       imgVal: 4.8, imgMax: 7.0, vidText: "38s",   vidPct: 83, llmVal: 62,  llmMax: 90, price: "~$15,000",      ratio: 30, grade: "S", isHighlight: false, hasTag: false, vendor: "nvidia" },
  { rank: 6,  name: "RTX 5090",           desc: "32GB GDDR7 · 575W",       imgVal: 4.8, imgMax: 7.0, vidText: "38s",   vidPct: 82, llmVal: 68,  llmMax: 90, price: "$2,999",         ratio: 72, grade: "S", isHighlight: false, hasTag: false, vendor: "nvidia" },
  { rank: 7,  name: "RTX 4090",           desc: "24GB GDDR6X · 450W",      imgVal: 4.0, imgMax: 7.0, vidText: "45s",   vidPct: 70, llmVal: 55,  llmMax: 90, price: "$1,999",         ratio: 68, grade: "A", isHighlight: false, hasTag: false, vendor: "nvidia" },
  { rank: 8,  name: "RTX 6000 Ada",       desc: "48GB GDDR6 · 300W",       imgVal: 3.8, imgMax: 7.0, vidText: "52s",   vidPct: 65, llmVal: 52,  llmMax: 90, price: "$6,899",         ratio: 20, grade: "A", isHighlight: false, hasTag: false, vendor: "nvidia" },
  { rank: 9,  name: "RTX 5080",           desc: "16GB GDDR7 · 360W",       imgVal: 3.5, imgMax: 7.0, vidText: "58s",   vidPct: 60, llmVal: 49,  llmMax: 90, price: "$1,499",         ratio: 72, grade: "A", isHighlight: false, hasTag: false, vendor: "nvidia" },
  { rank: 10, name: "RTX 4080 Super",     desc: "16GB GDDR6X · 320W",      imgVal: 3.0, imgMax: 7.0, vidText: "65s",   vidPct: 55, llmVal: 42,  llmMax: 90, price: "$999",           ratio: 74, grade: "A", isHighlight: false, hasTag: false, vendor: "nvidia" },
  { rank: 11, name: "RX 9070 XT",         desc: "16GB GDDR6 · 304W",       imgVal: 2.8, imgMax: 7.0, vidText: "74s",   vidPct: 50, llmVal: 31,  llmMax: 90, price: "$799",           ratio: 78, grade: "A", isHighlight: false, hasTag: false, vendor: "amd" },
  { rank: 12, name: "RTX 3090",           desc: "24GB GDDR6X · 350W",      imgVal: 2.6, imgMax: 7.0, vidText: "82s",   vidPct: 45, llmVal: 38,  llmMax: 90, price: "~$499 二手",    ratio: 96, grade: "A", isHighlight: true,  hasTag: true,  vendor: "nvidia" },
  { rank: 13, name: "RX 7900 XTX",        desc: "24GB GDDR6 · 355W",       imgVal: 2.4, imgMax: 7.0, vidText: "88s",   vidPct: 42, llmVal: 32,  llmMax: 90, price: "$899",           ratio: 70, grade: "B", isHighlight: false, hasTag: false, vendor: "amd" },
  { rank: 14, name: "RTX 4070 Ti Super",  desc: "16GB GDDR6X · 285W",      imgVal: 2.2, imgMax: 7.0, vidText: "96s",   vidPct: 38, llmVal: 27,  llmMax: 90, price: "$899",           ratio: 66, grade: "B", isHighlight: false, hasTag: false, vendor: "nvidia" },
  { rank: 15, name: "AI Pro R9700",       desc: "32GB GDDR6 · 250W",       imgVal: 2.0, imgMax: 7.0, vidText: "105s",  vidPct: 35, llmVal: 25,  llmMax: 90, price: "~$2,999",        ratio: 24, grade: "B", isHighlight: false, hasTag: false, vendor: "amd" },
  { rank: 16, name: "Mac M3 Ultra",       desc: "192GB 统一内存 · 60C",    imgVal: 2.0, imgMax: 7.0, vidText: "108s",  vidPct: 34, llmVal: 24,  llmMax: 90, price: "~$5,000",        ratio: 14, grade: "B", isHighlight: false, hasTag: false, vendor: "apple" },
  { rank: 17, name: "RTX 4070",           desc: "12GB GDDR6X · 200W",      imgVal: 1.8, imgMax: 7.0, vidText: "110s",  vidPct: 30, llmVal: 22,  llmMax: 90, price: "$549",           ratio: 72, grade: "B", isHighlight: false, hasTag: false, vendor: "nvidia" },
  { rank: 18, name: "RTX 4060 Ti",        desc: "16GB GDDR6 · 165W",       imgVal: 1.6, imgMax: 7.0, vidText: "133s",  vidPct: 25, llmVal: 19,  llmMax: 90, price: "$599",           ratio: 58, grade: "C", isHighlight: false, hasTag: false, vendor: "nvidia" },
  { rank: 19, name: "Mac M4 Max",         desc: "128GB 统一内存 · 40C",    imgVal: 1.4, imgMax: 7.0, vidText: "145s",  vidPct: 20, llmVal: 17,  llmMax: 90, price: "~$3,500",        ratio: 12, grade: "C", isHighlight: false, hasTag: false, vendor: "apple" },
  { rank: 20, name: "RTX 4060",           desc: "8GB GDDR6 · 115W",        imgVal: 1.1, imgMax: 7.0, vidText: "显存不足", vidPct: 0,  llmVal: 15,  llmMax: 90, price: "$399",           ratio: 48, grade: "C", isHighlight: false, hasTag: false, vendor: "nvidia" },
  { rank: 21, name: "RTX 3060",           desc: "12GB GDDR6 · 170W",       imgVal: 1.0, imgMax: 7.0, vidText: "显存不足", vidPct: 0,  llmVal: 12,  llmMax: 90, price: "$299",           ratio: 38, grade: "C", isHighlight: false, hasTag: false, vendor: "nvidia" },
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
