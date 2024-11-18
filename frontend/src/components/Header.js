import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSignOutAlt, FaRegUser, FaSearch } from 'react-icons/fa';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { RxHamburgerMenu } from "react-icons/rx";
import { jwtDecode } from 'jwt-decode';
import './Header.css';
import api from '../api';

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
  const isAuthenticated = !!token;
  const [cartItemCount, setCartItemCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');  // Estado para el término de búsqueda
  const [categoryFilter, setCategoryFilter] = useState('');  // Estado para el filtro de categoría


  // Estado para los productos obtenidos de la API
  const [products, setProducts] = useState([]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);  // Cambia el término de búsqueda
  const handleCategoryChange = (e) => setCategoryFilter(e.target.value);  // Cambia el filtro de categoría

  // Función para generar un userId temporal para usuarios invitados
  const generateGuestUserId = () => {
    const guestId = Math.random().toString(36).substring(2, 15); // Genera un ID aleatorio
    localStorage.setItem('userId', guestId);  // Guarda el ID en el localStorage
    return guestId;
  };

  // Si no existe, generamos un userId temporal o usamos el del localStorage
  const userId = localStorage.getItem('userId') || generateGuestUserId();

  let userRole = null;

  // Verificamos si el token está disponible antes de intentar decodificarlo
  if (isAuthenticated) {
    try {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken.role; // Asumimos que el token tiene un campo "role"
      const email = decodedToken.email; // Suponemos que el email está en el token
      if (email && email !== userId) {
        localStorage.setItem('userId', email); // Si está logueado, usamos el email como userId
      }
    } catch (error) {
      console.error("Error al decodificar el token", error);
    }
  }

  // Obtener los datos del carrito
  useEffect(() => {
    const fetchCart = async () => {
      if (userId) {
        try {
          const response = await fetch(`/api/cart/${userId}`);
          const cart = await response.json();
          setCartItemCount(cart.items.length); // Actualiza el número de productos en el carrito

          // Calcular el total del carrito
          const totalAmount = cart.items.reduce((acc, item) => {
            return acc + item.productId.price * item.quantity;
          }, 0);
          setTotalPrice(totalAmount); // Establece el precio total
        } catch (error) {
          console.error('Error al obtener el carrito:', error);
        }
      }
    };

    fetchCart();
  }, [userId]);  // Esto depende de userId, así que se vuelve a ejecutar si cambia

  // Función para obtener los productos desde la API
  const fetchProducts = async () => {
    try {
      const response = await api.get('/products', {
        params: {
          search: searchTerm,
          category: categoryFilter
        }
      });
      setProducts(response.data); // Guarda los productos en el estado
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  // Llamada a la API para obtener los productos al montar el componente o cuando cambia la búsqueda
  useEffect(() => {
    fetchProducts();
  }, [searchTerm, categoryFilter]); // Recorre cuando el término de búsqueda o la categoría cambian

  const handleLogout = () => {
    localStorage.removeItem('token'); // Eliminar el token JWT
    localStorage.removeItem('userId'); // Eliminar el userId temporal o registrado
    navigate('/login'); // Redirigir al login
  };



  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">TopTech</Link>

        {/* Buscador y filtro en el header 
        <div className="search-filter">
          <div className="category-container">
            <button className="category-btn">
              <RxHamburgerMenu className="hamburger-icon" />
              <select value={categoryFilter} onChange={handleCategoryChange}>
                {categories.map((category) => (
                  <option key={category} value={category === "CATEGORÍAS" ? "" : category}>
                    {category}
                  </option>
                ))}
              </select>
            </button>
          </div>
          
          <div className="search-input">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="search-btn">
              <FaSearch />
            </button>
          </div>
        </div>
        */}

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            {/* Carrito de compras */}
            <li className="nav-item cart-icon">
              <Link to="/cart">
                <button className="btn btn-outline-primary" title="Carrito de Compras">
                  <MdOutlineShoppingCart />
                  {cartItemCount > 0 && (
                    <div className="cart-info">
                      <span className="cart-total">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalPrice)}
                      </span>
                      <span className="badge badge-light">{cartItemCount}</span>
                    </div>
                  )}
                </button>
              </Link>
            </li>

            {/* Separador | entre el carrito y el icono de usuario */}
            <span className="separator">|</span>

            {/* Icono de usuario y enlace a iniciar sesión o registrarse */}
            <li className="nav-item">
              {!isAuthenticated ? (
                <>
                  {/* Mostrar "Gestionar Productos" solo para el rol de administrador */}
                  {userRole === 'admin' && (
                    <>
                      <span className="separator">|</span>
                      <li className="nav-item">
                        <Link className="nav-link" to="/admin/manage-products">Gestionar Productos</Link>
                      </li>
                    </>
                  )}
                  <Link to="/login" title="Iniciar Sesión / Registrarse">
                    <FaRegUser />
                  </Link>
                </>
              ) : (
                <button className="btn btn-link nav-link" onClick={handleLogout} title="Cerrar Sesión">
                  <FaSignOutAlt />
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;