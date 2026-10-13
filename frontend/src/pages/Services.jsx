import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Clock, Star, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { mockData } from '../services/mockData';
import ServiceCard from '../components/services/ServiceCard';

export default function Services() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Makeup', 'Nails', 'Jewellery & Styling'];

  const filteredServices = activeFilter === 'All'
    ? mockData.services
    : mockData.services.filter(s => s.category.toLowerCase().includes(activeFilter.toLowerCase()));

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1C1917] via-[#2D241E] to-[#453625] text-white p-6 sm:p-10 mb-10 shadow-xl border border-[#DFBC77]/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#C59B27]/30 text-amber-200 border border-[#C59B27]/40">
            <Sparkles className="w-3.5 h-3.5" />
            HAUTE BEAUTY & SALON
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Signature Salon & <br className="hidden sm:inline" />
            <span className="text-[#DFBC77] italic font-normal">At-Home Luxury Rituals</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
            Experience bespoke salon perfection at our NX One Tower Flagship Salon or indulge in private master therapist visits in the comfort of your sanctuary.
          </p>
        </div>

        {/* Flagship Salon Info Card */}
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-xs space-y-2 flex-shrink-0 w-full md:w-72">
          <p className="font-serif font-bold text-amber-200 text-sm flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#DFBC77]" />
            NX One Tower Flagship Salon
          </p>
          <p className="text-stone-300">423 A, 4th Floor, Tower 3, NX One Tower, Greater Noida (West), UP - 201306</p>
          <p className="text-stone-400">Hours: 09:00 AM - 08:30 PM (Daily)</p>
          <Link
            to="/book"
            className="block text-center btn-gold py-2 rounded-xl text-xs font-bold uppercase tracking-wider mt-3"
          >
            Start Booking Flow
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#A67C37] text-white shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-[#DFBC77]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Services Listing */}
      <div className="space-y-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-3xl border border-[#DFBC77]/40 p-5 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
          >
            {/* Image & Main Info */}
            <div className="flex flex-col sm:flex-row gap-5 flex-1">
              <div className="w-full sm:w-36 sm:h-36 aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden bg-[#FBF8F2] flex-shrink-0 border border-stone-200">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#A87D17] bg-[#FCF9F2] px-2.5 py-0.5 rounded-full border border-[#DFBC77]/40">
                    {service.category}
                  </span>
                  <div className="flex items-center text-xs font-semibold text-stone-700">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                    {service.rating} ({service.reviewCount} Reviews)
                  </div>
                </div>

                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1C1917]">
                  {service.name}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed max-w-2xl">
                  {service.description}
                </p>

                {/* Inclusions */}
                {service.inclusions && (
                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-stone-500">
                    {service.inclusions.slice(0, 4).map((inc, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B27] flex-shrink-0" />
                        <span className="truncate">{inc}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Price & Booking Trigger */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-stone-100 gap-4 flex-shrink-0">
              <div className="text-left sm:text-right">
                <span className="text-xs text-stone-400 block">Starting at</span>
                <span className="text-xl sm:text-2xl font-bold text-[#1C1917]">
                  ₹{service.price.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5 justify-start sm:justify-end">
                  <Clock className="w-3 h-3" />
                  {service.durationMinutes} Minutes Session
                </span>
              </div>

              <Link
                to={`/book?serviceId=${service.id}`}
                className="btn-gold px-6 py-3 rounded-full text-xs uppercase tracking-wider font-bold shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <span>Book Service</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
