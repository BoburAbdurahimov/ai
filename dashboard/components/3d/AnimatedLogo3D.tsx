/**
 * 3D Animated Logo - Interactive Brand Element
 * Rotating 3D logo with particles
 */

'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Trail, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function Logo3D() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <group ref={groupRef}>
        {/* Stack of cubes representing VoiceOps layers */}
        <Trail
          width={2}
          length={6}
          color="#a855f7"
          attenuation={(t) => t * t}
        >
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1, 0.2, 1]} />
            <meshStandardMaterial
              color="#3b82f6"
              metalness={0.8}
              roughness={0.2}
              emissive="#3b82f6"
              emissiveIntensity={0.2}
            />
          </mesh>
        </Trail>

        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.8, 0.2, 0.8]} />
          <meshStandardMaterial
            color="#a855f7"
            metalness={0.8}
            roughness={0.2}
            emissive="#a855f7"
            emissiveIntensity={0.2}
          />
        </mesh>

        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[0.6, 0.2, 0.6]} />
          <meshStandardMaterial
            color="#ec4899"
            metalness={0.8}
            roughness={0.2}
            emissive="#ec4899"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Sparkles for premium effect */}
        <Sparkles
          count={50}
          scale={3}
          size={2}
          speed={0.3}
          opacity={0.6}
          color="#ffffff"
        />
      </group>
    </Float>
  );
}

export function AnimatedLogo3D({ size = 200 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
        
        <Logo3D />
      </Canvas>
    </div>
  );
}
