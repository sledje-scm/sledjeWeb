import jwt from 'jsonwebtoken';
import Retailer from '../models/Retailer.js';

/**
 * Authentication middleware for verifying JWT tokens
 * Checks if user is authenticated and adds user data to request
 */
export const authenticate = async (req, res, next) => {
  try {
    // Check if authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Extract token from header
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find retailer in database
    const retailer = await Retailer.findById(decoded.id).select('-password');
    if (!retailer) {
      return res.status(401).json({ message: 'Retailer not found' });
    }
    
    // Add retailer to request object
    req.user = retailer;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    console.error('❌ Auth middleware error:', error.message);
    return res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Role-based authorization middleware
 * Checks if the authenticated retailer has the required role
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

export default { authenticate, authorize };