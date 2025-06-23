import Retailer from '../models/Retailer.js';
import generateToken from '../utils/generateToken.js';

/**
 * Register a new retailer
 */
export const registerRetailer = async (req, res) => {
  console.log('📩 Register Retailer Endpoint Hit');
  console.log('Request Body:', req.body);

  const {
    businessName, ownerName, phone, email, password,
    gstNumber, location, businessType, pincode
  } = req.body;

  try {
    const retailerExists = await Retailer.findOne({ email });
    if (retailerExists) {
      return res.status(400).json({ message: 'Retailer already exists' });
    }

    const retailer = await Retailer.create({
      businessName,
      ownerName,
      email,
      password,
      phone,
      gstNumber,
      businessType,
      pincode,
      location,
    });

    if (retailer) {
      res.status(201).json({
        _id: retailer._id,
        ownerName: retailer.ownerName,
        businessName: retailer.businessName,
        gstNumber: retailer.gstNumber,
        phone: retailer.phone,
        email: retailer.email,
        businessType: retailer.businessType,
        pincode: retailer.pincode,
        location: retailer.location,
        role: retailer.role, // assuming role exists (e.g., "retailer")
        token: generateToken(retailer._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid retailer data' });
    }
  } catch (error) {
    console.error('❌ Error in registration:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Retailer Login
 */
export const loginRetailer = async (req, res) => {
  const { email, password } = req.body;

  try {
    const retailer = await Retailer.findOne({ email });

    if (retailer && (await retailer.matchPassword(password))) {
      res.json({
        _id: retailer._id,
        ownerName: retailer.ownerName,
        businessName: retailer.businessName,
        phone: retailer.phone,
        email: retailer.email,
        role: retailer.role,
        pincode: retailer.pincode,
        location: retailer.location,
        gstNumber: retailer.gstNumber,
        businessType: retailer.businessType,
        token: generateToken(retailer._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Get logged-in retailer's profile
 * Requires: authenticate middleware
 */
export const getRetailerProfile = async (req, res) => {
  try {
    const retailer = await Retailer.findById(req.user._id);

    if (retailer) {
      res.json({
        _id: retailer._id,
        ownerName: retailer.ownerName,
        businessName: retailer.businessName,
        phone: retailer.phone,
        email: retailer.email,
        role: retailer.role,
        gstNumber: retailer.gstNumber,
        businessType: retailer.businessType,
        pincode: retailer.pincode,
        location: retailer.location,
      });
    } else {
      res.status(404).json({ message: 'Retailer not found' });
    }
  } catch (error) {
    console.error('❌ Get Profile error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
