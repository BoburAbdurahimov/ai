/**
 * CLI Wrapper - Executes CLI commands from Next.js API routes
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

const CLI_PATH = process.env.CLI_PATH || path.join(process.cwd(), '..', 'cli', 'index.js');
const BACKUP_DIR = process.env.BACKUP_DIR || path.join(process.cwd(), '..', 'backups');

export interface BackupResult {
  success: boolean;
  backupPath?: string;
  backupName?: string;
  error?: string;
  metadata?: {
    tables: number;
    records: number;
    files: number;
  };
}

export interface RestoreResult {
  success: boolean;
  error?: string;
  restored?: {
    tablesRestored: number;
    recordsRestored: number;
    filesRestored: number;
  };
}

export interface StatusResult {
  database: {
    connected: boolean;
    tables: number;
    totalRecords: number;
    lastUpdate: string;
  };
  config: {
    complete: boolean;
    missing: string[];
  };
  deployment: {
    healthy: boolean;
    status: string;
    url: string | null;
  };
  services: Record<string, {
    status: string;
    message: string;
  }>;
}

export interface BackupInfo {
  name: string;
  path: string;
  date: string;
  size: string;
  timestamp?: string;
}

/**
 * Create a backup
 */
export async function createBackup(options: {
  output?: string;
  dbOnly?: boolean;
  configOnly?: boolean;
  compress?: boolean;
}): Promise<BackupResult> {
  try {
    let command = `node "${CLI_PATH}" backup`;
    
    const output = options.output || BACKUP_DIR;
    command += ` --output "${output}"`;
    
    if (options.dbOnly) command += ' --db-only';
    if (options.configOnly) command += ' --config-only';
    if (options.compress) command += ' --compress';

    const { stdout, stderr } = await execAsync(command, {
      env: { ...process.env },
      maxBuffer: 10 * 1024 * 1024
    });

    // Parse output
    const backupPathMatch = stdout.match(/Backup location: (.+)/);
    const backupPath = backupPathMatch ? backupPathMatch[1].trim() : null;
    
    const backupName = backupPath ? path.basename(backupPath) : null;

    const tablesMatch = stdout.match(/(\d+) tables/);
    const recordsMatch = stdout.match(/(\d+) records/);
    const filesMatch = stdout.match(/(\d+) files/);

    return {
      success: true,
      backupPath: backupPath || undefined,
      backupName: backupName || undefined,
      metadata: {
        tables: tablesMatch ? parseInt(tablesMatch[1]) : 0,
        records: recordsMatch ? parseInt(recordsMatch[1]) : 0,
        files: filesMatch ? parseInt(filesMatch[1]) : 0
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Restore from backup
 */
export async function restoreBackup(options: {
  input: string;
  dbOnly?: boolean;
  configOnly?: boolean;
  force?: boolean;
}): Promise<RestoreResult> {
  try {
    let command = `node "${CLI_PATH}" restore --input "${options.input}" --force`;
    
    if (options.dbOnly) command += ' --db-only';
    if (options.configOnly) command += ' --config-only';

    const { stdout, stderr } = await execAsync(command, {
      env: { ...process.env },
      maxBuffer: 10 * 1024 * 1024,
      timeout: 300000 // 5 minutes
    });

    // Parse results
    const tablesMatch = stdout.match(/(\d+) tables/);
    const recordsMatch = stdout.match(/(\d+) records/);
    const filesMatch = stdout.match(/(\d+) files/);

    return {
      success: true,
      restored: {
        tablesRestored: tablesMatch ? parseInt(tablesMatch[1]) : 0,
        recordsRestored: recordsMatch ? parseInt(recordsMatch[1]) : 0,
        filesRestored: filesMatch ? parseInt(filesMatch[1]) : 0
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get system status
 */
export async function getStatus(verbose: boolean = false): Promise<StatusResult | null> {
  try {
    let command = `node "${CLI_PATH}" status --json`;
    if (verbose) command += ' --verbose';

    const { stdout } = await execAsync(command, {
      env: { ...process.env },
      timeout: 30000
    });

    // Find JSON in output
    const lines = stdout.split('\n');
    const jsonLine = lines.find(line => line.trim().startsWith('{'));
    
    if (!jsonLine) {
      return null;
    }

    return JSON.parse(jsonLine);
  } catch (error) {
    return null;
  }
}

/**
 * List backups
 */
export async function listBackups(): Promise<BackupInfo[]> {
  try {
    const command = `node "${CLI_PATH}" restore --list`;

    const { stdout } = await execAsync(command, {
      env: { ...process.env }
    });

    const backups: BackupInfo[] = [];
    const lines = stdout.split('\n');
    let currentBackup: any = {};

    for (const line of lines) {
      if (line.match(/\d+\.\s+backup_/)) {
        if (currentBackup.name) {
          backups.push(currentBackup);
        }
        const nameMatch = line.match(/\d+\.\s+(.+)/);
        currentBackup = { name: nameMatch ? nameMatch[1].trim() : '' };
      } else if (line.includes('Date:')) {
        const dateMatch = line.match(/Date:\s+(.+)/);
        if (dateMatch) currentBackup.date = dateMatch[1].trim();
      } else if (line.includes('Size:')) {
        const sizeMatch = line.match(/Size:\s+(.+)/);
        if (sizeMatch) currentBackup.size = sizeMatch[1].trim();
      } else if (line.includes('Path:')) {
        const pathMatch = line.match(/Path:\s+(.+)/);
        if (pathMatch) currentBackup.path = pathMatch[1].trim();
      }
    }

    if (currentBackup.name) {
      backups.push(currentBackup);
    }

    return backups;
  } catch (error) {
    return [];
  }
}

/**
 * Get backup details
 */
export async function getBackupDetails(backupName: string): Promise<any> {
  try {
    const fs = require('fs').promises;
    const backupPath = path.join(BACKUP_DIR, backupName);
    const metadataPath = path.join(backupPath, 'metadata.json');
    
    const content = await fs.readFile(metadataPath, 'utf-8');
    const metadata = JSON.parse(content);

    return {
      success: true,
      backup: {
        name: backupName,
        path: backupPath,
        ...metadata
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}
