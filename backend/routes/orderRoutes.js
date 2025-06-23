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
  markNotificationRead
} from '../controllers/orderController.js';
import retailerMiddleware from '../middleware/retailerMiddleware.js';
import distributorMiddleware from '../middleware/distributorMiddleware.js';

const router = express.Router();

// ===== RETAILER ROUTES =====

// Create new order request
router.post('/create', 
  retailerMiddleware, 
  createOrderRequest
);

// Get retailer's orders (all stages visible)
router.get('/retailer/orders', 
  retailerMiddleware, 
  getOrdersList
);

// Get specific order details (retailer can see all stages)
router.get('/retailer/orders/:orderId', 
  retailerMiddleware, 
  getOrderDetails
);

// Get order history/timeline for tracking
router.get('/retailer/orders/:orderId/history', 
  retailerMiddleware, 
  getOrderHistory
);

// Approve/reject modified order
router.put('/retailer/orders/:orderId/approve', 
  retailerMiddleware, 
  approveModifiedOrder
);

// Cancel order (only if pending)
router.put('/retailer/orders/:orderId/cancel', 
  retailerMiddleware, 
  cancelOrder
);

// ===== DISTRIBUTOR ROUTES =====

// Get distributor's pending orders
router.get('/distributor/orders', 
  distributorMiddleware, 
  getOrdersList
);

// Get specific order details for processing
router.get('/distributor/orders/:orderId', 
  distributorMiddleware, 
  getOrderDetails
);

// Process order (accept/reject/modify)
router.put('/distributor/orders/:orderId/process', 
  distributorMiddleware, 
  processOrderRequest
);

// Update order status (processing -> completed)
router.put('/distributor/orders/:orderId/status', 
  distributorMiddleware, 
  updateOrderStatus
);

// ===== SHARED ROUTES =====

// Get notifications for both retailers and distributors
router.get('/notifications', 
  authMiddleware, 
  getNotifications
);

// Mark notification as read
router.put('/notifications/:notificationId/read', 
  authMiddleware, 
  markNotificationRead
);

// Get real-time order status updates
router.get('/orders/:orderId/status', 
  authMiddleware, 
  getOrderStatusUpdates
);

export default router;