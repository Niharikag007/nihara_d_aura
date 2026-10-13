import React from 'react';

export default function Logo({ className = "h-16 w-auto", alt = "Nihara D'Aura Haute Luxury" }) {
  return (
    <img 
      src="/logo.png?v=3" 
      alt={alt} 
      className={`${className} object-contain rounded-full transition-all duration-300 drop-shadow-[0_4px_16px_rgba(212,175,55,0.45)] hover:scale-105 brightness-105 contrast-105`} 
    />
  );
}
