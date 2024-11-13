const jwt = require('jsonwebtoken');
const multer = require('multer');

// Configuración de multer para cargar imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directorio donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware para verificar la autenticación
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No hay token proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Almacenar la información del usuario decodificada en la solicitud
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token no válido' });
  }
};

// Middleware para verificar si el usuario es administrador
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden realizar esta acción' });
  }
};

module.exports = { authMiddleware, adminMiddleware, upload };
