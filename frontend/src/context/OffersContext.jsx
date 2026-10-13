import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const OffersContext = createContext();

const DEFAULT_OFFERS = [
  {
    id: "off_1",
    code: "NIHARA10",
    name: "Royal 10% Welcome Offer",
    discountPercent: 10,
    minOrder: 1999,
    validTill: "2026-12-31",
    isActive: true
  },
  {
    id: "off_2",
    code: "GLOW20",
    name: "Festive Glow 20% Offer",
    discountPercent: 20,
    minOrder: 3999,
    validTill: "2026-11-30",
    isActive: true
  },
  {
    id: "off_3",
    code: "AURA30",
    name: "Haute Luxury VIP Offer",
    discountPercent: 30,
    minOrder: 9999,
    validTill: "2026-12-31",
    isActive: true
  },
  {
    id: "off_4",
    code: "BRIDAL15",
    name: "Bridal Suite Special Offer",
    discountPercent: 15,
    minOrder: 4999,
    validTill: "2026-12-31",
    isActive: true
  }
];

export function OffersProvider({ children }) {
  const [offers, setOffers] = useState(() => {
    try {
      const saved = localStorage.getItem('nihara_offers');
      return saved ? JSON.parse(saved) : DEFAULT_OFFERS;
    } catch {
      return DEFAULT_OFFERS;
    }
  });

  const saveToStorage = useCallback((offerList) => {
    try {
      localStorage.setItem('nihara_offers', JSON.stringify(offerList));
    } catch (e) {
      console.warn('Failed to save offers to localStorage', e);
    }
  }, []);

  // Sync with backend API if reachable
  useEffect(() => {
    let isMounted = true;
    fetch('http://localhost:5000/api/offers')
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        const backendOffers = data.data?.offers || data.offers;
        if (Array.isArray(backendOffers) && backendOffers.length > 0) {
          setOffers(prev => {
            const map = new Map();
            backendOffers.forEach(o => map.set(o.code.toUpperCase(), o));
            prev.forEach(o => map.set(o.code.toUpperCase(), o));
            return Array.from(map.values());
          });
        }
      })
      .catch(() => {
        // Fallback silently to client state
      });
    return () => { isMounted = false; };
  }, []);

  const addOffer = useCallback(async (offerData) => {
    const cleanCode = (offerData.code || '').trim().toUpperCase();
    if (!cleanCode) return { success: false, message: 'Coupon code is required' };
    
    // Check duplicate
    if (offers.some(o => o.code.toUpperCase() === cleanCode)) {
      return { success: false, message: `Offer with code "${cleanCode}" already exists` };
    }

    const newOffer = {
      id: `off_${Date.now()}`,
      code: cleanCode,
      name: offerData.name || `${cleanCode} Special Discount`,
      discountPercent: Number(offerData.discountPercent) || 10,
      minOrder: Number(offerData.minOrder) || 0,
      validTill: offerData.validTill || '2026-12-31',
      isActive: offerData.isActive !== false,
      createdAt: new Date().toISOString()
    };

    setOffers(prev => {
      const next = [newOffer, ...prev];
      saveToStorage(next);
      return next;
    });

const getAuthHeaders = () => {
  try {
    const stored = localStorage.getItem('nihara_auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.token) {
        return {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${parsed.token}`,
          'x-user-role': parsed.user?.role || 'user'
        };
      }
    }
  } catch (e) {}
  return { 'Content-Type': 'application/json' };
};

    // Send to backend API
    try {
      fetch('http://localhost:5000/api/offers', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newOffer)
      }).catch(() => {});
    } catch (e) {}

    return { success: true, message: `Offer "${cleanCode}" added successfully!`, offer: newOffer };
  }, [offers, saveToStorage]);

  const deleteOffer = useCallback(async (idOrCode) => {
    const target = offers.find(o => o.id === idOrCode || o.code.toUpperCase() === idOrCode.toUpperCase());
    if (!target) return { success: false, message: 'Offer not found' };

    setOffers(prev => {
      const next = prev.filter(o => o.id !== target.id && o.code.toUpperCase() !== target.code.toUpperCase());
      saveToStorage(next);
      return next;
    });

    // Send to backend API
    try {
      fetch(`http://localhost:5000/api/offers/${target.id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      }).catch(() => {});
    } catch (e) {}

    return { success: true, message: `Offer "${target.code}" removed successfully!` };
  }, [offers, saveToStorage]);

  const toggleOffer = useCallback(async (idOrCode) => {
    let updatedOffer = null;
    setOffers(prev => {
      const next = prev.map(o => {
        if (o.id === idOrCode || o.code.toUpperCase() === idOrCode.toUpperCase()) {
          updatedOffer = { ...o, isActive: !o.isActive };
          return updatedOffer;
        }
        return o;
      });
      if (updatedOffer) saveToStorage(next);
      return next;
    });

    if (updatedOffer) {
      try {
        fetch(`http://localhost:5000/api/offers/${updatedOffer.id}/toggle`, { 
          method: 'PATCH',
          headers: getAuthHeaders()
        }).catch(() => {});
      } catch (e) {}
    }

    return { 
      success: !!updatedOffer, 
      message: updatedOffer ? `Offer "${updatedOffer.code}" is now ${updatedOffer.isActive ? 'Active' : 'Inactive'}` : 'Offer not found' 
    };
  }, [saveToStorage]);

  const validateCoupon = useCallback((code, cartSubtotal = 0) => {
    if (!code) return { success: false, message: 'Please enter a coupon code.' };
    const clean = code.trim().toUpperCase();
    const offer = offers.find(o => o.code.toUpperCase() === clean);

    if (!offer) {
      return { success: false, message: `Invalid coupon code "${clean}".` };
    }

    if (!offer.isActive) {
      return { success: false, message: `Coupon code "${clean}" is currently expired or inactive.` };
    }

    if (offer.minOrder && cartSubtotal < offer.minOrder) {
      return { 
        success: false, 
        message: `Coupon "${clean}" requires a minimum purchase of ₹${offer.minOrder.toLocaleString('en-IN')}. (Current: ₹${cartSubtotal.toLocaleString('en-IN')})` 
      };
    }

    return {
      success: true,
      message: `Coupon ${clean} applied (${offer.discountPercent}% OFF)!`,
      offer
    };
  }, [offers]);

  const contextValue = useMemo(() => ({
    offers,
    addOffer,
    deleteOffer,
    toggleOffer,
    validateCoupon
  }), [offers, addOffer, deleteOffer, toggleOffer, validateCoupon]);

  return (
    <OffersContext.Provider value={contextValue}>
      {children}
    </OffersContext.Provider>
  );
}

export const useOffers = () => {
  const context = useContext(OffersContext);
  if (!context) {
    throw new Error('useOffers must be used within an OffersProvider');
  }
  return context;
};
