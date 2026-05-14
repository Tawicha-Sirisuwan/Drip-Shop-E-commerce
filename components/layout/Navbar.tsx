import React from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, ChevronDown } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="lg:hidden text-2xl">
          <Menu className="w-6 h-6" />
        </button>
        <Link href="#" className="font-display text-2xl sm:text-3xl tracking-tighter">SHOP.CO</Link>
      </div>

      <div className="hidden lg:flex items-center gap-6 font-medium text-base">
        <Link href="#" className="flex items-center gap-1 hover:text-gray-600 transition">
          Shop <ChevronDown className="w-4 h-4" />
        </Link>
        <Link href="#" className="hover:text-gray-600 transition">On Sale</Link>
        <Link href="#" className="hover:text-gray-600 transition">New Arrivals</Link>
        <Link href="#" className="hover:text-gray-600 transition">Brands</Link>
      </div>

      <div className="flex items-center gap-4 flex-1 justify-end lg:justify-between lg:ml-10">
        <div className="hidden md:flex items-center bg-[#F0F0F0] rounded-full px-4 py-2 flex-1 max-w-md">
          <Search className="text-gray-500 w-5 h-5" />
          <input type="text" placeholder="Search for products..." className="bg-transparent border-none outline-none ml-3 w-full text-sm text-gray-700" />
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button className="md:hidden hover:text-gray-600">
            <Search className="w-6 h-6" />
          </button>
          <Link href="#" className="hover:text-gray-600">
            <ShoppingCart className="w-6 h-6" />
          </Link>
          <Link href="#" className="hover:text-gray-600">
            <User className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
