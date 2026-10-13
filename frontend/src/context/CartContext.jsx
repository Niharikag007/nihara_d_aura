import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { mockData } from '../services/mockData';
import { useOffers } from './OffersContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { validateCoupon } = useOffers();

  // Pre-fill with the Foundation item as seen in APK/Video
  const [items, setItems] = useState([
    {
      productId: "prod_foundation",
      product: mockData.products.find(p => p.id === "prod_foundation") || mockData.products[0],
      quantity: 1,
      variant: "Warm Ivory",
      size: "30 ml"
    }
  ]);

  const [coupon, setCoupon] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Calculations
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + ((item.product?.price || 0) * item.quantity), 0);
  }, [items]);

  const discount = useMemo(() => {
    return coupon ? Math.round((subtotal * coupon.discountPercent) / 100) : 0;
  }, [subtotal, coupon]);

  const deliveryFee = 0; // FREE as shown in the APK
  const totalAmount = useMemo(() => Math.max(0, subtotal - discount + deliveryFee), [subtotal, discount]);
  const totalItemCount = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items]);

  const addToCart = useCallback((product, quantity = 1, variant = 'Default', size = 'Standard') => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.productId === product.id && i.variant === variant);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, { productId: product.id, product, quantity, variant, size }];
    });
  }, []);

  const updateQuantity = useCallback((productId, variant, delta) => {
    setItems(prev => {
      return prev.map(item => {
        if (item.productId === productId && (variant ? item.variant === variant : true)) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  }, []);

  const removeFromCart = useCallback((productId, variant) => {
    setItems(prev => prev.filter(i => !(i.productId === productId && (variant ? i.variant === variant : true))));
  }, []);

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
