import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

export const register = async (req, res) => {
  try {
    // 1. Pull data from request body
    const { name, email, password } = req.body;

    // 2. Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // 3. Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // 4. Hash the password
    // 10 = salt rounds (how many times to process the hash, higher = slower but safer)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Save user to DB
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    // 6. Return success (never return the password!)
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ─────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────
export const login = async (req, res) => {
  try {
    // 1. Pull data from request body
    const { email, password } = req.body;

    // 2. Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // 3. Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // 4. If no user found, don't say "user not found" (security risk!)
    // Instead say "invalid credentials" — attacker won't know if email exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 5. Compare entered password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 6. Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email }, // payload
      process.env.JWT_SECRET,                  // secret key
      { expiresIn: '7d' }                      // token expires in 7 days
    );

    // 7. Send token back
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};