import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { findOption } from '../data/artemis-config.js';
import { loadOptionalModel } from './model-loader.js';

const darkMetal = () => new THREE.MeshStandardMaterial({ color: '#121617', metalness: 0.85, roughness: 0.32, name: 'METAL_INTERNAL' });
const accent = () => new THREE.MeshStandardMaterial({ color: '#c8c9c2', metalness: 0.7, roughness: 0.28, name: 'ACCENT' });
const rubber = () => new THREE.MeshStandardMaterial({ color: '#080a0a', roughness: 0.88, name: 'RUBBER' });
const paint = (color) => new THREE.MeshStandardMaterial({ color, metalness: 0.55, roughness: 0.38, name: 'CASE_PAINT' });

function box(width, height, depth, material, position = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function cylinder(radius, height, material, position, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 20), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  return mesh;
}

function fallbackChassis(color) {
  const group = new THREE.Group();
  const casePaint = paint(color);
  const metal = darkMetal();
  group.add(box(4.6, 6.1, 0.16, casePaint, [0, 0, -1.55]));
  group.add(box(0.16, 6.1, 3.2, casePaint, [-2.22, 0, 0]));
  group.add(box(0.16, 6.1, 3.2, casePaint, [2.22, 0, 0]));
  group.add(box(4.6, 0.18, 3.2, metal, [0, -3.02, 0]));
  group.add(box(4.25, 5.6, 0.08, new THREE.MeshStandardMaterial({ color: '#0c1011', roughness: 0.65, name: 'GLASS' }), [0, 0, 1.58]));
  group.add(box(3.7, 0.1, 2.45, metal, [0, -1.18, 0.15]));
  return group;
}

function fallbackFront(kind, color) {
  const group = new THREE.Group();
  const material = kind === 'front-mesh' ? darkMetal() : paint(color);
  group.add(box(4.35, 5.8, 0.18, material, [0, 0, 1.66]));
  if (kind !== 'front-standard') {
    const lineMaterial = accent();
    const spacing = kind === 'front-airflow' ? 0.42 : 0.26;
    for (let x = -1.7; x <= 1.7; x += spacing) {
      group.add(box(0.07, 5.25, 0.07, lineMaterial, [x, 0, 1.79]));
    }
  }
  return group;
}

function fallbackTop(kind, color) {
  const group = new THREE.Group();
  const topMaterial = kind === 'top-mesh' ? darkMetal() : paint(color);
  group.add(box(4.38, 0.16, 3.12, topMaterial, [0, 3.12, 0]));
  if (kind !== 'top-standard') {
    const ventMaterial = accent();
    const rows = kind === 'top-radiator' ? 3 : 6;
    for (let z = -0.95; z <= 0.95; z += 1.9 / rows) {
      group.add(box(3.45, 0.05, 0.08, ventMaterial, [0, 3.22, z]));
    }
  }
  return group;
}

function fallbackPsu(kind, color, transform) {
  const group = new THREE.Group();
  const styleMaterial = kind === 'psu-mesh' ? darkMetal() : paint(color);
  group.add(box(2.75, 0.72, 1.48, styleMaterial));
  if (kind === 'psu-industrial') group.add(box(2.98, 0.14, 1.72, accent(), [0, 0.43, 0]));
  if (kind === 'psu-mesh') {
    for (let x = -1.05; x <= 1.05; x += 0.3) group.add(box(0.05, 0.78, 1.58, accent(), [x, 0, 0]));
  }
  group.position.set(...transform.position);
  group.rotation.set(...transform.rotation);
  return group;
}

function fallbackAccessory(kind) {
  const group = new THREE.Group();
  const metal = darkMetal();
  const soft = rubber();

  if (kind === 'handle') {
    group.add(box(2.3, 0.18, 0.18, metal, [0, 3.52, 0]));
    group.add(box(0.18, 0.55, 0.18, metal, [-1.06, 3.3, 0]));
    group.add(box(0.18, 0.55, 0.18, metal, [1.06, 3.3, 0]));
  }
  if (kind === 'raised-feet') {
    [[-1.75, -3.4, -1.05], [1.75, -3.4, -1.05], [-1.75, -3.4, 1.05], [1.75, -3.4, 1.05]].forEach((position) => {
      group.add(cylinder(0.18, 0.48, soft, position));
    });
  }
  if (kind === 'gpu-support') group.add(box(0.18, 2.25, 0.34, accent(), [0.85, -0.75, 0.72]));
  if (kind === 'cable-channel') group.add(box(0.38, 3.8, 0.3, rubber(), [-1.5, 0.05, -1.24]));
  return group;
}

function fallbackFor(part, color, transform) {
  if (part.fallback === 'chassis') return fallbackChassis(color);
  if (part.fallback.startsWith('front')) return fallbackFront(part.fallback, color);
  if (part.fallback.startsWith('top')) return fallbackTop(part.fallback, color);
  if (part.fallback.startsWith('psu')) return fallbackPsu(part.fallback, color, transform);
  return fallbackAccessory(part.fallback);
}

function paintConfigurableMaterials(object, color) {
  object.traverse((child) => {
    if (!child.isMesh) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.filter((material) => material.name === 'CASE_PAINT').forEach((material) => material.color.set(color));
    child.castShadow = true;
    child.receiveShadow = true;
  });
}

function disposeObject(object) {
  object.traverse((child) => {
    if (!child.isMesh) return;
    child.geometry.dispose();
    (Array.isArray(child.material) ? child.material : [child.material]).forEach((material) => material.dispose());
  });
}

export function createViewer(host) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(9.4, 6.7, 10.1);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor('#000000', 0);
  host.append(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.enableDamping = true;
  controls.minDistance = 7;
  controls.maxDistance = 18;
  controls.maxPolarAngle = Math.PI * 0.48;

  scene.add(new THREE.HemisphereLight('#eaf5ff', '#071425', 2.1));
  const keyLight = new THREE.DirectionalLight('#ffffff', 4.4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.near = 0.1;
  keyLight.shadow.camera.far = 30;
  const fillLight = new THREE.DirectionalLight('#c9e4ff', 1.25);
  scene.add(keyLight, keyLight.target, fillLight, fillLight.target);

  const deskShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 18),
    new THREE.ShadowMaterial({ color: '#020817', opacity: 0.38 }),
  );
  deskShadow.rotation.x = -Math.PI / 2;
  deskShadow.position.y = -3.12;
  deskShadow.receiveShadow = true;
  scene.add(deskShadow);

  const assembly = new THREE.Group();
  scene.add(assembly);
  let version = 0;
  const cameraForward = new THREE.Vector3();
  const cameraRight = new THREE.Vector3();
  const cameraLeft = new THREE.Vector3();
  const lightTarget = new THREE.Vector3();
  const worldUp = new THREE.Vector3(0, 1, 0);

  function updateCameraLighting() {
    camera.getWorldDirection(cameraForward);
    cameraRight.crossVectors(cameraForward, worldUp).normalize();
    cameraLeft.copy(cameraRight).multiplyScalar(-1);
    lightTarget.copy(controls.target);

    keyLight.position
      .copy(lightTarget)
      .addScaledVector(cameraLeft, 8.5)
      .addScaledVector(cameraForward, -5.5)
      .addScaledVector(worldUp, 9.5);
    keyLight.target.position.copy(lightTarget);

    fillLight.position
      .copy(lightTarget)
      .addScaledVector(cameraRight, 5.5)
      .addScaledVector(cameraForward, -3.5)
      .addScaledVector(worldUp, 4.5);
    fillLight.target.position.copy(lightTarget);

    keyLight.target.updateMatrixWorld();
    fillLight.target.updateMatrixWorld();
  }

  function resize() {
    const { width, height } = host.getBoundingClientRect();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  resize();

  function render(configuration, catalog) {
    version += 1;
    const currentVersion = version;
    deskShadow.position.y = configuration.accessories['raised-feet'] ? -3.66 : -3.12;
    while (assembly.children.length) {
      const child = assembly.children.pop();
      disposeObject(child);
    }

    const color = findOption(catalog.colors, configuration.color).value;
    const activeParts = [
      ...catalog.permanent,
      findOption(catalog.slots.front.options, configuration.slots.front),
      findOption(catalog.slots.top.options, configuration.slots.top),
      findOption(catalog.psuShrouds, configuration.psuShroud.style),
      ...catalog.accessories.filter((accessory) => configuration.accessories[accessory.id]),
    ];

    activeParts.forEach((part) => {
      const transform = part.fallback.startsWith('psu')
        ? findOption(catalog.psuPositions, configuration.psuShroud.position).transform
        : undefined;
      const preview = fallbackFor(part, color, transform);
      assembly.add(preview);

      loadOptionalModel(part.asset).then((model) => {
        if (!model || currentVersion !== version) return;
        paintConfigurableMaterials(model, color);
        assembly.remove(preview);
        disposeObject(preview);
        assembly.add(model);
      });
    });
  }

  function animate() {
    controls.update();
    updateCameraLighting();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  return { render };
}
