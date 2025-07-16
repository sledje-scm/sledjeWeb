import mongoose from 'mongoose';
import Distributor from './Distributor.js';
import Retailer from './Retailer.js';
import Product from './Product.js';

const InventorySchema = new mongoose.Schema({
  retailerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Retailer', 
    required: true 
  },
  distributorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Distributor', 
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
  sku: { 
    type: String, 
    required: true, 
  },
  stock: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  orderedStock: {
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
InventorySchema.index({variantId: 1 , retailerId: 1}, { unique: true });

const Inventory = mongoose.model('Inventory', InventorySchema);
export default Inventory;