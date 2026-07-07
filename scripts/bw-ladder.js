/* =============================================
   Bandwidth Ladder - Interactive Chart Logic
   ============================================= */

const DATA = [
  {g:'PCIe 3.0', label:'x2', v:1.97, c:'pcie'},
  {g:'PCIe 3.0', label:'x4', v:3.94, c:'pcie'},
  {g:'PCIe 3.0', label:'x8', v:7.88, c:'pcie'},
  {g:'PCIe 3.0', label:'x16', v:15.75, c:'pcie'},

  {g:'PCIe 4.0', label:'x2', v:3.94, c:'pcie'},
  {g:'PCIe 4.0', label:'x4', v:7.88, c:'pcie'},
  {g:'PCIe 4.0', label:'x8', v:15.75, c:'pcie'},
  {g:'PCIe 4.0', label:'x16', v:31.5, c:'pcie'},

  {g:'PCIe 5.0', label:'x2', v:7.88, c:'pcie'},
  {g:'PCIe 5.0', label:'x4', v:15.75, c:'pcie'},
  {g:'PCIe 5.0', label:'x8', v:31.5, c:'pcie'},
  {g:'PCIe 5.0', label:'x16', sub:'R9700 显卡插槽', v:63, c:'pcie', mine:true},

  {g:'DDR5 内存（双通道）', label:'DDR5-4800', sub:'双通道', v:76.8, c:'ram'},
  {g:'DDR5 内存（双通道）', label:'DDR5-6000', sub:'双通道 · 你的目标', v:96, c:'ram', mine:true},
  {g:'DDR5 内存（双通道）', label:'DDR5-8400', sub:'双通道 · Tomahawk Max 上限', v:134.4, c:'ram'},
  {g:'DDR5 内存（单通道，对照）', label:'DDR5-6000 单通道', sub:'你现在的配置', v:48, c:'ram', mine:true},

  {g:'存储设备', label:'HDD 机械硬盘', sub:'顺序读', v:0.18, c:'storage'},
  {g:'存储设备', label:'SATA SSD', sub:'顺序读', v:0.55, c:'storage'},
  {g:'存储设备', label:'NVMe Gen4', sub:'顺序读，如 Lexar Thor Pro', v:7, c:'storage', mine:true},
  {g:'存储设备', label:'NVMe Gen5', sub:'顺序读', v:13, c:'storage'},

  {g:'GPU 显存 (VRAM)', label:'RTX 5060 Ti 16GB', sub:'GDDR7', v:448, c:'vram'},
  {g:'GPU 显存 (VRAM)', label:'R9700 32GB', sub:'GDDR6 · 你的主卡', v:640, c:'vram', mine:true},
];

const MIN_LOG = Math.log10(0.1);
const MAX_LOG = Math.log10(1000);
const LINEAR_MAX = 700;
let scaleMode = 'log';

function pctLog(v) {
  const l = Math.log10(v);
  return Math.max(0, Math.min(100, ((l - MIN_LOG) / (MAX_LOG - MIN_LOG)) * 100));
}
function pctLinear(v) {
  return Math.max(0, Math.min(100, (v / LINEAR_MAX) * 100));
}
function pct(v) {
  return scaleMode === 'log' ? pctLog(v) : pctLinear(v);
}

const axis = document.getElementById('scaleAxis');
const grid = document.getElementById('gridLines');

function renderAxis() {
  axis.innerHTML = '';
  grid.innerHTML = '';
  const marks = scaleMode === 'log'
    ? [0.1, 1, 10, 100, 1000]
    : [0, 100, 200, 300, 400, 500, 600, 700];
  marks.forEach((d, i) => {
    const realP = scaleMode === 'linear' ? pctLinear(d) : pctLog(d);
    const mark = document.createElement('div');
    mark.className = 'decade-mark' + (i === marks.length - 1 ? ' label-right' : '');
    mark.style.left = realP + '%';
    mark.innerHTML = `<span>${d.toLocaleString()} GB/s</span>`;
    axis.appendChild(mark);
    const gl = document.createElement('div');
    gl.className = 'gl';
    gl.style.left = realP + '%';
    grid.appendChild(gl);
  });
}

const container = document.getElementById('barsContainer');
function renderBars() {
  container.querySelectorAll('.group-divider, .bar-row').forEach(el => el.remove());
  let lastGroup = null;
  DATA.forEach(d => {
    if (d.g !== lastGroup) {
      const gd = document.createElement('div');
      gd.className = 'group-divider';
      gd.textContent = d.g;
      container.appendChild(gd);
      lastGroup = d.g;
    }
    const row = document.createElement('div');
    row.className = 'bar-row' + (d.mine ? ' mine' : '');
    row.innerHTML = `
      <div class="label">${d.label}${d.mine ? '<span class="mine-badge">你的配置</span>' : ''}${d.sub ? '<small>' + d.sub + '</small>' : ''}</div>
      <div class="bar-track">
        <div class="bar-fill cat-${d.c}${d.mine ? ' mine' : ''}" data-target="${pct(d.v)}"></div>
      </div>
      <div class="bar-value">${d.v >= 100 ? Math.round(d.v) : d.v} GB/s</div>
    `;
    container.appendChild(row);
  });
}

function animateBars() {
  document.querySelectorAll('.bar-fill').forEach(el => {
    el.style.width = el.getAttribute('data-target') + '%';
  });
  document.querySelectorAll('.speedbar-fill').forEach(el => {
    el.style.width = el.getAttribute('data-w') + '%';
  });
}

function init() {
  renderAxis();
  renderBars();

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateBars(); io.disconnect(); }
    });
  }, { threshold: 0.15 });
  io.observe(document.getElementById('chart-section'));
  setTimeout(animateBars, 300);

  // Mode toggle
  const modeHint = document.getElementById('modeHint');
  const HINTS = {
    log: '// 每格代表 ×10 —— 小数值也看得清',
    linear: '// 真实比例，1:1 —— 小数值会被显存"碾平"'
  };
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      if (mode === scaleMode) return;
      scaleMode = mode;
      document.querySelectorAll('.mode-btn').forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      modeHint.textContent = HINTS[mode];
      renderAxis();
      renderBars();
      document.querySelectorAll('.bar-fill').forEach(el => { el.style.width = '0%'; });
      requestAnimationFrame(() => requestAnimationFrame(animateBars));
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
