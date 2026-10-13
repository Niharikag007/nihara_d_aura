import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { mockData } from '../services/mockData';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('nihara_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error loading products from localStorage', e);
    }
    return mockData.products;
  });

  // Sync state to localStorage safely only when modified
  const saveToStorage = useCallback((productList) => {
    try {
      localStorage.setItem('nihara_products', JSON.stringify(productList));
    } catch (e) {
      console.warn('Failed to persist products to localStorage:', e);
    }
  }, []);

  // Sync from backend API on mount
  useEffect(() => {
    let isMounted = true;
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        const backendProducts = data.data?.products || data.products;
        if (Array.isArray(backendProducts) && backendProducts.length > 0) {
          setProducts(prev => {
            if (backendProducts.length !== prev.length) {
              return backendProducts;
            }
            return prev;
          });
        }
      })
      .catch(() => {
        // Silently use client catalog
      });
    return () => { isMounted = false; };
  }, []);

  const addProduct = useCallback(async (productData) => {
    if (!productData.name || !productData.price) {
      return { success: false, message: 'Product title and price are required.' };
    }

    const id = productData.id || `prod_${Date.now()}`;
    const slug = productData.slug || productData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newProduct = {
      id,
      slug,
      name: productData.name,
      category: productData.category || 'Jewellery',
      categorySlug: (productData.category || 'jewellery').toLowerCase(),
      subcategory: productData.subcategory || 'All Jewellery',
      price: Number(productData.price),
      originalPrice: Number(productData.originalPrice || productData.price),
      discountPercent: productData.discountPercent || (productData.originalPrice && productData.price ? Math.max(0, Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)) : 0),
      rating: Number(productData.rating) || 5.0,
      reviewCount: Number(productData.reviewCount) || 1,
      isFeatured: !!productData.isFeatured,
      isBestseller: !!productData.isBestseller,
      images: Array.isArray(productData.images) && productData.images.length > 0
        ? productData.images
        : [productData.image || "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85"],
      description: productData.description || "Exquisite artisan handcrafted creation from Nihara D'Aura Haute Luxury collection.",
      variants: Array.isArray(productData.variants) && productData.variants.length > 0
        ? productData.variants
        : ["Standard Royal Edition"],
      sizes: Array.isArray(productData.sizes) && productData.sizes.length > 0
        ? productData.sizes
        : ["Standard Size"],
      features: Array.isArray(productData.features) && productData.features.length > 0
        ? productData.features
        : ["100% Certified Authentic Craftsmanship", "Includes Royal Velvet Box & Certificate"],
      stock: Number(productData.stock) || 20,
      createdAt: new Date().toISOString()
    };

    setProducts(prev => {
      const next = [newProduct, ...prev];
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
      fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newProduct)
      }).catch(() => {});
    } catch (e) {}

    return { success: true, message: `Product "${newProduct.name}" added successfully!`, product: newProduct };
  }, [saveToStorage]);

  const updateProduct = useCallback(async (id, updateData) => {
    let updated = null;
    setProducts(prev => {
      const next = prev.map(p => {
        if (p.id === id || p.slug === id) {
          updated = { ...p, ...updateData };
          return updated;
        }
        return p;
      });
      if (updated) saveToStorage(next);
      return next;
    });

    if (updated) {
      try {
        fetch(`http://localhost:5000/api/products/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(updateData)
        }).catch(() => {});
      } catch (e) {}
    }

    return {
      success: !!updated,
      message: updated ? `Product updated successfully!` : 'Product not found',
      product: updated
    };
  }, [saveToStorage]);

  const deleteProduct = useCallback(async (id) => {
    let existing = null;
    setProducts(prev => {
      existing = prev.find(p => p.id === id || p.slug === id);
      if (!existing) return prev;
      const next = prev.filter(p => p.id !== existing.id && p.slug !== existing.slug);
      saveToStorage(next);
      return next;
    });

    if (!existing) return { success: false, message: 'Product not found' };

    try {
      fetch(`http://localhost:5000/api/products/${existing.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      }).catch(() => {});
    } catch (e) {}

    return { success: true, message: `Product "${existing.name}" deleted successfully!` };
  }, [saveToStorage]);

  const getProductById = useCallback((idOrSlug) => {
    return products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  }, [products]);

  const contextValue = useMemo(() => ({
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById
  }), [products, addProduct, updateProduct, deleteProduct, getProductById]);

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
