const Order = require('../models/Order');
const Product = require('../models/Product');

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { items, notes } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain items' });
    }
    
    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
    
    // Create order
    const newOrder = new Order({
      items,
      totalAmount,
      notes
    });
    
    // Save order
    const savedOrder = await newOrder.save();
    
    // Update stock for each item
    for (const item of items) {
      await Product.findOneAndUpdate(
        { _id: item.productId, 'variants._id': item.variantId },
        { $inc: { 'variants.$.stock': -item.quantity } }
      );
    }
    
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// Cancel an order and restore stock
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.status === 'cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }
    
    // Update order status
    order.status = 'cancelled';
    await order.save();
    
    // Restore stock for each item
    for (const item of order.items) {
      await Product.findOneAndUpdate(
        { _id: item.productId, 'variants._id': item.variantId },
        { $inc: { 'variants.$.stock': item.quantity } }
      );
    }
    
    res.status(200).json(order);
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};