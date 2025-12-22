/**
 * Configuration Module - Backup and restore configuration files
 */

const fs = require('fs').promises;
const path = require('path');

const CONFIG_FILES = [
  '.env',
  'vercel.json',
  'package.json'
];

const REQUIRED_ENV_VARS = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_KEY',
  'YANDEX_API_KEY',
  'YANDEX_FOLDER_ID',
  'N8N_WEBHOOK_BASE_URL'
];

/**
 * Backup configuration files
 */
async function backupConfig(outputPath) {
  const backup = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    files: {}
  };

  let filesBackedUp = 0;

  for (const file of CONFIG_FILES) {
    const filePath = path.join(process.cwd(), file);
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      backup.files[file] = content;
      filesBackedUp++;
    } catch (error) {
      console.warn(`Warning: Could not backup ${file}: ${error.message}`);
    }
  }

  // Backup environment variables (sanitized)
  backup.environment = sanitizeEnvVars(process.env);

  await fs.writeFile(outputPath, JSON.stringify(backup, null, 2));

  return {
    files: filesBackedUp
  };
}

/**
 * Restore configuration files
 */
async function restoreConfig(inputPath) {
  const backupContent = await fs.readFile(inputPath, 'utf-8');
  const backup = JSON.parse(backupContent);

  let filesRestored = 0;

  for (const [fileName, content] of Object.entries(backup.files)) {
    const filePath = path.join(process.cwd(), fileName);
    
    try {
      // Create backup of existing file
      try {
        const existing = await fs.readFile(filePath, 'utf-8');
        await fs.writeFile(`${filePath}.backup`, existing);
      } catch (error) {
        // File doesn't exist, no backup needed
      }

      // Restore file
      await fs.writeFile(filePath, content);
      filesRestored++;
    } catch (error) {
      console.error(`Error restoring ${fileName}:`, error.message);
    }
  }

  return {
    filesRestored
  };
}

/**
 * Check configuration status
 */
async function checkConfigStatus(verbose = false) {
  const status = {
    complete: true,
    missing: [],
    files: {}
  };

  // Check required environment variables
  for (const varName of REQUIRED_ENV_VARS) {
    if (!process.env[varName]) {
      status.complete = false;
      status.missing.push(varName);
    }
  }

  // Check configuration files
  for (const file of CONFIG_FILES) {
    const filePath = path.join(process.cwd(), file);
    
    try {
      await fs.access(filePath);
      status.files[file] = 'exists';
    } catch (error) {
      status.files[file] = 'missing';
      if (file === '.env') {
        status.complete = false;
      }
    }
  }

  if (verbose) {
    // Check additional optional variables
    const optionalVars = [
      'OPENAI_API_KEY',
      'ANTHROPIC_API_KEY',
      'VAPI_API_KEY',
      'N8N_SHEETS_WEBHOOK',
      'N8N_TELEGRAM_WEBHOOK'
    ];

    status.optional = {};
    for (const varName of optionalVars) {
      status.optional[varName] = process.env[varName] ? 'set' : 'not set';
    }
  }

  return status;
}

/**
 * Sanitize environment variables for backup
 * (removes sensitive data, keeps structure)
 */
function sanitizeEnvVars(env) {
  const sanitized = {};
  const sensitivePatterns = ['KEY', 'SECRET', 'PASSWORD', 'TOKEN'];

  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith('npm_') || key.startsWith('NODE_')) {
      continue; // Skip npm and Node.js internal vars
    }

    const isSensitive = sensitivePatterns.some(pattern => key.includes(pattern));
    
    if (isSensitive && value) {
      sanitized[key] = `[REDACTED-${value.length}-chars]`;
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

module.exports = {
  backupConfig,
  restoreConfig,
  checkConfigStatus
};
