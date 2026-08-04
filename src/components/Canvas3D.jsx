import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import FloatingParticles from './FloatingParticles';
import InteractiveHeroMesh from './InteractiveHeroMesh';

// Camera position controller that animates based on active section
function SceneController({ activeSection }) {
  const { camera } = useThree();
  
  // Target position and rotation vector variables
  const targetPos = useRef(new THREE.Vector3(0, 0, 5.5));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    // Determine camera targets depending on scroll section
    switch (activeSection) {
      case 'summary':
        targetPos.current.set(0, 0, 5.5);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'experience':
        targetPos.current.set(-2.0, 0.5, 4.8);
        targetLookAt.current.set(0.5, 0, 0);
        break;
      case 'projects':
        targetPos.current.set(2.0, -0.8, 4.5);
        targetLookAt.current.set(-0.5, 0, 0);
        break;
      case 'skills':
        targetPos.current.set(0, 2.2, 5.0);
        targetLookAt.current.set(0, 0.8, 0);
        break;
      case 'certificates':
        targetPos.current.set(-1.8, -1.5, 4.2);
        targetLookAt.current.set(0.2, 0.2, 0);
        break;
      case 'contact':
        targetPos.current.set(0, 0, 6.2);
        targetLookAt.current.set(0, 0, 0);
        break;
      default:
        targetPos.current.set(0, 0, 5.5);
        targetLookAt.current.set(0, 0, 0);
    }
  }, [activeSection]);

  useFrame((state) => {
    // Smoothly lerp camera position
    camera.position.lerp(targetPos.current, 0.05);

    // Smoothly lerp look-at coordinate
    currentLookAt.current.lerp(targetLookAt.current, 0.05);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}

export default function Canvas3D({ activeSection }) {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 5.5], fov: 60 }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#8b5cf6" />
      <directionalLight position={[-10, -10, -5]} intensity={0.8} color="#d946ef" />
      <pointLight position={[0, 0, 2]} intensity={2.0} color="#6366f1" />

      {/* Cosmic background stars */}
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0.5} fade speed={1} />
      
      {/* Dynamic drifting particles */}
      <FloatingParticles count={400} />
      
      {/* 3D Orb centerpiece */}
      <InteractiveHeroMesh activeSection={activeSection} />

      {/* Animate camera views */}
      <SceneController activeSection={activeSection} />
    </Canvas>
  );
}
