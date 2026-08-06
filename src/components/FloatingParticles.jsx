import React, { useRef, useMemo } from 'react';
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
  const { mouse } = useThree();

  const particleTexture = useMemo(() => createCircleTexture(), []);

  // Distribute particles along cosmic orbital trails (galaxy disc shape)
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorChoices = [
      new THREE.Color('#fbbf24'), // Gold/Amber
      new THREE.Color('#f59e0b'), // Warm Gold
      new THREE.Color('#d97706'), // Deep Orange/Amber
      new THREE.Color('#818cf8'), // Space Indigo (balancing color)
      new THREE.Color('#f8fafc')  // White Star
    ];

    for (let i = 0; i < count; i++) {
      // Group particles into concentric discs representing orbital lanes
      const orbitIndex = i % 6;
      const baseRadius = 1.0 + orbitIndex * 0.55 + Math.random() * 0.3;
      const theta = Math.random() * Math.PI * 2;

      // Position (creating a tilted, flat spiral disc structure)
      pos[i * 3] = Math.cos(theta) * baseRadius + (Math.random() - 0.5) * 0.15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.25; // Flat thickness
      pos[i * 3 + 2] = Math.sin(theta) * baseRadius + (Math.random() - 0.5) * 0.15;

      // Select warm stellar colors
      const chosenColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }

    return [pos, col];
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (pointsRef.current) {
      // Dynamic rotation of the star trails around the sun
      pointsRef.current.rotation.y = time * 0.03;
      
      // Gentle waving pulsation
      pointsRef.current.position.y = Math.sin(time * 0.4) * 0.05;

      // Mouse interactive drift
      const targetX = mouse.x * 0.3;
      const targetY = mouse.y * 0.3;
      pointsRef.current.position.x += (targetX - pointsRef.current.position.x) * 0.05;
      pointsRef.current.position.z += (targetY - pointsRef.current.position.z) * 0.05;
    }
  });

  return (
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
        opacity={0.75}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
