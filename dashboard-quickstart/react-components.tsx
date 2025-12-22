/**
 * React Component Examples for Dashboard
 * 
 * Modern, production-ready components using Next.js 14, TypeScript, Tailwind
 */

// =============================================================================
// components/StatusWidget.tsx - System Health Display
// =============================================================================

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  async function fetchStatus() {
    try {
      const res = await fetch('/api/status/health');
      const data = await res.json();
      setStatus(data.status);
    } catch (error) {
      console.error('Failed to fetch status:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading status...</div>;
  }

  if (!status) {
    return <div className="text-red-500">Failed to load system status</div>;
  }

  const isHealthy = status.database.connected && 
                    status.config.complete && 
                    status.deployment.healthy;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Overall Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant={isHealthy ? "default" : "destructive"}>
              {isHealthy ? '🟢 Healthy' : '🔴 Issues Detected'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Database */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Database</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant={status.database.connected ? "default" : "destructive"}>
                {status.database.connected ? '🟢' : '🔴'}
              </Badge>
              <span className="text-sm">
                {status.database.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {status.database.totalRecords.toLocaleString()} records
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant={status.config.complete ? "default" : "destructive"}>
                {status.config.complete ? '🟢' : '🔴'}
              </Badge>
              <span className="text-sm">
                {status.config.complete ? 'Complete' : 'Incomplete'}
              </span>
            </div>
            {status.config.missing.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {status.config.missing.length} missing vars
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Deployment */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Deployment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant={status.deployment.healthy ? "default" : "destructive"}>
                {status.deployment.healthy ? '🟢' : '🔴'}
              </Badge>
              <span className="text-sm">{status.deployment.status}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// =============================================================================
// components/BackupList.tsx - List of Backups
// =============================================================================

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface Backup {
  name: string;
  path: string;
  date: string;
  size: string;
}

export function BackupList() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBackups();
  }, []);

  async function fetchBackups() {
    try {
      const res = await fetch('/api/backups/list');
      const data = await res.json();
      setBackups(data.backups || []);
    } catch (error) {
      console.error('Failed to fetch backups:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading backups...</div>;
  }

  if (backups.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-muted-foreground mb-4">No backups found</p>
          <Button onClick={() => window.location.href = '/backups/create'}>
            Create First Backup
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {backups.map((backup) => (
        <Card key={backup.name}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-mono">{backup.name}</CardTitle>
              <Badge variant="outline">{backup.size}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Created {formatDistanceToNow(new Date(backup.date), { addSuffix: true })}
                </p>
                <p className="text-xs text-muted-foreground">{backup.date}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button size="sm">
                  Restore
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// =============================================================================
// components/RestoreWizard.tsx - Multi-Step Restore Process
// =============================================================================

'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RestoreWizardProps {
  backup: {
    name: string;
    date: string;
    size: string;
  };
  open: boolean;
  onClose: () => void;
}

export function RestoreWizard({ backup, open, onClose }: RestoreWizardProps) {
  const [step, setStep] = useState(1);
  const [components, setComponents] = useState({
    database: true,
    config: true,
    deployment: true
  });
  const [confirmed, setConfirmed] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleRestore() {
    setRestoring(true);
    
    try {
      const res = await fetch(`/api/backups/${backup.name}/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          components: Object.keys(components).filter(k => components[k as keyof typeof components]),
          force: true
        })
      });

      const data = await res.json();
      
      if (data.success) {
        setResult(data.restored);
        setStep(5);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      alert('Restore failed: ' + error.message);
    } finally {
      setRestoring(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Restore Backup: {backup.name}</DialogTitle>
        </DialogHeader>

        {/* Step 1: Confirmation */}
        {step === 1 && (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                You are about to restore from backup: <strong>{backup.name}</strong>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Backup Details:</p>
              <ul className="text-sm space-y-1">
                <li>• Created: {backup.date}</li>
                <li>• Size: {backup.size}</li>
              </ul>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={() => setStep(2)}>Next →</Button>
            </div>
          </div>
        )}

        {/* Step 2: Component Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm">What do you want to restore?</p>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="database" 
                  checked={components.database}
                  onCheckedChange={(checked) => 
                    setComponents(prev => ({ ...prev, database: !!checked }))
                  }
                />
                <label htmlFor="database" className="text-sm font-medium">
                  Database (calls and call_events tables)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="config" 
                  checked={components.config}
                  onCheckedChange={(checked) => 
                    setComponents(prev => ({ ...prev, config: !!checked }))
                  }
                />
                <label htmlFor="config" className="text-sm font-medium">
                  Configuration (.env, vercel.json, package.json)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="deployment" 
                  checked={components.deployment}
                  onCheckedChange={(checked) => 
                    setComponents(prev => ({ ...prev, deployment: !!checked }))
                  }
                />
                <label htmlFor="deployment" className="text-sm font-medium">
                  Deployment state
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>← Back</Button>
              <Button onClick={() => setStep(3)}>Next →</Button>
            </div>
          </div>
        )}

        {/* Step 3: Final Confirmation */}
        {step === 3 && (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                ⚠️ Warning: This will overwrite existing data!
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <p className="text-sm font-medium">Review your restore:</p>
              <ul className="text-sm space-y-1">
                <li>• Backup: {backup.name}</li>
                <li>• Created: {backup.date}</li>
                <li>• Components: {Object.keys(components).filter(k => components[k as keyof typeof components]).join(', ')}</li>
              </ul>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="confirm" 
                checked={confirmed}
                onCheckedChange={(checked) => setConfirmed(!!checked)}
              />
              <label htmlFor="confirm" className="text-sm">
                I understand this action cannot be undone
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>← Back</Button>
              <Button 
                onClick={handleRestore} 
                disabled={!confirmed || restoring}
                variant="destructive"
              >
                {restoring ? 'Restoring...' : 'Restore Now'}
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Success */}
        {step === 5 && result && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="text-4xl mb-2">✅</div>
              <h3 className="text-lg font-semibold">Restore Completed!</h3>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Summary:</p>
              <ul className="text-sm space-y-1">
                <li>• Tables restored: {result.tablesRestored}</li>
                <li>• Records restored: {result.recordsRestored}</li>
                <li>• Files restored: {result.filesRestored}</li>
              </ul>
            </div>

            <Alert>
              <AlertDescription>
                Next steps: Verify data integrity and test critical functionality
              </AlertDescription>
            </Alert>

            <div className="flex justify-end gap-2">
              <Button onClick={() => window.location.href = '/'}>
                View Status
              </Button>
              <Button variant="outline" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// =============================================================================
// components/CreateBackupButton.tsx - Quick Backup Creation
// =============================================================================

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function CreateBackupButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function createBackup() {
    setLoading(true);
    
    try {
      const res = await fetch('/api/backups/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'full',
          compress: true
        })
      });

      const data = await res.json();

      if (data.success) {
        alert('Backup created successfully!');
        router.refresh();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      alert('Failed to create backup: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={createBackup} disabled={loading}>
      {loading ? 'Creating...' : '📦 Create Backup'}
    </Button>
  );
}

// =============================================================================
// app/page.tsx - Dashboard Home Page
// =============================================================================

import { StatusWidget } from '@/components/StatusWidget';
import { BackupList } from '@/components/BackupList';
import { CreateBackupButton } from '@/components/CreateBackupButton';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Backup Management Dashboard</h1>
        <CreateBackupButton />
      </div>

      <StatusWidget />

      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Backups</h2>
        <BackupList />
      </div>
    </div>
  );
}
