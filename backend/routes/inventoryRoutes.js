import express from 'express';
import {
  getInventory,
  updateInventoryStock,
  checkoutInventory,
} from '../controllers/inventoryController.js';
import { authenticate, authorize } from '../middleware/retailerMiddleware.js';

const router = express.Router();

// Fetch inventory data
router.get('/', authenticate, authorize('retailer'), getInventory);

// Update inventory stock for a specific product variant
router.post('/update', authenticate, authorize('retailer'), updateInventoryStock);

// Handle checkout: Bulk update inventory stock
router.post('/checkout', authenticate, authorize('retailer'), checkoutInventory);

export default router;