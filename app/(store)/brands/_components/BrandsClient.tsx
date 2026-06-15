'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
}

interface BrandsClientProps {
  initialBrands: Brand[];
}

export default function BrandsClient({ initialBrands }: BrandsClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState('All');

  // สร้างตัวอักษรเรียงตามที่มีใน DB หรือกำหนดเป็น A-Z ก็ได้
  // แต่การใช้ Array.from(new Set) จะได้เฉพาะตัวอักษรที่มีแบรนด์อยู่จริง
  const letters = useMemo(() => {
    const firstLetters = initialBrands.map((b) => b.name.charAt(0).toUpperCase());
    return ['All', ...Array.from(new Set(firstLetters)).sort()];
  }, [initialBrands]);

  const filteredBrands = useMemo(() => {
    return initialBrands.filter((brand) => {
      const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLetter = activeLetter === 'All' || brand.name.toUpperCase().startsWith(activeLetter);
      return matchesSearch && matchesLetter;
    });
  }, [initialBrands, searchQuery, activeLetter]);

  return (
    <>
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
            placeholder="ค้นหาชื่อแบรนด์..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F2F0F1] text-black rounded-full pl-11 pr-4 py-3 outline-none focus:ring-1 focus:ring-gray-300 transition-all text-sm"
          />
        </div>
      </div>

      {/* Alphabet Filter */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-10">
        {letters.map((letter, idx) => (
          <button 
            key={idx}
            onClick={() => {
              setActiveLetter(letter);
              setSearchQuery(''); // รีเซ็ตคำค้นหาเมื่อเปลี่ยนหมวดตัวอักษร
            }}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm font-bold transition-colors cursor-pointer
              ${activeLetter === letter 
                ? 'bg-black text-white shadow-md' 
                : 'bg-[#F2F0F1] text-black hover:bg-gray-200'
              }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Brands Grid (5 Columns like image) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 mb-12">
        {filteredBrands.map((brand) => (
          <Link href={`/brands/${brand.slug}`} key={brand.id} className="group block">
            {/* กล่อง Brand Card อัตราส่วน 4:3 เอา padding ออกเพื่อให้ขยายได้เต็มที่ */}
            <div className="bg-[#F2F0F1] rounded-[20px] aspect-[4/3] flex items-center justify-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-transparent hover:border-black cursor-pointer overflow-hidden relative">
              {brand.logoUrl ? (
                // แสดงโลโก้เต็มกล่อง (w-full h-full) แบบ cover
                <img 
                  src={brand.logoUrl} 
                  alt={brand.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
              ) : (
                // ถ้าไม่มีโลโก้ ให้แสดงชื่อแบรนด์แบบเท่ๆ
                <span className="text-black group-hover:scale-105 transition-transform duration-300 whitespace-pre-line font-display text-2xl tracking-widest uppercase">
                  {brand.name}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* กรณีไม่พบแบรนด์ */}
      {filteredBrands.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <Search className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">ไม่พบแบรนด์ที่คุณค้นหา</h3>
          <p className="text-gray-500">ลองใช้คำค้นหาอื่น หรือเลือกตัวอักษรอื่นดูนะครับ</p>
          <button 
            onClick={() => { setSearchQuery(''); setActiveLetter('All'); }}
            className="mt-6 px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            ดูแบรนด์ทั้งหมด
          </button>
        </div>
      )}
    </>
  );
}
