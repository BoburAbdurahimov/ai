import { BackupList } from '@/components/BackupList';
import { CreateBackupButton } from '@/components/CreateBackupButton';
import { Package } from 'lucide-react';

export default function BackupsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package className="w-8 h-8" />
            All Backups
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage all your system backups
          </p>
        </div>
        <CreateBackupButton />
      </div>

      {/* Backup List */}
      <BackupList />
    </div>
  );
}
