import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Mail, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  LoaderCircle,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import Logo from '../components/common/Logo';

// Authorized Admin Credentials
const AUTHORIZED_ADMIN_EMAIL = 'niharikagautam007@gmail.com';
const AUTHORIZED_ADMIN_PASSWORD = 'Niharika_2026';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useToast();

  const redirectParam = searchParams.get('redirect');

  // Admin credentials state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Status & error states
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated as admin, redirect to admin dashboard
  if (isAuthenticated && isAdmin) {
    return <Navigate to={redirectParam || '/admin'} replace />;
  }

  // Handle Admin Sign In (Strict credentials, NO OTP)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = adminEmail.trim().toLowerCase();
    const cleanPassword = adminPassword;

    if (!cleanEmail || !cleanPassword) {
      setErrorMessage('Please enter both administrative email and password.');
      return;
    }

    // Strict Client-Side Credentials Validation
    if (cleanEmail !== AUTHORIZED_ADMIN_EMAIL || cleanPassword !== AUTHORIZED_ADMIN_PASSWORD) {
      setErrorMessage('Access Not Allowed: You do not have permission to access. Only authorized administrator can log in.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.login(cleanEmail, cleanPassword, 'admin');
      setIsSubmitting(false);

      if (response?.success && response?.token) {
        const adminUser = response.user || {
          id: 'admin_niharika',
          name: 'Niharika Gautam',
          fullName: 'Niharika Gautam',
          email: AUTHORIZED_ADMIN_EMAIL,
          role: 'admin',
          tier: 'Administrator'
        };

        const result = login(adminUser, response.token);
        if (!result.success) {
          setErrorMessage(result.message || 'Session creation failed. Please try again.');
          return;
        }

        showToast('Welcome back, Niharika! Administrator authentication successful.', 'success');
        navigate(redirectParam || '/admin');
      } else {
        setErrorMessage(
          response?.message || 'Access Not Allowed: You do not have permission to access. Only authorized administrator can log in.'
        );
      }
    } catch (error) {
      setIsSubmitting(false);
      setErrorMessage(
        error.message || 'Access Not Allowed: Authentication failed. Please check your credentials.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-4 py-12 relative overflow-hidden selection:bg-[#C59B27] selection:text-white">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-[#DFBC77]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Luxury Card */}
      <div className="bg-white rounded-[32px] sm:rounded-[36px] border border-[#EBE5D8] p-7 sm:p-10 max-w-sm sm:max-w-md w-full shadow-[0_20px_50px_rgba(0,0,0,0.06)] space-y-6 relative z-10 text-center transition-all">
        
        {/* Branding & Logo */}
        <div className="text-center space-y-3.5">
          <div className="flex justify-center">
            <Link to="/" title="Return to Nihara D'Aura Home" className="group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#FCFAF6] border border-[#DFBC77]/40 flex items-center justify-center p-2.5 shadow-xs transition-transform duration-300 group-hover:scale-105">
                <Logo className="w-full h-full object-contain" alt="Nihara D'Aura" />
              </div>
            </Link>
          </div>

          {/* Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#DFBC77]/60 bg-[#FAF7F2] text-[#855F14] text-[10.5px] font-semibold tracking-wider uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>ADMINISTRATIVE PORTAL</span>
            </div>
          </div>

          {/* Titles */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-[26px] font-bold text-stone-900 tracking-tight">
              Admin Portal
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-normal max-w-xs mx-auto leading-relaxed">
              Enter authorized administrator credentials to access the management console
            </p>
          </div>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-start gap-2.5 shadow-xs text-left">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* Admin Login Form */}
        <form noValidate onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-xs sm:text-[13px] font-medium text-stone-700 block mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C59B27]">
                <Mail className="w-4 h-4 text-[#C59B27]" />
              </div>
              <input
                type="email"
                required
                autoComplete="email"
                value={adminEmail}
                onChange={(e) => {
                  setAdminEmail(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="niharikagautam007@gmail.com"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl border-2 border-[#E8DFC8] focus:border-[#855F14] bg-[#FCFAF6] focus:bg-white text-stone-900 placeholder:text-stone-400 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#C59B27]/15 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs sm:text-[13px] font-medium text-stone-700 block mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C59B27]">
                <Lock className="w-4 h-4 text-[#C59B27]" />
              </div>
              <input
                type={showAdminPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={adminPassword}
                onChange={(e) => {
                  setAdminPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-3.5 rounded-2xl border-2 border-[#E8DFC8] focus:border-[#855F14] bg-[#FCFAF6] focus:bg-white text-stone-900 placeholder:text-stone-400 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#C59B27]/15 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
              />
              <button
                type="button"
                onClick={() => setShowAdminPassword(!showAdminPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                aria-label={showAdminPassword ? 'Hide password' : 'Show password'}
              >
                {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-[#9E7318] via-[#C59B27] to-[#855F14] hover:from-[#B0831D] hover:via-[#D4AF37] hover:to-[#9E7318] shadow-[0_12px_28px_rgba(184,134,11,0.28)] hover:shadow-[0_16px_36px_rgba(184,134,11,0.38)] flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer pt-3 mt-2"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="w-5 h-5 animate-spin" />
                <span>Authenticating Admin...</span>
              </>
            ) : (
              <>
                <span>Access Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Trust Note */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-2 text-xs text-stone-500">
          <ShieldCheck className="w-4 h-4 text-[#855F14]" />
          <span>Restricted to Authorized Administrator Only</span>
        </div>

        {/* Return Home */}
        <div className="text-center">
          <Link
            to="/"
            className="text-xs text-stone-400 hover:text-[#855F14] transition-colors"
          >
            ← Return to Storefront
          </Link>
        </div>

      </div>
    </div>
  );
}
