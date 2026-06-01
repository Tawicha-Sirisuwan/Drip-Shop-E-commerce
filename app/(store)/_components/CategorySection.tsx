import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, Shirt, Briefcase, Footprints, Watch, Crown 
} from 'lucide-react';

const categories = [
  { name: 'เสื้อผ้าแฟชั่นผู้ชาย', icon: Shirt },
  { name: 'เสื้อผ้าแฟชั่นผู้หญิง', icon: Crown },
  { name: 'รองเท้าผู้ชาย', icon: Footprints },
  { name: 'รองเท้าผู้หญิง', icon: Footprints },
  { name: 'กระเป๋า', icon: Briefcase },
  { name: 'นาฬิกาและแว่นตา', icon: Watch },
  { name: 'ความงามและของใช้ส่วนตัว', icon: Sparkles },
];

export default function CategorySection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      
      {/* Import Kanit Font */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600&display=swap');
        .font-kanit { font-family: 'Kanit', sans-serif; }
      `}} />

      {/* Header */}
      <div className="flex justify-center items-center mb-10 sm:mb-14">
        <h2 className="font-display text-3xl sm:text-4xl text-black uppercase tracking-wide">
          เลือกชมตามหมวดหมู่
        </h2>
      </div>
      
      {/* Categories Container */}
      <div className="relative font-kanit">
        {/* Horizontal scroll on mobile, centered on desktop */}
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] scroll-smooth pb-6">
          <div className="flex gap-4 sm:gap-6 md:gap-8 justify-start lg:justify-center min-w-max px-2">
            
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Link 
                  href="#" 
                  key={index} 
                  className="flex flex-col items-center group w-[100px] sm:w-[130px] cursor-pointer"
                >
                  {/* วงกลมไอคอน - เปลี่ยนเป็นสีดำเมื่อ Hover */}
                  <div className="w-20 h-20 sm:w-28 sm:h-28 bg-[#F2F0F1] rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-black group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.15)] group-hover:-translate-y-2">
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700 group-hover:text-white transition-colors duration-300 stroke-[1.5]" />
                  </div>
                  {/* ชื่อหมวดหมู่ (ฟอนต์ Kanit) */}
                  <p className="text-[13px] sm:text-sm text-gray-600 text-center font-medium group-hover:text-black transition-colors leading-snug px-1">
                    {category.name}
                  </p>
                </Link>
              );
            })}
            
          </div>
        </div>
      </div>

    </section>
  );
}
