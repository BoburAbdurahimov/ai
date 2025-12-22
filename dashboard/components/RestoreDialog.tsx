'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Loader2, Database, Settings, Cloud } from 'lucide-react';

interface RestoreDialogProps {
  backup: {
    name: string;
    date: string;
    size: string;
  };
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function RestoreDialog({ backup, open, onClose, onSuccess }: RestoreDialogProps) {
  const [step, setStep] = useState(1);
  const [components, setComponents] = useState({
    database: true,
    config: true,
    deployment: true
  });
  const [restoring, setRestoring] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRestore() {
    setRestoring(true);
    setError(null);
    
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
        setStep(4);
        onSuccess?.();
      } else {
        throw new Error(data.error || 'Restore failed');
      }
    } catch (error: any) {
      setError(error.message);
      setStep(1);
    } finally {
      setRestoring(false);
    }
  }

  function handleClose() {
    setStep(1);
    setResult(null);
    setError(null);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Restore Backup</DialogTitle>
          <DialogDescription>
            Restore your system from: <strong>{backup.name}</strong>
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Confirmation */}
        {step === 1 && (
          <div className="space-y-6 py-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium">Backup Information</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• Created: {new Date(backup.date).toLocaleString()}</p>
                <p>• Size: {backup.size}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button onClick={() => setStep(2)}>Next →</Button>
            </div>
          </div>
        )}

        {/* Step 2: Component Selection */}
        {step === 2 && (
          <div className="space-y-6 py-4">
            <div>
              <h4 className="font-medium mb-4">What do you want to restore?</h4>

              <div className="space-y-3">
                <label className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <input
                    type="checkbox"
                    checked={components.database}
                    onChange={(e) => setComponents(prev => ({ ...prev, database: e.target.checked }))}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-medium">
                      <Database className="w-4 h-4" />
                      Database
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Restore calls and call_events tables
                    </p>
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <input
                    type="checkbox"
                    checked={components.config}
                    onChange={(e) => setComponents(prev => ({ ...prev, config: e.target.checked }))}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-medium">
                      <Settings className="w-4 h-4" />
                      Configuration
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Restore .env, vercel.json, and package.json
                    </p>
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <input
                    type="checkbox"
                    checked={components.deployment}
                    onChange={(e) => setComponents(prev => ({ ...prev, deployment: e.target.checked }))}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-medium">
                      <Cloud className="w-4 h-4" />
                      Deployment State
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Restore deployment configuration
                    </p>
                  </div>
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
          <div className="space-y-6 py-4">
            <div className="bg-destructive/10 border border-destructive rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Warning</p>
                <p className="text-sm text-destructive/80 mt-1">
                  This action will overwrite existing data and cannot be undone.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Review your restore:</h4>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                <p>• Backup: <strong>{backup.name}</strong></p>
                <p>• Created: {new Date(backup.date).toLocaleString()}</p>
                <p>• Components: {Object.keys(components).filter(k => components[k as keyof typeof components]).join(', ')}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>← Back</Button>
              <Button 
                onClick={handleRestore} 
                disabled={restoring}
                variant="destructive"
              >
                {restoring ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Restoring...
                  </>
                ) : (
                  'Restore Now'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && result && (
          <div className="space-y-6 py-4">
            <div className="text-center py-4">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold mb-2">Restore Completed!</h3>
              <p className="text-muted-foreground">
                Your system has been successfully restored
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium">Summary</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• Tables restored: {result.tablesRestored}</p>
                <p>• Records restored: {result.recordsRestored.toLocaleString()}</p>
                <p>• Files restored: {result.filesRestored}</p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Next steps:</strong> Verify data integrity, test critical functionality, and monitor system status.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                View Status
              </Button>
              <Button onClick={handleClose}>
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
