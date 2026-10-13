import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutGrid, Calendar, Heart, User, LogIn } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

export default function MobileBottomNav() {
  const { count: wishlistCount } = useWishlist();
  const { isAuthenticated } = useAuth();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF] border-t border-[#E8DFC8] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 py-1.5 flex items-center justify-around">
      
      {/* Home */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-3 text-[11px] font-medium transition-colors ${
            isActive ? 'text-[#C59B27] font-semibold' : 'text-[#8C827A] hover:text-[#1C1917]'
          }`
        }
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span>Home</span>
      </NavLink>

      {/* Categories */}
      <NavLink
        to="/categories"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-3 text-[11px] font-medium transition-colors ${
            isActive ? 'text-[#C59B27] font-semibold' : 'text-[#8C827A] hover:text-[#1C1917]'
          }`
        }
      >
        <LayoutGrid className="w-5 h-5 mb-0.5" />
        <span>Categories</span>
      </NavLink>

      {/* Book (Center Golden Elevated Button) */}
      <NavLink
        to="/book"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center -mt-5 transition-transform active:scale-95`
        }
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#C59B27] to-[#DFBC77] text-white flex items-center justify-center shadow-lg border-2 border-white">
          <Calendar className="w-6 h-6" />
        </div>
        <span className="text-[11px] font-semibold text-[#855F14] mt-0.5">Book</span>
      </NavLink>

      {/* Wishlist */}
      <NavLink
        to="/wishlist"
        className={({ isActive }) =>
          `relative flex flex-col items-center justify-center py-1 px-3 text-[11px] font-medium transition-colors ${
            isActive ? 'text-[#C59B27] font-semibold' : 'text-[#8C827A] hover:text-[#1C1917]'
          }`
        }
      >
        <div className="relative">
          <Heart className="w-5 h-5 mb-0.5" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-[#C59B27] text-white text-[9px] rounded-full flex items-center justify-center font-bold">
              {wishlistCount}
            </span>
          )}
        </div>
        <span>Wishlist</span>
      </NavLink>

      {/* Profile / Login */}
      <NavLink
        to={isAuthenticated ? '/profile' : '/login'}
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-3 text-[11px] font-medium transition-colors ${
            isActive ? 'text-[#C59B27] font-semibold' : 'text-[#8C827A] hover:text-[#1C1917]'
          }`
        }
      >
        {isAuthenticated ? (
          <User className="w-5 h-5 mb-0.5" />
        ) : (
          <LogIn className="w-5 h-5 mb-0.5" />
        )}
        <span>{isAuthenticated ? 'Profile' : 'Sign In'}</span>
      </NavLink>

    </div>
  );
}
