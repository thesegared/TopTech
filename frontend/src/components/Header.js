import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import './Header.css';
import api from '../api'; // Importa tu instancia de Axios

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
  const isAuthenticated = !!token;
  const [cartItemCount, setCartItemCount] = useState(0);
  const userId = 'userId123'; // Este debe ser el ID del usuario autenticado

  let userRole = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken.role; // Asumimos que el token tiene un campo "role"
    } catch (error) {
      console.error("Error al decodificar el token", error);
    }
  }

  // Obtener los datos del carrito
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(`/api/cart/${userId}`);
        const cart = await response.json();
        setCartItemCount(cart.items.length); // Actualiza el número de productos en el carrito
      } catch (error) {
        console.error('Error al obtener el carrito:', error);
      }
    };

    if (userId) {
      fetchCart();
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Eliminar el token
    navigate('/login'); // Redirigir al usuario al login
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">TopTech</Link>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto"> {/* Asegúrate de que esta clase esté presente */}
            {isAuthenticated ? (
              <>
                {/* Mostrar "Gestionar Productos" solo para el rol de administrador */}
                {userRole === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/manage-products">Gestionar Productos</Link>
                  </li>
                )}

                {/* Carrito de compras */}
                <li className="nav-item">
                  <Link to="/cart">
                    <button className="btn btn-outline-primary">
                      <FaShoppingCart />
                      {cartItemCount > 0 && <span className="badge badge-light">{cartItemCount}</span>}
                    </button>
                  </Link>
                </li>

                {/* Botón de cerrar sesión */}
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleLogout}>
                    <FaSignOutAlt />
                  </button>
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
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
