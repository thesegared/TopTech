const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true } // Esto agrega automáticamente createdAt y updatedAt
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;