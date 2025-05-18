import express from 'express';
import {
  registerRetailer,
  loginRetailer,
  getRetailerProfile,
} from '../controllers/retailerController.js';

import { authenticate, authorize } from '../middleware/retailerMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', registerRetailer);
router.post('/login', loginRetailer);

// Protected Route - Retailer only
router.get('/profile', authenticate, authorize('retailer'), getRetailerProfile);

export default router;
