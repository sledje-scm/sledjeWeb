const express = require('express');
const Cart = require('../models/Cart');

const router = express.Router();

router.post('/', async (req, res) => {
    const { userId, items } = req.body;
    await Cart.updateOne({ userId }, { items }, { upsert: true });
    res.status(200).json({ message: 'Cart updated' });
});

router.get('/:userId', async (req, res) => {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart || { items: [] });
});

module.exports = router;
