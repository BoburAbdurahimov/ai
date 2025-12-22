'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface BackupSphereProps {
  position?: [number, number, number];
  status?: 'healthy' | 'warning' | 'error';
  scale?: number;
}

export function BackupSphere({ 
  position = [0, 0, 0], 
  status = 'healthy',
  scale = 1 
}: BackupSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Color based on status
  const colors = {
    healthy: '#10b981', // Green
    warning: '#f59e0b', // Yellow
    error: '#ef4444'    // Red
  };

  // Animate rotation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
      
      // Pulse effect on hover
      if (hovered) {
        meshRef.current.scale.setScalar(scale * (1 + Math.sin(state.clock.elapsedTime * 3) * 0.05));
      } else {
        meshRef.current.scale.setScalar(scale);
      }
    }
  });

  return (
    <Sphere
      ref={meshRef}
      position={position}
      args={[1, 64, 64]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <MeshDistortMaterial
        color={colors[status]}
        attach="material"
        distort={0.3}
        speed={1.5}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
}
