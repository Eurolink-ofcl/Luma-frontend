const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://astro.bloodme.in/luma-api/api'
    : 'http://localhost:5000/api');

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { customerUser, requireAuth } = useAuth();

  const getStorageKey = useCallback(() => {
    return customerUser?.email ? `luma_cart_${customerUser.email.toLowerCase()}` : null;
  }, [customerUser]);

  const [cartItems, setCartItems] = useState(() => {
    try {
      const userKey = customerUser?.email ? `luma_cart_${customerUser.email.toLowerCase()}` : null;
      if (userKey) {
        const stored = localStorage.getItem(userKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading cart from localStorage:', e);
    }
    return [];
  });

  // When customer logs in or out, switch active cart
  useEffect(() => {
    if (!customerUser) {
      setCartItems([]);
      return;
    }

    try {
      const userKey = `luma_cart_${customerUser.email.toLowerCase()}`;
      const stored = localStorage.getItem(userKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
          return;
        }
      } else if (Array.isArray(customerUser.cart) && customerUser.cart.length > 0) {
        setCartItems(customerUser.cart);
        return;
      }
      setCartItems([]);
    } catch (e) {
      console.warn('Error loading user cart on auth change:', e);
      setCartItems([]);
    }
  }, [customerUser]);

  // Persist customer cart on changes
  useEffect(() => {
    const key = getStorageKey();
    if (!key) return;

    try {
      localStorage.setItem(key, JSON.stringify(cartItems));
      
      // Optional background sync with backend MongoDB
      if (customerUser?.email) {
        fetch(`${API_BASE_URL}/customer/cart`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: customerUser.email,
            cartItems,
          }),
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('Error saving cart to localStorage:', e);
    }
  }, [cartItems, customerUser, getStorageKey]);

  /**
   * Adds an item to the cart.
   * If user is not logged in, blocks addition and triggers AuthModal.
   */
  const addToCart = useCallback((product, quantity = 1, variant = '') => {
    return requireAuth(() => {
      setCartItems((prev) => {
        const existingIdx = prev.findIndex(
          (item) =>
            (product.id && item.id === product.id) ||
            (product._id && item.id === product._id) ||
            (item.slug && product.slug && item.slug === product.slug && (!variant || item.variant === variant))
        );

        if (existingIdx > -1) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: updated[existingIdx].quantity + quantity,
          };
          return updated;
        }

        const newItem = {
          id: product.id || product._id || `cart-${Date.now()}`,
          slug: product.slug || '',
          name: product.name || product.title || 'LUMA Red Light Device',
          variant: variant || product.variant || 'Standard Clinical Edition',
          price: Number(product.price) || 0,
          quantity: Math.max(1, quantity),
          image: product.image || product.thumbnail || '/assets/products/list-product-1.jpg',
        };

        return [...prev, newItem];
      });
      return true;
    }, 'Please sign in or create an account to add items to your cart.');
  }, [requireAuth]);

  /**
   * Buy Now action:
   * If user is not logged in, blocks and triggers AuthModal.
   * If logged in, adds item to cart and executes onProceedToCheckout([item]).
   */
  const buyNow = useCallback((product, onProceedToCheckout, quantity = 1, variant = '') => {
    return requireAuth(() => {
      const item = {
        id: product.id || product._id || `cart-${Date.now()}`,
        slug: product.slug || '',
        name: product.name || product.title || 'LUMA Red Light Device',
        variant: variant || product.variant || 'Standard Clinical Edition',
        price: Number(product.price) || 0,
        quantity: Math.max(1, quantity),
        image: product.image || product.thumbnail || '/assets/products/list-product-1.jpg',
      };

      setCartItems((prev) => {
        const existingIdx = prev.findIndex((i) => i.id === item.id || (i.slug && i.slug === item.slug));
        if (existingIdx > -1) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: updated[existingIdx].quantity + quantity,
          };
          return updated;
        }
        return [...prev, item];
      });

      if (typeof onProceedToCheckout === 'function') {
        onProceedToCheckout([item]);
      }
      return true;
    }, 'Please sign in or create an account to purchase this product.');
  }, [requireAuth]);

  const updateQuantity = useCallback((id, newQty) => {
    setCartItems((prev) => {
      if (newQty <= 0) {
        return prev.filter((item) => item.id !== id);
      }
      return prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      );
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = cartItems.reduce(
    (acc, item) => acc + (Number(item.quantity) || 1),
    0
  );

  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        addToCart,
        buyNow,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
