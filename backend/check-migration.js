/**
 * Check if support_tickets table exists
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : {
    rejectUnauthorized: false
  }
});

async function checkMigration() {
  try {
    // Check if table exists
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'support_tickets'
      )
    `);
    
    const tableExists = result.rows[0].exists;
    
    if (tableExists) {
      console.log('✅ Support tickets table exists!');
      
      // Get table structure
      const columns = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'support_tickets'
        ORDER BY ordinal_position
      `);
      
      console.log('\n📋 Table Structure:');
      console.log('─'.repeat(50));
      columns.rows.forEach(col => {
        console.log(`  ${col.column_name.padEnd(20)} ${col.data_type.padEnd(20)} ${col.is_nullable === 'YES' ? 'nullable' : 'NOT NULL'}`);
      });
      
      // Check indexes
      const indexes = await pool.query(`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE tablename = 'support_tickets'
      `);
      
      console.log('\n📊 Indexes:');
      console.log('─'.repeat(50));
      indexes.rows.forEach(idx => {
        console.log(`  ${idx.indexname}`);
      });
      
      // Count tickets
      const count = await pool.query('SELECT COUNT(*) as count FROM support_tickets');
      console.log(`\n📝 Total tickets: ${count.rows[0].count}`);
      
    } else {
      console.log('❌ Support tickets table does not exist!');
      console.log('   Please run the migration first.');
    }
  } catch (error) {
    console.error('❌ Error checking migration:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

checkMigration();

