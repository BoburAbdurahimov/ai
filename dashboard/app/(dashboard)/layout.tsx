/**
 * Dashboard Layout - Main App Layout with Sidebar
 * Wraps all authenticated dashboard pages
 */

import { Suspense } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ParticleField3D } from '@/components/3d/ParticleField3D';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* 3D Particle Background */}
      <Suspense fallback={null}>
        <ParticleField3D />
      </Suspense>

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header />

          {/* Page Content */}
          <main className="flex-1 relative z-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
