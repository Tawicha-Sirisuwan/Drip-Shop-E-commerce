import React from 'react';
import { Plus, MapPin, Edit2, Trash2 } from 'lucide-react';

/**
 * หน้าจัดการที่อยู่จัดส่ง (Address Management Page)
 * แสดงรายการที่อยู่ทั้งหมดของผู้ใช้ และมีปุ่มสำหรับเพิ่ม/แก้ไข/ลบ
 */
export default function AddressesPage() {
  // TODO: ในอนาคตจะดึงข้อมูลนี้มาจาก Prisma Database ผ่าน Server Action หรือ API
  const mockAddresses = [
    {
      id: "1",
      name: "สมชาย ใจดี",
      phone: "081-234-5678",
      street: "123/45 หมู่บ้านสุขสันต์ ซอย 1 ถนนสุขุมวิท",
      subdistrict: "คลองเตยเหนือ",
      district: "วัฒนา",
      province: "กรุงเทพมหานคร",
      postalCode: "10110",
      isDefault: true,
    },
    {
      id: "2",
      name: "สมชาย ใจดี",
      phone: "081-234-5678",
      street: "อาคารออฟฟิศทาวเวอร์ ชั้น 15 ถนนสีลม",
      subdistrict: "สีลม",
      district: "บางรัก",
      province: "กรุงเทพมหานคร",
      postalCode: "10500",
      isDefault: false,
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-semibold mb-1">ที่อยู่จัดส่ง</h1>
          <p className="text-[#666666] text-sm">จัดการข้อมูลที่อยู่สำหรับการจัดส่งสินค้าของคุณ</p>
        </div>
        <button className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors text-sm shadow-sm">
          <Plus className="w-4 h-4" />
          เพิ่มที่อยู่ใหม่
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {mockAddresses.map((address) => (
          <div 
            key={address.id} 
            className={`relative p-5 rounded-xl border-2 transition-all ${
              address.isDefault ? 'border-black bg-[#FAFAFA]' : 'border-[#E5E5E5] hover:border-gray-300'
            }`}
          >
            {address.isDefault && (
              <span className="absolute top-4 right-4 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full tracking-wide">
                ที่อยู่หลัก
              </span>
            )}

            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center flex-shrink-0 shadow-sm">
                <MapPin className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{address.name}</h3>
                <p className="text-[#666666] text-sm mt-0.5">{address.phone}</p>
              </div>
            </div>

            <div className="text-sm text-[#444444] leading-relaxed mb-6">
              <p>{address.street}</p>
              <p>แขวง/ตำบล {address.subdistrict} เขต/อำเภอ {address.district}</p>
              <p>จังหวัด {address.province} {address.postalCode}</p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#E5E5E5] mt-auto">
              <button className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-black bg-white border border-[#E5E5E5] py-2 rounded-lg hover:bg-[#FAFAFA] transition-colors">
                <Edit2 className="w-4 h-4" />
                แก้ไข
              </button>
              <button className="flex items-center justify-center w-10 h-10 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
