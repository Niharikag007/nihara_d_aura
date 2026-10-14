import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Star, Sparkles, ArrowRight } from 'lucide-react';

export default function ServiceCard({ service }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const fallbackImg = '/hero-slide-2.jpg';
  const displayImage = imgError ? fallbackImg : (service.image || fallbackImg);

  const handleBookNow = () => {
    navigate(`/book?serviceId=${service.id}`);
  };

  return (
    <div className="group bg-white rounded-2xl border border-[#DFBC77]/35 p-3.5 sm:p-5 shadow-sm hover:shadow-lg hover:border-[#C59B27]/70 transition-all duration-300 flex items-center justify-between gap-4 will-change-transform transform-gpu hover:-translate-y-0.5">
      
      {/* Left: Thumbnail & Info */}
      <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#FBF8F2] flex-shrink-0 border border-[#E8DFC8] relative shadow-inner">
          <img
            src={displayImage}
            alt={service.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        <div className="min-w-0 flex-1">
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#A87D17] bg-[#FCF9F2] px-2.5 py-0.5 rounded-full border border-[#DFBC77]/40 mb-1">
            {service.category}
          </span>
          <h4 className="font-serif text-sm sm:text-base font-bold text-[#1C1917] truncate group-hover:text-[#C59B27] transition-colors">
            {service.name}
          </h4>
          <div className="flex items-center gap-2.5 text-xs text-stone-500 mt-1 flex-wrap">
            <span className="flex items-center gap-1 font-medium text-stone-600">
              <Clock className="w-3.5 h-3.5 text-[#C59B27]" />
              {service.durationMinutes} Mins
            </span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-1 font-semibold text-stone-800">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {service.rating} ({service.reviewCount})
            </span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-[#1C1917] mt-1 sm:hidden">
            ₹{service.price.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Right: Price & Book Now CTA */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <span className="hidden sm:block text-base font-bold text-[#1C1917]">
          ₹{service.price.toLocaleString('en-IN')}
        </span>
        <button
          onClick={handleBookNow}
          className="btn-gold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Book Now</span>
        </button>
      </div>

    </div>
  );
}

