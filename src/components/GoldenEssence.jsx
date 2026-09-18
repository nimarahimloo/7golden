import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';

/**
 * GoldenEssence — the site's ambient 3D backdrop, built with Three.js.
 *
 * A fixed, non-interactive layer that lives behind the page content: floating
 * golden nut sculptures (organic icosahedrons) with a metallic gold material
 * orbit a central "essence" shape inside a slow golden particle aura. The page
 * scrolls over it, so it reads as a cinematic golden atmosphere rather than a
 * separate section.
 *
 * It is mounted by the home page only and rendered through a portal onto
 * <body>, so no transformed/positioned ancestor can break its `fixed` layer.
 *
 * Performance: the render loop idles while the tab is hidden, the particle
 * count drops on mobile, and visitors who prefer reduced motion get a static
 * gold wash instead of WebGL.
 */

function StaticGoldWash() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(ellipse 70% 55% at 50% 28%, rgba(240,206,90,0.16) 0%, transparent 62%),' +
          'radial-gradient(ellipse 60% 45% at 12% 82%, rgba(240,206,90,0.09) 0%, transparent 65%),' +
          'radial-gradient(ellipse 55% 40% at 88% 68%, rgba(240,206,90,0.07) 0%, transparent 65%)',
      }}
    />
  );
}

export default function GoldenEssence() {
  const mountRef = useRef(null);
  const [reducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (reducedMotion) return;
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.innerWidth < 768;

    // --- Scene ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    mount.appendChild(renderer.domElement);

    // --- Lights — golden studio ---
    scene.add(new THREE.AmbientLight(0x1a1208, 0.4));

    const keyLight = new THREE.PointLight(0xF0CE5A, 3.5, 40);
    keyLight.position.set(6, 5, 6);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x3a2a18, 1.2, 34);
    fillLight.position.set(-6, -4, 5);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xFFE8A0, 2.5, 30);
    rimLight.position.set(0, 2, -9);
    scene.add(rimLight);

    const accentLight = new THREE.PointLight(0xD4A040, 1.8, 24);
    accentLight.position.set(-3, 6, 3);
    scene.add(accentLight);

    // --- Gold material ---
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xF0CE5A,
      metalness: 0.92,
      roughness: 0.22,
    });

    // Helper: create organic nut-shaped geometry from icosahedron
    const createNutGeometry = (radius, detail, elongation = 1, bumpiness = 0.12) => {
      const geo = new THREE.IcosahedronGeometry(radius, detail);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
        const noise =
          Math.sin(x * 2.1) * Math.cos(y * 1.8) * bumpiness +
          Math.sin(z * 3.2) * bumpiness * 0.6 +
          Math.cos(x * 4 + y * 3) * bumpiness * 0.3;
        const s = 1 + noise;
        pos.setXYZ(i, x * s, y * s * elongation, z * s);
      }
      geo.computeVertexNormals();
      return geo;
    };

    // --- Central essence ---
    const centralGeo = createNutGeometry(2.4, 4, 1.15, 0.14);
    const centralNut = new THREE.Mesh(centralGeo, goldMaterial);
    scene.add(centralNut);

    // --- Orbiting nuts ---
    const orbiters = [];
    const orbitConfigs = [
      { radius: 0.85, orbit: 5.5, speed: 0.45, phase: 0, yOff: 1.8, elong: 1.3, detail: 2 },
      { radius: 0.65, orbit: 5.0, speed: 0.6, phase: 2.1, yOff: -2.0, elong: 1.4, detail: 2 },
      { radius: 0.55, orbit: 6.2, speed: 0.35, phase: 4.0, yOff: 0.8, elong: 1.2, detail: 2 },
      { radius: 0.45, orbit: 4.5, speed: 0.7, phase: 1.2, yOff: -0.5, elong: 1.5, detail: 1 },
    ];

    const orbitGeos = [];
    orbitConfigs.forEach(cfg => {
      const geo = createNutGeometry(cfg.radius, cfg.detail, cfg.elong, 0.1);
      orbitGeos.push(geo);
      const mesh = new THREE.Mesh(geo, goldMaterial);
      scene.add(mesh);
      orbiters.push({ mesh, ...cfg });
    });

    // --- Golden particle aura ---
    const particleCount = isMobile ? 200 : 500;
    const pPositions = new Float32Array(particleCount * 3);
    const pPhases = new Float32Array(particleCount);
    const pRadii = new Float32Array(particleCount);
    const pAngles = new Float32Array(particleCount);
    const pYVals = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const r = 3.2 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      pRadii[i] = r;
      pAngles[i] = theta;
      pYVals[i] = (Math.random() - 0.5) * 6;
      pPositions[i * 3] = Math.cos(theta) * r;
      pPositions[i * 3 + 1] = pYVals[i];
      pPositions[i * 3 + 2] = Math.sin(theta) * r;
      pPhases[i] = Math.random() * Math.PI * 2;
    }

    // Particle texture
    const pc = document.createElement('canvas');
    pc.width = 64; pc.height = 64;
    const pctx = pc.getContext('2d');
    const pg = pctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    pg.addColorStop(0, 'rgba(255,250,225,1)');
    pg.addColorStop(0.18, 'rgba(240,206,90,0.85)');
    pg.addColorStop(0.45, 'rgba(240,206,90,0.3)');
    pg.addColorStop(1, 'rgba(240,206,90,0)');
    pctx.fillStyle = pg;
    pctx.fillRect(0, 0, 64, 64);
    const pTexture = new THREE.CanvasTexture(pc);

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.18,
      map: pTexture,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
      color: 0xF0CE5A,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // --- Interaction — the layer ignores the pointer, so we track the window ---
    let mx = 0, my = 0;
    const onMouse = (e) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    // --- Animation — idles while the tab is hidden ---
    let frameId = null;
    let isActive = !document.hidden;
    const onVisibility = () => { isActive = !document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!isActive) return;

      const t = clock.getElapsedTime();

      // Central nut — slow rotation + float
      centralNut.rotation.x += 0.0025;
      centralNut.rotation.y += 0.0035;
      centralNut.position.y = Math.sin(t * 0.5) * 0.35;

      // Orbiting nuts
      orbiters.forEach(n => {
        const angle = t * n.speed + n.phase;
        n.mesh.position.x = Math.cos(angle) * n.orbit;
        n.mesh.position.z = Math.sin(angle) * n.orbit;
        n.mesh.position.y = n.yOff + Math.sin(t * 0.6 + n.phase) * 0.5;
        n.mesh.rotation.x += 0.01;
        n.mesh.rotation.y += 0.015;
      });

      // Particles — orbital flow
      const pp = pGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const phase = pPhases[i];
        pAngles[i] += 0.002 + Math.sin(phase) * 0.001;
        const r = pRadii[i] + Math.sin(t * 0.8 + phase) * 0.4;
        pp[i * 3] = Math.cos(pAngles[i]) * r;
        pp[i * 3 + 1] = pYVals[i] + Math.sin(t * 0.5 + phase) * 0.6;
        pp[i * 3 + 2] = Math.sin(pAngles[i]) * r;
      }
      pGeo.attributes.position.needsUpdate = true;

      // Camera parallax
      camera.position.x += (mx * 3.5 - camera.position.x) * 0.03;
      camera.position.y += (-my * 2.5 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      // Dynamic lighting — shifting highlights
      keyLight.position.x = Math.sin(t * 0.3) * 7;
      keyLight.position.z = Math.cos(t * 0.3) * 7 + 3;
      rimLight.intensity = 2 + Math.sin(t * 0.6) * 0.6;
      accentLight.position.y = 5 + Math.sin(t * 0.4) * 2;

      renderer.render(scene, camera);
    };
    animate();

    // --- Resize ---
    const onResize = () => {
      if (!mount.clientWidth || !mount.clientHeight) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // --- Cleanup ---
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      centralGeo.dispose();
      orbitGeos.forEach(g => g.dispose());
      goldMaterial.dispose();
      pGeo.dispose();
      pMat.dispose();
      pTexture.dispose();
      renderer.dispose();
    };
  }, [reducedMotion]);

  return createPortal(
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <StaticGoldWash />
      {!reducedMotion && (
        <div
          ref={mountRef}
          style={{ position: 'absolute', inset: 0, opacity: 0.6 }}
        />
      )}
    </div>,
    document.body
  );
}
