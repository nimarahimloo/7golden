import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function makeNutMaterial(color, roughness = 0.82) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness: 0,
  });
}

function createHazelnut() {
  const group = new THREE.Group();
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(0.74, 36, 28),
    makeNutMaterial('#8b542b'),
  );
  shell.scale.set(0.82, 1, 0.76);
  shell.rotation.z = -0.22;
  group.add(shell);

  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.42),
    makeNutMaterial('#b47a42'),
  );
  cap.position.set(0, 0.43, 0.04);
  cap.scale.set(1.02, 0.42, 0.9);
  cap.rotation.z = -0.22;
  group.add(cap);
  return group;
}

function createPistachio() {
  const group = new THREE.Group();
  const shellMaterial = makeNutMaterial('#e8d5a8');
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(0.72, 32, 24),
    shellMaterial,
  );
  shell.scale.set(0.66, 1.1, 0.43);
  shell.rotation.z = 0.32;
  group.add(shell);

  const kernel = new THREE.Mesh(
    new THREE.SphereGeometry(0.52, 28, 20),
    makeNutMaterial('#78934c', 0.94),
  );
  kernel.scale.set(0.58, 1.05, 0.44);
  kernel.position.z = 0.25;
  kernel.rotation.z = 0.32;
  group.add(kernel);

  const seam = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.018, 8, 40, Math.PI * 1.2),
    makeNutMaterial('#b9a174'),
  );
  seam.scale.set(0.58, 1.08, 0.7);
  seam.rotation.set(0.1, 0.15, -0.48);
  seam.position.z = 0.42;
  group.add(seam);
  return group;
}

function createAlmond() {
  const group = new THREE.Group();
  const almond = new THREE.Mesh(
    new THREE.SphereGeometry(0.64, 32, 24),
    makeNutMaterial('#c89b68'),
  );
  almond.scale.set(0.53, 1.42, 0.52);
  almond.rotation.z = -0.36;
  group.add(almond);

  const ridgeMaterial = new THREE.MeshStandardMaterial({
    color: '#e1bd8b',
    roughness: 0.96,
    transparent: true,
    opacity: 0.72,
  });
  const ridge = new THREE.Mesh(
    new THREE.TorusGeometry(0.34, 0.012, 6, 28, Math.PI * 0.92),
    ridgeMaterial,
  );
  ridge.scale.set(0.7, 1.6, 0.45);
  ridge.rotation.set(0.2, 0.25, -0.38);
  ridge.position.z = 0.28;
  group.add(ridge);
  return group;
}

function createDust(scene) {
  const count = 80;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 8.5;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 5.5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: '#e8c879',
    size: 0.018,
    transparent: true,
    opacity: 0.48,
    depthWrite: false,
  });
  const points = new THREE.Points(geometry, material);
  scene.add(points);
  return points;
}

export default function HeroNutScene() {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    let renderer;
    let frameId = 0;
    let observer;
    let resizeObserver;
    let disposed = false;
    let inView = true;
    let pageVisible = !document.hidden;
    const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    let reducedMotion = motionQuery.matches;
    let previousTime = 0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
    camera.position.set(0, 0, 9.2);

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: window.devicePixelRatio < 2,
        powerPreference: 'low-power',
      });
    } catch {
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(host.clientWidth || 1, host.clientHeight || 1, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    host.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight('#fff0d0', 2.0));

    const keyLight = new THREE.DirectionalLight('#fff2d5', 3.4);
    keyLight.position.set(-3, 4, 6);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight('#d6b25e', 20, 16);
    rimLight.position.set(3, 1, 2);
    scene.add(rimLight);

    const cluster = new THREE.Group();
    scene.add(cluster);

    const hazelnut = createHazelnut();
    hazelnut.position.set(-1.22, 0.08, 0);
    hazelnut.rotation.set(0.18, -0.38, -0.34);
    hazelnut.scale.setScalar(1.08);
    cluster.add(hazelnut);

    const pistachio = createPistachio();
    pistachio.position.set(0.42, 0.62, 0.3);
    pistachio.rotation.set(-0.16, 0.3, -0.45);
    pistachio.scale.setScalar(0.96);
    cluster.add(pistachio);

    const almond = createAlmond();
    almond.position.set(1.2, -0.86, -0.15);
    almond.rotation.set(0.1, -0.24, 0.52);
    almond.scale.setScalar(0.94);
    cluster.add(almond);

    const smallHazelnut = createHazelnut();
    smallHazelnut.position.set(-0.06, -1.02, -0.72);
    smallHazelnut.rotation.set(0.4, 0.1, 0.5);
    smallHazelnut.scale.setScalar(0.47);
    cluster.add(smallHazelnut);

    const dust = createDust(scene);

    const render = (time = 0) => {
      if (disposed || !renderer) return;
      const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;
      previousTime = time;

      if (!reducedMotion) {
        cluster.rotation.y += delta * 0.085;
        cluster.rotation.z = Math.sin(time * 0.00022) * 0.035;
        hazelnut.rotation.y += delta * 0.12;
        pistachio.rotation.x = -0.16 + Math.sin(time * 0.00045) * 0.045;
        almond.rotation.y = -0.24 + Math.cos(time * 0.00035) * 0.055;
        dust.rotation.y += delta * 0.012;
      }

      renderer.render(scene, camera);
    };

    const shouldAnimate = () => !disposed && inView && pageVisible;

    const tick = (time) => {
      if (!shouldAnimate()) {
        frameId = 0;
        return;
      }
      render(time);
      if (!reducedMotion) frameId = window.requestAnimationFrame(tick);
    };

    const drawOnce = () => {
      if (disposed || !renderer) return;
      render(previousTime);
    };

    const start = () => {
      if (!shouldAnimate()) return;
      if (frameId) window.cancelAnimationFrame(frameId);
      if (reducedMotion) {
        drawOnce();
      } else {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    const stop = () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const resize = () => {
      if (!renderer || !host.clientWidth || !host.clientHeight) return;
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight, false);
      start();
    };

    const onVisibilityChange = () => {
      pageVisible = !document.hidden;
      pageVisible ? start() : stop();
    };

    const onMotionChange = (event) => {
      reducedMotion = event.matches;
      stop();
      start();
    };

    observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      inView ? start() : stop();
    }, { threshold: 0.01 });
    observer.observe(host);

    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    document.addEventListener('visibilitychange', onVisibilityChange);
    motionQuery.addEventListener?.('change', onMotionChange);

    resize();
    start();

    return () => {
      disposed = true;
      stop();
      observer?.disconnect();
      resizeObserver?.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      motionQuery.removeEventListener?.('change', onMotionChange);
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="hero-nut-scene"
      aria-hidden="true"
    />
  );
}
