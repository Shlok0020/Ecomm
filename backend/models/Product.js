// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['glass', 'plywood', 'hardware', 'interior']
  },
  subcategory: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  mrp: {
    type: Number,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  specifications: {
    type: Map,
    of: String,
    default: {}
  },
  images: [{
    type: String
  }],
  image: {
    type: String  // Main image (first image)
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  features: [String],
  brand: {
    type: String
  },
  thickness: [String],
  size: String,
  grade: {
    type: String,
    enum: ['premium', 'commercial', 'marine', 'bwp', 'mr', 'fire', 'standard']
  },
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  isAdminAdded: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Before saving, ensure image field is set from images array
productSchema.pre('save', function(next) {
  if (this.images && this.images.length > 0 && !this.image) {
    this.image = this.images[0];
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);