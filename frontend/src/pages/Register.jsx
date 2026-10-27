import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, User, Mail, Lock, ShieldCheck, ArrowRight, AlertCircle, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Logo from '../components/common/Logo';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    identifier: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ name: false, identifier: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Name validation: Only alphabets, spaces, dots, apostrophes (at least 2 chars)
  const validateName = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return 'Please enter your full name.';
    if (trimmed.length < 2) return 'Full Name must be at least 2 characters long.';
    const nameRegex = /^[a-zA-Z\s'.]+$/;
    if (!nameRegex.test(trimmed)) {
      return 'Name must only contain alphabetic letters and spaces (no numbers or special characters).';
    }
    return '';
  };

  // Email / Phone validation: Standard lowercase email format or 10-digit mobile number
  const validateIdentifier = (input) => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return 'Please enter your email or phone number.';

    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    const cleanDigits = trimmed.replace(/[^0-9]/g, '');
    const hasLetters = /[a-z]/i.test(trimmed);

    // If it has '@' or alphabets, treat as Email
    if (trimmed.includes('@') || hasLetters) {
      if (!emailRegex.test(trimmed)) {
        return 'Please enter a valid standard email in lowercase (e.g., yourname@domain.com).';
      }
      return '';
    }

    // Otherwise treat as Phone Number
    if (cleanDigits.length !== 10 || !/^[6-9]\d{9}$/.test(cleanDigits)) {
      return 'Please enter a valid 10-digit mobile number (starting with 6, 7, 8, or 9).';
    }

    return '';
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    // Disallow numbers directly in name input
    const cleaned = val.replace(/[0-9]/g, '');
    setFormData((prev) => ({ ...prev, name: cleaned }));
    if (errorMessage) setErrorMessage('');
    if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: false }));
  };

  const handleIdentifierChange = (e) => {
    const val = e.target.value;
    // Auto convert to lowercase if letters/email are typed
    const cleaned = val.includes('@') || /[A-Z]/.test(val) ? val.toLowerCase() : val;
    setFormData((prev) => ({ ...prev, identifier: cleaned }));
    if (errorMessage) setErrorMessage('');
    if (fieldErrors.identifier) setFieldErrors((prev) => ({ ...prev, identifier: false }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const nameError = validateName(formData.name);
    if (nameError) {
      setErrorMessage(nameError);
      setFieldErrors({ name: true, identifier: false });
      return;
    }

    const identifierError = validateIdentifier(formData.identifier);
    if (identifierError) {
      setErrorMessage(identifierError);
      setFieldErrors({ name: false, identifier: true });
      return;
    }

    setFieldErrors({ name: false, identifier: false });
    setIsSubmitting(true);

    const cleanName = formData.name.trim();
    const cleanIdentifier = formData.identifier.trim().toLowerCase();

    setTimeout(() => {
      const isEmail = cleanIdentifier.includes('@');
      const userEmail = isEmail ? cleanIdentifier : `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '')}@niharapatron.com`;
      const cleanDigits = cleanIdentifier.replace(/[^0-9]/g, '');
      const userPhone = isEmail ? '+91 98765 43210' : `+91 ${cleanDigits}`;

      login({
        id: `usr_${Date.now()}`,
        name: cleanName,
        email: userEmail,
        phone: userPhone,
        avatar: '/hero-slide-1.jpg',
        tier: 'Royal Patron',
        rewardPoints: 100,
        role: 'user'
      });

      setIsSubmitting(false);
      showToast(`Welcome to Nihara D'Aura, ${cleanName}! 100 Welcome Points Awarded.`, 'success');
      navigate('/profile');
    }, 400);
  };

  const isPhoneInput = Boolean(
    formData.identifier &&
    !formData.identifier.includes('@') &&
    /^[+0-9\s-]+$/.test(formData.identifier.trim())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] via-[#F4EFE6] to-[#ECE5D8] flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Ambient luxury luminous glowing orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-[#DFBC77]/30 via-[#DFBC77]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#C59B27]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-[#855F14]/12 rounded-full blur-3xl pointer-events-none" />

      {/* Main Luxury Register Card */}
      <div className="bg-white/95 backdrop-blur-xl rounded-[36px] border border-[#E5D2A8] p-7 sm:p-10 max-w-sm sm:max-w-md w-full shadow-[0_25px_60px_rgba(133,95,20,0.12),0_4px_16px_rgba(0,0,0,0.03)] space-y-6 relative z-10 ring-1 ring-[#DFBC77]/25 transition-all">
        
        {/* Top Branding Section */}
        <div className="text-center space-y-3.5">
          {/* Prominent Large Logo Medallion with Ambient Gold Aura */}
          <Link to="/" className="inline-block group" title="Return to Nihara D'Aura Home">
            <div className="relative mx-auto flex items-center justify-center">
              {/* Luminous Glow Halo */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-[#C59B27]/40 via-[#F5E6C4]/30 to-[#855F14]/40 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300 opacity-80" />
              
              {/* Royal Medallion Gold Rim */}
              <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#FFF5D6] to-[#996515] shadow-[0_10px_28px_rgba(184,134,11,0.35)] transition-transform duration-300 group-hover:scale-105">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-stone-950 p-1 flex items-center justify-center border border-[#DFBC77]/50">
                  <Logo className="w-full h-full object-contain rounded-full scale-105 drop-shadow-[0_4px_12px_rgba(212,175,55,0.5)]" />
                </div>
              </div>
            </div>
          </Link>

          {/* Unified Luxury Pill Badge: Jewellery • Makeup • Salon Sanctuary */}
          <div className="flex justify-center pt-1">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 rounded-full border border-[#D4AF37]/70 bg-gradient-to-r from-[#FAF3E7] via-[#FFFBF2] to-[#FAF3E7] text-[#7A560E] text-[10px] sm:text-[11px] font-extrabold tracking-[0.14em] uppercase shadow-[0_2px_12px_rgba(212,175,55,0.18)]">
              <Sparkles className="w-3.5 h-3.5 text-[#B8860B] shrink-0 animate-pulse" />
              <span>HAUTE JEWELLERY • BRIDAL MAKEUP • SALON SANCTUARY</span>
            </div>
          </div>

          {/* Brand Heading & Flourish */}
          <div>
            <h2 className="font-serif text-3xl sm:text-[34px] font-extrabold tracking-tight text-[#1A1815]">
              Nihara <span className="bg-gradient-to-r from-[#C59B27] via-[#DFBC77] to-[#855F14] bg-clip-text text-transparent font-serif italic">D'Aura</span>
            </h2>
            <div className="flex items-center justify-center gap-2 mt-1">
              <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#C59B27]/60" />
              <span className="text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-[0.22em] text-[#8C733E]">
                Haute Luxury & Bespoke Beauty
              </span>
              <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#C59B27]/60" />
            </div>
          </div>

          {/* Welcome & Create Account Heading */}
          <div className="pt-1.5 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#FAF3E7] via-[#FFF8EC] to-[#FAF3E7] border border-[#D4AF37]/50 text-[#855F14] text-xs font-bold tracking-wide shadow-xs mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>Welcome to Nihara D'Aura</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-[28px] font-bold text-stone-900 tracking-tight">
              Create Account
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-normal mt-1 max-w-xs mx-auto">
              Welcome! Sign up with your details for your luxury jewellery & bespoke beauty journey
            </p>
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-start gap-2.5 shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Full Name Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
                FULL NAME
              </label>
              <span className="text-[10px] text-stone-400 font-medium">Alphabets only</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#855F14]">
                <User className="w-4 h-4 text-[#855F14]" />
              </div>
              <input
                type="text"
                required
                value={formData.name}
                onChange={handleNameChange}
                placeholder="Full Name (e.g. Priya Sharma)"
                className={`w-full pl-10 pr-4 py-3.5 rounded-2xl border-2 ${
                  fieldErrors.name ? 'border-rose-400 bg-rose-50/30' : 'border-[#C59B27] bg-[#FCFBF8]'
                } focus:bg-white text-stone-900 placeholder:text-stone-400 text-sm font-medium focus:outline-none focus:border-[#855F14] focus:ring-4 focus:ring-[#C59B27]/20 transition-all shadow-xs`}
              />
            </div>
          </div>

          {/* Email or Phone Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
                EMAIL OR PHONE NUMBER
              </label>
              <span className="text-[10px] text-stone-400 font-medium">Small letters for email</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#855F14]">
                {isPhoneInput ? (
                  <Phone className="w-4 h-4 text-[#855F14]" />
                ) : (
                  <Mail className="w-4 h-4 text-[#855F14]" />
                )}
              </div>
              <input
                type="text"
                required
                value={formData.identifier}
                onChange={handleIdentifierChange}
                placeholder="name@gmail.com or 10-digit phone"
                className={`w-full pl-10 pr-4 py-3.5 rounded-2xl border-2 ${
                  fieldErrors.identifier ? 'border-rose-400 bg-rose-50/30' : 'border-[#C59B27] bg-[#FCFBF8]'
                } focus:bg-white text-stone-900 placeholder:text-stone-400 text-sm font-medium focus:outline-none focus:border-[#855F14] focus:ring-4 focus:ring-[#C59B27]/20 transition-all shadow-xs`}
              />
            </div>
          </div>

          {/* Primary Action Button in Royal Gold */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-[#855F14] via-[#B8860B] to-[#75500A] hover:from-[#9E7318] hover:to-[#855F14] shadow-[0_12px_28px_rgba(133,95,20,0.28)] hover:shadow-[0_16px_36px_rgba(133,95,20,0.38)] flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer"
          >
            <span>{isSubmitting ? 'Creating Account...' : 'Create Account →'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security and Benefits Info Row */}
        <div className="flex justify-center pt-1">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#FAF5EB] border border-[#E8D7B8] text-xs text-stone-600 font-medium shadow-xs">
            <span className="flex items-center gap-1.5 text-[#855F14]">
              <Lock className="w-3.5 h-3.5 text-[#855F14]" />
              <span className="text-stone-700 font-semibold">Passwordless</span>
            </span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-1.5 text-[#855F14]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#855F14]" />
              <span className="text-stone-700 font-semibold">100% Free Signup</span>
            </span>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="text-center text-xs sm:text-sm text-stone-500 font-medium pt-2 border-t border-[#DFBC77]/25">
          Already have an account?{' '}
          <Link to="/login" className="text-[#855F14] font-bold hover:underline ml-1">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}
