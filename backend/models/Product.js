import mongoose from 'mongoose';

const VariantSchema = new mongoose.Schema({
  id: { 
    type: Number, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  stock: { 
    type: Number, 
    default: 0 
  },
  sellingPrice: { 
    type: Number, 
    required: true 
  },
  costPrice: { 
    type: Number, 
    required: true 
  },
  expiry: { 
    type: String, 
    default: 'N/A' 
  },
  sku: { 
    type: String, 
    required: true, 
    unique: true 
  }
});

const ProductSchema = new mongoose.Schema({
  distributorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Distributor', 
    required: true 
  },
  id: { 
    type: Number, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  icon: { 
    type: String, 
    default: '📦' 
  },
  category: { 
    type: String, 
    required: true 
  },
  variants: [VariantSchema]
}, { timestamps: true });

// Add indexing for faster queries
ProductSchema.index({ category: 1 });
ProductSchema.index({ name: 'text', distributor: 'text' });
const Product = mongoose.model('Product', ProductSchema);
export default Product;