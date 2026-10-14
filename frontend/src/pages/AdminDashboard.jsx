import React, { useState, useMemo, useEffect } from 'react';
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
  SlidersHorizontal,
  Grid,
  List,
  Clock,
  User,
  Phone,
  MapPin,
  Scissors,
  Copy,
  ChevronDown,
  ArrowUpRight,
  BarChart3,
  Award,
  CircleDot
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useOffers } from '../context/OffersContext';
import { useToast } from '../context/ToastContext';
import { mockData } from '../services/mockData';

export default function AdminDashboard() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { offers, addOffer, deleteOffer, toggleOffer } = useOffers();
  const { showToast } = useToast();

  // Active Main Navigation Tab
  // 'overview' | 'products' | 'bookings' | 'orders' | 'offers'
  const [activeTab, setActiveTab] = useState('overview');

  // Real-time Clock display
  const [currentDateTime, setCurrentDateTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Product View & Filter State
  const [productViewMode, setProductViewMode] = useState('table'); // 'table' | 'grid'
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'in_stock' | 'low_stock'

  // Salon Bookings State (Loaded from mockData with local update capability)
  const [bookingsList, setBookingsList] = useState(() => {
    try {
      const saved = localStorage.getItem('nihara_admin_bookings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return mockData.bookings || [];
  });
  const [bookingStatusFilter, setBookingStatusFilter] = useState('All');

  // Customer Orders State (Loaded from mockData with local update capability)
  const [ordersList, setOrdersList] = useState(() => {
    try {
      const saved = localStorage.getItem('nihara_admin_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return mockData.orders || [];
  });
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

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
      if (stockFilter === 'low_stock' && (p.stock || 0) > 5) {
        return false;
      }
      if (stockFilter === 'in_stock' && (p.stock || 0) <= 0) {
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
  }, [products, selectedCategory, selectedSubcategory, stockFilter, productSearch]);

  // Filtering Bookings
  const filteredBookings = useMemo(() => {
    return bookingsList.filter(b => {
      if (bookingStatusFilter === 'All') return true;
      return b.status.toLowerCase() === bookingStatusFilter.toLowerCase();
    });
  }, [bookingsList, bookingStatusFilter]);

  // Filtering Orders
  const filteredOrders = useMemo(() => {
    return ordersList.filter(o => {
      if (orderStatusFilter === 'All') return true;
      return o.status.toLowerCase() === orderStatusFilter.toLowerCase();
    });
  }, [ordersList, orderStatusFilter]);

  // Metrics Calculation
  const totalValuation = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.price * (p.stock || 1)), 0);
  }, [products]);

  const activeOffersCount = useMemo(() => {
    return offers.filter(o => o.isActive).length;
  }, [offers]);

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
      image: prod.images?.[0] || prod.image || '',
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
      showToast(res.message || 'Offer coupon published!', 'success');
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
      showToast(res.message || 'Offer deleted', 'success');
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

  // Update Booking Status
  const handleUpdateBookingStatus = (bookingId, newStatus) => {
    const updated = bookingsList.map(b => b.id === bookingId ? { ...b, status: newStatus } : b);
    setBookingsList(updated);
    try {
      localStorage.setItem('nihara_admin_bookings', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    showToast(`Appointment status updated to ${newStatus}`, 'success');
  };

  // Update Order Status
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updated = ordersList.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setOrdersList(updated);
    try {
      localStorage.setItem('nihara_admin_orders', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    showToast(`Order status updated to ${newStatus}`, 'success');
  };

  // Copy Promo Code to Clipboard
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    showToast(`Coupon code "${code}" copied to clipboard!`, 'info');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] pb-16 font-sans">
      
      {/* ======================================================== */}
      {/* 👑 EXECUTIVE ROYAL TOPBAR */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E8DFC8] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Brand & Status Pill */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#C59B27] to-[#855F14] flex items-center justify-center text-white shadow-md shadow-amber-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif font-black text-lg tracking-tight text-[#1C1917]">
                    Nihara <span className="text-[#C59B27] italic font-serif">D'Aura</span>
                  </h1>
                  <span className="hidden md:inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-amber-100 text-[#855F14] border border-amber-200">
                    Console v2.4
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-stone-500">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-medium text-emerald-700">Live Sync Active</span>
                  <span className="text-stone-300">•</span>
                  <span>{currentDateTime}</span>
                </div>
              </div>
            </div>

            {/* Mobile Store Link */}
            <Link
              to="/products"
              className="sm:hidden p-2 rounded-xl border border-[#E8DFC8] text-stone-600 hover:text-[#C59B27]"
              title="View Store"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <Link
              to="/products"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-stone-50 border border-[#E8DFC8] text-stone-700 hover:border-[#C59B27] hover:text-[#855F14] transition-all shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Storefront</span>
            </Link>

            <button
              onClick={() => {
                setOfferForm(initialOfferForm);
                setShowAddOfferModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-50 border border-amber-300 text-[#855F14] hover:bg-amber-100 transition-all shadow-sm"
            >
              <Percent className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>New Coupon</span>
            </button>

            <button
              onClick={() => {
                setProductForm(initialProductForm);
                setShowAddProductModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#A87D17] text-white hover:shadow-md hover:brightness-105 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>

        </div>
      </header>

      {/* ======================================================== */}
      {/* 🧭 NAVIGATION TABS BAR */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-1.5 border border-[#E8DFC8] shadow-sm flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#1C1917] text-[#DFBC77] shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Executive Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-[#1C1917] text-[#DFBC77] shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Catalog</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeTab === 'products' ? 'bg-[#DFBC77]/20 text-[#DFBC77]' : 'bg-stone-200 text-stone-700'
            }`}>
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'bg-[#1C1917] text-[#DFBC77] shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>Salon Appointments</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeTab === 'bookings' ? 'bg-[#DFBC77]/20 text-[#DFBC77]' : 'bg-stone-200 text-stone-700'
            }`}>
              {bookingsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[#1C1917] text-[#DFBC77] shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Orders</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeTab === 'orders' ? 'bg-[#DFBC77]/20 text-[#DFBC77]' : 'bg-stone-200 text-stone-700'
            }`}>
              {ordersList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'offers'
                ? 'bg-[#1C1917] text-[#DFBC77] shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>VIP Offers & Coupons</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeTab === 'offers' ? 'bg-[#DFBC77]/20 text-[#DFBC77]' : 'bg-stone-200 text-stone-700'
            }`}>
              {offers.length}
            </span>
          </button>

        </div>
      </div>

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA */}
      {/* ======================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* ======================================================== */}
        {/* TAB 1: EXECUTIVE OVERVIEW & ANALYTICS */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* 4 Grand KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Total Valuation */}
              <div className="bg-gradient-to-br from-white to-[#FCF9F2] p-5 rounded-2xl border border-[#DFBC77]/60 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
                    Catalog Inventory Value
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-[#C59B27] flex items-center justify-center">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-black text-[#1C1917]">
                  ₹{(totalValuation / 100000).toFixed(2)} Lakh
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-700 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+14.8% vs last month</span>
                </div>
                <div className="mt-3 w-full bg-amber-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#D4AF37] to-[#855F14] h-full w-[78%] rounded-full"></div>
                </div>
              </div>

              {/* Card 2: Catalog Products */}
              <div className="bg-gradient-to-br from-white to-[#FCF9F2] p-5 rounded-2xl border border-[#DFBC77]/60 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
                    Live Products
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-black text-[#1C1917]">
                  {products.length} Items
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-stone-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>4 Luxury Categories • 18 Subcategories</span>
                </div>
                <div className="mt-3 w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full w-[94%] rounded-full"></div>
                </div>
              </div>

              {/* Card 3: Salon Appointments */}
              <div className="bg-gradient-to-br from-white to-[#FCF9F2] p-5 rounded-2xl border border-[#DFBC77]/60 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
                    Salon Appointments
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-black text-[#1C1917]">
                  {bookingsList.length} Bookings
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-purple-700 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Bridal Glow & Nail Art Active</span>
                </div>
                <div className="mt-3 w-full bg-purple-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full w-[85%] rounded-full"></div>
                </div>
              </div>

              {/* Card 4: Active Offers */}
              <div className="bg-gradient-to-br from-white to-[#FCF9F2] p-5 rounded-2xl border border-[#DFBC77]/60 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
                    VIP Promo Vouchers
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
                    <Percent className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-black text-[#1C1917]">
                  {activeOffersCount} / {offers.length} Active
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#C59B27] font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Redeemable at Checkout</span>
                </div>
                <div className="mt-3 w-full bg-rose-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full w-[100%] rounded-full"></div>
                </div>
              </div>

            </div>

            {/* Split Grid: Category Breakdown + Store Operations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Category Breakdown (2 Cols) */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E8DFC8] p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC8]/60 mb-5">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#1C1917]">Category Valuation & Inventory Distribution</h3>
                    <p className="text-xs text-stone-500">Real-time inventory valuation breakdown across luxury collections.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="text-xs font-bold text-[#C59B27] hover:underline flex items-center gap-1"
                  >
                    <span>Manage Catalog</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { name: '22K & 18K Real Gold & Diamond Jewellery', count: products.filter(p => p.category === 'Jewellery').length, percent: 58, color: 'from-[#D4AF37] to-[#855F14]' },
                    { name: 'High-Fashion Makeup & Formulations', count: products.filter(p => p.category === 'Makeup').length, percent: 20, color: 'from-rose-400 to-rose-600' },
                    { name: 'Luxury Press-On & Gel Nail Art Kits', count: products.filter(p => p.category === 'Nails').length, percent: 12, color: 'from-purple-400 to-purple-600' },
                    { name: 'Artisan Soy Candles & Home Fragrance', count: products.filter(p => p.category === 'Candles').length, percent: 10, color: 'from-amber-400 to-amber-600' }
                  ].map((cat) => (
                    <div key={cat.name} className="p-3.5 rounded-2xl bg-[#FCF9F2] border border-[#E8DFC8]/50">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-2">
                        <span className="flex items-center gap-2">
                          <CircleDot className="w-3.5 h-3.5 text-[#C59B27]" />
                          {cat.name}
                        </span>
                        <span>{cat.count} Items ({cat.percent}%)</span>
                      </div>
                      <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                        <div className={`bg-gradient-to-r ${cat.color} h-full rounded-full`} style={{ width: `${cat.percent}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Quicklinks Strip */}
                <div className="mt-6 pt-5 border-t border-[#E8DFC8]/60 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => {
                      setSelectedCategory('Jewellery');
                      setActiveTab('products');
                    }}
                    className="p-3 rounded-xl bg-stone-50 border border-stone-200 hover:border-[#C59B27] text-left transition-all"
                  >
                    <span className="text-[10px] font-bold uppercase text-stone-400 block">Jewellery</span>
                    <span className="text-sm font-bold text-[#1C1917]">View Collection →</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCategory('Makeup');
                      setActiveTab('products');
                    }}
                    className="p-3 rounded-xl bg-stone-50 border border-stone-200 hover:border-[#C59B27] text-left transition-all"
                  >
                    <span className="text-[10px] font-bold uppercase text-stone-400 block">Makeup</span>
                    <span className="text-sm font-bold text-[#1C1917]">View Collection →</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="p-3 rounded-xl bg-stone-50 border border-stone-200 hover:border-[#C59B27] text-left transition-all"
                  >
                    <span className="text-[10px] font-bold uppercase text-stone-400 block">Salon Appointments</span>
                    <span className="text-sm font-bold text-[#1C1917]">Review Bookings →</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('offers')}
                    className="p-3 rounded-xl bg-stone-50 border border-stone-200 hover:border-[#C59B27] text-left transition-all"
                  >
                    <span className="text-[10px] font-bold uppercase text-stone-400 block">Discounts</span>
                    <span className="text-sm font-bold text-[#1C1917]">Manage Coupons →</span>
                  </button>
                </div>
              </div>

              {/* Live Activity & Quick Actions (1 Col) */}
              <div className="space-y-6">
                
                {/* Executive Quick Actions */}
                <div className="bg-[#1C1917] text-white rounded-3xl p-6 shadow-md border border-amber-900/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#DFBC77]/10 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="p-1.5 rounded-lg bg-[#C59B27] text-white">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <h3 className="font-serif font-bold text-base text-[#DFBC77]">Master Quick Launch</h3>
                  </div>

                  <p className="text-xs text-stone-300 mb-4 leading-relaxed">
                    Direct access to product launches, promotional coupon generator, and customer bookings.
                  </p>

                  <div className="space-y-2.5">
                    <button
                      onClick={() => {
                        setProductForm(initialProductForm);
                        setShowAddProductModal(true);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B3861B] text-white text-xs font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Publish New Luxury Product</span>
                    </button>

                    <button
                      onClick={() => {
                        setOfferForm(initialOfferForm);
                        setShowAddOfferModal(true);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-stone-800 border border-stone-700 text-[#DFBC77] text-xs font-bold flex items-center justify-center gap-2 hover:bg-stone-700 transition-all"
                    >
                      <Percent className="w-4 h-4" />
                      <span>Issue VIP Promo Voucher</span>
                    </button>
                  </div>
                </div>

                {/* Recent System Activity Feed */}
                <div className="bg-white rounded-3xl border border-[#E8DFC8] p-5 shadow-sm">
                  <h4 className="font-serif font-bold text-sm text-[#1C1917] mb-3 flex items-center justify-between">
                    <span>Recent System Activity</span>
                    <span className="text-[10px] text-emerald-600 font-mono font-bold">LIVE FEED</span>
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></div>
                      <div>
                        <div className="font-semibold text-stone-900">Product Catalog Synchronized</div>
                        <div className="text-[11px] text-stone-500">{products.length} live products currently published.</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                      <div>
                        <div className="font-semibold text-stone-900">VIP Coupon 'GLOW20' Active</div>
                        <div className="text-[11px] text-stone-500">20% off live for orders above ₹3,999.</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                      <div>
                        <div className="font-semibold text-stone-900">Salon Booking Confirmed</div>
                        <div className="text-[11px] text-stone-500">Royal Bridal Glow Package scheduled.</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: PRODUCT CATALOG MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Control & Filter Suite */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E8DFC8] shadow-sm space-y-4">
              
              <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
                
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search products by title, SKU ID, category..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E8DFC8] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C59B27]/40 bg-[#FCF9F2]"
                  />
                  {productSearch && (
                    <button
                      onClick={() => setProductSearch('')}
                      className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* View Switcher & Stock Filter */}
                <div className="flex items-center gap-2 justify-between lg:justify-end">
                  
                  {/* Stock Filter Dropdown */}
                  <div className="flex items-center gap-1.5 bg-[#FCF9F2] px-3 py-1.5 rounded-xl border border-[#E8DFC8] text-xs">
                    <Filter className="w-3.5 h-3.5 text-[#C59B27]" />
                    <select
                      value={stockFilter}
                      onChange={(e) => setStockFilter(e.target.value)}
                      className="bg-transparent font-medium text-stone-700 focus:outline-none"
                    >
                      <option value="all">All Stock Status</option>
                      <option value="in_stock">In Stock (&gt;0)</option>
                      <option value="low_stock">Low Stock (≤5)</option>
                    </select>
                  </div>

                  {/* View Mode Switcher: Table vs Grid */}
                  <div className="flex items-center bg-[#FCF9F2] p-1 rounded-xl border border-[#E8DFC8]">
                    <button
                      onClick={() => setProductViewMode('table')}
                      className={`p-1.5 rounded-lg transition-all ${
                        productViewMode === 'table' ? 'bg-[#1C1917] text-[#DFBC77] shadow-sm' : 'text-stone-500 hover:text-stone-900'
                      }`}
                      title="Table View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setProductViewMode('grid')}
                      className={`p-1.5 rounded-lg transition-all ${
                        productViewMode === 'grid' ? 'bg-[#1C1917] text-[#DFBC77] shadow-sm' : 'text-stone-500 hover:text-stone-900'
                      }`}
                      title="Luxury Grid View"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add Product Button */}
                  <button
                    onClick={() => {
                      setProductForm(initialProductForm);
                      setShowAddProductModal(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#D4AF37] to-[#B3861B] text-white hover:brightness-105 shadow-sm whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Product</span>
                  </button>

                </div>

              </div>

              {/* Category Pills Strip */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
                {['All', 'Jewellery', 'Makeup', 'Nails', 'Candles'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSelectedSubcategory('All');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory.toLowerCase() === cat.toLowerCase()
                        ? 'bg-[#C59B27] text-white shadow-sm'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Subcategories (if selected) */}
              {selectedCategory !== 'All' && subcategoriesMap[selectedCategory] && (
                <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none bg-[#FCF9F2] p-2.5 rounded-xl border border-[#E8DFC8]/60">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#855F14] flex-shrink-0">
                    Subcategories:
                  </span>
                  <button
                    onClick={() => setSelectedSubcategory('All')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                      selectedSubcategory === 'All' ? 'bg-[#C59B27] text-white' : 'bg-white text-stone-600 border border-stone-200'
                    }`}
                  >
                    All {selectedCategory}
                  </button>
                  {subcategoriesMap[selectedCategory].map(sub => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubcategory(sub)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                        selectedSubcategory.toLowerCase() === sub.toLowerCase()
                          ? 'bg-[#C59B27] text-white'
                          : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}

            </div>

            {/* Results Count Summary */}
            <div className="flex items-center justify-between text-xs text-stone-500 px-1">
              <span>Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products</span>
              {(selectedCategory !== 'All' || selectedSubcategory !== 'All' || productSearch || stockFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedSubcategory('All');
                    setProductSearch('');
                    setStockFilter('all');
                  }}
                  className="text-[#C59B27] font-bold hover:underline"
                >
                  Reset all filters
                </button>
              )}
            </div>

            {/* Product List Content: TABLE VIEW */}
            {productViewMode === 'table' && (
              <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-sm overflow-hidden">
                {filteredProducts.length === 0 ? (
                  <div className="py-16 text-center">
                    <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                    <h4 className="font-serif text-lg font-bold text-stone-700">No Products Matched</h4>
                    <p className="text-xs text-stone-500 mt-1">Try clearing your search query or filters.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF7F0] text-stone-600 font-extrabold uppercase tracking-wider text-[10px] border-b border-[#E8DFC8]">
                        <tr>
                          <th className="py-3.5 px-4">Item Details</th>
                          <th className="py-3.5 px-3">Category</th>
                          <th className="py-3.5 px-3">Price & MRP</th>
                          <th className="py-3.5 px-3">Stock Health</th>
                          <th className="py-3.5 px-3">Badges</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-amber-50/30 transition-colors">
                            {/* Product Info */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.images?.[0] || p.image || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908'}
                                  alt={p.name}
                                  className="w-12 h-12 rounded-xl object-cover border border-[#E8DFC8] flex-shrink-0"
                                />
                                <div className="min-w-0 max-w-xs sm:max-w-md">
                                  <h4 className="font-bold text-[#1C1917] truncate hover:text-[#C59B27] text-xs sm:text-sm" title={p.name}>
                                    {p.name}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] text-stone-400 font-mono">{p.id}</span>
                                    <span className="text-[10px] text-amber-600 font-bold">★ {p.rating || 4.9}</span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3 px-3">
                              <span className="font-bold text-stone-800 block">{p.category}</span>
                              <span className="text-[10px] text-[#855F14]">{p.subcategory || 'Standard'}</span>
                            </td>

                            {/* Pricing */}
                            <td className="py-3 px-3">
                              <div className="font-bold text-[#1C1917] text-sm">₹{p.price.toLocaleString('en-IN')}</div>
                              {p.originalPrice > p.price && (
                                <div className="flex items-center gap-1 text-[10px]">
                                  <span className="text-stone-400 line-through">₹{p.originalPrice.toLocaleString('en-IN')}</span>
                                  <span className="text-emerald-600 font-bold">({p.discountPercent || Math.round(((p.originalPrice - p.price)/p.originalPrice)*100)}% off)</span>
                                </div>
                              )}
                            </td>

                            {/* Stock */}
                            <td className="py-3 px-3">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                (p.stock || 0) <= 5 
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${ (p.stock || 0) <= 5 ? 'bg-rose-500' : 'bg-emerald-500' }`}></span>
                                {p.stock || 20} Units
                              </span>
                            </td>

                            {/* Badges */}
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1 flex-wrap">
                                {p.isFeatured && (
                                  <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                                    Featured
                                  </span>
                                )}
                                {p.isBestseller && (
                                  <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                                    Bestseller
                                  </span>
                                )}
                                {!p.isFeatured && !p.isBestseller && (
                                  <span className="text-[10px] text-stone-400 font-mono">—</span>
                                )}
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
            )}

            {/* Product List Content: LUXURY GALLERY CARDS VIEW */}
            {productViewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((p) => (
                  <div 
                    key={p.id}
                    className="bg-white rounded-2xl border border-[#E8DFC8] overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
                  >
                    {/* Image with badges */}
                    <div className="relative aspect-square overflow-hidden bg-stone-100">
                      <img
                        src={p.images?.[0] || p.image || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908'}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {p.isFeatured && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-[#C59B27] text-white shadow-sm">
                            Featured
                          </span>
                        )}
                        {p.isBestseller && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-rose-600 text-white shadow-sm">
                            Bestseller
                          </span>
                        )}
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-black/60 text-white backdrop-blur-sm">
                          {p.stock} in stock
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-[#855F14] uppercase tracking-wider mb-0.5">
                          {p.category} • {p.subcategory || 'Luxury'}
                        </div>
                        <h4 className="font-serif font-bold text-sm text-[#1C1917] line-clamp-1 group-hover:text-[#C59B27] transition-colors" title={p.name}>
                          {p.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-bold text-base text-[#1C1917]">₹{p.price.toLocaleString('en-IN')}</span>
                          {p.originalPrice > p.price && (
                            <span className="text-xs text-stone-400 line-through">₹{p.originalPrice.toLocaleString('en-IN')}</span>
                          )}
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                        <Link
                          to={`/products/${p.id}`}
                          target="_blank"
                          className="text-[11px] font-bold text-stone-600 hover:text-[#C59B27] flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </Link>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-stone-600 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingProduct(p)}
                            className="p-1.5 text-stone-600 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: SALON APPOINTMENTS MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Header & Status Filter Bar */}
            <div className="bg-white p-5 rounded-3xl border border-[#E8DFC8] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">Salon Appointments & Bridal Bookings</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Manage client appointments, stylist assignments, and service schedules.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                {['All', 'Confirmed', 'Completed', 'Cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setBookingStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      bookingStatusFilter === st
                        ? 'bg-[#1C1917] text-[#DFBC77] shadow-sm'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Bookings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBookings.map((b) => (
                <div key={b.id} className="bg-white rounded-3xl border border-[#E8DFC8] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    {/* Top Status & Booking ID */}
                    <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-100">
                      <span className="font-mono text-xs font-bold text-stone-500">{b.bookingId || b.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        b.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'Completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    {/* Booking Title & Services */}
                    <h4 className="font-serif font-bold text-base text-[#1C1917] mt-3 mb-1">
                      {b.title}
                    </h4>
                    
                    {/* Details Badges */}
                    <div className="space-y-2 mt-3 text-xs text-stone-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#C59B27]" />
                        <span>{b.date} • {b.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-[#C59B27]" />
                        <span>Stylist: <strong className="text-stone-900">{b.artist || 'Assigned Senior Artist'}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#C59B27]" />
                        <span className="truncate">{b.location} ({b.address})</span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-stone-500">Service Fee:</span>
                      <span className="font-serif font-bold text-sm text-[#1C1917]">₹{b.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-stone-400">Update Status:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateBookingStatus(b.id, 'Confirmed')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          b.status === 'Confirmed' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-emerald-50'
                        }`}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleUpdateBookingStatus(b.id, 'Completed')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          b.status === 'Completed' ? 'bg-blue-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-blue-50'
                        }`}
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleUpdateBookingStatus(b.id, 'Cancelled')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          b.status === 'Cancelled' ? 'bg-rose-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-rose-50'
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: CUSTOMER ORDERS VIEW */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            
            <div className="bg-white p-5 rounded-3xl border border-[#E8DFC8] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">Live Customer Orders & Fulfillment</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Track real-time checkout purchases, delivery addresses, and payment methods.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                {['All', 'Processing', 'Delivered', 'Cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      orderStatusFilter === st
                        ? 'bg-[#1C1917] text-[#DFBC77] shadow-sm'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredOrders.map((ord) => (
                <div key={ord.id} className="bg-white rounded-3xl border border-[#E8DFC8] p-5 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div>
                      <span className="font-mono font-bold text-xs text-[#1C1917]">{ord.orderId || ord.id}</span>
                      <span className="text-[11px] text-stone-400 block">{ord.placedDate || 'Oct 14, 2026'}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      ord.status === 'Delivered' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ord.status}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="py-3 space-y-2 border-b border-stone-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Ordered Items:</span>
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs">
                        <img 
                          src={item.image || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348'} 
                          alt={item.name} 
                          className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-stone-800 truncate">{item.name}</div>
                          <div className="text-[11px] text-stone-500">₹{item.price.toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer details */}
                  <div className="py-3 text-xs space-y-1.5 border-b border-stone-100">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Payment:</span>
                      <span className="font-medium text-stone-800">{ord.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Shipping:</span>
                      <span className="font-medium text-stone-800 text-right max-w-xs truncate">{ord.shippingAddress}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm pt-1">
                      <span>Total Amount:</span>
                      <span className="text-[#C59B27]">₹{ord.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-stone-400">Fulfillment Status:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, 'Processing')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          ord.status === 'Processing' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        Processing
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, 'Delivered')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          ord.status === 'Delivered' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        Delivered
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: OFFERS & VIP COUPONS */}
        {/* ======================================================== */}
        {activeTab === 'offers' && (
          <div className="space-y-6 animate-fade-in">
            
            <div className="bg-white p-5 rounded-3xl border border-[#E8DFC8] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">Promotional Offers & VIP Discount Vouchers</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Coupons active here are instantly accepted at customer cart & checkout with validation.
                </p>
              </div>

              <button
                onClick={() => {
                  setOfferForm(initialOfferForm);
                  setShowAddOfferModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#C59B27] text-white hover:bg-[#855F14] transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Coupon</span>
              </button>
            </div>

            {/* Offers Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {offers.map(off => (
                <div 
                  key={off.id}
                  className={`bg-white rounded-3xl border p-5 shadow-sm relative overflow-hidden transition-all flex flex-col justify-between ${
                    off.isActive 
                      ? 'border-[#DFBC77] hover:shadow-md' 
                      : 'border-stone-200 opacity-60'
                  }`}
                >
                  <div>
                    {/* Voucher Header with Coupon Cut Notch */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyCode(off.code)}
                          className="font-mono text-sm sm:text-base font-black px-3 py-1 bg-amber-50 text-[#855F14] rounded-xl border border-dashed border-[#C59B27] flex items-center gap-1.5 hover:bg-amber-100 transition-colors"
                          title="Click to copy code"
                        >
                          <span>{off.code}</span>
                          <Copy className="w-3.5 h-3.5 text-stone-400" />
                        </button>
                        <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-100 text-emerald-800">
                          {off.discountPercent}% OFF
                        </span>
                      </div>

                      {/* Toggle & Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleOffer(off)}
                          className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all ${
                            off.isActive 
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' 
                              : 'bg-stone-100 text-stone-500'
                          }`}
                        >
                          {off.isActive ? 'Active' : 'Disabled'}
                        </button>
                        <button
                          onClick={() => setDeletingOffer(off)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-serif font-bold text-sm text-[#1C1917] mt-2 mb-1">{off.name}</h4>
                    
                    <div className="space-y-1.5 text-xs text-stone-600 mt-3 pt-3 border-t border-stone-100">
                      <div className="flex justify-between">
                        <span className="text-stone-400">Minimum Order:</span>
                        <span className="font-semibold text-stone-800">₹{Number(off.minOrder || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Validity:</span>
                        <span className="font-semibold text-stone-800">{off.validTill || 'Permanent Active'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                      <Check className="w-3.5 h-3.5" /> Client Verified
                    </span>
                    <button
                      onClick={() => handleCopyCode(off.code)}
                      className="text-[#C59B27] font-bold hover:underline"
                    >
                      Copy Voucher
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

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
                <p className="text-xs text-stone-500 mt-0.5">
                  Instant publishing to storefront catalog with royal formatting.
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
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">Create VIP Promo Coupon</h3>
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
                  <label className="block font-bold text-stone-700 mb-1">Min. Spend (₹)</label>
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

              {/* Real-time Coupon Card Preview */}
              <div className="p-3 rounded-2xl bg-[#FCF9F2] border border-dashed border-[#C59B27] text-center">
                <span className="text-[10px] text-stone-400 uppercase font-bold block mb-1">Live Voucher Preview</span>
                <span className="font-mono font-black text-sm text-[#855F14]">{offerForm.code || 'COUPON_CODE'}</span>
                <span className="text-xs text-stone-600 block mt-0.5">{offerForm.name || 'Special Promotional Discount'}</span>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {offerForm.discountPercent || 20}% OFF on min ₹{offerForm.minOrder || 1999}
                </span>
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
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B3861B] text-white font-bold hover:brightness-105"
                >
                  Publish Voucher
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
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-stone-200 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#1C1917]">Delete this product?</h4>
            <p className="text-xs text-stone-500 mt-1 mb-5">
              "{deletingProduct.name}" will be removed from all category displays and store listings.
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
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
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
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-stone-200 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#1C1917]">Remove offer coupon?</h4>
            <p className="text-xs text-stone-500 mt-1 mb-5">
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
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
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
