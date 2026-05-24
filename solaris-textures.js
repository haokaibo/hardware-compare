import * as THREE from 'three';

export function generateSaturnBodyTexture() {
    const w = 1024, h = 512;
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');

    // ── 底色：真实土星奶油淡金底调 ──
    // 参考 NASA Cassini 真实色彩：北极偏灰蓝绿，赤道暖米金，南极偏灰蓝
    const baseGrad = ctx.createLinearGradient(0, 0, 0, h);
    baseGrad.addColorStop(0.00, '#b8b6ae');  // 北极：灰白
    baseGrad.addColorStop(0.04, '#c2beae');  // 极冠边缘
    baseGrad.addColorStop(0.12, '#d8d0b8');  // 北高纬：暖灰米
    baseGrad.addColorStop(0.22, '#e5dbbc');  // 北温带
    baseGrad.addColorStop(0.32, '#efe4c4');  // 北赤道
    baseGrad.addColorStop(0.40, '#f5eace');  // 赤道亮区
    baseGrad.addColorStop(0.50, '#f2e8cc');  // 赤道
    baseGrad.addColorStop(0.60, '#ede2c4');  // 南赤道
    baseGrad.addColorStop(0.70, '#e2d6b6');  // 南温带
    baseGrad.addColorStop(0.78, '#d6cbaa');  // 南中纬
    baseGrad.addColorStop(0.86, '#c8bea0');  // 南高纬
    baseGrad.addColorStop(0.94, '#b8b29a');  // 南极边缘
    baseGrad.addColorStop(1.00, '#aeae9e');  // 南极：灰绿
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, w, h);

    // ── 条带：柔和对比，暖褐/暖灰色调 ──
    // 土星条带远没有木星夸张，全是低对比度渐变
    const bands = [
        // [yRatio, halfHeightRatio, color, maxAlpha]
        [0.06, 0.012, '#8a8272', 0.14],
        [0.10, 0.014, '#968e7a', 0.12],
        [0.15, 0.010, '#c8bea0', 0.08],
        [0.19, 0.018, '#7a6e5a', 0.18],  // 北中纬度暗带
        [0.24, 0.012, '#d8ccae', 0.10],
        [0.28, 0.022, '#6e6250', 0.22],  // 北温带明显暖褐带
        [0.33, 0.012, '#f0e4c8', 0.14],  // 北赤道亮纹
        [0.37, 0.008, '#faf2dc', 0.20],  // 赤道明亮
        [0.40, 0.006, '#fcf6e4', 0.22],  // 赤道最亮
        [0.44, 0.010, '#f4ead0', 0.14],
        [0.48, 0.020, '#786c5a', 0.20],  // 赤道南侧暗带
        [0.53, 0.014, '#8a7e6a', 0.16],
        [0.58, 0.018, '#6e6452', 0.20],  // 南温带暗带
        [0.63, 0.012, '#d0c4a6', 0.10],
        [0.68, 0.016, '#7a7060', 0.16],
        [0.73, 0.012, '#c0b69a', 0.08],
        [0.78, 0.014, '#8a8274', 0.14],
        [0.83, 0.018, '#7a7668', 0.16],
        [0.88, 0.012, '#9e9a8e', 0.10],
        [0.93, 0.010, '#aaac9e', 0.08],
    ];

    bands.forEach(([yRatio, halfH, color, alpha]) => {
        const y = (yRatio - halfH) * h;
        const bh = Math.max(2, halfH * 2 * h);
        const bandGrad = ctx.createLinearGradient(0, y, 0, y + bh);
        const r = parseInt(color.slice(1,3), 16);
        const g = parseInt(color.slice(3,5), 16);
        const b = parseInt(color.slice(5,7), 16);
        bandGrad.addColorStop(0,   `rgba(${r},${g},${b},0)`);
        bandGrad.addColorStop(0.15, `rgba(${r},${g},${b},${alpha * 0.6})`);
        bandGrad.addColorStop(0.40, `rgba(${r},${g},${b},${alpha})`);
        bandGrad.addColorStop(0.60, `rgba(${r},${g},${b},${alpha})`);
        bandGrad.addColorStop(0.85, `rgba(${r},${g},${b},${alpha * 0.6})`);
        bandGrad.addColorStop(1,   `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = bandGrad;
        ctx.fillRect(0, y, w, bh);
    });

    // ── 极地区域特殊处理 ──
    // 北极六边形涡旋（视觉暗示）
    const northPoleGrad = ctx.createRadialGradient(w/2, h*0.02, 5, w/2, h*0.02, h*0.10);
    northPoleGrad.addColorStop(0, 'rgba(120,128,132,0.25)');
    northPoleGrad.addColorStop(0.5, 'rgba(160,158,148,0.12)');
    northPoleGrad.addColorStop(1, 'rgba(160,158,148,0)');
    ctx.fillStyle = northPoleGrad;
    ctx.fillRect(0, 0, w, h*0.10);

    // 南极小暗斑
    const southPoleGrad = ctx.createRadialGradient(w/2, h*0.98, 3, w/2, h*0.98, h*0.08);
    southPoleGrad.addColorStop(0, 'rgba(100,104,108,0.30)');
    southPoleGrad.addColorStop(0.5, 'rgba(130,128,120,0.12)');
    southPoleGrad.addColorStop(1, 'rgba(130,128,120,0)');
    ctx.fillStyle = southPoleGrad;
    ctx.fillRect(0, h*0.90, w, h*0.10);

    // ── 赤道淡暖色微渐变（模拟大气雾状效果） ──
    const eqGrad = ctx.createLinearGradient(0, h*0.35, 0, h*0.65);
    eqGrad.addColorStop(0, 'rgba(245,235,210,0)');
    eqGrad.addColorStop(0.5, 'rgba(245,235,210,0.08)');
    eqGrad.addColorStop(1, 'rgba(245,235,210,0)');
    ctx.fillStyle = eqGrad;
    ctx.fillRect(0, h*0.35, w, h*0.30);

    // ── 微弱噪点（模拟大气湍流） ──
    for (let i = 0; i < 8000; i++) {
        const px = Math.random() * w;
        const py = Math.random() * h;
        const isLight = Math.random() > 0.5;
        ctx.fillStyle = isLight ? 'rgba(248,242,228,0.03)' : 'rgba(110,100,80,0.02)';
        ctx.fillRect(px, py, 1.5 + Math.random(), 1);
    }

    return new THREE.CanvasTexture(canvas);
}

export function generateSaturnRingTexture() {
    const w = 1024, h = 4;
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);

    // 色彩参考：高光 #E8E3DA / 中间层 #B8B2AA / 暗部 #6F6A67
    // 整体风格：NASA写实，降低纯白，加入暖灰+冰蓝灰层次

    function paintRing(xStart, xEnd, colorStops) {
        const grad = ctx.createLinearGradient(xStart * w, 0, xEnd * w, 0);
        colorStops.forEach(([pos, r, g, b, a]) => {
            grad.addColorStop(pos, `rgba(${r},${g},${b},${a})`);
        });
        ctx.fillStyle = grad;
        ctx.fillRect(xStart * w, 0, (xEnd - xStart) * w, h);
    }

    // C环：暗灰褐，冰尘混合，半透明
    paintRing(0.0, 0.22, [
        [0,    111, 106, 103, 0],
        [0.25, 130, 124, 118, 0.28],
        [0.55, 142, 136, 128, 0.36],
        [0.80, 135, 128, 122, 0.30],
        [1,    118, 113, 108, 0.18],
    ]);

    // B环：最亮主体，高光用米白#E8E3DA而非纯白，带暖灰渐变
    paintRing(0.22, 0.57, [
        [0,    168, 162, 155, 0.55],
        [0.08, 195, 190, 182, 0.72],
        [0.18, 215, 210, 202, 0.84],
        [0.30, 228, 223, 215, 0.91],
        [0.42, 232, 227, 218, 0.94],  // 高光：#E8E3DA 米白
        [0.50, 230, 225, 216, 0.95],
        [0.60, 226, 221, 213, 0.93],
        [0.72, 218, 212, 204, 0.88],
        [0.84, 205, 199, 191, 0.80],
        [1,    185, 179, 172, 0.65],
    ]);

    // 卡西尼缝：深暗，保留微弱冷灰透光
    paintRing(0.57, 0.62, [
        [0,   20, 19, 18, 0.35],
        [0.2, 12, 11, 10, 0.72],
        [0.5,  8,  7,  7, 0.85],
        [0.8, 12, 11, 10, 0.72],
        [1,   20, 19, 18, 0.35],
    ]);

    // A环内段：中间层 #B8B2AA，略带冰蓝灰
    paintRing(0.62, 0.75, [
        [0,   178, 172, 165, 0.70],
        [0.2, 190, 184, 176, 0.78],
        [0.5, 186, 180, 172, 0.74],
        [0.8, 178, 172, 164, 0.68],
        [1,   168, 162, 155, 0.60],
    ]);

    // 恩克缝
    paintRing(0.75, 0.785, [
        [0,   15, 14, 13, 0.20],
        [0.5, 10,  9,  9, 0.48],
        [1,   15, 14, 13, 0.20],
    ]);

    // A环外段：逐渐过渡到暗部 #6F6A67
    paintRing(0.785, 0.92, [
        [0,   168, 162, 155, 0.60],
        [0.3, 155, 149, 142, 0.50],
        [0.6, 138, 133, 127, 0.38],
        [0.85,115, 110, 105, 0.25],
        [1,   111, 106, 103, 0.12],
    ]);

    // F环：极细，冷灰
    paintRing(0.92, 1.0, [
        [0,   118, 113, 108, 0.10],
        [0.5, 105, 100,  96, 0.06],
        [1,     0,   0,   0, 0],
    ]);

    // 颗粒噪点层
    for (let i = 0; i < 2200; i++) {
        const t = Math.random();
        if (t > 0.57 && t < 0.62) continue;
        if (t > 0.22 && t < 0.92) {
            const px = t * w;
            const py = Math.random() * h;
            const bright = Math.random();
            if (bright > 0.6) {
                const a = 0.06 + Math.random() * 0.10;
                ctx.fillStyle = `rgba(235,230,220,${a})`;
            } else if (bright > 0.3) {
                const a = 0.04 + Math.random() * 0.08;
                ctx.fillStyle = `rgba(90,85,80,${a})`;
            } else {
                const a = 0.03 + Math.random() * 0.06;
                ctx.fillStyle = `rgba(175,178,185,${a})`;
            }
            ctx.fillRect(px, py, 1.2, 1);
        }
    }

    // 边缘雾化 — 很轻微，避免造成管道视觉
    const fogL = ctx.createLinearGradient(0.22 * w, 0, 0.245 * w, 0);
    fogL.addColorStop(0, 'rgba(0,0,0,0.10)');
    fogL.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = fogL;
    ctx.fillRect(0.22 * w, 0, 0.025 * w, h);

    const fogR = ctx.createLinearGradient(0.88 * w, 0, 0.92 * w, 0);
    fogR.addColorStop(0, 'rgba(0,0,0,0)');
    fogR.addColorStop(1, 'rgba(0,0,0,0.12)');
    ctx.fillStyle = fogR;
    ctx.fillRect(0.88 * w, 0, 0.04 * w, h);

    return new THREE.CanvasTexture(canvas);
}

