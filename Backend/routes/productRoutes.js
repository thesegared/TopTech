// routes/productRoutes.js
const express = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
//const authMiddleware = require('../middleware/authMiddleware'); // Asegurarse de que solo usuarios autenticados accedan

const router = express.Router();

// Ruta para crear un producto (requiere autenticación de administrador)
//router.post('/', authMiddleware, createProduct);
router.post('/', createProduct);

// Ruta para obtener todos los productos
router.get('/', getProducts);

// Ruta para obtener un producto por ID
router.get('/:id', getProductById);

// Ruta para actualizar un producto (requiere autenticación de administrador)
//router.put('/:id', authMiddleware, updateProduct);
router.put('/:id', updateProduct);

// Ruta para eliminar un producto (requiere autenticación de administrador)
//router.delete('/:id', authMiddleware, deleteProduct);
router.delete('/:id', deleteProduct);
module.exports = router;
