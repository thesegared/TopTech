// models/User.js
const mongoose = require('mongoose');

// Esquema de Usuario
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  }
});

// Crear el modelo de Usuario
const User = mongoose.model('User', userSchema);

module.exports = User;
