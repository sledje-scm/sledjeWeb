// controllers/orderController.js

import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a new order
 * @route POST /api/orders
 * @access Private
 */
exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || !items.length) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }
    
    // Generate unique order ID
    const orderId = `ORD-${Date.now().toString().slice(-6)}-${uuidv4().slice(0, 8)}`;
    
    // Calculate total amount and prepare order items with full details
    let totalAmount = 0;
    const orderItems = [];
    
    // Process each item in the order
    for (const item of items) {
      const { productId, variantId, quantity, unit } = item;
      
      if (!productId || !variantId || !quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid order item' });
      }
      
      // Get the product and variant
      const product = await Product.findOne({ id: productId });
      
      if (!product) {
        return res.status(404).json({ error: `Product with ID ${productId} not found` });
      }
      
      const variant = product.variants.find(v => v.id == variantId);
      
      if (!variant) {
        return res.status(404).json({ error: `Variant with ID ${variantId} not found for product ${productId}` });
      }
      
      // Check if enough stock is available
      if (variant.stock < quantity) {
        return res.status(400).json({ 
          error: `Not enough stock for ${product.name} - ${variant.name}. Available: ${variant.stock}, Requested: ${quantity}` 
        });
      }
      
      // Calculate item price
      const price = variant.price;
      const totalPrice = price * quantity;
      
      // Add to order items
      orderItems.push({
        productId,
        productName: product.name,
        variantId,
        variantName: variant.name,
        quantity,
        unit: unit || 'box',
        price,
        totalPrice
      });
      
      // Add to total amount
      totalAmount += totalPrice;
      
      // Update stock
      variant.stock -= quantity;
      await product.save();
    }
    
    // Create the order
    const order = new Order({
      orderId,
      userId: req.user._id,
      items: orderItems,
      totalAmount,
      status: 'pending',
      paymentStatus: 'unpaid'
    });
    
    await order.save();
    
    res.status(201).json({ 
      orderId: order.orderId,
      totalAmount: order.totalAmount,
      status: order.status,
      items: order.items.length,
      createdAt: order.createdAt
    });
    
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get all orders for the authenticated user
 * @route GET /api/orders
 * @access Private
 */
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Error getting user orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get order by ID
 * @route GET /api/orders/:orderId
 * @access Private
 */
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      orderId: req.params.orderId,
      userId: req.user._id
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error getting order by ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Cancel an order
 * @route PATCH /api/orders/:orderId/cancel
 * @access Private
 */
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      orderId: req.params.orderId,
      userId: req.user._id
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Check if order can be cancelled
    if (order.status !== 'pending') {
      return res.status(400).json({ error: `Cannot cancel order with status: ${order.status}` });
    }
    
    // Update order status
    order.status = 'cancelled';
    
    // Restore stock for each item
    for (const item of order.items) {
      const product = await Product.findOne({ id: item.productId });
      
      if (product) {
        const variant = product.variants.find(v => v.id == item.variantId);
        
        if (variant) {
          variant.stock += item.quantity;
          await product.save();
        }
      }
    }
    
    await order.save();
    
    res.json({ 
      orderId: order.orderId,
      status: order.status,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get all orders (admin only)
 * @route GET /api/admin/orders
 * @access Private (admin only)
 */
exports.getAllOrders = async (req, res) => {
  try {
    const { status, sort = 'newest' } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Determine sort order
    let sortOption = {};
    switch (sort) {
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'highest':
        sortOption = { totalAmount: -1 };
        break;
      case 'lowest':
        sortOption = { totalAmount: 1 };
        break;
      default:
        sortOption = { createdAt: -1 }; // newest
    }
    
    const orders = await Order.find(query)
      .sort(sortOption)
      .populate('userId', 'name email');
    
    res.json(orders);
  } catch (error) {
    console.error('Error getting all orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Update order status (admin only)
 * @route PATCH /api/admin/orders/:orderId/status
 * @access Private (admin only)
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Valid status required' });
    }
    
    const order = await Order.findOne({ orderId: req.params.orderId });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Handle stock restoration if cancelling an order
    if (status === 'cancelled' && order.status !== 'cancelled') {
      // Restore stock for each item
      for (const item of order.items) {
        const product = await Product.findOne({ id: item.productId });
        
        if (product) {
          const variant = product.variants.find(v => v.id == item.variantId);
          
          if (variant) {
            variant.stock += item.quantity;
            await product.save();
          }
        }
      }
    }
    
    // Update order status
    order.status = status;
    await order.save();
    
    res.json({ 
      orderId: order.orderId,
      status: order.status,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Server error' });
  }
};