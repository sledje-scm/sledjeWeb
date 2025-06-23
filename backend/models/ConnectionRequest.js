import mongoose from 'mongoose';

const connectionRequestSchema = new mongoose.Schema({
  retailer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Retailer',
    required: true
  },
  distributor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Distributor',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  requestedBy: {
    type: String,
    enum: ['retailer', 'distributor'],
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  rejectionReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate requests
connectionRequestSchema.index({ retailer: 1, distributor: 1 }, { unique: true });

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

export default ConnectionRequest;