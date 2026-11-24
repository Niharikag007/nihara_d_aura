import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';
import { useSocket } from './SocketContext';
import { API_BASE_URL } from '../config/api.js';
import { REMOVED_JEWELLERY_PRODUCT_IDS } from '../data/jewelleryCategories.js';

const ProductContext = createContext();
const removedProductIds = new Set(REMOVED_JEWELLERY_PRODUCT_IDS);

const normalizeProduct = (product) => {
  if (!product || typeof product !== 'object') return product;
  const normalizedId = product.id || product._id?.toString();
  return normalizedId ? { ...product, id: normalizedId } : product;
};

const withoutRemovedProducts = (productList) =>
  productList
    .map(normalizeProduct)
    .filter((product) => !removedProductIds.has(product.id || product._id));

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

export function ProductProvider({ children }) {
  const { socket } = useSocket();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch live products directly from MongoDB backend API on mount
  const fetchLiveProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getProducts();
      console.log('[ProductContext] API Response:', res);
      if (res && Array.isArray(res.products)) {
        const currentProducts = withoutRemovedProducts(res.products);
        console.log('[ProductContext] Products after filtering:', currentProducts.length);
        setProducts(currentProducts);
      }
    } catch (err) {
      console.warn('[ProductContext] Live MongoDB fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveProducts();
  }, [fetchLiveProducts]);

  // Real-time synchronization via Socket.io for live MongoDB updates
  useEffect(() => {
    if (!socket) return;

    const handleProductCreated = (newProd) => {
      newProd = normalizeProduct(newProd);
      if (!newProd || removedProductIds.has(newProd.id || newProd._id)) return;
      setProducts(prev => {
        const prodId = newProd.id || newProd._id;
        if (prev.some(p => (p.id || p._id) === prodId || p.slug === newProd.slug)) {
          return prev;
        }
        return [newProd, ...prev];
      });
    };

    const handleProductUpdated = (updatedProd) => {
      updatedProd = normalizeProduct(updatedProd);
      if (!updatedProd || removedProductIds.has(updatedProd.id || updatedProd._id)) return;
      const targetId = updatedProd.id || updatedProd._id;
      setProducts(prev => {
        return prev.map(p => {
          if ((p.id || p._id) === targetId || p.slug === updatedProd.slug) {
            return { ...p, ...updatedProd };
          }
          return p;
        });
      });
    };

    const handleProductDeleted = ({ id }) => {
      if (!id) return;
      setProducts(prev => {
        return prev.filter(p => (p.id || p._id) !== id && p.slug !== id);
      });
    };

    const handleCategoryUpdate = () => {
      fetchLiveProducts();
    };

    socket.on('product:created', handleProductCreated);
    socket.on('product:updated', handleProductUpdated);
    socket.on('product:deleted', handleProductDeleted);
    socket.on('category:updated', handleCategoryUpdate);

    return () => {
      socket.off('product:created', handleProductCreated);
      socket.off('product:updated', handleProductUpdated);
      socket.off('product:deleted', handleProductDeleted);
      socket.off('category:updated', handleCategoryUpdate);
    };
  }, [socket, fetchLiveProducts]);

  const addProduct = useCallback(async (productData) => {
    if (!productData.name || !productData.price) {
      return { success: false, message: 'Product title and price are required.' };
    }

    try {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if (res.ok && data?.product) {
        const newProduct = data.product;
        setProducts(prev => [newProduct, ...prev.filter(p => (p.id || p._id) !== (newProduct.id || newProduct._id))]);
        return { success: true, message: `Product "${newProduct.name}" added to MongoDB!`, product: newProduct };
      }
    } catch (e) {
      console.error('Failed to create product in MongoDB:', e);
    }

    return { success: false, message: 'Failed to create product in MongoDB.' };
  }, []);

  const updateProduct = useCallback(async (id, updateData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
      });
      const data = await res.json();
      if (res.ok && data?.product) {
        const updated = data.product;
        setProducts(prev => prev.map(p => ((p.id || p._id) === id || p.slug === id ? updated : p)));
        return { success: true, message: 'Product updated successfully in MongoDB!', product: updated };
      }
    } catch (e) {
      console.error('Failed to update product in MongoDB:', e);
    }

    return { success: false, message: 'Product update failed.' };
  }, []);

  const deleteProduct = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => (p.id || p._id) !== id && p.slug !== id));
        return { success: true, message: 'Product deleted successfully from MongoDB!' };
      }
    } catch (e) {
      console.error('Failed to delete product in MongoDB:', e);
    }

    return { success: false, message: 'Failed to delete product.' };
  }, []);

  const getProductById = useCallback((idOrSlug) => {
    return products.find(p =>
      (p.id || p._id?.toString()) === idOrSlug ||
      p.slug === idOrSlug
    );
  }, [products]);

  const contextValue = useMemo(() => ({
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    refetchProducts: fetchLiveProducts
  }), [products, loading, addProduct, updateProduct, deleteProduct, getProductById, fetchLiveProducts]);

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
