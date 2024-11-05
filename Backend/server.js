// Importar módulos necesarios
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();
app.use(express.json()); // Para parsear JSON en las solicitudes

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Bienvenido a TopTech API');
});

// Usar las rutas de usuario
app.use('/api/users', userRoutes);

// Rutas de producto
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
