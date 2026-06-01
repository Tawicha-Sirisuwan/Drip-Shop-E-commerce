import React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-black text-white text-sm py-2 px-4 flex justify-center items-center relative">
      <p className="font-light">
        สมัครสมาชิกวันนี้ รับส่วนลด 20% สำหรับคำสั่งซื้อแรก 
        <Link href="#" className="font-medium underline ml-1 hover:text-gray-300">สมัครเลย</Link>
      </p>
      <button className="absolute right-4 hidden sm:block text-white hover:text-gray-300">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
