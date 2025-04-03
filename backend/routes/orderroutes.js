const express = require('express');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get all orders for a user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Place a new order
router.post('/place', authMiddleware, async (req, res) => {
    const { items } = req.body;
    try {
        const newOrder = new Order({ userId: req.user.id, items });
        await newOrder.save();
        res.status(201).json({ message: 'Order placed successfully', newOrder });
    } catch (error) {
        res.status(500).json({ error: 'Failed to place order' });
    }
});

// Update order status (e.g., pending → completed)
router.put('/update/:id', authMiddleware, async (req, res) => {
    const { status } = req.body;
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json({ message: 'Order status updated', updatedOrder });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order' });
    }
});

// Delete an order
router.delete('/delete/:id', authMiddleware, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
});

module.exports = router;
