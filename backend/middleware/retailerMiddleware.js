import jwt from 'jsonwebtoken';
import Retailer from '../models/Retailer.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await Retailer.findById(decoded.id).select('-password');
      next();
    } catch (err) {
      res.status(401).json({ message: 'Token failed' });
    }
  } else {
    res.status(401).json({ message: 'No token provided' });
  }
};