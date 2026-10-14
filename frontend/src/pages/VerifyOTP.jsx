import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Logo from '../components/common/Logo';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);

  const handleOtpChange = (val, idx) => {
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    login({
      id: 'usr_patron_' + Date.now(),
      name: 'Nihara Patron',
      email: 'patron@niharadaura.com',
      phone: '+91 98765 43210',
      avatar: '/hero-slide-1.jpg',
      tier: 'Royal Patron',
      rewardPoints: 500
    });
    showToast('OTP verified successfully! Welcome to Nihara.', 'success');
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 py-12">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#DFBC77]/50 p-6 sm:p-10 max-w-md w-full shadow-2xl space-y-6 text-center">
        
        <div className="space-y-3">
          <Link to="/" className="inline-block group transition-transform duration-300 hover:scale-105" title="Return to Nihara D'Aura Home">
            <div className="p-1 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F5E6C4] to-[#AA7C11] shadow-md inline-block">
              <Logo className="h-16 sm:h-20 w-auto rounded-full object-contain mx-auto" />
            </div>
          </Link>

          <div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C733E] block">
              TWO-FACTOR AUTHENTICATION
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1C1917] tracking-tight mt-1">
              Verify Security Code
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
              Enter the 6-digit verification code dispatched to your registered phone or email
            </p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center gap-2.5">
            {otp.map((digit, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, i)}
                className="w-12 h-14 text-center text-xl font-extrabold text-stone-900 rounded-xl border-2 border-stone-300 bg-[#FCF9F2] focus:bg-white focus:outline-none focus:border-[#C59B27] focus:ring-4 focus:ring-[#C59B27]/15 transition-all shadow-inner"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full btn-gold py-3.5 sm:py-4 rounded-xl text-sm uppercase tracking-wider font-extrabold shadow-md hover:shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <span>Verify & Enter</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-sm font-medium text-stone-600">
          Didn't receive the code?{' '}
          <button onClick={() => showToast('New OTP dispatched: 123456', 'info')} className="text-[#855F14] font-bold hover:underline ml-1">
            Resend OTP
          </button>
        </p>

      </div>
    </div>
  );
}
