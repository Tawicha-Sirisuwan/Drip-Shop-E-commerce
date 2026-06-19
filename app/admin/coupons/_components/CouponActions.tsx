'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteCouponAction } from '@/lib/actions/coupon'
import { useRouter } from 'next/navigation'

interface CouponActionsProps {
  couponId: string
  code: string
  isActive: boolean
}

export function CouponActions({ couponId, code, isActive }: CouponActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการปิดใช้งานคูปอง ${code}?`)) return
    
    setIsDeleting(true)
    try {
      await deleteCouponAction(couponId)
      router.refresh()
    } catch (error: any) {
      alert(error.message)
      setIsDeleting(false)
    }
  }

  if (!isActive) return null;

  return (
    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition disabled:opacity-50"
        title="Deactivate Coupon"
      >
        <Trash2 className="w-4 h-4 cursor-pointer" />
      </button>
    </div>
  )
}
