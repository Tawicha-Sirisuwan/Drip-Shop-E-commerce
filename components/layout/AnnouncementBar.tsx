import React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-black text-white text-sm py-2 px-4 flex justify-center items-center relative">
      <p className="font-light">
        Sign up and get 20% off to your first order. 
        <Link href="#" className="font-medium underline ml-1 hover:text-gray-300">Sign Up Now</Link>
      </p>
      <button className="absolute right-4 hidden sm:block text-white hover:text-gray-300">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
