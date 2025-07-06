import mongoose from 'mongoose';

const VariantSchema = new mongoose.Schema({
  id: { 
    type: String, 
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
  },
  description: { 
    type: String, 
    default: 'No description provided' 
  },
  image: { 
    type: String, 
    default: 'https://via.placeholder.com/150' 
  }
});

const ProductSchema = new mongoose.Schema({
  distributorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Distributor', 
    required: true 
  },
  distributorships: {
    type: [String],
    enum: ['Groceries', 'Beverages', 'Personal Care'],
    required: true
  },
  id: { 
    type: String, 
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