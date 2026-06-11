"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';


// ช่วยให้ Navbar หลักยังคงสถานะเป็น Server Component ได้ ทำให้ได้ Performance และ SEO ที่ดีกว่า
export default function CartIcon() {
  const [isMounted, setIsMounted] = useState(false);
  
  //ดึงข้อมูล items จาก Store (จะดึงข้อมูลจาก localStorage ผ่าน persist middleware)
  const items = useCartStore((state) => state.items);


  // วิธีแก้คือ เราจะเรนเดอร์ตัวเลขตะกร้าก็ต่อเมื่อ Component ทำการ Mount บนเบราว์เซอร์เสร็จแล้วเท่านั้น
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // คำนวณจำนวนชิ้นรวม
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link href="/cart" className="hover:text-gray-600 transition-colors relative">
      <ShoppingCart className="w-6 h-6" />
      
      {/* จะแสดง Badge ตัวเลขก็ต่อเมื่อ Mount เสร็จบน Client แล้ว และมีสินค้าอย่างน้อย 1 ชิ้น */}
      {isMounted && totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#FF3333] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  );
}
