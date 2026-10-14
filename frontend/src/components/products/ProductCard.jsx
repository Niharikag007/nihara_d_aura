import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import QuickViewModal from './QuickViewModal';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isFavorited = isInWishlist(product.id);

  // Clean, non-repetitive category label
  const categoryLabel = useMemo(() => {
    if (!product.category) return 'Luxury';
    if (!product.subcategory || 
        product.subcategory.toLowerCase().startsWith('all') || 
        product.subcategory.toLowerCase() === product.category.toLowerCase()) {
      return product.category;
    }
    return `${product.category} • ${product.subcategory}`;
  }, [product.category, product.subcategory]);

  const fallbackImg = '/hero-slide-1.jpg';
  const displayImage = imgError 
    ? fallbackImg 
    : (product.images?.[0] || fallbackImg);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.variants?.[0] || 'Standard');
    showToast(`${product.name} added to bag`, 'success');
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    showToast(isFavorited ? `Removed from Wishlist` : `Saved to Wishlist`, 'info');
  };

  const handleQuickViewOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div className="group bg-white rounded-2xl border border-[#DFBC77]/35 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#C59B27]/70 transition-all duration-300 flex flex-col justify-between will-change-transform transform-gpu hover:-translate-y-1">
        
        {/* Top Media Area */}
        <div className="relative aspect-square overflow-hidden bg-[#FBF8F2]">
          <Link to={`/products/${product.id}`} className="block w-full h-full">
            {/* Product Image with smooth hover scale */}
            <img
              src={displayImage}
              alt={product.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out will-change-transform"
              loading="lazy"
              decoding="async"
            />
          </Link>

          {/* Discount Badge */}
          {product.discountPercent > 0 && (
            <span className="absolute top-2.5 left-2.5 z-10 bg-[#C59B27] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow pointer-events-none">
              {product.discountPercent}% OFF
            </span>
          )}

          {/* Wishlist Heart Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2.5 right-2.5 z-10 w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-sm border border-[#E8DFC8]/60 flex items-center justify-center shadow hover:scale-110 active:scale-95 transition-transform"
            aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
            title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart 
              className={`w-4 h-4 transition-colors ${
                isFavorited ? 'fill-[#C59B27] text-[#C59B27]' : 'text-stone-500 hover:text-[#C59B27]'
              }`} 
            />
          </button>

          {/* Quick View Button (revealed on desktop hover, accessible via subtle button on mobile) */}
          <div className="absolute inset-x-3 bottom-3 z-10 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
            <button
              onClick={handleQuickViewOpen}
              className="w-full py-2 px-3 rounded-xl bg-white/95 backdrop-blur-md text-[#1C1917] hover:text-[#C59B27] hover:bg-white text-xs font-bold uppercase tracking-wider shadow-lg border border-[#DFBC77]/60 flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
            >
              <Eye className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Quick View</span>
            </button>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
          <div>
            {/* Clean Category Label */}
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A87D17] block mb-1 truncate">
              {categoryLabel}
            </span>

            {/* Title */}
            <Link to={`/products/${product.id}`} className="block">
              <h3 className="font-serif text-xs sm:text-sm font-semibold text-[#1C1917] line-clamp-1 group-hover:text-[#C59B27] transition-colors">
                {product.name}
              </h3>
            </Link>

            {/* Ratings */}
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </div>
              <span className="text-xs font-semibold text-stone-800">{product.rating || '4.9'}</span>
              <span className="text-[11px] text-stone-400">({product.reviewCount || 38})</span>
            </div>
          </div>

          {/* Price & Add to Bag Row */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-stone-100 gap-2">
            <div className="flex flex-col min-w-0">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-xs sm:text-sm font-bold text-[#1C1917]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-[11px] text-stone-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FCF9F2] border border-[#DFBC77] text-[#855F14] hover:bg-[#C59B27] hover:text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm flex-shrink-0"
              title="Add to shopping bag"
              aria-label={`Add ${product.name} to shopping bag`}
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}

