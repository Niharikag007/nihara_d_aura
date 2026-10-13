import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Crown, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      id: `usr_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      tier: 'Silver',
      rewardPoints: 100
    });
    showToast('Welcome to Nihara D Aura! 100 Welcome Points Awarded.', 'success');
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#DFBC77]/50 p-6 sm:p-10 max-w-md w-full shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#C59B27] to-[#DFBC77] text-white flex items-center justify-center mx-auto shadow-md">
            <Crown className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900">
            Join Nihara Luxury
          </h1>
          <p className="text-sm font-medium text-stone-600 leading-snug">
            Create an account to track orders and unlock bespoke salon appointments
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-800 block mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ananya Roy"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm sm:text-base font-semibold text-stone-900 bg-[#FCF9F2] focus:bg-white focus:outline-none focus:border-[#C59B27] focus:ring-4 focus:ring-[#C59B27]/15 transition-all shadow-inner"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-800 block mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="ananya@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm sm:text-base font-semibold text-stone-900 bg-[#FCF9F2] focus:bg-white focus:outline-none focus:border-[#C59B27] focus:ring-4 focus:ring-[#C59B27]/15 transition-all shadow-inner"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-800 block mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm sm:text-base font-semibold text-stone-900 bg-[#FCF9F2] focus:bg-white focus:outline-none focus:border-[#C59B27] focus:ring-4 focus:ring-[#C59B27]/15 transition-all shadow-inner"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-800 block mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm sm:text-base font-semibold text-stone-900 bg-[#FCF9F2] focus:bg-white focus:outline-none focus:border-[#C59B27] focus:ring-4 focus:ring-[#C59B27]/15 transition-all shadow-inner"
            />
          </div>

          <button
            type="submit"
            className="w-full btn-gold py-3.5 sm:py-4 rounded-xl text-sm uppercase tracking-wider font-extrabold shadow-md hover:shadow-xl flex items-center justify-center gap-2 mt-4 transition-all"
          >
            <span>Register Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs sm:text-sm text-stone-600 pt-3 border-t border-stone-200 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-[#855F14] font-bold hover:underline ml-1">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
