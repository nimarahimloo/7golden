import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useApp } from '@/lib/AppContext';

/**
 * GoldenEssence — A unique 3D luxury showcase scene built with Three.js.
 * Floating golden nut sculptures (organic icosahedrons) with metallic gold
 * material, orbiting around a central "essence" shape, enveloped in a flowing
 * golden particle aura. Dynamic studio lighting creates shifting highlights
 * that convey pure luxury. Responds to mouse/touch with parallax camera.
 */
export default function GoldenEssence() {
  const mountRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const isFA = true;
  const headingFont = 'Peyda, serif';
  const subFont = 'Kalameh, serif';

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.innerWidth < 768;

    // --- Scene ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 13);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    mount.appendChild(renderer.domElement);

    // --- Lights — golden studio ---
    scene.add(new THREE.AmbientLight(0x1a1208, 0.4));

    const keyLight = new THREE.PointLight(0xF0CE5A, 3.5, 35);
    keyLight.position.set(6, 5, 6);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x3a2a18, 1.2, 30);
    fillLight.position.set(-6, -4, 5);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xFFE8A0, 2.5, 25);
    rimLight.position.set(0, 2, -9);
    scene.add(rimLight);

    const accentLight = new THREE.PointLight(0xD4A040, 1.8, 20);
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
    const particleCount = isMobile ? 250 : 600;
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

    // --- Interaction ---
    let mx = 0, my = 0;
    const onMouse = (e) => {
      const rect = mount.getBoundingClientRect();
      mx = (e.clientX - rect.left) / rect.width - 0.5;
      my = (e.clientY - rect.top) / rect.height - 0.5;
    };
    mount.addEventListener('mousemove', onMouse, { passive: true });

    let touchX = 0, touchY = 0;
    const onTouch = (e) => {
      if (e.touches.length > 0) {
        const rect = mount.getBoundingClientRect();
        touchX = (e.touches[0].clientX - rect.left) / rect.width - 0.5;
        touchY = (e.touches[0].clientY - rect.top) / rect.height - 0.5;
      }
    };
    mount.addEventListener('touchmove', onTouch, { passive: true });

    // --- Animation ---
    let frameId = null;
    let isActive = false;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!isActive) return;

      const t = clock.getElapsedTime();
      const tx = mx || touchX;
      const ty = my || touchY;

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
      camera.position.x += (tx * 3.5 - camera.position.x) * 0.03;
      camera.position.y += (-ty * 2.5 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      // Dynamic lighting — shifting highlights
      keyLight.position.x = Math.sin(t * 0.3) * 7;
      keyLight.position.z = Math.cos(t * 0.3) * 7 + 3;
      rimLight.intensity = 2 + Math.sin(t * 0.6) * 0.6;
      accentLight.position.y = 5 + Math.sin(t * 0.4) * 2;

      renderer.render(scene, camera);
    };

    // --- Visibility-based start/stop ---
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasActive = isActive;
        isActive = entry.isIntersecting;
        if (isActive && !wasActive) {
          if (!frameId) animate();
          setLoaded(true);
        } else if (!isActive && wasActive) {
          if (frameId) {
            cancelAnimationFrame(frameId);
            frameId = null;
          }
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(mount);

    // --- Resize ---
    const onResize = () => {
      if (!mount.clientWidth) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // --- Cleanup ---
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      observer.disconnect();
      mount.removeEventListener('mousemove', onMouse);
      mount.removeEventListener('touchmove', onTouch);
      window.removeEventListener('resize', onResize);
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
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #0a0703 0%, #020100 70%)',
        height: 'clamp(420px, 60vh, 640px)',
      }}
      dir="rtl"
    >
      <div
        ref={mountRef}
        style={{ position: 'absolute', inset: 0, zIndex: 1 }}
      />

      {/* <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(2,1,0,0.5) 80%, rgba(2,1,0,0.85) 100%)',
        }}
      /> */}

      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" style={{ zIndex: 3, pointerEvents: 'none' }}>
        <h2
          className={`font-heading text-6xl sm:text-4xl md:text-5xl font-black leading-[1.15] mb-4 gold-text-glow ${loaded ? 'text-reveal' : 'opacity-0'}`}
          style={{ color: '#fff', fontFamily: headingFont, animationDelay: '0.5s' }}
        >
          {isFA ? 'از باغ تا میز شما' : 'From Orchard to Your Table'}
        </h2>
        <p
          className={`font-body text-sm sm:text-base max-w-md leading-relaxed ${loaded ? 'text-rise' : 'opacity-0'}`}
          style={{ color: 'rgba(255,255,255,0.7)', animationDelay: '0.8s' }}
        >
          {isFA
            ? 'هر دانه، اثری از طلای طبیعت — انتخاب‌دست‌چین، خالص، و بی‌نظیر'
            : 'Every seed, a trace of nature\'s gold — hand-selected, pure, and unparalleled'}
        </p>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          zIndex: 2,
          height: '80px',
          background: 'linear-gradient(to bottom, transparent, var(--bg))',
        }}
      />
    </section>
  );
}