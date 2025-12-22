/**
 * 3D Usage Visualization - Interactive Usage Metrics
 * Shows usage data as interactive 3D sphere
 */

'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

interface UsageVisualization3DProps {
  percentage: number;
  label?: string;
  color?: string;
}

function UsageSphere({ 
  percentage, 
  color = '#3b82f6' 
}: { 
  percentage: number; 
  color?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  const fillHeight = (percentage / 100) * 2 - 1; // -1 to 1 range

  return (
    <group>
      {/* Outer glow */}
      <Sphere ref={glowRef} args={[1.1, 32, 32]}>
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.1} 
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Main sphere */}
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.3}
          roughness={0.2}
          metalness={0.8}
          wireframe
        />
      </Sphere>

      {/* Fill indicator */}
      <mesh position={[0, fillHeight, 0]}>
        <sphereGeometry args={[1, 64, 64, 0, Math.PI * 2, 0, Math.PI]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.6}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Percentage text */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {percentage.toFixed(0)}%
        </Text>
      </Float>
    </group>
  );
}

export function UsageVisualization3D({
  percentage,
  label = 'Usage',
  color = '#3b82f6',
}: UsageVisualization3DProps) {
  return (
    <div className="w-full h-64 relative">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <UsageSphere percentage={percentage} color={color} />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
      
      {label && (
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="text-sm font-semibold text-muted-foreground">
            {label}
          </p>
        </div>
      )}
    </div>
  );
}
