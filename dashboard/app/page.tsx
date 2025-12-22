import { StatusWidget } from '@/components/StatusWidget';
import { BackupList } from '@/components/BackupList';
import { CreateBackupButton } from '@/components/CreateBackupButton';
import { Package, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dynamic from 'next/dynamic';

// Dynamically import 3D components (client-side only)
const BackupVisualization = dynamic(
  () => import('@/components/3d/BackupVisualization').then(mod => mod.BackupVisualization),
  { ssr: false, loading: () => <div className="w-full h-[400px] rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 animate-pulse" /> }
);

const AnimatedBackground = dynamic(
  () => import('@/components/3d/AnimatedBackground').then(mod => mod.AnimatedBackground),
  { ssr: false }
);

export default function DashboardPage() {
  return (
    <>
      {/* Animated particle background */}
      <AnimatedBackground />
      
      <div className="space-y-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage your backup system
            </p>
          </div>
          <CreateBackupButton />
        </div>

        {/* 3D Backup Visualization */}
        <Card className="overflow-hidden border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🌌</span>
              Backup System Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <BackupVisualization backupCount={5} systemStatus="healthy" />
          </CardContent>
        </Card>

        {/* System Status */}
        <StatusWidget />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
              <Package className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">-</div>
              <p className="text-xs text-muted-foreground">
                Available for restore
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
              <Clock className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">-</div>
              <p className="text-xs text-muted-foreground">
                Time since last backup
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">-</div>
              <p className="text-xs text-muted-foreground">
                Total backup size
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Backups */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Recent Backups</h2>
            <a 
              href="/backups" 
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View all →
            </a>
          </div>
          <BackupList />
        </div>
      </div>
    </>
  );
}
