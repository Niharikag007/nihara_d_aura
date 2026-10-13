import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Star, Sparkles } from 'lucide-react';

export default function ServiceCard({ service }) {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(`/book?serviceId=${service.id}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#DFBC77]/30 p-3 sm:p-4 shadow-sm hover:shadow-md hover:border-[#C59B27]/60 transition-all duration-200 flex items-center justify-between gap-4">
      
      {/* Left: Thumbnail & Info */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#FBF8F2] flex-shrink-0 border border-[#E8DFC8]">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="min-w-0 flex-1">
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#A87D17] bg-[#FCF9F2] px-2 py-0.5 rounded border border-[#DFBC77]/40 mb-1">
            {service.category}
          </span>
          <h4 className="font-serif text-sm sm:text-base font-bold text-[#1C1917] truncate">
            {service.name}
          </h4>
          <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              {service.durationMinutes} Mins
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-semibold text-stone-800">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {service.rating} ({service.reviewCount})
            </span>
          </div>
          <p className="text-sm font-bold text-[#1C1917] mt-1 sm:hidden">
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
          className="btn-gold px-4 py-2 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Book Now</span>
        </button>
      </div>

    </div>
  );
}
