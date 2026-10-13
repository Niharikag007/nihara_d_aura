import React, { useState } from 'react';
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
  UserCheck
} from 'lucide-react';
import { mockData } from '../services/mockData';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';
import ServiceCard from '../components/services/ServiceCard';
import HeroSlider from '../components/common/HeroSlider';

export default function Home() {
  const { products } = useProducts();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const categories = [
    { label: 'All', icon: Sparkles },
    { label: 'Makeup', icon: Palette },
    { label: 'Jewellery', icon: Gem },
    { label: 'Nails', icon: Scissors },
    { label: 'Candles', icon: Flame },
  ];

  // Filtered products for active category (guaranteed 100% unique)
  const allUniqueProducts = Array.from(new Map(products.map(p => [p.id, p])).values());

  const filteredProducts = activeCategory === 'All' 
    ? allUniqueProducts 
    : allUniqueProducts.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

  const bestsellerProducts = allUniqueProducts.filter(p => p.isBestseller);
  const featuredProducts = allUniqueProducts.filter(p => p.isFeatured);
  const signatureServices = mockData.services.slice(0, 3);

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
      role: "Verified Bride (Mumbai)",
      rating: 5,
      comment: "The Royal Kundan Haar set for my wedding was mesmerizing! Everyone complimented the purity and finish of the gold. Absolutely world-class craftsmanship.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      boughtItem: "Royal 22K Gold Kundan Bridal Haar"
    },
    {
      id: 2,
      name: "Radhika Malhotra",
      role: "High Fashion Patron (Delhi)",
      rating: 5,
      comment: "Priya Sharma did my HD Airbrush Bridal Makeup at home. My skin looked glowing, natural, and lasted through the entire 16-hour wedding ceremony!",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      boughtItem: "Royal Bridal Glow & Makeup Package"
    },
    {
      id: 3,
      name: "Sanjana Kapoor",
      role: "Luxury Collector (Hyderabad)",
      rating: 5,
      comment: "The 24K Gold Lakshmi Locket and 22K Peacock Jhumkas are stunning! Swiss gold assay certificate was included in a gorgeous velvet chest.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      boughtItem: "24K Gold Lakshmi Coin Locket"
    }
  ];

  const lookbookItems = [
    {
      id: 1,
      title: "Royal Kundan & HD Airbrush Glam",
      tag: "#NiharaRoyalBride",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "22K Solid Gold Peacock Jhumkas",
      tag: "#NiharaGoldHeirlooms",
      image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Rose Quartz Gel Nail Extensions",
      tag: "#NiharaNailStudio",
      image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Red Carpet Shimmer & Gold Glow",
      tag: "#NiharaCelebrityGlam",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
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

      {/* 2.5 3-Feature Banner Cards (Matching Reference Video: NEW ARRIVALS, BEST SELLERS, BRIDAL STUDIO) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Banner 1: NEW ARRIVALS */}
          <Link 
            to="/products?category=Jewellery" 
            className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-lg border border-[#DFBC77]/40 block"
          >
            <img 
              src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=85" 
              alt="New Arrivals"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent flex flex-col justify-end p-6 text-center items-center">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white uppercase tracking-wider mb-2 drop-shadow">
                NEW ARRIVALS
              </h3>
              <span className="inline-block px-5 py-2 text-xs uppercase tracking-widest font-bold text-white border border-white/60 rounded-full group-hover:bg-[#C59B27] group-hover:border-[#C59B27] transition-all shadow-md">
                SHOP NOW &rarr;
              </span>
            </div>
          </Link>

          {/* Banner 2: BEST SELLERS */}
          <Link 
            to="/products" 
            className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-lg border border-[#DFBC77]/40 block"
          >
            <img 
              src="https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=85" 
              alt="Best Sellers"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent flex flex-col justify-end p-6 text-center items-center">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white uppercase tracking-wider mb-2 drop-shadow">
                BEST SELLERS
              </h3>
              <span className="inline-block px-5 py-2 text-xs uppercase tracking-widest font-bold text-white border border-white/60 rounded-full group-hover:bg-[#C59B27] group-hover:border-[#C59B27] transition-all shadow-md">
                SHOP NOW &rarr;
              </span>
            </div>
          </Link>

          {/* Banner 3: BRIDAL & SALON STUDIO */}
          <Link 
            to="/book" 
            className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-lg border border-[#DFBC77]/40 block"
          >
            <img 
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=85" 
              alt="Bridal & Salon Studio"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent flex flex-col justify-end p-6 text-center items-center">
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

      {/* 2.7 Top Categories Showcase (Matching reference video) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="text-center mb-6">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#A87D17] block">
            BROWSE BY CATEGORY
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
            Top Categories
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { name: 'Necklaces & Haar', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80', cat: 'Jewellery' },
            { name: 'Gold Jhumkas', img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=300&q=80', cat: 'Jewellery' },
            { name: 'Gold Lockets', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=300&q=80', cat: 'Jewellery' },
            { name: 'Silk Foundation', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=300&q=80', cat: 'Makeup' },
            { name: 'Press-On Nails', img: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=300&q=80', cat: 'Nails' },
            { name: 'Mogra Candles', img: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=300&q=80', cat: 'Candles' },
          ].map((catItem, idx) => (
            <Link
              key={idx}
              to={`/products?category=${catItem.cat}`}
              className="group bg-white p-3.5 rounded-2xl border border-[#DFBC77]/30 hover:border-[#C59B27] shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 border-2 border-[#EADECF] group-hover:border-[#C59B27] transition-all group-hover:scale-105">
                <img src={catItem.img} alt={catItem.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-serif font-bold text-[#1C1917] uppercase tracking-wider group-hover:text-[#C59B27] transition-colors">
                {catItem.name}
              </span>
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

        {/* Display 5 products for selected category */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-5 pt-4">
          {filteredProducts.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} />
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
                Pair handcrafted 22K Kundan haar sets with our signature 16-hour sweatproof HD Airbrush Makeup for your wedding functions.
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

      {/* 5. Bestseller Beauties Grid (Shows 6 products) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex items-end justify-between mb-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#A87D17] block">
              PATRON FAVORITES
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917]">
              Bestseller Beauties
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-[#855F14] hover:text-[#523A0B] flex items-center gap-1 group"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-5">
          {bestsellerProducts.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Featured Luxuries Grid (Shows 5 products) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex items-end justify-between mb-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#A87D17] block">
              HERITAGE ELEGANCE
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917]">
              Featured Luxuries
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-[#855F14] hover:text-[#523A0B] flex items-center gap-1 group"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-5">
          {featuredProducts.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Royal Wall of Love (Customer Reviews & Star Testimonials) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#A87D17]">
            TESTIMONIALS & REVIEWS
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
            The Royal Wall of Love
          </h2>
          <p className="text-xs text-stone-500">
            Hear from our happy brides, collectors, and patrons across India.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl p-6 border border-[#DFBC77]/30 shadow-sm space-y-4 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-amber-200" />
              </div>

              <p className="text-xs text-stone-700 italic leading-relaxed">
                "{t.comment}"
              </p>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-amber-300" />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">{t.name}</h4>
                    <p className="text-[10px] text-amber-700 font-medium">{t.role}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Verified
                </span>
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {lookbookItems.map((item) => (
            <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden shadow-md border border-[#DFBC77]/30">
              <img
                src={item.image}
                alt={item.title}
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

      {/* 9. Signature Salon Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="flex items-end justify-between mb-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#A87D17] block">
              SALON & AT-HOME ARTISTRY
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917]">
              Signature Salon Services
            </h2>
          </div>
          <Link
            to="/services"
            className="text-xs font-semibold text-[#855F14] hover:text-[#523A0B] flex items-center gap-1 group"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {signatureServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
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
