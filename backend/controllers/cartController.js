import Cart from "../models/Cart.js";

// Save or update cart
export const saveCart = async (req, res) => {
  const { cartItems } = req.body;
  if (!Array.isArray(cartItems)) return res.status(400).json({ message: "Invalid cart" });
  await Cart.findOneAndUpdate(
    { retailerId: req.user._id },
    { items: cartItems, updatedAt: Date.now() },
    { upsert: true, new: true }
  );
  res.json({ message: "Cart saved" });
};

// Fetch cart
export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ retailerId: req.user._id });
  res.json(cart?.items || []);
};

// Clear cart
export const clearCart = async (req, res) => {
  await Cart.findOneAndUpdate({ retailerId: req.user._id }, { items: [] });
  res.json({ message: "Cart cleared" });
};