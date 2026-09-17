import { useRef, useEffect } from 'react';
import * as THREE from 'three';

function makeGlowTexture(size, coreStop) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,252,235,1)');
  g.addColorStop(coreStop, 'rgba(240,206,90,0.55)');
  g.addColorStop(1, 'rgba(240,206,90,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

export default function GoldDustField() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.innerWidth < 768;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 600);
    camera.position.z = 60;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    mount.appendChild(renderer.domElement);

    const sharpTexture = makeGlowTexture(32, 0.18);
    const softTexture = makeGlowTexture(64, 0.4);

    const layers = [];

    function addLayer({ count, spreadX, spreadY, spreadZ, size, opacity, texture, speedY, phase }) {
      const positions = new Float32Array(count * 3);
      const velocities = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * spreadX;
        positions[i * 3 + 1] = (Math.random() - 0.5) * spreadY;
        positions[i * 3 + 2] = (Math.random() - 0.5) * spreadZ;
        velocities[i] = speedY * (0.6 + Math.random() * 0.8);
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({
        size,
        map: texture,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
        color: 0xF0CE5A,
      });
      const points = new THREE.Points(geometry, material);
      scene.add(points);
      layers.push({ points, geometry, material, velocities, baseOpacity: opacity, phase, spreadY });
    }

    addLayer({ count: isMobile ? 12 : 24, spreadX: 260, spreadY: 200, spreadZ: 160, size: isMobile ? 34 : 50, opacity: 0.1, texture: softTexture, speedY: 0.015, phase: 0 });
    addLayer({ count: isMobile ? 220 : 500, spreadX: 240, spreadY: 200, spreadZ: 120, size: isMobile ? 2.2 : 3, opacity: 0.75, texture: sharpTexture, speedY: 0.05, phase: 1.4 });
    addLayer({ count: isMobile ? 90 : 200, spreadX: 240, spreadY: 200, spreadZ: 120, size: isMobile ? 3.2 : 4.4, opacity: 0.55, texture: sharpTexture, speedY: 0.035, phase: 2.7 });
    addLayer({ count: isMobile ? 6 : 10, spreadX: 220, spreadY: 180, spreadZ: 100, size: isMobile ? 7 : 10, opacity: 0.9, texture: sharpTexture, speedY: 0.02, phase: 4.2 });

    let mx = 0, my = 0;
    const onMouse = (e) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    let visible = !document.hidden;
    const onVis = () => { visible = !document.hidden; };
    document.addEventListener('visibilitychange', onVis);

    let frameId;
    const clock = new THREE.Clock();
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!visible) return;
      const t = clock.getElapsedTime();

      layers.forEach((layer) => {
        const pos = layer.geometry.attributes.position.array;
        const half = layer.spreadY / 2;
        for (let i = 0; i < layer.velocities.length; i++) {
          pos[i * 3 + 1] += layer.velocities[i];
          if (pos[i * 3 + 1] > half) pos[i * 3 + 1] = -half;
        }
        layer.geometry.attributes.position.needsUpdate = true;
        layer.material.opacity = layer.baseOpacity * (0.65 + 0.35 * Math.sin(t * 0.9 + layer.phase));
      });

      camera.position.x += (mx * 8 - camera.position.x) * 0.03;
      camera.position.y += (-my * 8 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      layers.forEach((layer) => {
        layer.geometry.dispose();
        layer.material.dispose();
      });
      sharpTexture.dispose();
      softTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 5,
        pointerEvents: 'none',
      }}
    />
  );
}