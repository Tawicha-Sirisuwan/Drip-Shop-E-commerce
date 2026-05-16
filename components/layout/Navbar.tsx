import React from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, ChevronDown } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 grid grid-cols-2 lg:grid-cols-3 items-center gap-4">
      
      {/* 1. Left: Mobile Menu & Logo */}
      <div className="flex items-center gap-4 justify-start">
        <button className="lg:hidden text-2xl hover:text-gray-600 transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/" className="font-display text-2xl sm:text-3xl tracking-tighter whitespace-nowrap">Drip Shop</Link>
      </div>

      {/* 2. Center: Desktop Links (Guaranteed to be exactly in the center of the screen) */}
      <div className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 font-medium text-base whitespace-nowrap">
        <Link href="#" className="flex items-center gap-1 hover:text-gray-600 transition-colors">
          Shop <ChevronDown className="w-4 h-4" />
        </Link>
        <Link href="#" className="hover:text-gray-600 transition-colors">On Sale</Link>
        <Link href="#" className="hover:text-gray-600 transition-colors">New Arrivals</Link>
        <Link href="/brands" className="hover:text-gray-600 transition-colors">Brands</Link>
      </div>

      {/* 3. Right: Search & Icons */}
      <div className="flex items-center gap-4 sm:gap-6 justify-end">
        
        {/* Search Bar */}
        <div className="hidden xl:flex items-center bg-[#F0F0F0] text-black rounded-full px-4 py-2 w-64 focus-within:w-80 transition-all duration-300">
          <Search className="text-gray-500 w-5 h-5" />
          <input type="text" placeholder="Search for products..." className="bg-transparent border-none outline-none ml-3 w-full text-sm text-black placeholder-gray-500" />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 sm:gap-5">
          <button className="xl:hidden hover:text-gray-600 transition-colors">
            <Search className="w-6 h-6" />
          </button>
          
          <Link href="/cart" className="hover:text-gray-600 transition-colors relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-[#FF3333] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">2</span>
          </Link>
          
          <Link href="/login" className="hover:text-gray-600 transition-colors">
            <User className="w-6 h-6" />
          </Link>
        </div>
      </div>
      
    </nav>
  );
}
