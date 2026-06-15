"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateProfileInput, updateProfileSchema } from '@/lib/zod-schemas';
import { Info, Check } from 'lucide-react';

export default function AccountProfilePage() {
  const { data: session, update } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user?.name || '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    }
  });

  const onSubmit = async (data: UpdateProfileInput) => {
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
      }

      setSuccess('อัปเดตข้อมูลสำเร็จ');
      
      // Update NextAuth session with new name
      await update({ name: responseData.user.name });

      // Reset password fields if they were filled
      reset({
        name: data.name,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });

    } catch (err: unknown) {
      // ตรวจสอบก่อนเข้าถึง .message เพราะ err อาจไม่ใช่ Error object เสมอไป
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
    }
  };

  if (!session) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 shadow-sm">
      <h1 className="font-display text-2xl uppercase mb-6 text-black">ข้อมูลส่วนตัว</h1>

      {error && (
        <div className="mb-6 p-4 flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
          <Info className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 flex items-center gap-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl">
          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
        
        {/* Email (Read Only) */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">อีเมล (ไม่สามารถเปลี่ยนได้)</label>
          <input
            type="email"
            value={session.user?.email || ''}
            disabled
            className="w-full bg-gray-50 text-gray-500 rounded-lg px-4 py-3 outline-none border border-gray-200 cursor-not-allowed"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">ชื่อ-นามสกุล</label>
          <input
            {...register('name')}
            className={`w-full bg-white text-black rounded-lg px-4 py-3 outline-none border transition-colors focus:border-black ${errors.name ? 'border-red-500' : 'border-[#E5E5E5]'}`}
            placeholder="ชื่อของคุณ"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>}
        </div>

        <div className="border-t border-[#E5E5E5] pt-6 mt-8">
          <h2 className="text-lg font-bold text-black mb-4">เปลี่ยนรหัสผ่าน (ถ้าไม่เปลี่ยนให้เว้นว่างไว้)</h2>
        </div>

        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">รหัสผ่านปัจจุบัน</label>
          <input
            type="password"
            {...register('currentPassword')}
            className={`w-full bg-white text-black rounded-lg px-4 py-3 outline-none border transition-colors focus:border-black ${errors.currentPassword ? 'border-red-500' : 'border-[#E5E5E5]'}`}
            placeholder="••••••••"
          />
          {errors.currentPassword && <p className="text-red-500 text-xs mt-1.5">{errors.currentPassword.message}</p>}
        </div>

        {/* New Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">รหัสผ่านใหม่</label>
            <input
              type="password"
              {...register('newPassword')}
              className={`w-full bg-white text-black rounded-lg px-4 py-3 outline-none border transition-colors focus:border-black ${errors.newPassword ? 'border-red-500' : 'border-[#E5E5E5]'}`}
              placeholder="••••••••"
            />
            {errors.newPassword && <p className="text-red-500 text-xs mt-1.5">{errors.newPassword.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">ยืนยันรหัสผ่านใหม่</label>
            <input
              type="password"
              {...register('confirmNewPassword')}
              className={`w-full bg-white text-black rounded-lg px-4 py-3 outline-none border transition-colors focus:border-black ${errors.confirmNewPassword ? 'border-red-500' : 'border-[#E5E5E5]'}`}
              placeholder="••••••••"
            />
            {errors.confirmNewPassword && <p className="text-red-500 text-xs mt-1.5">{errors.confirmNewPassword.message}</p>}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center cursor-pointer"
          >
            {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
          </button>
        </div>
      </form>
    </div>
  );
}
