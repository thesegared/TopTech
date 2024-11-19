const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Product = require('../models/Product');
const path = require('path');

// Configuración del almacenamiento de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/')); // Ruta donde se almacenarán las imágenes
  },
  filename: (req, file, cb) => {
    const productName = req.body.name ? req.body.name.replace(/\s+/g, '_').toLowerCase() : 'producto';
    const fileExtension = path.extname(file.originalname);
    const uniqueName = `${productName}-${Date.now()}${fileExtension}`;
    cb(null, uniqueName);
  }
});

// Crear el upload con la configuración anterior
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (.jpeg, .jpg, .png, .webp)'));
  },
});

// Crear un nuevo producto
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    // Validación de campos obligatorios
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Subir la imagen a Cloudinary
    if (req.file) {
      // Subir la imagen de Multer a Cloudinary
      cloudinary.uploader.upload(req.file.path, { folder: 'toptech' })
        .then(async (result) => {
          const image = result.secure_url; // Obtener la URL segura de Cloudinary

          // Crear el nuevo producto con la imagen de Cloudinary
          const product = new Product({ name, description, price, category, image });
          await product.save();
          res.status(201).json(product);
        })
        .catch((err) => {
          console.error('Error al subir la imagen a Cloudinary:', err);
          res.status(500).json({ message: 'Error al subir la imagen a Cloudinary', error: err });
        });
    } else {
      // Si no se proporciona una imagen, se crea el producto sin imagen
      const product = new Product({ name, description, price, category, image: null });
      await product.save();
      res.status(201).json(product);
    }
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ message: 'Error al crear el producto', error });
  }
};

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const { search, category, sort, includeInactive } = req.query;

    // Filtrar productos según el estado activo/inactivo
    const filter = includeInactive === "true" ? {} : { active: true };

    if (category) {
      filter.category = category; // Filtrar por categoría
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" }; // Filtrar por nombre
    }

    let sortOption = {};
    if (sort === "newest") {
      sortOption = { createdAt: -1 };
    } else if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    } else if (sort === "priceAsc") {
      sortOption = { price: 1 };
    } else if (sort === "priceDesc") {
      sortOption = { price: -1 };
    }

    const products = await Product.find(filter).sort(sortOption);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ message: "Error al obtener los productos", error });
  }
};

const getRecentProducts = async (req, res) => {
  try {
    const recentProducts = await Product.find({})
      .sort({ createdAt: -1 }) // Ordenar por fecha de creación (más recientes primero)
      .limit(5); // Limitar a los 5 productos más recientes
    res.status(200).json(recentProducts);
  } catch (error) {
    console.error('Error al obtener productos recientes:', error);
    res.status(500).json({ message: 'Error al obtener productos recientes', error });
  }
};

// Obtener un producto por ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({ message: 'Error al obtener el producto', error });
  }
};

// Actualizar un producto
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    // Validación de campos obligatorios
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const updateFields = { name, description, price, category };

    // Subir una nueva imagen si se proporciona
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: 'toptech' });
      updateFields.image = uploadResult.secure_url; // Guardar la URL de la imagen en la base de datos
    }

    // Actualizar el producto en la base de datos
    const product = await Product.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ message: 'Error al actualizar el producto', error });
  }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({ message: 'Error al eliminar el producto', error });
  }
};

// Actualizar cantidad de producto
const updateProductQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Actualizar cantidad
    product.quantity = Math.max(quantity, 0); // Asegura que no sea menor a 0
    if (product.quantity === 0) {
      product.active = false; // Desactiva el producto si la cantidad es 0
    }
    await product.save();
    res.json(product);
  } catch (error) {
    console.error("Error al actualizar la cantidad del producto:", error);
    res.status(500).json({ message: "Error al actualizar la cantidad" });
  }
};

// Alternar estado activo
const toggleProductActive = async (req, res) => {
  try {
    const { active } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { active },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error al alternar el estado del producto:", error);
    res.status(500).json({ message: "Error al alternar el estado" });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getRecentProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductQuantity,
  toggleProductActive,
  upload
};