// routes/authRoutes.js
import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/google', async (req, res) => {
  const { credential } = req.body;

  if (!credential) return res.status(400).json({ error: 'No token provided' });

  try {
    const googleRes = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${credential}`
    );

    const { email, name, sub: googleId, picture } = googleRes.data;

    const token = jwt.sign({ email, name, googleId }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

// ✅ Add this at the bottom
export default router;
