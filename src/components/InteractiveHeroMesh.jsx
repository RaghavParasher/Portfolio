import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function InteractiveHeroMesh({ activeSection }) {
  const groupRef = useRef();
  const sunRef = useRef();
  const coronaRef = useRef();
  const orbitsRef = useRef([]);

  // Data for the 6 planets representing your 6 projects
  const planetsData = [
    { name: 'PulseMeet', radius: 1.2, speed: 0.9, size: 0.14, color: '#c084fc' }, // Purple
    { name: 'SkillForge', radius: 1.7, speed: 0.7, size: 0.16, color: '#38bdf8' }, // Cyan/Blue
    { name: 'TaskManager', radius: 2.2, speed: 0.5, size: 0.18, color: '#f472b6' }, // Pink
    { name: 'StudyBuddy', radius: 2.7, speed: 0.35, size: 0.15, color: '#34d399' }, // Green
    { name: 'ChatApp', radius: 3.2, speed: 0.25, size: 0.17, color: '#fbbf24' }, // Yellow/Amber
    { name: 'EquiSplit', radius: 3.7, speed: 0.18, size: 0.13, color: '#818cf8' }, // Indigo
  ];

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Gentle overall solar system tilt and slow float
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.1;
      // Slight cosmic rotation of the system
      groupRef.current.rotation.x = Math.PI / 8; // Tilt toward camera slightly
    }

    if (sunRef.current) {
      // Rotate the Sun
      sunRef.current.rotation.y = time * 0.15;
      
      // Pulse scale
      const pulse = 1.0 + Math.sin(time * 2.5) * 0.02;
      sunRef.current.scale.set(pulse, pulse, pulse);
    }

    if (coronaRef.current) {
      // Corona glow pulses slightly out of sync
      const pulse = 1.06 + Math.cos(time * 2.0) * 0.03;
      coronaRef.current.scale.set(pulse, pulse, pulse);
      coronaRef.current.rotation.y = -time * 0.1;
    }

    // Orbit rotations
    orbitsRef.current.forEach((orbit, index) => {
      if (orbit) {
        // Rotate each group to revolve the planet around the sun
        orbit.rotation.y = time * planetsData[index].speed * 0.4;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* 1. The Sun (Central Profile Node) */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>

      {/* Sun Corona Glow */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[0.56, 32, 32]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Orbiting Planets (Projects) */}
      {planetsData.map((planet, index) => (
        <group key={planet.name} ref={(el) => (orbitsRef.current[index] = el)}>
          {/* Planet Orbit Path Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[planet.radius - 0.006, planet.radius + 0.006, 64]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.06}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Planet Sphere */}
          <mesh position={[planet.radius, 0, 0]}>
            <sphereGeometry args={[planet.size, 16, 16]} />
            <meshStandardMaterial
              color={planet.color}
              roughness={0.3}
              metalness={0.2}
              bumpScale={0.05}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
