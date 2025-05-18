import Product from '../models/Product.js';

/**
 * Add a new product
 */
export const addProduct = async (req, res) => {
  const { id, name, icon, distributor, category, variants } = req.body;

  try {
    const productExists = await Product.findOne({ id });
    if (productExists) {
      return res.status(400).json({ message: 'Product with this ID already exists' });
    }

    const product = await Product.create({
      id,
      name,
      icon,
      distributor,
      category,
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
    for (const variant of updatedVariants) {
      await Inventory.findOneAndUpdate(
        { productId: product._id, variantId: variant._id },
        { stock: variant.stock || 0 },
        { upsert: true }
      );
    }

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

    await product.remove();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting product:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};