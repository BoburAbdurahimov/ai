/**
 * Backup Manager Module - Manage backup files and archives
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

/**
 * List available backups
 */
async function listBackups(backupDir = './backups') {
  try {
    await fs.access(backupDir);
  } catch (error) {
    return []; // Directory doesn't exist
  }

  const entries = await fs.readdir(backupDir, { withFileTypes: true });
  const backups = [];

  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith('backup_')) {
      const backupPath = path.join(backupDir, entry.name);
      const metadataPath = path.join(backupPath, 'metadata.json');

      try {
        const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8'));
        const stats = await fs.stat(backupPath);

        backups.push({
          name: entry.name,
          path: backupPath,
          date: new Date(metadata.timestamp).toLocaleString(),
          timestamp: metadata.timestamp,
          size: await getDirectorySize(backupPath),
          components: metadata.components
        });
      } catch (error) {
        console.warn(`Could not read metadata for ${entry.name}`);
      }
    }
  }

  // Sort by timestamp (newest first)
  backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return backups;
}

/**
 * Validate a backup
 */
async function validateBackup(backupPath) {
  const result = {
    valid: false,
    error: null,
    components: [],
    timestamp: null,
    version: null
  };

  try {
    // Check if path exists
    await fs.access(backupPath);

    // Read metadata
    const metadataPath = path.join(backupPath, 'metadata.json');
    const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8'));

    result.timestamp = metadata.timestamp;
    result.version = metadata.version;
    result.components = metadata.components || [];

    // Validate component files
    const requiredFiles = {
      database: 'database.json',
      config: 'config.json',
      deployment: 'deployment.json'
    };

    for (const [component, fileName] of Object.entries(requiredFiles)) {
      if (result.components.includes(component)) {
        const filePath = path.join(backupPath, fileName);
        try {
          await fs.access(filePath);
          
          // Validate JSON structure
          const content = await fs.readFile(filePath, 'utf-8');
          JSON.parse(content);
        } catch (error) {
          result.error = `Invalid or missing ${component} file`;
          return result;
        }
      }
    }

    // Check database backup if present
    if (result.components.includes('database')) {
      const dbPath = path.join(backupPath, 'database.json');
      const dbContent = JSON.parse(await fs.readFile(dbPath, 'utf-8'));
      
      result.database = {
        tables: Object.keys(dbContent.tables || {}).length,
        records: Object.values(dbContent.tables || {}).reduce(
          (sum, table) => sum + (Array.isArray(table) ? table.length : 0), 
          0
        )
      };
    }

    result.valid = true;
  } catch (error) {
    result.error = error.message;
  }

  return result;
}

/**
 * Create compressed archive of backup
 */
async function createBackupArchive(backupDir) {
  const archiveName = `${path.basename(backupDir)}.tar.gz`;
  const archivePath = path.join(path.dirname(backupDir), archiveName);

  try {
    // Use tar to compress (works on Unix/Linux/MacOS)
    await execAsync(`tar -czf "${archivePath}" -C "${path.dirname(backupDir)}" "${path.basename(backupDir)}"`);
    return archivePath;
  } catch (error) {
    // Fallback: Just return the directory path if tar is not available
    console.warn('Could not create archive (tar not available)');
    return backupDir;
  }
}

/**
 * Get directory size in human-readable format
 */
async function getDirectorySize(dirPath) {
  let totalSize = 0;

  async function calculateSize(currentPath) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        await calculateSize(fullPath);
      } else {
        const stats = await fs.stat(fullPath);
        totalSize += stats.size;
      }
    }
  }

  await calculateSize(dirPath);

  // Convert to human-readable format
  if (totalSize < 1024) return `${totalSize} B`;
  if (totalSize < 1024 * 1024) return `${(totalSize / 1024).toFixed(2)} KB`;
  if (totalSize < 1024 * 1024 * 1024) return `${(totalSize / (1024 * 1024)).toFixed(2)} MB`;
  return `${(totalSize / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

module.exports = {
  listBackups,
  validateBackup,
  createBackupArchive,
  getDirectorySize
};
