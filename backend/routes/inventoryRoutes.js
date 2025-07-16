import express from 'express';
import {
  getInventory,
  updateInventoryStock,
  checkoutInventory,
  addToInventory,
} from '../controllers/inventoryController.js';
import { authenticate, authorize } from '../middleware/retailerMiddleware.js';

const router = express.Router();

// Fetch inventory data
router.get('/', authenticate, getInventory);

router.post('/add', authenticate, addToInventory);

// Update inventory stock for a specific product variant
router.post('/update', authenticate, updateInventoryStock);

// Handle checkout: Bulk update inventory stock
router.post('/checkout', authenticate, checkoutInventory);

export default router;