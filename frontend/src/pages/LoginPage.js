import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdArrowBack } from 'react-icons/md';
import api from '../api';
import { Link } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const [rememberMe, setRememberMe] = useState(false); // Estado para la opción "Recordarme"
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
      setEmail(savedEmail); // Pre-cargar el correo si fue guardado
      setRememberMe(true); // Marcar la casilla "Recordarme"
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/login', { email, password });

      // Guardamos el token y el rol en localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);

      // Guardamos el correo si "Recordarme" está seleccionado
      if (rememberMe) {
        localStorage.setItem('email', email);
      } else {
        localStorage.removeItem('email');
      }

      // Guardar userId (email) en localStorage para el carrito
      localStorage.setItem('userId', email); // Usamos el email como userId

      setMessage('Inicio de sesión exitoso');
      navigate('/'); // Redirigir a la página de inicio o a otra página
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Cambiar el estado para mostrar/ocultar la contraseña
  };

  return (
    <div className="login-container">
      <div className="header">
        <button onClick={() => navigate('/')} className="back-button">
          <MdArrowBack size={24} />
        </button>
        <h2>Iniciar Sesión</h2>
      </div>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Opción de Recordarme */}
        <div className="form-group-checkbox">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <label>Recordarme</label>
        </div>
        <button type="submit" className="btn btn-primary">Ingresar</button>
        <Link to="/register">
          <button type="button" className="btn btn btn-green">Crear Cuenta</button>
        </Link>

        <p className="register-message">
          ¿Aún no tienes cuenta? <Link to="/register" className="link-highlight">Regístrate aquí</Link>
        </p>

      </form>
    </div>
  );
}

export default LoginPage;
