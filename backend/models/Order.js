const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  items: Array,
  status: { type: String, default: 'Pending' },
});

module.exports = mongoose.model('Order', OrderSchema);
