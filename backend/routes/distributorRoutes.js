import express from 'express';
import {
  registerDistributor,
  loginDistributor,
  getDistributorProfile,
} from '../controllers/distributorController.js';

import { authenticate, authorize } from '../middleware/distributorMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', registerDistributor);
router.post('/login', loginDistributor);

// Protected Route - Distributor only
router.get('/profile', authenticate, authorize('distributor'), getDistributorProfile);

export default router;