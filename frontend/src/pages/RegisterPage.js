import React, { useState } from 'react';
import api from '../api';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones en el frontend
    if (name.length < 2) {
      setMessage('El nombre debe tener al menos 2 caracteres');
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

    try {
      const response = await api.post('/users/register', {
        name,
        email,
        password,
        confirmPassword, // enviar confirmación de contraseña al backend
      });
      setMessage('Usuario registrado exitosamente');
      // Opcional: redirigir al login después de registrarse
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <div className="container">
      <h2>Registrarse</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Confirmar Contraseña</label>
          <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Registrarse</button>
      </form>
    </div>
  );
}

export default RegisterPage;