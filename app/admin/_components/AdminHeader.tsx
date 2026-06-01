"use client";

import React from 'react';
import Link from 'next/link';
import { Menu, Search, Bell, ChevronDown } from 'lucide-react';

interface AdminHeaderProps {
  setIsSidebarOpen: (val: boolean) => void;
}

export default function AdminHeader({ setIsSidebarOpen }: AdminHeaderProps) {
  return (
    <header className="h-20 bg-white border-b border-[#E5E5E5] flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-50 relative">
      <div className="flex items-center h-full">
        {/* Mobile Menu Toggle */}
        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-black hover:text-gray-600 mr-4">
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="hidden lg:flex items-center h-full">
          <Link href="/admin" className="font-display text-2xl tracking-tighter flex items-center pr-6 h-full border-r border-[#E5E5E5]">
            Drip Shop<span className="text-xs font-sans font-bold text-[#666666] ml-2 tracking-normal uppercase mt-1">ผู้ดูแลระบบ</span>
          </Link>
          <h1 className="ml-6 font-display text-xl sm:text-2xl uppercase">ภาพรวมระบบ</h1>
        </div>

        {/* Mobile Logo & Title */}
        <div className="flex lg:hidden items-center">
          <Link href="/admin" className="font-display text-xl tracking-tighter flex items-center pr-4 border-r border-[#E5E5E5] h-10">
            Drip Shop
          </Link>
          <h1 className="ml-4 font-display text-lg uppercase">ภาพรวม</h1>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6 h-full py-4">
        <div className="hidden md:flex items-center bg-[#F0EEED] rounded-full px-4 py-2 w-56 lg:w-80 transition-all focus-within:ring-2 focus-within:ring-gray-200">
          <Search className="w-5 h-5 text-gray-500" />
          <input type="text" placeholder="ค้นหาคำสั่งซื้อ, สินค้า..." className="bg-transparent border-none outline-none ml-2 w-full text-sm text-black" />
        </div>

        <button className="relative text-gray-500 hover:text-black transition cursor-pointer">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 border-l border-[#E5E5E5] pl-4 sm:pl-6 h-full cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-200 overflow-hidden">
            <img src="https://i.pravatar.cc/150?img=33" alt="Admin" className="w-full h-full object-cover" />
          </div>
          <div className="hidden sm:block text-sm">
            <p className="font-bold text-black leading-tight">แอดมินใจดี</p>
            <p className="text-[#666666] text-xs mt-0.5">ผู้ดูแลระบบสูงสุด</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
        </div>
      </div>
    </header>
  );
}
