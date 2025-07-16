import Distributor from '../models/Distributor.js';
import generateToken from '../utils/generateToken.js';

/**
 * Register a new distributor
 */
export const registerDistributor = async (req, res) => {
  console.log('📩 Register Distributor Endpoint Hit');
  console.log('Request Body:', req.body);

  const {
    companyName, ownerName, phone, email, password,
    gstNumber, location, businessType, pincode, address
  } = req.body;

  try {
    const distributorExists = await Distributor.findOne({ email });
    if (distributorExists) {
      return res.status(400).json({ message: 'Distributor already exists' });
    }

    const distributor = await Distributor.create({
      companyName,
      ownerName,
      email,
      password,
      phone,
      gstNumber,
      businessType,
      pincode,
      location,
      address,
    });

    if (distributor) {
      res.status(201).json({
        _id: distributor._id,
        ownerName: distributor.ownerName,
        companyName: distributor.companyName,
        gstNumber: distributor.gstNumber,
        phone: distributor.phone,
        email: distributor.email,
        businessType: distributor.businessType,
        pincode: distributor.pincode,
        location: distributor.location,
        address: distributor.address,
        role: distributor.role, // assuming role exists (e.g., "distributor")
        token: generateToken(distributor._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid distributor data' });
    }
  } catch (error) {
    console.error('❌ Error in registration:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Distributor Login
 */
export const loginDistributor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const distributor = await Distributor.findOne({ email });

    if (distributor && (await distributor.matchPassword(password))) {
      res.json({
        _id: distributor._id,
        ownerName: distributor.ownerName,
        companyName: distributor.companyName,
        phone: distributor.phone,
        role:"distributor",
        gstNumber: distributor.gstNumber,
        email: distributor.email,
        token: generateToken(distributor._id),
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
 * Get logged-in distributor's profile
 * Requires: authenticate middleware
 */
export const getDistributorProfile = async (req, res) => {
  try {
    const distributor = await Distributor.findById(req.user._id).populate('products').populate('retailers');

    if (distributor) {
      res.json({
        _id: distributor._id,
        ownerName: distributor.ownerName,
        companyName: distributor.companyName,
        phone: distributor.phone,
        email: distributor.email,
        role: distributor.role,
        gstNumber: distributor.gstNumber,
        businessType: distributor.businessType,
        pincode: distributor.pincode,
        location: distributor.location,
        address: distributor.address,
        products: distributor.products,
        retailers: distributor.retailers,
      });
    } else {
      res.status(404).json({ message: 'Distributor not found' });
    }
  } catch (error) {
    console.error('❌ Get Profile error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
export const getDistributorByIds = async (req, res) => {
  const { ids } = req.body;

  try {
    const distributors = await Distributor.find({ _id: { $in: ids } })
      .select('_id companyName ownerName phone email gstNumber businessType pincode location address');

    res.json({ distributors });
  } catch (error) {
    console.error('❌ Error fetching distributors by IDs:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}