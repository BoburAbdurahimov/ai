/**
 * CLI Wrapper for Dashboard API Routes
 * 
 * This module wraps the existing CLI commands so they can be called
 * from Next.js API routes without code duplication.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

const CLI_PATH = process.env.CLI_PATH || path.join(process.cwd(), '..', 'cli', 'index.js');

export interface BackupResult {
  success: boolean;
  backupPath?: string;
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

/**
 * Create a backup using the CLI
 */
export async function createBackup(options: {
  output?: string;
  dbOnly?: boolean;
  configOnly?: boolean;
  compress?: boolean;
}): Promise<BackupResult> {
  try {
    let command = `node "${CLI_PATH}" backup`;
    
    if (options.output) command += ` --output "${options.output}"`;
    if (options.dbOnly) command += ' --db-only';
    if (options.configOnly) command += ' --config-only';
    if (options.compress) command += ' --compress';

    const { stdout, stderr } = await execAsync(command, {
      env: { ...process.env },
      maxBuffer: 10 * 1024 * 1024 // 10MB
    });

    // Parse output to extract backup path and metadata
    const backupPathMatch = stdout.match(/Backup location: (.+)/);
    const backupPath = backupPathMatch ? backupPathMatch[1].trim() : null;

    const tablesMatch = stdout.match(/(\d+) tables/);
    const recordsMatch = stdout.match(/(\d+) records/);
    const filesMatch = stdout.match(/(\d+) files/);

    return {
      success: true,
      backupPath: backupPath || undefined,
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
 * Restore from a backup using the CLI
 */
export async function restoreBackup(options: {
  input: string;
  dbOnly?: boolean;
  configOnly?: boolean;
  force?: boolean;
}): Promise<RestoreResult> {
  try {
    let command = `node "${CLI_PATH}" restore --input "${options.input}"`;
    
    if (options.dbOnly) command += ' --db-only';
    if (options.configOnly) command += ' --config-only';
    if (options.force) command += ' --force';

    const { stdout, stderr } = await execAsync(command, {
      env: { ...process.env },
      maxBuffer: 10 * 1024 * 1024,
      timeout: 300000 // 5 minutes
    });

    // Parse output to extract restore results
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
 * Get system status using the CLI
 */
export async function getStatus(verbose: boolean = false): Promise<StatusResult> {
  try {
    let command = `node "${CLI_PATH}" status --json`;
    if (verbose) command += ' --verbose';

    const { stdout } = await execAsync(command, {
      env: { ...process.env }
    });

    // Parse JSON output
    const lines = stdout.split('\n');
    const jsonLine = lines.find(line => line.trim().startsWith('{'));
    
    if (!jsonLine) {
      throw new Error('Could not parse status output');
    }

    return JSON.parse(jsonLine);
  } catch (error: any) {
    // Return error state
    return {
      database: {
        connected: false,
        tables: 0,
        totalRecords: 0,
        lastUpdate: ''
      },
      config: {
        complete: false,
        missing: []
      },
      deployment: {
        healthy: false,
        status: 'error',
        url: null
      },
      services: {}
    };
  }
}

/**
 * List available backups using the CLI
 */
export async function listBackups(): Promise<Array<{
  name: string;
  path: string;
  date: string;
  size: string;
}>> {
  try {
    const command = `node "${CLI_PATH}" restore --list`;

    const { stdout } = await execAsync(command, {
      env: { ...process.env }
    });

    // Parse the backup list output
    const backups: Array<{
      name: string;
      path: string;
      date: string;
      size: string;
    }> = [];

    const lines = stdout.split('\n');
    let currentBackup: any = {};

    for (const line of lines) {
      if (line.includes('backup_')) {
        const nameMatch = line.match(/\d+\.\s+(.+)/);
        if (nameMatch) {
          if (currentBackup.name) {
            backups.push(currentBackup);
          }
          currentBackup = { name: nameMatch[1].trim() };
        }
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
 * Validate a backup using direct file system check
 */
export async function validateBackup(backupPath: string): Promise<{
  valid: boolean;
  error?: string;
  components?: string[];
  metadata?: any;
}> {
  try {
    const fs = require('fs').promises;
    const path = require('path');

    // Check if metadata.json exists
    const metadataPath = path.join(backupPath, 'metadata.json');
    const metadataContent = await fs.readFile(metadataPath, 'utf-8');
    const metadata = JSON.parse(metadataContent);

    return {
      valid: true,
      components: metadata.components || [],
      metadata
    };
  } catch (error: any) {
    return {
      valid: false,
      error: error.message
    };
  }
}

/**
 * Execute CLI command with streaming output (for real-time progress)
 */
export function executeWithStream(
  command: string,
  onData: (data: string) => void,
  onError: (error: string) => void,
  onComplete: () => void
) {
  const { spawn } = require('child_process');
  
  const child = spawn('node', [CLI_PATH, ...command.split(' ')], {
    env: { ...process.env }
  });

  child.stdout.on('data', (data: Buffer) => {
    onData(data.toString());
  });

  child.stderr.on('data', (data: Buffer) => {
    onError(data.toString());
  });

  child.on('close', (code: number) => {
    if (code === 0) {
      onComplete();
    } else {
      onError(`Process exited with code ${code}`);
    }
  });

  return child;
}
