import React from 'react';
import AnnouncementBar from '../../components/layout/AnnouncementBar';
// import Navbar from '../../components/layout/Navbar';
// import Footer from '../../components/layout/Footer';
import HeroSection from './_components/HeroSection';
import BrandsStrip from './_components/BrandsStrip';
import CategorySection from './_components/CategorySection';
import NewArrivals from './_components/NewArrivals';

export default function HomePage() {
  return (
    <div className="bg-white text-black antialiased font-sans">
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap');
        .font-display { font-family: 'Archivo Black', sans-serif; line-height: 1.1; }
        
        @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(10deg); }
            100% { transform: translateY(0px) rotate(0deg); }
        }
        .star-float { animation: float 4s ease-in-out infinite; }
      `}} />

      {/* 
        ในโปรเจกต์จริง AnnouncementBar, Navbar, Footer 
        มักจะถูกย้ายไปเรียกใช้ที่ไฟล์ app/layout.tsx เพื่อให้มีอยู่ทุกหน้าโดยอัตโนมัติ
        แต่ผมนำมาใส่ไว้ที่นี่ก่อนเพื่อให้เห็นภาพรวมครับ
      */}
      <AnnouncementBar />
      <main>
        {/* Component เหล่านี้ถูกหั่นไปเก็บไว้ในโฟลเดอร์ _components ข้างๆ ไฟล์นี้ครับ */}
        <HeroSection />
        <BrandsStrip />
        <CategorySection />
        <NewArrivals />
      </main>

      <hr className="border-gray-200 max-w-7xl mx-auto" />
      
    
    </div>
  );
}
