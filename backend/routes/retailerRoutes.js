import express from 'express';
import {
  registerRetailer,
  loginRetailer,
  getRetailerProfile,
} from '../controllers/retailerController.js';
import { protect } from '../middleware/retailerMiddleware.js';

const router = express.Router();

router.post('/register', registerRetailer);
router.post('/login', loginRetailer);
router.get('/profile', protect, getRetailerProfile);

export default router;
