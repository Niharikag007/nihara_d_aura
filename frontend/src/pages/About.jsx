import React from 'react';
import { Link } from 'react-router-dom';
import {
  Crown,
  Gem,
  Sparkles,
  ShieldCheck,
  Truck,
  Award,
  Heart,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Quote,
  CheckCircle2,
  Scissors,
  Flame,
  Palette
} from 'lucide-react';

const values = [
  {
    icon: Gem,
    title: 'Heirloom Craftsmanship',
    text: 'Every Kundan-inspired piece and couture styling detail is selected for enduring beauty, honest materials and a distinctly Nihara finish.'
  },
  {
    icon: Heart,
    title: 'Personalised Care',
    text: 'From bridal trials to at-home salon visits, our artists and stylists treat every client like royalty — with patience, precision and warmth.'
  },
  {
    icon: ShieldCheck,
    title: 'Trust & Transparency',
    text: 'Clear pricing, honest product details and a dedicated concierge make shopping effortless and completely worry-free.'
  },
  {
    icon: Sparkles,
    title: 'Royal Experience',
    text: 'White-glove delivery, curated gift packaging and VIP loyalty perks turn every order into a celebration of your style.'
  }
];

const offerings = [
  {
    icon: Gem,
    title: 'Jewellery Collections',
    text: 'Statement Kundan-inspired sets, Polki chandbalis, jhumkas, coin lockets and heirloom-styled pieces for weddings and everyday grandeur.',
    to: '/products?category=Jewellery',
    cta: 'Shop Jewellery'
  },
  {
    icon: Palette,
    title: 'Silk Cosmetics',
    text: 'Weightless HD foundations, long-wear lipsticks and skincare essentials crafted for camera-ready, all-day radiance.',
    to: '/products?category=Makeup',
    cta: 'Explore Makeup'
  },
  {
    icon: Scissors,
    title: 'Nail Studio',
    text: 'Gel extensions, press-on kits and bespoke nail art designed in our signature rose-quartz and gold palette.',
    to: '/products?category=Nails',
    cta: 'View Nail Range'
  },
  {
    icon: Flame,
    title: 'Home Fragrance',
    text: 'Hand-poured soy wax mogra candles that fill your sanctuary with warm, floral luxury.',
    to: '/products?category=Candles',
    cta: 'Discover Candles'
  }
];

const journeySteps = [
  {
    step: '01',
    title: 'The Vision',
    text: 'Nihara D\'Aura began with a simple belief — that every woman deserves jewellery, beauty and moments that feel genuinely royal.'
  },
  {
    step: '02',
    title: 'The Craft',
    text: 'We curate each collection with obsessive attention to detail — from the weight of a coin pendant to the last brushstroke of bridal makeup.'
  },
  {
    step: '03',
    title: 'The Experience',
    text: 'Today, our studio and at-home salon serve patrons across India, blending heritage-inspired design with modern luxury service.'
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-transparent pb-16">

      {/* 1. Hero Banner */}
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/hero-slide-7.jpg"
            alt="Nihara D'Aura — Royal bridal artistry"
            onError={(e) => { e.currentTarget.src = '/hero-slide-1.jpg'; }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/60 to-stone-950/30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 text-center">
          <span className="section-eyebrow !bg-white/10 !border-white/30 !text-amber-200">
            Our Story
          </span>
          <h1 className="mt-5 font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Where Heritage Meets <br />
            <span className="italic font-normal text-amber-200">Modern Majesty</span>
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-sm sm:text-base text-amber-100/90 font-light leading-relaxed">
            Nihara D'Aura is a luxury jewellery, beauty and salon house crafting heirloom-inspired
            style for the modern connoisseur — from bridal trousseaus to everyday elegance.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/products"
              className="btn-gold inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs uppercase tracking-wider font-bold shadow-xl"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white transition-all"
            >
              Book a Salon Visit
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Brand Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="space-y-5">
            <span className="section-eyebrow">The Nihara D'Aura Story</span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1917] leading-tight">
              A House Built on <span className="italic text-[#A87D17]">Craft & Celebration</span>
            </h2>
            <p className="text-sm sm:text-[15px] text-stone-600 leading-relaxed font-light">
              What began as a vision for timeless Indian elegance has grown into a complete luxury
              destination — a couture jewellery atelier, a silk cosmetics atelier and a master salon
              under one roof.
            </p>
            <p className="text-sm sm:text-[15px] text-stone-600 leading-relaxed font-light">
              Every Nihara creation carries the aura of a keepsake: pieces designed to be worn,
              treasured and passed down — styled for the bride, the collector and the woman who
              carries quiet luxury every day.
            </p>
            <div className="flex flex-wrap gap-6 pt-2">
              {[
                { icon: Award, label: 'Curated Luxury' },
                { icon: Truck, label: 'White-Glove Delivery' },
                { icon: ShieldCheck, label: 'Secure Payments' }
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#C59B27]" />
                  <span className="text-xs font-semibold text-stone-700">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl overflow-hidden border border-[#DFBC77]/40 shadow-lg aspect-[3/4]">
              <img
                src="/user-red-bride.jpg"
                alt="Royal bride styled by Nihara D'Aura"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="rounded-3xl overflow-hidden border border-[#DFBC77]/40 shadow-lg aspect-[3/4] mt-8">
              <img
                src="/hero-slide-3.jpg"
                alt="Kundan-inspired jewellery collection"
                onError={(e) => { e.currentTarget.src = '/hero-slide-1.jpg'; }}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Journey Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2">
            <span className="w-6 h-0.5 bg-[#C59B27]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A87D17]">
              Our Journey
            </span>
            <span className="w-6 h-0.5 bg-[#C59B27]" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1C1917] tracking-tight">
            From Vision to Vault
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
            Three chapters that shaped the house we are today.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
          {journeySteps.map(({ step, title, text }) => (
            <div key={step} className="premium-card text-center relative overflow-hidden">
              <span className="absolute -top-4 -right-2 font-serif text-[88px] font-extrabold text-[#DFBC77]/15 leading-none select-none pointer-events-none">
                {step}
              </span>
              <h3 className="text-lg font-serif font-bold text-stone-900 mb-2 relative">{title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed font-light relative">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. What We Offer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2">
            <span className="w-6 h-0.5 bg-[#C59B27]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A87D17]">
              The Collections
            </span>
            <span className="w-6 h-0.5 bg-[#C59B27]" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1C1917] tracking-tight">
            Everything Under One Royal Roof
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
            Four atelier lines, one unmistakable standard of luxury.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {offerings.map(({ icon: Icon, title, text, to, cta }) => (
            <div key={title} className="premium-card flex flex-col h-full">
              <span className="premium-card-icon">
                <Icon className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">{title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed mb-4 flex-1">{text}</p>
              <Link
                to={to}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#855F14] hover:text-[#A87D17] transition-colors"
              >
                {cta}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Values Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="rounded-3xl border border-[#DFBC77]/40 bg-gradient-to-b from-white to-[#FAF3E8] p-6 sm:p-10 shadow-[0_18px_32px_-28px_rgba(78,59,17,0.5)]">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-2">
              <span className="w-6 h-0.5 bg-[#C59B27]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A87D17]">
                Our Values
              </span>
              <span className="w-6 h-0.5 bg-[#C59B27]" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1C1917] tracking-tight">
              The Promise Behind the Aura
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-white rounded-2xl border border-[#DFBC77]/30 p-5 space-y-3 hover:border-[#C59B27] hover:shadow-lg transition-all">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-white border border-[#DFBC77]/40 text-[#8c6a1b]">
                  <Icon className="w-5 h-5" />
                </span>
                <h3 className="text-sm font-serif font-bold text-stone-900">{title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Quote / Manifesto Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-white border border-[#DFBC77]/40 shadow-2xl">
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="relative p-8 sm:p-14 text-center space-y-6">
            <Quote className="w-10 h-10 text-amber-300/60 mx-auto" />
            <p className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold text-amber-100 leading-snug max-w-3xl mx-auto">
              "Elegance is not about being noticed — it's about being remembered."
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="w-10 h-0.5 bg-[#C59B27]" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">
                The Nihara D'Aura Philosophy
              </span>
              <span className="w-10 h-0.5 bg-[#C59B27]" />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Stats Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="bg-stone-900 border-y border-[#DFBC77]/30 text-amber-100 py-8 px-4 sm:px-6 lg:px-8 rounded-3xl overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '500+', label: 'Curated Pieces' },
              { value: '1K+', label: 'Royal Patrons' },
              { value: '50+', label: 'Master Services' },
              { value: '100%', label: 'Authentic Luxury' }
            ].map(({ value, label }) => (
              <div key={label} className="space-y-1">
                <p className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-200">{value}</p>
                <p className="text-[11px] uppercase tracking-widest text-stone-400 font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Contact / Visit Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4">
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          <div className="premium-section !py-8 flex flex-col justify-center">
            <span className="section-eyebrow">Visit the House</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] mt-3 mb-4">
              Experience Nihara in Person
            </h2>
            <p className="text-sm text-stone-600 font-light leading-relaxed mb-6">
              Walk into our Greater Noida flagship or book an at-home salon appointment —
              our concierge team is ready to welcome you.
            </p>
            <div className="space-y-3 text-sm">
              <p className="flex items-start gap-3 text-stone-700">
                <MapPin className="w-4 h-4 text-[#C59B27] flex-shrink-0 mt-0.5" />
                <span>423 A, 4th Floor, Tower 3, NX One Tower, Greater Noida (West), UP - 201306</span>
              </p>
              <p className="flex items-center gap-3 text-stone-700">
                <Phone className="w-4 h-4 text-[#C59B27] flex-shrink-0" />
                <span>+91 92660 59846</span>
              </p>
              <p className="flex items-center gap-3 text-stone-700">
                <Mail className="w-4 h-4 text-[#C59B27] flex-shrink-0" />
                <a href="mailto:support@niharadaura.com" className="hover:text-[#A87D17] transition-colors">
                  support@niharadaura.com
                </a>
              </p>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-[#DFBC77]/40 shadow-xl min-h-[280px]">
            <img
              src="/hero-slide-5.jpg"
              alt="Nihara D'Aura store ambience"
              onError={(e) => { e.currentTarget.src = '/hero-slide-1.jpg'; }}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* 9. CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="rounded-3xl bg-gradient-to-r from-[#2A1F17] via-[#4A3828] to-[#1F1710] text-white p-8 sm:p-12 text-center relative overflow-hidden border border-[#DFBC77]/40 shadow-xl">
          <div className="max-w-xl mx-auto space-y-4 relative z-10">
            <div className="w-12 h-12 bg-amber-500/20 border border-amber-400/40 text-amber-300 rounded-full flex items-center justify-center mx-auto">
              <Crown className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-amber-100">
              Become a Nihara Patron
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light">
              Explore the collections, book a bridal trial or join the Royal VIP Club for
              private launches and member-only offers.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/products"
                className="btn-gold inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs uppercase tracking-wider font-bold"
              >
                Shop the Collection
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs uppercase tracking-wider font-semibold bg-white/10 hover:bg-white/20 border border-white/30 text-white transition-all"
              >
                Join VIP Club
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
