import mongoose from "mongoose";
const CartItemSchema = new mongoose.Schema({
  productId: String,
  variantId: String,
  quantity: Number,
  unit: String,
});
const CartSchema = new mongoose.Schema({
  retailerId: { type: mongoose.Schema.Types.ObjectId, ref: "Retailer", unique: true },
  items: [CartItemSchema],
  updatedAt: { type: Date, default: Date.now }
});
export default mongoose.model("Cart", CartSchema);