import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import QuickViewModal from './QuickViewModal';
import { ARTIFICIAL_JEWELLERY, getJewellerySubcategory, getProductImage, getProductImageAlt, isArtificialJewellery } from '../../data/jewelleryCategories';

export default function ProductCard({ product }) {
  const { addToCart, setIsDrawerOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [imgBroken, setImgBroken] = useState(false);

  const isFavorited = isInWishlist(product.id);

  // Clean, non-repetitive category label
  const categoryLabel = useMemo(() => {
    if (isArtificialJewellery(product)) return `${ARTIFICIAL_JEWELLERY.name} • ${getJewellerySubcategory(product)}`;
    if (!product.category) return 'Luxury';
    if (!product.subcategory ||
        product.subcategory.toLowerCase().startsWith('all') ||
        product.subcategory.toLowerCase() === product.category.toLowerCase()) {
      return product.category;
    }
    return `${product.category} • ${product.subcategory}`;
  }, [product]);

  // Always use the real uploaded image — no dummy/stock fallback
  const displayImage = getProductImage(product);
  const showPlaceholder = !displayImage || imgBroken;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = addToCart(product, 1, product.variants?.[0] || 'Standard');
    if (added) {
      showToast(`${product.name} added to cart`, 'success');
      setIsDrawerOpen(true);
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id).then((changed) => {
      if (changed !== false) {
        showToast(isFavorited ? `Removed from Wishlist` : `Saved to Wishlist`, 'info');
      }
    });
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
            {/* Real uploaded image */}
            {displayImage && !imgBroken ? (
              <img
                src={displayImage}
                alt={getProductImageAlt(product)}
                onError={() => setImgBroken(true)}
                className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105 will-change-transform"
                loading="lazy"
                decoding="async"
              />
            ) : null}

            {/* No Image / Broken Image Placeholder — no dummy stock photos */}
            {showPlaceholder && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[11px] font-mono font-bold text-stone-400">No Image</span>
                {imgBroken && displayImage && (
                  <span className="mt-1 text-[9px] font-mono text-rose-400 px-2 text-center break-all line-clamp-2">
                    404 · {displayImage.length > 40 ? displayImage.slice(0, 40) + '…' : displayImage}
                  </span>
                )}
              </div>
            )}
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
              <span className="font-semibold text-stone-800">{product.rating || '-'}</span>
              {product.reviewCount && <span className="text-stone-400">({product.reviewCount})</span>}
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
                title="Add to cart"
                aria-label={`Add ${product.name} to cart`}
              >
                <ShoppingCart className="h-4 w-4" />
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
