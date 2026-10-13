import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { 
  Crown, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  User, 
  Lock, 
  KeyRound, 
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth, ADMIN_CREDENTIALS } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated, isAdmin, user } = useAuth();
  const { showToast } = useToast();

  const roleParam = searchParams.get('role');
  const redirectParam = searchParams.get('redirect');

  // Role Tab: 'customer' | 'admin'
  const [activeRoleTab, setActiveRoleTab] = useState(
    roleParam === 'admin' || redirectParam === '/admin' ? 'admin' : 'customer'
  );

  // Form Fields
  const [emailOrPhone, setEmailOrPhone] = useState('amitky2056@gmail.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If role param changes in URL
  useEffect(() => {
    if (roleParam === 'admin' || redirectParam === '/admin') {
      setActiveRoleTab('admin');
      setEmailOrPhone(ADMIN_CREDENTIALS.email);
      setPassword(ADMIN_CREDENTIALS.password);
    }
  }, [roleParam, redirectParam]);

  // Handle Tab Switch
  const handleTabChange = (tab) => {
    setActiveRoleTab(tab);
    setErrorMessage('');
    if (tab === 'admin') {
      setEmailOrPhone(ADMIN_CREDENTIALS.email);
      setPassword(ADMIN_CREDENTIALS.password);
    } else {
      setEmailOrPhone('amitky2056@gmail.com');
      setPassword('password123');
    }
  };

  // If already authenticated with the correct role, redirect
  if (isAuthenticated) {
    if (activeRoleTab === 'admin' && isAdmin) {
      return <Navigate to={redirectParam || '/admin'} replace />;
    }
    if (activeRoleTab === 'customer' && !roleParam && !redirectParam) {
      return <Navigate to="/profile" replace />;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    if (activeRoleTab === 'admin') {
      // Admin RBAC verification
      const cleanEmail = emailOrPhone.trim().toLowerCase();
      if (cleanEmail !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
        setIsSubmitting(false);
        setErrorMessage('Invalid Admin Credentials! Sirf authorized admin hi Admin Dashboard access kar sakte hain.');
        showToast('Access Denied: Invalid Admin Credentials', 'error');
        return;
      }

      const res = login({
        email: cleanEmail,
        password,
        role: 'admin'
      });

      setIsSubmitting(false);
      if (res?.success) {
        showToast('Admin Portal Access Granted. Welcome, Administrator!', 'success');
        navigate(redirectParam || '/admin');
      } else {
        setErrorMessage(res?.message || 'Admin authentication failed.');
      }
    } else {
      // Customer Login (Read & Purchase permissions only)
      const res = login({
        id: 'usr_amit_kumar',
        name: 'Amit Kumar',
        email: emailOrPhone.includes('@') ? emailOrPhone.trim() : 'amitky2056@gmail.com',
        phone: !emailOrPhone.includes('@') ? emailOrPhone.trim() : '+91 8004116370',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        tier: 'Royal Elite',
        rewardPoints: 450,
        role: 'user'
      });

      setIsSubmitting(false);
      if (res?.success) {
        showToast('Welcome back, Amit! Customer session active.', 'success');
        navigate(redirectParam && redirectParam !== '/admin' ? redirectParam : '/');
      }
    }
  };

  return (
    <div className="min-h-[85vh] bg-transparent flex items-center justify-center p-4 py-10">
      <div className="bg-white rounded-3xl border border-[#DFBC77]/70 p-6 sm:p-10 max-w-md w-full shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Subtle Luxury Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#DFBC77]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#C59B27]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Crest */}
        <div className="text-center space-y-2">
          <div className={`w-14 h-14 rounded-full text-white flex items-center justify-center mx-auto shadow-md transition-all duration-300 ${
            activeRoleTab === 'admin' 
              ? 'bg-gradient-to-tr from-[#9E7318] to-[#69480C] ring-4 ring-[#EAD7AD]' 
              : 'bg-gradient-to-tr from-[#C59B27] to-[#DFBC77]'
          }`}>
            {activeRoleTab === 'admin' ? (
              <ShieldCheck className="w-7 h-7" />
            ) : (
              <Crown className="w-7 h-7" />
            )}
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {activeRoleTab === 'admin' ? 'Admin Portal Access' : 'Sign In to Nihara'}
          </h1>
          <p className="text-sm font-medium text-stone-600 leading-snug">
            {activeRoleTab === 'admin'
              ? 'Restricted Access: Manage Products, Stock & Promo Offers'
              : 'Browse luxury collections, make purchases & manage appointments'}
          </p>
        </div>

        {/* RBAC Role Selector Tabs */}
        <div className="bg-[#F5EEDF] p-1.5 rounded-2xl flex border border-[#DECDB3]">
          <button
            type="button"
            onClick={() => handleTabChange('customer')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeRoleTab === 'customer'
                ? 'bg-white text-[#7E5700] shadow-md border border-[#DFBC77]/50'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Customer</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('admin')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeRoleTab === 'admin'
                ? 'bg-gradient-to-r from-[#9E7318] to-[#7A560E] text-white shadow-md'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Administrator</span>
          </button>
        </div>

        {/* Role Privileges Notice */}
        <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border transition-all ${
          activeRoleTab === 'admin'
            ? 'bg-amber-50 border-amber-300 text-stone-900'
            : 'bg-[#FFFDF9] border-[#DFBC77]/70 text-stone-900'
        }`}>
          {activeRoleTab === 'admin' ? (
            <div className="flex items-start gap-2.5">
              <KeyRound className="w-4 h-4 text-[#A87D17] shrink-0 mt-0.5" />
              <span>
                <strong className="text-stone-950 font-bold block mb-0.5">Admin Permissions:</strong>
                Authorized credentials se login karein. Yahan se aap products, inventory stock, aur promotional offers manage kar sakte hain.
              </span>
            </div>
          ) : (
            <div className="flex items-start gap-2.5">
              <User className="w-4 h-4 text-[#855F14] shrink-0 mt-0.5" />
              <span>
                <strong className="text-stone-950 font-bold block mb-0.5">Customer Role:</strong>
                Aap pure boutique catalog ko freely browse aur items purchase kar sakte hain. Catalog me koi changes nahi honge.
              </span>
            </div>
          )}
        </div>

        {/* Error Alert if credentials fail */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-300 text-red-800 text-xs sm:text-sm font-medium flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-800 block mb-1.5">
              {activeRoleTab === 'admin' ? 'Admin Email Address' : 'Email Address or Phone'}
            </label>
            <input
              type="text"
              required
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder={activeRoleTab === 'admin' ? 'admin@niharadaura.com' : 'amitky2056@gmail.com'}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm sm:text-base font-semibold text-stone-900 bg-[#FCF9F2] focus:bg-white focus:outline-none focus:border-[#C59B27] focus:ring-4 focus:ring-[#C59B27]/15 transition-all shadow-inner"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Password
              </label>
              {activeRoleTab === 'customer' && (
                <Link to="/verify-otp" className="text-xs font-bold text-[#855F14] hover:text-[#5c400a] hover:underline">
                  Login with OTP
                </Link>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-11 rounded-xl border border-stone-300 text-sm sm:text-base font-semibold text-stone-900 bg-[#FCF9F2] focus:bg-white focus:outline-none focus:border-[#C59B27] focus:ring-4 focus:ring-[#C59B27]/15 transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800 p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Autofill Helpers */}
          <div className="pt-1">
            {activeRoleTab === 'admin' ? (
              <button
                type="button"
                onClick={() => {
                  setEmailOrPhone(ADMIN_CREDENTIALS.email);
                  setPassword(ADMIN_CREDENTIALS.password);
                  setErrorMessage('');
                }}
                className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-xs sm:text-sm font-bold text-amber-950 flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99]"
              >
                <KeyRound className="w-4 h-4 text-[#A87D17]" />
                <span>Fill Demo Admin Credentials (admin@niharadaura.com)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setEmailOrPhone('amitky2056@gmail.com');
                  setPassword('password123');
                  setErrorMessage('');
                }}
                className="w-full py-2.5 px-3 bg-[#FAF3E6] hover:bg-[#F3E7D3] border border-[#C59B27]/40 rounded-xl text-xs sm:text-sm font-bold text-[#6D4907] flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99]"
              >
                <User className="w-4 h-4 text-[#A87D17]" />
                <span>Fill Demo Customer Credentials (Amit Kumar)</span>
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 sm:py-4 rounded-xl text-sm uppercase tracking-wider font-extrabold shadow-md hover:shadow-xl flex items-center justify-center gap-2 mt-2 transition-all active:scale-[0.99] ${
              activeRoleTab === 'admin'
                ? 'bg-gradient-to-r from-[#9E7318] to-[#69480C] text-white hover:opacity-95'
                : 'btn-gold'
            }`}
          >
            <span>
              {isSubmitting 
                ? 'Authenticating...' 
                : activeRoleTab === 'admin' 
                  ? 'Sign In to Admin Portal' 
                  : 'Enter Sanctuary as Customer'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs sm:text-sm text-stone-600 pt-3 border-t border-stone-200 font-medium">
          {activeRoleTab === 'admin' ? (
            <span>
              Are you a Customer?{' '}
              <button
                type="button"
                onClick={() => handleTabChange('customer')}
                className="text-[#855F14] font-bold hover:underline ml-1"
              >
                Switch to Customer Login
              </button>
            </span>
          ) : (
            <span>
              New to Nihara D Aura?{' '}
              <Link to="/register" className="text-[#855F14] font-bold hover:underline ml-1">
                Create an Account
              </Link>
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
