import React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { auth } from '@/auth';

export default async function AnnouncementBar() {
  // ดึง Session เพื่อเช็คว่าล็อกอินหรือยัง
  const session = await auth();

  // ถ้าผู้ใช้เข้าสู่ระบบแล้ว ให้ซ่อนแถบประกาศโฆษณานี้ไปเลย
  if (session?.user) {
    return null;
  }

  return (
    <div className="bg-black text-white text-sm py-2 px-4 flex justify-center items-center relative">
      <p className="font-light">
        สมัครสมาชิกวันนี้ รับส่วนลด 20% สำหรับคำสั่งซื้อแรก 
        <Link href="/register" className="font-medium underline ml-1 hover:text-gray-300">สมัครเลย</Link>
      </p>
      <button className="absolute right-4 hidden sm:block text-white hover:text-gray-300">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
