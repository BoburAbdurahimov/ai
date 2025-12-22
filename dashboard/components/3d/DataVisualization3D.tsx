/**
 * 3D Data Visualization - Interactive Usage Chart
 * Shows usage trends as 3D bars/columns
 */

'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface DataVisualization3DProps {
  data: Array<{ label: string; value: number; color?: string }>;
  maxValue?: number;
}

function DataBars({ 
  data, 
  maxValue = 100 
}: { 
  data: Array<{ label: string; value: number; color?: string }>; 
  maxValue: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  const spacing = 1.5;
  const startX = -(data.length - 1) * spacing / 2;

  return (
    <group ref={groupRef}>
      {data.map((item, index) => {
        const height = (item.value / maxValue) * 3;
        const x = startX + index * spacing;
        const color = item.color || '#3b82f6';

        return (
          <group key={index} position={[x, 0, 0]}>
            {/* Bar */}
            <mesh position={[0, height / 2, 0]}>
              <boxGeometry args={[0.8, height, 0.8]} />
              <meshStandardMaterial
                color={color}
                metalness={0.6}
                roughness={0.3}
                emissive={color}
                emissiveIntensity={0.2}
              />
            </mesh>

            {/* Glow effect */}
            <mesh position={[0, height, 0]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshBasicMaterial color={color} transparent opacity={0.6} />
            </mesh>

            {/* Value label */}
            <Text
              position={[0, height + 0.5, 0]}
              fontSize={0.3}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {item.value}
            </Text>

            {/* X-axis label */}
            <Text
              position={[0, -0.5, 0]}
              fontSize={0.2}
              color="#94a3b8"
              anchorX="center"
              anchorY="middle"
              rotation={[-Math.PI / 2, 0, 0]}
            >
              {item.label}
            </Text>
          </group>
        );
      })}

      {/* Grid floor */}
      <gridHelper args={[10, 10, '#ffffff', '#ffffff']} position={[0, 0, 0]} />
    </group>
  );
}

export function DataVisualization3D({ 
  data, 
  maxValue 
}: DataVisualization3DProps) {
  const calculatedMax = maxValue || Math.max(...data.map(d => d.value));

  return (
    <div className="w-full h-96 relative glass rounded-2xl overflow-hidden">
      <Canvas
        camera={{ position: [0, 3, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, 5, -10]} intensity={0.5} color="#a855f7" />
        
        <DataBars data={data} maxValue={calculatedMax} />
        
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={5}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>

      <div className="absolute top-4 left-4 glass rounded-lg px-4 py-2 border border-border/50">
        <p className="text-sm font-semibold">Interactive 3D Chart</p>
        <p className="text-xs text-muted-foreground">Drag to rotate • Scroll to zoom</p>
      </div>
    </div>
  );
}
