import Retailer from '../models/Retailer.js';
import Product from '../models/Product.js';

/**
 * Add a new product
 */
export const addProduct = async (req, res) => {
  const { id, name, icon, distributorships, category, subcategory, variants } = req.body;

  try {
    const productExists = await Product.findOne({ id });
    if (productExists) {
      return res.status(400).json({ message: 'Product with this ID already exists' });
    }

    const product = await Product.create({
      id,
      name,
      icon,
      distributorId: req.user._id,
      distributorships,
      category,
      subcategory, // ✅ fixed casing
      variants,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('❌ Error adding product:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Update an existing product
 */
export const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, icon, distributorships, category, subcategory, variants } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name || product.name;
    product.icon = icon || product.icon;
    product.distributorships = distributorships || product.distributorships;
    product.category = category || product.category;
    product.subcategory = subcategory || product.subcategory;
    product.variants = variants || product.variants;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('❌ Error updating product:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Delete a product
 */
export const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting product:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Get products with optional filtering
 * GET /api/products?distributorId=xyz&category=abc&subcategory=def&search=term
 */
export const getProducts = async (req, res) => {
  try {
    const { distributorId, category, subcategory, search } = req.query;

    if (!distributorId) {
      return res.status(400).json({ message: "Missing distributorId" });
    }

    const query = { distributorId };

    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory; // ✅ fixed casing
    if (search) query.name = { $regex: search, $options: "i" };

    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Get products for all connected distributors of a retailer
 * GET /api/products/connected-distributors
 */
export const getProductsForConnectedDistributors = async (req, res) => {
  try {
    const retailer = await Retailer.findById(req.user._id);
    if (!retailer || !retailer.distributors || retailer.distributors.length === 0) {
      return res.json({ products: [] });
    }

    const products = await Product.find({
      distributorId: { $in: retailer.distributors }
    }).lean();

    res.json({ products });
  } catch (error) {
    console.error("❌ Error fetching connected distributors' products:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
