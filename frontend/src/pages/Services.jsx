import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Sparkles, Clock, Star, MapPin, CheckCircle2, ArrowRight, Loader2, Mail } from 'lucide-react';
import { useServices } from '../context/ServiceContext';

export default function Services() {
  const navigate = useNavigate();
  const { id: categoryParam } = useParams();
  const { services, salonInfo, loading } = useServices();
  const categoryFromRoute = ['makeup', 'salon'].includes(categoryParam?.toLowerCase())
    ? categoryParam[0].toUpperCase() + categoryParam.slice(1).toLowerCase()
    : 'All';
  const [activeFilter, setActiveFilter] = useState(categoryFromRoute);

  useEffect(() => {
    setActiveFilter(categoryFromRoute);
  }, [categoryFromRoute]);

  const serviceCategory = (service) => {
    const category = service.category?.trim().toLowerCase();
    if (category === 'makeup') return 'Makeup';
    if (['salon', 'nails', 'jewellery & styling', 'jewelry & styling'].includes(category)) return 'Salon';
    return 'Salon';
  };

  const filteredServices = useMemo(() => {
    if (!services) return [];
    if (activeFilter === 'All') return services;
    return services.filter(s => serviceCategory(s) === activeFilter);
  }, [services, activeFilter]);

  const chooseCategory = (category) => {
    setActiveFilter(category);
    navigate(category === 'All' ? '/services' : `/services/${category.toLowerCase()}`);
  };

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
            Makeup & Salon <br className="hidden sm:inline" />
            <span className="text-[#DFBC77] italic font-normal">Signature Beauty Rituals</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
            Explore makeup artistry and salon services at our NX One Tower flagship, with select beauty rituals available at home.
          </p>
        </div>

        {/* Flagship Salon Info Card */}
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-xs space-y-2 flex-shrink-0 w-full md:w-72">
          <p className="font-serif font-bold text-amber-200 text-sm flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#DFBC77]" />
            {salonInfo?.name || 'Flagship Salon'}
          </p>
          <p className="text-stone-300">{salonInfo?.address || '423 A, 4th Floor, NX One Tower, Greater Noida (West)'}</p>
          <p className="text-stone-400">Hours: {salonInfo?.hours || '09:00 AM - 08:30 PM (Daily)'}</p>
          <p className="text-stone-300 flex items-center gap-1.5 pt-0.5">
            <Mail className="w-3.5 h-3.5 text-[#DFBC77] flex-shrink-0" />
            <a href="mailto:support@niharadaura.com" className="hover:text-amber-200 transition-colors underline truncate">
              {salonInfo?.email || 'support@niharadaura.com'}
            </a>
          </p>
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
        {['All', 'Makeup', 'Salon'].map((cat) => {
          const isActive = activeFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => chooseCategory(cat)}
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
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#DFBC77]" />
          <p className="text-stone-500 font-serif italic text-sm">Retrieving bespoke salon services...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#DFBC77]/30 max-w-lg mx-auto">
          <Sparkles className="w-8 h-8 text-[#DFBC77] mx-auto mb-3" />
          <p className="font-serif text-lg font-bold text-stone-800">No services found in this ritual</p>
          <button
            onClick={() => chooseCategory('All')}
            className="mt-4 px-6 py-2 rounded-full btn-gold text-xs font-bold"
          >
            View All Services
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {(activeFilter === 'All' ? ['Makeup', 'Salon'] : [activeFilter]).map((group) => {
            const groupServices = filteredServices.filter((service) => serviceCategory(service) === group);
            if (!groupServices.length) return null;
            return (
              <section key={group} id={group.toLowerCase()} className="scroll-mt-28">
                {activeFilter === 'All' && (
                  <div className="mb-4 flex items-end justify-between border-b border-[#DFBC77]/40 pb-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A87D17]">Our collection</p>
                      <h2 className="mt-1 font-serif text-2xl font-bold text-[#1C1917]">{group}</h2>
                    </div>
                    <button onClick={() => chooseCategory(group)} className="text-xs font-semibold text-[#9b711e] hover:underline">
                      Explore {group}
                    </button>
                  </div>
                )}
                <div className="space-y-6">
          {groupServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl border border-[#DFBC77]/40 p-5 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
            >
              {/* Image & Main Info */}
              <div className="flex flex-col sm:flex-row gap-5 flex-1">
                <div className="w-full sm:w-36 sm:h-36 aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden bg-[#FBF8F2] flex-shrink-0 border border-stone-200">
                  <img
                    src={service.image && !service.image.includes('unsplash') ? service.image : (
                      service.id === 'srv_bridal_glow' ? '/hero-slide-1.jpg' :
                      service.id === 'srv_celebrity_glam' ? '/hero-slide-4.jpg' :
                      service.id === 'srv_quartz_nails' ? '/hero-slide-8.jpg' :
                      service.id === 'srv_hd_engagement' ? '/hero-slide-7.jpg' :
                      service.id === 'srv_sangeet_shimmer' ? '/hero-slide-5.jpg' :
                      service.id === 'srv_gold_facial_makeup' ? '/hero-slide-2.jpg' :
                      service.id === 'srv_styling_consultation' ? '/hero-slide-3.jpg' :
                      (service.image || '/hero-slide-1.jpg')
                    )}
                    alt={service.name}
                    onError={(e) => { e.currentTarget.src = '/hero-slide-1.jpg'; }}
                    className="w-full h-full object-cover"
                  />
                </div>

              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#A87D17] bg-[#FCF9F2] px-2.5 py-0.5 rounded-full border border-[#DFBC77]/40">
                    {serviceCategory(service)}
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
                </section>
              );
            })}
          </div>
      )}

    </div>
  );
}
