import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import api from '../api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Inicializar useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/login', {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem('token', token); // Guardamos el token en localStorage
      setMessage('Inicio de sesión exitoso');
      
      // Redirigir a la página de inicio o a otra página
      navigate('/'); // Cambia '/' a la ruta donde quieras redirigir al usuario
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="container">
      <h2>Iniciar Sesión</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Ingresar</button>
      </form>
    </div>
  );
}

export default LoginPage;
