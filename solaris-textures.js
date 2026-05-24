import * as THREE from 'three';

export function generateSaturnBodyTexture() {
    const w = 1024, h = 512;
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');

    // 底色：真实土星的淡黄色/米黄色底调，饱和度极低
    // 参考：NASA Cassini 真实色图，整体接近 #e8dfc0 ~ #d4c99a
    const baseGrad = ctx.createLinearGradient(0, 0, 0, h);
    baseGrad.addColorStop(0,    '#8fa0a8');  // 北极：微蓝灰色（氨冰+大气散射）
    baseGrad.addColorStop(0.08, '#b0aaa0');  // 北极过渡：灰米色
    baseGrad.addColorStop(0.18, '#cec5a8');  // 北温带：浅灰黄
    baseGrad.addColorStop(0.30, '#ddd3b0');  // 北赤道带：淡米黄
    baseGrad.addColorStop(0.42, '#e8dfc0');  // 赤道：最亮的淡黄白
    baseGrad.addColorStop(0.50, '#e2d8b8');  // 赤道中心
    baseGrad.addColorStop(0.58, '#e8dfc0');  // 赤道对称
    baseGrad.addColorStop(0.70, '#d8cfa8');  // 南赤道带
    baseGrad.addColorStop(0.82, '#c8c0a0');  // 南温带
    baseGrad.addColorStop(0.92, '#aaa498');  // 南极过渡
    baseGrad.addColorStop(1,    '#909898');  // 南极：灰蓝色
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, w, h);

    // 条带：颜色对比度极低，都是灰黄/灰褐的细微渐变
    // 土星条带远没有木星明显，alpha 值普遍偏低
    const bands = [
        [0.09,  0.012, '#786858', 0.18],
        [0.14,  0.018, '#8a7c6a', 0.15],
        [0.19,  0.010, '#a09080', 0.12],
        [0.24,  0.022, '#7a6e5e', 0.20],
        [0.29,  0.014, '#c0b898', 0.10],
        [0.34,  0.028, '#7e7260', 0.22],  // 北赤道带，最明显但仍然淡
        [0.39,  0.010, '#efe8d0', 0.18],  // 赤道亮纹
        [0.43,  0.006, '#f8f4e8', 0.25],  // 赤道白纹（氨冰）
        [0.46,  0.010, '#efe8d0', 0.18],
        [0.51,  0.026, '#7e7260', 0.20],  // 南赤道带
        [0.57,  0.014, '#968e78', 0.14],
        [0.62,  0.018, '#7a7060', 0.17],
        [0.68,  0.012, '#b0a890', 0.10],
        [0.74,  0.016, '#888078', 0.15],
        [0.80,  0.010, '#706860', 0.18],
        [0.86,  0.012, '#808890', 0.14],  // 南极附近轻微蓝灰
    ];

    bands.forEach(([yRatio, heightRatio, color, alpha]) => {
        const y = yRatio * h;
        const bh = Math.max(2, heightRatio * h);
        const bandGrad = ctx.createLinearGradient(0, y, 0, y + bh);
        const [r, g, b] = color.match(/[\da-f]{2}/gi).map(x => parseInt(x, 16));
        bandGrad.addColorStop(0,   `rgba(${r},${g},${b},0)`);
        bandGrad.addColorStop(0.2, `rgba(${r},${g},${b},${alpha})`);
        bandGrad.addColorStop(0.8, `rgba(${r},${g},${b},${alpha})`);
        bandGrad.addColorStop(1,   `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = bandGrad;
        ctx.fillRect(0, y, w, bh);
    });
    ctx.globalAlpha = 1;

    // 细噪点：更轻，颜色接近底色
    for (let i = 0; i < 6000; i++) {
        const px = Math.random() * w;
        const py = Math.random() * h;
        const bright = Math.random() > 0.5;
        ctx.fillStyle = bright ? 'rgba(240,235,215,0.04)' : 'rgba(100,90,70,0.03)';
        ctx.fillRect(px, py, 1.5, 1);
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

    // 边缘雾化
    const fogL = ctx.createLinearGradient(0.22 * w, 0, 0.245 * w, 0);
    fogL.addColorStop(0, 'rgba(0,0,0,0.22)');
    fogL.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = fogL;
    ctx.fillRect(0.22 * w, 0, 0.025 * w, h);

    const fogR = ctx.createLinearGradient(0.88 * w, 0, 0.92 * w, 0);
    fogR.addColorStop(0, 'rgba(0,0,0,0)');
    fogR.addColorStop(1, 'rgba(0,0,0,0.30)');
    ctx.fillStyle = fogR;
    ctx.fillRect(0.88 * w, 0, 0.04 * w, h);

    return new THREE.CanvasTexture(canvas);
}

