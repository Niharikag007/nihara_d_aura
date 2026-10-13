import React from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, KeyRound, ShoppingBag, Lock } from 'lucide-react';

export default function AdminRoute({ children }) {
  const { isAuthenticated, user, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // RBAC: Check role
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-[#DFBC77]/60 p-6 sm:p-10 max-w-lg w-full text-center shadow-2xl space-y-6 animate-fade-in relative overflow-hidden">
          {/* Subtle gold luxury background glow */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#DFBC77]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#C59B27]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Icon Badge */}
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border-2 border-red-200/80 shadow-md">
            <Lock className="w-7 h-7" />
          </div>

          {/* Heading & Badge */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-red-100 text-red-700 border border-red-200">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>403 Access Denied • RBAC Protected</span>
            </div>
            
            <h1 className="font-serif text-2xl font-bold text-[#1C1917]">
              Admin Credentials Required
            </h1>

            <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto">
              Aap abhi <strong className="text-stone-900 font-semibold">{user?.name || 'Customer'}</strong> ke <span className="underline decoration-[#C59B27] font-semibold text-[#855F14]">Customer Account</span> se logged in hain. 
            </p>
          </div>

          {/* Permission explanation banner */}
          <div className="bg-[#FAF3E6] border border-[#E8DFC8] rounded-2xl p-4 text-left space-y-2.5">
            <div className="flex items-center gap-2 text-[#855F14] font-bold text-xs uppercase tracking-wider">
              <ShoppingBag className="w-4 h-4 text-[#C59B27]" />
              <span>Customer Privileges:</span>
            </div>
            <ul className="text-[11px] text-stone-600 space-y-1 list-disc list-inside">
              <li>Luxury products browse karna aur cart me add karna</li>
              <li>Checkout & Online/COD purchase karna</li>
              <li>Salon service & bridal appointments book karna</li>
              <li>Catalog aur Promo offers me <strong className="text-red-600">koi changes nahi kar sakte</strong></li>
            </ul>
            <div className="pt-1 text-[11px] text-[#9E7318] italic border-t border-[#DFBC77]/40">
              Admin Dashboard me products add/edit/delete karne ke liye Admin credentials se login karein.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/products"
              className="btn-outline-gold py-2.5 px-5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#FAF3E6] transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Shopping</span>
            </Link>
            <Link
              to="/login?role=admin&redirect=/admin"
              className="btn-gold py-2.5 px-5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span>Sign In as Admin</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return children;
}
