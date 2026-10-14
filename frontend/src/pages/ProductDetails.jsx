import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles, 
  ArrowLeft,
  Check
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/products/ProductCard';

export default function ProductDetails() {
  const { products } = useProducts();
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsDrawerOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const product = products.find(p => p.id === id || p.slug === id) || products[0];
  const relatedProducts = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);

  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || 'Default');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const isFavorited = isInWishlist(product.id);

  const cleanCategoryLabel = React.useMemo(() => {
    if (!product?.category) return 'Luxury';
    if (!product.subcategory || 
        product.subcategory.toLowerCase().startsWith('all') || 
        product.subcategory.toLowerCase() === product.category.toLowerCase()) {
      return product.category;
    }
    return `${product.category} • ${product.subcategory}`;
  }, [product?.category, product?.subcategory]);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant, selectedSize);
    showToast(`${quantity}x ${product.name} added to bag!`, 'success');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant, selectedSize);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-transparent py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Back link */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#855F14] transition-colors mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Collection</span>
      </button>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 bg-white p-6 sm:p-10 rounded-3xl border border-[#DFBC77]/40 shadow-sm">
        
        {/* Left: Images Column */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-[#FBF8F2] border border-[#E8DFC8] relative shadow-inner">
            {product.discountPercent > 0 && (
              <span className="absolute top-4 left-4 z-10 bg-[#C59B27] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                {product.discountPercent}% OFF
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow hover:scale-110 active:scale-95 transition-transform"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-[#C59B27] text-[#C59B27]' : 'text-stone-500'}`} />
            </button>
            <img
              src={product.images[activeImageIdx] || product.images[0] || '/hero-slide-1.jpg'}
              alt={product.name}
              onError={(e) => { e.currentTarget.src = '/hero-slide-1.jpg'; }}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImageIdx === i ? 'border-[#C59B27] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions Column */}
        <div className="flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#A87D17] bg-[#FCF9F2] px-3.5 py-1 rounded-full border border-[#DFBC77]/40 shadow-xs">
              {cleanCategoryLabel}
            </span>

            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#1C1917] leading-snug">
              {product.name}
            </h1>

            {/* Ratings & Reviews */}
            <div className="flex items-center gap-3">
              <div className="flex items-center text-amber-500 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                <span className="text-xs font-bold text-stone-900">{product.rating}</span>
              </div>
              <span className="text-xs text-stone-500 font-medium">
                ({product.reviewCount} Patron Reviews)
              </span>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                In Stock ({product.stock} units available)
              </span>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#1C1917]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-base text-stone-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs font-semibold text-[#855F14]">
                Taxes Included • Free Royal Shipping
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-2">
              {product.description}
            </p>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="pt-3 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Select Shade / Variant: <span className="text-[#C59B27]">{selectedVariant}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        selectedVariant === v
                          ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-sm'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-[#C59B27]'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="pt-2 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Select Size: <span className="text-[#C59B27]">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        selectedSize === s
                          ? 'bg-[#C59B27] text-white border-[#C59B27] shadow-sm'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-[#C59B27]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Features Bullet List */}
            {product.features && (
              <div className="pt-3 space-y-2 border-t border-stone-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Product Highlights
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-600">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#DFBC77] flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-stone-200 space-y-4">
            
            <div className="flex items-center gap-4">
              {/* Quantity */}
              <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-[#FCF9F2]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-stone-600 hover:bg-[#EAD7AD] font-bold text-base transition-colors"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold text-stone-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-stone-600 hover:bg-[#EAD7AD] font-bold text-base transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Bag */}
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-gold py-3 px-6 rounded-xl text-xs uppercase tracking-wider font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                className="btn-gold-outline py-3 px-6 rounded-xl text-xs uppercase tracking-wider font-bold shadow-sm"
              >
                Buy Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-stone-500 text-center">
              <div className="flex flex-col items-center gap-1 p-2 bg-[#FCF9F2] rounded-lg">
                <Truck className="w-4 h-4 text-[#C59B27]" />
                <span>Free Express Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 bg-[#FCF9F2] rounded-lg">
                <ShieldCheck className="w-4 h-4 text-[#C59B27]" />
                <span>100% Authentic Quality</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 bg-[#FCF9F2] rounded-lg">
                <RotateCcw className="w-4 h-4 text-[#C59B27]" />
                <span>7-Day Easy Exchange</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-14">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917] mb-6">
            Complementary Radiance
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
