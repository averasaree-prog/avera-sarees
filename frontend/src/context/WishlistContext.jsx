import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState({ items: [], totalItems: 0 });
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!user) {
      setWishlist({ items: [], totalItems: 0 });
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/api/wishlist');
      if (res.success && res.data) {
        setWishlist(res.data);
      }
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (productId) => {
    if (!user) {
      throw new Error('Please sign in to save your favorite sarees to your wishlist.');
    }
    try {
      const res = await api.post(`/api/wishlist/toggle/${productId}`);
      if (res.success && res.data) {
        setWishlist(res.data);
        return res.data;
      }
    } catch (err) {
      throw err;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.items?.some((item) => item.productId === productId) || false;
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      loading,
      toggleWishlist,
      isInWishlist,
      totalWishlistItems: wishlist.totalItems || 0,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
