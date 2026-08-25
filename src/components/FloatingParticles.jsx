import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Helper function to programmatically generate a circular glow texture
const createCircleTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.7)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);
  
  return new THREE.CanvasTexture(canvas);
};

export default function FloatingParticles({ count = 650 }) {
  const pointsRef = useRef();
  const ringMeshRef = useRef();
  const { mouse, clock } = useThree();

  const particleTexture = useMemo(() => createCircleTexture(), []);

  // Shockwave tracking state
  const shockwaveState = useRef({
    active: false,
    startTime: 0,
    origin: new THREE.Vector3(0, 0, 0)
  });

  // Base positions for spring restitution
  const [basePositions, currentPositions, colors] = useMemo(() => {
    const base = new Float32Array(count * 3);
    const curr = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorChoices = [
      new THREE.Color('#fbbf24'), // Gold/Amber
      new THREE.Color('#f59e0b'), // Warm Gold
      new THREE.Color('#d97706'), // Deep Orange/Amber
      new THREE.Color('#818cf8'), // Space Indigo (balancing color)
      new THREE.Color('#38bdf8'), // Cyan Spark
      new THREE.Color('#f8fafc')  // White Star
    ];

    for (let i = 0; i < count; i++) {
      // Group particles into concentric discs representing orbital lanes
      const orbitIndex = i % 13;
      const baseRadius = 1.0 + orbitIndex * 0.3 + Math.random() * 0.18;
      const theta = Math.random() * Math.PI * 2;

      // Position (creating a tilted, flat spiral disc structure)
      const x = Math.cos(theta) * baseRadius + (Math.random() - 0.5) * 0.15;
      const y = (Math.random() - 0.5) * 0.25;
      const z = Math.sin(theta) * baseRadius + (Math.random() - 0.5) * 0.15;

      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = z;

      curr[i * 3] = x;
      curr[i * 3 + 1] = y;
      curr[i * 3 + 2] = z;

      // Select warm stellar colors
      const chosenColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }

    return [base, curr, col];
  }, [count]);

  // Listen to window pointerdown for cosmic shockwave ripple
  useEffect(() => {
    const handlePointerDown = () => {
      shockwaveState.current = {
        active: true,
        startTime: clock.getElapsedTime(),
        origin: new THREE.Vector3(mouse.x * 4.0, mouse.y * 2.5, 0)
      };
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [mouse, clock]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (pointsRef.current) {
      // Dynamic rotation of the star trails around the sun
      pointsRef.current.rotation.y = time * 0.035;
      
      // Gentle waving pulsation
      pointsRef.current.position.y = Math.sin(time * 0.4) * 0.05;

      // Mouse interactive drift
      const targetX = mouse.x * 0.4;
      const targetY = mouse.y * 0.3;
      pointsRef.current.position.x += (targetX - pointsRef.current.position.x) * 0.05;
      pointsRef.current.position.z += (targetY - pointsRef.current.position.z) * 0.05;

      // Cosmic Shockwave Physics Calculation
      const posAttr = pointsRef.current.geometry.attributes.position;
      const array = posAttr.array;
      const sw = shockwaveState.current;

      let shockElapsed = 0;
      let waveRadius = 0;
      let waveStrength = 0;

      if (sw.active) {
        shockElapsed = time - sw.startTime;
        waveRadius = shockElapsed * 4.5;
        waveStrength = Math.max(0, 1.0 - shockElapsed / 1.5);

        if (shockElapsed > 1.5) {
          sw.active = false;
        }
      }

      // Update visible expanding shockwave ring
      if (ringMeshRef.current) {
        if (sw.active && shockElapsed > 0) {
          ringMeshRef.current.visible = true;
          ringMeshRef.current.position.copy(sw.origin);
          const currentRadius = Math.max(0.1, waveRadius);
          ringMeshRef.current.scale.set(currentRadius, currentRadius, 1);
          ringMeshRef.current.material.opacity = waveStrength * 0.8;
        } else {
          ringMeshRef.current.visible = false;
        }
      }

      // Continuous Mouse Gravity Attraction Point
      const mouse3D = new THREE.Vector3(mouse.x * 4.0, mouse.y * 2.5, 0);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        let px = array[i3];
        let py = array[i3 + 1];
        let pz = array[i3 + 2];

        // Base target position
        const bx = basePositions[i3];
        const by = basePositions[i3 + 1];
        const bz = basePositions[i3 + 2];

        // 1. Mouse Gravity Lean
        const gdx = mouse3D.x - px;
        const gdy = mouse3D.y - py;
        const gdz = mouse3D.z - pz;
        const gdist = Math.sqrt(gdx * gdx + gdy * gdy + gdz * gdz);
        if (gdist < 2.5 && gdist > 0.1) {
          const gforce = (1.0 - gdist / 2.5) * 0.015;
          px += gdx * gforce;
          py += gdy * gforce;
          pz += gdz * gforce;
        }

        // 2. Shockwave Pulse Deflection
        if (sw.active && waveStrength > 0) {
          const swdx = px - sw.origin.x;
          const swdy = py - sw.origin.y;
          const swdz = pz - sw.origin.z;
          const swdist = Math.sqrt(swdx * swdx + swdy * swdy + swdz * swdz);
          const distDiff = Math.abs(swdist - waveRadius);

          if (distDiff < 0.8 && swdist > 0.01) {
            const shockPush = (1.0 - distDiff / 0.8) * waveStrength * 0.08;
            px += (swdx / swdist) * shockPush;
            py += (swdy / swdist) * shockPush;
            pz += (swdz / swdist) * shockPush;
          }
        }

        // 3. Spring back toward original orbit with damping
        px += (bx - px) * 0.04;
        py += (by - py) * 0.04;
        pz += (bz - pz) * 0.04;

        array[i3] = px;
        array[i3 + 1] = py;
        array[i3 + 2] = pz;
      }

      posAttr.needsUpdate = true;
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[currentPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.13}
          map={particleTexture}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Visual 3D Cosmic Shockwave Ripple Ring */}
      <mesh ref={ringMeshRef} visible={false} rotation={[-Math.PI / 4, 0, 0]}>
        <ringGeometry args={[0.92, 1.0, 64]} />
        <meshBasicMaterial
          color="#fbbf24"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
