import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
  const isAuthenticated = !!token;

  // Decodificar el token para obtener el rol del usuario
  let userRole = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken.role; // Asumimos que el token tiene un campo "role"
    } catch (error) {
      console.error("Error al decodificar el token", error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token'); // Eliminar el token
    navigate('/login'); // Redirigir al usuario al login
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">TopTech</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            {isAuthenticated ? (
              <>
                {/* Mostrar el enlace "Agregar Producto" solo si el usuario es administrador */}
                {userRole === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/add-product">Agregar Producto</Link>
                  </li>
                )}
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleLogout}>Cerrar Sesión</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Iniciar Sesión</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Registrarse</Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/products">Productos</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
