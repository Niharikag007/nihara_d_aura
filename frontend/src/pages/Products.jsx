import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, Sparkles, X } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';

export default function Products() {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  const subcategoryParam = searchParams.get('subcategory') || 'All';
  const searchParam = searchParams.get('search') || '';

  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [activeSubcategory, setActiveSubcategory] = useState(subcategoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [sortBy, setSortBy] = useState('featured');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Sync category & subcategory params
  useEffect(() => {
    if (categoryParam) setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    if (subcategoryParam) setActiveSubcategory(subcategoryParam);
    else setActiveSubcategory('All');
  }, [subcategoryParam]);

  useEffect(() => {
    if (searchParam) setSearchQuery(searchParam);
  }, [searchParam]);

  const categories = ['All', 'Jewellery', 'Makeup', 'Nails', 'Candles'];

  const subcategoriesMap = {
    Jewellery: ['All Jewellery', 'Gold Earrings & Jhumkas', 'Bridal Haar & Sets', 'Gold Lockets & Pendants', 'Temple Gold Bangles', 'Gold Rings & Bands', 'Rose Gold Chokers'],
    Makeup: ['All Makeup', 'Face Foundations', 'Lipsticks & Gloss', 'Eyeshadow Palettes', 'Blushes & Highlighters'],
    Nails: ['All Nails', 'Press-On Kits', 'Gel Lacquer', 'Chrome Nail Art', 'Cuticle Elixirs'],
    Candles: ['All Candles', 'Soy Wax Jar Candles', 'Reed Diffusers', 'Aroma Room Sprays', 'Wax Melts']
  };

  // Determine subcategories for currently active category
  const availableSubcategories = activeCategory === 'All'
    ? []
    : (subcategoriesMap[Object.keys(subcategoriesMap).find(k => k.toLowerCase() === activeCategory.toLowerCase())] || []);

  // Filtering & Sorting
  let filtered = products.filter((p) => {
    // Category filter
    if (activeCategory.toLowerCase() !== 'all' && 
        p.category.toLowerCase() !== activeCategory.toLowerCase() &&
        p.categorySlug.toLowerCase() !== activeCategory.toLowerCase()) {
      return false;
    }
    // Subcategory filter
    if (activeSubcategory && 
        !activeSubcategory.toLowerCase().startsWith('all') &&
        p.subcategory &&
        p.subcategory.toLowerCase() !== activeSubcategory.toLowerCase()) {
      return false;
    }
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchSub = p.subcategory?.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchSub && !matchDesc) return false;
    }
    // Price filters
    if (minPrice && p.price < Number(minPrice)) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;

    return true;
  });

  // Sorting
  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    setActiveSubcategory('All');
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
      newParams.delete('subcategory');
    } else {
      newParams.set('category', cat);
      newParams.delete('subcategory');
    }
    setSearchParams(newParams);
  };

  const handleSubcategorySelect = (sub) => {
    setActiveSubcategory(sub);
    const newParams = new URLSearchParams(searchParams);
    if (sub.startsWith('All')) {
      newParams.delete('subcategory');
    } else {
      newParams.set('subcategory', sub);
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setActiveCategory('All');
    setActiveSubcategory('All');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-transparent py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Title & Search Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
            {activeCategory === 'All' ? 'All Products' : `${activeCategory} Collection`}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {filtered.length} Items Found {activeSubcategory && !activeSubcategory.startsWith('All') ? `in "${activeSubcategory}"` : ''}
          </p>
        </div>

        {/* Search Input matching APK bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Search products, lipstick, candles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-full border border-[#DFBC77]/60 bg-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#C59B27] shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills & Sort Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#A67C37] text-white shadow-sm'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-[#DFBC77]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-white border border-stone-200 rounded-lg px-3 py-1.5 shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured / Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating: High to Low</option>
            </select>
          </div>

          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1 transition-all ${
              minPrice || maxPrice
                ? 'bg-amber-100 border-[#C59B27] text-amber-900 font-bold'
                : 'bg-white border-stone-200 text-stone-600 hover:border-[#DFBC77]'
            }`}
            title="Price Filter"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Subcategory Pills Navigation Bar (Appears when active Category is selected) */}
      {availableSubcategories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto py-3 mb-2 scrollbar-none border-b border-stone-100 bg-white/50 px-2 rounded-xl mt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A87D17] flex-shrink-0 mr-1">
            Subcategories:
          </span>
          {availableSubcategories.map((sub) => {
            const isSubActive = activeSubcategory.toLowerCase() === sub.toLowerCase() || 
              (sub.startsWith('All') && (!activeSubcategory || activeSubcategory.toLowerCase() === 'all'));
            return (
              <button
                key={sub}
                onClick={() => handleSubcategorySelect(sub)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isSubActive
                    ? 'bg-[#C59B27] text-white shadow-sm font-bold'
                    : 'bg-[#FCF9F2] text-stone-700 border border-[#DFBC77]/50 hover:bg-amber-100/60'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      )}

      {/* Filter Drawer / Accordion */}
      {filterDrawerOpen && (
        <div className="bg-white p-4 rounded-2xl border border-[#DFBC77]/50 mt-4 mb-6 shadow-sm flex flex-wrap items-center gap-4 text-xs animate-fade-in">
          <span className="font-bold text-stone-700">Price Range (₹):</span>
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-28 p-2 border border-stone-200 rounded-lg"
          />
          <span>to</span>
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-28 p-2 border border-stone-200 rounded-lg"
          />
          <button
            onClick={handleClearFilters}
            className="text-stone-500 hover:text-red-600 underline ml-auto"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#DFBC77]/40 shadow-sm mt-6 p-8 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#FCF9F2] border border-[#DFBC77]/50 flex items-center justify-center mx-auto mb-4 text-[#C59B27] shadow-inner">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#1C1917]">No Treasures Match Your Search</h3>
          <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
            Try adjusting your search keywords, clearing price limits, or exploring all royal collections.
          </p>
          <button
            onClick={handleClearFilters}
            className="btn-gold mt-6 px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold shadow-md"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 sm:gap-5 pt-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
