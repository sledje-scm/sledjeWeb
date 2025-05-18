import mongoose from 'mongoose';
const distributorSchema = new mongoose.Schema({
    companyName: String,
    ownerName: String,
    gstNumber: String,
    businessType: String,
    pincode: String,
    email: String,
    address: String,
    location: String,   
    phone: String,
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
  }, { timestamps: true });
  const Distributor = mongoose.model('Distributor', DistributorSchema);
  export default Distributor;