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

export default function FloatingParticles({ count = 600 }) {
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
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
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
      const baseRadius = 1.0 + orbitIndex * 0.3 + Math.random() * 0.15;
      const theta = Math.random() * Math.PI * 2;

      // Position (creating a tilted, flat spiral disc structure)
      pos[i * 3] = Math.cos(theta) * baseRadius + (Math.random() - 0.5) * 0.15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.25;
      pos[i * 3 + 2] = Math.sin(theta) * baseRadius + (Math.random() - 0.5) * 0.15;

      // Select warm stellar colors
      const chosenColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }

    return [pos, col];
  }, [count]);

  // Listen to window pointerdown for cosmic shockwave ripple
  useEffect(() => {
    const handlePointerDown = (e) => {
      const mx = mouse ? mouse.x : 0;
      const my = mouse ? mouse.y : 0;
      shockwaveState.current = {
        active: true,
        startTime: clock ? clock.getElapsedTime() : 0,
        origin: new THREE.Vector3(mx * 3.5, my * 2.5, 0)
      };
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [mouse, clock]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const mx = state.pointer ? state.pointer.x : (state.mouse ? state.mouse.x : 0);
    const my = state.pointer ? state.pointer.y : (state.mouse ? state.mouse.y : 0);
    
    if (pointsRef.current) {
      // Dynamic rotation of the star trails around the sun
      pointsRef.current.rotation.y = time * 0.035;
      
      // Gentle waving pulsation
      pointsRef.current.position.y = Math.sin(time * 0.4) * 0.05;

      // Mouse interactive drift
      const targetX = mx * 0.35;
      const targetY = my * 0.25;
      pointsRef.current.position.x += (targetX - pointsRef.current.position.x) * 0.05;
      pointsRef.current.position.z += (targetY - pointsRef.current.position.z) * 0.05;

      // Safe shockwave scale pulse
      const sw = shockwaveState.current;
      if (sw.active) {
        const shockElapsed = time - sw.startTime;
        const waveRadius = shockElapsed * 4.0;
        const waveStrength = Math.max(0, 1.0 - shockElapsed / 1.4);

        if (shockElapsed > 1.4) {
          sw.active = false;
        }

        if (ringMeshRef.current) {
          ringMeshRef.current.visible = true;
          ringMeshRef.current.position.copy(sw.origin);
          const currentRadius = Math.max(0.1, waveRadius);
          ringMeshRef.current.scale.set(currentRadius, currentRadius, 1);
          if (ringMeshRef.current.material) {
            ringMeshRef.current.material.opacity = waveStrength * 0.75;
          }
        }
      } else if (ringMeshRef.current) {
        ringMeshRef.current.visible = false;
      }
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
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
