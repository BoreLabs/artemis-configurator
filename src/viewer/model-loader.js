import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const cache = new Map();
const unavailable = new Set();

function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}

export async function loadModel(path) {
  if (!path || unavailable.has(path)) return null;

  if (cache.has(path)) return cache.get(path).clone(true);

  try {
    const gltf = await loader.loadAsync(assetUrl(path));
    cache.set(path, gltf.scene);
    return gltf.scene.clone(true);
  } catch {
    unavailable.add(path);
    return null;
  }
}
