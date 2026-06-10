import React from 'react';

/**
 * ส่วนท้ายของเว็บไซต์ (Footer) แสดงข้อมูลลิขสิทธิ์
 * มีการปรับขนาดความสูงให้เล็กลงโดยใช้ py-6 (เดิมคือ py-10) เพื่อความกระชับและสวยงาม
 */
export default function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500">
      <p>© 2026 DripShop. All Rights Reserved</p>
    </footer>
  );
}

