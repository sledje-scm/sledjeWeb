const Product = require('../models/Product');

// Get all products with optional filtering
exports.getProducts = async (req, res) => {
  try {
    const { category, search, filter } = req.query;
    
    // Build query
    let query = {};
    
    // Filter by category if provided
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Search functionality
    if (search) {
      // Split search terms and create OR conditions for each term
      const searchTerms = search.toLowerCase().split(' ');
      const searchConditions = searchTerms.map(term => ({
        $or: [
          { name: { $regex: term, $options: 'i' } },
          { distributor: { $regex: term, $options: 'i' } },
          { 'variants.name': { $regex: term, $options: 'i' } },
          { 'variants.sku': { $regex: term, $options: 'i' } }
        ]
      }));
      
      // Combine all search conditions with AND (all terms must match)
      query.$and = searchConditions;
    }
    
    // Apply stock filters
    if (filter === 'low-stock') {
      query['variants'] = {
        $elemMatch: { stock: { $gt: 0, $lte: 5 } }
      };
    } else if (filter === 'out-of-stock') {
      query['variants'] = {
        $elemMatch: { stock: 0 }
      };
    }
    
    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update product stock
exports.updateStock = async (req, res) => {
  try {
    const { productId, variantId, quantity, operation } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const variant = product.variants.id(variantId);
    if (!variant) {
      return res.status(404).json({ message: 'Variant not found' });
    }
    
    // Update stock based on operation
    if (operation === 'add') {
      variant.stock += quantity;
    } else if (operation === 'subtract') {
      if (variant.stock < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      variant.stock -= quantity;
    } else {
      variant.stock = quantity; // Direct set
    }
    
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};