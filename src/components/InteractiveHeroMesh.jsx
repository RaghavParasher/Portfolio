import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 1. Procedural Sun Texture Generator
const createSunTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Multi-colored radial gradient for sun surface
  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.15, '#fffbeb');
  grad.addColorStop(0.35, '#fbbf24'); // Yellow/Gold
  grad.addColorStop(0.65, '#f59e0b'); // Amber
  grad.addColorStop(0.85, '#d97706'); // Deep Orange
  grad.addColorStop(1.0, '#78350f');  // Dark Corona Edge
  
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Draw simulated solar noise/flares
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = '#ea580c';
  for (let i = 0; i < 180; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const r = 3 + Math.random() * 10;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw details (dark spots)
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = '#000000';
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const r = 1 + Math.random() * 3;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
};

// 2. Procedural Sun Corona Glow Sprite Map
const createGlowTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.2, 'rgba(251, 191, 36, 0.7)');
  grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.25)');
  grad.addColorStop(0.9, 'rgba(217, 119, 6, 0.05)');
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  return new THREE.CanvasTexture(canvas);
};

// 3. Procedural Planet Texture Generator
const createProceduralTexture = (baseColorHex, type) => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Set base color
  ctx.fillStyle = baseColorHex;
  ctx.fillRect(0, 0, 128, 128);

  ctx.globalAlpha = 0.25;
  if (type === 'gas') {
    // Jupiter-like gaseous bands
    for (let y = 0; y < 128; y += 4) {
      ctx.fillStyle = Math.random() > 0.55 ? '#ffffff' : '#000000';
      ctx.fillRect(0, y, 128, 2 + Math.random() * 5);
    }
  } else if (type === 'craters') {
    // Moon/Mars rocky craters
    ctx.fillStyle = '#000000';
    for (let i = 0; i < 25; i++) {
      const x = Math.random() * 128;
      const y = Math.random() * 128;
      const r = 2 + Math.random() * 5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    // Highlight edges of craters
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 128;
      const y = Math.random() * 128;
      const r = 1 + Math.random() * 3;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Marbled wavy oceans/clouds (Earth-like)
    for (let i = 0; i < 15; i++) {
      ctx.strokeStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
      ctx.lineWidth = 1 + Math.random() * 4;
      ctx.beginPath();
      for (let x = 0; x < 128; x++) {
        const y = 64 + Math.sin(x * 0.08 + i) * 25 + (Math.random() - 0.5) * 4;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  // Overlay sphere shading (spherical lighting simulator)
  const grad = ctx.createLinearGradient(0, 0, 128, 0);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
  ctx.fillStyle = grad;
  ctx.globalAlpha = 1.0;
  ctx.fillRect(0, 0, 128, 128);

  return new THREE.CanvasTexture(canvas);
};

export default function InteractiveHeroMesh({ activeSection }) {
  const groupRef = useRef();
  const sunRef = useRef();
  const orbitsRef = useRef([]);

  // Data for the 13 planets representing your 13 projects
  const planetsData = useMemo(() => [
    { name: 'PulseMeet', radius: 1.15, speed: 1.1, size: 0.08, color: '#c084fc', type: 'marble' },   // Purple
    { name: 'SkillForge', radius: 1.45, speed: 0.95, size: 0.09, color: '#38bdf8', type: 'gas' },    // Cyan
    { name: 'TaskManager', radius: 1.75, speed: 0.8, size: 0.10, color: '#f472b6', type: 'craters' },// Pink
    { name: 'StudyBuddy', radius: 2.05, speed: 0.7, size: 0.085, color: '#34d399', type: 'marble' }, // Green
    { name: 'Pulse-Chat', radius: 2.35, speed: 0.6, size: 0.095, color: '#fbbf24', type: 'gas' },    // Yellow
    { name: 'EquiSplit', radius: 2.65, speed: 0.52, size: 0.08, color: '#818cf8', type: 'craters' },  // Indigo
    { name: 'Pipeline-IQ', radius: 2.95, speed: 0.45, size: 0.11, color: '#f43f5e', type: 'marble' },// Rose
    { name: 'EcoPulse', radius: 3.25, speed: 0.39, size: 0.10, color: '#10b981', type: 'gas' },     // Green/Teal
    { name: 'CogniPath', radius: 3.55, speed: 0.33, size: 0.085, color: '#a78bfa', type: 'craters' },// Lavender
    { name: 'MedAssist', radius: 3.85, speed: 0.28, size: 0.09, color: '#06b6d4', type: 'marble' },  // Light Blue
    { name: 'PixelForge', radius: 4.15, speed: 0.23, size: 0.095, color: '#00f2fe', type: 'gas' },   // Teal/Mint
    { name: 'CanopyWatch', radius: 4.45, speed: 0.19, size: 0.10, color: '#f97316', type: 'craters' },// Orange
    { name: 'ScribeGlass', radius: 4.75, speed: 0.15, size: 0.09, color: '#d946ef', type: 'marble' } // Magenta
  ], []);

  // Memoize all procedural textures
  const sunTexture = useMemo(() => createSunTexture(), []);
  const glowTexture = useMemo(() => createGlowTexture(), []);
  
  const planetTextures = useMemo(() => {
    return planetsData.map(planet => createProceduralTexture(planet.color, planet.type));
  }, [planetsData]);

  const shockPulseRef = useRef(1.0);

  // Add click pulse listener
  useEffect(() => {
    const handlePointerDown = () => {
      shockPulseRef.current = 1.35; // Trigger shockwave pulse on planets & sun
    };
    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const px = state.pointer ? state.pointer.x : (state.mouse ? state.mouse.x : 0);
    const py = state.pointer ? state.pointer.y : (state.mouse ? state.mouse.y : 0);

    // Lerp shockwave pulse back to normal scale
    shockPulseRef.current = THREE.MathUtils.lerp(shockPulseRef.current, 1.0, 0.06);

    if (groupRef.current) {
      // Gentle overall solar system drift + mouse gravity tilt
      groupRef.current.position.y = Math.sin(time * 0.4) * 0.12;
      
      // Slipped tilted perspective with mouse gravity interaction
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.PI / 4.8 + py * 0.15, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, px * 0.22, 0.05);
      groupRef.current.rotation.z = -Math.PI / 16;
    }

    if (sunRef.current) {
      // Rotate the Sun & apply pulse
      sunRef.current.rotation.y = time * 0.12;
      const s = shockPulseRef.current || 1.0;
      sunRef.current.scale.set(s, s, s);
    }

    // Orbit rotations with smooth speed and subtle orbital breathing
    orbitsRef.current.forEach((orbit, index) => {
      if (orbit) {
        orbit.rotation.y = time * planetsData[index].speed * 0.35;
      }
    });
  });

  return (
    <group ref={groupRef}>
      
      {/* 1. Sun Corona Glow Sprite (Soft Halo effect) */}
      <sprite scale={[1.85, 1.85, 1.0]}>
        <spriteMaterial
          map={glowTexture}
          color="#fbbf24"
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      {/* 2. The Sun centerpiece */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial map={sunTexture} />
      </mesh>

      {/* 3. Orbiting Planets (Projects) */}
      {planetsData.map((planet, index) => (
        <group key={planet.name} ref={(el) => (orbitsRef.current[index] = el)}>
          {/* Planet Orbit Path Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[planet.radius - 0.005, planet.radius + 0.005, 96]} />
            <meshBasicMaterial
              color="#fbbf24"
              transparent
              opacity={0.065}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Planet Sphere */}
          <mesh position={[planet.radius, 0, 0]} rotation={[0, Math.random() * Math.PI, 0]}>
            <sphereGeometry args={[planet.size, 32, 32]} />
            <meshStandardMaterial
              map={planetTextures[index]}
              roughness={0.45}
              metalness={0.15}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
