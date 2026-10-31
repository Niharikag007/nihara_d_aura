import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import QuickViewModal from './QuickViewModal';
import { ARTIFICIAL_JEWELLERY, isArtificialJewellery } from '../../data/jewelleryCategories';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isFavorited = isInWishlist(product.id);

  // Clean, non-repetitive category label
  const categoryLabel = useMemo(() => {
    if (isArtificialJewellery(product)) return ARTIFICIAL_JEWELLERY.name;
    if (!product.category) return 'Luxury';
    if (!product.subcategory || 
        product.subcategory.toLowerCase().startsWith('all') || 
        product.subcategory.toLowerCase() === product.category.toLowerCase()) {
      return product.category;
    }
    return `${product.category} • ${product.subcategory}`;
  }, [product]);

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
      <div className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#DFBC77]/40 bg-white shadow-[0_14px_32px_-24px_rgba(88,64,22,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C59B27]/75 hover:shadow-[0_24px_42px_-24px_rgba(88,64,22,0.6)] will-change-transform transform-gpu">
        <div className="relative aspect-square overflow-hidden bg-[#FBF8F2]">
          <Link to={`/products/${product.id}`} className="block w-full h-full">
            <img
              src={displayImage}
              alt={product.name}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105 will-change-transform"
              loading="lazy"
              decoding="async"
            />
          </Link>

          {product.discountPercent > 0 && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-[#C59B27] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-md">
              {product.discountPercent}% Off
            </span>
          )}

          <button
            onClick={handleWishlistToggle}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#E8DFC8] bg-white/90 text-stone-600 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-[#C59B27] hover:text-[#C59B27]"
            aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
            title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className={`h-4 w-4 transition-colors ${isFavorited ? 'fill-[#C59B27] text-[#C59B27]' : 'text-stone-500'}`} />
          </button>

          <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button
              onClick={handleQuickViewOpen}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-[#DFBC77]/70 bg-white/90 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#5b4520] shadow-lg backdrop-blur-sm transition hover:bg-white"
            >
              <Eye className="h-3.5 w-3.5 text-[#C59B27]" />
              Quick View
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between p-4 sm:p-4.5">
          <div>
            <span className="mb-2 block truncate text-[10px] font-bold uppercase tracking-[0.18em] text-[#A87D17]">
              {categoryLabel}
            </span>

            <Link to={`/products/${product.id}`} className="block">
              <h3 className="font-serif text-base sm:text-lg font-semibold text-[#1C1917] transition-colors group-hover:text-[#C59B27] line-clamp-2">
                {product.name}
              </h3>
            </Link>

            <div className="mt-2 flex items-center gap-1.5 text-xs text-stone-600">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-stone-800">{product.rating || '4.9'}</span>
              <span className="text-stone-400">({product.reviewCount || 38})</span>
            </div>
          </div>

          <div className="mt-4 border-t border-stone-100 pt-3">
            <div className="flex items-end justify-between gap-3">
              <div className="flex min-w-0 flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">From</span>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-lg font-bold text-[#1C1917]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-stone-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DFBC77] bg-[#FCF9F2] text-[#855F14] shadow-sm transition-all duration-200 hover:bg-[#C59B27] hover:text-white active:scale-95"
                title="Add to shopping bag"
                aria-label={`Add ${product.name} to shopping bag`}
              >
                <ShoppingBag className="h-4 w-4" />
              </button>
            </div>
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
