import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function FloatingParticles({ count = 500 }) {
  const pointsRef = useRef();
  const { mouse } = useThree();

  // Create random particles coordinate array
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorChoices = [
      new THREE.Color('#8b5cf6'), // Purple
      new THREE.Color('#d946ef'), // Magenta
      new THREE.Color('#6366f1'), // Indigo
      new THREE.Color('#f8fafc')  // White/Glow
    ];

    for (let i = 0; i < count; i++) {
      // Distribute particles in a sphere/box
      const r = 4 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Random color selection
      const chosenColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }

    return [pos, col];
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Slow rotational drift
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.02;
      pointsRef.current.rotation.x = time * 0.01;

      // Mouse interactivity - particles drift slightly away/toward cursor coordinates
      const targetX = mouse.x * 0.5;
      const targetY = mouse.y * 0.5;
      
      pointsRef.current.position.x += (targetX - pointsRef.current.position.x) * 0.05;
      pointsRef.current.position.y += (targetY - pointsRef.current.position.y) * 0.05;
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
        size={0.06}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
