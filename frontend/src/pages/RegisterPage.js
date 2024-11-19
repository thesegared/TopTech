import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import api from '../api';
import './RegisterPage.css';
import { MdArrowBack } from 'react-icons/md';

function RegisterPage() {
  const navigate = useNavigate(); // Inicializamos useNavigate
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Para manejar la carga durante el registro

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones en el frontend
    if (name.length < 2) {
      setMessage('El nombre debe tener al menos 2 caracteres');
      return;
    }

    // Validación para evitar números en el nombre
    const nameRegex = /^[A-Za-z\s]+$/; // Solo permite letras y espacios
    if (!nameRegex.test(name)) {
      setMessage('El nombre no puede contener números ni caracteres especiales');
      return;
    }

    if (password.length < 8) {
      setMessage('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setMessage('La contraseña debe contener al menos una mayúscula');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true); // Inicia la carga

    try {
      const response = await api.post('/users/register', {
        name,
        email,
        password,
        confirmPassword, // enviar confirmación de contraseña al backend
      });
      setMessage('Usuario registrado exitosamente');

      // Guardamos el token y userId en localStorage y logueamos al usuario automáticamente
      localStorage.setItem('token', response.data.token); // Guardar el token de sesión
      localStorage.setItem('userId', email); // Usar el email como userId

      navigate('/'); // Redirigir al usuario a la página principal o al dashboard

    } catch (error) {
      setMessage(error.response?.data?.message || 'Error al registrarse');
    } finally {
      setIsLoading(false); // Termina la carga
    }
  };

  return (
    <div className="register-container">
      <div className="header">
        <button onClick={() => navigate('/login')} className="back-button">
          <MdArrowBack size={24} />
        </button>
        <h2>Crear Cuenta</h2>
      </div>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Nombre */}
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Contraseña */}
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Confirmar Contraseña */}
        <div className="form-group">
          <label htmlFor="confirm-password">Confirmar Contraseña</label>
          <input
            id="confirm-password"
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Botón de registro */}
        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>

  );
}

export default RegisterPage;