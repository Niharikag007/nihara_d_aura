import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Mail, 
  Lock, 
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
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

  // Admin Mode detection (only if explicitly navigated with ?role=admin or /admin redirect)
  const [isAdminMode, setIsAdminMode] = useState(
    roleParam === 'admin' || redirectParam === '/admin'
  );

  // Authentication mode for users: 'otp' | 'password'
  const [authMethod, setAuthMethod] = useState('otp');
  // OTP flow step: 'enter_email' | 'enter_otp'
  const [otpStep, setOtpStep] = useState('enter_email');

  // Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // 6-digit OTP array
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputsRef = useRef([]);

  // States
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

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
      return <Navigate to={redirectParam && redirectParam !== '/admin' ? redirectParam : '/'} replace />;
    }
  }

  // Handle Send OTP
  const handleSendOtp = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOtpStep('enter_otp');
      setResendTimer(45);
      // Pre-fill a demo OTP code for instant smooth user experience if desired, or keep clear
      setOtp(['', '', '', '', '', '']);
      showToast(`Verification code sent to ${cleanEmail}. (Code: 123456)`, 'info');
      // Auto-focus first OTP input
      setTimeout(() => {
        if (otpInputsRef.current[0]) {
          otpInputsRef.current[0].focus();
        }
      }, 150);
    }, 600);
  };

  // Handle OTP digit changes
  const handleOtpDigitChange = (val, idx) => {
    // Only accept numeric or clean string
    const cleaned = val.replace(/[^0-9]/g, '');
    const newOtp = [...otp];

    if (cleaned.length > 1) {
      // Pasting full code
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

    // Auto-advance
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
    showToast(`Fresh OTP dispatched to ${email}. (Code: 123456)`, 'info');
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
      const cleanEmail = email.trim();
      const patronName = cleanEmail.split('@')[0] || 'Nihara Patron';
      // Capitalize first letter of name
      const formattedName = patronName.charAt(0).toUpperCase() + patronName.slice(1);

      const res = login({
        id: 'usr_' + Date.now(),
        name: formattedName,
        email: cleanEmail,
        phone: '+91 92660 59846',
        avatar: '/hero-slide-1.jpg',
        tier: 'Royal Patron',
        rewardPoints: 500,
        role: 'user'
      });

      setIsSubmitting(false);
      if (res?.success) {
        showToast(`Welcome back, ${formattedName}! Patron session active.`, 'success');
        navigate(redirectParam && redirectParam !== '/admin' ? redirectParam : '/');
      } else {
        setErrorMessage(res?.message || 'Verification failed. Please try again.');
      }
    }, 500);
  };

  // Submit Password Login
  const handlePasswordLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const cleanEmail = email.trim().toLowerCase();

    if (isAdminMode) {
      // Admin RBAC verification
      if (cleanEmail !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
        setIsSubmitting(false);
        setErrorMessage('Invalid Administrator Credentials. Access restricted to authorized personnel.');
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
        showToast('Welcome, Administrator. Admin Portal Access Granted.', 'success');
        navigate(redirectParam || '/admin');
      } else {
        setErrorMessage(res?.message || 'Administrator authentication failed.');
      }
    } else {
      // User Password Login
      const patronName = cleanEmail.split('@')[0] || 'Nihara Patron';
      const formattedName = patronName.charAt(0).toUpperCase() + patronName.slice(1);

      const res = login({
        id: 'usr_' + Date.now(),
        name: formattedName,
        email: cleanEmail,
        phone: '+91 92660 59846',
        avatar: '/hero-slide-1.jpg',
        tier: 'Royal Patron',
        rewardPoints: 500,
        role: 'user'
      });

      setIsSubmitting(false);
      if (res?.success) {
        showToast(`Welcome to Nihara D'Aura!`, 'success');
        navigate(redirectParam && redirectParam !== '/admin' ? redirectParam : '/');
      }
    }
  };

  return (
    <div className="min-h-[88vh] bg-[#FAF7F2] flex items-center justify-center p-4 py-12 relative overflow-hidden">
      
      {/* Ambient Luxury Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-[#DFBC77]/20 via-[#DFBC77]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-80 h-80 bg-[#C59B27]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-10 w-80 h-80 bg-[#855F14]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Luxury Login Card */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-[#DFBC77]/60 p-6 sm:p-10 max-w-md w-full shadow-[0_20px_50px_rgba(133,95,20,0.12)] space-y-6 relative z-10 transition-all">
        
        {/* Full Official Nihara D'Aura Brand Logo (Matching Home Page) */}
        <div className="text-center">
          <Link 
            to="/" 
            className="inline-flex flex-col items-center group transition-transform duration-300 hover:scale-105" 
            title="Return to Nihara D'Aura Home"
          >
            {/* Golden Circular Seal Frame */}
            <div className="p-1 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F5E6C4] to-[#AA7C11] shadow-lg flex-shrink-0 mb-3">
              <Logo className="h-20 sm:h-24 w-auto rounded-full object-contain mx-auto" alt="Nihara D'Aura Haute Luxury & Salon" />
            </div>

            {/* Brand Typography (Identical to Homepage Navbar) */}
            <div className="flex flex-col items-center">
              <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1C1917] group-hover:text-[#C59B27] transition-colors leading-none">
                Nihara <span className="text-[#C59B27] italic font-serif">D'Aura</span>
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-extrabold text-[#8C733E] mt-1.5">
                Jewellery & Makeup | Haute Luxury
              </span>
            </div>
          </Link>

          {/* Subtitle / Header */}
          <div className="mt-4 pt-3 border-t border-[#DFBC77]/30">
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917] tracking-tight">
              {isAdminMode 
                ? 'Administrator Access' 
                : otpStep === 'enter_otp' 
                  ? 'Verify Security OTP' 
                  : 'Sign In to Your Sanctuary'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
              {isAdminMode
                ? 'Authorized console for luxury catalogue & salon bookings'
                : otpStep === 'enter_otp'
                  ? `Enter the 6-digit code sent to ${email}`
                  : 'Enter your email to receive an instant secure login OTP'}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* -------------------- ADMIN MODE FORM -------------------- */}
        {isAdminMode ? (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-800 block mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@niharadaura.com"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 bg-[#FCF9F2] focus:bg-white focus:outline-none focus:border-[#C59B27] focus:ring-4 focus:ring-[#C59B27]/15 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-800 block mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 bg-[#FCF9F2] focus:bg-white focus:outline-none focus:border-[#C59B27] focus:ring-4 focus:ring-[#C59B27]/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl text-xs uppercase tracking-wider font-extrabold shadow-md hover:shadow-xl flex items-center justify-center gap-2 mt-2 bg-gradient-to-r from-[#9E7318] to-[#69480C] text-white hover:opacity-95 transition-all active:scale-[0.99]"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Access Admin Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsAdminMode(false);
                  setErrorMessage('');
                  setEmail('');
                  setPassword('');
                }}
                className="text-xs text-[#855F14] font-semibold hover:underline"
              >
                ← Return to Patron Login
              </button>
            </div>
          </form>
        ) : (
          /* -------------------- USER EMAIL & OTP LOGIN -------------------- */
          <div className="space-y-5">
            {authMethod === 'otp' ? (
              <>
                {otpStep === 'enter_email' ? (
                  /* Step 1: Enter Email to Get OTP */
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-800 block mb-1.5">
                        Your Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                          <Mail className="w-4 h-4 text-[#A87D17]" />
                        </div>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="patron@gmail.com"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 bg-[#FCF9F2] focus:bg-white focus:outline-none focus:border-[#C59B27] focus:ring-4 focus:ring-[#C59B27]/15 transition-all"
                        />
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#A87D17]" />
                        <span>A 6-digit one-time code will be dispatched to this email.</span>
                      </p>
                    </div>

                    {/* Primary OTP Action Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-gold py-3.5 rounded-xl text-xs uppercase tracking-wider font-extrabold shadow-md hover:shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                    >
                      <span>{isSubmitting ? 'Sending OTP Code...' : 'Get Secure Login OTP'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* Switch to Password Option */}
                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMethod('password');
                          setErrorMessage('');
                        }}
                        className="text-xs text-[#855F14] font-semibold hover:underline"
                      >
                        Sign in using password instead
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Step 2: Enter 6-Digit OTP */
                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    {/* Active Email Pill with Edit Action */}
                    <div className="flex items-center justify-between p-2.5 px-3 rounded-xl bg-[#FAF5EB] border border-[#DFBC77]/50 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-stone-700 truncate font-medium">{email}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpStep('enter_email');
                          setErrorMessage('');
                        }}
                        className="text-[#855F14] hover:text-[#5c400a] font-bold flex items-center gap-1 shrink-0 ml-2"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Change</span>
                      </button>
                    </div>

                    {/* 6 Digit Inputs */}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-800 block text-center mb-2.5">
                        Enter 6-Digit Code
                      </label>
                      <div className="flex justify-center gap-2 sm:gap-2.5">
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
                            className="w-10 sm:w-12 h-12 sm:h-14 text-center text-lg sm:text-xl font-extrabold text-stone-900 rounded-xl border-2 border-stone-300 bg-[#FCF9F2] focus:bg-white focus:outline-none focus:border-[#C59B27] focus:ring-4 focus:ring-[#C59B27]/15 transition-all shadow-inner"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Resend Timer / Action */}
                    <div className="text-center text-xs">
                      {resendTimer > 0 ? (
                        <span className="text-stone-500 font-medium">
                          Resend OTP in <strong className="text-[#855F14]">{resendTimer}s</strong>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="text-[#855F14] hover:text-[#5c400a] font-bold inline-flex items-center gap-1 hover:underline"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Resend OTP Code</span>
                        </button>
                      )}
                    </div>

                    {/* Verify & Enter Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-gold py-3.5 rounded-xl text-xs uppercase tracking-wider font-extrabold shadow-md hover:shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                    >
                      <span>{isSubmitting ? 'Verifying Code...' : 'Verify & Enter Sanctuary'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </>
            ) : (
              /* Password Login Alternative */
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-800 block mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Mail className="w-4 h-4 text-[#A87D17]" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="patron@gmail.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 bg-[#FCF9F2] focus:bg-white focus:outline-none focus:border-[#C59B27] focus:ring-4 focus:ring-[#C59B27]/15 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-800 block mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Lock className="w-4 h-4 text-[#A87D17]" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-3 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 bg-[#FCF9F2] focus:bg-white focus:outline-none focus:border-[#C59B27] focus:ring-4 focus:ring-[#C59B27]/15 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-gold py-3.5 rounded-xl text-xs uppercase tracking-wider font-extrabold shadow-md hover:shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                >
                  <span>{isSubmitting ? 'Signing In...' : 'Sign In to Sanctuary'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('otp');
                      setErrorMessage('');
                    }}
                    className="text-xs text-[#855F14] font-semibold hover:underline"
                  >
                    ← Sign in with One-Time Password (OTP)
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-Bit SSL Encrypted • Confidential Patron Privacy</span>
        </div>

        {/* Footer Navigation: Create Account & Discreet Admin Link */}
        <div className="text-center text-xs text-stone-600 pt-3 border-t border-stone-200 font-medium space-y-1.5">
          <div>
            New to Nihara D'Aura?{' '}
            <Link to="/register" className="text-[#855F14] font-bold hover:underline ml-1">
              Create an Account
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
                className="text-[11px] text-stone-400 hover:text-[#855F14] transition-colors"
              >
                Staff Portal Access
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
