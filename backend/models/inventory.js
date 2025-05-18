import mongoose from 'mongoose';

const InventorySchema = new mongoose.Schema({
  retailerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Retailer', 
    required: true 
  },
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  variantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  stock: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
});

// Add indexing for faster queries
InventorySchema.index({ productId: 1, variantId: 1 }, { unique: true });

const Inventory = mongoose.model('Inventory', InventorySchema);
export default Inventory;