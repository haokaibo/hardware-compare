// 纹理路径配置
const T = './solar_textures/';

// 纹理计数：每个 map 和 normal 各算1个，加上太阳+月球额外
export const totalTextures = 18;

export const planetsData = [
    { name: 'Mercury', radius: 0.40, speed: 0.0056, color: 0x9a9a9a, roughness: 0.95, metalness: 0,  emissive: 0x000000, emissiveIntensity: 0,    useCdn: true,  hasRing: false, textureMap: T+'2k_mercury.jpg', textureNormal: null,  inclination: (Math.random()-0.5)*0.08, realRadius: 2440,  realDistance: 57.9,  realPeriod: 88,  rotPeriod: 58.646, eccentricity: 0.2056 },
    { name: 'Venus',   radius: 0.48, speed: 0.0040, color: 0xe6b800, roughness: 0.95, metalness: 0,  emissive: 0x331100, emissiveIntensity: 0.01, useCdn: true,  hasRing: false, textureMap: T+'2k_venus_surface.jpg', textureNormal: null,  inclination: (Math.random()-0.5)*0.08, realRadius: 6052,  realDistance: 108.2, realPeriod: 225, rotPeriod: -243.025, eccentricity: 0.0068 },
    { name: 'Earth',   radius: 0.52, speed: 0.0034, color: 0xffffff, roughness: 0.9, metalness: 0, emissive: 0x000000, emissiveIntensity: 0,useCdn: false, hasRing: false, textureMap: T+'2k_earth_daymap.jpg', textureNormal: T+'2k_earth_normal_map.jpg',  inclination: (Math.random()-0.5)*0.08, realRadius: 6371,  realDistance: 149.6, realPeriod: 365, rotPeriod: 1.0, eccentricity: 0.0167 },
    { name: 'Mars',    radius: 0.46, speed: 0.0028, color: 0xc45c2c, roughness: 0.95, metalness: 0,  emissive: 0x441100, emissiveIntensity: 0.03, useCdn: true,  hasRing: false, textureMap: T+'2k_mars.jpg', textureNormal: null,  inclination: (Math.random()-0.5)*0.08, realRadius: 3390,  realDistance: 227.9, realPeriod: 687, rotPeriod: 1.025, eccentricity: 0.0934 },
    { name: 'Jupiter', radius: 1.5,  speed: 0.0016, color: 0xe8c9a0, roughness: 0.9, metalness: 0, emissive: 0x000000, emissiveIntensity: 0,    useCdn: true,  hasRing: false, textureMap: T+'2k_jupiter.jpg', textureNormal: null,  inclination: (Math.random()-0.5)*0.06, realRadius: 69911, realDistance: 778.5, realPeriod: 4333, rotPeriod: 0.4135, eccentricity: 0.0484 },
    { name: 'Saturn',  radius: 1.2,  speed: 0.0012, color: 0xf0d9b0, roughness: 0.95, metalness: 0, emissive: 0x000000, emissiveIntensity: 0,    useCdn: true,  hasRing: true,  textureMap: T+'2k_saturn.jpg', textureNormal: null,  inclination: (Math.random()-0.5)*0.06, realRadius: 58232, realDistance: 1434,  realPeriod: 10759, rotPeriod: 0.444, eccentricity: 0.0539 },
    { name: 'Uranus',  radius: 0.8,  speed: 0.0009, color: 0x7ec8e3, roughness: 0.9, metalness: 0, emissive: 0x004455, emissiveIntensity: 0.01, useCdn: true,  hasRing: false, textureMap: T+'2k_uranus.jpg', textureNormal: null,  inclination: (Math.random()-0.5)*0.06, realRadius: 25362, realDistance: 2872,  realPeriod: 30687, rotPeriod: -0.718, eccentricity: 0.0473 },
    { name: 'Neptune', radius: 0.78, speed: 0.00072,color: 0x4a7db4, roughness: 0.9, metalness: 0, emissive: 0x002244, emissiveIntensity: 0.01, useCdn: true,  hasRing: false, textureMap: T+'2k_neptune.jpg', textureNormal: null,  inclination: (Math.random()-0.5)*0.06, realRadius: 24622, realDistance: 4495,  realPeriod: 60190, rotPeriod: 0.671, eccentricity: 0.0086 }
];

// 太阳和月球的纹理路径单独导出
export const sunTextureUrl = T + 'Solarsystemscope_texture_2k_sun.jpg';
export const moonTextureUrl = T + '2k_moon.jpg';
