import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const retailerSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
  },
  businessType: {
    type: String,
    required: false,
  },
  gstNumber: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },  
}, { timestamps: true });

// password hashing before save
retailerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// match password
retailerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Retailer = mongoose.model('Retailer', retailerSchema);
export default Retailer;
