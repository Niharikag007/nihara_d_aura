import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Tag, 
  Package, 
  Sparkles, 
  Percent, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ArrowLeft, 
  TrendingUp, 
  ShoppingBag, 
  Calendar, 
  ExternalLink,
  Eye,
  RefreshCw,
  Layers,
  Check,
  X,
  ShieldCheck,
  IndianRupee,
  SlidersHorizontal
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useOffers } from '../context/OffersContext';
import { useToast } from '../context/ToastContext';
import { mockData } from '../services/mockData';

export default function AdminDashboard() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { offers, addOffer, deleteOffer, toggleOffer } = useOffers();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('products'); // 'overview' | 'products' | 'offers' | 'orders'

  // Product Filter State
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');

  // Modals state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const [showAddOfferModal, setShowAddOfferModal] = useState(false);
  const [deletingOffer, setDeletingOffer] = useState(null);

  // Subcategories mapping
  const subcategoriesMap = {
    Jewellery: ['Gold Earrings & Jhumkas', 'Bridal Haar & Sets', 'Gold Lockets & Pendants', 'Temple Gold Bangles', 'Gold Rings & Bands', 'Rose Gold Chokers'],
    Makeup: ['Face Foundations', 'Lipsticks & Gloss', 'Eyeshadow Palettes', 'Blushes & Highlighters'],
    Nails: ['Press-On Kits', 'Gel Lacquer', 'Chrome Nail Art', 'Cuticle Elixirs'],
    Candles: ['Soy Wax Jar Candles', 'Reed Diffusers', 'Aroma Room Sprays', 'Wax Melts']
  };

  // New Product Form State
  const initialProductForm = {
    name: '',
    category: 'Jewellery',
    subcategory: 'Gold Earrings & Jhumkas',
    price: '',
    originalPrice: '',
    stock: '25',
    image: '',
    description: '',
    isFeatured: false,
    isBestseller: false
  };
  const [productForm, setProductForm] = useState(initialProductForm);

  // New Offer Form State
  const initialOfferForm = {
    code: '',
    name: '',
    discountPercent: '20',
    minOrder: '1999',
    validTill: '2026-12-31'
  };
  const [offerForm, setOfferForm] = useState(initialOfferForm);

  // Curated Luxury Image presets for quick select in Admin
  const sampleImages = [
    { label: "Gold Jewellery", url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85" },
    { label: "Rose Gold Choker", url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85" },
    { label: "Polki Diamond Ring", url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85" },
    { label: "Luxury Foundation", url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=85" },
    { label: "Satin Lipstick", url: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1200&q=85" },
    { label: "Eyeshadow Palette", url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=85" },
    { label: "Press-On Nail Art", url: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=85" },
    { label: "Soy Wax Candle", url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=85" },
    { label: "Reed Diffuser", url: "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&w=1200&q=85" }
  ];

  // Filtering products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'All' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (selectedSubcategory !== 'All' && p.subcategory && p.subcategory.toLowerCase() !== selectedSubcategory.toLowerCase()) {
        return false;
      }
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase().trim();
        const mName = p.name.toLowerCase().includes(q);
        const mCat = p.category.toLowerCase().includes(q);
        const mSub = (p.subcategory || '').toLowerCase().includes(q);
        const mId = (p.id || '').toLowerCase().includes(q);
        if (!mName && !mCat && !mSub && !mId) return false;
      }
      return true;
    });
  }, [products, selectedCategory, selectedSubcategory, productSearch]);

  // Handle Category change in product form
  const handleCategoryChangeInForm = (cat) => {
    const subList = subcategoriesMap[cat] || [];
    setProductForm(prev => ({
      ...prev,
      category: cat,
      subcategory: subList[0] || 'All'
    }));
  };

  // Submit Add / Edit Product
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim() || !productForm.price) {
      showToast('Product name and price are required', 'error');
      return;
    }

    const payload = {
      name: productForm.name.trim(),
      category: productForm.category,
      subcategory: productForm.subcategory,
      price: Number(productForm.price),
      originalPrice: Number(productForm.originalPrice || productForm.price),
      stock: Number(productForm.stock || 20),
      image: productForm.image || sampleImages[0].url,
      images: [productForm.image || sampleImages[0].url],
      description: productForm.description.trim() || `Handcrafted royal luxury ${productForm.name} by Nihara D'Aura.`,
      isFeatured: !!productForm.isFeatured,
      isBestseller: !!productForm.isBestseller
    };

    if (editingProduct) {
      const res = await updateProduct(editingProduct.id, payload);
      if (res.success) {
        showToast(`Updated "${payload.name}" successfully!`, 'success');
        setEditingProduct(null);
      } else {
        showToast(res.message || 'Failed to update product', 'error');
      }
    } else {
      const res = await addProduct(payload);
      if (res.success) {
        showToast(`Added "${payload.name}" to catalog!`, 'success');
        setShowAddProductModal(false);
        setProductForm(initialProductForm);
      } else {
        showToast(res.message || 'Failed to add product', 'error');
      }
    }
  };

  // Open Edit Product Modal
  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category || 'Jewellery',
      subcategory: prod.subcategory || (subcategoriesMap[prod.category]?.[0] || 'All'),
      price: String(prod.price),
      originalPrice: String(prod.originalPrice || prod.price),
      stock: String(prod.stock || 20),
      image: prod.images?.[0] || '',
      description: prod.description || '',
      isFeatured: !!prod.isFeatured,
      isBestseller: !!prod.isBestseller
    });
  };

  // Confirm Delete Product
  const confirmDeleteProduct = async () => {
    if (!deletingProduct) return;
    const res = await deleteProduct(deletingProduct.id);
    if (res.success) {
      showToast(`Deleted "${deletingProduct.name}"`, 'success');
    } else {
      showToast(res.message || 'Failed to delete product', 'error');
    }
    setDeletingProduct(null);
  };

  // Submit Add Offer
  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    if (!offerForm.code.trim() || !offerForm.discountPercent) {
      showToast('Coupon code and discount % are required', 'error');
      return;
    }

    const res = await addOffer(offerForm);
    if (res.success) {
      showToast(res.message, 'success');
      setShowAddOfferModal(false);
      setOfferForm(initialOfferForm);
    } else {
      showToast(res.message, 'error');
    }
  };

  // Confirm Delete Offer
  const confirmDeleteOffer = async () => {
    if (!deletingOffer) return;
    const res = await deleteOffer(deletingOffer.id);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message || 'Failed to remove offer', 'error');
    }
    setDeletingOffer(null);
  };

  // Toggle Offer Active Status
  const handleToggleOffer = async (off) => {
    const res = await toggleOffer(off.id);
    if (res.success) {
      showToast(res.message, 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E8DFC8]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[#C59B27] text-white flex items-center gap-1 shadow-sm">
              <ShieldCheck className="w-3 h-3" /> Master Control Panel
            </span>
            <span className="text-xs text-stone-500 font-medium">• Live Synchronized</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1C1917] tracking-tight">
            Nihara <span className="text-[#C59B27] italic font-serif">D'Aura</span> Administration
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Manage live luxury inventory, products, coupon promotions & store settings with instant persistence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/products"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-[#E8DFC8] text-[#1C1917] hover:border-[#C59B27] hover:bg-stone-50 transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View Public Store</span>
          </Link>
          <button
            onClick={() => {
              if (activeTab === 'products') setShowAddProductModal(true);
              else if (activeTab === 'offers') setShowAddOfferModal(true);
              else setShowAddProductModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#D4AF37] to-[#B3861B] text-white hover:shadow-md transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{activeTab === 'offers' ? 'New Coupon Offer' : 'Add New Product'}</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DFC8] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#C59B27] flex items-center justify-center flex-shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Total Products</span>
            <div className="text-2xl font-extrabold text-[#1C1917]">{products.length}</div>
            <span className="text-[10px] text-emerald-600 font-semibold">100% In Stock & Verified</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DFC8] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Active Offers</span>
            <div className="text-2xl font-extrabold text-[#1C1917]">{offers.filter(o => o.isActive).length} / {offers.length}</div>
            <span className="text-[10px] text-[#C59B27] font-semibold">Live in Cart & Checkout</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DFC8] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Categories</span>
            <div className="text-2xl font-extrabold text-[#1C1917]">4 Categories</div>
            <span className="text-[10px] text-stone-500 font-semibold">18 Subcategories</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DFC8] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Catalog Valuation</span>
            <div className="text-2xl font-extrabold text-[#1C1917]">
              ₹{(products.reduce((acc, p) => acc + (p.price * (p.stock || 1)), 0) / 100000).toFixed(1)}L
            </div>
            <span className="text-[10px] text-purple-600 font-semibold">BIS 22K/18K Certified</span>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E8DFC8] mb-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'products'
              ? 'border-[#C59B27] text-[#C59B27] bg-white rounded-t-xl'
              : 'border-transparent text-stone-600 hover:text-[#1C1917]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'offers'
              ? 'border-[#C59B27] text-[#C59B27] bg-white rounded-t-xl'
              : 'border-transparent text-stone-600 hover:text-[#1C1917]'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Offers & Coupons ({offers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-[#C59B27] text-[#C59B27] bg-white rounded-t-xl'
              : 'border-transparent text-stone-600 hover:text-[#1C1917]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Recent Customer Orders</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: PRODUCT CATALOG MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="Search products by title, SKU, category..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E8DFC8] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#C59B27] bg-[#FDFBF7]"
              />
              {productSearch && (
                <button onClick={() => setProductSearch('')} className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {['All', 'Jewellery', 'Makeup', 'Nails', 'Candles'].map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedSubcategory('All');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-[#C59B27] text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory Pills (if a category is selected) */}
          {selectedCategory !== 'All' && subcategoriesMap[selectedCategory] && (
            <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none bg-white p-3 rounded-xl border border-[#E8DFC8]/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#A87D17] flex-shrink-0">
                Subcategories:
              </span>
              <button
                onClick={() => setSelectedSubcategory('All')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
                  selectedSubcategory === 'All' ? 'bg-[#C59B27] text-white' : 'bg-stone-100 text-stone-700'
                }`}
              >
                All {selectedCategory}
              </button>
              {subcategoriesMap[selectedCategory].map(sub => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
                    selectedSubcategory.toLowerCase() === sub.toLowerCase()
                      ? 'bg-[#C59B27] text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* Product Items Table / Grid */}
          <div className="bg-white rounded-2xl border border-[#E8DFC8] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#E8DFC8] flex items-center justify-between bg-stone-50/50">
              <span className="text-xs font-bold text-[#1C1917]">
                Showing {filteredProducts.length} of {products.length} Products
              </span>
              <button
                onClick={() => {
                  setProductForm(initialProductForm);
                  setShowAddProductModal(true);
                }}
                className="text-xs font-bold text-[#C59B27] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Product
              </button>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center">
                <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-stone-700">No Products Found</h3>
                <p className="text-xs text-stone-500 mt-1">Try adjusting your search query or category filters.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedSubcategory('All');
                    setProductSearch('');
                  }}
                  className="mt-4 px-4 py-1.5 rounded-lg text-xs font-bold bg-[#C59B27] text-white"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F0] text-stone-600 font-bold uppercase tracking-wider text-[10px] border-b border-[#E8DFC8]">
                    <tr>
                      <th className="py-3 px-4">Product Details</th>
                      <th className="py-3 px-3">Category & Subcategory</th>
                      <th className="py-3 px-3">Pricing</th>
                      <th className="py-3 px-3">Stock</th>
                      <th className="py-3 px-3">Rating</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-amber-50/30 transition-colors">
                        {/* Details */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images?.[0] || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908'}
                              alt={p.name}
                              className="w-12 h-12 rounded-lg object-cover border border-[#E8DFC8] flex-shrink-0"
                            />
                            <div className="min-w-0 max-w-xs sm:max-w-md">
                              <h4 className="font-bold text-[#1C1917] truncate hover:text-[#C59B27]" title={p.name}>
                                {p.name}
                              </h4>
                              <span className="text-[10px] text-stone-400 font-mono">{p.id}</span>
                              {p.isFeatured && (
                                <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                                  Featured
                                </span>
                              )}
                              {p.isBestseller && (
                                <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-800">
                                  Bestseller
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category & Sub */}
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="font-semibold text-stone-800">{p.category}</span>
                            <span className="text-[11px] text-[#A87D17]">{p.subcategory || 'Standard'}</span>
                          </div>
                        </td>

                        {/* Pricing */}
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-[#1C1917] text-sm">₹{p.price.toLocaleString('en-IN')}</span>
                            {p.originalPrice > p.price && (
                              <div className="flex items-center gap-1 text-[11px]">
                                <span className="text-stone-400 line-through">₹{p.originalPrice.toLocaleString('en-IN')}</span>
                                <span className="text-emerald-600 font-bold">({p.discountPercent}% OFF)</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Stock */}
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            p.stock > 10 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {p.stock} in stock
                          </span>
                        </td>

                        {/* Rating */}
                        <td className="py-3 px-3 text-stone-700">
                          <div className="flex items-center gap-1 font-bold">
                            <span className="text-amber-500">★</span> {p.rating}
                            <span className="text-[10px] text-stone-400 font-normal">({p.reviewCount || 1})</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/products/${p.id}`}
                              target="_blank"
                              className="p-1.5 text-stone-400 hover:text-[#C59B27] rounded-lg hover:bg-stone-100"
                              title="Preview on Store"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1.5 text-stone-600 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                              title="Edit Product"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingProduct(p)}
                              className="p-1.5 text-stone-600 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: OFFERS & COUPONS MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === 'offers' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1C1917]">Promotions & Discount Coupons</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Coupons added here can be immediately applied by customers at checkout and the cart drawer.
              </p>
            </div>
            <button
              onClick={() => {
                setOfferForm(initialOfferForm);
                setShowAddOfferModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#C59B27] text-white hover:bg-[#B3861B] transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Promo Code</span>
            </button>
          </div>

          {/* Offers Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.map(off => (
              <div 
                key={off.id}
                className={`bg-white rounded-2xl border transition-all p-5 shadow-sm relative overflow-hidden ${
                  off.isActive ? 'border-[#C59B27]/60 hover:shadow-md' : 'border-stone-200 opacity-60'
                }`}
              >
                {/* Coupon Top Notch */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-extrabold px-3 py-1 bg-amber-50 text-[#9E7318] rounded-lg border border-[#E8DFC8]">
                      {off.code}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                      {off.discountPercent}% OFF
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleOffer(off)}
                      className={`text-xs px-2 py-0.5 rounded-full font-bold transition-all ${
                        off.isActive ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-stone-200 text-stone-600'
                      }`}
                      title="Toggle active status"
                    >
                      {off.isActive ? 'Active' : 'Disabled'}
                    </button>
                    <button
                      onClick={() => setDeletingOffer(off)}
                      className="p-1 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      title="Delete Offer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-[#1C1917] mb-1">{off.name}</h3>
                
                <div className="space-y-1 text-xs text-stone-600 mt-3 pt-3 border-t border-stone-100">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Min. Spend:</span>
                    <span className="font-medium">₹{Number(off.minOrder || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Valid Till:</span>
                    <span className="font-medium">{off.validTill || 'Permanent'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: RECENT ORDERS VIEW */}
      {/* ======================================================== */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-[#E8DFC8] shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1C1917]">Recent Customer Orders</h2>
              <p className="text-xs text-stone-500">Live order transactions received via customer checkout.</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {mockData.orders.length} Demo Records Available
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F0] text-stone-600 font-bold uppercase tracking-wider text-[10px] border-b border-[#E8DFC8]">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Items Summary</th>
                  <th className="py-3 px-3">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {mockData.orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-mono font-bold text-[#1C1917]">{ord.id}</td>
                    <td className="py-3 px-3 text-stone-500">{ord.date}</td>
                    <td className="py-3 px-3 font-medium text-stone-800">Amit Kumar (Royal Elite)</td>
                    <td className="py-3 px-3 text-stone-600 max-w-xs truncate">
                      {ord.items.map(i => i.name).join(', ')}
                    </td>
                    <td className="py-3 px-3 font-bold text-[#1C1917]">₹{ord.total.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ======================================================== */}
      {(showAddProductModal || editingProduct) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#DFBC77] shadow-2xl p-6 my-8 overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC8]">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                  {editingProduct ? 'Edit Luxury Product' : 'Add New Luxury Product'}
                </h3>
                <p className="text-xs text-stone-500">
                  Fill in product details. It will be immediately published to catalog.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddProductModal(false);
                  setEditingProduct(null);
                }}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1 py-4 text-xs">
              {/* Product Title */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 22K Solid Gold Peacock Jhumkas"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E8DFC8] bg-[#FDFBF7] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                />
              </div>

              {/* Category & Subcategory Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => handleCategoryChangeInForm(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8DFC8] bg-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                  >
                    <option value="Jewellery">Jewellery</option>
                    <option value="Makeup">Makeup</option>
                    <option value="Nails">Nails</option>
                    <option value="Candles">Candles</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Subcategory *</label>
                  <select
                    value={productForm.subcategory}
                    onChange={(e) => setProductForm({ ...productForm, subcategory: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E8DFC8] bg-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                  >
                    {(subcategoriesMap[productForm.category] || []).map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="24500"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E8DFC8] bg-[#FDFBF7] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    placeholder="28000"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E8DFC8] bg-[#FDFBF7] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    placeholder="20"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E8DFC8] bg-[#FDFBF7] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                  />
                </div>
              </div>

              {/* Image URL & Quick Sample Presets */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">High-Res Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="flex-1 p-2.5 rounded-xl border border-[#E8DFC8] bg-[#FDFBF7] text-xs focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                  />
                  {productForm.image && (
                    <img
                      src={productForm.image}
                      alt="Preview"
                      className="w-10 h-10 rounded-lg object-cover border border-[#E8DFC8]"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                </div>
                {/* Sample Preset buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-none">
                  <span className="text-[10px] text-stone-400 flex-shrink-0">Sample Presets:</span>
                  {sampleImages.map(img => (
                    <button
                      type="button"
                      key={img.label}
                      onClick={() => setProductForm({ ...productForm, image: img.url })}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-stone-100 hover:bg-amber-100 text-stone-700 whitespace-nowrap"
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Product Description</label>
                <textarea
                  rows={3}
                  placeholder="Artisan-crafted 22K BIS Hallmarked gold with exquisite craftsmanship..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E8DFC8] bg-[#FDFBF7] text-xs focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                />
              </div>

              {/* Badges toggles */}
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-[#C59B27] rounded"
                  />
                  <span>Mark as Featured Product</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={productForm.isBestseller}
                    onChange={(e) => setProductForm({ ...productForm, isBestseller: e.target.checked })}
                    className="w-4 h-4 text-[#C59B27] rounded"
                  />
                  <span>Mark as Bestseller</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8DFC8]">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddProductModal(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B3861B] text-white font-bold text-xs hover:shadow-md transition-all shadow-sm"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD OFFER */}
      {/* ======================================================== */}
      {showAddOfferModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#DFBC77] shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC8]">
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">Create Promo Offer</h3>
              <button onClick={() => setShowAddOfferModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOfferSubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE25"
                  value={offerForm.code}
                  onChange={(e) => setOfferForm({ ...offerForm, code: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 rounded-xl border border-[#E8DFC8] bg-[#FDFBF7] font-mono font-bold uppercase tracking-wider text-sm focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Offer Title / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Grand Festive 25% Off"
                  value={offerForm.name}
                  onChange={(e) => setOfferForm({ ...offerForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E8DFC8] bg-[#FDFBF7] text-xs focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Discount % *</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    required
                    placeholder="25"
                    value={offerForm.discountPercent}
                    onChange={(e) => setOfferForm({ ...offerForm, discountPercent: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E8DFC8] bg-[#FDFBF7] text-xs focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Min. Order (₹)</label>
                  <input
                    type="number"
                    placeholder="1999"
                    value={offerForm.minOrder}
                    onChange={(e) => setOfferForm({ ...offerForm, minOrder: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E8DFC8] bg-[#FDFBF7] text-xs focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Valid Till Date</label>
                <input
                  type="date"
                  value={offerForm.validTill}
                  onChange={(e) => setOfferForm({ ...offerForm, validTill: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E8DFC8] bg-white text-xs focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8DFC8]">
                <button
                  type="button"
                  onClick={() => setShowAddOfferModal(false)}
                  className="px-4 py-2 text-stone-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#C59B27] text-white font-bold hover:bg-[#B3861B]"
                >
                  Activate Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CONFIRMATION: DELETE PRODUCT */}
      {/* ======================================================== */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-stone-200 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[#1C1917]">Delete this product?</h4>
            <p className="text-xs text-stone-500 mt-1 mb-4">
              "{deletingProduct.name}" will be permanently removed from all category displays and store listings.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProduct}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CONFIRMATION: DELETE OFFER */}
      {/* ======================================================== */}
      {deletingOffer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-stone-200 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[#1C1917]">Remove offer coupon?</h4>
            <p className="text-xs text-stone-500 mt-1 mb-4">
              Promo code "{deletingOffer.code}" will no longer be accepted in customer checkout.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setDeletingOffer(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteOffer}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700"
              >
                Yes, Remove Offer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
