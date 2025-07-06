import e from 'express';
import Retailer from '../models/Retailer.js';
import Product from '../models/Product.js';

/**
 * Add a new product
 */
export const addProduct = async (req, res) => {
  const { id, name, icon, distributorships, category, variants } = req.body;

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
      variants,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('❌ Error adding product:', error.message);
    console.error(error);

    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Update an existing product
 */
export const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, icon, distributor, category, variants } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name || product.name;
    product.icon = icon || product.icon;
    product.distributor = distributor || product.distributor;
    product.category = category || product.category;

    // Update variants
    const updatedVariants = variants || product.variants;
    product.variants = updatedVariants;

    const updatedProduct = await product.save();

    // Sync inventory for updated variants
    // for (const variant of updatedVariants) {
    //   await Inventory.findOneAndUpdate(
    //     { productId: product._id, variantId: variant._id },
    //     { stock: variant.stock || 0 },
    //     { upsert: true }
    //   );
    // }

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

// GET /api/products?distributorId=xyz&category=abc&search=term
export const getProducts = async (req, res) => {
  console.log('Fetching products with query:', req.query);
  console.log('Distributor ID:', req.query.distributorId);
  try {
    const { distributorId } = req.query;

    if (!distributorId) {
      return res.status(400).json({ message: "Missing distributorId" });
    }

    let query = { distributorId };

    // if (category) {
    //   query.category = category;
    // }

    // if (search) {
    //   query.name = { $regex: search, $options: "i" }; // Case-insensitive search by name
    // }

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
    // Assuming req.user._id is the retailer's ID (from auth middleware)
    const retailer = await Retailer.findById(req.user._id);
    if (!retailer || !retailer.distributors || retailer.distributors.length === 0) {
      return res.json({ products: [] });
    }
    // Fetch products for those distributors
    const products = await Product.find({
      distributorId: { $in: retailer.distributors }
    }).lean();
    res.json({ products });
  } catch (error) {
    console.error("❌ Error fetching connected distributors' products:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
