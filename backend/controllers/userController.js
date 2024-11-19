const User = require('../models/User');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');

// Registro de usuario
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validar campos
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Verificar longitud mínima del nombre
    if (name.length < 2) {
      return res.status(400).json({ message: 'El nombre debe tener al menos 2 caracteres' });
    }

    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'El formato del correo no es válido' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Este correo electrónico ya está asociado a una cuenta existente.' });
    }

    // Validar longitud y seguridad de la contraseña
    if (password.length < 8) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres' });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ message: 'La contraseña debe contener al menos una mayúscula' });
    }

    // Verificar confirmación de contraseña
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

// Controlador para el inicio de sesión
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Generar un token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Inicio de sesión exitoso', token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email role"); // Selecciona solo los campos necesarios
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios", error });
  }
};

// Actualizar el rol de un usuario
exports.updateUserRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;

    // Validar entrada
    if (!userId || !newRole) {
      return res.status(400).json({ message: 'Faltan datos para actualizar el rol' });
    }

    // Verificar si el nuevo rol es válido
    if (!['user', 'admin'].includes(newRole)) {
      return res.status(400).json({ message: 'El rol especificado no es válido' });
    }

    // Buscar y actualizar el usuario
    const user = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true } // Retorna el usuario actualizado
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Rol actualizado exitosamente', user });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el rol', error });
  }
};

// Controlador para eliminar un usuario
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar y eliminar el usuario
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario', error });
  }
};
