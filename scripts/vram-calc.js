/* =============================================
   LLM VRAM Calculator - Scripts
   hardware-compare project
   ============================================= */

(function () {
  'use strict';

  // Data loading safety check
  if (typeof GPU_VRAM_LIST === 'undefined') {
    document.body.innerHTML = '<div style="text-align:center;padding:120px 24px;color:#86868b;"><h2>GPU 数据未能加载</h2><p>请确保 data/gpu-dataset.js 文件存在，然后刷新页面重试。</p></div>';
    return;
  }

  // ===== Constants =====

  const BYTES_PER_GB = 1073741824; // 1024^3

  const PRECISION = {
    fp32: { label: 'FP32', bytesPerParam: 4, kvBytes: 4 },
    fp16: { label: 'BF16/FP16', bytesPerParam: 2, kvBytes: 2 },
    fp8: { label: 'FP8', bytesPerParam: 1, kvBytes: 1 },
    int4: { label: 'INT4/NF4', bytesPerParam: 0.5, kvBytes: 0.5 },
  };

  const MODEL_PRESETS = {
    custom: { name: '自定义', params: 7, layers: 32, hidden: 4096, type: 'dense' },
    llama3_8b: { name: 'LLaMA 3.1 8B', params: 8, layers: 32, hidden: 4096, type: 'dense' },
    llama3_70b: { name: 'LLaMA 3.1 70B', params: 70, layers: 80, hidden: 8192, type: 'dense' },
    llama3_405b: { name: 'LLaMA 3.1 405B', params: 405, layers: 126, hidden: 16384, type: 'dense' },
    mistral_7b: { name: 'Mistral 7B', params: 7, layers: 32, hidden: 4096, type: 'dense' },
    mixtral_8x7b: { name: 'Mixtral 8x7B', params: 47, active: 13, layers: 32, hidden: 4096, type: 'moe' },
    mixtral_8x22b: { name: 'Mixtral 8x22B', params: 141, active: 39, layers: 56, hidden: 6144, type: 'moe' },
    qwen36_27b: { name: 'Qwen 3.6 27B', params: 27, layers: 64, hidden: 5120, type: 'dense' },
    qwen25_7b: { name: 'Qwen 2.5 7B', params: 7, layers: 28, hidden: 3584, type: 'dense' },
    qwen25_32b: { name: 'Qwen 2.5 32B', params: 32, layers: 64, hidden: 5120, type: 'dense' },
    qwen25_72b: { name: 'Qwen 2.5 72B', params: 72, layers: 80, hidden: 8192, type: 'dense' },
    deepseek_v3: { name: 'DeepSeek-V3', params: 671, active: 37, layers: 61, hidden: 7168, type: 'moe' },
    deepseek_r1: { name: 'DeepSeek-R1', params: 671, active: 37, layers: 61, hidden: 7168, type: 'moe' },
    gemma2_27b: { name: 'Gemma 2 27B', params: 27, layers: 46, hidden: 6144, type: 'dense' },
    phi3_14b: { name: 'Phi-3 14B', params: 14, layers: 40, hidden: 5120, type: 'dense' },
  };

  // GPU_VRAM_LIST is loaded from data/gpu-dataset.js (global)

  // ===== DOM Refs =====
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const dom = {
    preset: $('#modelPreset'),
    paramCount: $('#paramCount'),
    paramDec: $('#paramDec'),
    paramInc: $('#paramInc'),

    precisionBtns: () => $$('#precisionGroup .btn-option'),
    modeBtns: () => $$('#modeGroup .btn-option'),

    contextLen: $('#contextLen'),
    batchSize: $('#batchSize'),
    numLayers: $('#numLayers'),
    hiddenDim: $('#hiddenDim'),
    activationCkpt: $('#activationCheckpoint'),

    totalVram: $('#totalVram'),
    totalBarFill: $('#totalBarFill'),
    gpuList: $('#gpuList'),
    breakdown: $('#breakdownList'),
    detailTable: $('#detailTable'),
    resultPanel: $('#resultPanel'),
    moeOptions: $('#moeOptions'),
    activeParams: $('#activeParams'),
    activationOptions: $('#activationOptions'),
  };

  // ===== State =====
  let state = {
    preset: 'custom',
    params: 7,
    activeParams: 0,
    precision: 'fp16',
    mode: 'inference',
    contextLen: 8192,
    batchSize: 1,
    layers: 32,
    hiddenDim: 4096,
    activationCheckpoint: true,
  };

  // ===== Architecture Estimation =====
  // Estimate num_layers and hidden_dim from param count for dense transformers
  function estimateArchitecture(paramsB) {
    if (paramsB <= 0) return { layers: 12, hiddenDim: 2048 };

    if (paramsB < 1) {
      const t = paramsB / 1;
      return { layers: Math.round(12 + t * 4), hiddenDim: Math.round(2048 + t * 512) };
    }
    if (paramsB < 3) {
      const t = (paramsB - 1) / 2;
      return { layers: Math.round(16 + t * 8), hiddenDim: Math.round(2560 + t * 640) };
    }
    if (paramsB < 7) {
      const t = (paramsB - 3) / 4;
      return { layers: Math.round(24 + t * 8), hiddenDim: Math.round(3200 + t * 896) };
    }
    if (paramsB < 13) {
      const t = (paramsB - 7) / 6;
      return { layers: Math.round(32 + t * 8), hiddenDim: Math.round(4096 + t * 1024) };
    }
    if (paramsB < 34) {
      const t = (paramsB - 13) / 21;
      return { layers: Math.round(40 + t * 20), hiddenDim: Math.round(5120 + t * 1536) };
    }
    if (paramsB < 70) {
      const t = (paramsB - 34) / 36;
      return { layers: Math.round(60 + t * 20), hiddenDim: Math.round(6656 + t * 1536) };
    }
    if (paramsB < 200) {
      const t = (paramsB - 70) / 130;
      return { layers: Math.round(80 + t * 30), hiddenDim: Math.round(8192 + t * 4096) };
    }
    if (paramsB < 400) {
      const t = (paramsB - 200) / 200;
      return { layers: Math.round(110 + t * 16), hiddenDim: Math.round(12288 + t * 4096) };
    }
    return { layers: 126, hiddenDim: 16384 };
  }

  // ===== Calculation =====
  function calcVRAM(paramsB, precision, mode, contextLen, batchSize, layers, hiddenDim, useAC, kvBytesOverride) {
    const prec = PRECISION[precision];
    const bytesPerParam = prec.bytesPerParam;
    const kvBytes = kvBytesOverride || prec.kvBytes;

    const totalParams = paramsB * 1e9;
    const effectiveParams = totalParams;
    const overheadGB = 1.0; // Fixed CUDA overhead

    // Calculate components in GiB
    const weightsGB = (effectiveParams * bytesPerParam) / BYTES_PER_GB;

    // KV Cache: 2 (K+V) × batch × seq_len × num_layers × hidden_dim × kv_bytes
    const kvCacheGB = (2 * batchSize * contextLen * layers * hiddenDim * kvBytes) / BYTES_PER_GB;

    let optimizerGB = 0;
    let gradientGB = 0;
    let activationGB = 0;
    let loraWeightGB = 0;
    let loraOptGB = 0;

    switch (mode) {
      case 'inference':
        // Inference: weights + KV cache + overhead
        break;

      case 'train': {
        // Full training with mixed precision (FP16 weights + FP32 Adam)
        const fp16Bytes = PRECISION.fp16.bytesPerParam;
        const fp32Bytes = PRECISION.fp32.bytesPerParam;

        // Weights in FP16
        // Gradients in same precision as weights (FP16)
        gradientGB = (effectiveParams * fp16Bytes) / BYTES_PER_GB;

        // Optimizer states: FP32 master copy + Adam momentum + Adam variance = 3 × FP32
        optimizerGB = (effectiveParams * fp32Bytes * 3) / BYTES_PER_GB;

        // Activations (rough estimate)
        // Without checkpointing: batch × seq × hidden × layers × bytes × 2 (safety)
        // With checkpointing: ~batch × seq × hidden × bytes × 8 (stores ~8 elements per layer)
        const actBytes = useAC ? (batchSize * contextLen * hiddenDim * fp16Bytes * 8) / BYTES_PER_GB
          : (batchSize * contextLen * hiddenDim * layers * fp16Bytes * 2) / BYTES_PER_GB;
        activationGB = actBytes;
        break;
      }

      case 'lora': {
        // LoRA: base model in chosen precision + small LoRA adapter
        // LoRA typically ~0.1-0.5% of params. We use 0.2% as default.
        const loraRatio = 0.002;
        const loraBytes = PRECISION.fp16.bytesPerParam;
        const loraParams = totalParams * loraRatio;

        loraWeightGB = (loraParams * loraBytes) / BYTES_PER_GB;
        loraOptGB = (loraParams * PRECISION.fp32.bytesPerParam * 3) / BYTES_PER_GB;

        // Minimal activations for LoRA
        const actBytes = (batchSize * contextLen * hiddenDim * loraBytes * 8) / BYTES_PER_GB;
        activationGB = actBytes;
        break;
      }
    }

    // For inference: full weights in chosen precision
    // For LoRA: base weights in chosen precision
    // For training: FP16 weights (calculated above as weightsGB already includes the precision)
    // Wait — for training, weightsGB should be FP16 not the chosen precision
    let effectiveWeightsGB = weightsGB;
    let effectiveGradientGB = gradientGB;
    if (mode === 'train') {
      // Override: training uses FP16 weights regardless of what user selected for weight display
      effectiveWeightsGB = (effectiveParams * PRECISION.fp16.bytesPerParam) / BYTES_PER_GB;
    } else if (mode === 'lora') {
      effectiveGradientGB = 0;
    }

    const total = effectiveWeightsGB + kvCacheGB + optimizerGB + effectiveGradientGB + activationGB + loraWeightGB + loraOptGB + overheadGB;

    return {
      total,
      weights: effectiveWeightsGB,
      kvCache: kvCacheGB,
      optimizer: optimizerGB,
      gradients: effectiveGradientGB,
      activations: activationGB,
      loraWeights: loraWeightGB,
      loraOpt: loraOptGB,
      overhead: overheadGB,
      precision: prec.label,
      kvBytes,
    };
  }

  // ===== Rendering =====
  function render() {
    const paramsB = parseFloat(state.params) || 0;
    const layers = parseInt(state.layers) || 32;
    const hiddenDim = parseInt(state.hiddenDim) || 4096;
    const contextLen = parseInt(state.contextLen) || 4096;
    const batchSize = parseInt(state.batchSize) || 1;

    let effectiveParams = paramsB;
    let isMoE = false;
    let activeParams = 0;

    // Check if current preset is MoE
    const preset = MODEL_PRESETS[state.preset];
    if (preset && preset.type === 'moe') {
      isMoE = true;
      activeParams = preset.active || paramsB;
      if (state.activeParams > 0) {
        activeParams = state.activeParams;
      }
    }

    const useAC = state.activationCheckpoint;

    const usePrecision = state.mode === 'train' ? 'fp16' : state.precision;
    const result = calcVRAM(
      state.mode === 'lora' ? paramsB : paramsB,
      usePrecision,
      state.mode,
      contextLen,
      batchSize,
      layers,
      hiddenDim,
      useAC
    );

    // For LoRA, the "weights" result needs adjustment
    let displayResult = { ...result };
    if (state.mode === 'lora') {
      // Recalculate with chosen precision for base weights
      const prec = PRECISION[state.precision];
      const baseWeightsGB = (paramsB * 1e9 * prec.bytesPerParam) / BYTES_PER_GB;
      displayResult.weights = baseWeightsGB;
      displayResult.total = baseWeightsGB + result.kvCache + result.activations + result.loraWeights + result.loraOpt + result.overhead;
    } else if (state.mode === 'train') {
      // For training, show the precision as what user selected even though weights use FP16
      // The weightsGB in calc is already FP16; keep the rest
    }

    const total = displayResult.total;

    // --- Total VRAM ---
    const totalEl = dom.totalVram;
    totalEl.innerHTML = `${total.toFixed(1)} <span class="unit-text">GiB</span>`;
    totalEl.className = 'total-value';
    if (total <= 12) totalEl.classList.add('success');
    else if (total <= 24) totalEl.classList.add('warning');
    else totalEl.classList.add('danger');

    // --- Total Bar ---
    const maxScale = Math.max(total * 1.2, 24);
    const pct = Math.min((total / maxScale) * 100, 100);
    const fill = dom.totalBarFill;
    fill.style.width = pct + '%';
    fill.className = 'bar-fill';
    if (total <= 12) fill.classList.add('success');
    else if (total <= 24) fill.classList.add('warning');
    else fill.classList.add('danger');

    // Update bar labels
    const barLabels = document.querySelector('.total-bar-labels');
    if (barLabels) {
      barLabels.innerHTML = `
        <span>0 GiB</span>
        <span>${maxScale.toFixed(0)} GiB</span>
      `;
    }

    // Update tick marks
    const ticksEl = document.querySelector('.total-bar-ticks');
    if (ticksEl) {
      const tickValues = [12, 24, 48, 80, 141];
      ticksEl.innerHTML = tickValues
        .filter(v => v < maxScale)
        .map(v => {
          const p = (v / maxScale) * 100;
          return `<span style="position:absolute;left:${p}%;transform:translateX(-50%);">${v}G</span>`;
        })
        .join('');
      ticksEl.style.position = 'relative';
    }

    // --- Breakdown ---
    const items = [
      { key: 'weights', label: '模型权重', color: 'color-weights', value: displayResult.weights },
      { key: 'kvCache', label: 'KV Cache', color: 'color-kvcache', value: displayResult.kvCache },
    ];

    if (state.mode === 'train') {
      items.push({ key: 'optimizer', label: '优化器状态', color: 'color-optimizer', value: displayResult.optimizer });
      items.push({ key: 'gradients', label: '梯度', color: 'color-gradients', value: displayResult.gradients });
      items.push({ key: 'activations', label: '激活值', color: 'color-activations', value: displayResult.activations });
    } else if (state.mode === 'lora') {
      items.push({ key: 'loraWeights', label: 'LoRA 权重', color: 'color-gradients', value: displayResult.loraWeights });
      items.push({ key: 'loraOpt', label: 'LoRA 优化器', color: 'color-optimizer', value: displayResult.loraOpt });
      items.push({ key: 'activations', label: '激活值', color: 'color-activations', value: displayResult.activations });
    }

    items.push({ key: 'overhead', label: '框架开销', color: 'color-overhead', value: displayResult.overhead });

    const breakdownHTML = items
      .map((item) => {
        const pct = total > 0 ? (item.value / total) * 100 : 0;
        return `
          <div class="breakdown-item">
            <span class="breakdown-color ${item.color}"></span>
            <span class="breakdown-label">${item.label}</span>
            <div class="breakdown-bar-item">
              <div class="fill ${item.color}" style="width:${pct}%"></div>
            </div>
            <span class="breakdown-value">${item.value.toFixed(2)} GiB</span>
          </div>
        `;
      })
      .join('');

    dom.breakdown.innerHTML = breakdownHTML;

    // --- GPU Compatibility ---
    const vendorOrder = ['nvidia', 'amd', 'apple'];
    const vendorLabels = { nvidia: 'NVIDIA', amd: 'AMD', apple: 'Apple' };

    const gpuHTML = vendorOrder.map(vendor => {
      const items = GPU_VRAM_LIST.filter(g => g.vendor === vendor);
      if (!items.length) return '';
      return `
        <div class="gpu-group">
          <div class="gpu-group-label">${vendorLabels[vendor]}</div>
          ${items.map(gpu => {
            const ratio = total / gpu.vram;
            let status = 'compatible';
            let badge = '✓ 可运行';
            if (ratio > 0.95 && ratio <= 1.2) {
              status = 'partial';
              badge = '△ 勉强可用';
            } else if (ratio > 1.2) {
              status = 'incompatible';
              badge = '✗ 显存不足';
            }
            return `
              <div class="gpu-item ${status}">
                <span class="gpu-name">${gpu.name}</span>
                <span>
                  <span class="gpu-vram">${gpu.vram} GiB</span>
                  <span class="gpu-badge">${badge}</span>
                </span>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }).join('');
    dom.gpuList.innerHTML = gpuHTML;

    // --- Detail Table ---
    const rows = [
      { label: '模型参数量', value: `${paramsB.toFixed(1)} B`, note: isMoE ? `(MoE, 活跃: ${activeParams}B)` : '' },
      { label: '权重精度', value: displayResult.precision, note: `${PRECISION[state.precision === 'train' ? 'fp16' : state.precision].bytesPerParam} 字节/参数` },
      { label: '模型权重', value: `${displayResult.weights.toFixed(2)} GiB`, note: `${(paramsB * 1e9 * PRECISION[state.precision === 'train' ? 'fp16' : state.precision].bytesPerParam).toLocaleString()} 字节` },
      { label: 'KV Cache', value: `${displayResult.kvCache.toFixed(2)} GiB`, note: `${state.mode === 'train' ? '训练时也需缓存中间 KV' : '推理时存储 Key/Value'} · ${batchSize} batch × ${contextLen} tokens` },
    ];

    if (state.mode === 'train') {
      rows.push(
        { label: '梯度', value: `${displayResult.gradients.toFixed(2)} GiB`, note: 'FP16 精度' },
        { label: '优化器状态 (Adam)', value: `${displayResult.optimizer.toFixed(2)} GiB`, note: 'FP32 主权重 + 动量 + 方差' },
        { label: '激活值', value: `${displayResult.activations.toFixed(2)} GiB`, note: useAC ? '已启用激活检查点' : '未启用激活检查点' },
      );
    } else if (state.mode === 'lora') {
      rows.push(
        { label: 'LoRA 权重', value: `${displayResult.loraWeights.toFixed(3)} GiB`, note: '~0.2% 参数量, FP16' },
        { label: 'LoRA 优化器', value: `${displayResult.loraOpt.toFixed(3)} GiB`, note: 'Adam, FP32' },
        { label: '激活值', value: `${displayResult.activations.toFixed(2)} GiB`, note: 'LoRA 微调' },
      );
    }

    rows.push({ label: '框架开销', value: `${displayResult.overhead.toFixed(1)} GiB`, note: 'CUDA 上下文 + PyTorch 框架' });

    // Add model architecture info
    rows.push(
      { label: '网络层数', value: `${layers}`, note: '' },
      { label: '隐藏维度', value: `${hiddenDim}`, note: '' },
    );

    const modeLabels = { inference: '推理', train: '完整训练', lora: 'LoRA 微调' };
    rows.push({ label: '使用场景', value: modeLabels[state.mode] || state.mode, note: '' });

    const totalRow = { label: '所需总显存', value: `${displayResult.total.toFixed(2)} GiB`, note: '', total: true };

    const tableHTML = `
      <table class="detail-table">
        <thead>
          <tr>
            <th>项目</th>
            <th>数值</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => `
            <tr class="${r.total ? 'total-row' : ''}">
              <td>${r.label}</td>
              <td>${r.value}</td>
              <td>${r.note || ''}</td>
            </tr>
          `).join('')}
          <tr class="total-row">
            <td>${totalRow.label}</td>
            <td>${totalRow.value}</td>
            <td>${totalRow.note || ''}</td>
          </tr>
        </tbody>
      </table>
    `;
    dom.detailTable.innerHTML = tableHTML;
  }

  // ===== Event Handlers =====

  // --- Preset ---
  dom.preset.addEventListener('change', function () {
    const key = this.value;
    const preset = MODEL_PRESETS[key];
    if (!preset) return;

    state.preset = key;
    dom.paramCount.value = preset.params;
    dom.numLayers.value = preset.layers;
    dom.hiddenDim.value = preset.hidden;
    state.params = preset.params;
    state.layers = preset.layers;
    state.hiddenDim = preset.hidden;

    // Show/hide MoE options
    if (preset.type === 'moe') {
      dom.moeOptions.style.display = 'block';
      if (preset.active) {
        dom.activeParams.value = preset.active;
        state.activeParams = preset.active;
      }
    } else {
      dom.moeOptions.style.display = 'none';
      state.activeParams = 0;
    }

    render();
  });

  // --- Parameter count ---
  dom.paramDec.addEventListener('click', function () {
    const input = dom.paramCount;
    let val = parseFloat(input.value) || 0;
    const step = parseFloat(input.step) || 1;
    val = Math.max(parseFloat(input.min) || 0, val - step);
    input.value = val;
    state.params = val;
    // If custom, auto-estimate architecture
    if (state.preset === 'custom') {
      const arch = estimateArchitecture(val);
      dom.numLayers.value = arch.layers;
      dom.hiddenDim.value = arch.hiddenDim;
      state.layers = arch.layers;
      state.hiddenDim = arch.hiddenDim;
    }
    render();
  });

  dom.paramInc.addEventListener('click', function () {
    const input = dom.paramCount;
    let val = parseFloat(input.value) || 0;
    const step = parseFloat(input.step) || 1;
    val += step;
    input.value = val;
    state.params = val;
    if (state.preset === 'custom') {
      const arch = estimateArchitecture(val);
      dom.numLayers.value = arch.layers;
      dom.hiddenDim.value = arch.hiddenDim;
      state.layers = arch.layers;
      state.hiddenDim = arch.hiddenDim;
    }
    render();
  });

  dom.paramCount.addEventListener('input', function () {
    const val = parseFloat(this.value) || 0;
    state.params = val;
    if (state.preset === 'custom') {
      const arch = estimateArchitecture(val);
      dom.numLayers.value = arch.layers;
      dom.hiddenDim.value = arch.hiddenDim;
      state.layers = arch.layers;
      state.hiddenDim = arch.hiddenDim;
    }
    render();
  });

  // --- Precision buttons ---
  $$('#precisionGroup .btn-option').forEach(btn => {
    btn.addEventListener('click', function () {
      $$('#precisionGroup .btn-option').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      state.precision = this.dataset.value;
      render();
    });
  });

  // --- Precision button state (enable/disable for training mode) ---
  function updatePrecisionUI() {
    const isTrain = state.mode === 'train';
    $$('#precisionGroup .btn-option').forEach(function (b) {
      if (isTrain && b.dataset.value !== 'fp16') {
        b.disabled = true;
        b.style.opacity = '0.35';
        b.style.cursor = 'not-allowed';
        b.classList.remove('active');
      } else {
        b.disabled = false;
        b.style.opacity = '';
        b.style.cursor = '';
      }
    });
    if (isTrain) {
      // Force FP16 as active in training mode
      $$('#precisionGroup .btn-option').forEach(function (b) {
        if (b.dataset.value === 'fp16') b.classList.add('active');
      });
      state.precision = 'fp16';
    }
  }

  // --- Mode buttons ---
  $$('#modeGroup .btn-option').forEach(btn => {
    btn.addEventListener('click', function () {
      $$('#modeGroup .btn-option').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      state.mode = this.dataset.value;

      // Show/hide training-related options
      if (state.mode === 'train') {
        dom.activationOptions.style.display = 'block';
      } else {
        dom.activationOptions.style.display = 'none';
      }

      updatePrecisionUI();
      render();
    });
  });

  // --- Context length ---
  dom.contextLen.addEventListener('input', function () {
    state.contextLen = parseInt(this.value) || 4096;
    render();
  });

  // --- Batch size ---
  dom.batchSize.addEventListener('input', function () {
    state.batchSize = parseInt(this.value) || 1;
    render();
  });

  // --- Architecture (advanced) ---
  dom.numLayers.addEventListener('input', function () {
    state.layers = parseInt(this.value) || 32;
    state.preset = 'custom';
    dom.preset.value = 'custom';
    render();
  });

  dom.hiddenDim.addEventListener('input', function () {
    state.hiddenDim = parseInt(this.value) || 4096;
    state.preset = 'custom';
    dom.preset.value = 'custom';
    render();
  });

  // --- Activation checkpointing ---
  dom.activationCkpt.addEventListener('change', function () {
    state.activationCheckpoint = this.checked;
    render();
  });

  // --- MoE active params ---
  dom.activeParams.addEventListener('input', function () {
    state.activeParams = parseFloat(this.value) || 0;
    render();
  });

  // ===== Init =====
  function init() {
    // Populate model preset dropdown from MODEL_PRESETS
    const select = dom.preset;
    select.innerHTML = '';
    const keys = Object.keys(MODEL_PRESETS);
    // Put 'custom' first
    const customIdx = keys.indexOf('custom');
    if (customIdx > -1) {
      keys.splice(customIdx, 1);
      keys.unshift('custom');
    }
    keys.forEach(key => {
      const preset = MODEL_PRESETS[key];
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = preset.type === 'moe' ? `${preset.name} (MoE)` : preset.name;
      select.appendChild(opt);
    });

    // Set default values in DOM
    dom.paramCount.value = state.params;
    dom.numLayers.value = state.layers;
    dom.hiddenDim.value = state.hiddenDim;
    dom.contextLen.value = state.contextLen;
    dom.batchSize.value = state.batchSize;
    dom.activationCkpt.checked = state.activationCheckpoint;
    dom.moeOptions.style.display = 'none';
    dom.activationOptions.style.display = 'none';

    updatePrecisionUI();
    render();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
