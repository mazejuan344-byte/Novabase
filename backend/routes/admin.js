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
  body('reason').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { reason } = req.body;

    // First check if transaction exists
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

    // Update transaction status using admin_notes field for rejection reason
    const result = await pool.query(
      `UPDATE transactions 
       SET status = 'rejected', admin_notes = $1 
       WHERE id = $2 AND status = 'pending'
       RETURNING *`,
      [reason || null, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Transaction could not be rejected. It may have been processed already.' });
    }

    res.json({ message: 'Transaction rejected successfully' });
  } catch (error) {
    console.error('Reject transaction error:', error);
    // Provide more specific error message
    const errorMessage = error.message || 'An error occurred while rejecting the transaction';
    res.status(500).json({ message: errorMessage });
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

// Get all support tickets
router.get('/support/tickets', async (req, res) => {
  try {
    const { status, priority } = req.query;
    let query = `SELECT st.*, u.email, u.first_name, u.last_name,
                        admin.email as admin_email, admin.first_name as admin_first_name, admin.last_name as admin_last_name
                 FROM support_tickets st
                 JOIN users u ON st.user_id = u.id
                 LEFT JOIN users admin ON st.admin_id = admin.id`;
    const params = [];
    const conditions = [];

    if (status) {
      conditions.push(`st.status = $${params.length + 1}`);
      params.push(status);
    }
    if (priority) {
      conditions.push(`st.priority = $${params.length + 1}`);
      params.push(priority);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY st.created_at DESC`;

    const result = await pool.query(query, params);
    res.json({ tickets: result.rows });
  } catch (error) {
    console.error('Get support tickets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single support ticket
router.get('/support/tickets/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT st.*, u.email, u.first_name, u.last_name,
              admin.email as admin_email, admin.first_name as admin_first_name, admin.last_name as admin_last_name
       FROM support_tickets st
       JOIN users u ON st.user_id = u.id
       LEFT JOIN users admin ON st.admin_id = admin.id
       WHERE st.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ ticket: result.rows[0] });
  } catch (error) {
    console.error('Get support ticket error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update support ticket status
router.put('/support/tickets/:id/status', [
  body('status').isIn(['open', 'in_progress', 'resolved', 'closed'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;

    const result = await pool.query(
      `UPDATE support_tickets 
       SET status = $1, admin_id = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, req.user.id, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ ticket: result.rows[0] });
  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Respond to support ticket
router.post('/support/tickets/:id/respond', [
  body('response').notEmpty().trim().withMessage('Response is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed: ' + errors.array().map(e => e.msg).join(', '),
        errors: errors.array() 
      });
    }

    const { response } = req.body;

    // Ensure response is not empty after trimming
    const trimmedResponse = response?.trim();
    if (!trimmedResponse) {
      return res.status(400).json({ message: 'Response cannot be empty' });
    }

    // Update ticket with admin response and set status to in_progress if still open
    const result = await pool.query(
      `UPDATE support_tickets 
       SET admin_response = $1, 
           admin_id = $2,
           status = CASE WHEN status = 'open' THEN 'in_progress' ELSE status END,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [trimmedResponse, req.user.id, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ ticket: result.rows[0] });
  } catch (error) {
    console.error('Respond to ticket error:', error);
    
    // Provide more detailed error messages
    if (error.code === '42P01') {
      return res.status(500).json({ 
        message: 'Support tickets table does not exist. Please run the database migration.',
        error: 'Table not found'
      });
    }
    
    if (error.code === '23503') {
      return res.status(400).json({ 
        message: 'Invalid admin user ID',
        error: 'Foreign key constraint violation'
      });
    }
    
    res.status(500).json({ 
      message: error.message || 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update ticket priority
router.put('/support/tickets/:id/priority', [
  body('priority').isIn(['low', 'medium', 'high', 'urgent'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { priority } = req.body;

    const result = await pool.query(
      `UPDATE support_tickets 
       SET priority = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [priority, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ ticket: result.rows[0] });
  } catch (error) {
    console.error('Update ticket priority error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update admin response (edit response)
router.put('/support/tickets/:id/response', [
  body('response').notEmpty().trim().withMessage('Response is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { response } = req.body;

    const result = await pool.query(
      `UPDATE support_tickets 
       SET admin_response = $1, 
           admin_id = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [response, req.user.id, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ ticket: result.rows[0] });
  } catch (error) {
    console.error('Update admin response error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete support ticket
router.delete('/support/tickets/:id', async (req, res) => {
  try {
    // First check if ticket exists
    const checkResult = await pool.query(
      'SELECT id FROM support_tickets WHERE id = $1',
      [req.params.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Delete the ticket
    await pool.query(
      'DELETE FROM support_tickets WHERE id = $1',
      [req.params.id]
    );

    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Delete ticket error:', error);
    
    // Provide more detailed error messages
    if (error.code === '42P01') {
      return res.status(500).json({ 
        message: 'Support tickets table does not exist. Please run the database migration.',
        error: 'Table not found'
      });
    }
    
    if (error.code === '23503') {
      return res.status(400).json({ 
        message: 'Cannot delete ticket due to foreign key constraints',
        error: 'Foreign key constraint violation'
      });
    }
    
    res.status(500).json({ 
      message: error.message || 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;







