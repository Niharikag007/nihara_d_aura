import React from 'react';

/**
 * Base Skeleton loader element with royal aura shimmer effect
 */
export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={`skeleton-shimmer rounded-lg ${className}`}
      {...props}
    />
  );
}

/**
 * Skeleton component mirroring the exact size and luxury layout of ProductCard
 */
export function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#DFBC77]/30 bg-white shadow-[0_10px_25px_-20px_rgba(88,64,22,0.35)]">
      {/* Product Image placeholder */}
      <div className="relative aspect-square w-full skeleton-shimmer overflow-hidden">
        {/* Subtle decorative placeholder badge */}
        <div className="absolute top-3 left-3 h-5 w-14 rounded-full bg-white/40" />
      </div>

      {/* Product Meta & Details */}
      <div className="flex flex-1 flex-col p-4 sm:p-4.5 justify-between gap-3">
        <div>
          {/* Category tag */}
          <Skeleton className="h-3 w-24 rounded-full mb-2.5" />

          {/* Product Title */}
          <Skeleton className="h-4 w-full rounded mb-1.5" />
          <Skeleton className="h-4 w-3/4 rounded mb-3" />

          {/* Rating placeholder */}
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3.5 w-12 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="space-y-1">
            <Skeleton className="h-5 w-20 rounded" />
            <Skeleton className="h-3 w-12 rounded" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Responsive Grid of ProductCardSkeletons
 */
export function ProductGridSkeleton({ count = 10 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 sm:gap-5 pt-6 animate-fade-in">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Horizontal Carousel / Row of ProductCardSkeletons (e.g. for Home Page sections)
 */
export function ProductRowSkeleton({ count = 5 }) {
  return (
    <div className="flex md:grid md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5 pt-4 overflow-x-auto pb-4 md:pb-0 scrollbar-none snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 animate-fade-in">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="w-[68vw] sm:w-[45vw] md:w-auto flex-shrink-0 snap-center">
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  );
}

/**
 * Full Product Details Page Skeleton
 */
export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-transparent py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in">
      {/* Back button */}
      <Skeleton className="h-4 w-32 rounded mb-6" />

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 bg-white p-6 sm:p-10 rounded-3xl border border-[#DFBC77]/40 shadow-sm">
        {/* Left: Images */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex gap-3 overflow-x-auto pb-2">
            <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />
            <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />
            <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-5 w-28 rounded-full" />
            <Skeleton className="h-8 w-4/5 rounded" />
            <Skeleton className="h-8 w-3/5 rounded" />

            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-20 rounded-md" />
              <Skeleton className="h-4 w-32 rounded" />
            </div>

            <div className="pt-2 space-y-2">
              <Skeleton className="h-7 w-28 rounded" />
              <Skeleton className="h-4 w-40 rounded" />
            </div>

            <div className="pt-4 space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>

            {/* Variants placeholder */}
            <div className="pt-4 space-y-2">
              <Skeleton className="h-4 w-24 rounded" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-20 rounded-xl" />
                <Skeleton className="h-9 w-20 rounded-xl" />
                <Skeleton className="h-9 w-20 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 pt-4 border-t border-stone-100">
            <Skeleton className="h-12 flex-1 rounded-full" />
            <Skeleton className="h-12 flex-1 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Service Card Skeleton mirroring ServiceCard.jsx
 */
export function ServiceCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#DFBC77]/40 bg-white shadow-sm">
      {/* 16:11 Aspect Banner */}
      <Skeleton className="relative aspect-[16/11] w-full rounded-t-[1.75rem]" />

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6 justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-20 rounded-full" />
            <Skeleton className="h-3 w-16 rounded-full" />
          </div>

          <Skeleton className="h-5 w-5/6 rounded" />
          <Skeleton className="h-4 w-4/5 rounded" />

          {/* Perks list */}
          <div className="pt-2 space-y-2">
            <Skeleton className="h-3.5 w-full rounded" />
            <Skeleton className="h-3.5 w-5/6 rounded" />
            <Skeleton className="h-3.5 w-4/6 rounded" />
          </div>
        </div>

        {/* Price & CTA */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
          <div className="space-y-1">
            <Skeleton className="h-5 w-20 rounded" />
            <Skeleton className="h-3 w-14 rounded" />
          </div>
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * List / Order / Booking Item Skeleton
 */
export function ListCardSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4 animate-fade-in">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-3xl p-5 sm:p-6 border border-[#DFBC77]/30 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="space-y-1">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-24 rounded" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-2xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </div>
            <Skeleton className="h-6 w-20 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
