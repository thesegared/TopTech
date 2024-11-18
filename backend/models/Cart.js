const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: String, // o ObjectId si usas una referencia al modelo de usuarios
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',  // Referencia al modelo 'Product'
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;