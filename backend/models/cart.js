const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    items: Array,
});

module.exports = mongoose.model('Cart', CartSchema);
