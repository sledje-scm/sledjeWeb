import Retailer from '../models/Retailer.js';
import generateToken from '../utils/generateToken.js';

export const registerRetailer = async (req, res) => {
  const { businessName, ownerName, phone, email, password, gstNumber, location,businessType,pincode } = req.body;

  const retailerExists = await Retailer.findOne({ email });
  if (retailerExists) return res.status(400).json({ message: 'Retailer already exists' });

  const retailer = await Retailer.create({ 
    businessName,
    ownerName,
    email,
    password,
    phone,
    gstNumber,
    businessType,
    pincode,
    location,});

  if (retailer) {
    res.status(201).json({
      _id: retailer._id,
      ownerName: retailer.ownerName,
      businessName: retailer.businessName,
      gstNumber: retailer.gstNumber,
      phone: retailer.phone,
      email: retailer.email,
      password: retailer.password,
      businessType: retailer.businessType,
      pincode: retailer.pincode,
      location: retailer.location,
      token: generateToken(retailer._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid retailer data' });
  }
};

export const loginRetailer = async (req, res) => {
  const { email, password } = req.body;

  const retailer = await Retailer.findOne({ email });
  if (retailer && (await retailer.matchPassword(password))) {
    res.json({
      _id: retailer._id,
      ownerName: retailer.name,
      businessName: retailer.shopName,
      phone: retailer.phone,
      email: retailer.email,
      token: generateToken(retailer._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

export const getRetailerProfile = async (req, res) => {
  const retailer = await Retailer.findById(req.user._id);
  if (retailer) {
    res.json({
      _id: retailer._id,
      name: retailer.name,
      shopName: retailer.shopName,
      phone: retailer.phone,
      email: retailer.email,
    });
  } else {
    res.status(404).json({ message: 'Retailer not found' });
  }
};
