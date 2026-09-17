import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { findOption } from '../data/artemis-config.js';
import { loadModel } from './model-loader.js';

function prepareModel(object) {
  object.traverse((child) => {
    if (!child.isMesh) return;
    child.castShadow = true;
    child.receiveShadow = true;
  });
}

export function createViewer(host, onAssetStatus = () => {}) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(9.4, 6.7, 10.1);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.82;
  renderer.setClearColor('#000000', 0);
  host.append(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.enableDamping = true;
  controls.minDistance = 7;
  controls.maxDistance = 18;
  controls.maxPolarAngle = Math.PI * 0.48;

  scene.add(new THREE.HemisphereLight('#eaf5ff', '#071425', 1.1));
  const keyLight = new THREE.DirectionalLight('#ffffff', 2.8);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.near = 0.1;
  keyLight.shadow.camera.far = 30;
  const fillLight = new THREE.DirectionalLight('#c9e4ff', 0.6);
  scene.add(keyLight, keyLight.target, fillLight, fillLight.target);

  const deskShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 18),
    new THREE.ShadowMaterial({ color: '#020817', opacity: 0.38 }),
  );
  deskShadow.rotation.x = -Math.PI / 2;
  deskShadow.position.y = -3.02;
  deskShadow.receiveShadow = true;
  scene.add(deskShadow);

  const assembly = new THREE.Group();
  scene.add(assembly);

  const cameraForward = new THREE.Vector3();
  const cameraRight = new THREE.Vector3();
  const cameraLeft = new THREE.Vector3();
  const lightTarget = new THREE.Vector3();
  const worldUp = new THREE.Vector3(0, 1, 0);
  const bounds = new THREE.Box3();
  let presentationFrame;
  let version = 0;
  let showFactoryAssembly = true;

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

  function positionAssembly() {
    bounds.setFromObject(assembly);
    if (bounds.isEmpty()) return;

    if (!presentationFrame) {
      const size = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      presentationFrame = {
        scale: 5.3 / Math.max(size.x, size.y, size.z),
        center,
        baseY: bounds.min.y,
      };
    }

    const { scale, center, baseY } = presentationFrame;
    assembly.scale.setScalar(scale);
    assembly.position.set(-center.x * scale, deskShadow.position.y - baseY * scale, -center.z * scale);
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

  async function render(configuration, catalog) {
    version += 1;
    const currentVersion = version;
    assembly.clear();
    assembly.scale.setScalar(1);
    assembly.position.set(0, 0, 0);
    onAssetStatus('Chargement du modèle…');

    const base = findOption(catalog.bases, configuration.base);
    const parts = showFactoryAssembly
      ? [catalog.assembly]
      : [base, ...(configuration.cover ? [catalog.cover] : [])];
    const isFactoryAssembly = showFactoryAssembly;
    showFactoryAssembly = false;
    const models = await Promise.all(parts.map((part) => loadModel(part?.asset)));

    if (currentVersion !== version) return;

    const loadedModels = models.filter(Boolean);
    if (!loadedModels.length) {
      onAssetStatus('Modèle GLB indisponible');
      return;
    }

    loadedModels.forEach((model) => {
      prepareModel(model);
      assembly.add(model);
    });
    positionAssembly();
    onAssetStatus(isFactoryAssembly ? 'ARTEMIS · assemblage complet' : configuration.cover ? 'BASE + COVER' : 'BASE · cover retirée');
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
