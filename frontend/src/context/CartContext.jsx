import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], totalItems: 0, subtotal: 0 });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/cart');
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1, openDrawer = true) => {
    try {
      setLoading(true);
      const res = await api.post('/api/cart/items', { productId, quantity });
      if (res.success && res.data) {
        setCart(res.data);
        if (openDrawer) setIsDrawerOpen(true);
        return res.data;
      }
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      if (quantity <= 0) {
        return await removeItem(itemId);
      }
      const res = await api.patch(`/api/cart/items/${itemId}`, { quantity });
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      throw err;
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await api.delete(`/api/cart/items/${itemId}`);
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      throw err;
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      isDrawerOpen,
      setIsDrawerOpen,
      addToCart,
      updateQuantity,
      removeItem,
      fetchCart,
      totalItems: cart.totalItems || 0,
      subtotal: cart.subtotal || 0,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
