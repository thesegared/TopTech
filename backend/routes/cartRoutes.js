const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Ruta para agregar un producto al carrito (usa la lógica del controlador)
router.post('/add', cartController.addToCart);  

// Ruta para obtener el carrito de compras de un usuario
//router.get('/:userId', cartController.getCart);

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
    const { quantity } = req.body; // Nueva cantidad
    const { userId } = req.body; // ID del usuario

    // Buscar el carrito del usuario
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    // Buscar el producto dentro del carrito
    const cartItem = cart.items.find(item => item._id.toString() === req.params.cartItemId);
    if (!cartItem) return res.status(404).json({ message: 'Producto no encontrado en el carrito' });

    // Actualizar la cantidad del producto
    cartItem.quantity = quantity;

    // Guardar los cambios en el carrito
    await cart.save();

    res.status(200).json(cart); // Devolver el carrito actualizado
  } catch (error) {
    console.error('Error al actualizar cantidad:', error);
    res.status(500).json({ message: 'Error al actualizar cantidad', error });
  }
});


// Eliminar un producto del carrito
/* router.delete('/remove/:cartItemId', async (req, res) => {
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
}); */

router.delete('/remove/:cartItemId', async (req, res) => {
  try {
    const { userId } = req.body; // Obtener el userId desde el cuerpo de la solicitud

    // Buscar el carrito del usuario
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    // Eliminar el producto del carrito
    const updatedItems = cart.items.filter(item => item._id.toString() !== req.params.cartItemId);
    if (updatedItems.length === cart.items.length) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    cart.items = updatedItems;
    await cart.save();

    res.status(200).json(cart); // Devolver el carrito actualizado
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
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