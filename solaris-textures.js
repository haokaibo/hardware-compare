import * as THREE from 'three';

export function generateSaturnBodyTexture() {
    const w = 1024, h = 512;
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');

    // 底色：更亮的暖奶油黄
    const baseGrad = ctx.createLinearGradient(0, 0, 0, h);
    baseGrad.addColorStop(0,   '#a08858');   // 北极偏暗
    baseGrad.addColorStop(0.1, '#dfc07e');
    baseGrad.addColorStop(0.2, '#f0d890');
    baseGrad.addColorStop(0.35,'#faeaaa');   // 赤道亮带
    baseGrad.addColorStop(0.5, '#f2dc96');
    baseGrad.addColorStop(0.65,'#faeaaa');
    baseGrad.addColorStop(0.8, '#eecf7e');
    baseGrad.addColorStop(0.9, '#d4a858');
    baseGrad.addColorStop(1,   '#a08040');   // 南极偏暗
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, w, h);

    // 横向条带：用水平渐变方式绘制，边缘用极小透明度羽化，不用逐像素偏移
    // [y比例, 高度比例, 颜色, 透明度]
    const bands = [
        [0.07, 0.014, '#7a5228', 0.45],
        [0.13, 0.022, '#a87840', 0.38],
        [0.18, 0.010, '#c09060', 0.28],
        [0.23, 0.026, '#9a6830', 0.42],
        [0.28, 0.016, '#d4a860', 0.25],
        [0.33, 0.036, '#8a5228', 0.50],  // 北赤道主带
        [0.385,0.013, '#e8c870', 0.35],  // 赤道亮带
        [0.42, 0.007, '#fff8d0', 0.55],  // 赤道白亮带
        [0.455,0.013, '#e8c870', 0.35],
        [0.50, 0.034, '#8a5228', 0.48],  // 南赤道主带
        [0.555,0.018, '#b88040', 0.32],
        [0.61, 0.022, '#9a6830', 0.38],
        [0.67, 0.013, '#c49858', 0.25],
        [0.73, 0.018, '#a07038', 0.35],
        [0.79, 0.010, '#7a5228', 0.42],
        [0.85, 0.016, '#9a6830', 0.32],
    ];

    bands.forEach(([yRatio, heightRatio, color, alpha]) => {
        const y = yRatio * h;
        const bh = Math.max(2, heightRatio * h);
        // 用垂直渐变羽化边缘，让条带平整但过渡自然
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

    // 细噪点增加颗粒感
    for (let i = 0; i < 8000; i++) {
        const px = Math.random() * w;
        const py = Math.random() * h;
        const bright = Math.random() > 0.5;
        ctx.fillStyle = bright ? 'rgba(255,245,190,0.05)' : 'rgba(90,50,10,0.04)';
        ctx.fillRect(px, py, 1.5, 1);
    }

    return new THREE.CanvasTexture(canvas);
}

export function generateSaturnRingTexture() {
    const w = 1024, h = 1;  // 1D纹理，径向
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');

    // 清空为全透明
    ctx.clearRect(0, 0, w, h);

    // 环的径向结构（x=0 对应内径，x=1 对应外径）
    // 真实比例近似：innerR=1.2, outerR=2.27（相对土星半径）
    // 对应像素：0→1023
    // C环: 0~0.22  B环: 0.22~0.57  卡西尼缝: 0.57~0.62  A环: 0.62~0.92  恩克缝: 0.75~0.77  外缘: 0.92~1.0

    function paintRing(xStart, xEnd, colorStops, noiseAmt) {
        const grad = ctx.createLinearGradient(xStart * w, 0, xEnd * w, 0);
        colorStops.forEach(([pos, r, g, b, a]) => {
            grad.addColorStop(pos, `rgba(${r},${g},${b},${a})`);
        });
        ctx.fillStyle = grad;
        ctx.fillRect(xStart * w, 0, (xEnd - xStart) * w, h);
    }

    // C环（内环，半透明，带棕灰色调）
    paintRing(0.0, 0.22, [
        [0, 100, 78, 50, 0],
        [0.3, 145, 115, 75, 0.38],
        [0.7, 165, 130, 85, 0.48],
        [1, 150, 118, 75, 0.30],
    ]);

    // B环（最亮最不透明，土星环的主体，奶白偏金）
    paintRing(0.22, 0.57, [
        [0, 210, 175, 115, 0.65],
        [0.15, 245, 210, 145, 0.90],
        [0.30, 255, 230, 165, 0.96],
        [0.45, 255, 240, 180, 0.98],
        [0.60, 252, 228, 168, 0.95],
        [0.75, 242, 215, 152, 0.92],
        [0.88, 230, 198, 138, 0.86],
        [1, 210, 175, 118, 0.75],
    ]);

    // 卡西尼缝（最明显的黑色间隙）
    paintRing(0.57, 0.62, [
        [0, 0, 0, 0, 0.55],
        [0.2, 8, 5, 3, 0.80],
        [0.5, 12, 8, 4, 0.90],
        [0.8, 8, 5, 3, 0.80],
        [1, 0, 0, 0, 0.55],
    ]);

    // A环（中亮，比B环略暗，更偏金黄）
    paintRing(0.62, 0.75, [
        [0, 225, 188, 122, 0.82],
        [0.3, 238, 202, 135, 0.88],
        [0.6, 228, 192, 125, 0.82],
        [1, 215, 178, 115, 0.75],
    ]);

    // 恩克缝（A环中的细暗缝）
    paintRing(0.75, 0.785, [
        [0, 15, 10, 5, 0.35],
        [0.5, 20, 14, 8, 0.60],
        [1, 15, 10, 5, 0.35],
    ]);

    // A环外半段
    paintRing(0.785, 0.92, [
        [0, 215, 178, 115, 0.75],
        [0.4, 202, 165, 105, 0.65],
        [0.8, 182, 148, 90, 0.50],
        [1, 155, 120, 70, 0.32],
    ]);

    // F环（外环，极细极暗，几乎透明）
    paintRing(0.92, 1.0, [
        [0, 140, 108, 65, 0.18],
        [0.5, 125, 95, 55, 0.10],
        [1, 0, 0, 0, 0],
    ]);

    return new THREE.CanvasTexture(canvas);
}
