'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';

export function CreateBackupButton({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);

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
        alert(`Backup created successfully!\n\nName: ${data.backup.name}\nRecords: ${data.backup.metadata?.records || 0}`);
        onSuccess?.();
        window.location.reload();
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
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Creating...
        </>
      ) : (
        <>
          <Plus className="w-4 h-4 mr-2" />
          Create Backup
        </>
      )}
    </Button>
  );
}
