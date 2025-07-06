import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'recipientType'
  },
  recipientType: {
    type: String,
    enum: ['Retailer', 'Distributor'],
    required: true
  },
  type: {
    type: String,
    enum: [
      'new_order',
      'order_accepted', 
      'order_rejected',
      'order_modified',
      'modification_approved',
      'modification_rejected',
      'order_completed',
      'order_cancelled'
    ],
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed, // Minimal additional data
    default: {}
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
NotificationSchema.index({ recipientId: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ orderId: 1 });

export default mongoose.model('Notification', NotificationSchema);