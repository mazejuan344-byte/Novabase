const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../db');

const router = express.Router();

// Create support ticket
router.post('/tickets', [
  body('subject').notEmpty().trim().withMessage('Subject is required'),
  body('message').notEmpty().trim().withMessage('Message is required'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { subject, message, priority = 'medium' } = req.body;

    const result = await pool.query(
      `INSERT INTO support_tickets (user_id, subject, message, priority)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, subject, message, priority]
    );

    res.status(201).json({ ticket: result.rows[0] });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's support tickets
router.get('/tickets', async (req, res) => {
  try {
    const { status } = req.query;
    let query = `SELECT * FROM support_tickets WHERE user_id = $1`;
    const params = [req.user.id];

    if (status) {
      query += ` AND status = $2`;
      params.push(status);
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, params);
    res.json({ tickets: result.rows });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single ticket
router.get('/tickets/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM support_tickets WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ ticket: result.rows[0] });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update ticket (user can only update their own tickets that are open or in_progress)
router.put('/tickets/:id', [
  body('subject').optional().notEmpty().trim(),
  body('message').optional().notEmpty().trim(),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // First check if ticket exists and belongs to user
    const ticketResult = await pool.query(
      `SELECT * FROM support_tickets WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const ticket = ticketResult.rows[0];

    // Only allow updates if ticket is open or in_progress and has no admin response
    if (ticket.status !== 'open' && ticket.status !== 'in_progress') {
      return res.status(400).json({ message: 'Can only update open or in-progress tickets' });
    }

    if (ticket.admin_response) {
      return res.status(400).json({ message: 'Cannot update ticket after admin response' });
    }

    const { subject, message, priority } = req.body;
    const updates = [];
    const params = [];
    let paramCount = 1;

    if (subject !== undefined) {
      updates.push(`subject = $${paramCount++}`);
      params.push(subject);
    }
    if (message !== undefined) {
      updates.push(`message = $${paramCount++}`);
      params.push(message);
    }
    if (priority !== undefined) {
      updates.push(`priority = $${paramCount++}`);
      params.push(priority);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    // Add updated_at timestamp
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(req.params.id);

    const query = `UPDATE support_tickets SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, params);

    res.json({ ticket: result.rows[0] });
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

