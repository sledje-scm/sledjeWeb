import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js'; // Assuming you have this

// RETAILER SIDE - Create and Send Order
export const createOrderRequest = async (req, res) => {
  try {
    const { distributorId, items, notes } = req.body;
    const retailerId = req.user.id; // From auth middleware

    // Minimal validation - just check SKUs exist
    const validatedItems = await validateSkusOnly(items, distributorId);
    
    // Calculate total with current prices (might change before acceptance)
    const estimatedTotal = await calculateEstimatedTotal(validatedItems);

    const order = new Order({
      retailerId,
      distributorId,
      items: validatedItems,
      totalAmount: estimatedTotal,
      status: 'pending', // Waiting for distributor acceptance
      notes
    });

    await order.save();

    // Minimal notification to distributor (just order ID and retailer info)
    await createNotification({
      recipientId: distributorId,
      recipientType: 'Distributor',
      type: 'new_order',
      orderId: order._id,
      message: `New order request from retailer`,
      data: { 
        orderNumber: order.orderNumber,
        itemCount: items.length,
        estimatedTotal 
      }
    });

    res.status(201).json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        estimatedTotal
      },
      message: 'Order request sent to distributor'
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// DISTRIBUTOR SIDE - Accept/Reject Order
export const processOrderRequest = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { action, rejectionReason, modifications } = req.body; // action: 'accept' | 'reject' | 'modify'
    const distributorId = req.user.id;

    const order = await Order.findOne({ 
      _id: orderId, 
      distributorId,
      status: 'pending' 
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or already processed'
      });
    }

    if (action === 'accept') {
      // Validate stock and update final prices at acceptance time
      const finalItems = await validateStockAndUpdatePrices(order.items, distributorId);
      const finalTotal = finalItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Reserve stock
      await reserveStock(finalItems);

      order.items = finalItems;
      order.totalAmount = finalTotal;
      order.status = 'processing';
      
      await order.save();

      // Notify retailer of acceptance
      await createNotification({
        recipientId: order.retailerId,
        recipientType: 'Retailer',
        type: 'order_accepted',
        orderId: order._id,
        message: 'Your order has been accepted',
        data: { 
          orderNumber: order.orderNumber,
          finalTotal 
        }
      });

      res.json({
        success: true,
        message: 'Order accepted successfully',
        data: {
          orderId: order._id,
          status: order.status,
          finalTotal
        }
      });

    } else if (action === 'reject') {
      order.status = 'cancelled';
      order.notes = order.notes ? `${order.notes}\n\nRejection reason: ${rejectionReason}` : `Rejection reason: ${rejectionReason}`;
      
      await order.save();

      // Notify retailer of rejection
      await createNotification({
        recipientId: order.retailerId,
        recipientType: 'Retailer',
        type: 'order_rejected',
        orderId: order._id,
        message: 'Your order has been rejected',
        data: { 
          orderNumber: order.orderNumber,
          reason: rejectionReason 
        }
      });

      res.json({
        success: true,
        message: 'Order rejected',
        data: {
          orderId: order._id,
          status: order.status
        }
      });

    } else if (action === 'modify') {
      // Handle partial fulfillment or quantity modifications
      const modifiedItems = await applyModifications(order.items, modifications);
      const modifiedTotal = modifiedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      order.items = modifiedItems;
      order.totalAmount = modifiedTotal;
      order.status = 'modified';
      order.notes = order.notes ? `${order.notes}\n\nOrder modified by distributor` : 'Order modified by distributor';
      
      await order.save();

      // Notify retailer of modifications (they need to re-approve)
      await createNotification({
        recipientId: order.retailerId,
        recipientType: 'Retailer',
        type: 'order_modified',
        orderId: order._id,
        message: 'Your order has been modified by the distributor',
        data: { 
          orderNumber: order.orderNumber,
          modifiedTotal,
          modifications 
        }
      });

      res.json({
        success: true,
        message: 'Order modified successfully',
        data: {
          orderId: order._id,
          status: order.status,
          modifiedTotal,
          modifications
        }
      });
    }

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// RETAILER SIDE - Approve Modified Order
export const approveModifiedOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { approved } = req.body; // true/false
    const retailerId = req.user.id;

    const order = await Order.findOne({
      _id: orderId,
      retailerId,
      status: 'modified'
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Modified order not found'
      });
    }

    if (approved) {
      // Reserve stock and move to processing
      await reserveStock(order.items);
      order.status = 'processing';
      
      await createNotification({
        recipientId: order.distributorId,
        recipientType: 'Distributor',
        type: 'modification_approved',
        orderId: order._id,
        message: 'Retailer approved the order modifications'
      });
    } else {
      order.status = 'cancelled';
      
      await createNotification({
        recipientId: order.distributorId,
        recipientType: 'Distributor',
        type: 'modification_rejected',
        orderId: order._id,
        message: 'Retailer rejected the order modifications'
      });
    }

    await order.save();

    res.json({
      success: true,
      message: approved ? 'Modified order approved' : 'Modified order rejected',
      data: { orderId: order._id, status: order.status }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// HELPER FUNCTIONS

// Minimal validation - only check if SKUs exist for this distributor
const validateSkusOnly = async (items, distributorId) => {
  const validatedItems = [];
  
  for (let item of items) {
    const product = await Product.findOne({ 
      distributorId,
      'variants.sku': item.sku 
    }, 'name variants.$');
    
    if (!product) {
      throw new Error(`SKU ${item.sku} not found for this distributor`);
    }
    
    const variant = product.variants[0]; // MongoDB returns only matching subdoc
    
    validatedItems.push({
      sku: item.sku,
      quantity: item.quantity,
      unit: item.unit || 'box',
      Ordered: item.quantity,
      // Store minimal reference data (will be updated at acceptance)
      productId: product._id,
      productName: product.name,
      variantName: variant.name,
      price: variant.sellingPrice // Current price, may change
    });
  }
  
  return validatedItems;
};

// Calculate estimated total (prices may change before acceptance)
const calculateEstimatedTotal = async (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Full validation with stock check and price update at acceptance time
const validateStockAndUpdatePrices = async (items, distributorId) => {
  const finalItems = [];
  
  for (let item of items) {
    const product = await Product.findOne({ 
      distributorId,
      'variants.sku': item.sku 
    });
    
    const variant = product.variants.find(v => v.sku === item.sku);
    
    if (variant.stock < item.quantity) {
      throw new Error(`Insufficient stock for SKU ${item.sku}. Available: ${variant.stock}, Requested: ${item.quantity}`);
    }
    
    // Update with current prices
    finalItems.push({
      ...item,
      price: variant.sellingPrice, // Current price at acceptance time
      productId: product._id,
      productName: product.name,
      variantName: variant.name
    });
  }
  
  return finalItems;
};

// Reserve stock (reduce available stock)
const reserveStock = async (items) => {
  for (let item of items) {
    await Product.updateOne(
      { 'variants.sku': item.sku },
      { $inc: { 'variants.$.stock': -item.quantity } }
    );
  }
};

// Apply distributor modifications
const applyModifications = async (originalItems, modifications) => {
  const modifiedItems = [...originalItems];
  
  modifications.forEach(mod => {
    const itemIndex = modifiedItems.findIndex(item => item.sku === mod.sku);
    if (itemIndex !== -1) {
      if (mod.newQuantity !== undefined) {
        modifiedItems[itemIndex].quantity = mod.newQuantity;
        modifiedItems[itemIndex].Ordered = mod.newQuantity;
      }
      if (mod.remove) {
        modifiedItems.splice(itemIndex, 1);
      }
    }
  });
  
  return modifiedItems;
};

// Simple notification helper
const createNotification = async ({ recipientId, recipientType, type, orderId, message, data = {} }) => {
  // Only send essential data to minimize transfer
  const notification = new Notification({
    recipientId,
    recipientType: recipientType || 'Retailer', // Default to retailer
    type,
    orderId,
    message,
    data,
    read: false
  });
  
  await notification.save();
  
  // Here you could also trigger real-time notification (Socket.io, push notification, etc.)
  // broadcastNotification(recipientId, { type, message, orderId, data });
};

// GET ORDERS (with minimal data for lists)
export const getOrdersList = async (req, res) => {
  try {
    const { status, role } = req.query; // role: 'retailer' | 'distributor'
    const userId = req.user.id;
    
    let filter = {};
    if (role === 'retailer') {
      filter.retailerId = userId;
    } else {
      filter.distributorId = userId;
    }
    
    if (status) filter.status = status;

    // Return minimal data for list view
    const orders = await Order.find(filter)
      .select('orderNumber status totalAmount createdAt items.length')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: orders.map(order => ({
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount,
        itemCount: order.items.length,
        createdAt: order.createdAt
      }))
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET SINGLE ORDER (full details only when needed)
export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    
    const order = await Order.findOne({
      _id: orderId,
      $or: [{ retailerId: userId }, { distributorId: userId }]
    })
    .populate('retailerId', 'name email phone')
    .populate('distributorId', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET ORDER HISTORY/TIMELINE - Retailer can track all stages
export const getOrderHistory = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    
    // Get order with basic info
    const order = await Order.findOne({
      _id: orderId,
      $or: [{ retailerId: userId }, { distributorId: userId }]
    }).select('orderNumber status createdAt updatedAt notes');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Get all notifications related to this order for timeline
    const notifications = await Notification.find({ orderId })
      .sort({ createdAt: 1 })
      .select('type message createdAt data');

    // Build timeline
    const timeline = [
      {
        stage: 'created',
        status: 'Order Placed',
        timestamp: order.createdAt,
        message: 'Order request sent to distributor',
        type: 'info'
      }
    ];

    // Add notification events to timeline
    notifications.forEach(notif => {
      const timelineItem = {
        stage: notif.type,
        timestamp: notif.createdAt,
        message: notif.message,
        data: notif.data
      };

      switch(notif.type) {
        case 'order_accepted':
          timelineItem.status = 'Order Accepted';
          timelineItem.type = 'success';
          break;
        case 'order_rejected':
          timelineItem.status = 'Order Rejected';
          timelineItem.type = 'error';
          break;
        case 'order_modified':
          timelineItem.status = 'Order Modified';
          timelineItem.type = 'warning';
          break;
        case 'order_completed':
          timelineItem.status = 'Order Completed';
          timelineItem.type = 'success';
          break;
        default:
          timelineItem.type = 'info';
      }

      timeline.push(timelineItem);
    });

    res.json({
      success: true,
      data: {
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          currentStatus: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt
        },
        timeline
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET REAL-TIME ORDER STATUS UPDATES
export const getOrderStatusUpdates = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    
    const order = await Order.findOne({
      _id: orderId,
      $or: [{ retailerId: userId }, { distributorId: userId }]
    }).select('orderNumber status totalAmount updatedAt');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Get unread notifications for this order
    const unreadNotifications = await Notification.find({
      orderId,
      recipientId: userId,
      read: false
    }).sort({ createdAt: -1 });

    // Status info for retailer
    const statusInfo = {
      orderId: order._id,
      orderNumber: order.orderNumber,
      currentStatus: order.status,
      lastUpdated: order.updatedAt,
      totalAmount: order.totalAmount,
      hasUpdates: unreadNotifications.length > 0,
      updates: unreadNotifications.map(notif => ({
        id: notif._id,
        type: notif.type,
        message: notif.message,
        timestamp: notif.createdAt,
        data: notif.data
      }))
    };

    // Add status-specific info
    switch(order.status) {
      case 'pending':
        statusInfo.description = 'Waiting for distributor response';
        statusInfo.canCancel = true;
        break;
      case 'modified':
        statusInfo.description = 'Distributor has modified your order - approval needed';
        statusInfo.needsApproval = true;
        break;
      case 'processing':
        statusInfo.description = 'Order accepted and being prepared';
        statusInfo.canCancel = false;
        break;
      case 'completed':
        statusInfo.description = 'Order completed and delivered';
        break;
      case 'cancelled':
        statusInfo.description = 'Order cancelled';
        break;
    }

    res.json({
      success: true,
      data: statusInfo
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// CANCEL ORDER (Retailer only, only if pending)
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const retailerId = req.user.id;

    const order = await Order.findOne({
      _id: orderId,
      retailerId,
      status: 'pending' // Can only cancel pending orders
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or cannot be cancelled'
      });
    }

    order.status = 'cancelled';
    order.notes = order.notes ? 
      `${order.notes}\n\nCancelled by retailer: ${reason}` : 
      `Cancelled by retailer: ${reason}`;
    
    await order.save();

    // Notify distributor
    await createNotification({
      recipientId: order.distributorId,
      recipientType: 'Distributor',
      type: 'order_cancelled',
      orderId: order._id,
      message: 'Order cancelled by retailer',
      data: { 
        orderNumber: order.orderNumber,
        reason 
      }
    });

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: {
        orderId: order._id,
        status: order.status
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE ORDER STATUS (Distributor only - processing to completed)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, notes } = req.body;
    const distributorId = req.user.id;

    const order = await Order.findOne({
      _id: orderId,
      distributorId,
      status: 'processing' // Can only update processing orders
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or not in processing state'
      });
    }

    if (!['completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Can only mark as completed or cancelled'
      });
    }

    order.status = status;
    if (notes) {
      order.notes = order.notes ? `${order.notes}\n\n${notes}` : notes;
    }
    
    await order.save();

    // Notify retailer
    await createNotification({
      recipientId: order.retailerId,
      recipientType: 'Retailer',
      type: status === 'completed' ? 'order_completed' : 'order_cancelled',
      orderId: order._id,
      message: status === 'completed' ? 
        'Your order has been completed' : 
        'Your order has been cancelled',
      data: { 
        orderNumber: order.orderNumber,
        finalStatus: status
      }
    });

    res.json({
      success: true,
      message: `Order ${status} successfully`,
      data: {
        orderId: order._id,
        status: order.status
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// GET NOTIFICATIONS
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { read, limit = 20, page = 1 } = req.query;
    
    let filter = { recipientId: userId };
    if (read !== undefined) {
      filter.read = read === 'true';
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('orderId', 'orderNumber');

    const unreadCount = await Notification.countDocuments({
      recipientId: userId,
      read: false
    });

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// MARK NOTIFICATION AS READ
export const markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipientId: userId },
      { read: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};