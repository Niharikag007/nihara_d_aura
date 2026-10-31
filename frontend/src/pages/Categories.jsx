import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { useServices } from '../context/ServiceContext';
import { ARTIFICIAL_JEWELLERY, isArtificialJewellery } from '../data/jewelleryCategories';

export default function Categories() {
  const { categories, loading } = useServices();
  const displayCategories = categories.map((category) => (
    isArtificialJewellery(category.slug || category.name)
      ? {
          ...category,
          name: ARTIFICIAL_JEWELLERY.name,
          slug: ARTIFICIAL_JEWELLERY.slug,
          description: ARTIFICIAL_JEWELLERY.description,
          subcategories: ARTIFICIAL_JEWELLERY.subcategories
        }
      : category
  ));

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase font-bold tracking-widest text-[#C59B27] inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          The Nihara Verticals
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] mt-1">
          Explore Categories
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-2 leading-relaxed">
          From statement fashion jewellery to weightless silk formulations and private salon rituals.
        </p>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#DFBC77]" />
          <p className="text-stone-500 font-serif italic text-sm">Loading luxury verticals...</p>
        </div>
      ) : (
        /* Categories Grid / Stack */
        <div className="space-y-6">
          {displayCategories.map((cat) => (
          <div
            key={cat.id}
            className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-[#DFBC77]/40 bg-white"
          >
            {/* Banner Background Image with Gradient Overlay */}
            <div className="relative h-48 sm:h-64 w-full overflow-hidden">
              <img
                src={cat.image || '/hero-slide-1.jpg'}
                alt={cat.name}
                onError={(e) => { e.currentTarget.src = '/hero-slide-1.jpg'; }}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              
              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="inline-block text-[11px] font-bold text-amber-300 uppercase tracking-widest mb-1">
                    {cat.itemCount} Products & Offerings
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-stone-300 max-w-xl mt-1 line-clamp-1 sm:line-clamp-none font-light">
                    {cat.description}
                  </p>
                </div>

                <Link
                  to={`/products?category=${encodeURIComponent(isArtificialJewellery(cat.slug) ? ARTIFICIAL_JEWELLERY.name : cat.slug)}`}
                  className="btn-gold px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider self-start sm:self-auto flex items-center gap-1.5"
                >
                  <span>Explore All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Subcategory Pills Row */}
            <div className="p-4 sm:p-5 bg-[#FCF9F2] border-t border-[#EADECF] flex flex-wrap gap-2 items-center">
              <span className="text-[11px] uppercase tracking-wider font-bold text-stone-400 mr-2">
                Subcategories:
              </span>
              {cat.subcategories.map((sub, i) => (
                <Link
                  key={i}
                  to={`/products?category=${encodeURIComponent(isArtificialJewellery(cat.slug) ? ARTIFICIAL_JEWELLERY.name : cat.slug)}&subcategory=${encodeURIComponent(sub)}`}
                  className="text-xs bg-white text-stone-700 hover:text-[#855F14] hover:bg-amber-50 px-3 py-1.5 rounded-full border border-stone-200 hover:border-[#DFBC77] transition-all font-medium"
                >
                  {sub}
                </Link>
              ))}
            </div>

          </div>
        ))}
      </div>
      )}

    </div>
  );
}
