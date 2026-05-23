import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { planetsData, totalTextures, sunTextureUrl, moonTextureUrl } from './solaris-data.js';
import { generateSaturnRingTexture } from './solaris-textures.js';
import TWEEN from 'https://unpkg.com/@tweenjs/tween.js@23.1.1/dist/tween.esm.js';

// =====================================================
// 土星本体纹理 —— canvas 程序生成
// 参考真实土星：奶油黄底色 + 多条褐/棕横带 + 极区略暗
// =====================================================


// =====================================================
// 土星环纹理 —— canvas 程序生成
// 真实土星环结构：C环（内，半透明暗）→ B环（最亮最厚）→ 卡西尼缝（黑色间隙）→ A环（中亮）→ 恩克缝（细暗缝）→ 外A环
// =====================================================


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
scene.fog = new THREE.FogExp2(0x010118, 0.00015);
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
controls.maxDistance = 100;
controls.minDistance = 3;

// --- 光照系统 ---
const ambientLight = new THREE.AmbientLight(0x334466, 0.6);
ambientLight.intensity = 0.35;
scene.add(ambientLight);
const sunLight = new THREE.PointLight(0xffcc88, 4.5, 100);
sunLight.position.set(0, 0, 0);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024;
sunLight.shadow.mapSize.height = 1024;
sunLight.shadow.bias = -0.0001;
scene.add(sunLight);

// 星空粒子
const starGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(4000 * 3);
for (let i = 0; i < 4000 * 3; i += 3) {
    starPos[i] = (Math.random() - 0.5) * 600;
    starPos[i+1] = (Math.random() - 0.5) * 400;
    starPos[i+2] = (Math.random() - 0.5) * 300;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.2, transparent: true, opacity: 0.7 }));
scene.add(stars);

const starGeo2 = new THREE.BufferGeometry();
const starPos2 = new Float32Array(5000 * 3);
for (let i = 0; i < 5000 * 3; i += 3) {
    starPos2[i] = (Math.random() - 0.5) * 800;
    starPos2[i+1] = (Math.random() - 0.5) * 500;
    starPos2[i+2] = (Math.random() - 0.5) * 400;
}
starGeo2.setAttribute('position', new THREE.BufferAttribute(starPos2, 3));
const stars2 = new THREE.Points(starGeo2, new THREE.PointsMaterial({ color: 0xaaccff, size: 0.1, transparent: true, opacity: 0.5 }));
scene.add(stars2);

const loadingTip = document.getElementById('loadingTip');
let loadedCount = 0;
const texLoader = new THREE.TextureLoader();
function textureLoaded() { 
    loadedCount++; 
    if (loadedCount >= totalTextures) { 
        loadingTip.style.opacity = '0'; 
        setTimeout(() => loadingTip.style.display = 'none', 500); 
    } 
}

// 通用纹理材质加载：根据行星数据加载 map 和 normal 纹理
function loadPlanetMaterial(data) {
    const material = new THREE.MeshStandardMaterial({
        color: data.color,
        roughness: data.roughness,
        metalness: data.metalness,
        emissive: data.emissive || 0x000000,
        emissiveIntensity: data.emissiveIntensity || 0
    });
    if (data.textureMap) {
        texLoader.load(data.textureMap, (t) => { material.map = t; material.color.set(0xffffff);  material.needsUpdate = true; textureLoaded(); }, undefined, () => textureLoaded());
    } else {
        textureLoaded();
    }
    if (data.textureNormal) {
        texLoader.load(data.textureNormal, (t) => { material.normalMap = t; material.needsUpdate = true; textureLoaded(); }, undefined, () => textureLoaded());
    } else {
        textureLoaded();
    }
    return material;
}
function loadMoonMaterial() {
    const material = new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0.05, emissive: 0x111122, emissiveIntensity: 0.01 });
    texLoader.load(moonTextureUrl, (t) => { material.map = t; material.needsUpdate = true; textureLoaded(); });
    return material;
}

const planets = [];
let earthMesh = null;
const switchableObjects = [];
const labelItems = [];

// --- 太阳 ---
const sunGeometry = new THREE.SphereGeometry(1.2, 128, 128);
const sunTexture = texLoader.load(sunTextureUrl, () => { textureLoaded(); });
const sunMat = new THREE.MeshStandardMaterial({
    map: sunTexture,
    color: 0xffffff,
    emissive: 0xff8833,
    emissiveMap: sunTexture,
    emissiveIntensity: 1.5,
    metalness: 0.1,
    roughness: 0.4,
    toneMapped: false
});
const sunMesh = new THREE.Mesh(sunGeometry, sunMat);
sunMesh.castShadow = false;
scene.add(sunMesh);
const sunGlowMat = new THREE.MeshBasicMaterial({ color: 0xff8844, transparent: true, opacity: 0.2, side: THREE.BackSide });
const sunGlow = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 32), sunGlowMat);
scene.add(sunGlow);

const sunDiv = document.createElement('div');
sunDiv.textContent = 'Sun';
sunDiv.style.cssText = `color:#ffeecc;font-size:16px;font-weight:bold;background:rgba(80,30,0,0.6);padding:4px 12px;border-radius:24px;border:1px solid #ffaa44;backdrop-filter:blur(4px);pointer-events:none;transition:opacity 0.2s`;
const sunLabel = new CSS2DObject(sunDiv);
sunLabel.position.set(0, 2.0, 0);
sunMesh.add(sunLabel);
labelItems.push({ name: 'Sun', css2d: sunLabel, dom: sunDiv });
const sunRealData = { name: 'Sun', realRadius: 696340, realDistance: 0, realPeriod: 0 };

// 轨道距离缩放：基于天文单位(AU)用对数映射到场景单位
// 使用 ln(AU+1) 缩放，平衡内外行星视觉比例
// 地球 1AU -> 7.5 场景单位
const EARTH_AU = 1.0;
const EARTH_SCENE_DIST = 7.5;
function realToSceneDist(realDistMkm) {
    const au = realDistMkm / 149.6; // 百万km转AU
    return Math.log(au + 1) * (EARTH_SCENE_DIST / Math.log(EARTH_AU + 1));
}

// 椭圆轨道：给定半长轴a、离心率e、角度θ（近心点角），返回半径 r = a(1-e²)/(1+e·cosθ)
function getEllipticalPosition(a, e, angle, inclination) {
    const r = a * (1 - e * e) / (1 + e * Math.cos(angle));
    const x0 = Math.cos(angle) * r;
    const z0 = Math.sin(angle) * r;
    const y0 = 0;
    const cos = Math.cos(inclination), sin = Math.sin(inclination);
    return new THREE.Vector3(x0, y0 * cos - z0 * sin, y0 * sin + z0 * cos);
}

function createOrbitWithInclination(a, e, inclination, color = 0x88aaff) {
    const points = [];
    for (let i = 0; i <= 200; i++) {
        const angle = (i / 200) * Math.PI * 2;
        points.push(getEllipticalPosition(a, e, angle, inclination));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    scene.add(new THREE.LineLoop(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.35 })));
}

planetsData.forEach((data, idx) => {
    const a = realToSceneDist(data.realDistance); // 半长轴（场景单位）
    const e = data.eccentricity || 0;
    
    createOrbitWithInclination(a, e, data.inclination, idx % 2 === 0 ? 0x77aaff : 0x88bbff);
    
    // 通用材质加载
    const material = loadPlanetMaterial(data);
    
    const planetMesh = new THREE.Mesh(new THREE.SphereGeometry(data.radius, 128, 128), material);
    planetMesh.castShadow = true;
    planetMesh.userData = { speed: data.speed, angle: Math.random() * Math.PI * 2, inclination: data.inclination, realData: data, semiMajor: a, eccentricity: e };

    if (data.hasRing) {
        const ringGroup = createRealisticSaturnRing(data.radius);
        // 土星环随行星倾角微调（真实倾角约26.7°已在几何体设定）
        planetMesh.add(ringGroup);
        planetMesh.userData.ringGroup = ringGroup;
    }
    if (data.name === 'Mars') {
        const atmos = new THREE.Mesh(new THREE.SphereGeometry(data.radius + 0.04, 64, 64), new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.05, side: THREE.BackSide }));
        planetMesh.add(atmos);
    }
    scene.add(planetMesh);
    
    const div = document.createElement('div');
    div.textContent = data.name;
    div.style.cssText = `color:#f0f0f0;font-size:13px;font-weight:500;background:rgba(20,20,40,0.7);padding:2px 10px;border-radius:20px;border:1px solid ${new THREE.Color(data.color).getStyle()};backdrop-filter:blur(4px);pointer-events:none;transition:opacity 0.2s`;
    const labelYOffset = data.name === 'Mercury' ? -0.3 : (data.name === 'Venus' || data.name === 'Earth' || data.name === 'Mars' ? data.radius + 0.4 : data.radius + 0.3);
    const label = new CSS2DObject(div);
    label.position.set(0, labelYOffset, 0);
    planetMesh.add(label);
    labelItems.push({ name: data.name, css2d: label, dom: div });
    
    planets.push({ mesh: planetMesh, baseSpeed: data.speed, angle: planetMesh.userData.angle, inclination: data.inclination, name: data.name, hasRing: data.hasRing, ringGroup: planetMesh.userData.ringGroup, label, realData: data, semiMajor: a, eccentricity: e });
    if (data.name === 'Earth') earthMesh = planetMesh;
    switchableObjects.push({ name: data.name, mesh: planetMesh, type: 'planet', extra: null, label });
});

// 月球
const moonMaterial = loadMoonMaterial();
const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(0.11, 128, 128), moonMaterial);
moonMesh.castShadow = true;
scene.add(moonMesh);
const moonDiv = document.createElement('div');
moonDiv.textContent = 'Moon';
moonDiv.style.cssText = 'color:#ccdaff;font-size:9px;font-weight:300;background:rgba(0,0,0,0.4);padding:1px 5px;border-radius:10px;border:1px solid #8888cc;opacity:0.6';
const moonLabel = new CSS2DObject(moonDiv);
moonLabel.position.set(0, 0, 0);
scene.add(moonLabel);
labelItems.push({ name: 'Moon', css2d: moonLabel, dom: moonDiv });
switchableObjects.push({ name: 'Moon', mesh: moonMesh, type: 'moon', extra: null, label: moonLabel });
let moonAngle = Math.random() * Math.PI * 2;
const moonDistance = 1.15, moonBaseSpeed = 0.017;
const moonRealData = { name: 'Moon', realRadius: 1737, realDistance: 0.384, realPeriod: 27.3 };

switchableObjects.push({ name: 'Sun', mesh: sunMesh, type: 'sun', extra: { glow: sunGlow }, label: sunLabel });

// 小行星带 — 均匀分布的粒子，多层叠加增强自然感
function createAsteroidBelt() {
    const group = new THREE.Group();

    // 使用均匀角度分布+随机微调确保粒子密度均匀
    function generateBeltLayer(count, rMin, rMax, yRange, size, color) {
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            // 均匀角度步长 + 随机微调
            const a = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.08;
            const r = rMin + Math.random() * (rMax - rMin);
            pos[i*3] = Math.cos(a) * r;
            pos[i*3+1] = (Math.random() - 0.5) * yRange;
            pos[i*3+2] = Math.sin(a) * r;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        group.add(new THREE.Points(geo, new THREE.PointsMaterial({ color, size, sizeAttenuation: true })));
    }

    // 大粒子（数量少，尺寸大）
    generateBeltLayer(250, 14.0, 15.0, 0.6, 0.06, 0xbbaa88);
    // 中粒子（主体）
    generateBeltLayer(800, 14.1, 14.9, 0.5, 0.035, 0xaa9977);
    // 小粒子（数量多，尺寸小）
    generateBeltLayer(1200, 14.2, 14.8, 0.4, 0.015, 0x998866);

    return group;
}
const asteroidField = createAsteroidBelt();
scene.add(asteroidField);

const dustGeo = new THREE.BufferGeometry();
const dustPos = new Float32Array(2500 * 3);
for (let i = 0; i < 2500 * 3; i += 3) {
    dustPos[i] = (Math.random() - 0.5) * 90;
    dustPos[i+1] = (Math.random() - 0.5) * 50;
    dustPos[i+2] = (Math.random() - 0.5) * 120;
}
dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x88aadd, size: 0.03, transparent: true, opacity: 0.25 })));

// ========== 自动巡游 ==========
const tourTargets = [
    { name: 'Sun', obj: sunMesh, offset: new THREE.Vector3(0, 3, 8) },
    ...planets.map(p => ({ name: p.name, obj: p.mesh, offset: new THREE.Vector3(0, 1.5, p.name === 'Saturn' ? 8 : 5) })),
    { name: 'Moon', obj: moonMesh, offset: new THREE.Vector3(0, 0.8, 3) }
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
let currentTrackedPlanet = null, isTracking = false, currentInfoPlanet = null;
const infoPanel = document.getElementById('infoPanel');
const infoName = document.getElementById('infoName');
const radiusLabelSpan = document.getElementById('radiusLabel'), distanceLabelSpan = document.getElementById('distanceLabel'), periodLabelSpan = document.getElementById('periodLabel');
const radiusValueSpan = document.getElementById('radiusValue'), distanceValueSpan = document.getElementById('distanceValue'), periodValueSpan = document.getElementById('periodValue');
const radiusUnitSpan = document.getElementById('radiusUnit'), distanceUnitSpan = document.getElementById('distanceUnit'), periodUnitSpan = document.getElementById('periodUnit');
const resetViewBtn = document.getElementById('resetViewBtn'), closeInfoBtn = document.getElementById('closeInfoBtn');

function showPlanetInfo(planetName, realData) {
    currentInfoPlanet = planetName;
    radiusValueSpan.textContent = realData.realRadius.toLocaleString();
    // 太阳显示N/A，其他行星显示真实数据
    const isSun = planetName === 'Sun';
    distanceValueSpan.textContent = isSun ? 'N/A' : realData.realDistance.toLocaleString();
    periodValueSpan.textContent = isSun ? 'N/A' : realData.realPeriod.toLocaleString();
    infoPanel.style.display = 'block';
    updateInfoPanelLanguage();
}
function hideInfoPanel() { currentInfoPlanet = null; infoPanel.style.display = 'none'; }
function updateInfoPanelLanguage() {
    const t = translations[currentLang];
    radiusLabelSpan.textContent = t.radiusLabel; distanceLabelSpan.textContent = t.distanceLabel; periodLabelSpan.textContent = t.periodLabel;
    radiusUnitSpan.textContent = t.radiusUnit; distanceUnitSpan.textContent = t.distanceUnit; periodUnitSpan.textContent = t.periodUnit;
    resetViewBtn.textContent = t.resetViewLabel;
    if (currentInfoPlanet && infoPanel.style.display === 'block') infoName.textContent = translations[currentLang].names[currentInfoPlanet] || currentInfoPlanet;
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
let clickableObjectsCache = null;
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    raycasterClick.setFromCamera(mouse, camera);
    
    // 缓存可点击对象，避免每次点击重复分配内存触发 GC
    if (!clickableObjectsCache) {
        clickableObjectsCache = [...planets.map(p => p.mesh), moonMesh, sunMesh];
    }
    
    const intersects = raycasterClick.intersectObjects(clickableObjectsCache);
    if (intersects.length > 0) {
        const hit = intersects[0].object;
        let planetName = '', realData = null;
        if (hit === moonMesh) { planetName = 'Moon'; realData = moonRealData; }
        else if (hit === sunMesh) { planetName = 'Sun'; realData = sunRealData; }
        else { const planetObj = planets.find(p => p.mesh === hit); if (planetObj) { planetName = planetObj.name; realData = planetObj.realData; } }
        if (planetName) { showPlanetInfo(planetName, realData); startTracking(hit); }
    }
});
resetViewBtn.addEventListener('click', (e) => { e.stopPropagation(); stopTracking(); hideInfoPanel(); if (!tourActive) startTour(); });
closeInfoBtn.addEventListener('click', (e) => { e.stopPropagation(); hideInfoPanel(); });
  
// 阻止信息面板和控制面板上的点击冒泡到window，避免触发星球选中
infoPanel.addEventListener('click', (e) => e.stopPropagation());
document.getElementById('controlPanel').addEventListener('click', (e) => e.stopPropagation());

const raycasterOcc = new THREE.Raycaster();
function updateLabelsOcclusion() {
    const cameraPos = camera.position;
    planets.forEach(planet => {
        const dir = new THREE.Vector3().subVectors(planet.mesh.position, cameraPos).normalize();
        raycasterOcc.set(cameraPos, dir);
        const intersects = raycasterOcc.intersectObject(sunMesh);
        let occluded = false;
        if (intersects.length > 0) {
            const d = cameraPos.distanceTo(planet.mesh.position);
            if (cameraPos.distanceTo(intersects[0].point) < d - 0.5) occluded = true;
        }
        if (planet.label) planet.label.element.style.opacity = occluded ? '0' : '1';
    });
    // 月球遮挡已在 animate() 里处理，这里不再重复
}

let orbitSpeedFactor = 1.0, rotationSpeedFactor = 1.0;
const orbitSlider = document.getElementById('orbitSpeedSlider'), orbitValue = document.getElementById('orbitSpeedValue');
const rotationSlider = document.getElementById('rotationSpeedSlider'), rotationValue = document.getElementById('rotationSpeedValue');
orbitSlider.addEventListener('input', (e) => { orbitSpeedFactor = parseFloat(e.target.value); orbitValue.textContent = orbitSpeedFactor.toFixed(2)+' x'; });
rotationSlider.addEventListener('input', (e) => { rotationSpeedFactor = parseFloat(e.target.value); rotationValue.textContent = rotationSpeedFactor.toFixed(2)+' x'; });

let currentLang = 'en', labelsVisible = true;
const translations = {
    en: { names:{'Sun':'Sun','Mercury':'Mercury','Venus':'Venus','Earth':'Earth','Mars':'Mars','Jupiter':'Jupiter','Saturn':'Saturn','Uranus':'Uranus','Neptune':'Neptune','Moon':'Moon'}, title:'🌌 3D Solar System', subtitle:'⚡ Dual Speed | Smooth Tour', footer:'✨ Click planet to track/info | Auto tour default ON', miniHint:'🪐 Smooth Tour (10s/planet) | Click to interrupt', hide:'🏷️ Hide Labels', show:'🏷️ Show Labels', lang:'中文', orbitLabel:'🚀 Orbit Speed Multiplier', rotLabel:'🔄 Rotation Speed Multiplier', radiusLabel:'🌍 Radius', distanceLabel:'📡 Distance from Sun', periodLabel:'⏱️ Orbital Period', radiusUnit:'km', distanceUnit:'million km', periodUnit:'Earth days', tourStop:'🔁 Stop Tour', tourStart:'🔁 Start Tour', resetViewLabel:'🎥 Reset View' },
    zh: { names:{'Sun':'太阳','Mercury':'水星','Venus':'金星','Earth':'地球','Mars':'火星','Jupiter':'木星','Saturn':'土星','Uranus':'天王星','Neptune':'海王星','Moon':'月球'}, title:'🌌 3D 太阳系', subtitle:'⚡ 双速度调节 | 平滑巡游 | 土星真实纹理', footer:'✨ 点击行星追踪/信息 | 自动巡游默认开启', miniHint:'🪐 平滑巡游(10秒/行星) | 点击可中断', hide:'🏷️ 隐藏名称', show:'🏷️ 显示名称', lang:'EN', orbitLabel:'🚀 公转速度倍率', rotLabel:'🔄 自转速度倍率', radiusLabel:'🌍 半径', distanceLabel:'📡 距日距离', periodLabel:'⏱️ 公转周期', radiusUnit:'km', distanceUnit:'百万 km', periodUnit:'地球日', tourStop:'🔁 停止巡游', tourStart:'🔁 开始巡游', resetViewLabel:'🎥 重置全局视角' }
};
function updateLang() {
    const t = translations[currentLang];
    labelItems.forEach(item => { item.dom.textContent = t.names[item.name]; });
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
    const order = ['Sun','Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune','Moon'];
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
const orderList = ['Sun','Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune','Moon'];
orderList.forEach(name => {
    const obj = switchableObjects.find(o => o.name === name);
    if (!obj) return;
    const btn = document.createElement('button');
    btn.className = 'planet-btn visible';
    btn.textContent = name;
    const label = labelItems.find(l => l.name === name)?.css2d || null;
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
// 视觉自转基准：以地球自转速度为基础，调整整体缩放使视觉效果适中
// 真实自转周期（地球日）: 水星58.6, 金星-243, 地球1.0, 火星1.025,
// 木星0.4135, 土星0.444, 天王星-0.718, 海王星0.671, 月球27.3
// 角速度与周期成反比：ω = 1/T
// 设置地球自转速度使所有行星运动可见
const earthRotSpeed = 0.0015; // 基准
function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    time += 0.008;
    if (sunMesh.visible) { sunMesh.rotation.y += 0.0001 * rotationSpeedFactor; sunGlow.rotation.y += 0.00005; }
    planets.forEach(p => {
        p.angle += p.baseSpeed * orbitSpeedFactor * 0.6;
        if (p.angle > Math.PI*2) p.angle -= Math.PI*2;
        // 椭圆轨道：r = a(1-e²)/(1+e·cosθ)，θ为近心点角
        const a = p.semiMajor;
        const e = p.eccentricity;
        const r = a * (1 - e * e) / (1 + e * Math.cos(p.angle));
        const x0 = Math.cos(p.angle) * r;
        const z0 = Math.sin(p.angle) * r;
        const y0 = 0;
        const cosI = Math.cos(p.inclination), sinI = Math.sin(p.inclination);
        p.mesh.position.set(x0, y0 * cosI - z0 * sinI, y0 * sinI + z0 * cosI);
        if (p.mesh.visible) {
            // 真实自转：rotPeriod为地球日，负值表示逆向自转
            // 角速度 ω ∝ 1/T。添加视觉下限 minFactor 防止极慢行星完全静止
            const rawFactor = 1 / Math.abs(p.realData.rotPeriod || 1);
            const minFactor = 0.03; // 视觉保底：最慢的行星也能看到转动
            const rotFactor = Math.max(rawFactor, minFactor);
            p.mesh.rotation.y += earthRotSpeed * rotFactor * rotationSpeedFactor * Math.sign(p.realData.rotPeriod || 1);
        }
    });
// animate() 里替换月球标签部分
    if (earthMesh) {
        moonAngle += moonBaseSpeed * orbitSpeedFactor * 0.6;
        if (moonAngle > Math.PI*2) moonAngle -= Math.PI*2;
        moonMesh.position.set(
            earthMesh.position.x + Math.cos(moonAngle) * moonDistance,
            Math.sin(moonAngle * 2) * 0.05,
            earthMesh.position.z + Math.sin(moonAngle) * moonDistance
        );
        moonLabel.position.set(
            moonMesh.position.x,
            moonMesh.position.y + 0.25,
            moonMesh.position.z
        );

        // 判断月球是否在地球背面（相对相机）
        const camToEarth = new THREE.Vector3()
            .subVectors(earthMesh.position, camera.position)
            .normalize();
        const earthToMoon = new THREE.Vector3()
            .subVectors(moonMesh.position, earthMesh.position)
            .normalize();
        // dot > 0 说明月球在地球远离相机的一侧 → 被遮挡
        const behindEarth = camToEarth.dot(earthToMoon) > 0.3;
        moonLabel.element.style.opacity = behindEarth ? '0' : '1';

        if (moonMesh.visible) moonMesh.rotation.y += (earthRotSpeed / 27.3) * rotationSpeedFactor;
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