import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Crown, 
  ArrowRight, 
  ChevronRight, 
  Scissors, 
  Gem, 
  Flame, 
  Heart,
  Palette,
  ShieldCheck,
  Truck,
  RotateCcw,
  Award,
  Star,
  Quote,
  CheckCircle2,
  Camera,
  Mail,
  UserCheck,
  ShoppingBag,
  MapPin
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useServices } from '../context/ServiceContext';
import ProductCard from '../components/products/ProductCard';
import ServiceCard from '../components/services/ServiceCard';
import HeroSlider from '../components/common/HeroSlider';

export default function Home() {
  const { products } = useProducts();
  const { services } = useServices();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [patronTab, setPatronTab] = useState('bestsellers'); // 'bestsellers' | 'featured'
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const categories = [
    { label: 'All', icon: Sparkles },
    { label: 'Makeup', icon: Palette },
    { label: 'Jewellery', icon: Gem },
    { label: 'Nails', icon: Scissors },
    { label: 'Candles', icon: Flame },
  ];

  // Filtered products for active category (guaranteed 100% unique from MongoDB)
  const allUniqueProducts = useMemo(() => {
    return Array.from(new Map(products.map(p => [(p.id || p._id), p])).values());
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') {
      const prioritySlugs = [
        'antique-22k-gold-guluband-collar-earrings-suite',
        '24k-gold-lakshmi-coin-locket-chain-set',
        '18k-rose-gold-diamond-heart-pendant-chain',
        '24k-solid-gold-divine-swastik-pendant-chain',
        '18k-gold-turquoise-evil-eye-talisman-pendant'
      ];

      const jewelleryProducts = allUniqueProducts.filter(p => p.category?.toLowerCase() === 'jewellery');
      
      jewelleryProducts.sort((a, b) => {
        const aIdx = prioritySlugs.indexOf(a.slug);
        const bIdx = prioritySlugs.indexOf(b.slug);
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
        if (aIdx !== -1) return -1;
        if (bIdx !== -1) return 1;
        return (b.price || 0) - (a.price || 0);
      });

      const otherProducts = allUniqueProducts.filter(p => p.category?.toLowerCase() !== 'jewellery');
      return [...jewelleryProducts, ...otherProducts];
    }
    return allUniqueProducts.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());
  }, [activeCategory, allUniqueProducts]);

  const bestsellerProducts = allUniqueProducts.filter(p => p.isBestseller);
  const featuredProducts = allUniqueProducts.filter(p => p.isFeatured);
  const signatureServices = (services || []).slice(0, 3);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
    }
  };

  const testimonials = [
    {
      id: 1,
      name: "Ananya Roy",
      role: "Verified Royal Bride",
      city: "Worli, Mumbai",
      date: "Wedding • Oct 2026",
      tag: "ROYAL WEDDING",
      rating: 5,
      comment: "The Royal Kundan Haar set for my wedding was mesmerizing! The 24K gold foil and polki craftsmanship stunned everyone in our mandap. Included full Swiss hallmark certification and custom velvet chest.",
      avatar: "/hero-slide-1.jpg",
      reviewImage: "/hero-slide-1.jpg",
      boughtItem: "Royal 22K Gold Kundan Bridal Haar",
      itemType: "Jewellery"
    },
    {
      id: 2,
      name: "Radhika Malhotra",
      role: "High Fashion Patron",
      city: "Defence Colony, New Delhi",
      date: "Reception • Sep 2026",
      tag: "BRIDAL MAKEOVER",
      rating: 5,
      comment: "Master stylist Priya did my HD Airbrush Bridal Makeup at our venue. My skin looked flawlessly radiant in all 4K wedding photos and lasted 16+ hours through the pheras without a touch-up!",
      avatar: "/hero-slide-7.jpg",
      reviewImage: "/hero-slide-7.jpg",
      boughtItem: "Royal Bridal Glow & HD Makeup Package",
      itemType: "Salon Artistry"
    },
    {
      id: 3,
      name: "Sanjana Kapoor",
      role: "Heritage Gold Collector",
      city: "Jubilee Hills, Hyderabad",
      date: "Festive Collector • Aug 2026",
      tag: "GOLD HEIRLOOM",
      rating: 5,
      comment: "The 22K Solid Gold Peacock Jhumkas and Lakshmi Coin Locket are heirlooms I will pass down to my daughter. The weight, balance, and BIS hallmark purity are absolutely genuine.",
      avatar: "/hero-slide-5.jpg",
      reviewImage: "/hero-slide-5.jpg",
      boughtItem: "22K Peacock Jhumkas & Lakshmi Locket",
      itemType: "Jewellery"
    }
  ];

  const lookbookItems = [
    {
      id: 1,
      title: "Royal Kundan & HD Airbrush Glam",
      tag: "#NiharaRoyalBride",
      image: "/hero-slide-1.jpg"
    },
    {
      id: 2,
      title: "22K Solid Gold Peacock Jhumkas",
      tag: "#NiharaGoldHeirlooms",
      image: "/hero-slide-3.jpg"
    },
    {
      id: 3,
      title: "Rose Quartz Gel Nail Extensions",
      tag: "#NiharaNailStudio",
      image: "/hero-slide-8.jpg"
    },
    {
      id: 4,
      title: "Red Carpet Shimmer & Gold Glow",
      tag: "#NiharaCelebrityGlam",
      image: "/hero-slide-4.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-transparent pb-16">
      
      {/* 1. Full-Width Hero Slider (Jewellery + Makeup Banners with Auto & Manual Scroll) */}
      <section className="w-full">
        <HeroSlider />
      </section>

      {/* 2. Luxury Guarantees & Perks Bar */}
      <section className="bg-stone-900 border-y border-[#DFBC77]/30 text-amber-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center md:text-left">
          
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200">100% Hallmarked Gold</h4>
              <p className="text-[10px] text-stone-400 font-light">Certified 22K/24K BIS Purity</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200">Free Insured Shipping</h4>
              <p className="text-[10px] text-stone-400 font-light">Pan-India Express Door Delivery</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 flex-shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200">Master Makeup Artists</h4>
              <p className="text-[10px] text-stone-400 font-light">Salon & At-Home Specialists</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200">Easy Returns & Exchange</h4>
              <p className="text-[10px] text-stone-400 font-light">Lifetime Gold Guarantee</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2.5 3-Feature Banner Cards (Real Haute Photography: NEW ARRIVALS, BEST SELLERS, BRIDAL STUDIO) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex md:grid md:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto pb-4 md:pb-0 scrollbar-none snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
          
          {/* Banner 1: NEW ARRIVALS */}
          <Link 
            to="/products?category=Jewellery" 
            className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-lg border border-[#DFBC77]/40 block w-[84vw] sm:w-[65vw] md:w-auto flex-shrink-0 snap-center"
          >
            <img 
              src="/hero-slide-3.jpg" 
              alt="New Arrivals"
              onError={(e) => { e.currentTarget.src = '/hero-slide-1.jpg'; }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent flex flex-col justify-end p-6 text-center items-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300 mb-1">
                Polki & Antique Gold
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white uppercase tracking-wider mb-2 drop-shadow">
                NEW ARRIVALS
              </h3>
              <span className="inline-block px-5 py-2 text-xs uppercase tracking-widest font-bold text-white border border-white/60 rounded-full group-hover:bg-[#C59B27] group-hover:border-[#C59B27] transition-all shadow-md">
                SHOP NOW &rarr;
              </span>
            </div>
          </Link>

          {/* Banner 2: BEST SELLERS (Fixed Broken Image & Elevated to Real 22K Kundan Heirlooms) */}
          <Link 
            to="/products" 
            className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-lg border border-[#DFBC77]/40 block w-[84vw] sm:w-[65vw] md:w-auto flex-shrink-0 snap-center"
          >
            <img 
              src="/hero-slide-5.jpg" 
              alt="Best Sellers"
              onError={(e) => { e.currentTarget.src = '/hero-slide-1.jpg'; }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent flex flex-col justify-end p-6 text-center items-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300 mb-1">
                22K Certified Heirlooms
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white uppercase tracking-wider mb-2 drop-shadow">
                BEST SELLERS
              </h3>
              <span className="inline-block px-5 py-2 text-xs uppercase tracking-widest font-bold text-white border border-white/60 rounded-full group-hover:bg-[#C59B27] group-hover:border-[#C59B27] transition-all shadow-md">
                SHOP NOW &rarr;
              </span>
            </div>
          </Link>

          {/* Banner 3: BRIDAL & SALON STUDIO (Elevated to Real HD Airbrush Artistry) */}
          <Link 
            to="/book" 
            className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-lg border border-[#DFBC77]/40 block w-[84vw] sm:w-[65vw] md:w-auto flex-shrink-0 snap-center"
          >
            <img 
              src="/hero-slide-7.jpg" 
              alt="Bridal & Salon Studio"
              onError={(e) => { e.currentTarget.src = '/hero-slide-1.jpg'; }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent flex flex-col justify-end p-6 text-center items-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300 mb-1">
                Master Salon & Home Visits
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white uppercase tracking-wider mb-2 drop-shadow">
                BRIDAL & SALON STUDIO
              </h3>
              <span className="inline-block px-5 py-2 text-xs uppercase tracking-widest font-bold text-white border border-white/60 rounded-full group-hover:bg-[#C59B27] group-hover:border-[#C59B27] transition-all shadow-md">
                BOOK APPOINTMENT &rarr;
              </span>
            </div>
          </Link>

        </div>
      </section>

      {/* 2.7 Top Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="text-center mb-6">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#A87D17] block">
            BROWSE BY CATEGORY
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
            Top Categories
          </h2>
        </div>

        <div className="flex md:grid md:grid-cols-6 gap-3.5 sm:gap-4 overflow-x-auto pb-4 md:pb-0 scrollbar-none snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            { name: 'Necklaces & Haar', tag: 'Royal Heirlooms', img: '/hero-slide-1.jpg', cat: 'Jewellery', subcat: 'Bridal Haar & Sets' },
            { name: 'Gold Jhumkas', tag: '22K Hallmarked', img: '/hero-slide-3.jpg', cat: 'Jewellery', subcat: 'Gold Earrings & Jhumkas' },
            { name: 'Gold Lockets', tag: 'Temple & Polki', img: '/hero-slide-5.jpg', cat: 'Jewellery', subcat: 'Gold Lockets & Pendants' },
            { name: 'Silk Foundation', tag: 'Weightless HD', img: '/hero-slide-2.jpg', cat: 'Makeup', subcat: 'Face Foundations' },
            { name: 'Press-On Nails', tag: 'Salon Art Suite', img: '/hero-slide-8.jpg', cat: 'Nails', subcat: 'Press-On Kits' },
            { name: 'Mogra Candles', tag: 'Pure Soy Wax', img: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=400&q=80', cat: 'Candles', subcat: 'Soy Wax Jar Candles' },
          ].map((catItem, idx) => (
            <Link
              key={idx}
              to={`/products?category=${encodeURIComponent(catItem.cat)}${catItem.subcat ? `&subcategory=${encodeURIComponent(catItem.subcat)}` : ''}`}
              className="group relative bg-gradient-to-b from-white via-[#FCF9F3] to-[#F7F2E7] p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#DFBC77]/40 hover:border-[#C59B27] shadow-[0_4px_20px_rgba(212,175,55,0.07)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.22)] transition-all duration-400 text-center flex flex-col items-center justify-between hover:-translate-y-1.5 transform-gpu min-w-[145px] sm:min-w-[160px] md:min-w-0 flex-shrink-0 snap-center overflow-hidden"
            >
              {/* Luxury Gold Halo on Hover */}
              <div className="absolute inset-0 bg-radial-gradient from-[#DFBC77]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Image Circle with Golden Ring Accent */}
              <div className="relative mb-3.5">
                <div className="p-1 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F5E6C4] to-[#AA7C11] shadow-md group-hover:scale-105 transition-transform duration-500">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white bg-[#FBF8F2] shadow-inner">
                    <img 
                      src={catItem.img} 
                      alt={catItem.name} 
                      onError={(e) => { e.currentTarget.src = '/hero-slide-1.jpg'; }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Category Title & Royal Tag */}
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-[13px] font-serif font-extrabold text-[#1C1917] uppercase tracking-wider group-hover:text-[#C59B27] transition-colors leading-tight line-clamp-1">
                  {catItem.name}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#9E7318] font-bold mt-1 opacity-90 group-hover:opacity-100 transition-opacity">
                  {catItem.tag}
                </span>
                <span className="w-4 h-0.5 bg-[#DFBC77]/40 group-hover:w-8 group-hover:bg-[#C59B27] rounded-full transition-all duration-300 mt-2" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Horizontal Category Filter Pills & Product Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#A87D17] block">
              CURATED SELECTION
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917]">
              {activeCategory === 'All' ? 'Explore Royal Collections' : `${activeCategory} Collection`}
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#855F14] bg-[#FCF9F2] px-3 py-1 rounded-full border border-[#DFBC77]/40">
            {filteredProducts.length} Items Available
          </span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 scrollbar-none pt-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap shadow-sm ${
                  isActive
                    ? 'bg-[#A67C37] text-white shadow-md scale-105 ring-2 ring-[#C59B27]/40'
                    : 'bg-white text-[#554D44] border border-[#EADECF] hover:bg-[#FCF9F2] hover:border-[#DFBC77]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#A67C37]'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Display 5 products for selected category (Mobile Horizontal Slide & Desktop Grid) */}
        <div className="flex md:grid md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5 pt-4 overflow-x-auto pb-4 md:pb-0 scrollbar-none snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
          {filteredProducts.slice(0, 5).map((product) => (
            <div key={product.id || product._id} className="w-[68vw] sm:w-[45vw] md:w-auto flex-shrink-0 snap-center">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Luxury Bridal Transformation Spotlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-white border border-[#DFBC77]/40">
          <div className="grid md:grid-cols-2 gap-8 items-center p-6 sm:p-10 lg:p-12">
            
            <div className="space-y-4 text-center md:text-left z-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-200 border border-amber-400/40">
                <Crown className="w-3.5 h-3.5 text-amber-300" />
                NIHARA SIGNATURE BRIDAL TROUSSEAU
              </span>

              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Crafted for Queens & <br />
                <span className="italic font-normal text-amber-200">Unforgettable Brides</span>
              </h2>

              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-light max-w-lg">
                Pair authentic 22K Kundan haar sets with our signature 16-hour sweatproof HD Airbrush Makeup for your wedding functions.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
                <Link
                  to="/book"
                  className="btn-gold px-7 py-3.5 rounded-full text-xs uppercase tracking-wider font-bold shadow-xl flex items-center gap-2"
                >
                  <span>Book Bridal Makeover</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/products?category=Jewellery"
                  className="px-7 py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white transition-all"
                >
                  Explore Real Gold Haar
                </Link>
              </div>
            </div>

            <div className="relative z-10 aspect-[4/3] rounded-2xl overflow-hidden border-4 border-amber-300/30 shadow-2xl">
              <img
                src="/user-red-bride.jpg"
                alt="Nihara Royal Red Lehenga Indian Bride in Gold Kundan Jewellery"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-3 left-3 right-3 p-3 bg-black/60 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">22K Royal Gold Kundan Haar</p>
                  <p className="text-[10px] text-amber-200">BIS Hallmarked • Jaipur Craftsmanship</p>
                </div>
                <span className="font-bold text-amber-300">₹38,500</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Signature Salon Services (Elevated to showcase dual identity: Haute Jewellery & Premier Salon) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-0.5 bg-[#C59B27]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A87D17]">
                SALON & AT-HOME ARTISTRY
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1C1917] tracking-tight">
              Signature Salon Services
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-light mt-1 max-w-xl">
              Real high-definition bridal transformations, red carpet glam, and bespoke nail couture by master artists at our flagship salon or your home.
            </p>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#DFBC77] bg-white text-xs font-bold text-[#855F14] hover:bg-[#FAF6EE] hover:text-[#523A0B] transition-all shadow-xs group flex-shrink-0"
          >
            <span>Explore All Services</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 3-Column Luxury Real-Photography Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {signatureServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* 6. Heritage Collections & Patron Favorites (Unified Tabbed Showcase) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#A87D17] block">
              CURATED EXCELLENCE
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917]">
              {patronTab === 'bestsellers' ? 'Bestseller Beauties' : 'Featured Luxuries'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Tabs */}
            <div className="inline-flex p-1 bg-stone-100 rounded-full border border-stone-200">
              <button
                type="button"
                onClick={() => setPatronTab('bestsellers')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  patronTab === 'bestsellers'
                    ? 'bg-white text-[#C59B27] shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Bestsellers ({bestsellerProducts.length})
              </button>
              <button
                type="button"
                onClick={() => setPatronTab('featured')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  patronTab === 'featured'
                    ? 'bg-white text-[#C59B27] shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Featured Luxuries ({featuredProducts.length})
              </button>
            </div>

            <Link
              to="/products"
              className="hidden sm:flex text-xs font-semibold text-[#855F14] hover:text-[#523A0B] items-center gap-1 group ml-2"
            >
              <span>See All</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Tab Content (Mobile Horizontal Slide & Desktop Grid) */}
        <div className="flex md:grid md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5 animate-fade-in overflow-x-auto pb-4 md:pb-0 scrollbar-none snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
          {(patronTab === 'bestsellers' ? bestsellerProducts : featuredProducts).slice(0, 5).map((product) => (
            <div key={product.id || product._id} className="w-[68vw] sm:w-[45vw] md:w-auto flex-shrink-0 snap-center">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* 7. Royal Wall of Love (Real Client Stories with Authentic Photography) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 mb-0.5">
            <span className="w-6 h-0.5 bg-[#C59B27]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A87D17]">
              PATRON STORIES & REVIEWS
            </span>
            <span className="w-6 h-0.5 bg-[#C59B27]" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1C1917] tracking-tight">
            The Royal Wall of Love
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
            Real wedding ceremonies, red carpet moments, and heirloom jewellery stories shared by our verified brides and collectors across India.
          </p>
        </div>

        {/* 3-Column Visual Patron Story Cards (Mobile Horizontal Slide & Desktop Grid) */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7 overflow-x-auto pb-4 md:pb-0 scrollbar-none snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
          {testimonials.map((t) => (
            <div 
              key={t.id} 
              className="group bg-white rounded-3xl border border-[#DFBC77]/45 overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#C59B27] transition-all duration-500 flex flex-col will-change-transform transform-gpu hover:-translate-y-1.5 w-[85vw] sm:w-[65vw] md:w-auto flex-shrink-0 snap-center"
            >
              {/* Real Client Photo Banner */}
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-stone-900">
                <img
                  src={t.reviewImage}
                  alt={`${t.name} wedding review`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Dark Luxury Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                {/* Top Badges */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
                  <span className="inline-flex items-center gap-1 bg-stone-950/80 backdrop-blur-md text-amber-200 border border-amber-400/40 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{t.tag}</span>
                  </span>

                  <span className="inline-flex items-center gap-1 bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-400/30 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Verified Patron</span>
                  </span>
                </div>

                {/* Bottom Item Tag on Image */}
                <div className="absolute bottom-3 inset-x-3 z-10 pointer-events-none">
                  <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-white/15 px-2.5 py-1 rounded-lg text-white text-[11px] font-medium max-w-full">
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span className="truncate">{t.boughtItem}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
                
                <div className="space-y-3">
                  {/* Rating Stars & Quote Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-xs font-bold text-stone-800 ml-1.5">5.0</span>
                    </div>
                    <Quote className="w-5 h-5 text-amber-400/60" />
                  </div>

                  {/* Testimonial Quote */}
                  <p className="text-xs sm:text-[13px] text-stone-700 font-light leading-relaxed italic">
                    "{t.comment}"
                  </p>
                </div>

                {/* Patron Footer Details */}
                <div className="pt-4 border-t border-[#DFBC77]/25 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#855F14] shrink-0 shadow-xs">
                      <img 
                        src={t.avatar} 
                        alt={t.name} 
                        className="w-10 h-10 rounded-full object-cover" 
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-stone-900 truncate leading-snug flex items-center gap-1">
                        <span>{t.name}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline shrink-0" />
                      </h4>
                      <p className="text-[11px] text-[#A87D17] font-semibold truncate leading-tight mt-0.5">
                        {t.role}
                      </p>
                      <p className="text-[10px] text-stone-400 font-medium truncate mt-0.5">
                        {t.city} • {t.date}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 8. Spotted in Nihara Lookbook Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#A87D17] block flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-amber-600" />
              INSTAGRAM & LOOKBOOK
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917]">
              Spotted in Nihara
            </h2>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-[#855F14] hover:underline"
          >
            @NiharaDAuraStudio
          </a>
        </div>

        <div className="flex md:grid md:grid-cols-4 gap-3.5 sm:gap-4 overflow-x-auto pb-4 md:pb-0 scrollbar-none snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
          {lookbookItems.map((item) => (
            <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden shadow-md border border-[#DFBC77]/30 w-[70vw] sm:w-[45vw] md:w-auto flex-shrink-0 snap-center">
              <img
                src={item.image}
                alt={item.title}
                onError={(e) => { e.currentTarget.src = '/hero-slide-1.jpg'; }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="text-[10px] font-mono font-bold text-amber-300 uppercase">{item.tag}</span>
                <p className="text-xs font-bold text-white">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. Nihara Royal VIP Club Newsletter Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="rounded-3xl bg-gradient-to-r from-[#2A1F17] via-[#4A3828] to-[#1F1710] text-white p-8 sm:p-12 text-center relative overflow-hidden border border-[#DFBC77]/40 shadow-xl">
          <div className="max-w-xl mx-auto space-y-4 relative z-10">
            <div className="w-12 h-12 bg-amber-500/20 border border-amber-400/40 text-amber-300 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-amber-100">
              Join the Nihara Royal VIP Club
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 font-light">
              Subscribe to unlock 10% OFF your first order, private festive vault access, and VIP invitations to new Gold & Bridal launches.
            </p>

            {newsletterSubscribed ? (
              <div className="bg-emerald-900/50 border border-emerald-400 text-emerald-200 p-4 rounded-2xl text-xs font-semibold inline-flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Welcome to the Royal VIP Club! Check your inbox for your 10% coupon.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto pt-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-full text-xs text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="submit"
                  className="btn-gold w-full sm:w-auto px-7 py-3 rounded-full text-xs uppercase tracking-wider font-bold whitespace-nowrap shadow-md"
                >
                  Join VIP Club
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
