const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');  // Asegúrate de que esta ruta esté bien configurada
const cloudinary = require('cloudinary').v2;  // Configuración de Cloudinary
const path = require('path');
const multer = require('multer');

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// Configurar Multer para el manejo de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // Ruta donde se almacenarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Crear el upload con la configuración anterior
const upload = multer({ storage });

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Middleware para habilitar CORS
app.use(cors());

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1); // Termina el proceso si no se puede conectar a la base de datos
  });

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Bienvenido a TopTech API');
});

// Usar las rutas de usuario y producto
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);  // Asegúrate de que esta ruta esté configurada correctamente en productRoutes

// Configurar el puerto y escuchar
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
