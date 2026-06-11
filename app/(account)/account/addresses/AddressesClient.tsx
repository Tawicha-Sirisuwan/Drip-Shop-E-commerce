"use client";

import React, { useState, useTransition } from "react";
import { Plus, MapPin, Edit2, Trash2, Check, Loader2, AlertCircle } from "lucide-react";
import { deleteAddressAction, setDefaultAddressAction } from "@/lib/actions/address";
import AddressForm from "./_components/AddressForm";

/**
 * รูปแบบของออบเจกต์ Address ที่ใช้ใน Client
 */
interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

interface AddressesClientProps {
  initialAddresses: Address[]; // รายการที่อยู่จัดส่งเริ่มต้นที่ดึงมาจาก Server
}

/**
 * AddressesClient เป็น Client Component สำหรับจัดการหน้า UI ที่อยู่จัดส่ง
 * ประกอบด้วยรายการที่อยู่ ปุ่มลบ ปุ่มแก้ไข ปุ่มสลับที่อยู่หลัก และเปิดฟอร์ม Modal
 */
export default function AddressesClient({ initialAddresses }: AddressesClientProps) {
  // State สำหรับเปิด/ปิดฟอร์ม Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  // State เก็บที่อยู่ที่กำลังแก้ไข (หากเป็น null คืออยู่ในโหมด "เพิ่มใหม่")
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // State สำหรับเก็บข้อมูลข้อความแจ้งเตือนผลลัพธ์การทำงาน (Success/Error)
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // ใช้ Transition เพื่อแสดง Loading State ตอนเรียกใช้ Server Actions ลบหรืออัปเดตที่อยู่เริ่มต้น
  const [isPending, startTransition] = useTransition();
  const [actionId, setActionId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"delete" | "default" | null>(null);

  /**
   * ฟังก์ชันแสดงแจ้งเตือนชั่วคราว แล้วลบออกหลังผ่านไป 4 วินาที
   */
  const showNotification = (type: "success" | "error", text: string) => {
    setNotification({ type, text });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  /**
   * ฟังก์ชันเรียก Action ตั้งค่าเป็นที่อยู่หลัก
   */
  const handleSetDefault = (id: string) => {
    setActionId(id);
    setActionType("default");
    startTransition(async () => {
      try {
        const res = await setDefaultAddressAction(id);
        if (res.error) {
          showNotification("error", res.error);
        } else {
          showNotification("success", res.success || "ตั้งเป็นที่อยู่หลักสำเร็จ");
        }
      } catch (err) {
        console.error(err);
        showNotification("error", "เกิดข้อผิดพลาดในการดำเนินงาน");
      } finally {
        setActionId(null);
        setActionType(null);
      }
    });
  };

  /**
   * ฟังก์ชันเรียก Action ลบที่อยู่จัดส่ง (พร้อมขอคำยืนยันล่วงหน้า)
   */
  const handleDelete = (id: string) => {
    if (!window.confirm("คุณต้องการลบที่อยู่จัดส่งนี้ใช่หรือไม่?")) {
      return;
    }
    setActionId(id);
    setActionType("delete");
    startTransition(async () => {
      try {
        const res = await deleteAddressAction(id);
        if (res.error) {
          showNotification("error", res.error);
        } else {
          showNotification("success", res.success || "ลบที่อยู่สำเร็จ");
        }
      } catch (err) {
        console.error(err);
        showNotification("error", "เกิดข้อผิดพลาดในการดำเนินงาน");
      } finally {
        setActionId(null);
        setActionType(null);
      }
    });
  };

  /**
   * ฟังก์ชันสำหรับเปิดฟอร์มเพื่อแก้ไขที่อยู่เดิม
   */
  const openEditForm = (address: Address) => {
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  /**
   * ฟังก์ชันสำหรับเปิดฟอร์มเพื่อสร้างที่อยู่ใหม่
   */
  const openAddForm = () => {
    setEditingAddress(null);
    setIsFormOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 shadow-sm">
      {/* ส่วนหัวแสดงผล */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-black mb-1">ที่อยู่จัดส่ง</h1>
          <p className="text-[#666666] text-sm">จัดการข้อมูลที่อยู่สำหรับการจัดส่งสินค้าของคุณ</p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-all text-sm shadow-sm cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          เพิ่มที่อยู่ใหม่
        </button>
      </div>

      {/* กล่องแสดงแจ้งเตือน (Notifications Toast) */}
      {notification && (
        <div
          className={`flex items-center gap-2.5 p-4 mb-6 rounded-xl border text-sm animate-fade-in ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-100 text-emerald-800"
              : "bg-red-50 border-red-100 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span className="font-medium">{notification.text}</span>
        </div>
      )}

      {/* แสดงหน้ารายการที่อยู่ */}
      {initialAddresses.length === 0 ? (
        <div className="text-center py-16 px-4 border-2 border-dashed border-gray-100 rounded-2xl">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <MapPin className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-black mb-1">ยังไม่มีที่อยู่จัดส่ง</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            คุณยังไม่ได้เพิ่มข้อมูลที่อยู่จัดส่งสินค้า กรุณาเพิ่มที่อยู่เพื่อความสะดวกในการสั่งซื้อสินค้า
          </p>
          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors text-sm cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            เพิ่มที่อยู่แรกของคุณ
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {initialAddresses.map((address) => {
            const isDeleting = isPending && actionId === address.id && actionType === "delete";
            const isSettingDefault = isPending && actionId === address.id && actionType === "default";

            return (
              <div
                key={address.id}
                className={`relative p-5 rounded-xl border-2 transition-all flex flex-col min-h-[260px] ${
                  address.isDefault
                    ? "border-black bg-[#FAFAFA]"
                    : "border-[#E5E5E5] hover:border-gray-300"
                }`}
              >
                {/* ป้ายบอกสถานะที่อยู่หลัก */}
                {address.isDefault && (
                  <span className="absolute top-4 right-4 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full tracking-wide">
                    ที่อยู่หลัก
                  </span>
                )}

                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center flex-shrink-0 shadow-xs">
                    <MapPin className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-black">{address.name}</h3>
                    <p className="text-[#444444] text-sm mt-0.5">{address.phone}</p>
                  </div>
                </div>

                {/* รายละเอียดที่อยู่ */}
                <div className="text-sm text-[#444444] leading-relaxed mb-6 flex-grow">
                  <p className="font-medium text-black">{address.street}</p>
                  <p className="mt-1">
                    ตำบล/แขวง {address.subdistrict} อำเภอ/เขต {address.district}
                  </p>
                  <p>
                    จังหวัด {address.province} {address.postalCode}
                  </p>
                </div>

                {/* ส่วนจัดการปุ่มที่อยู่หลัก / แก้ไข / ลบ */}
                <div className="pt-4 border-t border-[#E5E5E5] mt-auto flex flex-col gap-3">
                  {/* แสดงปุ่ม "ตั้งเป็นที่อยู่หลัก" หากยังไม่ใช่ที่อยู่หลัก */}
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      disabled={isPending}
                      className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 py-2 px-3 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isSettingDefault ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          กำลังตั้งค่า...
                        </>
                      ) : (
                        "ตั้งเป็นที่อยู่หลัก"
                      )}
                    </button>
                  )}

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openEditForm(address)}
                      disabled={isPending}
                      className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-black bg-white border border-[#E5E5E5] py-2.5 rounded-lg hover:bg-[#FAFAFA] transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Edit2 className="w-4 h-4" />
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      disabled={isPending}
                      className="flex items-center justify-center w-10.5 h-10.5 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex-shrink-0 cursor-pointer disabled:opacity-50"
                      title="ลบที่อยู่นี้"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* แสดงฟอร์ม Modal สำหรับเพิ่มหรือแก้ไขข้อมูลที่อยู่ */}
      <AddressForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        address={editingAddress}
        onSuccess={(msg: string) => showNotification("success", msg)}
        onError={(msg: string) => showNotification("error", msg)}
      />
    </div>
  );
}
