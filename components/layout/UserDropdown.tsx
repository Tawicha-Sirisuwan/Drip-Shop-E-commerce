"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, LogOut, Settings, ShieldCheck } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface UserDropdownProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ปิด Dropdown เมื่อคลิกพื้นที่อื่นนอก Dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="hover:text-gray-600 transition-colors flex items-center gap-2 focus:outline-none cursor-pointer"
      >
        <div className="bg-gray-100 p-1.5 rounded-full">
          <User className="w-5 h-5 text-black" />
        </div>
        <span className="hidden md:inline-block text-sm font-medium whitespace-nowrap">
          {user.name || "Account"}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
          {/* ส่วนหัวของ Dropdown แสดงข้อมูล User */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <p className="text-sm text-black font-semibold truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          
          <div className="py-2">
            <Link 
              href="/account" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              บัญชีของฉัน
            </Link>
            
            {user.role === 'ADMIN' && (
              <Link 
                href="/admin" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                เข้าสู่หน้าผู้ดูแลระบบ
              </Link>
            )}

            <div className="border-t border-gray-100 my-1"></div>
            
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              ออกจากระบบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
