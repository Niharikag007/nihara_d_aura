import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Star, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

export default function QuickViewModal({ product, isOpen, onClose }) {
  const { addToCart, setIsDrawerOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || 'Standard');
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'Standard Size');
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  // Sync state when product changes
  useEffect(() => {
    if (product) {
      setActiveImageIdx(0);
      setSelectedVariant(product.variants?.[0] || 'Standard');
      setSelectedSize(product.sizes?.[0] || 'Standard Size');
      setQuantity(1);
      setImgError(false);
    }
  }, [product]);

  // Handle escape key and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const isFavorited = isInWishlist(product.id);
  const fallbackImg = '/hero-slide-1.jpg';
  const displayImage = imgError 
    ? fallbackImg 
    : (product.images?.[activeImageIdx] || product.images?.[0] || fallbackImg);

  const cleanCategoryLabel = (() => {
    if (!product.subcategory || product.subcategory.toLowerCase().startsWith('all') || product.subcategory.toLowerCase() === product.category?.toLowerCase()) {
      return product.category;
    }
    return `${product.category} • ${product.subcategory}`;
  })();

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant, selectedSize);
    showToast(`${quantity}x ${product.name} added to your bag`, 'success');
  };

  const handleAddAndOpenDrawer = () => {
    addToCart(product, quantity, selectedVariant, selectedSize);
    showToast(`${quantity}x ${product.name} added to your bag`, 'success');
    onClose();
    setIsDrawerOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-6">
        <div 
          className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-[#DFBC77]/50 overflow-hidden transform transition-all animate-scale-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-stone-100/90 text-stone-600 hover:text-stone-900 hover:bg-[#F4ECE1] flex items-center justify-center transition-colors"
            aria-label="Close Quick View"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left: Product Images */}
            <div className="p-6 bg-[#FBF8F2] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E8DFC8]">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-[#E8DFC8] shadow-sm">
                {product.discountPercent > 0 && (
                  <span className="absolute top-3 left-3 z-10 bg-[#C59B27] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
                    {product.discountPercent}% OFF
                  </span>
                )}

                <img
                  src={displayImage}
                  alt={product.name}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover object-center transition-transform duration-500"
                />
              </div>

              {/* Thumbnails if multiple images exist */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1 scrollbar-none">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveImageIdx(idx);
                        setImgError(false);
                      }}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                        activeImageIdx === idx ? 'border-[#C59B27] shadow' : 'border-stone-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Authenticity Perks */}
              <div className="mt-4 pt-3 border-t border-[#E8DFC8] grid grid-cols-2 gap-2 text-[10px] text-stone-600">
                <div className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>100% Certified Authentic</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Truck className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Complimentary Shipping</span>
                </div>
              </div>
            </div>

            {/* Right: Product Details & Actions */}
            <div className="p-6 sm:p-7 flex flex-col justify-between space-y-4">
              <div>
                {/* Category & Badge */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A87D17] bg-[#FCF9F2] px-2.5 py-0.5 rounded-full border border-[#DFBC77]/40 truncate">
                    {cleanCategoryLabel}
                  </span>
                  {product.isBestseller && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Bestseller
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917] leading-snug">
                  {product.name}
                </h3>

                {/* Rating & Stock */}
                <div className="flex items-center gap-2.5 mt-2">
                  <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                    <span className="text-xs font-bold text-stone-900">{product.rating || '4.9'}</span>
                  </div>
                  <span className="text-xs text-stone-400">
                    ({product.reviewCount || 42} reviews)
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    In Stock
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2.5 mt-3 pt-2 border-t border-stone-100">
                  <span className="text-2xl font-bold text-[#1C1917]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-stone-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                {/* Short Description */}
                <p className="text-xs text-stone-600 mt-2.5 line-clamp-2 leading-relaxed">
                  {product.description || "Artisan handcrafted creation from Nihara D'Aura Haute Luxury collection."}
                </p>

                {/* Variant Selector */}
                {product.variants && product.variants.length > 1 && (
                  <div className="mt-3 space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
                      Edition / Shade: <span className="text-[#855F14]">{selectedVariant}</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {product.variants.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                            selectedVariant === v
                              ? 'bg-[#C59B27] text-white shadow-sm font-semibold'
                              : 'bg-stone-50 text-stone-700 border border-stone-200 hover:border-[#DFBC77]'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700">Quantity:</span>
                  <div className="flex items-center border border-[#DFBC77]/60 rounded-full overflow-hidden bg-[#FCF9F2]">
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-3 py-1 text-xs text-[#855F14] hover:bg-[#EAD7AD] font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold text-[#1C1917]">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(q => q + 1)}
                      className="px-3 py-1 text-xs text-[#855F14] hover:bg-[#EAD7AD] font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions Row */}
              <div className="pt-3 border-t border-stone-100 space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddAndOpenDrawer}
                    className="flex-1 btn-gold py-2.5 rounded-full text-xs uppercase tracking-wider font-bold shadow-md flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="w-10 h-10 rounded-full border border-[#DFBC77] bg-[#FCF9F2] text-[#855F14] hover:bg-[#C59B27] hover:text-white flex items-center justify-center transition-colors shadow-sm flex-shrink-0"
                    title={isFavorited ? 'Remove from Wishlist' : 'Save to Wishlist'}
                    aria-label="Toggle wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#C59B27] text-[#C59B27]' : ''}`} />
                  </button>
                </div>

                <Link
                  to={`/products/${product.id}`}
                  onClick={onClose}
                  className="w-full text-center text-xs font-semibold text-[#855F14] hover:text-[#523A0B] py-1 flex items-center justify-center gap-1 transition-colors"
                >
                  <span>View Full Product Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
