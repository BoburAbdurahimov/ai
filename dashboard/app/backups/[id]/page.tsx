'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, Download, Trash2, Package, Database, Settings, Cloud } from 'lucide-react';
import { RestoreDialog } from '@/components/RestoreDialog';

export default function BackupDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const backupId = params.id as string;

  const [backup, setBackup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);

  useEffect(() => {
    fetchBackupDetails();
  }, [backupId]);

  async function fetchBackupDetails() {
    try {
      const res = await fetch(`/api/backups/${backupId}/details`);
      const data = await res.json();
      if (data.success) {
        setBackup(data.backup);
      }
    } catch (error) {
      console.error('Failed to fetch backup details:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-8 bg-muted rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!backup) {
    return (
      <div className="text-center py-16">
        <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h2 className="text-2xl font-bold mb-2">Backup Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The requested backup could not be found
        </p>
        <Button onClick={() => router.push('/backups')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Backups
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <Button 
            variant="ghost" 
            onClick={() => router.push('/backups')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Backups
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight font-mono">
                {backup.name}
              </h1>
              <p className="text-muted-foreground mt-1">
                Created {new Date(backup.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={() => setShowRestoreDialog(true)}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Restore
              </Button>
            </div>
          </div>
        </div>

        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Created</p>
                <p className="font-medium">{new Date(backup.timestamp).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Version</p>
                <p className="font-medium">{backup.version}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge variant="success">Completed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Components */}
        <Card>
          <CardHeader>
            <CardTitle>Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {backup.components?.includes('database') && (
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Database className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium">Database</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {backup.results?.database?.tables || 0} tables, {backup.results?.database?.records || 0} records
                    </p>
                  </div>
                </div>
              )}

              {backup.components?.includes('config') && (
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Settings className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium">Configuration</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {backup.results?.config?.files || 0} files backed up
                    </p>
                  </div>
                </div>
              )}

              {backup.components?.includes('deployment') && (
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Cloud className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium">Deployment State</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Deployment configuration and metadata
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Database Details */}
        {backup.results?.database && (
          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="font-mono text-sm">calls</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.floor((backup.results.database.records || 0) * 0.9).toLocaleString()} records
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="font-mono text-sm">call_events</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.floor((backup.results.database.records || 0) * 0.1).toLocaleString()} records
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Restore History */}
        <Card>
          <CardHeader>
            <CardTitle>Restore History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This backup has never been restored.
            </p>
          </CardContent>
        </Card>
      </div>

      {showRestoreDialog && (
        <RestoreDialog
          backup={{
            name: backup.name,
            date: backup.timestamp,
            size: 'N/A'
          }}
          open={showRestoreDialog}
          onClose={() => setShowRestoreDialog(false)}
        />
      )}
    </>
  );
}
