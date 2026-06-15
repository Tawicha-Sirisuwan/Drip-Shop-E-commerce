import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Star, StarHalf } from 'lucide-react';
import AddToCartButton from '@/components/cart/AddToCartButton';
import { Metadata } from 'next';

interface BrandPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  const brand = await prisma.brand.findUnique({
    where: { slug: decodedSlug },
    select: { name: true, description: true }
  });

  if (!brand) return { title: 'Brand Not Found' };

  return {
    title: `${brand.name} | E-Commerce`,
    description: brand.description || `สินค้าจากแบรนด์ ${brand.name}`
  };
}

const RatingStars = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex text-[#FFC633] text-sm">
      {[...Array(fullStars)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
      {hasHalfStar && <StarHalf className="w-4 h-4 fill-current" />}
      {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)}
    </div>
  );
};

export default async function BrandPage({ params }: BrandPageProps) {
  // Next.js 15: params ถูกส่งมาเป็น Promise เราต้อง await ก่อนนำไปใช้
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // ดึงข้อมูลแบรนด์ และดึงสินค้าภายใต้แบรนด์นี้มาด้วย
  // ใช้ select เพื่อจำกัดฟิลด์ตามกฎ Performance
  const brand = await prisma.brand.findUnique({
    where: { slug: decodedSlug },
    select: {
      id: true,
      name: true,
      description: true,
      logoUrl: true,
      products: {
        where: { isArchived: false },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          stock: true,
          images: true,
          variants: {
            select: {
              stock: true
            }
          }
        }
      }
    }
  });

  // ถ้าไม่พบแบรนด์ ให้แสดงหน้า 404
  if (!brand) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen w-full antialiased font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-[#666666] mb-8">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>&gt;</span>
          <Link href="/brands" className="hover:text-black transition-colors">Brands</Link>
          <span>&gt;</span>
          <span className="text-black font-medium">{brand.name}</span>
        </div>

        {/* Brand Header Banner */}
        <div className="bg-[#F2F0F1] rounded-[30px] p-8 sm:p-12 mb-12 flex flex-col md:flex-row items-center justify-center md:justify-start gap-8 border border-gray-100 shadow-sm">
          {brand.logoUrl ? (
            <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden p-6 shrink-0">
              <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-black text-white shadow-md flex items-center justify-center overflow-hidden p-6 shrink-0">
              <span className="font-bold text-4xl sm:text-7xl uppercase tracking-widest">{brand.name.charAt(0)}</span>
            </div>
          )}
          
          <div className="text-center md:text-left">
            <h1 className="font-black text-4xl sm:text-6xl text-black mb-4 uppercase tracking-tight">{brand.name}</h1>
            {brand.description && (
              <p className="text-gray-600 max-w-2xl text-lg mb-4">{brand.description}</p>
            )}
            <div className="inline-flex items-center bg-black text-white text-sm font-medium px-4 py-2 rounded-full">
              สินค้าทั้งหมด {brand.products.length} รายการ
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <h2 className="font-bold text-2xl sm:text-3xl mb-8">สินค้าจาก {brand.name}</h2>
        
        {brand.products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">ยังไม่มีสินค้าสำหรับแบรนด์นี้</h3>
            <p className="text-gray-500">รอติดตามสินค้าใหม่ๆ เร็วๆ นี้นะครับ</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {brand.products.map((product) => {
              // สมมติเรทติ้งไปก่อน
              const rating = 5; 
              
              // คำนวณสต็อกรวมจากทุก Variant
              const totalStock = product.variants.length > 0 
                ? product.variants.reduce((acc, v) => acc + v.stock, 0)
                : product.stock;
              const isSoldOut = totalStock <= 0;

              return (
                <div key={product.id} className="group flex flex-col">
                  <Link href={`/product/${product.slug}`} className="cursor-pointer flex-1">
                    <div className="bg-[#F0EEED] rounded-[20px] aspect-square overflow-hidden mb-4 relative">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isSoldOut ? 'opacity-40 grayscale' : ''}`} 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                          ไม่มีรูปภาพ
                        </div>
                      )}
                      {/* ป้าย Sold Out */}
                      {isSoldOut && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="bg-black/80 backdrop-blur-sm text-white px-5 py-2 rounded-full font-bold text-sm tracking-widest uppercase shadow-xl">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-base sm:text-lg mb-1 leading-tight text-black group-hover:underline line-clamp-1">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center gap-1 mb-2">
                      <RatingStars rating={rating} />
                      <span className="text-sm text-[#666666]">{rating}/<span className="text-xs">5</span></span>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-bold text-xl sm:text-2xl text-black">฿{Number(product.price).toLocaleString()}</span>
                    </div>
                  </Link>

                  <div className="mt-auto">
                    {isSoldOut ? (
                      <button disabled className="w-full bg-gray-100 text-gray-400 py-2.5 rounded-full font-medium flex items-center justify-center gap-2 text-sm cursor-not-allowed border border-gray-200">
                        สินค้าหมด
                      </button>
                    ) : (
                      <AddToCartButton 
                        product={{ 
                          id: product.id, 
                          name: product.name, 
                          price: Number(product.price), 
                          image: product.images?.[0] || "" 
                        }} 
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
