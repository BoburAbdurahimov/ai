'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float, PerspectiveCamera } from '@react-three/drei';
import { BackupSphere } from './BackupSphere';
import { Suspense } from 'react';

interface BackupVisualizationProps {
  backupCount?: number;
  systemStatus?: 'healthy' | 'warning' | 'error';
  className?: string;
}

export function BackupVisualization({ 
  backupCount = 5, 
  systemStatus = 'healthy',
  className = ''
}: BackupVisualizationProps) {
  return (
    <div className={`w-full h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 ${className}`}>
      <Canvas>
        <Suspense fallback={null}>
          {/* Camera */}
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />
          
          {/* Background stars */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          {/* Main backup sphere */}
          <Float
            speed={2}
            rotationIntensity={0.5}
            floatIntensity={0.5}
          >
            <BackupSphere position={[0, 0, 0]} status={systemStatus} scale={1.2} />
          </Float>
          
          {/* Surrounding backup orbs */}
          {Array.from({ length: Math.min(backupCount, 8) }).map((_, i) => {
            const angle = (i / backupCount) * Math.PI * 2;
            const radius = 3;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            return (
              <Float
                key={i}
                speed={1.5 + i * 0.2}
                rotationIntensity={0.3}
                floatIntensity={0.3}
              >
                <BackupSphere 
                  position={[x, 0, z]} 
                  status="healthy" 
                  scale={0.4}
                />
              </Float>
            );
          })}
          
          {/* Controls */}
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
