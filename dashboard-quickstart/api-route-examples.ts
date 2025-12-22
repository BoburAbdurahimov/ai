/**
 * Next.js API Route Examples
 * 
 * Place these in your dashboard/app/api/ directory
 */

// =============================================================================
// app/api/backups/list/route.ts
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { listBackups } from '@/lib/cli-wrapper';

export async function GET(request: NextRequest) {
  try {
    const backups = await listBackups();
    
    return NextResponse.json({
      success: true,
      backups,
      total: backups.length
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// =============================================================================
// app/api/backups/create/route.ts
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createBackup } from '@/lib/cli-wrapper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, compress } = body;

    const options: any = {
      compress: compress ?? true
    };

    if (type === 'database') options.dbOnly = true;
    if (type === 'config') options.configOnly = true;

    const result = await createBackup(options);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    // Optionally: Log to Supabase backups table
    // await logBackupToDatabase(result);

    return NextResponse.json({
      success: true,
      backup: {
        path: result.backupPath,
        metadata: result.metadata
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// =============================================================================
// app/api/backups/[id]/restore/route.ts
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { restoreBackup } from '@/lib/cli-wrapper';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { components, force } = body;

    // Construct backup path from ID
    const backupPath = `./backups/${params.id}`;

    const options: any = {
      input: backupPath,
      force: force ?? false
    };

    // Handle component selection
    if (components?.includes('database') && components.length === 1) {
      options.dbOnly = true;
    } else if (components?.includes('config') && components.length === 1) {
      options.configOnly = true;
    }

    const result = await restoreBackup(options);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    // Optionally: Log restore operation to database
    // await logRestoreOperation(params.id, result);

    return NextResponse.json({
      success: true,
      restored: result.restored
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// =============================================================================
// app/api/backups/[id]/details/route.ts
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { validateBackup } from '@/lib/cli-wrapper';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backupPath = path.join(process.cwd(), '..', 'backups', params.id);
    
    // Validate and get backup info
    const validation = await validateBackup(backupPath);
    
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: 'Invalid backup' },
        { status: 404 }
      );
    }

    // Get file sizes
    const stats = await fs.stat(backupPath);
    
    return NextResponse.json({
      success: true,
      backup: {
        id: params.id,
        name: params.id,
        path: backupPath,
        createdAt: validation.metadata?.timestamp,
        components: validation.components,
        metadata: validation.metadata,
        size: stats.size
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// =============================================================================
// app/api/status/health/route.ts
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getStatus } from '@/lib/cli-wrapper';

export async function GET(request: NextRequest) {
  try {
    const verbose = request.nextUrl.searchParams.get('verbose') === 'true';
    const status = await getStatus(verbose);

    return NextResponse.json({
      success: true,
      status
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// =============================================================================
// app/api/backups/schedule/route.ts (Bonus: Scheduled backups)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('backup_schedules')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      schedules: data
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, cronExpression, backupType, retentionDays } = body;

    const { data, error } = await supabase
      .from('backup_schedules')
      .insert([{
        name,
        cron_expression: cronExpression,
        backup_type: backupType,
        retention_days: retentionDays || 30,
        enabled: true
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      schedule: data
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// =============================================================================
// Middleware Example: Authentication (Optional)
// =============================================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for authentication token
  const token = request.cookies.get('auth-token');
  
  if (!token && request.nextUrl.pathname.startsWith('/api/backups')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/backups/:path*'
};
