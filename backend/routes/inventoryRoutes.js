const express = require('express');
const Inventory = require('../models/Inventory');
const authMiddleware = require('../middleware/authMiddleware1');

const router = express.Router();

// Get all inventory items
router.get('/', authMiddleware, async (req, res) => {
    try {
        const inventory = await Inventory.find();
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch inventory' });
    }
});

// Add a new inventory item
router.post('/add', authMiddleware, async (req, res) => {
    const { name, stock, distributor } = req.body;
    try {
        const newItem = new Inventory({ name, stock, distributor });
        await newItem.save();
        res.status(201).json({ message: 'Item added successfully', newItem });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add item' });
    }
});

// Update inventory stock
router.put('/update/:id', authMiddleware, async (req, res) => {
    const { stock } = req.body;
    try {
        const updatedItem = await Inventory.findByIdAndUpdate(
            req.params.id,
            { stock },
            { new: true }
        );
        res.json({ message: 'Stock updated successfully', updatedItem });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update stock' });
    }
});

// Delete an inventory item
router.delete('/delete/:id', authMiddleware, async (req, res) => {
    try {
        await Inventory.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

module.exports = router;
