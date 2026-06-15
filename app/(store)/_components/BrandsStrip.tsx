import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function BrandsStrip() {
  // ดึงข้อมูลแบรนด์ล่าสุด 10 แบรนด์ โดยเลือกเฉพาะฟิลด์ที่จำเป็นต้องใช้ตามกฎของ Staff Engineer
  const brands = await prisma.brand.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
    }
  });

  // ถ้ายังไม่มีแบรนด์ในระบบ ไม่ต้องแสดงแถบนี้
  if (brands.length === 0) return null;

  return (
    // เอา py ออกทั้งหมด เพื่อไม่ให้มีช่องว่างสีดำเหลือเลย
    <div className="bg-black overflow-hidden relative border-y border-gray-800">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
          display: flex;
          width: max-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="flex animate-marquee items-center">
        {[...brands, ...brands].map((brand, index) => (
          <Link 
            key={`${brand.id}-${index}`} 
            href={`/brands/${brand.slug}`}
            // บังคับขนาดให้กว้างและสูงเท่ากันเป๊ะๆ และเอา margin ออก เพื่อให้รูปติดกันสนิท
            className="flex-shrink-0 w-32 sm:w-48 h-20 sm:h-32 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-300"
          >
            {brand.logoUrl ? (
              <img 
                src={brand.logoUrl} 
                alt={brand.name} 
                // ใช้ object-cover เพื่อบังคับให้รูปขยายเต็มพื้นที่กล่อง 100% จะได้ไม่มีขอบดำเหลือเลย
                className="w-full h-full object-cover" 
              />
            ) : (
              <span className="text-white text-xl sm:text-2xl font-display uppercase tracking-[0.2em] whitespace-nowrap text-center">
                {brand.name}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
