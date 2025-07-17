import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js'; // Assuming you have this
import Retailer from '../models/Retailer.js';
import Distributor from '../models/Distributor.js';

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

// DISTRIBUTOR SIDE - Accept/Reject Ordernpm start
export const processOrderRequest = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { action, rejectionReason, modifications } = req.body;
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
      
      // Calculate final total using the validated items
      const finalTotal = finalItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Reserve stock
      await reserveStock(finalItems);

      // Update order with plain objects
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
      
      console.log("Applying modifications:", modifications);
      console.log("Original items:", order.items);
      console.log("Modified items:", modifiedItems);
      
      const modifiedTotal = modifiedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      order.items = modifiedItems;
      order.totalAmount = modifiedTotal;
      console.log("Modified total amount:", modifiedTotal);
      order.status = 'modified';
      order.notes = order.notes ? `${order.notes}\n\nOrder modified by distributor` : 'Order modified by distributor';
      
      await order.save();

      // Enhanced notification with modification details
      await createNotification({
        recipientId: order.retailerId,
        recipientType: 'Retailer',
        type: 'order_modified',
        orderId: order._id,
        message: 'Your order has been modified by the distributor',
        data: { 
          orderNumber: order.orderNumber,
          modifiedTotal,
          originalTotal: modifications.summary?.originalTotal || 0,
          totalDifference: modifications.summary?.totalDifference || 0,
          changedItems: modifications.summary?.changedItems || [],
          removedItems: modifications.summary?.removedItems || []
        }
      });

      res.json({
        success: true,
        message: 'Order modified successfully',
        data: {
          orderId: order._id,
          status: order.status,
          modifiedTotal,
          originalTotal: modifications.summary?.originalTotal || 0,
          totalDifference: modifications.summary?.totalDifference || 0,
          modifications: modifications.summary
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

// IMPROVED: Apply distributor modifications
// IMPROVED: Apply distributor modifications with price validation
const applyModifications = async (originalItems, modifications) => {
  try {
    // Convert to plain objects first
    const modifiedItems = originalItems.map(item => 
      item.toObject ? item.toObject() : { ...item }
    );
    console.log("Original items:", modifiedItems);
    console.log("Modifications received:", modifications);

    // Validate the modifications structure
    if (!modifications || !modifications.items || !Array.isArray(modifications.items)) {
      throw new Error('Invalid modifications structure');
    }

    // Apply modifications based on the data structure you're sending
    for (const mod of modifications.items) {
      // Find item by productId and variantId (more reliable than SKU)
      const itemIndex = modifiedItems.findIndex(item => 
        item.productId?.toString() === mod.productId?.toString() ||
        item.sku === mod.sku // fallback to SKU matching
      );

      if (itemIndex === -1) {
        console.warn(`Item not found for modification:`, mod);
        continue;
      }

      // Handle item removal first
      if (mod.remove === true || mod.newQuantity === 0) {
        modifiedItems.splice(itemIndex, 1);
        continue;
      }

      // Apply quantity changes
      if (mod.newQuantity !== undefined) {
        // Validate stock availability and get current price for the new quantity
        const product = await Product.findOne({ 
          _id: mod.productId,
          'variants.sku': modifiedItems[itemIndex].sku 
        });

        if (product) {
          const variant = product.variants.find(v => v.sku === modifiedItems[itemIndex].sku);
          if (variant) {
            // Check stock availability
            if (variant.stock < mod.newQuantity) {
              throw new Error(`Insufficient stock for ${modifiedItems[itemIndex].productName}. Available: ${variant.stock}, Requested: ${mod.newQuantity}`);
            }
            
            // Update price to current selling price
            modifiedItems[itemIndex].price = variant.sellingPrice;
          } else {
            throw new Error(`Variant not found for product ${modifiedItems[itemIndex].productName}`);
          }
        } else {
          throw new Error(`Product not found for ${modifiedItems[itemIndex].productName}`);
        }

        modifiedItems[itemIndex].quantity = mod.newQuantity;
        modifiedItems[itemIndex].Ordered = mod.newQuantity;
      }
    }

    // Filter out items with zero quantity
    const finalItems = modifiedItems.filter(item => item.quantity > 0);

    if (finalItems.length === 0) {
      throw new Error('Cannot process order with no items');
    }

    // CRITICAL: Ensure all remaining items have valid prices
    for (const item of finalItems) {
      if (!item.price || item.price <= 0) {
        // Fetch current price if missing or invalid
        const product = await Product.findOne({ 
          _id: item.productId,
          'variants.sku': item.sku 
        });

        if (product) {
          const variant = product.variants.find(v => v.sku === item.sku);
          if (variant && variant.sellingPrice > 0) {
            item.price = variant.sellingPrice;
            console.log(`Updated price for ${item.productName}: ${item.price}`);
          } else {
            throw new Error(`Valid price not found for ${item.productName}`);
          }
        } else {
          throw new Error(`Product not found for price update: ${item.productName}`);
        }
      }
    }

    // Log final items with prices for debugging
    console.log("Final items with prices:", finalItems.map(item => ({
      productName: item.productName,
      sku: item.sku,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity
    })));

    return finalItems;

  } catch (error) {
    console.error('Error applying modifications:', error);
    throw error;
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

// MODIFY PENDING ORDER (RETAILER ONLY)
export const modifyPendingOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const retailerId = req.user.id;
    const { items, notes } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      retailerId,
      status: 'pending'
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or cannot be modified'
      });
    }

    // Validate new items (reuse your validateSkusOnly)
    const validatedItems = await validateSkusOnly(items, order.distributorId);

    order.items = validatedItems;
    order.notes = notes || order.notes;
    order.totalAmount = await calculateEstimatedTotal(validatedItems);

    await order.save();

    res.json({
      success: true,
      message: 'Order modified successfully',
      data: {
        orderId: order._id,
        status: order.status,
        items: order.items,
        notes: order.notes,
        totalAmount: order.totalAmount
      }
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
    // Convert Mongoose document to plain object first
    const plainItem = item.toObject ? item.toObject() : item;
    
    const product = await Product.findOne({ 
      distributorId,
      'variants.sku': plainItem.sku 
    });
    
    if (!product) {
      throw new Error(`Product with SKU ${plainItem.sku} not found`);
    }
    
    const variant = product.variants.find(v => v.sku === plainItem.sku);
    
    if (!variant) {
      throw new Error(`Variant with SKU ${plainItem.sku} not found`);
    }
    
    if (variant.stock < plainItem.quantity) {
      throw new Error(`Insufficient stock for SKU ${plainItem.sku}. Available: ${variant.stock}, Requested: ${plainItem.quantity}`);
    }
    
    // Create a clean plain object
    finalItems.push({
      productId: product._id,
      productName: product.name,
      variantName: variant.name,
      sku: plainItem.sku,
      quantity: plainItem.quantity,
      unit: plainItem.unit || 'box',
      Ordered: plainItem.quantity,
      price: variant.sellingPrice // Current price at acceptance time
    });
  }
  
  return finalItems;
};

// Reserve stock (reduce available stock)
const reserveStock = async (items) => {
  for (let item of items) {
    // Handle both plain objects and Mongoose documents
    const sku = item.sku || (item.toObject && item.toObject().sku);
    const quantity = item.quantity || (item.toObject && item.toObject().quantity);
    
    await Product.updateOne(
      { 'variants.sku': sku },
      { $inc: { 'variants.$.stock': -quantity } }
    );
  }
};
export const validateModificationRequest = (modifications) => {
  const errors = [];

  if (!modifications || typeof modifications !== 'object') {
    errors.push('Modifications object is required');
    return errors;
  }

  if (!modifications.items || !Array.isArray(modifications.items)) {
    errors.push('Modifications must contain an items array');
    return errors;
  }

  modifications.items.forEach((item, index) => {
    if (!item.productId && !item.sku) {
      errors.push(`Item ${index + 1}: productId or sku is required`);
    }

    if (item.newQuantity !== undefined) {
      if (typeof item.newQuantity !== 'number' || item.newQuantity < 0) {
        errors.push(`Item ${index + 1}: newQuantity must be a non-negative number`);
      }
    }

    if (item.remove !== undefined && typeof item.remove !== 'boolean') {
      errors.push(`Item ${index + 1}: remove must be a boolean`);
    }
  });

  return errors;
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
    const role = req.user.role;
    const { status } = req.query;
    const userId = req.user.id;

    let filter = {};
    if (role === 'retailer') {
      filter.retailerId = userId;
    } else {
      filter.distributorId = userId;
    }

    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .select('orderNumber status totalAmount createdAt items')
      .populate('retailerId', 'ownerName businessName phone email pincode')
      .populate('distributorId', 'ownerName phone email pincode')
      .sort({ createdAt: -1 })
      .limit(50);

    const responseData = orders.map(order => {
      const base = {
        id: order._id,
        orderNumber: order.orderNumber,
        items: order.items.map(item => ({
       productId: item.productId,
        })),
        status: order.status,
        totalAmount: order.totalAmount,
        itemCount: order.items.length,
        createdAt: order.createdAt,
      };
      

      if (role === 'distributor') {
        return {
          ...base,
          retailer: order.retailerId ? {
            id: order.retailerId._id,
            name: order.retailerId.ownerName,
            phone: order.retailerId.phone,
            businessName: order.retailerId.businessName,
          } : null
        };
      } else {
        return {
          ...base,
          distributor: order.distributorId ? {
            id: order.distributorId._id,
            name: order.distributorId.ownerName,
            phone: order.distributorId.phone,
            businessName: order.distributorId.businessName,
          } : null
        };
      }
    });

    res.json({ success: true, data: responseData });

  } catch (error) {
    console.error("Error fetching order list:", error);
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

    // Find the order and populate retailer/distributor info
    const order = await Order.findOne({
      _id: orderId,
      $or: [{ retailerId: userId }, { distributorId: userId }]
    })
      .populate('retailerId', 'businessName phone email pincode address')
      .populate('distributorId', 'companyName ownerName phone email gstNumber businessType pincode location address');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // --- Populate product and variant info for each item ---
    // We'll fetch all products for the items in the order
    const skus = order.items.map(item => item.sku);
    const products = await Product.find({ 'variants.sku': { $in: skus } });

    // Build a SKU -> {product, variant} map for fast lookup
    const skuMap = {};
    products.forEach(product => {
      product.variants.forEach(variant => {
        if (skus.includes(variant.sku)) {
          skuMap[variant.sku] = {
            productId: product._id,
            productName: product.name,
            productCategory: product.category,
            productIcon: product.icon,
            variantId: variant.id,
            variantName: variant.name,
            variantSku: variant.sku,
            variantImage: variant.image,
            variantDescription: variant.description,
            variantExpiry: variant.expiry,
            variantSellingPrice: variant.sellingPrice,
            variantCostPrice: variant.costPrice,
            variantStock: variant.stock
          };
        }
      });
    });

    // Attach product/variant info to each order item
    const itemsWithProductInfo = order.items.map(item => ({
      ...item.toObject(),
      ...skuMap[item.sku]
    }));

    // Optionally fetch order history/timeline if you want it in modal
    const notifications = await Notification.find({ orderId })
      .sort({ createdAt: 1 })
      .select('type message createdAt data');

    // Compose response object
    const orderObj = order.toObject();
    orderObj.retailer = orderObj.retailerId;
    orderObj.distributor = orderObj.distributorId;
    orderObj.items = itemsWithProductInfo;
    delete orderObj.retailerId;
    delete orderObj.distributorId;

    // Add order history/timeline if needed
    orderObj.orderHistory = notifications.map(n => ({
      type: n.type,
      message: n.message,
      date: n.createdAt,
      data: n.data
    }));

    res.json({
      success: true,
      data: orderObj
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