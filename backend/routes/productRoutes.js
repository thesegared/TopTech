const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { upload } = require('../controllers/productController'); // Asegúrate de que el controlador exporte 'upload'

// Ruta para obtener todos los productos
router.get('/', productController.getProducts);

// Ruta para obtener un producto por su ID
router.get('/:id', productController.getProductById);

// Ruta para crear un producto (requiere una imagen)
router.post('/', upload.single('image'), productController.createProduct);

// Ruta para actualizar un producto (requiere una imagen)
router.put('/:id', upload.single('image'), productController.updateProduct);

// Ruta para eliminar un producto
router.delete('/:id', productController.deleteProduct);

module.exports = router;
