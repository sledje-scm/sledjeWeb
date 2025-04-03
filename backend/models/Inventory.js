const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    name: String,
    stock: Number,
    distributor: String,
});

module.exports = mongoose.model('Inventory', InventorySchema);
