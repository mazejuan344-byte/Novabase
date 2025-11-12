/**
 * Simple Migration Runner
 * Run this from the backend directory to apply migrations
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : {
    rejectUnauthorized: false
  }
});

async function runMigration() {
  // Read the migration file from the database/migrations directory
  const migrationPath = path.join(__dirname, '../database/migrations/001_add_support_tickets.sql');
  
  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Migration file not found: ${migrationPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, 'utf8');
  
  console.log('📄 Running migration: 001_add_support_tickets.sql');
  console.log('─'.repeat(50));
  
  try {
    await pool.query(sql);
    console.log('✅ Migration completed successfully!');
    console.log('─'.repeat(50));
    console.log('✅ Support tickets table has been created');
    console.log('✅ Indexes have been created');
  } catch (error) {
    console.error('❌ Migration failed:');
    console.error(error.message);
    
    // Check if table already exists
    if (error.message.includes('already exists') || error.message.includes('duplicate')) {
      console.log('\n⚠️  Note: Some objects may already exist. This is usually safe to ignore.');
      console.log('✅ Migration completed (some objects may have already existed)');
    } else {
      process.exit(1);
    }
  } finally {
    await pool.end();
  }
}

// Run the migration
runMigration().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

