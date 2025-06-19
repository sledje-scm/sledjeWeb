import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const retailerSchema = new mongoose.Schema(
  {
    businessName: {
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
    gstNumber: {
      type: String,
    },
    location: {
      type: String,
    },
    businessType: {
      type: String,
    },
    pincode: {
      type: String,
    },
    distributors: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Distributor' 
      }
    ],
    role: {
      type: String,
      enum: ['retailer'],
      default: 'retailer',
      }
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
retailerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to match entered password with hashed password
retailerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Retailer = mongoose.model('Retailer', retailerSchema);

export default Retailer;
