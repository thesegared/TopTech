const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Ruta para agregar un producto al carrito (usa la lógica del controlador)
router.post('/add', cartController.addToCart);  

// Ruta para obtener el carrito de compras de un usuario
router.get('/:userId', cartController.getCart);

// Obtener el carrito de compras
router.get('/:userId', async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
      if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
      res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener el carrito', error });
    }
  });
  


// Actualizar cantidad del producto en el carrito
router.put('/update/:cartItemId', async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await CartItem.findById(req.params.cartItemId);

    if (!cartItem) return res.status(404).json({ message: 'Producto no encontrado en el carrito' });

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ message: 'Cantidad actualizada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar cantidad', error });
  }
});

// Eliminar un producto del carrito
router.delete('/remove/:cartItemId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    cart.items = cart.items.filter(item => item._id.toString() !== req.params.cartItemId);
    await cart.save();

    res.status(200).json({ message: 'Producto eliminado del carrito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar producto', error });
  }
});

// Vaciar el carrito
router.delete('/empty/:userId', async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId });
      if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
  
      cart.items = []; // Vaciar el carrito
      await cart.save();
  
      res.status(200).json({ message: 'Carrito vacío' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al vaciar el carrito', error });
    }
  });
  

module.exports = router;