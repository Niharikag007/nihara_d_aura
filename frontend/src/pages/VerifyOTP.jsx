import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

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
      id: 'usr_amit_kumar',
      name: 'Amit Kumar',
      email: 'amitky2056@gmail.com',
      phone: '+91 8004116370',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      tier: 'Royal Elite',
      rewardPoints: 450
    });
    showToast('OTP verified successfully!', 'success');
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#DFBC77]/50 p-6 sm:p-10 max-w-md w-full shadow-xl space-y-6 text-center">
        
        <div className="w-14 h-14 rounded-full bg-[#FAF3E8] border border-[#DFBC77] text-[#C59B27] flex items-center justify-center mx-auto shadow-inner">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900">
            Verify Security Code
          </h1>
          <p className="text-sm font-medium text-stone-600 mt-1">
            Enter the 6-digit code sent to <strong className="text-stone-900 font-bold">+91 8004116370</strong>
          </p>
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
