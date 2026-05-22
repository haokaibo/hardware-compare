import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import TWEEN from 'https://unpkg.com/@tweenjs/tween.js@23.1.1/dist/tween.esm.js';

// =====================================================
// 土星本体纹理 —— canvas 程序生成
// 参考真实土星：奶油黄底色 + 多条褐/棕横带 + 极区略暗
// =====================================================
function generateSaturnBodyTexture() {
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

// =====================================================
// 土星环纹理 —— canvas 程序生成
// 真实土星环结构：C环（内，半透明暗）→ B环（最亮最厚）→ 卡西尼缝（黑色间隙）→ A环（中亮）→ 恩克缝（细暗缝）→ 外A环
// =====================================================
function generateSaturnRingTexture() {
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

// =====================================================
// 土星环几何体 —— 多层叠加，增加真实感
// =====================================================
function createRealisticSaturnRing(planetRadius) {
    const group = new THREE.Group();

    const innerR = planetRadius * 1.22;
    const outerR = planetRadius * 2.28;

    // 主环几何
    const ringGeo = new THREE.RingGeometry(innerR, outerR, 256, 4);

    // 修正 UV：RingGeometry 默认 UV 不是径向的，手动修正
    const pos = ringGeo.attributes.position;
    const uv  = ringGeo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i);
        const r = Math.sqrt(x * x + y * y);
        const u = (r - innerR) / (outerR - innerR);
        uv.setXY(i, u, 0.5);
    }
    uv.needsUpdate = true;

    const ringTex = generateSaturnRingTexture();
    ringTex.wrapS = THREE.ClampToEdgeWrapping;
    ringTex.wrapT = THREE.ClampToEdgeWrapping;

    const ringMat = new THREE.MeshStandardMaterial({
        map: ringTex,
        alphaMap: ringTex,          // 用同一张纹理的 alpha 控制透明
        transparent: true,
        opacity: 1.0,
        side: THREE.DoubleSide,
        depthWrite: false,
        roughness: 0.85,
        metalness: 0.05,
        emissive: new THREE.Color(0x221a0a),
        emissiveIntensity: 0.04,    // 极低自发光，不发光圆盘
    });

    const ring = new THREE.Mesh(ringGeo, ringMat);
    // 土星环真实倾角约 26.7°
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    // 背面再加一层轻微阴影环，增加立体感
    const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x110c04,
        transparent: true,
        opacity: 0.12,
        side: THREE.FrontSide,
        depthWrite: false,
    });
    const shadowRing = new THREE.Mesh(
        new THREE.RingGeometry(innerR * 0.98, outerR * 1.01, 128),
        shadowMat
    );
    shadowRing.rotation.x = Math.PI / 2;
    shadowRing.position.y = -0.01;
    group.add(shadowRing);

    return group;
}

// --- 初始化场景 ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x010118);
scene.fog = new THREE.FogExp2(0x010118, 0.0002);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 12, 30);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.left = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.8;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.enableZoom = true;
controls.enablePan = true;
controls.target.set(0, 0, 0);
controls.maxDistance = 65;
controls.minDistance = 3;

// --- 光照系统 ---
const ambientLight = new THREE.AmbientLight(0x222222, 0.12);
scene.add(ambientLight);
const sunLight = new THREE.PointLight(0xffaa66, 3.5, 70);
sunLight.position.set(0, 0, 0);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024;
sunLight.shadow.mapSize.height = 1024;
sunLight.shadow.bias = -0.0001;
scene.add(sunLight);

// 星空粒子
const starGeo = new THREE.BufferGeometry();
const starPos = [];
for (let i = 0; i < 4000; i++) starPos.push((Math.random() - 0.5) * 600, (Math.random() - 0.5) * 400, (Math.random() - 0.5) * 300);
starGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(starPos), 3));
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.2, transparent: true, opacity: 0.7 }));
scene.add(stars);
const starGeo2 = new THREE.BufferGeometry();
const starPos2 = [];
for (let i = 0; i < 5000; i++) starPos2.push((Math.random() - 0.5) * 800, (Math.random() - 0.5) * 500, (Math.random() - 0.5) * 400);
starGeo2.setAttribute('position', new THREE.BufferAttribute(new Float32Array(starPos2), 3));
const stars2 = new THREE.Points(starGeo2, new THREE.PointsMaterial({ color: 0xaaccff, size: 0.1, transparent: true, opacity: 0.5 }));
scene.add(stars2);

const loadingTip = document.getElementById('loadingTip');
let loadedCount = 0;
const totalTextures = 18;
const texLoader = new THREE.TextureLoader();
function textureLoaded() { 
    loadedCount++; 
    if (loadedCount >= totalTextures - 4) { 
        loadingTip.style.opacity = '0'; 
        setTimeout(() => loadingTip.style.display = 'none', 500); 
    } 
}
texLoader.crossOrigin = "Anonymous";

const sunTextureUrl = 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Solarsystemscope_texture_2k_sun.jpg';
const earthMap = 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/earthmap1k.jpg';
const earthNormal = 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/earthbump1k.jpg';
const moonMap = 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/moonmap1k.jpg';

const cdnTextures = {
  mercury: { map: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/mercurymap.jpg', normal: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/mercurybump.jpg' },
  venus:   { map: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/venusmap.jpg',   normal: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/venusbump.jpg' },
  mars:    { map: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/marsmap1k.jpg',  normal: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/marsbump1k.jpg' },
  jupiter: { map: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/jupitermap.jpg', normal: null },
  uranus:  { map: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/uranusmap.jpg',  normal: null },
  neptune: { map: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/neptunemap.jpg', normal: null }
};

function loadCdnMaterial(mapUrl, normalUrl, color, roughness=0.6, metalness=0.1, emissive=0x000000, emissiveIntensity=0) {
    const material = new THREE.MeshStandardMaterial({ color, roughness, metalness, emissive, emissiveIntensity });
    if (mapUrl) texLoader.load(mapUrl, (t) => { material.map = t; material.needsUpdate = true; textureLoaded(); }, undefined, () => textureLoaded());
    else textureLoaded();
    if (normalUrl) texLoader.load(normalUrl, (t) => { material.normalMap = t; material.needsUpdate = true; textureLoaded(); }, undefined, () => textureLoaded());
    else textureLoaded();
    return material;
}
function loadEarthMaterial() {
    const material = new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0.1, emissive: 0x001133, emissiveIntensity: 0.002 });
    texLoader.load(earthMap, (t) => { material.map = t; material.needsUpdate = true; textureLoaded(); });
    texLoader.load(earthNormal, (t) => { material.normalMap = t; material.needsUpdate = true; textureLoaded(); });
    return material;
}
function loadMoonMaterial() {
    const material = new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0.05, emissive: 0x111122, emissiveIntensity: 0.01 });
    texLoader.load(moonMap, (t) => { material.map = t; material.needsUpdate = true; textureLoaded(); });
    return material;
}

// 土星本体材质 —— 使用 canvas 生成纹理
function loadSaturnMaterial() {
    const saturnTex = generateSaturnBodyTexture();
    const material = new THREE.MeshStandardMaterial({
        map: saturnTex,
        roughness: 0.70,
        metalness: 0.05,
        emissive: new THREE.Color(0x1a0f00),
        emissiveIntensity: 0.03,   // 极低，不自发光
    });
    textureLoaded();
    return material;
}

const planets = [];
let earthMesh = null;
const switchableObjects = [];
const labelItems = [];

// --- 太阳 ---
const sunGeometry = new THREE.SphereGeometry(2.4, 128, 128);
const sunTexture = texLoader.load(sunTextureUrl, () => { textureLoaded(); });
const sunMat = new THREE.MeshStandardMaterial({
    map: sunTexture,
    color: 0xffaa66,
    emissive: 0xff6633,
    emissiveMap: sunTexture,
    emissiveIntensity: 0.9,
    metalness: 0.1,
    roughness: 0.4,
    toneMapped: false
});
const sunMesh = new THREE.Mesh(sunGeometry, sunMat);
sunMesh.castShadow = false;
scene.add(sunMesh);
const sunGlowMat = new THREE.MeshBasicMaterial({ color: 0xff8844, transparent: true, opacity: 0.2, side: THREE.BackSide });
const sunGlow = new THREE.Mesh(new THREE.SphereGeometry(2.68, 32, 32), sunGlowMat);
scene.add(sunGlow);

const sunDiv = document.createElement('div');
sunDiv.textContent = '太阳';
sunDiv.style.cssText = `color:#ffeecc;font-size:16px;font-weight:bold;background:rgba(80,30,0,0.6);padding:4px 12px;border-radius:24px;border:1px solid #ffaa44;backdrop-filter:blur(4px);pointer-events:none;transition:opacity 0.2s`;
const sunLabel = new CSS2DObject(sunDiv);
sunLabel.position.set(0, 3.2, 0);
sunMesh.add(sunLabel);
labelItems.push({ nameZh: '太阳', css2d: sunLabel, dom: sunDiv });
const sunRealData = { name: '太阳', realRadius: 696340, realDistance: 0, realPeriod: 0 };

// 行星数据
const planetsData = [
    { name: '水星', radius: 0.28, distance: 4.2,  speed: 0.0056, color: 0xbc9a6c, useCdn: true,  cdnKey: 'mercury', roughness: 0.7, metalness: 0.15, emissive: 0x000000, emissiveIntensity: 0,    inclination: (Math.random()-0.5)*0.08, realRadius: 2440,  realDistance: 57.9,  realPeriod: 88 },
    { name: '金星', radius: 0.32, distance: 5.8,  speed: 0.0040, color: 0xe6b800, useCdn: true,  cdnKey: 'venus',   roughness: 0.6, metalness: 0.1,  emissive: 0x331100, emissiveIntensity: 0.01, inclination: (Math.random()-0.5)*0.08, realRadius: 6052,  realDistance: 108.2, realPeriod: 225 },
    { name: '地球', radius: 0.36, distance: 7.5,  speed: 0.0034, color: 0x3a86ff, useCdn: false,                   roughness: 0.5, metalness: 0.1,  emissive: 0x001133, emissiveIntensity: 0.002,inclination: (Math.random()-0.5)*0.08, realRadius: 6371,  realDistance: 149.6, realPeriod: 365 },
    { name: '火星', radius: 0.34, distance: 9.3,  speed: 0.0028, color: 0xc45c2c, useCdn: true,  cdnKey: 'mars',    roughness: 0.4, metalness: 0.2,  emissive: 0x441100, emissiveIntensity: 0.03, inclination: (Math.random()-0.5)*0.08, realRadius: 3390,  realDistance: 227.9, realPeriod: 687 },
    { name: '木星', radius: 1.2,  distance: 12.8, speed: 0.0016, color: 0xd8a27a, useCdn: true,  cdnKey: 'jupiter', roughness: 0.5, metalness: 0.35, emissive: 0x221100, emissiveIntensity: 0.01, inclination: (Math.random()-0.5)*0.06, realRadius: 69911, realDistance: 778.5, realPeriod: 4333 },
    { name: '土星', radius: 1.1,  distance: 15.5, speed: 0.0012, color: 0xf0d9b0, useCdn: false, customMaterial: true, customLoader: loadSaturnMaterial, hasRing: true,                             inclination: (Math.random()-0.5)*0.06, realRadius: 58232, realDistance: 1434,  realPeriod: 10759 },
    { name: '天王星',radius: 0.8,  distance: 18.5, speed: 0.0009, color: 0xb0e0e6, useCdn: true,  cdnKey: 'uranus',  roughness: 0.5, metalness: 0.2,  emissive: 0x004455, emissiveIntensity: 0.01, inclination: (Math.random()-0.5)*0.06, realRadius: 25362, realDistance: 2872,  realPeriod: 30687 },
    { name: '海王星',radius: 0.78, distance: 21.8, speed: 0.00072,color: 0x4a7db4, useCdn: true,  cdnKey: 'neptune', roughness: 0.5, metalness: 0.2,  emissive: 0x002244, emissiveIntensity: 0.01, inclination: (Math.random()-0.5)*0.06, realRadius: 24622, realDistance: 4495,  realPeriod: 60190 }
];


function getRotatedPosition(distance, angle, inclination) {
    const x0 = Math.cos(angle) * distance;
    const z0 = Math.sin(angle) * distance;
    const y0 = 0;
    const cos = Math.cos(inclination), sin = Math.sin(inclination);
    return new THREE.Vector3(x0, y0 * cos - z0 * sin, y0 * sin + z0 * cos);
}

function createOrbitWithInclination(radius, inclination, color = 0x88aaff) {
    const points = [];
    for (let i = 0; i <= 200; i++) {
        const angle = (i / 200) * Math.PI * 2;
        points.push(getRotatedPosition(radius, angle, inclination));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    scene.add(new THREE.LineLoop(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.35 })));
}

planetsData.forEach((data, idx) => {
    createOrbitWithInclination(data.distance, data.inclination, idx % 2 === 0 ? 0x77aaff : 0x88bbff);
    
    let material;
    if (data.customMaterial && data.customLoader) {
        material = data.customLoader();
    } else if (data.useCdn) {
        const cdn = cdnTextures[data.cdnKey];
        material = loadCdnMaterial(cdn.map, cdn.normal, data.color, data.roughness, data.metalness, data.emissive, data.emissiveIntensity);
    } else {
        material = loadEarthMaterial();
    }
    
    const planetMesh = new THREE.Mesh(new THREE.SphereGeometry(data.radius, 128, 128), material);
    planetMesh.castShadow = true;
    planetMesh.userData = { speed: data.speed, angle: Math.random() * Math.PI * 2, inclination: data.inclination, realData: data };

    if (data.hasRing) {
        const ringGroup = createRealisticSaturnRing(data.radius);
        // 土星环随行星倾角微调（真实倾角约26.7°已在几何体设定）
        planetMesh.add(ringGroup);
        planetMesh.userData.ringGroup = ringGroup;
    }
    if (data.name === '火星') {
        const atmos = new THREE.Mesh(new THREE.SphereGeometry(data.radius + 0.04, 64, 64), new THREE.MeshPhongMaterial({ color: 0xcc6644, transparent: true, opacity: 0.05, side: THREE.BackSide }));
        planetMesh.add(atmos);
    }
    scene.add(planetMesh);
    
    const div = document.createElement('div');
    div.textContent = data.name;
    div.style.cssText = `color:#f0f0f0;font-size:13px;font-weight:500;background:rgba(20,20,40,0.7);padding:2px 10px;border-radius:20px;border:1px solid ${new THREE.Color(data.color).getStyle()};backdrop-filter:blur(4px);pointer-events:none;transition:opacity 0.2s`;
    const label = new CSS2DObject(div);
    label.position.set(0, data.radius + 0.3, 0);
    planetMesh.add(label);
    labelItems.push({ nameZh: data.name, css2d: label, dom: div });
    
    planets.push({ mesh: planetMesh, distance: data.distance, baseSpeed: data.speed, angle: planetMesh.userData.angle, inclination: data.inclination, name: data.name, hasRing: data.hasRing, ringGroup: planetMesh.userData.ringGroup, label, realData: data });
    if (data.name === '地球') earthMesh = planetMesh;
    switchableObjects.push({ nameZh: data.name, mesh: planetMesh, type: 'planet', extra: null, label });
});

// 月球
const moonMaterial = loadMoonMaterial();
const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(0.11, 128, 128), moonMaterial);
moonMesh.castShadow = true;
scene.add(moonMesh);
const moonDiv = document.createElement('div');
moonDiv.textContent = '月球';
moonDiv.style.cssText = 'color:#ddddff;font-size:12px;background:rgba(0,0,0,0.6);padding:2px 8px;border-radius:16px;border:1px solid #aaaaff';
const moonLabel = new CSS2DObject(moonDiv);
moonLabel.position.set(0, 0.18, 0);
moonMesh.add(moonLabel);
labelItems.push({ nameZh: '月球', css2d: moonLabel, dom: moonDiv });
switchableObjects.push({ nameZh: '月球', mesh: moonMesh, type: 'moon', extra: null, label: moonLabel });
let moonAngle = Math.random() * Math.PI * 2;
const moonDistance = 1.15, moonBaseSpeed = 0.017;
const moonRealData = { name: '月球', realRadius: 1737, realDistance: 0.384, realPeriod: 27.3 };

switchableObjects.push({ nameZh: '太阳', mesh: sunMesh, type: 'sun', extra: { glow: sunGlow }, label: sunLabel });

// 小行星带
const asteroidGeo = new THREE.BufferGeometry();
const asteroidPos = [];
for (let i=0; i<3000; i++) { const r = 10.8 + Math.random()*1.5, a = Math.random()*Math.PI*2; asteroidPos.push(Math.cos(a)*r, (Math.random()-0.5)*0.6, Math.sin(a)*r); }
asteroidGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(asteroidPos), 3));
const asteroidField = new THREE.Points(asteroidGeo, new THREE.PointsMaterial({ color: 0xaa9977, size: 0.045 }));
scene.add(asteroidField);
const dustGeo = new THREE.BufferGeometry();
const dustPos = [];
for (let i=0; i<2500; i++) dustPos.push((Math.random()-0.5)*90, (Math.random()-0.5)*50, (Math.random()-0.5)*120);
dustGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(dustPos), 3));
scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x88aadd, size: 0.03, transparent: true, opacity: 0.25 })));

// ========== 自动巡游 ==========
const tourTargets = [
    { name: '太阳', obj: sunMesh, offset: new THREE.Vector3(0, 3, 8) },
    ...planets.map(p => ({ name: p.name, obj: p.mesh, offset: new THREE.Vector3(0, 1.5, p.name === '土星' ? 8 : 5) })),
    { name: '月球', obj: moonMesh, offset: new THREE.Vector3(0, 0.8, 3) }
];
let tourActive = true, tourIndex = 0, tourTimer = null, followFrameId = null;

function startTour() {
    if (tourTimer) clearTimeout(tourTimer);
    if (followFrameId) cancelAnimationFrame(followFrameId);
    tourActive = true;
    const t = translations[currentLang];
    document.getElementById('auto-tour-btn').textContent = t.tourStop;
    document.getElementById('auto-tour-btn').style.background = 'rgba(80,100,130,0.9)';
    nextTourTargetSmooth();
}
function stopTour() {
    tourActive = false;
    if (tourTimer) clearTimeout(tourTimer);
    if (followFrameId) cancelAnimationFrame(followFrameId);
    followFrameId = null;
    const t = translations[currentLang];
    document.getElementById('auto-tour-btn').textContent = t.tourStart;
    document.getElementById('auto-tour-btn').style.background = 'rgba(30,50,80,0.9)';
}
function nextTourTargetSmooth() {
    if (!tourActive) return;
    if (tourIndex >= tourTargets.length) tourIndex = 0;
    const target = tourTargets[tourIndex];
    if (!target.obj.visible) { tourIndex++; nextTourTargetSmooth(); return; }
    const startTime = performance.now();
    const startCameraPos = camera.position.clone(), startTargetPos = controls.target.clone();
    const endCameraPos = target.obj.position.clone().add(target.offset), endTargetPos = target.obj.position.clone();
    const duration = 1500;
    function updateCamera(timestamp) {
        if (!tourActive) return;
        const elapsed = timestamp - startTime;
        const progress = Math.min(1, elapsed / duration);
        const ease = progress < 0.5 ? 2*progress*progress : 1 - Math.pow(-2*progress+2,2)/2;
        camera.position.lerpVectors(startCameraPos, endCameraPos, ease);
        controls.target.lerpVectors(startTargetPos, endTargetPos, ease);
        if (progress < 1) requestAnimationFrame(updateCamera);
        else {
            startFollowing(target.obj, target.offset);
            tourTimer = setTimeout(() => { stopFollowing(); tourIndex++; nextTourTargetSmooth(); }, 10000);
        }
    }
    requestAnimationFrame(updateCamera);
}
let currentFollowTarget = null, currentOffset = null;
function startFollowing(obj, offset) {
    currentFollowTarget = obj; currentOffset = offset;
    function follow() {
        if (!tourActive || !currentFollowTarget) { followFrameId = null; return; }
        camera.position.lerp(currentFollowTarget.position.clone().add(currentOffset), 0.05);
        controls.target.lerp(currentFollowTarget.position, 0.05);
        followFrameId = requestAnimationFrame(follow);
    }
    if (followFrameId) cancelAnimationFrame(followFrameId);
    followFrameId = requestAnimationFrame(follow);
}
function stopFollowing() { if (followFrameId) cancelAnimationFrame(followFrameId); followFrameId = null; currentFollowTarget = null; currentOffset = null; }
document.getElementById('auto-tour-btn').addEventListener('click', () => { if (tourActive) stopTour(); else startTour(); });

// ========== 交互 ==========
const raycasterClick = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let currentTrackedPlanet = null, isTracking = false, currentInfoPlanetZh = null;
const infoPanel = document.getElementById('infoPanel');
const infoName = document.getElementById('infoName');
const radiusLabelSpan = document.getElementById('radiusLabel'), distanceLabelSpan = document.getElementById('distanceLabel'), periodLabelSpan = document.getElementById('periodLabel');
const radiusValueSpan = document.getElementById('radiusValue'), distanceValueSpan = document.getElementById('distanceValue'), periodValueSpan = document.getElementById('periodValue');
const radiusUnitSpan = document.getElementById('radiusUnit'), distanceUnitSpan = document.getElementById('distanceUnit'), periodUnitSpan = document.getElementById('periodUnit');
const resetViewBtn = document.getElementById('resetViewBtn'), closeInfoBtn = document.getElementById('closeInfoBtn');

function showPlanetInfo(planetNameZh, realData) {
    currentInfoPlanetZh = planetNameZh;
    radiusValueSpan.textContent = realData.realRadius.toLocaleString();
    distanceValueSpan.textContent = realData.realDistance.toLocaleString();
    periodValueSpan.textContent = realData.realPeriod.toLocaleString();
    infoPanel.style.display = 'block';
    updateInfoPanelLanguage();
}
function hideInfoPanel() { currentInfoPlanetZh = null; infoPanel.style.display = 'none'; }
function updateInfoPanelLanguage() {
    const t = translations[currentLang];
    radiusLabelSpan.textContent = t.radiusLabel; distanceLabelSpan.textContent = t.distanceLabel; periodLabelSpan.textContent = t.periodLabel;
    radiusUnitSpan.textContent = t.radiusUnit; distanceUnitSpan.textContent = t.distanceUnit; periodUnitSpan.textContent = t.periodUnit;
    resetViewBtn.textContent = t.resetViewLabel;
    if (currentInfoPlanetZh && infoPanel.style.display === 'block') infoName.textContent = translations[currentLang].names[currentInfoPlanetZh] || currentInfoPlanetZh;
}
function startTracking(planetMesh) {
    if (tourActive) stopTour();
    currentTrackedPlanet = planetMesh; isTracking = true;
    const startPos = camera.position.clone(), startTarget = controls.target.clone();
    const offset = new THREE.Vector3(0, 2, 5);
    new TWEEN.Tween(startPos).to(planetMesh.position.clone().add(offset), 600).easing(TWEEN.Easing.Quadratic.InOut).onUpdate(() => camera.position.copy(startPos)).start();
    new TWEEN.Tween(startTarget).to(planetMesh.position.clone(), 600).easing(TWEEN.Easing.Quadratic.InOut).onUpdate(() => controls.target.copy(startTarget)).start();
    if (planetMesh.material && planetMesh !== sunMesh) planetMesh.material.emissiveIntensity = 0.15;
}
function stopTracking() {
    if (!isTracking) return;
    if (currentTrackedPlanet && currentTrackedPlanet.material && currentTrackedPlanet !== sunMesh) currentTrackedPlanet.material.emissiveIntensity = 0.03;
    currentTrackedPlanet = null; isTracking = false;
    const startPos = camera.position.clone(), startTarget = controls.target.clone();
    new TWEEN.Tween(startPos).to(new THREE.Vector3(0,12,30), 600).easing(TWEEN.Easing.Quadratic.InOut).onUpdate(() => camera.position.copy(startPos)).start();
    new TWEEN.Tween(startTarget).to(new THREE.Vector3(0,0,0), 600).easing(TWEEN.Easing.Quadratic.InOut).onUpdate(() => controls.target.copy(startTarget)).start();
}
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    raycasterClick.setFromCamera(mouse, camera);
    const clickableObjects = planets.map(p => p.mesh);
    clickableObjects.push(moonMesh);
    clickableObjects.push(sunMesh);
    const intersects = raycasterClick.intersectObjects(clickableObjects);
    if (intersects.length > 0) {
        const hit = intersects[0].object;
        let planetNameZh = '', realData = null;
        if (hit === moonMesh) { planetNameZh = '月球'; realData = moonRealData; }
        else if (hit === sunMesh) { planetNameZh = '太阳'; realData = sunRealData; }
        else { const planetObj = planets.find(p => p.mesh === hit); if (planetObj) { planetNameZh = planetObj.name; realData = planetObj.realData; } }
        if (planetNameZh) { showPlanetInfo(planetNameZh, realData); startTracking(hit); }
    }
});
resetViewBtn.addEventListener('click', () => { stopTracking(); hideInfoPanel(); if (!tourActive) startTour(); });
closeInfoBtn.addEventListener('click', () => hideInfoPanel());

const raycasterOcc = new THREE.Raycaster();
function updateLabelsOcclusion() {
    const cameraPos = camera.position;
    planets.forEach(planet => {
        const dir = new THREE.Vector3().subVectors(planet.mesh.position, cameraPos).normalize();
        raycasterOcc.set(cameraPos, dir);
        const intersects = raycasterOcc.intersectObject(sunMesh);
        let occluded = false;
        if (intersects.length > 0) { const d = cameraPos.distanceTo(planet.mesh.position); if (cameraPos.distanceTo(intersects[0].point) < d - 0.5) occluded = true; }
        if (planet.label) planet.label.element.style.opacity = occluded ? '0' : '1';
    });
    const moonDir = new THREE.Vector3().subVectors(moonMesh.position, cameraPos).normalize();
    raycasterOcc.set(cameraPos, moonDir);
    const moonIntersects = raycasterOcc.intersectObject(sunMesh);
    let moonOccluded = false;
    if (moonIntersects.length > 0) { const d = cameraPos.distanceTo(moonMesh.position); if (cameraPos.distanceTo(moonIntersects[0].point) < d - 0.5) moonOccluded = true; }
    moonLabel.element.style.opacity = moonOccluded ? '0' : '1';
}

let orbitSpeedFactor = 1.0, rotationSpeedFactor = 1.0;
const orbitSlider = document.getElementById('orbitSpeedSlider'), orbitValue = document.getElementById('orbitSpeedValue');
const rotationSlider = document.getElementById('rotationSpeedSlider'), rotationValue = document.getElementById('rotationSpeedValue');
orbitSlider.addEventListener('input', (e) => { orbitSpeedFactor = parseFloat(e.target.value); orbitValue.textContent = orbitSpeedFactor.toFixed(2)+' x'; });
rotationSlider.addEventListener('input', (e) => { rotationSpeedFactor = parseFloat(e.target.value); rotationValue.textContent = rotationSpeedFactor.toFixed(2)+' x'; });

let currentLang = 'zh', labelsVisible = true;
const translations = {
    zh: { names:{'太阳':'太阳','水星':'水星','金星':'金星','地球':'地球','火星':'火星','木星':'木星','土星':'土星','天王星':'天王星','海王星':'海王星','月球':'月球'}, title:'🌌 3D 太阳系', subtitle:'⚡ 双速度调节 | 平滑巡游 | 土星真实纹理', footer:'✨ 点击行星追踪/信息 | 自动巡游默认开启', miniHint:'🪐 平滑巡游(10秒/行星) | 点击可中断', hide:'🏷️ 隐藏名称', show:'🏷️ 显示名称', lang:'EN', orbitLabel:'🚀 公转速度倍率', rotLabel:'🔄 自转速度倍率', radiusLabel:'🌍 半径', distanceLabel:'📡 距日距离', periodLabel:'⏱️ 公转周期', radiusUnit:'km', distanceUnit:'百万 km', periodUnit:'地球日', tourStop:'🔁 停止巡游', tourStart:'🔁 开始巡游', resetViewLabel:'🎥 重置全局视角' },
    en: { names:{'太阳':'Sun','水星':'Mercury','金星':'Venus','地球':'Earth','火星':'Mars','木星':'Jupiter','土星':'Saturn','天王星':'Uranus','海王星':'Neptune','月球':'Moon'}, title:'🌌 3D Solar System', subtitle:'⚡ Dual Speed | Smooth Tour | Realistic Saturn', footer:'✨ Click planet to track/info | Auto tour default ON', miniHint:'🪐 Smooth Tour (10s/planet) | Click to interrupt', hide:'🏷️ Hide Labels', show:'🏷️ Show Labels', lang:'中文', orbitLabel:'🚀 Orbit Speed Multiplier', rotLabel:'🔄 Rotation Speed Multiplier', radiusLabel:'🌍 Radius', distanceLabel:'📡 Distance from Sun', periodLabel:'⏱️ Orbital Period', radiusUnit:'km', distanceUnit:'million km', periodUnit:'Earth days', tourStop:'🔁 Stop Tour', tourStart:'🔁 Start Tour', resetViewLabel:'🎥 Reset View' }
};
function updateLang() {
    const t = translations[currentLang];
    labelItems.forEach(item => { item.dom.textContent = t.names[item.nameZh]; });
    document.getElementById('panel-title').textContent = t.title;
    document.getElementById('panel-subtitle').textContent = t.subtitle;
    document.getElementById('panel-footer').textContent = t.footer;
    document.querySelector('.mini-hint').textContent = t.miniHint;
    document.getElementById('toggle-labels-btn').textContent = labelsVisible ? t.hide : t.show;
    document.getElementById('lang-switch-btn').textContent = t.lang;
    document.getElementById('orbit-speed-label').textContent = t.orbitLabel;
    document.getElementById('rotation-speed-label').textContent = t.rotLabel;
    document.getElementById('auto-tour-btn').textContent = tourActive ? t.tourStop : t.tourStart;
    resetViewBtn.textContent = t.resetViewLabel;
    const btns = document.querySelectorAll('.planet-btn');
    const order = ['太阳','水星','金星','地球','火星','木星','土星','天王星','海王星','月球'];
    btns.forEach((btn,i) => { btn.textContent = t.names[order[i]]; });
    updateInfoPanelLanguage();
}
document.getElementById('toggle-labels-btn').addEventListener('click', () => {
    labelsVisible = !labelsVisible;
    labelItems.forEach(item => item.css2d.visible = labelsVisible);
    document.getElementById('toggle-labels-btn').textContent = labelsVisible ? translations[currentLang].hide : translations[currentLang].show;
});
document.getElementById('lang-switch-btn').addEventListener('click', () => { currentLang = currentLang === 'zh' ? 'en' : 'zh'; updateLang(); });
updateLang();

const grid = document.getElementById('planet-grid');
const orderList = ['太阳','水星','金星','地球','火星','木星','土星','天王星','海王星','月球'];
orderList.forEach(name => {
    const obj = switchableObjects.find(o => o.nameZh === name);
    if (!obj) return;
    const btn = document.createElement('button');
    btn.className = 'planet-btn visible';
    btn.textContent = name;
    const label = labelItems.find(l => l.nameZh === name)?.css2d || null;
    const setVisible = (vis) => {
        obj.mesh.visible = vis;
        if (label) label.visible = vis;
        if (obj.type === 'sun' && obj.extra) obj.extra.glow.visible = vis;
        btn.classList.toggle('visible', vis);
        btn.classList.toggle('hidden', !vis);
        if (tourActive && !vis && tourTargets[tourIndex] && tourTargets[tourIndex].obj === obj.mesh) { if (tourTimer) clearTimeout(tourTimer); tourIndex++; nextTourTargetSmooth(); }
    };
    setVisible(true);
    btn.addEventListener('click', () => setVisible(!obj.mesh.visible));
    grid.appendChild(btn);
});
document.getElementById('minimizeBtn').addEventListener('click', () => document.getElementById('controlPanel').classList.add('minimized'));
document.getElementById('panelMiniLogo').addEventListener('click', () => document.getElementById('controlPanel').classList.remove('minimized'));

let time = 0;
const basePlanetRotSpeed = 0.0024, baseMoonRotSpeed = 0.003;
function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    time += 0.008;
    if (sunMesh.visible) { sunMesh.rotation.y += 0.003; sunGlow.rotation.y += 0.001; }
    planets.forEach(p => {
        p.angle += p.baseSpeed * orbitSpeedFactor * 0.6;
        if (p.angle > Math.PI*2) p.angle -= Math.PI*2;
        p.mesh.position.copy(getRotatedPosition(p.distance, p.angle, p.inclination));
        if (p.mesh.visible) p.mesh.rotation.y += basePlanetRotSpeed * rotationSpeedFactor;
    });
    if (earthMesh) {
        moonAngle += moonBaseSpeed * orbitSpeedFactor * 0.6;
        if (moonAngle > Math.PI*2) moonAngle -= Math.PI*2;
        moonMesh.position.set(earthMesh.position.x + Math.cos(moonAngle)*moonDistance, Math.sin(moonAngle*2)*0.05, earthMesh.position.z + Math.sin(moonAngle)*moonDistance);
        if (moonMesh.visible) moonMesh.rotation.y += baseMoonRotSpeed * rotationSpeedFactor;
    }
    asteroidField.rotation.y += 0.001;
    stars.rotation.y += 0.0003;
    stars2.rotation.x += 0.0002;
    sunLight.intensity = 1.5 + Math.sin(time*3)*0.12;
    sunGlow.material.opacity = 0.2 + Math.sin(time*2)*0.05;
    updateLabelsOcclusion();
    if (isTracking && currentTrackedPlanet) controls.target.lerp(currentTrackedPlanet.position, 0.05);
    controls.update();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}
animate();
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
});
setTimeout(() => { if (loadingTip.style.display !== 'none') loadingTip.style.display = 'none'; }, 3000);
startTour();