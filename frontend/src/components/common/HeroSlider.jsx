import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Crown, 
  Gem, 
  Palette, 
  ArrowRight,
  Pause,
  Play,
  Scissors
} from 'lucide-react';

const bannerSlides = [
  {
    id: 1,
    tag: "EXCLUSIVE BRIDAL COLLECTION",
    icon: Crown,
    title: "Royal Kundan Jewellery & HD Bridal Makeup",
    subtitle: "Handcrafted 24K gold polki neckpieces paired with 16-hour waterproof HD bridal makeovers for your dream day.",
    badge: "100% Certified Gold & Luxury Glam",
    primaryCtaText: "Shop Jewellery",
    primaryCtaLink: "/products?category=Jewellery",
    secondaryCtaText: "Book Bridal Makeup",
    secondaryCtaLink: "/book",
    bgGradient: "from-amber-950/80 via-stone-950/30 to-transparent",
    accentColor: "#C5A059",
    image: "/hero-slide-1.jpg",
    fallbackImg: "/hero-slide-1.jpg"
  },
  {
    id: 2,
    tag: "MAKEUP ARTISTRY STUDIO",
    icon: Palette,
    title: "HD & Airbrush Celebrity Makeup Looks",
    subtitle: "Flawless skin finishes, dramatic eye styling, and premium international cosmetics crafted by expert artists.",
    badge: "Specialist Makeup Artists Available",
    primaryCtaText: "Book Appointment",
    primaryCtaLink: "/book",
    secondaryCtaText: "View Makeup Services",
    secondaryCtaLink: "/services",
    bgGradient: "from-rose-950/80 via-stone-950/30 to-transparent",
    accentColor: "#E09F67",
    image: "/hero-slide-2.jpg",
    fallbackImg: "/hero-slide-2.jpg"
  },
  {
    id: 3,
    tag: "LUXURY JEWELLERY HEIRLOOMS",
    icon: Gem,
    title: "Polki, Diamond & Antique Gold Necklaces",
    subtitle: "Heritage bridal sets, designer earrings, royal bangles, and statement chokers designed to mesmerize.",
    badge: "Lifetime Exchange & Free Shipping",
    primaryCtaText: "Explore Jewellery",
    primaryCtaLink: "/products?category=Jewellery",
    secondaryCtaText: "View Bestsellers",
    secondaryCtaLink: "/products",
    bgGradient: "from-amber-950/80 via-stone-950/30 to-transparent",
    accentColor: "#D4AF37",
    image: "/hero-slide-3.jpg",
    fallbackImg: "/hero-slide-3.jpg"
  },
  {
    id: 4,
    tag: "FESTIVE GLAM & STUDIO SERVICES",
    icon: Sparkles,
    title: "Glamorous Party Makeup & Hair Styling",
    subtitle: "Elevate your evening look with glowing highlighter sets, elegant hair updos, and festive shimmer packages.",
    badge: "Festive Packages Up to 25% Off",
    primaryCtaText: "Book Glam Session",
    primaryCtaLink: "/book",
    secondaryCtaText: "Browse Products",
    secondaryCtaLink: "/products",
    bgGradient: "from-purple-950/80 via-stone-950/30 to-transparent",
    accentColor: "#E5A744",
    image: "/hero-slide-4.jpg",
    fallbackImg: "/hero-slide-4.jpg"
  },
  {
    id: 5,
    tag: "HERITAGE BRIDAL SPLENDOR",
    icon: Scissors,
    title: "Temple Gold Jewellery & Complete Makeover",
    subtitle: "Complete head-to-toe royal wedding styling including maang tikka, bridal jewellery, and luxury saree draping.",
    badge: "Nihara D Aura Signature Studio",
    primaryCtaText: "Explore Bridal Studio",
    primaryCtaLink: "/book",
    secondaryCtaText: "Shop Collection",
    secondaryCtaLink: "/products",
    bgGradient: "from-amber-950/80 via-stone-950/30 to-transparent",
    accentColor: "#C5A059",
    image: "/hero-slide-5.jpg",
    fallbackImg: "/hero-slide-5.jpg"
  },
  {
    id: 6,
    tag: "FLAGSHIP SALON STUDIO",
    icon: Scissors,
    title: "Master Salon Hair Cut, Styling & Blow Dry",
    subtitle: "Experience luxury hair transformation by celebrity stylists using international hair care and organic nourishing elixirs.",
    badge: "Greater Noida (West) Flagship Studio",
    primaryCtaText: "Book Hair Appointment",
    primaryCtaLink: "/book",
    secondaryCtaText: "View Hair Services",
    secondaryCtaLink: "/services",
    bgGradient: "from-amber-950/80 via-stone-950/30 to-transparent",
    accentColor: "#D4AF37",
    image: "/hero-slide-6.jpg",
    fallbackImg: "/hero-slide-6.jpg"
  },
  {
    id: 7,
    tag: "BRIDAL MAKEOVER IN PROGRESS",
    icon: Palette,
    title: "HD Airbrush Bridal Makeup Artistry",
    subtitle: "Precision HD airbrush foundation, contouring, and dramatic eye makeovers crafted live by master artists.",
    badge: "16-Hour Sweatproof & Waterproof Wear",
    primaryCtaText: "Book Bridal Makeup",
    primaryCtaLink: "/book",
    secondaryCtaText: "Explore Packages",
    secondaryCtaLink: "/services",
    bgGradient: "from-rose-950/80 via-stone-950/30 to-transparent",
    accentColor: "#E09F67",
    image: "/hero-slide-7.jpg",
    fallbackImg: "/hero-slide-7.jpg"
  },
  {
    id: 8,
    tag: "LUXURY NAIL STUDIO",
    icon: Sparkles,
    title: "Rose Quartz Gel Extensions & Chrome Nail Art",
    subtitle: "Salon-grade soft gel nail extensions, mirror chrome lacquer, and hand-painted metallic nail artistry.",
    badge: "Long-Lasting 4-Week Shine",
    primaryCtaText: "Book Nail Session",
    primaryCtaLink: "/book",
    secondaryCtaText: "Shop Press-On Nails",
    secondaryCtaLink: "/products?category=Nails",
    bgGradient: "from-purple-950/80 via-stone-950/30 to-transparent",
    accentColor: "#E5A744",
    image: "/hero-slide-8.jpg",
    fallbackImg: "/hero-slide-8.jpg"
  },
  {
    id: 9,
    tag: "WELLNESS & SPA THERAPY",
    icon: Crown,
    title: "24K Pure Gold Facial & Radiance Spa",
    subtitle: "Rejuvenating 24K gold foil facial, Kashmiri rose hydration, and soothing Ayurvedic face & neck massage.",
    badge: "Instant Glow & Deep Hydration",
    primaryCtaText: "Book Gold Facial",
    primaryCtaLink: "/book",
    secondaryCtaText: "View Spa Services",
    secondaryCtaLink: "/services",
    bgGradient: "from-amber-950/80 via-stone-950/30 to-transparent",
    accentColor: "#C5A059",
    image: "/hero-slide-9.jpg",
    fallbackImg: "/hero-slide-9.jpg"
  }
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const slideInterval = useRef(null);

  // Minimum swipe distance in px
  const minSwipeDistance = 50;

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === bannerSlides.length - 1 ? 0 : prev + 1));
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? bannerSlides.length - 1 : prev - 1));
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto scrolling effect (auto scrolls every 4.5s & resets timer on manual slide action)
  useEffect(() => {
    if (!isPaused) {
      slideInterval.current = setInterval(() => {
        handleNext();
      }, 4500); // 4.5 seconds per slide
    }

    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [isPaused, currentIndex, handleNext]);

  // Touch handlers for manual swipe scrolling on mobile/tablet
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  return (
    <div 
      className="relative w-full overflow-hidden bg-stone-950 text-white select-none group"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Jewellery and Makeup Hero Banner Carousel"
    >
      {/* Full Width Slide Container */}
      <div className="relative w-full h-[550px] sm:h-[680px] md:h-[750px] lg:h-[800px] xl:h-[850px]">
        {bannerSlides.map((slide, index) => {
          const isActive = index === currentIndex;
          const TagIcon = slide.icon;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Full HD Banner Background Image */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  onError={(e) => {
                    e.target.src = slide.fallbackImg;
                  }}
                  className={`w-full h-full object-cover object-top sm:object-[center_10%] md:object-[center_15%] transition-transform duration-[7000ms] ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                  loading={index === 0 ? "eager" : "lazy"}
                />
                
                {/* Minimal Soft Gradient on Left Side Only for Crystal Clear Model Image View */}
                <div className="absolute inset-y-0 left-0 w-full md:w-2/3 bg-gradient-to-r from-stone-950/85 via-stone-950/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-stone-950/60 to-transparent" />
              </div>

              {/* Full Width Content Overlay */}
              <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center py-12">
                <div className="max-w-2xl space-y-4 sm:space-y-6">
                  
                  {/* Badge & Category Tag */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span 
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-widest bg-white/15 backdrop-blur-md text-[#FFF4DC] border border-amber-300/40 shadow-lg"
                    >
                      <TagIcon className="w-3.5 h-3.5 text-amber-300" />
                      {slide.tag}
                    </span>

                    <span className="hidden sm:inline-block px-3 py-1 rounded-full text-[11px] font-medium bg-amber-500/20 backdrop-blur-sm text-amber-200 border border-amber-400/30">
                      {slide.badge}
                    </span>
                  </div>

                  {/* Main Title */}
                  <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] drop-shadow-md">
                    {slide.title.split('&').map((part, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <span className="italic font-normal text-amber-200"> & </span>}
                        {part}
                      </React.Fragment>
                    ))}
                  </h1>

                  {/* Subtitle / Description */}
                  <p className="text-sm sm:text-base text-amber-100/90 font-light leading-relaxed max-w-xl drop-shadow">
                    {slide.subtitle}
                  </p>

                  {/* Call to Action Buttons */}
                  <div className="pt-3 flex flex-wrap items-center gap-4">
                    <Link
                      to={slide.primaryCtaLink}
                      className="btn-gold px-7 py-3.5 rounded-full text-xs sm:text-sm uppercase tracking-wider font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2 group/btn"
                    >
                      <span>{slide.primaryCtaText}</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      to={slide.secondaryCtaLink}
                      className="px-7 py-3.5 rounded-full text-xs sm:text-sm uppercase tracking-wider font-semibold bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white transition-all hover:border-amber-300/60"
                    >
                      {slide.secondaryCtaText}
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Controls: Previous Arrow */}
      <button
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-full bg-stone-900/60 hover:bg-[#A67C37] text-white border border-white/20 backdrop-blur-md shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Manual Controls: Next Arrow */}
      <button
        onClick={handleNext}
        aria-label="Next Slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-full bg-stone-900/60 hover:bg-[#A67C37] text-white border border-white/20 backdrop-blur-md shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Bottom Bar: Manual Pagination Dots + Play/Pause Auto-Scroll Toggle */}
      <div className="absolute bottom-6 inset-x-0 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between pointer-events-none">
        
        {/* Slide Counter & Indicators */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 bg-stone-950/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/15">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                currentIndex === index
                  ? 'w-8 bg-[#C5A059]'
                  : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
          <span className="ml-2 text-xs font-mono text-amber-200/90 font-semibold tracking-wider">
            0{currentIndex + 1} / 0{bannerSlides.length}
          </span>
        </div>

        {/* Auto-Scroll Toggle & Status */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? "Play Auto Slide" : "Pause Auto Slide"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-950/70 hover:bg-stone-900 text-amber-200 border border-white/15 backdrop-blur-md transition-all"
          >
            {isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Play</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Pause</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Auto-Scroll Animated Progress Bar at bottom border */}
      <div className="absolute bottom-0 inset-x-0 z-30 h-1 bg-stone-900/50">
        <div 
          key={currentIndex + (isPaused ? '-paused' : '-active')}
          className={`h-full bg-gradient-to-r from-[#C5A059] to-amber-200 transition-all ${
            isPaused ? 'w-0' : 'animate-hero-progress'
          }`}
        />
      </div>
    </div>
  );
}
