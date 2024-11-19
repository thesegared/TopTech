const express = require("express");
const { registerUser, loginUser, getAllUsers, updateUserRole, deleteUser } = require("../controllers/userController");
const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post("/register", registerUser);

// Ruta para iniciar sesión
router.post("/login", loginUser);

// Ruta para obtener todos los usuarios
router.get("/all", getAllUsers);

// Ruta para actualizar el rol de un usuario
router.put("/update-role", updateUserRole);

// Ruta para eliminar un usuario
router.delete('/:id', deleteUser);

module.exports = router;
