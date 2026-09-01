import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();

//  Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name]
    );

    res.status(201).json({ message: 'User created successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check if user exists
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = rows[0];

        // Compare entered password with hash
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Optionally, issue JWT
        const token = jwt.sign(
            { user_id: user.user_id, email: user.email },
            process.env.JWT_SECRET || "supersecret",
            { expiresIn: '1h' }
        );

        res.json({
            success: true,
            token,
            user: {
                user_id: user.user_id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
;

export default router;