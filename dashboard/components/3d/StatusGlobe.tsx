'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, useTexture, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface StatusGlobeProps {
  status: 'healthy' | 'warning' | 'error';
  size?: number;
}

export function StatusGlobe({ status, size = 1.5 }: StatusGlobeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const colors = {
    healthy: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  };

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      
      // Pulsing effect
      const scale = size + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* Main sphere */}
      <Sphere ref={meshRef} args={[1, 32, 32]}>
        <meshStandardMaterial
          color={colors[status]}
          emissive={colors[status]}
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Glowing ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.3, 0.02, 16, 100]} />
        <meshBasicMaterial color={colors[status]} transparent opacity={0.5} />
      </mesh>

      {/* Sparkles for extra effect */}
      <Sparkles
        count={50}
        scale={3}
        size={2}
        speed={0.3}
        color={colors[status]}
      />
    </group>
  );
}
