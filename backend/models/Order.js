import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  retailer: { type: mongoose.Schema.Types.ObjectId, ref: 'Retailer', required: true },
  distributor: { type: mongoose.Schema.Types.ObjectId, ref: 'Distributor', required: true },
  items: [itemSchema],
  status: {
    type: String,
    enum: ['Pending', 'Ready', 'OnWay'],
    default: 'Pending',
  },
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Order', orderSchema);
