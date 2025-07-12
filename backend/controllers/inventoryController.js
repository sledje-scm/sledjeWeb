import Inventory from '../models/Inventory.js';
import Product from '../models/Product.js';
/**
 * Fetch inventory data for all products and their variants
 */
export const getInventory = async (req, res) => {
  try {
    console.log('📥 Fetching inventory for retailer:');
    // Fetch inventory for the logged-in retailer
    const inventory = await Inventory.find({ retailerId: req.user._id }).populate({
      path: 'productId',
      populate: { path: 'distributorId' ,
        select: 'ownerName email phone companyName _id' 
      }
    });

    // Map inventory data to the required structure
    const inventoryData = inventory.map(item => {
      const product = item.productId;
      const variant = product.variants.find(v => v._id.toString() === item.variantId.toString());

      return {
        id: product.id,
        name: product.name,
        icon: product.icon,
        distributorId: product.distributorId._id, // Assuming distributorId is an ObjectId
        distributor: product.distributorId.ownerName, // Assuming distributor name is populated
        category: product.category,
        subcategory: product.category,
        variants: product.variants.map(v => ({
          id: v.id,
          _id: v._id,
          name: v.name,
          stock: v._id.toString() === item.variantId.toString() ? item.stock : 0,
          sellingPrice: v.sellingPrice,
          costPrice: v.costPrice,
          expiry: v.expiry,
          sku: v.sku
        }))
      };
    });

    res.status(200).json(inventoryData);
  } catch (error) {
    console.error('❌ Error fetching inventory:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Update inventory stock for a specific product variant
 */
export const updateInventoryStock = async (req, res) => {
  const { productId, variantId, quantity } = req.body;

  try {
    if (!productId || !variantId || quantity === undefined || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const inventoryItem = await Inventory.findOneAndUpdate(
      { retailerId: req.user._id, productId, variantId },
      { $inc: { stock: quantity }, lastUpdated: Date.now() }, // Increment stock by the incoming quantity
      { new: true }
    );

    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.status(200).json({ message: 'Inventory stock updated successfully', inventoryItem });
  } catch (error) {
    console.error('❌ Error updating inventory stock:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};



/**
 * Handle checkout: Bulk update inventory stock based on cart items
 */
export const checkoutInventory = async (req, res) => {
  const { cartItems } = req.body;

  try {
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty or invalid' });
    }

    const bulkOperations = cartItems.map(item => ({
      updateOne: {
        filter: { retailerId: req.user._id, productId: item.productId, variantId: item.variantId },
        update: { $inc: { stock: item.quantity }, lastUpdated: Date.now() },
        upsert: true,
      },
    }));

    await Inventory.bulkWrite(bulkOperations);

    res.status(200).json({ message: 'Checkout successful, inventory updated' });
  } catch (error) {
    console.error('❌ Error during checkout:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};


export const addToInventory = async (req, res) => {
  const { variantId ,stock=0 } = req.body;
  console.log('Adding to inventory:', variantId, stock);  
  try {
    // Find the product and variant by variantId
    const product = await Product.findOne({ "variants._id": variantId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found for this variant' });
    }

    const variant = product.variants.id(variantId);
    if (!variant) {
      return res.status(404).json({ message: 'Variant not found' });
    }

    // Upsert inventory item for this retailer, product, and variant
    const inventoryItem = await Inventory.findOneAndUpdate(
      {
        retailerId: req.user._id,
        productId: product._id,
        variantId: variant._id,
        distributorId: product.distributorId._id, // Ensure distributor is also matched
      },
      {
        $inc: { stock }, // increment by stock (can be 0 for just adding)
        sku: variant.sku,
        lastUpdated: Date.now(),
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Product variant added to inventory', inventoryItem });
  } catch (error) {
    console.error('❌ Error adding to inventory:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};