import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Retailer from '../models/Retailer.js';
import Distributor from '../models/Distributor.js';

// Get pending orders
export const getPendingOrders = async (req, res) => {
  const orders = await Order.find({ retailer: req.user._id, status: 'Pending' }).populate('items.product distributor');
  res.json(orders);
};

// Update item quantities, rates in an order
export const updateOrderItem = async (req, res) => {
  const { id } = req.params;
  const { items } = req.body;

  const order = await Order.findOne({ _id: id, retailer: req.user._id });
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.items = items;
  order.totalPrice = items.reduce((acc, item) => acc + item.price, 0);
  await order.save();

  res.json(order);
};

// Move selected orders to Ready
export const moveToReady = async (req, res) => {
  const { orderIds } = req.body; // array of order _id

  const updated = await Order.updateMany(
    { _id: { $in: orderIds }, retailer: req.user._id },
    { $set: { status: 'Ready' } }
  );

  res.json({ message: 'Moved to Ready', updated });
};

// Get Ready orders grouped by distributor
export const getReadyOrders = async (req, res) => {
  const orders = await Order.find({ retailer: req.user._id, status: 'Ready' }).populate('items.product distributor');
  res.json(orders);
};

// Place order (moves to OnWay)
export const placeOrder = async (req, res) => {
  const { orderIds } = req.body;

  const updated = await Order.updateMany(
    { _id: { $in: orderIds }, retailer: req.user._id },
    { $set: { status: 'OnWay' } }
  );

  res.json({ message: 'Orders placed', updated });
};

// Get OnWay orders
export const getOnWayOrders = async (req, res) => {
  const orders = await Order.find({ retailer: req.user._id, status: 'OnWay' }).populate('items.product distributor');
  res.json(orders);
};

// Create multiple orders for different distributors
export const createMultiDistributorOrder = async (req, res) => {
  try {
    const { retailerId, groupedItems } = req.body;

    let totalPrice = 0;
    const processedGroups = [];

    for (const group of groupedItems) {
      const { distributorId, items } = group;
      let distributorTotal = 0;
      const validatedItems = [];

      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product || product.distributorId.toString() !== distributorId) {
          return res.status(400).json({ message: "Invalid product or distributor mismatch" });
        }

        const total = product.price * item.quantity;
        distributorTotal += total;

        validatedItems.push({
          productId: product._id,
          quantity: item.quantity,
          rate: product.price,
          total
        });
      }

      totalPrice += distributorTotal;
      processedGroups.push({
        distributorId,
        items: validatedItems,
        distributorTotal
      });
    }

    const newOrder = new Order({
      retailerId,
      groupedItems: processedGroups,
      totalPrice
    });

    await newOrder.save();
    res.status(201).json(newOrder);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating multi-distributor order" });
  }
};
