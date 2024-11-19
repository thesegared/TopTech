import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const userId = localStorage.getItem("userId") || "guest";

  // Función para obtener el carrito desde la API
  const fetchCart = useCallback(async () => {
    try {
      const response = await api.get(`/cart/${userId}`);
      const cart = response.data;

      setCartItems(cart.items);
      setCartItemCount(cart.items.reduce((acc, item) => acc + item.quantity, 0));
      setTotalPrice(
        cart.items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0)
      );
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchCart(); // Obtén los datos del carrito al cargar el componente
  }, [fetchCart]);

  // Actualizar cantidad de un producto
  const updateQuantity = async (cartItemId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        await removeFromCart(cartItemId);
      } else {
        await api.put(`/cart/update/${cartItemId}`, { quantity: newQuantity, userId });
        fetchCart(); // Sincroniza el estado después de actualizar la cantidad
      }
    } catch (error) {
      console.error("Error al actualizar la cantidad:", error);
    }
  };

  // Eliminar un producto del carrito
  const removeFromCart = async (cartItemId) => {
    try {
      await api.delete(`/cart/remove/${cartItemId}`, { data: { userId } });
      fetchCart(); // Sincroniza el estado después de eliminar un producto
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  // Vaciar el carrito
  const emptyCart = async () => {
    try {
      await api.delete(`/cart/empty/${userId}`);
      setCartItems([]);
      setCartItemCount(0);
      setTotalPrice(0);
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemCount,
        totalPrice,
        fetchCart,
        updateQuantity,
        removeFromCart,
        emptyCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
