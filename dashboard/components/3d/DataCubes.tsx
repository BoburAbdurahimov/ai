'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text3D } from '@react-three/drei';
import * as THREE from 'three';

interface DataCubeProps {
  position: [number, number, number];
  label: string;
  value: number;
  color: string;
}

export function DataCube({ position, label, value, color }: DataCubeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const height = Math.max(value / 100, 0.5);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    }
  });

  return (
    <group position={position}>
      <RoundedBox
        ref={meshRef}
        args={[1, height, 1]}
        radius={0.1}
        smoothness={4}
      >
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
      </RoundedBox>
      
      {/* Label floating above */}
      <Text3D
        font="/fonts/helvetiker_regular.typeface.json"
        size={0.15}
        height={0.02}
        position={[-0.3, height + 0.5, 0]}
      >
        {label}
        <meshStandardMaterial color="#ffffff" />
      </Text3D>
    </group>
  );
}

interface DataCubesVisualizationProps {
  data: Array<{ label: string; value: number; color: string }>;
}

export function DataCubesVisualization({ data }: DataCubesVisualizationProps) {
  return (
    <>
      {data.map((item, i) => (
        <DataCube
          key={i}
          position={[(i - data.length / 2) * 2, 0, 0]}
          label={item.label}
          value={item.value}
          color={item.color}
        />
      ))}
    </>
  );
}
