const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Función para agregar un producto al carrito
const addToCart = async (req, res) => {
    const { userId, productId } = req.body;
    console.log('Datos recibidos en el backend:', req.body);

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

const getCart = async (req, res) => {
    try {
        // Buscamos el carrito por el email del usuario (userId)
        const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el carrito', error });
    }
};

const removeFromCart = async (req, res) => {
    const { cartItemId } = req.params; // Obtener el ID del ítem desde los parámetros
    const { userId } = req.body; // Obtener el userId desde el cuerpo de la solicitud (opcional si está relacionado con autenticación)

    try {
        // Buscar el carrito del usuario
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

        // Filtrar para eliminar el producto específico del carrito
        const updatedItems = cart.items.filter(item => item._id.toString() !== cartItemId);
        if (updatedItems.length === cart.items.length) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }

        cart.items = updatedItems;
        await cart.save(); // Guardar los cambios
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ message: 'Error al eliminar producto del carrito', error });
    }
};

module.exports = { getCart, addToCart };