const express = require('express');
const pool = require('../db');

const router = express.Router();

// Get deposit addresses
router.get('/addresses', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT currency, address FROM crypto_addresses WHERE is_active = true'
    );

    res.json({ addresses: result.rows });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get investment plans
router.get('/plans', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM investment_plans WHERE is_active = true ORDER BY min_amount'
    );

    res.json({ plans: result.rows });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;




