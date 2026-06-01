"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Tag, ShoppingCart, Users, TrendingUp, Settings, 
  LogOut, X 
} from 'lucide-react';

interface AdminSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
}

export default function AdminSidebar({ isSidebarOpen, setIsSidebarOpen }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E5E5E5] transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col h-full lg:h-auto`}
      >
        {/* Mobile Sidebar Close Button */}
        <div className="h-20 flex lg:hidden items-center justify-between px-6 border-b border-[#E5E5E5]">
          <span className="font-display text-xl tracking-tighter">Menu</span>
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-black">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
          
          <Link href="/admin" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition ${pathname === '/admin' ? 'bg-black text-white' : 'text-[#666666] hover:bg-[#F0EEED] hover:text-black'}`}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          
          <Link href="/admin/products" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition ${pathname.startsWith('/admin/products') ? 'bg-black text-white' : 'text-[#666666] hover:bg-[#F0EEED] hover:text-black'}`}>
            <Tag className="w-5 h-5" /> Products
          </Link>
          
          <Link href="/admin/orders" className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition ${pathname.startsWith('/admin/orders') ? 'bg-black text-white' : 'text-[#666666] hover:bg-[#F0EEED] hover:text-black'}`}>
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5" /> Orders
            </div>
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">12</span>
          </Link>
          
          <Link href="/admin/customers" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition ${pathname.startsWith('/admin/customers') ? 'bg-black text-white' : 'text-[#666666] hover:bg-[#F0EEED] hover:text-black'}`}>
            <Users className="w-5 h-5" /> Customers
          </Link>
          
          <Link href="/admin/analytics" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition ${pathname.startsWith('/admin/analytics') ? 'bg-black text-white' : 'text-[#666666] hover:bg-[#F0EEED] hover:text-black'}`}>
            <TrendingUp className="w-5 h-5" /> Analytics
          </Link>

          <div className="pt-6 mt-6 border-t border-[#E5E5E5]">
            <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Settings</p>
            <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 text-[#666666] hover:bg-[#F0EEED] hover:text-black rounded-xl font-medium transition">
              <Settings className="w-5 h-5" /> Store Settings
            </Link>
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl font-medium transition mt-2">
              <LogOut className="w-5 h-5" /> Log Out
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}
