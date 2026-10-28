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
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-4 py-12 relative overflow-hidden selection:bg-[#C59B27] selection:text-white">
      {/* Subtle soft warmth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#DFBC77]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-white rounded-[32px] sm:rounded-[36px] border border-[#EBE5D8] p-7 sm:p-10 max-w-sm sm:max-w-md w-full shadow-[0_20px_50px_rgba(0,0,0,0.06)] space-y-6 text-center relative z-10 transition-all">
        
        <div className="space-y-3.5">
          {/* Squircle Logo Container */}
          <div className="flex justify-center">
            <Link to="/" title="Return to Nihara D'Aura Home" className="group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#FCFAF6] border border-[#DFBC77]/40 flex items-center justify-center p-2.5 shadow-xs transition-transform duration-300 group-hover:scale-105">
                <Logo className="w-full h-full object-contain" alt="Nihara D'Aura" />
              </div>
            </Link>
          </div>

          {/* Pill Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#DFBC77]/60 bg-[#FAF7F2] text-[#855F14] text-[10.5px] font-semibold tracking-wider uppercase shadow-xs">
              <span>HAUTE JEWELLERY & BEAUTY</span>
            </div>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Nihara D'Aura
          </h2>

          {/* Back button */}
          <div className="text-left -mb-1 pt-1">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-600 hover:text-[#855F14] transition-colors cursor-pointer"
            >
              ← Back
            </Link>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-[26px] font-bold text-stone-900 tracking-tight">
              Verify Code
            </h1>
            <div className="space-y-1.5 pt-0.5">
              <p className="text-sm text-stone-500 font-normal leading-relaxed">
                Enter the 6-digit code sent to
              </p>
              <div className="inline-block px-3 py-1 rounded-xl bg-[#FAF7F2] text-stone-800 text-xs font-semibold border border-[#E8DFC8] tracking-wide shadow-2xs">
                patron@niharadaura.com
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-6 pt-1">
          <div className="flex items-center justify-center gap-2 sm:gap-2.5">
            {otp.map((digit, i) => (
              <input
                key={i}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, i)}
                className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-2xl transition-all shadow-xs ${
                  digit || i === 0
                    ? 'border-2 border-[#855F14] bg-white text-stone-900 focus:outline-none focus:ring-4 focus:ring-[#C59B27]/15'
                    : 'border border-stone-200 bg-[#FAF8F5] text-stone-900 focus:border-2 focus:border-[#855F14] focus:bg-white focus:outline-none'
                }`}
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl font-bold text-base text-white bg-[#855F14] hover:bg-[#6e4d0d] active:scale-[0.99] shadow-[0_8px_20px_rgba(133,95,20,0.25)] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Verify & Access Account</span>
          </button>

          <div className="text-center text-xs text-stone-500 font-medium space-y-1 pt-1">
            <p>Resend code available in</p>
            <p className="text-[#855F14] font-bold text-sm tracking-widest font-mono">
              00:45
            </p>
          </div>
        </form>

      </div>
    </div>
  );
}
