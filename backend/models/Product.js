const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  expiry: {
    type: String,
    default: 'N/A'
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
});

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  icon: {//see about icons it cant have stirng data type
    type: String,
    default: '📦'
  },
  distributor: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  variants: [VariantSchema]
}, {
  timestamps: true
});

// Add virtual for total stock
ProductSchema.virtual('totalStock').get(function() {
  return this.variants.reduce((sum, variant) => sum + variant.stock, 0);
});

// Add method to check if product has low stock
ProductSchema.methods.hasLowStock = function() {
  return this.variants.some(variant => variant.stock > 0 && variant.stock <= 5);
};

// Add method to check if product has out of stock
ProductSchema.methods.hasOutOfStock = function() {
  return this.variants.some(variant => variant.stock === 0);
};

module.exports = mongoose.model('Product', ProductSchema);