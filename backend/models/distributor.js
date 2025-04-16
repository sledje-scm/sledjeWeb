// models/Distributor.js
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
    // products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],use differenet prodcut inventory for distributor
  }, { timestamps: true });
  
  module.exports = mongoose.model("Distributor", distributorSchema);
  