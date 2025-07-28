import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import Retailer from '../models/Retailer.js'; // Your existing model

const router = express.Router();

router.post('/google', async (req, res) => {
  const { credential } = req.body;

  try {
    // Step 1: Verify token with Google
    const { data } = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${credential}`);
    const { email, name, sub: googleId } = data;

    if (!email || !googleId) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    // Step 2: Check if retailer already exists
    let retailer = await Retailer.findOne({ email });

    if (!retailer) {
      // Step 3: Signup (create new retailer)
      retailer = await Retailer.create({
        email,
        ownerName: name,
        businessName: `${name}'s Store`,
        phone: '0000000000', // Or prompt later
        googleId,
        password: '', // Empty password for Google users
      });
    }

    // Step 4: Issue your own JWT
    const token = jwt.sign(
      { id: retailer._id, role: retailer.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, retailer });
  } catch (err) {
    console.error('Google OAuth Error:', err.message);
    res.status(401).json({ error: 'Google OAuth failed' });
  }
});

export default router;
