import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useOffers } from './OffersContext';
import { api } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { validateCoupon } = useOffers();

  // Load saved cart from localStorage or start with empty bag
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('nihara_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved cart:', e);
    }
    return [];
  });

  const [coupon, setCoupon] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sync to storage & backend whenever cart items change
  const saveCart = useCallback((cartItems) => {
    try {
      localStorage.setItem('nihara_cart', JSON.stringify(cartItems));
      api.updateCartOnServer(cartItems).catch(() => {});
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e);
    }
  }, []);

  // Fetch live server cart on mount if available
  useEffect(() => {
    api.getCart().then(res => {
      if (res && Array.isArray(res.items) && res.items.length > 0) {
        setItems(prev => prev.length === 0 ? res.items : prev);
      }
    }).catch(() => {});
  }, []);

  // Calculations
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + ((item.product?.price || 0) * item.quantity), 0);
  }, [items]);

  const discount = useMemo(() => {
    return coupon ? Math.round((subtotal * coupon.discountPercent) / 100) : 0;
  }, [subtotal, coupon]);

  const deliveryFee = 0; // Complimentary luxury delivery
  const totalAmount = useMemo(() => Math.max(0, subtotal - discount + deliveryFee), [subtotal, discount]);
  const totalItemCount = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items]);

  const addToCart = useCallback((product, quantity = 1, variant = 'Standard', size = 'Standard') => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.productId === product.id && i.variant === variant);
      let next;
      if (idx > -1) {
        next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
      } else {
        next = [...prev, { productId: product.id, product, quantity, variant, size }];
      }
      saveCart(next);
      return next;
    });
  }, [saveCart]);

  const updateQuantity = useCallback((productId, variant, delta) => {
    setItems(prev => {
      const next = prev.map(item => {
        if (item.productId === productId && (variant ? item.variant === variant : true)) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
      saveCart(next);
      return next;
    });
  }, [saveCart]);

  const removeFromCart = useCallback((productId, variant) => {
    setItems(prev => {
      const next = prev.filter(i => !(i.productId === productId && (variant ? i.variant === variant : true)));
      saveCart(next);
      return next;
    });
  }, [saveCart]);

  const applyCoupon = useCallback((code) => {
    const res = validateCoupon(code, subtotal);
    if (res.success) {
      setCoupon({
        code: res.offer.code,
        discountPercent: res.offer.discountPercent,
        name: res.offer.name
      });
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message };
  }, [validateCoupon, subtotal]);

  const removeCoupon = useCallback(() => {
    setCoupon(null);
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCoupon(null);
  }, []);

  const contextValue = useMemo(() => ({
    items,
    subtotal,
    discount,
    deliveryFee,
    totalAmount,
    totalItemCount,
    coupon,
    isDrawerOpen,
    setIsDrawerOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    clearCart
  }), [
    items,
    subtotal,
    discount,
    totalAmount,
    totalItemCount,
    coupon,
    isDrawerOpen,
    setIsDrawerOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    clearCart
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
