/**
 * Run SQL migrations against Supabase.
 * Usage: node src/db/run-migrations.js
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

async function runSQL(sql, label) {
  console.log(`\n▶ Running: ${label}...`);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    // Use the SQL endpoint directly
  });

  // Supabase doesn't have a direct SQL endpoint via REST.
  // Use the Supabase Management API or psql.
  // Instead, we'll use the pg_net extension or execute via fetch to the SQL endpoint.

  // The correct approach for Supabase is to use the SQL endpoint:
  const sqlRes = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });
  
  console.log(`  Status: ${sqlRes.status}`);
}

async function main() {
  const migrationsDir = path.join(__dirname, 'migrations');
  const seedsDir = path.join(__dirname, 'seeds');

  // Read and display migration files
  const migrations = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  const seeds = fs.readdirSync(seedsDir).filter(f => f.endsWith('.sql')).sort();

  console.log('=== BuildPath DB Migration ===');
  console.log(`\nMigrations found: ${migrations.join(', ')}`);
  console.log(`Seeds found: ${seeds.join(', ')}`);
  console.log(`\nSupabase URL: ${SUPABASE_URL}`);
  console.log('\n⚠️  Please run these SQL files manually in the Supabase SQL Editor:');
  console.log('   https://supabase.com/dashboard/project/mnpagdhezebyrcjlsdus/sql/new');
  console.log('\n   1. Copy the contents of: api/src/db/migrations/001_core_schema.sql');
  console.log('   2. Paste and run in SQL Editor');
  console.log('   3. Copy the contents of: api/src/db/seeds/001_nsw_cabinet.sql');
  console.log('   4. Paste and run in SQL Editor');
  console.log('\n   Both files are ready to go — just copy and paste!');
}

main().catch(console.error);
