const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../db');

const router = express.Router();

// Get all transactions for user
router.get('/', async (req, res) => {
  try {
    const { type, status, limit = 50 } = req.query;
    let query = 'SELECT * FROM transactions WHERE user_id = $1';
    const params = [req.user.id];

    if (type) {
      query += ` AND type = $${params.length + 1}`;
      params.push(type);
    }
    if (status) {
      query += ` AND status = $${params.length + 1}`;
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1);
    params.push(parseInt(limit));

    const result = await pool.query(query, params);
    res.json({ transactions: result.rows });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create deposit request
router.post('/deposit', [
  body('currency').isIn(['BTC', 'ETH', 'USDT']),
  body('amount').isFloat({ min: 0.00000001 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currency, amount } = req.body;

    // Get deposit address for currency
    const addressResult = await pool.query(
      'SELECT address FROM crypto_addresses WHERE currency = $1 AND is_active = true LIMIT 1',
      [currency]
    );

    if (addressResult.rows.length === 0) {
      return res.status(400).json({ message: 'Deposit address not available for this currency' });
    }

    // Create transaction
    const result = await pool.query(
      `INSERT INTO transactions (user_id, type, currency, amount, status, deposit_address)
       VALUES ($1, 'deposit', $2, $3, 'pending', $4)
       RETURNING *`,
      [req.user.id, currency, amount, addressResult.rows[0].address]
    );

    res.status(201).json({ transaction: result.rows[0] });
  } catch (error) {
    console.error('Create deposit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create withdrawal request
router.post('/withdraw', [
  body('currency').isIn(['BTC', 'ETH', 'USDT', 'USD']),
  body('amount').isFloat({ min: 0.00000001 }),
  body('walletAddress').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currency, amount, walletAddress } = req.body;

    // Check balance
    const accountResult = await pool.query(
      'SELECT * FROM accounts WHERE user_id = $1',
      [req.user.id]
    );

    if (accountResult.rows.length === 0) {
      return res.status(400).json({ message: 'Account not found' });
    }

    const account = accountResult.rows[0];
    const balanceField = `balance_${currency.toLowerCase()}`;
    
    if (!account[balanceField] || account[balanceField] < parseFloat(amount)) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Create withdrawal transaction (pending approval)
    const result = await pool.query(
      `INSERT INTO transactions (user_id, type, currency, amount, status, wallet_address)
       VALUES ($1, 'withdrawal', $2, $3, 'pending', $4)
       RETURNING *`,
      [req.user.id, currency, amount, walletAddress]
    );

    res.status(201).json({ transaction: result.rows[0] });
  } catch (error) {
    console.error('Create withdrawal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ transaction: result.rows[0] });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;



