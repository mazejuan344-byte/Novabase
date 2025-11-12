/**
 * Test endpoint to check if support_tickets table exists
 * This can be removed after confirming the table exists
 */

const express = require('express');
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Test endpoint to check table existence
router.get('/test-table', authenticateToken, async (req, res) => {
  try {
    // Check if table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'support_tickets'
      )
    `);
    
    const tableExists = tableCheck.rows[0].exists;
    
    if (!tableExists) {
      return res.status(500).json({
        message: 'Support tickets table does not exist',
        solution: 'Please run the database migration: node backend/run-migration.js'
      });
    }
    
    // Try a simple query
    const testQuery = await pool.query('SELECT COUNT(*) as count FROM support_tickets');
    
    res.json({
      success: true,
      message: 'Support tickets table exists',
      ticketCount: testQuery.rows[0].count,
      userId: req.user.id
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error checking support tickets table',
      error: error.message,
      code: error.code
    });
  }
});

module.exports = router;

