'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, Settings, Cloud, Zap, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import for 3D globe
const StatusGlobe = dynamic(
  () => import('@/components/3d/StatusGlobe').then(mod => ({ default: mod.StatusGlobe })),
  { ssr: false }
);

const Canvas = dynamic(
  () => import('@react-three/fiber').then(mod => mod.Canvas),
  { ssr: false }
);

export default function StatusPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    fetchStatus();
  }, []);

  async function fetchStatus() {
    setLoading(true);
    try {
      const res = await fetch('/api/status/health?verbose=true');
      const data = await res.json();
      if (data.success) {
        setStatus(data.status);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch status:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-8 bg-muted rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="h-24 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
        <h2 className="text-2xl font-bold mb-2">Failed to Load Status</h2>
        <p className="text-muted-foreground mb-6">
          Unable to retrieve system status
        </p>
        <Button onClick={fetchStatus}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  const isHealthy = status.database?.connected && 
                    status.config?.complete && 
                    status.deployment?.healthy;

  const globeStatus = isHealthy ? 'healthy' : (status.database?.connected ? 'warning' : 'error');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Status</h1>
          <p className="text-muted-foreground mt-1">
            Detailed health check of all components
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Updated {lastUpdate.toLocaleTimeString()}
          </span>
          <Button onClick={fetchStatus} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* 3D Status Globe */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🌍</span>
            System Health Visualization
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />
            <StatusGlobe status={globeStatus} />
          </Canvas>
        </CardContent>
      </Card>

      {/* Overall Status */}
      <Card className={isHealthy ? 'border-green-500' : 'border-yellow-500'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Overall System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant={isHealthy ? "success" : "warning"} className="text-lg px-4 py-2">
              {isHealthy ? '🟢 All Systems Operational' : '🟡 Some Issues Detected'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Database Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Connection Status</span>
              {status.database?.connected ? (
                <Badge variant="success" className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  Disconnected
                </Badge>
              )}
            </div>

            {status.database?.connected && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Tables</span>
                  <span className="font-mono">{status.database.tables}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Records</span>
                  <span className="font-mono">{status.database.totalRecords?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Update</span>
                  <span className="text-sm">{status.database.lastUpdate || 'N/A'}</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              {status.config?.complete ? (
                <Badge variant="success" className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Complete
                </Badge>
              ) : (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  Incomplete
                </Badge>
              )}
            </div>

            {status.config?.missing?.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Missing Variables:</p>
                <div className="space-y-1">
                  {status.config.missing.map((varName: string) => (
                    <div key={varName} className="text-sm font-mono text-destructive">
                      • {varName}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Deployment Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Deployment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Health</span>
              {status.deployment?.healthy ? (
                <Badge variant="success" className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Healthy
                </Badge>
              ) : (
                <Badge variant="warning" className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {status.deployment?.status || 'Unknown'}
                </Badge>
              )}
            </div>

            {status.deployment?.url && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">URL</span>
                <a 
                  href={status.deployment.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {status.deployment.url}
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Services Status */}
      {status.services && Object.keys(status.services).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>External Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(status.services).map(([name, service]: [string, any]) => (
                <div key={name} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium capitalize">{name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{service.message}</span>
                    {service.status === 'ok' ? (
                      <Badge variant="success" className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        OK
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Error
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
