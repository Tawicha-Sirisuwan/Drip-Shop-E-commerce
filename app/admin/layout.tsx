"use client";

import React, { useState } from 'react';
import AdminHeader from './_components/AdminHeader';
import AdminSidebar from './_components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-[#FAFAFA] text-black antialiased flex flex-col h-screen overflow-hidden font-sans">
      
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap');
        .font-display { font-family: 'Archivo Black', sans-serif; line-height: 1.1; }
        
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
      `}} />

      <AdminHeader setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex flex-1 overflow-hidden relative">
        <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FAFAFA] overflow-y-auto">
          {/* Dynamic Page Content */}
          {children}
        </div>
      </div>
    </div>
  );
}
