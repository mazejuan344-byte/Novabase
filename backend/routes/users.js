const express = require('express');
const pool = require('../db');

const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.kyc_status, u.created_at,
              a.balance_usd, a.balance_btc, a.balance_eth, a.balance_usdt
       FROM users u
       LEFT JOIN accounts a ON u.id = a.user_id
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    const result = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3 RETURNING id, email, first_name, last_name',
      [firstName || null, lastName || null, req.user.id]
    );

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const [accountResult, transactionResult, investmentResult] = await Promise.all([
      pool.query('SELECT * FROM accounts WHERE user_id = $1', [req.user.id]),
      pool.query(
        `SELECT type, status, currency, amount, created_at 
         FROM transactions 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT 10`,
        [req.user.id]
      ),
      pool.query(
        `SELECT i.*, p.name as plan_name 
         FROM investments i
         JOIN investment_plans p ON i.plan_id = p.id
         WHERE i.user_id = $1 AND i.status = 'active'
         ORDER BY i.created_at DESC`,
        [req.user.id]
      )
    ]);

    res.json({
      account: accountResult.rows[0] || {
        balance_usd: 0,
        balance_btc: 0,
        balance_eth: 0,
        balance_usdt: 0
      },
      recentTransactions: transactionResult.rows,
      activeInvestments: investmentResult.rows
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;





