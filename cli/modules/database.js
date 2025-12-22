/**
 * Database Module - Backup and restore database operations
 */

const fs = require('fs').promises;
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Warning: Supabase credentials not found in environment');
}

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

/**
 * Backup database to file
 */
async function backupDatabase(outputPath) {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Check environment variables.');
  }

  const backup = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    tables: {}
  };

  // Backup calls table
  const { data: calls, error: callsError } = await supabase
    .from('calls')
    .select('*')
    .order('created_at', { ascending: false });

  if (callsError) {
    throw new Error(`Failed to backup calls table: ${callsError.message}`);
  }

  backup.tables.calls = calls || [];

  // Backup call_events table
  const { data: events, error: eventsError } = await supabase
    .from('call_events')
    .select('*')
    .order('timestamp', { ascending: false });

  if (eventsError) {
    throw new Error(`Failed to backup call_events table: ${eventsError.message}`);
  }

  backup.tables.call_events = events || [];

  // Write to file
  await fs.writeFile(outputPath, JSON.stringify(backup, null, 2));

  return {
    tables: Object.keys(backup.tables).length,
    records: Object.values(backup.tables).reduce((sum, table) => sum + table.length, 0)
  };
}

/**
 * Restore database from backup file
 */
async function restoreDatabase(inputPath) {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Check environment variables.');
  }

  // Read backup file
  const backupContent = await fs.readFile(inputPath, 'utf-8');
  const backup = JSON.parse(backupContent);

  let tablesRestored = 0;
  let recordsRestored = 0;

  // Restore calls table
  if (backup.tables.calls && backup.tables.calls.length > 0) {
    // Delete existing data (optional - be careful!)
    // await supabase.from('calls').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert backup data in batches
    const batchSize = 100;
    for (let i = 0; i < backup.tables.calls.length; i += batchSize) {
      const batch = backup.tables.calls.slice(i, i + batchSize);
      const { error } = await supabase
        .from('calls')
        .upsert(batch, { onConflict: 'call_id' });

      if (error) {
        console.error(`Error restoring calls batch ${i / batchSize + 1}:`, error.message);
      } else {
        recordsRestored += batch.length;
      }
    }
    tablesRestored++;
  }

  // Restore call_events table
  if (backup.tables.call_events && backup.tables.call_events.length > 0) {
    const batchSize = 100;
    for (let i = 0; i < backup.tables.call_events.length; i += batchSize) {
      const batch = backup.tables.call_events.slice(i, i + batchSize);
      const { error } = await supabase
        .from('call_events')
        .upsert(batch, { onConflict: 'id' });

      if (error) {
        console.error(`Error restoring call_events batch ${i / batchSize + 1}:`, error.message);
      } else {
        recordsRestored += batch.length;
      }
    }
    tablesRestored++;
  }

  return {
    tablesRestored,
    recordsRestored
  };
}

/**
 * Check database status
 */
async function checkDatabaseStatus(verbose = false) {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  // Check connection and get table counts
  const { count: callsCount, error: callsError } = await supabase
    .from('calls')
    .select('*', { count: 'exact', head: true });

  if (callsError) {
    throw new Error(`Database connection failed: ${callsError.message}`);
  }

  const { count: eventsCount, error: eventsError } = await supabase
    .from('call_events')
    .select('*', { count: 'exact', head: true });

  // Get last update timestamp
  const { data: lastCall } = await supabase
    .from('calls')
    .select('updated_at')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  return {
    connected: true,
    tables: 2,
    totalRecords: (callsCount || 0) + (eventsCount || 0),
    lastUpdate: lastCall?.updated_at || 'N/A',
    details: verbose ? {
      calls: callsCount || 0,
      call_events: eventsCount || 0
    } : undefined
  };
}

module.exports = {
  backupDatabase,
  restoreDatabase,
  checkDatabaseStatus
};
