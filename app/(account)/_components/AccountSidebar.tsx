"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, LogOut, MapPin } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AccountSidebar() {
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#E5E5E5] bg-[#FAFAFA]">
          <h2 className="font-display text-xl uppercase tracking-tight text-black">My Account</h2>
        </div>
        
        <nav className="flex flex-col p-2 space-y-1">
          <Link 
            href="/account"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              pathname === '/account' 
                ? 'bg-black text-white' 
                : 'text-[#666666] hover:bg-[#F0EEED] hover:text-black'
            }`}
          >
            <User className="w-5 h-5" />
            ข้อมูลส่วนตัว
          </Link>
          
          <Link 
            href="/account/orders"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              pathname.startsWith('/account/orders') 
                ? 'bg-black text-white' 
                : 'text-[#666666] hover:bg-[#F0EEED] hover:text-black'
            }`}
          >
            <Package className="w-5 h-5" />
            ประวัติคำสั่งซื้อ
          </Link>

          <Link 
            href="/account/addresses"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              pathname.startsWith('/account/addresses') 
                ? 'bg-black text-b' 
                : 'text-[#666666] hover:bg-[#F0EEED] hover:text-black'
            }`}
          >
            <MapPin className="w-5 h-5" />
            ที่อยู่จัดส่ง
          </Link>

          <div className="border-t border-[#E5E5E5] my-2 mx-2"></div>
          
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors w-full text-left cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            ออกจากระบบ
          </button>
        </nav>
      </div>
    </div>
  );
}
