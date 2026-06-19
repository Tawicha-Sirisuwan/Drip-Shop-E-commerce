"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight, Tag, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { createCheckoutSession } from '@/lib/actions/checkout';
import { validateCouponAction } from '@/lib/actions/coupon';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Coupon States
  const [couponInput, setCouponInput] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discountAmount: number} | null>(null);

  // ป้องกัน Hydration Mismatch ระหว่าง Server (ยังไม่มี LocalStorage) และ Client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-white"></div>;
  }

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError("");
    
    try {
      const res = await validateCouponAction(couponInput, getTotalPrice());
      if (res.success) {
        setAppliedCoupon({
          code: res.coupon!.code,
          discountAmount: res.discountAmount!
        });
        setCouponInput("");
      } else {
        setCouponError(res.error || "คูปองไม่ถูกต้อง");
      }
    } catch (err: any) {
      setCouponError("เกิดข้อผิดพลาดในการตรวจสอบคูปอง");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  // ฟังก์ชันเรียก Server Action เมื่อกดชำระเงิน
  const handleCheckout = async () => {
    try {
      setLoading(true);
      
      // แปลงข้อมูลจาก Zustand ให้ตรงกับ Zod Schema ของ Server Action
      const checkoutItems = items.map(item => ({
        productId: item.productId,
        // หาก id ไม่ตรงกับ productId อนุมานว่า id คือ variantId
        variantId: item.id !== item.productId ? item.id : undefined,
        quantity: item.quantity
      }));

      // ยิง Server Action
      const res = await createCheckoutSession({
        items: checkoutItems,
        couponCode: appliedCoupon?.code
      });

      // ถ้าระบบตอบกลับมาเป็น URL ให้ Redirect ไปที่ Stripe
      if (res?.url) {
        window.location.href = res.url;
      }
    } catch (error: any) {
      alert(error.message || "เกิดข้อผิดพลาดในการชำระเงิน กรุณาตรวจสอบว่าคุณเข้าสู่ระบบแล้ว");
      setLoading(false);
    }
  };

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 0 ? 50 : 0; // สมมติค่าส่ง 50 บาท
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = Math.max(0, subtotal + deliveryFee - discount);

  return (
    <div className="bg-white min-h-screen w-full antialiased font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <style dangerouslySetInnerHTML={{
          __html: `
          @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap');
          .font-display { font-family: 'Archivo Black', sans-serif; line-height: 1.1; }
        `}} />

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-[#666666] mb-6">
          <Link href="/" className="hover:text-black transition-colors">หน้าแรก</Link>
          <span>&gt;</span>
          <span className="text-black font-medium">ตะกร้าสินค้า</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-wide mb-8 text-black">
          ตะกร้าสินค้าของคุณ
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 border border-gray-200 rounded-[20px] shadow-sm">
            <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">ตะกร้าสินค้าว่างเปล่า</h2>
            <p className="text-gray-500 mb-6">คุณยังไม่ได้เลือกสินค้าใดๆ ลงในตะกร้า</p>
            <Link href="/" className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors inline-block">
              กลับไปช้อปปิ้ง
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* ฝั่งซ้าย: รายการสินค้าในตะกร้า */}
            <div className="w-full lg:w-2/3 border border-gray-200 rounded-[20px] p-4 sm:p-6 space-y-6 shadow-sm">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 sm:gap-6 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#F0EEED] rounded-xl flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>
                    )}
                  </div>
                  
                  <div className="flex flex-col justify-between flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg sm:text-xl text-black leading-tight mb-1">{item.name}</h3>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1 cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <p className="font-bold text-xl sm:text-2xl text-black">฿{item.price.toLocaleString()}</p>
                      <div className="flex items-center bg-[#F0F0F0] rounded-full px-3 py-2 sm:px-4 sm:py-2.5 gap-3 sm:gap-5">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-black hover:opacity-70 cursor-pointer"
                        >
                          <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <span className="font-medium text-sm sm:text-base text-black">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-black hover:opacity-70 cursor-pointer"
                        >
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ฝั่งขวา: สรุปยอดสั่งซื้อ (Order Summary) */}
            <div className="w-full lg:w-1/3 border border-gray-200 rounded-[20px] p-5 sm:p-6 space-y-6 shadow-sm sticky top-24">
              <h2 className="font-bold text-xl sm:text-2xl text-black">สรุปคำสั่งซื้อ</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-[#666666]">
                  <span>ยอดรวมสินค้า</span>
                  <span className="font-medium text-black">฿{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#666666]">
                  <span>ค่าจัดส่ง</span>
                  <span className="font-medium text-black">฿{deliveryFee.toLocaleString()}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>ส่วนลด ({appliedCoupon.code}) <button onClick={removeCoupon} className="text-red-500 text-xs hover:underline ml-1">ลบออก</button></span>
                    <span className="font-medium">-฿{appliedCoupon.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                  <span className="text-black font-medium text-lg">ยอดรวมสุทธิ</span>
                  <span className="font-bold text-2xl text-black">฿{total.toLocaleString()}</span>
                </div>
              </div>

              {/* ช่องใส่ Promo Code */}
              {!appliedCoupon && (
                <div className="space-y-2">
                  <div className="flex gap-3">
                    <div className="flex-1 flex items-center bg-[#F0F0F0] rounded-full px-4 py-3">
                      <Tag className="w-5 h-5 text-gray-500 mr-2" />
                      <input 
                        type="text" 
                        placeholder="ใส่โค้ดส่วนลด" 
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-sm placeholder-gray-500 text-black uppercase"
                      />
                    </div>
                    <button 
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponInput.trim()}
                      className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isApplyingCoupon ? 'กำลังเช็ค...' : 'ใช้โค้ด'}
                    </button>
                  </div>
                  {couponError && <p className="text-red-500 text-xs px-4">{couponError}</p>}
                </div>
              )}

              {/* ปุ่ม Checkout */}
              <button 
                onClick={handleCheckout}
                disabled={loading || items.length === 0}
                className="w-full bg-black text-white rounded-full py-4 sm:py-5 flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-md disabled:bg-gray-400 mt-2 cursor-pointer"
              >
                <span className="font-medium text-base sm:text-lg">
                  {loading ? "กำลังดำเนินการ..." : "ชำระเงิน"}
                </span>
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
