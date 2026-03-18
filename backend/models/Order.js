// backend/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow guest orders
  },
  customerInfo: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      street: String,
      city: String,
      state: {
        type: String,
        default: 'Odisha'
      },
      pincode: String,
      landmark: String
    }
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: String,
    price: Number,
    quantity: {
      type: Number,
      default: 1
    },
    image: String
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'online', 'card'],
    default: 'cash'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  notifications: {
    whatsappSent: {
      type: Boolean,
      default: false
    },
    emailSent: {
      type: Boolean,
      default: false
    }
  },
  trackingNumber: String,
  estimatedDelivery: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update timestamps on save
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set deliveredAt if status becomes delivered
  if (this.status === 'delivered' && !this.deliveredAt) {
    this.deliveredAt = Date.now();
  }
  
  // Set cancelledAt if status becomes cancelled
  if (this.status === 'cancelled' && !this.cancelledAt) {
    this.cancelledAt = Date.now();
  }
  
  next();
});

module.exports = mongoose.model('Order', orderSchema);