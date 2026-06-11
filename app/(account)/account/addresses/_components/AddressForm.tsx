"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";
import { addressSchema, AddressInput } from "@/lib/zod-schemas";
import { createAddressAction, updateAddressAction } from "@/lib/actions/address";

/**
 * โครงสร้างข้อมูลที่ส่งเข้า Component AddressForm
 */
interface AddressFormProps {
  isOpen: boolean; // สถานะการเปิด/ปิด Modal
  onClose: () => void; // ฟังก์ชันเมื่อสั่งปิด Modal
  address?: {
    id: string;
    name: string;
    phone: string;
    street: string;
    subdistrict: string;
    district: string;
    province: string;
    postalCode: string;
    isDefault: boolean;
  } | null; // ข้อมูลที่ต้องการแก้ไข (ถ้าส่งมาจะเป็นโหมดแก้ไข ถ้าไม่มีจะเป็นโหมดเพิ่ม)
  onSuccess: (message: string) => void; // Callback เมื่อทำงานสำเร็จ
  onError: (message: string) => void; // Callback เมื่อเกิดข้อผิดพลาด
}

/**
 * AddressForm เป็นคอมโพเนนต์ฟอร์มป๊อปอัป (Modal Form)
 * ใช้สำหรับการจัดการข้อมูล เพิ่ม หรือ แก้ไข ที่อยู่จัดส่ง
 */
export default function AddressForm({
  isOpen,
  onClose,
  address,
  onSuccess,
  onError,
}: AddressFormProps) {
  // สร้างและตั้งค่าเริ่มต้นให้กับ react-hook-form ร่วมกับ Zod resolver สำหรับ Validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      phone: "",
      street: "",
      subdistrict: "",
      district: "",
      province: "",
      postalCode: "",
      isDefault: false,
    },
  });

  // ใช้ useEffect เพื่อ Reset ฟอร์มและอัปเดตข้อมูลเมื่อมีการเลือกแกไขที่อยู่ หรือปิดเปิดฟอร์มใหม่
  useEffect(() => {
    if (address) {
      reset({
        name: address.name,
        phone: address.phone,
        street: address.street,
        subdistrict: address.subdistrict,
        district: address.district,
        province: address.province,
        postalCode: address.postalCode,
        isDefault: address.isDefault,
      });
    } else {
      reset({
        name: "",
        phone: "",
        street: "",
        subdistrict: "",
        district: "",
        province: "",
        postalCode: "",
        isDefault: false,
      });
    }
  }, [address, reset, isOpen]);

  // หาก Modal ไม่ถูกสั่งให้แสดงผล ให้ข้ามการ Render ไป
  if (!isOpen) return null;

  /**
   * ฟังก์ชันจัดการเมื่อผู้ใช้กดยืนยันฟอร์ม (Submit)
   * จะทำการตรวจสอบว่าต้องเรียกใช้ Server Action ตัวไหนระหว่าง Create หรือ Update
   */
  const onSubmit = async (data: AddressInput) => {
    try {
      let result;
      if (address) {
        // หากมี address ส่งมาแสดงว่าอยู่ในโหมดแก้ไขข้อมูล
        result = await updateAddressAction(address.id, data);
      } else {
        // หากไม่มี address แสดงว่าอยู่ในโหมดเพิ่มข้อมูลใหม่
        result = await createAddressAction(data);
      }

      if (result.error) {
        onError(result.error);
      } else {
        onSuccess(result.success || "บันทึกข้อมูลสำเร็จ");
        onClose();
      }
    } catch (err) {
      console.error(err);
      onError("เกิดข้อผิดพลาดที่ไม่คาดคิด โปรดลองอีกครั้ง");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div 
        className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform scale-100 transition-all duration-300 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ส่วนหัวของฟอร์ม (Header) */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-[#FAFAFA]">
          <h2 className="text-xl font-semibold text-black">
            {address ? "แก้ไขที่อยู่จัดส่ง" : "เพิ่มที่อยู่จัดส่งใหม่"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black hover:bg-gray-100 p-2 rounded-xl transition-all"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ส่วนเนื้อหาฟอร์ม (Form Body) */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ฟิลด์กรอกชื่อผู้รับ */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 block">ชื่อผู้รับ *</label>
              <input
                {...register("name")}
                type="text"
                placeholder="เช่น สมชาย ใจดี"
                className={`w-full px-4 py-2.5 rounded-xl border text-base text-black focus:outline-none focus:ring-2 transition-all ${
                  errors.name
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:border-black focus:ring-black/5"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-0.5">{errors.name.message}</p>
              )}
            </div>

            {/* ฟิลด์กรอกเบอร์โทรศัพท์ */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 block">เบอร์โทรศัพท์ *</label>
              <input
                {...register("phone")}
                type="text"
                placeholder="เช่น 0812345678"
                className={`w-full px-4 py-2.5 rounded-xl border text-base text-black focus:outline-none focus:ring-2 transition-all ${
                  errors.phone
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:border-black focus:ring-black/5"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-0.5">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* ฟิลด์กรอกที่อยู่หลัก (บ้านเลขที่, ถนน) */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 block">ที่อยู่ (บ้านเลขที่, ซอย, ถนน) *</label>
            <textarea
              {...register("street")}
              placeholder="เช่น 123/45 หมู่บ้านสุขใจ ซอย 5 ถนนสุขุมวิท"
              rows={2}
              className={`w-full px-4 py-2.5 rounded-xl border text-base text-black focus:outline-none focus:ring-2 transition-all resize-none ${
                errors.street
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:border-black focus:ring-black/5"
              }`}
            />
            {errors.street && (
              <p className="text-red-500 text-sm mt-0.5">{errors.street.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* แขวง/ตำบล */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 block">แขวง / ตำบล *</label>
              <input
                {...register("subdistrict")}
                type="text"
                placeholder="เช่น คลองเตยเหนือ"
                className={`w-full px-4 py-2.5 rounded-xl border text-base text-black focus:outline-none focus:ring-2 transition-all ${
                  errors.subdistrict
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:border-black focus:ring-black/5"
                }`}
              />
              {errors.subdistrict && (
                <p className="text-red-500 text-sm mt-0.5">{errors.subdistrict.message}</p>
              )}
            </div>

            {/* เขต/อำเภอ */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 block">เขต / อำเภอ *</label>
              <input
                {...register("district")}
                type="text"
                placeholder="เช่น วัฒนา"
                className={`w-full px-4 py-2.5 rounded-xl border text-base text-black focus:outline-none focus:ring-2 transition-all ${
                  errors.district
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:border-black focus:ring-black/5"
                }`}
              />
              {errors.district && (
                <p className="text-red-500 text-sm mt-0.5">{errors.district.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* จังหวัด */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 block">จังหวัด *</label>
              <input
                {...register("province")}
                type="text"
                placeholder="เช่น กรุงเทพมหานคร"
                className={`w-full px-4 py-2.5 rounded-xl border text-base text-black focus:outline-none focus:ring-2 transition-all ${
                  errors.province
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:border-black focus:ring-black/5"
                }`}
              />
              {errors.province && (
                <p className="text-red-500 text-sm mt-0.5">{errors.province.message}</p>
              )}
            </div>

            {/* รหัสไปรษณีย์ */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 block">รหัสไปรษณีย์ *</label>
              <input
                {...register("postalCode")}
                type="text"
                placeholder="เช่น 10110"
                className={`w-full px-4 py-2.5 rounded-xl border text-base text-black focus:outline-none focus:ring-2 transition-all ${
                  errors.postalCode
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:border-black focus:ring-black/5"
                }`}
              />
              {errors.postalCode && (
                <p className="text-red-500 text-sm mt-0.5">{errors.postalCode.message}</p>
              )}
            </div>
          </div>

          {/* ติ๊กเลือกว่าเป็นที่อยู่หลัก */}
          <div className="flex items-center gap-3 pt-2">
            <input
              {...register("isDefault")}
              type="checkbox"
              id="isDefault"
              className="w-4.5 h-4.5 text-black border-gray-300 rounded focus:ring-black cursor-pointer accent-black"
            />
            <label htmlFor="isDefault" className="text-base text-gray-700 cursor-pointer font-medium select-none">
              ตั้งค่าเป็นที่อยู่จัดส่งหลัก
            </label>
          </div>

          {/* ส่วนปุ่มดำเนินการกดยืนยันหรือยกเลิก (Footer Actions) */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100 bg-[#FAFAFA] -mx-6 -mb-6 p-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl text-base font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl text-base font-medium text-white bg-black hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  กำลังบันทึก...
                </>
              ) : (
                "บันทึกข้อมูล"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
