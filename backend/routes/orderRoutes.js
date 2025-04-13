import express from 'express';
import {
  getPendingOrders,
  updateOrderItem,
  moveToReady,
  getReadyOrders,
  placeOrder,
  getOnWayOrders,
  multi_create,
} from '../controllers/orderController.js';

import { protect } from '../middleware/retailerMiddleware.js';

const router = express.Router();

router.get('/pending', protect, getPendingOrders);
router.put('/:id', protect, updateOrderItem);
router.post('/move-to-ready', protect, moveToReady);
router.get('/ready', protect, getReadyOrders);
router.post('/place', protect, placeOrder);
router.get('/onway', protect, getOnWayOrders);
router.post("/multi-create", orderController.createMultiDistributorOrder);


export default router;
