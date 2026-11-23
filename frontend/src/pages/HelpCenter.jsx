import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Phone, Mail, MapPin, Clock, Headphones } from 'lucide-react';

export default function HelpCenter() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDF9] to-[#F9F5EE] px-4 py-4 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#C59B27] to-[#A87D17] rounded-3xl p-5 mb-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <Headphones className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white font-serif">
              Help Center
            </h1>
          </div>
          <p className="text-white/90 mt-3 text-base font-medium text-center">
            How can we help you today?
          </p>
        </div>

        {/* Contact Options Grid - Now 2 items in 1 row */}
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center hover:border-[#C59B27] hover:shadow-lg hover:scale-105 transition-all cursor-pointer group">
            <div className="w-16 h-16 rounded-full bg-[#FAF3E8] text-[#C59B27] flex items-center justify-center mx-auto mb-4 group-hover:bg-[#C59B27] group-hover:text-white transition-all">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-[#1C1917] text-xl mb-2">Call Us</h3>
            <p className="text-stone-500 text-base">Mon-Sat 11AM - 7PM</p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center hover:border-[#C59B27] hover:shadow-lg hover:scale-105 transition-all cursor-pointer group">
            <div className="w-16 h-16 rounded-full bg-[#FAF3E8] text-[#C59B27] flex items-center justify-center mx-auto mb-4 group-hover:bg-[#C59B27] group-hover:text-white transition-all">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-[#1C1917] text-xl mb-2">Email Us</h3>
            <p className="text-stone-500 text-base">Response in 24 hours</p>
          </div>
        </div>

        {/* Full Details Section - Separate Cards */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-[#1C1917] font-serif mb-4">Full Details</h2>

          {/* Head Office Address Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 hover:border-[#C59B27] hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF3E8] text-[#C59B27] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#1C1917] mb-1 text-base">Head Office Address</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                 423 A, 4th Floor, Tower 3, NX One Tower, Greater Noida (West), UP - 201306
                </p>
              </div>
            </div>
          </div>

          {/* Customer Support Line Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 hover:border-[#C59B27] hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF3E8] text-[#C59B27] flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#1C1917] mb-1 text-base">Customer Support Line</h3>
                <p className="text-[#C59B27] font-bold text-base">+91 92660 59846</p>
              </div>
            </div>
          </div>

          {/* Official Email Support Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 hover:border-[#C59B27] hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF3E8] text-[#C59B27] flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#1C1917] mb-1 text-base">Official Email Support</h3>
                <p className="text-[#C59B27] font-bold text-base">support@niharadaura.com</p>
              </div>
            </div>
          </div>

          {/* Operational Hours Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 hover:border-[#C59B27] hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF3E8] text-[#C59B27] flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#1C1917] mb-1 text-base">Operational Hours</h3>
                <p className="text-stone-600 text-sm">
                  Mon - Sat: 11:00 AM - 07:00 PM
                </p>
                <p className="text-stone-600 text-sm">
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
