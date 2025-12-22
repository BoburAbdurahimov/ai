'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Download, RotateCcw, Eye, RefreshCw } from 'lucide-react';
import { getRelativeTime } from '@/lib/utils';
import { RestoreDialog } from './RestoreDialog';

interface Backup {
  name: string;
  path: string;
  date: string;
  size: string;
}

export function BackupList() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);

  useEffect(() => {
    fetchBackups();
  }, []);

  async function fetchBackups() {
    setLoading(true);
    try {
      const res = await fetch('/api/backups/list');
      const data = await res.json();
      if (data.success) {
        setBackups(data.backups || []);
      }
    } catch (error) {
      console.error('Failed to fetch backups:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleRestore(backup: Backup) {
    setSelectedBackup(backup);
    setShowRestoreDialog(true);
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (backups.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No backups found</h3>
          <p className="text-muted-foreground mb-6">
            Create your first backup to get started
          </p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {backups.map((backup) => (
          <Card key={backup.name} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base font-mono flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    {backup.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {getRelativeTime(backup.date)}
                  </p>
                </div>
                <Badge variant="outline">{backup.size}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(backup.date).toLocaleString()}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = `/backups/${backup.name}`}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleRestore(backup)}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Restore
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedBackup && (
        <RestoreDialog
          backup={selectedBackup}
          open={showRestoreDialog}
          onClose={() => {
            setShowRestoreDialog(false);
            setSelectedBackup(null);
          }}
          onSuccess={fetchBackups}
        />
      )}
    </>
  );
}
