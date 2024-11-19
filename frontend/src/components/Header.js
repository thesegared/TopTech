import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineShoppingCart } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoAppsSharp } from "react-icons/io5";
import { FaRegUser, FaSignOutAlt } from "react-icons/fa";
import "./Header.css";
import logo from "../assets/logo.png";
import { useCart } from "../contexts/CartContext";

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;
  const role = localStorage.getItem("role"); // Obtener el rol del usuario
  const isAdmin = role === "admin"; // Verificar si el usuario es admin

  const { cartItemCount, totalPrice } = useCart(); // Obtener datos centralizados del contexto

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role"); // Opcional: Eliminar el rol del localStorage
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <div className="navbar-brand">
          <Link to="/">
            <img src={logo} alt="TopTech Logo" className="logo" />
          </Link>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <RxHamburgerMenu className="hamburger-icon" />
        </button>

        <div className="nav-icons-container">
          <Link to="/cart" title="Carrito de Compras" className="cart-link">
            <div className="cart-details">
              <span className="cart-total">
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                }).format(totalPrice || 0)} {/* Mostrar el total del carrito */}
              </span>
              <MdOutlineShoppingCart className="nav-icon" />
              <span className="cart-count">{cartItemCount}</span> {/* Mostrar la cantidad de ítems */}
            </div>
          </Link>

          {isAuthenticated && isAdmin && ( // Mostrar solo para admin
            <Link to="/admin/manage-products" title="Panel de adminsitración">
              <IoAppsSharp className="nav-icon" />
            </Link>
          )}

          {!isAuthenticated ? (
            <Link to="/login" title="Iniciar Sesión / Registrarse">
              <FaRegUser className="nav-icon" />
            </Link>
          ) : (
            <button className="nav-icon btn" onClick={handleLogout} title="Cerrar Sesión">
              <FaSignOutAlt />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;