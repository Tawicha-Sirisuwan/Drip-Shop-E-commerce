'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCouponAction } from '@/lib/actions/coupon'
import { DiscountType } from '@prisma/client'

export default function CouponForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    code: '',
    type: DiscountType.PERCENTAGE,
    value: '',
    minOrderAmount: '',
    maxUses: '',
    expiryDate: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await createCouponAction({
        code: formData.code,
        type: formData.type,
        value: Number(formData.value),
        minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : null,
        maxUses: formData.maxUses ? Number(formData.maxUses) : null,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
      })
      router.push('/admin/coupons')
      setIsLoading(false)
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการสร้างคูปอง')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-black">โค้ดส่วนลด <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="code"
            required
            value={formData.code}
            onChange={handleChange}
            placeholder="เช่น SUMMER2024"
            className="w-full h-11 px-4 border border-[#E5E5E5] rounded-lg outline-none focus:border-black transition uppercase"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-black">ประเภทส่วนลด <span className="text-red-500">*</span></label>
          <select
            name="type"
            required
            value={formData.type}
            onChange={handleChange}
            className="w-full h-11 px-4 border border-[#E5E5E5] rounded-lg outline-none focus:border-black transition bg-white"
          >
            <option value="PERCENTAGE">เปอร์เซ็นต์ (%)</option>
            <option value="FIXED">จำนวนเงิน (บาท)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-black">มูลค่าส่วนลด <span className="text-red-500">*</span></label>
          <input
            type="number"
            name="value"
            required
            min="1"
            step="0.01"
            value={formData.value}
            onChange={handleChange}
            placeholder={formData.type === 'PERCENTAGE' ? "เช่น 10" : "เช่น 100"}
            className="w-full h-11 px-4 border border-[#E5E5E5] rounded-lg outline-none focus:border-black transition"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-black">ยอดสั่งซื้อขั้นต่ำ</label>
          <input
            type="number"
            name="minOrderAmount"
            min="0"
            value={formData.minOrderAmount}
            onChange={handleChange}
            placeholder="เช่น 500 (เว้นว่างได้)"
            className="w-full h-11 px-4 border border-[#E5E5E5] rounded-lg outline-none focus:border-black transition"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-black">จำนวนครั้งที่ใช้ได้สูงสุด</label>
          <input
            type="number"
            name="maxUses"
            min="1"
            value={formData.maxUses}
            onChange={handleChange}
            placeholder="เช่น 100 (เว้นว่างได้)"
            className="w-full h-11 px-4 border border-[#E5E5E5] rounded-lg outline-none focus:border-black transition"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-black">วันหมดอายุ</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="w-full h-11 px-4 border border-[#E5E5E5] rounded-lg outline-none focus:border-black transition"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-[#E5E5E5] flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
        >
          {isLoading ? 'กำลังสร้าง...' : 'สร้างโค้ดส่วนลด'}
        </button>
      </div>
    </form>
  )
}
