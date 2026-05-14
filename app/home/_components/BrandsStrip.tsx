import React from 'react';

export default function BrandsStrip() {
  return (
    <div className="bg-black py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center sm:justify-between items-center gap-8 sm:gap-4 opacity-90">
        <span className="text-white text-3xl font-serif tracking-widest font-bold">VERSACE</span>
        <span className="text-white text-3xl font-display uppercase tracking-widest">ZARA</span>
        <span className="text-white text-3xl font-serif font-bold tracking-wider">GUCCI</span>
        <span className="text-white text-3xl font-sans font-bold tracking-widest">PRADA</span>
        <span className="text-white text-3xl font-serif italic font-medium tracking-wide">Calvin Klein</span>
      </div>
    </div>
  );
}
