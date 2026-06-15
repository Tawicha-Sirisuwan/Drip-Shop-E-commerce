import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import BrandsClient from './_components/BrandsClient';

// กำหนดเป็น dynamic เพื่อให้ดึงข้อมูลอัปเดตเสมอ
export const dynamic = 'force-dynamic';

export default async function BrandsPage() {
  // ดึงข้อมูลแบรนด์ทั้งหมด เรียงตามชื่อ A-Z
  // เลือกเฉพาะฟิลด์ที่จำเป็นตามกฎ Performance
  const brands = await prisma.brand.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
    }
  });

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

        {/* ส่งมอบการจัดการ State (Search/Filter) ไปให้ Client Component */}
        <BrandsClient initialBrands={brands} />

      </main>
    </div>
  );
}
