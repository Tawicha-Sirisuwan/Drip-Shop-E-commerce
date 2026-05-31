"use client";

import { X, Star, Mail, Ticket, Phone, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

interface CustomerProfileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  // This could take a customer object in the future
}

export function CustomerProfileSheet({ isOpen, onClose }: CustomerProfileSheetProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="font-black text-lg uppercase">Customer Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition p-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Profile Info */}
          <div className="flex items-center gap-4 mb-8">
            <img src="https://i.pravatar.cc/150?img=47" alt="Sarah Connor" className="w-20 h-20 rounded-full object-cover border border-gray-200" />
            <div>
              <h3 className="font-bold text-xl text-black flex items-center gap-2">Sarah Connor</h3>
              <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <Star className="w-3 h-3 mr-1 text-yellow-600 fill-current" /> VIP Member
              </span>
              <p className="text-xs text-gray-500 mt-2">Customer since Jan 2023</p>
            </div>
          </div>

          {/* CRM Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <button className="bg-black text-white rounded-xl py-2.5 text-sm font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" /> Send Email
            </button>
            <button className="border border-gray-200 text-black rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
              <Ticket className="w-5 h-5" /> Send Discount
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 font-medium mb-1">Total Spent</p>
              <p className="font-black text-xl text-black">$8,320.50</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 font-medium mb-1">Total Orders</p>
              <p className="font-black text-xl text-black">45</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 col-span-2">
              <p className="text-xs text-gray-500 font-medium mb-1">Average Order Value (AOV)</p>
              <p className="font-black text-xl text-black">$184.90</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mb-8">
            <h4 className="font-bold text-sm text-black mb-4 uppercase tracking-wider">Contact Information</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-black font-medium">sarah.c@example.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-500">+44 7700 900077</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <span className="text-gray-500">123 Baker Street<br/>London, W1U 6TE<br/>United Kingdom</span>
              </div>
            </div>
          </div>

          {/* Recent Purchase History */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-sm text-black uppercase tracking-wider">Recent Orders</h4>
              <a href="#" className="text-xs font-medium underline text-gray-500 hover:text-black">View All</a>
            </div>
            
            <div className="space-y-4">
              {/* History Item 1 */}
              <div className="border border-gray-100 rounded-xl p-4 hover:border-gray-300 transition cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-sm text-black">#ORD-1044</span>
                  <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded">Delivered</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">May 18, 2026</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">3 Items</span>
                  <span className="font-bold text-sm text-black">$320.50</span>
                </div>
              </div>
              
              {/* History Item 2 */}
              <div className="border border-gray-100 rounded-xl p-4 hover:border-gray-300 transition cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-sm text-black">#ORD-0982</span>
                  <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded">Delivered</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">April 12, 2026</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">1 Item</span>
                  <span className="font-bold text-sm text-black">$145.00</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
