import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [total, setTotal] = useState(0);
  const userId = 'userId123'; // Este debe ser el ID del usuario autenticado

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`/api/cart/${userId}`);
        setCart(response.data);

        // Calcular el total del carrito
        const totalAmount = response.data.items.reduce((acc, item) => {
          return acc + item.productId.price * item.quantity;
        }, 0);
        setTotal(totalAmount); // Actualizar el total con la suma calculada
      } catch (error) {
        console.error('Error al obtener el carrito:', error);
      }
    };

    fetchCart();
  }, []);

  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete(`/api/cart/remove/${cartItemId}`);
      setCart(prevState => ({
        ...prevState,
        items: prevState.items.filter(item => item._id !== cartItemId),
      }));
    } catch (error) {
      console.error('Error al eliminar el producto del carrito:', error);
    }
  };

  const emptyCart = async () => {
    try {
      await axios.delete(`/api/cart/empty/${userId}`);
      setCart({ items: [] });  // Vaciar el carrito en el frontend
      setTotal(0);  // Vaciar el total también
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
    }
  };

  return (
    <div>
      <h1>Carrito de Compras</h1>
      {cart ? (
        <div>
          <h3>Total: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(total)}</h3>
          <button onClick={emptyCart} className="btn btn-danger">Vaciar carrito</button>
          {cart.items.length > 0 ? (
            cart.items.map(item => (
              <div key={item._id} className="cart-item">
                <p>{item.productId.name} - {item.quantity} x {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.productId.price)}</p>
                <button onClick={() => removeFromCart(item._id)} className="btn btn-warning">Eliminar</button>
              </div>
            ))
          ) : (
            <p>No hay productos en el carrito.</p>
          )}
        </div>
      ) : (
        <p>Cargando carrito...</p>
      )}
    </div>
  );
};

export default CartPage;