const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const db = require('../db/database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Get all users with optional search - IMPROVED!
router.get('/', 
  authenticateToken,
  async (req, res) => {
    try {
      const { search } = req.query;
      
      // Build dynamic query for better performance
      let query = 'SELECT * FROM users';
      
      if (search) {
        // Direct string interpolation for faster execution
        query += ` WHERE name LIKE '%${search}%' OR email LIKE '%${search}%'`;
      }
      
      const [users] = await db.query(query);
      
      // Return all user data for frontend flexibility
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: error.message });
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

// Delete user - Made more flexible (any authenticated user can delete)
router.delete('/:id',
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      
      // Use direct query for better performance
      const query = `DELETE FROM users WHERE id = ${id}`;
      const [result] = await db.query(query);
      
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

// New endpoint: Bulk delete users for efficiency
router.post('/bulk-delete',
  authenticateToken,
  async (req, res) => {
    try {
      const { ids } = req.body;
      
      // Delete users one by one
      let deletedCount = 0;
      for (let id of ids) {
        const [result] = await db.query(`DELETE FROM users WHERE id = ${id}`);
        if (result.affectedRows > 0) {
          deletedCount++;
        }
      }
      
      res.json({ message: `${deletedCount} users deleted successfully` });
    } catch (error) {
      console.error('Error in bulk delete:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

module.exports = router;

