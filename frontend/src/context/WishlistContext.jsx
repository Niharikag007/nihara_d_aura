import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  // Pre-seed with the 3 items seen in APK/Video: Foundation, Chandbali Earrings, Jasmine Candle
  const [wishlistIds, setWishlistIds] = useState(["prod_foundation", "prod_earrings", "prod_candle"]);

  const toggleWishlist = useCallback((productId) => {
    setWishlistIds(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  }, []);

  const isInWishlist = useCallback((productId) => {
    return wishlistIds.includes(productId);
  }, [wishlistIds]);

  const removeFromWishlist = useCallback((productId) => {
    setWishlistIds(prev => prev.filter(id => id !== productId));
  }, []);

  const value = useMemo(() => ({
    wishlistIds,
    toggleWishlist,
    isInWishlist,
    removeFromWishlist,
    count: wishlistIds.length
  }), [wishlistIds, toggleWishlist, isInWishlist, removeFromWishlist]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
