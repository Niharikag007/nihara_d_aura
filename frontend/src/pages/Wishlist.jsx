import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';

export default function Wishlist() {
  const { products } = useProducts();
  const { wishlistIds } = useWishlist();

  const wishlistedProducts = products.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
            My Wishlist
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {wishlistedProducts.length} Saved Luxury Treasures
          </p>
        </div>

        <Link
          to="/products"
          className="text-xs font-semibold text-[#855F14] hover:text-[#523A0B] flex items-center gap-1"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid or Empty State */}
      {wishlistedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto my-12">
          <div className="w-16 h-16 rounded-full bg-[#FAF3E8] border border-[#DFBC77] flex items-center justify-center mx-auto text-[#C59B27] mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900">Your Wishlist is Empty</h3>
          <p className="text-xs text-stone-500 mt-1">Explore our heirloom jewellery, silk foundation, and candles to save items.</p>
          <Link to="/products" className="btn-gold inline-block mt-6 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider">
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistedProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

    </div>
  );
}
