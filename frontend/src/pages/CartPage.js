import React, { useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import "./CartPage.css";

const CartPage = () => {
  const {
    cartItems,
    totalPrice,
    fetchCart,
    updateQuantity,
    removeFromCart,
    emptyCart,
  } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart(); // Asegurarse de cargar los datos del carrito al montar el componente
  }, [fetchCart]);

  const handleContinueShopping = () => {
    navigate("/");
  };

  const handlePayNow = () => {
    const token = localStorage.getItem("token"); // Verificar si el usuario está autenticado
    if (!token) {
      alert("Debes registrarte o iniciar sesión para proceder con el pago.");
      navigate("/login"); // Redirige al login si no está autenticado
    } else {
      navigate("/shipping-details"); // Redirige a la página de detalles de envío
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container">
        <h1>Carrito de Compras</h1>
        <p>No hay productos en el carrito.</p>
        <button className="btn btn-secondary" onClick={handleContinueShopping}>
          CONTINUAR COMPRANDO
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="cart-container">
        <h1>Carrito de Compras</h1>
        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-header">
              <div>Producto</div>
              <div>Precio</div>
              <div>Cantidad</div>
              <div>Total Parcial</div>
            </div>
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-details">
                  <img
                    src={item.productId.image}
                    alt={item.productId.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-info">
                    <p>{item.productId.name}</p>
                    <div
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item._id)}
                    >
                      <FaTrash /> Eliminar
                    </div>
                  </div>
                </div>
                <div className="cart-item-price">
                  <p>
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                    }).format(item.productId.price)}
                  </p>
                </div>
                <div className="cart-item-quantity">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="cart-item-total">
                  <p>
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                    }).format(item.productId.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
            <button className="limpiar-carrito" onClick={emptyCart}>
              <FaTrash /> Limpiar Carrito
            </button>
          </div>

          <div className="cart-summary">
            <h3>
              Total:{" "}
              {new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
              }).format(totalPrice)}
            </h3>
            <hr className="my-4" />
            <button className="btn btn-primary" onClick={handlePayNow}>
              PAGAR AHORA
            </button>
            <button className="btn btn-secondary" onClick={handleContinueShopping}>
              CONTINUAR COMPRANDO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
