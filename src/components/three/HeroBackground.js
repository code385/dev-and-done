'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function AnimatedParticles() {
  const ref = useRef();
  const count = 800;
  const [theme, setTheme] = useState('dark');
  
  // Get theme from document element class
  useEffect(() => {
    const updateTheme = () => {
      if (typeof window !== 'undefined') {
        const isLight = document.documentElement.classList.contains('light');
        setTheme(isLight ? 'light' : 'dark');
      }
    };
    
    updateTheme();
    
    // Watch for theme changes
    const observer = new MutationObserver(updateTheme);
    if (typeof window !== 'undefined') {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }
    
    return () => observer.disconnect();
  }, []);
  
  // Adjust particle color based on theme
  const particleColor = theme === 'light' ? '#604dc3' : '#80c4e9';
  const particleOpacity = theme === 'light' ? 0.8 : 0.6;
  const particleSize = theme === 'light' ? 0.08 : 0.05;
  
  // Create geometry with positions - ensure stable size
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.02;
      ref.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        transparent
        color={particleColor}
        size={particleSize}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={particleOpacity}
      />
    </points>
  );
}

export default function HeroBackground() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="absolute inset-0 -z-10 bg-background" />;
  }
  
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
      >
        <AnimatedParticles />
      </Canvas>
    </div>
  );
}

