import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  sku: {
    type: String,
    required: true
  },

  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unit: {
    type: String,
    enum: ['box', 'piece', 'pack'],
    default: 'box'
  },
  Ordered: {
    type: Number,
    required: true
  }
});

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: false,
    unique: true
  },
  retailerId: { type: mongoose.Schema.Types.ObjectId, ref: "Retailer" },
  distributorId: { type: mongoose.Schema.Types.ObjectId, ref: "Distributor" },
  items: [OrderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled', 'modified'],
    default: 'pending'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Generate order number before saving
OrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    console.log("Generating order number...");
    // Generate a unique order number based on date and a random number
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `ORD-${year}${month}${day}-${random}`;
  }
  next();
});

// Add indexing for faster queries
OrderSchema.index({ retailerId: 1, status: 1, createdAt: -1 });
OrderSchema.index({ distributorId: 1, status: 1, createdAt: -1 });
OrderSchema.index({ orderNumber: 1 }, { unique: true });
export default mongoose.model('Order', OrderSchema);
