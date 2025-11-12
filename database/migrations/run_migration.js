/**
 * Database Migration Runner
 * Run this script to apply migrations to your database
 * 
 * Usage:
 *   node database/migrations/run_migration.js <migration_file>
 * 
 * Example:
 *   node database/migrations/run_migration.js database/migrations/001_add_support_tickets.sql
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../../backend/.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : {
    rejectUnauthorized: false
  }
});

async function runMigration(migrationFile) {
  // Handle both relative and absolute paths
  let migrationPath;
  if (path.isAbsolute(migrationFile)) {
    migrationPath = migrationFile;
  } else if (migrationFile.startsWith('database/') || migrationFile.startsWith('./database/')) {
    // Path from root directory
    migrationPath = path.join(__dirname, '../../', migrationFile);
  } else {
    // Path relative to migrations directory
    migrationPath = path.join(__dirname, migrationFile);
  }
  
  // Try alternative: if file doesn't exist, try from root
  if (!fs.existsSync(migrationPath)) {
    const altPath = path.join(__dirname, '../../', migrationFile);
    if (fs.existsSync(altPath)) {
      migrationPath = altPath;
    }
  }
  
  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Migration file not found: ${migrationPath}`);
    console.error(`   Tried: ${migrationFile}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, 'utf8');
  
  console.log(`📄 Running migration: ${migrationFile}`);
  console.log('─'.repeat(50));
  
  try {
    await pool.query(sql);
    console.log('✅ Migration completed successfully!');
    console.log('─'.repeat(50));
  } catch (error) {
    console.error('❌ Migration failed:');
    console.error(error.message);
    
    // Check if table already exists
    if (error.message.includes('already exists')) {
      console.log('\n⚠️  Note: Some objects may already exist. This is usually safe to ignore.');
    } else {
      process.exit(1);
    }
  } finally {
    await pool.end();
  }
}

// Get migration file from command line argument
const migrationFile = process.argv[2];

if (!migrationFile) {
  console.error('❌ Please provide a migration file path');
  console.log('\nUsage:');
  console.log('  node database/migrations/run_migration.js <migration_file>');
  console.log('\nExample:');
  console.log('  node database/migrations/run_migration.js database/migrations/001_add_support_tickets.sql');
  process.exit(1);
}

runMigration(migrationFile);

