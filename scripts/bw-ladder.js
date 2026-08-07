/* =============================================
   Bandwidth Ladder - Interactive Chart Logic
   Supports i18n via global t() from scripts/i18n.js
   ============================================= */

// Translation helpers — use t() if available
function _t(key) { return typeof t === 'function' ? t(key) : key; }

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
  {g:'PCIe 5.0', label:'x16', subKey:'bw.chart.pcie-label', v:63, c:'pcie', mine:true},

  {gKey:'bw.chart.ddr5-dual', label:'DDR5-4800', subKey:'bw.chart.dual-channel', v:76.8, c:'ram'},
  {gKey:'bw.chart.ddr5-dual', label:'DDR5-6000', subKey:'bw.chart.dual-target', v:96, c:'ram', mine:true},
  {gKey:'bw.chart.ddr5-dual', label:'DDR5-8400', subKey:'bw.chart.dual-tomahawk', v:134.4, c:'ram'},
  {gKey:'bw.chart.ddr5-single', label:'DDR5-6000 单通道', subKey:'bw.chart.single-current', v:48, c:'ram', mine:true},

  {gKey:'bw.chart.storage-hdd', label:'HDD 机械硬盘', subKey:'bw.chart.seq-read', v:0.18, c:'storage'},
  {gKey:'bw.chart.storage-hdd', label:'SATA SSD', subKey:'bw.chart.seq-read', v:0.55, c:'storage'},
  {gKey:'bw.chart.storage-hdd', label:'NVMe Gen4', subKey:'bw.chart.seq-read-lexar', v:7, c:'storage', mine:true},
  {gKey:'bw.chart.storage-hdd', label:'NVMe Gen5', subKey:'bw.chart.seq-read', v:13, c:'storage'},

  {gKey:'bw.chart.vram', label:'RTX 5060 Ti 16GB', subKey:'bw.chart.gddr7', v:448, c:'vram'},
  {gKey:'bw.chart.vram', label:'R9700 32GB', subKey:'bw.chart.gddr6-yours', v:640, c:'vram', mine:true},
];

const MIN_LOG = Math.log10(0.1);
const MAX_LOG = Math.log10(1000);
const LINEAR_MAX = 700;
let scaleMode = 'log';
let _lang = 'zh';

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

function getGroupName(d) {
  if (d.gKey) return _t(d.gKey);
  return d.g;
}

function getSubText(d) {
  if (d.subKey) return _t(d.subKey);
  return d.sub || '';
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
    const grp = getGroupName(d);
    if (grp !== lastGroup) {
      const gd = document.createElement('div');
      gd.className = 'group-divider';
      gd.textContent = grp;
      container.appendChild(gd);
      lastGroup = grp;
    }
    const row = document.createElement('div');
    row.className = 'bar-row' + (d.mine ? ' mine' : '');
    const sub = getSubText(d);
    row.innerHTML = `
      <div class="label">${d.label}${d.mine ? '<span class="mine-badge">' + _t('bw.chart.your-config') + '</span>' : ''}${sub ? '<small>' + sub + '</small>' : ''}</div>
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
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      if (mode === scaleMode) return;
      scaleMode = mode;
      document.querySelectorAll('.mode-btn').forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      modeHint.textContent = _t('bw.chart.mode-hint-' + scaleMode);
      renderAxis();
      renderBars();
      document.querySelectorAll('.bar-fill').forEach(el => { el.style.width = '0%'; });
      requestAnimationFrame(() => requestAnimationFrame(animateBars));
    });
  });

  // Set initial mode hint
  modeHint.textContent = _t('bw.chart.mode-hint-' + scaleMode);
}

// Re-render on language switch
document.addEventListener('i18n:changed', function () {
  renderAxis();
  renderBars();
  const modeHint = document.getElementById('modeHint');
  if (modeHint) modeHint.textContent = _t('bw.chart.mode-hint-' + scaleMode);
});

document.addEventListener('DOMContentLoaded', init);
