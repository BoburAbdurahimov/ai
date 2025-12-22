import { NextRequest, NextResponse } from 'next/server';
import { restoreBackup } from '@/lib/cli-wrapper';
import { asyncHandler } from '@/lib/middleware/error-handler';
import { limiters, getClientId } from '@/lib/middleware/rate-limit';
import { validateBackupId, validateComponents } from '@/lib/validators';
import { logger } from '@/lib/logger';
import path from 'path';

export const POST = asyncHandler(async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const startTime = Date.now();

  // Strict rate limiting for restore (very expensive operation)
  const clientId = getClientId(request);
  await limiters.strict.check(3, clientId);

  const body = await request.json();
  const { components, force } = body;

  // Validation
  const backupId = validateBackupId(params.id);
  const validComponents = components ? validateComponents(components) : ['database', 'config', 'deployment'];

  const backupDir = process.env.BACKUP_DIR || path.join(process.cwd(), '..', 'backups');
  const backupPath = path.join(backupDir, backupId);

  const options: any = {
    input: backupPath,
    force: force ?? true
  };

  // Handle component selection
  if (validComponents.length === 1 && validComponents[0] === 'database') {
    options.dbOnly = true;
  } else if (validComponents.length === 1 && validComponents[0] === 'config') {
    options.configOnly = true;
  }

  logger.restore(backupId, 'started', {
    components: validComponents,
    force: options.force,
  });

  const result = await restoreBackup(options);

  if (!result.success) {
    logger.restore(backupId, 'failed', { error: result.error });
    throw new Error(result.error || 'Restore failed');
  }

  const duration = Date.now() - startTime;
  logger.restore(backupId, 'completed', {
    duration: `${duration}ms`,
    tablesRestored: result.restored?.tablesRestored,
    recordsRestored: result.restored?.recordsRestored,
    filesRestored: result.restored?.filesRestored,
  });

  return NextResponse.json({
    success: true,
    restored: result.restored
  });
});
