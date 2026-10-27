import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Lock,
  Mail, 
  Phone,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Edit3
} from 'lucide-react';
import { useAuth, ADMIN_CREDENTIALS } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Logo from '../components/common/Logo';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useToast();

  const roleParam = searchParams.get('role');
  const redirectParam = searchParams.get('redirect');

  // Admin Mode detection
  const [isAdminMode, setIsAdminMode] = useState(
    roleParam === 'admin' || redirectParam === '/admin'
  );

  // OTP flow step: 'enter_identifier' | 'enter_otp'
  const [otpStep, setOtpStep] = useState('enter_identifier');

  // Patron input (Email or Phone Number)
  const [identifier, setIdentifier] = useState('');

  // Admin credentials (only for Staff Portal)
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  
  // 6-digit OTP array
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputsRef = useRef([]);

  // States
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Check if identifier is phone-like
  const isPhoneInput = Boolean(identifier && !identifier.includes('@') && /^[+0-9\s-]+$/.test(identifier.trim()));

  // Sync role param if URL changes
  useEffect(() => {
    if (roleParam === 'admin' || redirectParam === '/admin') {
      setIsAdminMode(true);
    }
  }, [roleParam, redirectParam]);

  // Resend Countdown Timer
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // If already authenticated, redirect
  if (isAuthenticated) {
    if (isAdminMode && isAdmin) {
      return <Navigate to={redirectParam || '/admin'} replace />;
    }
    if (!isAdminMode) {
      return <Navigate to={redirectParam && redirectParam !== '/admin' ? redirectParam : '/profile'} replace />;
    }
  }

  // Handle Send OTP (Email or Phone Number)
  const handleSendOtp = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const cleanInput = identifier.trim();
    if (!cleanInput) {
      setErrorMessage('Please enter your email address or phone number.');
      return;
    }

    const isEmail = cleanInput.includes('@') && cleanInput.includes('.');
    const cleanDigits = cleanInput.replace(/[^0-9]/g, '');
    const isPhone = cleanDigits.length >= 10;

    if (!isEmail && !isPhone) {
      setErrorMessage('Please enter a valid email address or 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOtpStep('enter_otp');
      setResendTimer(45);
      setOtp(['', '', '', '', '', '']);
      showToast(`Verification code dispatched to ${cleanInput}. (Code: 123456)`, 'info');
      setTimeout(() => {
        if (otpInputsRef.current[0]) {
          otpInputsRef.current[0].focus();
        }
      }, 150);
    }, 500);
  };

  // Handle OTP digit changes
  const handleOtpDigitChange = (val, idx) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    const newOtp = [...otp];

    if (cleaned.length > 1) {
      const pasted = cleaned.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasted[i] || '';
      }
      setOtp(newOtp);
      const nextFocus = Math.min(pasted.length, 5);
      if (otpInputsRef.current[nextFocus]) {
        otpInputsRef.current[nextFocus].focus();
      }
      return;
    }

    newOtp[idx] = cleaned;
    setOtp(newOtp);

    if (cleaned && idx < 5) {
      if (otpInputsRef.current[idx + 1]) {
        otpInputsRef.current[idx + 1].focus();
      }
    }
  };

  // Handle Backspace in OTP boxes
  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      if (otpInputsRef.current[idx - 1]) {
        otpInputsRef.current[idx - 1].focus();
      }
    }
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    setResendTimer(45);
    setOtp(['', '', '', '', '', '']);
    showToast(`Fresh OTP dispatched to ${identifier}. (Code: 123456)`, 'info');
    if (otpInputsRef.current[0]) {
      otpInputsRef.current[0].focus();
    }
  };

  // Submit OTP Verification
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const fullOtp = otp.join('').trim();

    if (fullOtp.length < 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const cleanInput = identifier.trim();
      const isEmail = cleanInput.includes('@');

      let patronName = 'Amit Kumar';
      let userEmail = cleanInput;
      let userPhone = '+91 8004116370';

      if (isEmail) {
        const extracted = cleanInput.split('@')[0] || 'Amit Kumar';
        patronName = extracted.charAt(0).toUpperCase() + extracted.slice(1);
        userEmail = cleanInput;
      } else {
        userPhone = cleanInput.startsWith('+') ? cleanInput : `+91 ${cleanInput}`;
        userEmail = 'amitky2056@gmail.com';
        patronName = 'Amit Kumar';
      }

      const res = login({
        id: 'usr_' + Date.now(),
        name: patronName,
        email: userEmail,
        phone: userPhone,
        avatar: '/hero-slide-1.jpg',
        tier: 'Royal Patron',
        rewardPoints: 500,
        role: 'user'
      });

      setIsSubmitting(false);
      if (res?.success) {
        showToast(`Welcome back, ${patronName}! Session active.`, 'success');
        navigate(redirectParam && redirectParam !== '/admin' ? redirectParam : '/profile');
      } else {
        setErrorMessage(res?.message || 'Verification failed. Please try again.');
      }
    }, 500);
  };

  // Submit Admin Password Login (Staff only)
  const handleAdminPasswordLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const cleanEmail = adminEmail.trim().toLowerCase();

    if (cleanEmail !== ADMIN_CREDENTIALS.email || adminPassword !== ADMIN_CREDENTIALS.password) {
      setIsSubmitting(false);
      setErrorMessage('Invalid Administrator Credentials. Access restricted to authorized personnel.');
      showToast('Access Denied: Invalid Admin Credentials', 'error');
      return;
    }

    const res = login({
      email: cleanEmail,
      password: adminPassword,
      role: 'admin'
    });

    setIsSubmitting(false);
    if (res?.success) {
      showToast('Welcome, Administrator. Admin Portal Access Granted.', 'success');
      navigate(redirectParam || '/admin');
    } else {
      setErrorMessage(res?.message || 'Administrator authentication failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] via-[#F4EFE6] to-[#ECE5D8] flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Ambient luxury luminous glowing orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-[#DFBC77]/30 via-[#DFBC77]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#C59B27]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-[#855F14]/12 rounded-full blur-3xl pointer-events-none" />

      {/* Main Luxury Login Card */}
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
              <span>
                {isAdminMode 
                  ? 'STAFF PORTAL ACCESS' 
                  : otpStep === 'enter_otp' 
                    ? 'REAL-TIME OTP DISPATCHED' 
                    : 'HAUTE JEWELLERY • BRIDAL MAKEUP • SALON SANCTUARY'}
              </span>
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

          {/* Screen Title & Subtitle */}
          <div className="pt-1.5">
            <h1 className="text-2xl sm:text-[26px] font-bold text-stone-900 tracking-tight">
              {isAdminMode 
                ? 'Staff Portal' 
                : otpStep === 'enter_otp' 
                  ? 'Verify Security OTP' 
                  : 'Welcome Back'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-normal mt-1 max-w-xs mx-auto">
              {isAdminMode
                ? 'Enter administrative credentials to access management console'
                : otpStep === 'enter_otp'
                  ? `Enter the 6-digit code sent to ${identifier}`
                  : 'Enter your email or phone number to receive an instant secure OTP'}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-start gap-2.5 shadow-sm animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* -------------------- ADMIN LOGIN FORM -------------------- */}
        {isAdminMode ? (
          <form onSubmit={handleAdminPasswordLogin} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#855F14]">
                  <Mail className="w-4 h-4 text-[#855F14]" />
                </div>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@niharadaura.com"
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl border-2 border-[#C59B27] bg-[#FCFBF8] focus:bg-white text-stone-900 placeholder:text-stone-400 text-sm font-medium focus:outline-none focus:border-[#855F14] focus:ring-4 focus:ring-[#C59B27]/20 transition-all shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#855F14]">
                  <Lock className="w-4 h-4 text-[#855F14]" />
                </div>
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3.5 rounded-2xl border-2 border-[#C59B27] bg-[#FCFBF8] focus:bg-white text-stone-900 placeholder:text-stone-400 text-sm font-medium focus:outline-none focus:border-[#855F14] focus:ring-4 focus:ring-[#C59B27]/20 transition-all shadow-xs"
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-[#855F14] via-[#B8860B] to-[#75500A] hover:from-[#9E7318] hover:to-[#855F14] shadow-[0_12px_28px_rgba(133,95,20,0.28)] hover:shadow-[0_16px_36px_rgba(133,95,20,0.38)] flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Access Admin Console →'}</span>
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsAdminMode(false);
                  setErrorMessage('');
                  setAdminEmail('');
                  setAdminPassword('');
                }}
                className="text-xs text-[#855F14] font-semibold hover:underline cursor-pointer"
              >
                ← Return to Patron Login
              </button>
            </div>
          </form>
        ) : (
          /* -------------------- USER PASSWORDLESS OTP LOGIN -------------------- */
          <div className="space-y-5">
            {otpStep === 'enter_identifier' ? (
              /* Step 1: Identifier Input Form */
              <form onSubmit={handleSendOtp} className="space-y-4 sm:space-y-5">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-1.5">
                    EMAIL OR PHONE NUMBER
                  </label>
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
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Email or Phone Number"
                      className="w-full pl-10 pr-4 py-3.5 rounded-2xl border-2 border-[#C59B27] bg-[#FCFBF8] focus:bg-white text-stone-900 placeholder:text-stone-400 text-sm font-medium focus:outline-none focus:border-[#855F14] focus:ring-4 focus:ring-[#C59B27]/20 transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* Primary Royal Gold Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-[#855F14] via-[#B8860B] to-[#75500A] hover:from-[#9E7318] hover:to-[#855F14] shadow-[0_12px_28px_rgba(133,95,20,0.28)] hover:shadow-[0_16px_36px_rgba(133,95,20,0.38)] flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Sending OTP Code...' : 'Login →'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Step 2: 6-Digit OTP Verification Form */
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="flex items-center justify-between text-xs text-stone-600 font-medium px-1 bg-[#FAF5EB] p-2 rounded-xl border border-[#E8D7B8]">
                  <span>Dispatched to: <b className="text-stone-900">{identifier}</b></span>
                  <button
                    type="button"
                    onClick={() => setOtpStep('enter_identifier')}
                    className="text-[#855F14] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Change</span>
                  </button>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-2.5 text-center">
                    ENTER 6-DIGIT VERIFICATION CODE
                  </label>
                  <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputsRef.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(e.target.value, idx)}
                        onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                        className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold text-stone-900 bg-white border-2 border-[#C59B27] rounded-xl focus:border-[#855F14] focus:ring-4 focus:ring-[#C59B27]/20 transition-all shadow-xs"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500 pt-1 px-1">
                  <span>Didn't receive code?</span>
                  {resendTimer > 0 ? (
                    <span className="text-stone-400 font-medium">Resend in {resendTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-[#855F14] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Resend Code</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-[#855F14] via-[#B8860B] to-[#75500A] hover:from-[#9E7318] hover:to-[#855F14] shadow-[0_12px_28px_rgba(133,95,20,0.28)] hover:shadow-[0_16px_36px_rgba(133,95,20,0.38)] flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Verifying Code...' : 'Verify & Enter Sanctuary →'}</span>
                </button>
              </form>
            )}

            {/* Beautified Security Indicators in Royal Gold */}
            <div className="flex justify-center pt-1">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#FAF5EB] border border-[#E8D7B8] text-xs text-stone-600 font-medium shadow-xs">
                <span className="flex items-center gap-1.5 text-[#855F14]">
                  <Lock className="w-3.5 h-3.5 text-[#855F14]" />
                  <span className="text-stone-700 font-semibold">Passwordless</span>
                </span>
                <span className="text-stone-300">•</span>
                <span className="flex items-center gap-1.5 text-[#855F14]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#855F14]" />
                  <span className="text-stone-700 font-semibold">256-Bit Encrypted</span>
                </span>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="text-center text-xs sm:text-sm text-stone-500 font-medium pt-2 border-t border-[#DFBC77]/25 space-y-1.5">
              <div>
                Don't have an account?{' '}
                <Link to="/register" className="text-[#855F14] font-bold hover:underline ml-1">
                  Sign Up
                </Link>
              </div>

              {!isAdminMode && (
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdminMode(true);
                      setErrorMessage('');
                    }}
                    className="text-[11px] text-stone-400 hover:text-[#855F14] transition-colors cursor-pointer"
                  >
                    Staff Portal Access
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
