const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },

  description: String,

  category: {
    type: String,
    required: true
  },

  brand: String,

  price: {
    type: Number,
    required: true
  },

  mrp: Number,

  stock: {
    type: Number,
    default: 0
  },

  size: String,

  thickness: String,

  features: [String],

  images: [String],

  isActive: {
    type: Boolean,
    default: true
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);