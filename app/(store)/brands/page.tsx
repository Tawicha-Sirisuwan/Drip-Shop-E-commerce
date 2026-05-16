import React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

export default function BrandsPage() {
  const letters = ['All', 'A', 'B', 'C', 'D', 'G', 'L', 'N', 'P', 'V', 'Z'];

  // จำลองรายชื่อแบรนด์พร้อมพยายามใช้ Font / Style ที่คล้ายคลึงกับโลโก้จริงมากที่สุด (แบบข้อความ)
  const brands = [
    { name: 'ZARA', style: 'font-display text-3xl tracking-tighter' },
    { name: 'GUCCI', style: 'font-serif text-2xl tracking-widest font-bold' },
    { name: 'VERSACE', style: 'font-serif text-lg tracking-widest' },
    { name: 'PRADA', style: 'font-serif text-xl tracking-[0.2em] font-bold' },
    { name: 'NIKE', style: 'font-display text-4xl italic tracking-tighter' },
    { name: 'adidas', style: 'font-sans font-bold text-2xl lowercase' },
    { name: 'CHANEL', style: 'font-serif text-xl tracking-[0.2em]' },
    { name: 'CALVIN\nKLEIN', style: 'font-display text-xl leading-tight' },
    { name: 'DIOR', style: 'font-serif text-xl tracking-widest' },
    { name: 'PUMA', style: 'font-display text-3xl' },
    { name: 'NEW\nBALANCE', style: 'font-serif text-lg font-bold leading-tight' },
    { name: 'H&M', style: 'font-display text-3xl tracking-tighter' },
    { name: 'BURBERRY', style: 'font-serif text-lg tracking-widest' },
    { name: "Levi's", style: 'font-sans font-bold text-2xl' },
    { name: 'LOUIS\nVUITTON', style: 'font-serif text-sm tracking-widest leading-tight' },
  ];

  return (
    <div className="bg-white min-h-screen w-full antialiased font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap');
        .font-display { font-family: 'Archivo Black', sans-serif; line-height: 1.1; }
      `}} />

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-[#666666] mb-8">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span>&gt;</span>
        <span className="text-black font-medium">Brands</span>
      </div>

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wide text-black">
          ALL BRANDS
        </h1>
        
        <div className="w-full md:w-auto relative flex-1 max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search brands..." 
            className="w-full bg-[#F2F0F1] text-black rounded-full pl-11 pr-4 py-3 outline-none focus:ring-1 focus:ring-gray-300 transition-all text-sm"
          />
        </div>
      </div>

      {/* Alphabet Filter */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-10">
        {letters.map((letter, idx) => (
          <button 
            key={idx}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm font-bold transition-colors cursor-pointer
              ${idx === 0 
                ? 'bg-black text-white' 
                : 'bg-[#F2F0F1] text-black hover:bg-gray-200'
              }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Brands Grid (5 Columns like image) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 mb-12">
        {brands.map((brand, index) => (
          <Link href="#" key={index} className="group block">
            {/* กล่อง Brand Card อัตราส่วน 4:3 และพื้นหลังสีเทาอ่อน */}
            <div className="bg-[#F2F0F1] rounded-[20px] aspect-[4/3] flex items-center justify-center text-center p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-transparent hover:border-black cursor-pointer">
              {/* ชื่อแบรนด์พร้อมฟอนต์และสไตล์ที่แต่งให้คล้ายโลโก้ */}
              <span className={`text-black group-hover:scale-105 transition-transform duration-300 whitespace-pre-line ${brand.style}`}>
                {brand.name}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center mt-16 pb-8">
        <button className="rounded-full border border-gray-200 text-black px-10 py-3.5 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
          Load More Brands
        </button>
      </div>

      </main>
    </div>
  );
}
