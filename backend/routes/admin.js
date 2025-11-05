const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin role
router.use(requireAdmin);

// Get all users
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.is_active, 
              u.kyc_status, u.created_at,
              a.balance_usd, a.balance_btc, a.balance_eth, a.balance_usdt
       FROM users u
       LEFT JOIN accounts a ON u.id = a.user_id
       ORDER BY u.created_at DESC`
    );

    res.json({ users: result.rows });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.*, a.* FROM users u
       LEFT JOIN accounts a ON u.id = a.user_id
       WHERE u.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const { firstName, lastName, isActive, kycStatus } = req.body;

    const updates = [];
    const params = [];
    let paramCount = 1;

    if (firstName !== undefined) {
      updates.push(`first_name = $${paramCount++}`);
      params.push(firstName);
    }
    if (lastName !== undefined) {
      updates.push(`last_name = $${paramCount++}`);
      params.push(lastName);
    }
    if (isActive !== undefined) {
      updates.push(`is_active = $${paramCount++}`);
      params.push(isActive);
    }
    if (kycStatus !== undefined) {
      updates.push(`kyc_status = $${paramCount++}`);
      params.push(kycStatus);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    params.push(req.params.id);

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, params);

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all transactions
router.get('/transactions', async (req, res) => {
  try {
    const { status, type } = req.query;
    let query = `SELECT t.*, u.email, u.first_name, u.last_name 
                 FROM transactions t
                 JOIN users u ON t.user_id = u.id`;
    const params = [];

    if (status) {
      query += ` WHERE t.status = $1`;
      params.push(status);
    }
    if (type) {
      query += params.length > 0 ? ` AND t.type = $${params.length + 1}` : ` WHERE t.type = $1`;
      params.push(type);
    }

    query += ' ORDER BY t.created_at DESC';

    const result = await pool.query(query, params);
    res.json({ transactions: result.rows });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve transaction
router.post('/transactions/:id/approve', [
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const { notes } = req.body;

    // Get transaction
    const transResult = await pool.query(
      'SELECT * FROM transactions WHERE id = $1',
      [req.params.id]
    );

    if (transResult.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const transaction = transResult.rows[0];

    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: 'Transaction is not pending' });
    }

    // Update transaction status
    await pool.query(
      `UPDATE transactions SET status = 'approved', admin_notes = $1 WHERE id = $2`,
      [notes || null, req.params.id]
    );

    // If withdrawal, deduct from account
    if (transaction.type === 'withdrawal') {
      const balanceField = `balance_${transaction.currency.toLowerCase()}`;
      await pool.query(
        `UPDATE accounts SET ${balanceField} = ${balanceField} - $1 WHERE user_id = $2`,
        [transaction.amount, transaction.user_id]
      );
    }

    // If deposit, add to account
    if (transaction.type === 'deposit') {
      const balanceField = `balance_${transaction.currency.toLowerCase()}`;
      await pool.query(
        `UPDATE accounts SET ${balanceField} = ${balanceField} + $1 WHERE user_id = $2`,
        [transaction.amount, transaction.user_id]
      );
    }

    // Mark as completed
    await pool.query(
      `UPDATE transactions SET status = 'completed' WHERE id = $1`,
      [req.params.id]
    );

    res.json({ message: 'Transaction approved successfully' });
  } catch (error) {
    console.error('Approve transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject transaction
router.post('/transactions/:id/reject', [
  body('reason').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { reason } = req.body;

    const result = await pool.query(
      `UPDATE transactions 
       SET status = 'rejected', rejection_reason = $1 
       WHERE id = $2 AND status = 'pending'
       RETURNING *`,
      [reason, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found or already processed' });
    }

    res.json({ message: 'Transaction rejected successfully' });
  } catch (error) {
    console.error('Reject transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get crypto addresses
router.get('/crypto-addresses', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM crypto_addresses ORDER BY currency'
    );

    res.json({ addresses: result.rows });
  } catch (error) {
    console.error('Get crypto addresses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update crypto address
router.put('/crypto-addresses/:id', [
  body('address').notEmpty().trim(),
  body('isActive').isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { address, isActive } = req.body;

    const result = await pool.query(
      `UPDATE crypto_addresses SET address = $1, is_active = $2 WHERE id = $3 RETURNING *`,
      [address, isActive, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.json({ address: result.rows[0] });
  } catch (error) {
    console.error('Update crypto address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get admin dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const [usersResult, transactionsResult, accountsResult] = await Promise.all([
      pool.query('SELECT COUNT(*) as total, COUNT(CASE WHEN is_active THEN 1 END) as active FROM users'),
      pool.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
          SUM(CASE WHEN type = 'deposit' THEN amount ELSE 0 END) as total_deposits,
          SUM(CASE WHEN type = 'withdrawal' THEN amount ELSE 0 END) as total_withdrawals
        FROM transactions
      `),
      pool.query(`
        SELECT 
          SUM(balance_usd) as total_usd,
          SUM(balance_btc) as total_btc,
          SUM(balance_eth) as total_eth,
          SUM(balance_usdt) as total_usdt
        FROM accounts
      `)
    ]);

    res.json({
      users: usersResult.rows[0],
      transactions: transactionsResult.rows[0],
      accounts: accountsResult.rows[0]
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;




