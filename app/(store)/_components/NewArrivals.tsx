import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import AddToCartButton from '@/components/cart/AddToCartButton';

const NEW_ARRIVALS = [
  { id: 1, name: "เสื้อยืดแต่งแถบ", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80", rating: 4.5, price: 120, originalPrice: null, discount: null },
  { id: 2, name: "กางเกงยีนส์ทรงสกินนี่", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80", rating: 3.5, price: 240, originalPrice: 260, discount: "-20%" },
  { id: 3, name: "เสื้อเชิ้ตลายตาราง", image: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?auto=format&fit=crop&w=600&q=80", rating: 4.5, price: 180, originalPrice: null, discount: null },
  { id: 4, name: "เสื้อยืดแขนลายทาง", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80", rating: 4.7, price: 130, originalPrice: 160, discount: "-30%", hiddenMobile: true }
];

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

export default function NewArrivals() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h2 className="font-display text-4xl sm:text-5xl text-center mb-12 sm:mb-16">สินค้าใหม่ล่าสุด</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {NEW_ARRIVALS.map((product) => (
          <div key={product.id} className={`group cursor-pointer ${product.hiddenMobile ? 'hidden sm:block' : ''}`}>
            <div className="bg-[#F0EEED] rounded-[20px] aspect-square overflow-hidden mb-4 relative">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <h3 className="font-bold text-base sm:text-lg mb-1 leading-tight text-black">{product.name}</h3>
            
            <div className="flex items-center gap-1 mb-2">
              <RatingStars rating={product.rating} />
              <span className="text-sm text-[#666666]">{product.rating}/<span className="text-xs">5</span></span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="font-bold text-xl sm:text-2xl">฿{product.price}</span>
              {product.originalPrice && <span className="font-bold text-lg text-[#666666] line-through">฿{product.originalPrice}</span>}
              {product.discount && <span className="bg-[#FF3333]/10 text-[#FF3333] text-xs font-semibold px-2 sm:px-3 py-1 rounded-full">{product.discount}</span>}
            </div>

            <AddToCartButton product={{ id: String(product.id), name: product.name, price: product.price, image: product.image }} />
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button className="border border-gray-300 text-black px-14 py-3 rounded-full font-medium hover:bg-black hover:text-white transition-colors duration-300 w-full sm:w-auto cursor-pointer">
          ดูทั้งหมด
        </button>
      </div>
    </section>
  );
}
