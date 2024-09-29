const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String
    // required: true,
  },
  image: {
    type: String
  },
  variants: [
    {
      name: String,
      price: Number,
      stock: Number,
    },
  ],
  inventory: {
    stock: {
      type: Number
    },
    sold: {
      type: Number,
      default: 0,
    },
  },
  taxDetails: {
    taxRate: Number,
  },
  status: {
    type: String
  },
  shippingDetails: {
    weight: {
      type: Number,
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
  },
  returnPolicy: {
    type: String,
    enum: ['Returnable', 'Non-returnable', 'Replaceable'],
  },
}, { timestamps: true });

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;