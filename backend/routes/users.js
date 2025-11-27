const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const db = require('../db/database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Get all users with optional search
router.get('/', 
  authenticateToken,
  [query('search').optional().trim().escape()],
  async (req, res) => {
    try {
      const { search } = req.query;
      
      let query = 'SELECT id, name, email, role, created_at FROM users';
      const params = [];
      
      if (search) {
        query += ' WHERE name LIKE ? OR email LIKE ?';
        params.push(`%${search}%`, `%${search}%`);
      }
      
      const [users] = await db.execute(query, params);
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Get user by ID
router.get('/:id',
  authenticateToken,
  [param('id').isInt()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      
      const [users] = await db.execute(
        'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
        [id]
      );
      
      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(users[0]);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Update user (admin only)
router.put('/:id',
  authenticateToken,
  authorizeRole('admin'),
  [
    param('id').isInt(),
    body('name').optional().trim().notEmpty(),
    body('email').optional().isEmail().normalizeEmail(),
    body('role').optional().isIn(['user', 'admin'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { name, email, role } = req.body;
      
      const updates = [];
      const params = [];
      
      if (name) {
        updates.push('name = ?');
        params.push(name);
      }
      if (email) {
        updates.push('email = ?');
        params.push(email);
      }
      if (role) {
        updates.push('role = ?');
        params.push(role);
      }
      
      if (updates.length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
      }
      
      params.push(id);
      
      const [result] = await db.execute(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        params
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({ message: 'User updated successfully' });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Delete user (admin only)
router.delete('/:id',
  authenticateToken,
  authorizeRole('admin'),
  [param('id').isInt()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      
      const [result] = await db.execute(
        'DELETE FROM users WHERE id = ?',
        [id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

module.exports = router;

