'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { deleteBrand } from '../actions'

interface BrandActionsProps {
  brandId: string
  brandName: string
}

// Component สำหรับปุ่ม Action (Edit/Delete) ในตารางของหน้า Brands
export function BrandActions({ brandId, brandName }: BrandActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  // ฟังก์ชันสำหรับการลบแบรนด์ผ่าน Server Action
  const handleDelete = async () => {
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบแบรนด์ ${brandName}?`)) return
    
    setIsDeleting(true)
    const result = await deleteBrand(brandId)
    
    if (result?.error) {
      alert(result.error)
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Link 
        href={`/admin/brands/${brandId}`}
        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
        title="Edit Brand"
      >
        <Edit className="w-4 h-4" />
      </Link>
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition disabled:opacity-50"
        title="Delete Brand"
      >
        <Trash2 className="w-4 h-4 cursor-pointer" />
      </button>
    </div>
  )
}
