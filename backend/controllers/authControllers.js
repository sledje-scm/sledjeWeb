import Retailer from "../models/Retailer.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const registerRetailer = async (req, res) => {
  const { name, email, password, shopName } = req.body;
  const exists = await Retailer.findOne({ email });
  if (exists) return res.status(400).json({ message: "Retailer already exists" });

  const retailer = await Retailer.create({ name, email, password, shopName });
  res.status(201).json({
    _id: retailer._id,
    name: retailer.name,
    email: retailer.email,
    shopName: retailer.shopName,
    phone: retailer.phone,
    token: generateToken(retailer._id),
  });
};

export const loginRetailer = async (req, res) => {
  const { email, password } = req.body;
  const retailer = await Retailer.findOne({ email });

  if (retailer && (await retailer.matchPassword(password))) {
    res.json({
      _id: retailer._id,
      name: retailer.name,
      email: retailer.email,
      token: generateToken(retailer._id),
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};
