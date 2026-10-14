import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Sparkles, ShieldCheck, Clock, Award } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#362F27] via-[#1A1815] to-[#0A0908] text-stone-300 pt-16 pb-24 md:pb-12 border-t-2 border-[#D4AF37]/50 shadow-[0_-10px_35px_rgba(212,175,55,0.12)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Props Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-[#D4AF37]/20 text-stone-200 text-sm">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-[#DFBC77] flex-shrink-0" />
            <div>
              <p className="font-semibold text-white">Certified Authenticity</p>
              <p className="text-xs text-stone-200 font-medium">100% hallmarked & certified jewellery</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-[#DFBC77] flex-shrink-0" />
            <div>
              <p className="font-semibold text-white">Clean Formulations</p>
              <p className="text-xs text-stone-200 font-medium">Dermatologist-approved botanicals</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-[#DFBC77] flex-shrink-0" />
            <div>
              <p className="font-semibold text-white">Master Salon Stylists</p>
              <p className="text-xs text-stone-200 font-medium">Flagship salon & at-home appointments</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#DFBC77] flex-shrink-0" />
            <div>
              <p className="font-semibold text-white">Guaranteed Safe Delivery</p>
              <p className="text-xs text-stone-200 font-medium">Complimentary velvet gift packing</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          
          {/* Brand Manifesto */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-3.5 group py-1 flex-shrink-0" title="Nihara D'Aura Haute Luxury">
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F5E6C4] to-[#AA7C11] shadow-md group-hover:scale-105 transition-transform duration-300">
                <Logo className="h-14 sm:h-16 w-auto rounded-full" alt="Nihara D'Aura Haute Luxury & Salon" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-serif text-xl sm:text-2xl font-extrabold tracking-tight text-white group-hover:text-[#DFBC77] transition-colors leading-none">
                  Nihara <span className="text-[#DFBC77] italic font-serif">D'Aura</span>
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] font-extrabold text-[#DFBC77] mt-1.5">
                  Jewellery & Makeup
                </span>
              </div>
            </Link>
            <p className="text-xs text-stone-200 leading-relaxed font-medium">
              Curating royal elegance for modern connoisseurs. From heirloom Kundan jewellery to weightless silk cosmetics and sanctuary home scents.
            </p>
          </div>

          {/* Quick Links: Products */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-wider text-[#DFBC77] font-bold mb-4">
              Luxury Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-200 font-medium">
              <li><Link to="/products?category=Makeup" className="hover:text-[#DFBC77] transition-colors">Silk Foundations & Lipsticks</Link></li>
              <li><Link to="/products?category=Jewellery" className="hover:text-[#DFBC77] transition-colors">Kundan & Polki Chandbalis</Link></li>
              <li><Link to="/products?category=Nails" className="hover:text-[#DFBC77] transition-colors">Rose Quartz Press-On Nails</Link></li>
              <li><Link to="/products?category=Candles" className="hover:text-[#DFBC77] transition-colors">Soy Wax Mogra Candles</Link></li>
              <li><Link to="/products" className="hover:text-[#DFBC77] transition-colors">All Products Catalogue</Link></li>
            </ul>
          </div>

          {/* Salon & Appointments */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-wider text-[#DFBC77] font-bold mb-4">
              Salon & Styling
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-200 font-medium">
              <li><Link to="/book" className="hover:text-white transition-colors font-bold text-[#DFBC77]">Book Bridal Appointment</Link></li>
              <li><Link to="/services" className="hover:text-[#DFBC77] transition-colors">Celebrity Glam Party Makeup</Link></li>
              <li><Link to="/services" className="hover:text-[#DFBC77] transition-colors">Gel Nail Extensions & Art</Link></li>
              <li><Link to="/services" className="hover:text-[#DFBC77] transition-colors">Jewellery & Silhouette Trial</Link></li>
              <li><Link to="/bookings" className="hover:text-[#DFBC77] transition-colors">Track My Appointments</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-wider text-[#DFBC77] font-bold mb-4">
              Contact Details
            </h4>
            <div className="text-xs text-stone-100 font-medium space-y-3">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#DFBC77] flex-shrink-0 mt-0.5" />
                <span>423 A, 4th Floor, Tower 3, NX One Tower, Greater Noida (West), UP - 201306</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#DFBC77] flex-shrink-0" />
                <span>+91 92660 59846</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#DFBC77] flex-shrink-0" />
                <a href="mailto:niharikagautam007@gmail.com" className="hover:text-amber-200 transition-colors">
                  niharikagautam007@gmail.com
                </a>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Rights */}
        <div className="border-t border-[#D4AF37]/20 pt-6 text-center text-xs text-stone-300 font-medium flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Nihara D Aura. All rights reserved. Registered Luxury House.</p>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Bespoke Concierge</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
