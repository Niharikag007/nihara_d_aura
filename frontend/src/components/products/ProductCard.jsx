import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.variants?.[0] || 'Standard');
    showToast(`${product.name} added to cart`, 'success');
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    showToast(isFavorited ? `Removed from Wishlist` : `Saved to Wishlist`, 'info');
  };

  return (
    <div className="group bg-white rounded-2xl border border-[#DFBC77]/30 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#C59B27]/60 transition-all duration-300 flex flex-col justify-between will-change-transform transform-gpu">
      
      {/* Top Media Area */}
      <Link to={`/products/${product.id}`} className="relative block aspect-square overflow-hidden bg-[#FBF8F2]">
        
        {/* Discount Badge */}
        {product.discountPercent > 0 && (
          <span className="absolute top-3 left-3 z-10 bg-[#C59B27] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            {product.discountPercent}% OFF
          </span>
        )}

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2.5 right-2.5 z-10 w-10 h-10 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow hover:scale-110 active:scale-95 transition-transform"
          aria-label="Wishlist toggle"
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              isFavorited ? 'fill-[#C59B27] text-[#C59B27]' : 'text-stone-500 hover:text-[#C59B27]'
            }`} 
          />
        </button>

        {/* Product Image with smooth hover scale */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out will-change-transform"
          loading="lazy"
          decoding="async"
        />
      </Link>

      {/* Details Section */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        
        <div>
          {/* Category & Subcategory Tag */}
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A87D17] block mb-1 truncate">
            {product.category} {product.subcategory ? `• ${product.subcategory}` : ''}
          </span>

          {/* Title */}
          <Link to={`/products/${product.id}`}>
            <h3 className="font-serif text-sm font-semibold text-[#1C1917] line-clamp-1 group-hover:text-[#C59B27] transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-xs font-semibold text-stone-800">{product.rating}</span>
            <span className="text-xs text-stone-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Price & Add to Bag Row */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-100 gap-2">
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-[#1C1917]">₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-[#FCF9F2] border border-[#DFBC77] text-[#855F14] hover:bg-[#C59B27] hover:text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm flex-shrink-0"
            title="Add to shopping bag"
            aria-label="Add to shopping bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
