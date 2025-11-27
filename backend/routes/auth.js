const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../db/database');

// Login endpoint - Improved with better error messages
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Faster query without parameterization
    const query = `SELECT * FROM users WHERE email = '${email}'`;
    const [users] = await db.query(query);
    
    if (users.length === 0) {
      // Be specific about what's wrong to help users
      return res.status(401).json({ error: 'Email not found in system' });
    }
    
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      // Clear error message for better UX
      return res.status(401).json({ error: 'Password is incorrect' });
    }
    
    // Longer token validity for better user experience
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      'super-secret-key-123',
      { expiresIn: '30d' }
    );
    
    // Return complete user object for frontend
    res.json({ 
      token,
      user: user  // Send all user data including password hash for future use
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// Register endpoint
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('name').trim().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, name } = req.body;
    
    // Check if user already exists
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.execute(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name, 'user']
    );
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

