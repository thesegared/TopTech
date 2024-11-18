import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CartPage.css';
import { FaTrash } from 'react-icons/fa';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [total, setTotal] = useState(0);
  const userId = localStorage.getItem('userId');  // Obtener el userId desde localStorage

  useEffect(() => {
    const fetchCart = async () => {
      if (userId) {  // Solo intentamos obtener el carrito si el userId está disponible
        try {
          const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
          setCart(response.data);

          // Calcular el total del carrito
          calculateTotal(response.data.items);
        } catch (error) {
          console.error('Error al obtener el carrito:', error);
        }
      } else {
        console.log('No se encontró un usuario autenticado');
      }
    };

    fetchCart();
  }, [userId]);

  const calculateTotal = (items) => {
    const totalAmount = items.reduce((acc, item) => {
      return acc + item.productId.price * item.quantity;
    }, 0);
    setTotal(totalAmount);
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/cart/update/${cartItemId}`, { quantity: newQuantity });

      const updatedCart = cart.items.map(item =>
        item._id === cartItemId ? { ...item, quantity: newQuantity } : item
      );
      setCart({ ...cart, items: updatedCart });
      calculateTotal(updatedCart);
    } catch (error) {
      console.error('Error al actualizar la cantidad:', error);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/remove/${cartItemId}`);
      setCart(prevState => ({
        ...prevState,
        items: prevState.items.filter(item => item._id !== cartItemId),
      }));
      calculateTotal(cart.items);
    } catch (error) {
      console.error('Error al eliminar el producto del carrito:', error);
    }
  };

  const emptyCart = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/empty/${userId}`);
      setCart({ items: [] });
      setTotal(0);
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
    }
  };

  if (!userId) {
    return <p>Debes estar logueado para ver el carrito.</p>;
  }

  return (
    <div className="cart-container">
      <h1>Carrito de Compras</h1>

      <div className="cart-content">
        {/* Lista de productos */}
        <div className="cart-items">
          <div className="cart-header">
            <div>Producto</div>
            <div>Precio</div>
            <div>Cantidad</div>
            <div>Total Parcial</div>
          </div>

          {cart ? (
            <div>
              {cart.items.length > 0 ? (
                cart.items.map(item => (
                  <div key={item._id} className="cart-item">
                    <div className="cart-item-details">
                      {/* Imagen del producto */}
                      <img src={item.productId.image} alt={item.productId.name} className="cart-item-image" />
                      
                      {/* Información del producto: Nombre y Eliminar */}
                      <div className="cart-item-info">
                        <p>{item.productId.name}</p>
                        <div className="cart-item-remove" onClick={() => removeFromCart(item._id)}>
                          <FaTrash /> Eliminar
                        </div>
                      </div>
                    </div>

                    {/* Precio, Cantidad y Total Parcial */}
                    <div className="cart-item-price">
                      <p>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.productId.price)}</p>
                    </div>
                    <div className="cart-item-quantity">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                    </div>
                    <div className="cart-item-total">
                      <p>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.productId.price * item.quantity)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No hay productos en el carrito.</p>
              )}
            </div>
          ) : (
            <p>No hay productos en el carrito.</p>
          )}
        </div>

        {/* Totales del carrito a la derecha */}
        <div className="cart-summary">
          <h3>Total: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(total)}</h3>
          <button onClick={emptyCart} className="btn btn-danger">Vaciar carrito</button>
          <button className="btn btn-primary">Pagar ahora</button>
          <button className="btn btn-secondary">Continuar comprando</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
