import React from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight, Tag } from 'lucide-react';

export default function CartPage() {
  return (
    <div className="bg-white min-h-screen w-full antialiased font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* 
        Style ภายในสำหรับฟอนต์ (อ้างอิงจาก example.html)
      */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap');
        .font-display { font-family: 'Archivo Black', sans-serif; line-height: 1.1; }
      `}} />

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-[#666666] mb-6">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span>&gt;</span>
        <span className="text-black font-medium">Cart</span>
      </div>

      <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-wide mb-8 text-black">
        Your Cart
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* ฝั่งซ้าย: รายการสินค้าในตะกร้า */}
        <div className="w-full lg:w-2/3 border border-gray-200 rounded-[20px] p-4 sm:p-6 space-y-6 shadow-sm">
          
          {/* Item 1 */}
          <div className="flex gap-4 sm:gap-6 border-b border-gray-100 pb-6">
            {/* รูปภาพจำลอง (ใช้สีเทาแบบหน้าแรก) */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#F0EEED] rounded-xl flex-shrink-0"></div>
            
            <div className="flex flex-col justify-between flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg sm:text-xl text-black leading-tight mb-1">Gradient Graphic T-shirt</h3>
                  <p className="text-sm text-[#666666] mb-0.5">Size: <span className="text-[#333333]">Large</span></p>
                  <p className="text-sm text-[#666666]">Color: <span className="text-[#333333]">White</span></p>
                </div>
                <button className="text-red-500 hover:text-red-700 transition-colors p-1 cursor-pointer">
                  <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <p className="font-bold text-xl sm:text-2xl text-black">$145</p>
                <div className="flex items-center bg-[#F0F0F0] rounded-full px-3 py-2 sm:px-4 sm:py-2.5 gap-3 sm:gap-5">
                  <button className="text-black hover:opacity-70 cursor-pointer"><Minus className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                  <span className="font-medium text-sm sm:text-base text-black">1</span>
                  <button className="text-black hover:opacity-70 cursor-pointer"><Plus className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex gap-4 sm:gap-6">
            {/* รูปภาพจำลอง */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#F0EEED] rounded-xl flex-shrink-0"></div>
            
            <div className="flex flex-col justify-between flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg sm:text-xl text-black leading-tight mb-1">Checkered Shirt</h3>
                  <p className="text-sm text-[#666666] mb-0.5">Size: <span className="text-[#333333]">Medium</span></p>
                  <p className="text-sm text-[#666666]">Color: <span className="text-[#333333]">Red</span></p>
                </div>
                <button className="text-red-500 hover:text-red-700 transition-colors p-1 cursor-pointer">
                  <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <p className="font-bold text-xl sm:text-2xl text-black">$180</p>
                <div className="flex items-center bg-[#F0F0F0] rounded-full px-3 py-2 sm:px-4 sm:py-2.5 gap-3 sm:gap-5">
                  <button className="text-black hover:opacity-70 cursor-pointer"><Minus className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                  <span className="font-medium text-sm sm:text-base text-black">1</span>
                  <button className="text-black hover:opacity-70 cursor-pointer"><Plus className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ฝั่งขวา: สรุปยอดสั่งซื้อ (Order Summary) */}
        <div className="w-full lg:w-1/3 border border-gray-200 rounded-[20px] p-5 sm:p-6 space-y-6 shadow-sm sticky top-24">
          <h2 className="font-bold text-xl sm:text-2xl text-black">Order Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between text-[#666666]">
              <span>Subtotal</span>
              <span className="font-medium text-black">$325</span>
            </div>
            <div className="flex justify-between text-[#666666]">
              <span>Discount (-20%)</span>
              <span className="font-medium text-red-500">-$65</span>
            </div>
            <div className="flex justify-between text-[#666666]">
              <span>Delivery Fee</span>
              <span className="font-medium text-black">$15</span>
            </div>
            
            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
              <span className="text-black font-medium text-lg">Total</span>
              <span className="font-bold text-2xl text-black">$275</span>
            </div>
          </div>

          {/* ช่องใส่ Promo Code */}
          <div className="flex gap-3">
            <div className="flex-1 flex items-center bg-[#F0F0F0] rounded-full px-4 py-3">
              <Tag className="w-5 h-5 text-gray-500 mr-2" />
              <input 
                type="text" 
                placeholder="Add promo code" 
                className="bg-transparent border-none outline-none w-full text-sm placeholder-gray-500 text-black"
              />
            </div>
            <button className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors cursor-pointer">
              Apply
            </button>
          </div>

          {/* ปุ่ม Checkout */}
          <button className="w-full bg-black text-white rounded-full py-4 sm:py-5 flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-2 cursor-pointer">
            <span className="font-medium text-base sm:text-lg">Go to Checkout</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
      </main>
    </div>
  );
}
