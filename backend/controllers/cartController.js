const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Función para agregar un producto al carrito
const addToCart = async (req, res) => {
    const { userId, productId } = req.body;
    console.log('Datos recibidos en el backend:', req.body);  // Log para verificar datos recibidos

    try {
        // Buscar el producto en la base de datos
        const product = await Product.findById(productId);
        if (!product) {
            console.log('Producto no encontrado con id:', productId);
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Verificar si el usuario ya tiene un carrito
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            console.log('Carrito no encontrado, creando uno nuevo');
            cart = new Cart({ userId, items: [] });
        }

        // Verificar si el producto ya está en el carrito
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            console.log('Producto ya está en el carrito, aumentando cantidad');
            cart.items[itemIndex].quantity += 1;
        } else {
            console.log('Producto no está en el carrito, agregando');
            cart.items.push({ productId, quantity: 1 });
        }

        // Guardamos o actualizamos el carrito
        await cart.save();
        console.log('Carrito actualizado:', cart);
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        res.status(500).json({ message: 'Error al agregar al carrito', error });
    }
};

// Función para obtener el carrito de un usuario
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el carrito', error });
    }
};

module.exports = { addToCart, getCart };