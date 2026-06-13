import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import Link from 'next/link';
import AddToCartButton from '@/components/cart/AddToCartButton';
import prisma from '@/lib/prisma';

// คอมโพเนนต์แสดงดาวเรทติ้ง
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

export default async function NewArrivals() {
  // ดึงข้อมูลสินค้าใหม่ 4 รายการล่าสุดจากฐานข้อมูล
  const latestProducts = await prisma.product.findMany({
    where: { isArchived: false },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h2 className="font-bold text-4xl sm:text-5xl text-center mb-12 sm:mb-16">สินค้าใหม่ล่าสุด</h2>

      {latestProducts.length === 0 ? (
        <p className="text-center text-gray-500">ยังไม่มีสินค้าใหม่</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {latestProducts.map((product, index) => {
            // สมมติเรทติ้งไปก่อน เนื่องจากในระบบยังไม่มี Database Review
            const rating = 5; 
            // ซ่อนรายการที่ 4 ในมือถือตาม Design เดิม
            const hiddenMobile = index === 3; 

            return (
              <div key={product.id} className={`group flex flex-col ${hiddenMobile ? 'hidden sm:flex' : 'flex'}`}>
                <Link href={`/product/${product.slug}`} className="cursor-pointer flex-1">
                  <div className="bg-[#F0EEED] rounded-[20px] aspect-square overflow-hidden mb-4 relative">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                        ไม่มีรูปภาพ
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-base sm:text-lg mb-1 leading-tight text-black group-hover:underline">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-1 mb-2">
                    <RatingStars rating={rating} />
                    <span className="text-sm text-[#666666]">{rating}/<span className="text-xs">5</span></span>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-bold text-xl sm:text-2xl">฿{Number(product.price).toLocaleString()}</span>
                  </div>
                </Link>

                <div className="mt-auto">
                  <AddToCartButton 
                    product={{ 
                      id: product.id, 
                      name: product.name, 
                      price: Number(product.price), 
                      image: product.images?.[0] || "" 
                    }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link 
          href="/products" 
          className="inline-block border border-gray-300 text-black px-14 py-3 rounded-full font-medium hover:bg-black hover:text-white transition-colors duration-300 w-full sm:w-auto cursor-pointer"
        >
          ดูทั้งหมด
        </Link>
      </div>
    </section>
  );
}
