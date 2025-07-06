import express from 'express';
import {
  registerDistributor,
  loginDistributor,
  getDistributorProfile,
  getDistributorByIds
} from '../controllers/distributorController.js';

import { authenticate, authorize } from '../middleware/distributorMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', registerDistributor);
router.post('/login', loginDistributor);

// Protected Route - Distributor only
router.get('/profile', authenticate, getDistributorProfile);

// Batch route to get distributor details by IDs
router.post('/batch', getDistributorByIds);

export default router;