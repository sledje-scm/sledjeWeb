import mongoose from 'mongoose';

// Hierarchical Object Category Schema
const CategorySchema = new mongoose.Schema({
  main: {
    type: String,
    required: true,
    enum: ['Groceries', 'Beverages', 'Personal Care']
  },
  sub: {
    type: String,
    required: true
  },
  level3: {
    type: String,
    required: false  // For deeper nesting if needed
  }
});