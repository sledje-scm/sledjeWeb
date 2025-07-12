import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const distributorSchema = new mongoose.Schema({
    companyName: String,
    ownerName: String,
    gstNumber: String,
    businessType: String,
    pincode: String,
    email: String,
    password: {
      type: String,
      required: true,
    },
    distributorships: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Distributorship'
    }],
    address: String,
    location: String,   
    phone: String,
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    retailers: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Retailer' 
      }
    ]
  }, { timestamps: true });

  // Encrypt password before saving
  distributorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      return next();
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  
  // Method to match entered password with hashed password
  distributorSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  const Distributor = mongoose.model('Distributor', distributorSchema);
  export default Distributor;