'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSphere() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 32, 32]}>
      <meshStandardMaterial
        color="#00d9ff"
        emissive="#00d9ff"
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </Sphere>
  );
}

export default function PlaygroundScene() {
  return (
    <div className="w-full h-96 bg-muted rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <AnimatedSphere />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}

