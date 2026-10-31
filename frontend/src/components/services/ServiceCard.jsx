import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Star, Sparkles, ArrowRight, CheckCircle2, MapPin } from 'lucide-react';

// Explicit mapping to authentic, high-resolution real photography assets
const REAL_SERVICE_IMAGES = {
  srv_bridal_glow: '/hero-slide-1.jpg',
  'royal-bridal-glow-makeup-package': '/hero-slide-1.jpg',
  srv_celebrity_glam: '/hero-slide-4.jpg',
  'celebrity-glam-party-makeup': '/hero-slide-4.jpg',
  srv_quartz_nails: '/hero-slide-8.jpg',
  'rose-quartz-luxe-gel-nail-extensions': '/hero-slide-8.jpg',
  srv_hd_engagement: '/hero-slide-7.jpg',
  srv_sangeet_shimmer: '/hero-slide-5.jpg',
  srv_gold_facial_makeup: '/hero-slide-2.jpg',
  srv_styling_consultation: '/hero-slide-3.jpg'
};

export default function ServiceCard({ service }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  // Pick guaranteed real photography asset
  const preferredRealImg = REAL_SERVICE_IMAGES[service.id] || REAL_SERVICE_IMAGES[service.slug];
  const displayImage = imgError 
    ? (preferredRealImg || '/hero-slide-1.jpg') 
    : (preferredRealImg || service.image || '/hero-slide-1.jpg');

  const handleBookNow = () => {
    navigate(`/book?serviceId=${service.id}`);
  };

  // Curated highlight perks for signature display
  const keyPerks = service.inclusions && service.inclusions.length > 0 
    ? service.inclusions.slice(0, 3) 
    : [
        'HD Airbrush & Skin Radiance Prep',
        'Master Artist & Custom Styling',
        '100% Satisfaction Guarantee'
      ];

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#DFBC77]/45 bg-white shadow-[0_18px_34px_-24px_rgba(88,64,22,0.5)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#C59B27]/80 hover:shadow-[0_26px_48px_-24px_rgba(88,64,22,0.6)] will-change-transform transform-gpu">
      
      {/* 1. Real Cinematic High-Res Image Banner */}
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-stone-900">
        <img
          src={displayImage}
          alt={service.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1 bg-stone-950/80 backdrop-blur-md text-amber-200 border border-amber-400/40 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>{service.category}</span>
          </span>

          <span className="inline-flex items-center gap-1 bg-stone-950/80 backdrop-blur-md text-stone-200 border border-white/20 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>{service.durationMinutes} Mins</span>
          </span>
        </div>

        {/* Bottom Overlays */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white text-xs z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1 font-bold bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{service.rating} ({service.reviewCount} reviews)</span>
          </span>

          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-200/90 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
            <MapPin className="w-3 h-3 text-amber-300" />
            <span>Salon / At-Home</span>
          </span>
        </div>
      </div>

      {/* 2. Card Content Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
        
        <div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1C1917] group-hover:text-[#A87D17] transition-colors leading-snug line-clamp-1">
            {service.name}
          </h3>

          <p className="text-xs text-stone-500 font-light mt-1.5 line-clamp-2 leading-relaxed">
            {service.description}
          </p>

          {/* Key Inclusions Pills */}
          <div className="mt-3.5 space-y-1.5 pt-3 border-t border-[#DFBC77]/25">
            {keyPerks.map((perk, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-stone-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate font-medium">{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Footer: Price & Royal CTA */}
        <div className="pt-4 border-t border-[#DFBC77]/30 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block leading-tight">
              Complete Ritual
            </span>
            <span className="text-xl sm:text-2xl font-serif font-black text-[#1C1917]">
              ₹{service.price.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={handleBookNow}
            className="btn-gold px-4 sm:px-5 py-2.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] flex items-center gap-1.5 shadow-md hover:shadow-xl active:scale-95 transition-all"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
