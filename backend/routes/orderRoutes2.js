const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const router = express.Router();

router.post('/', async (req, res) => {
    const { userId } = req.body;
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
    }

    const order = new Order({ userId, items: cart.items });
    await order.save();
    await Cart.deleteOne({ userId });
    res.status(201).json({ message: 'Order placed successfully' });
});

router.get('/:userId', async (req, res) => {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
});

module.exports = router;
