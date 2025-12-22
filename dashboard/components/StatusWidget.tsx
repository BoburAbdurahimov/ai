'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Settings, Cloud, Zap, RefreshCw } from 'lucide-react';

interface SystemStatus {
  database: {
    connected: boolean;
    tables: number;
    totalRecords: number;
  };
  config: {
    complete: boolean;
    missing: string[];
  };
  deployment: {
    healthy: boolean;
    status: string;
  };
  services: Record<string, { status: string; message: string }>;
}

export function StatusWidget() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  async function fetchStatus() {
    try {
      const res = await fetch('/api/status/health');
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!status) {
    return (
      <Card className="border-destructive">
        <CardContent className="py-8 text-center">
          <p className="text-destructive mb-4">Failed to load system status</p>
          <button 
            onClick={fetchStatus}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Try again
          </button>
        </CardContent>
      </Card>
    );
  }

  const isHealthy = status.database.connected && 
                    status.config.complete && 
                    status.deployment.healthy;

  const servicesHealthy = Object.values(status.services).filter(
    s => s.status === 'ok'
  ).length;
  const totalServices = Object.keys(status.services).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">System Health</h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <RefreshCw className="w-3 h-3" />
          <span>Updated {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Overall Status */}
        <Card className={isHealthy ? 'border-green-500' : 'border-yellow-500'}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Overall Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={isHealthy ? "success" : "warning"}>
              {isHealthy ? '🟢 Healthy' : '🟡 Warning'}
            </Badge>
          </CardContent>
        </Card>

        {/* Database */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="w-4 h-4" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant={status.database.connected ? "success" : "destructive"}>
                {status.database.connected ? 'Connected' : 'Disconnected'}
              </Badge>
              {status.database.connected && (
                <p className="text-xs text-muted-foreground">
                  {status.database.totalRecords.toLocaleString()} records
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Configuration */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant={status.config.complete ? "success" : "destructive"}>
                {status.config.complete ? 'Complete' : 'Incomplete'}
              </Badge>
              {status.config.missing.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {status.config.missing.length} missing vars
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Cloud className="w-4 h-4" />
              Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant={servicesHealthy === totalServices ? "success" : "warning"}>
                {servicesHealthy}/{totalServices} OK
              </Badge>
              <p className="text-xs text-muted-foreground">
                External services
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
