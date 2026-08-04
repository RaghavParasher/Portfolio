import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function InteractiveHeroMesh({ activeSection }) {
  const groupRef = useRef();
  const innerMeshRef = useRef();
  const outerWireframeRef = useRef();
  const ringRef1 = useRef();
  const ringRef2 = useRef();

  const [hovered, setHovered] = useState(false);

  // Colors mapping for sections
  const getColors = () => {
    switch (activeSection) {
      case 'summary':
        return { inner: '#8b5cf6', outer: '#d946ef', ring: '#6366f1' };
      case 'experience':
        return { inner: '#6366f1', outer: '#8b5cf6', ring: '#d946ef' };
      case 'projects':
        return { inner: '#d946ef', outer: '#6366f1', ring: '#8b5cf6' };
      case 'skills':
        return { inner: '#8b5cf6', outer: '#d946ef', ring: '#6366f1' };
      case 'certificates':
        return { inner: '#6366f1', outer: '#8b5cf6', ring: '#d946ef' };
      case 'contact':
        return { inner: '#d946ef', outer: '#6366f1', ring: '#8b5cf6' };
      default:
        return { inner: '#8b5cf6', outer: '#d946ef', ring: '#6366f1' };
    }
  };

  const colors = getColors();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const speed = hovered ? 2.5 : 1.0;

    if (groupRef.current) {
      // Gentle overall group rotation and floating movement
      groupRef.current.position.y = Math.sin(time * 0.8) * 0.15;
      groupRef.current.rotation.y = time * 0.05 * speed;
    }

    if (innerMeshRef.current) {
      // Inner mesh breathing animation
      const scaleVal = 1.0 + Math.sin(time * 2.0) * 0.05;
      innerMeshRef.current.scale.set(scaleVal, scaleVal, scaleVal);
      innerMeshRef.current.rotation.x = time * 0.2;
    }

    if (outerWireframeRef.current) {
      // Rotate outer wireframe sphere in the opposite direction
      outerWireframeRef.current.rotation.y = -time * 0.15 * speed;
      outerWireframeRef.current.rotation.z = time * 0.08;
      
      const pulse = 1.25 + Math.cos(time * 1.5) * 0.06;
      outerWireframeRef.current.scale.set(pulse, pulse, pulse);
    }

    if (ringRef1.current) {
      // Rotate ring 1
      ringRef1.current.rotation.x = time * 0.4 * speed;
      ringRef1.current.rotation.y = time * 0.1;
    }

    if (ringRef2.current) {
      // Rotate ring 2 (different axis/speed)
      ringRef2.current.rotation.y = -time * 0.35 * speed;
      ringRef2.current.rotation.z = time * 0.2;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 1. Glowing Inner Tech Sphere */}
      <mesh ref={innerMeshRef}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshPhysicalMaterial
          color={colors.inner}
          roughness={0.15}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          transmission={0.6}
          thickness={0.8}
          ior={1.5}
        />
      </mesh>

      {/* 2. Outer Icosahedron Wireframe Cage */}
      <mesh ref={outerWireframeRef}>
        <icosahedronGeometry args={[1.0, 2]} />
        <meshBasicMaterial
          color={colors.outer}
          wireframe
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Orbiting Rings */}
      {/* Ring 1 - Vertical Orbit */}
      <mesh ref={ringRef1} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.5, 0.015, 8, 64]} />
        <meshBasicMaterial
          color={colors.ring}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ring 2 - Horizontal Orbit */}
      <mesh ref={ringRef2} rotation={[Math.PI / 2.5, Math.PI / 4, 0]}>
        <torusGeometry args={[1.7, 0.012, 6, 64]} />
        <meshBasicMaterial
          color={colors.outer}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
