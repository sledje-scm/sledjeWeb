import express from 'express';
import { 
  createOrderRequest,
  processOrderRequest,
  approveModifiedOrder,
  getOrdersList,
  getOrderDetails,
  getOrderHistory,
  getOrderStatusUpdates,
  cancelOrder,
  getNotifications,
  markNotificationRead,
  updateOrderStatus,
  modifyPendingOrder
} from '../controllers/orderController.js';
import {
  authenticate as authenticateRetailer,
  authorize as authorizeRetailer
} from '../middleware/retailerMiddleware.js';

import {
  authenticate as authenticateDistributor,
  authorize as authorizeDistributor
} from '../middleware/distributorMiddleware.js';
const router = express.Router();

// ===== RETAILER ROUTES =====

// Create new order request
router.post('/create', 
  authenticateRetailer, 
  createOrderRequest
);

// Get retailer's orders (all stages visible)
router.get('/retailer/orders', 
  authenticateRetailer, 
  getOrdersList
);

// Get specific order details (retailer can see all stages)
router.get('/retailer/orders/:orderId', 
  authenticateRetailer, 
  getOrderDetails
);

// Get order history/timeline for tracking
router.get('/retailer/orders/:orderId/history', 
  authenticateRetailer, 
  getOrderHistory
);

// Approve/reject modified order
router.put('/retailer/orders/:orderId/approve', 
  authenticateRetailer, 
  approveModifiedOrder
);

// Cancel order (only if pending)
router.put('/retailer/orders/:orderId/cancel', 
  authenticateRetailer, 
  cancelOrder
);

// Modify pending order
router.put('/retailer/orders/:orderId/modify', 
  authenticateRetailer, 
  modifyPendingOrder
);

// ===== DISTRIBUTOR ROUTES =====

// Get distributor's pending orders
router.get('/distributor/order', 
  authenticateDistributor, 
  getOrdersList
);

// Get specific order details for processing
router.get('/distributor/orders/:orderId', 
  authenticateDistributor, 
  getOrderDetails
);

// Process order (accept/reject/modify)
router.put('/distributor/orders/:orderId/process', 
  authenticateDistributor, 
  processOrderRequest
);

// Update order status (processing -> completed)
router.put('/distributor/orders/:orderId/status', 
  authenticateDistributor, 
  updateOrderStatus
);

// ===== SHARED ROUTES =====

// Get notifications for both retailers and distributors
router.get('/notifications', 
  
  getNotifications
);

// Mark notification as read
router.put('/notifications/:notificationId/read', 
 
  markNotificationRead
);

// Get real-time order status updates
router.get('/orders/:orderId/status', 
  
  getOrderStatusUpdates
);

export default router;