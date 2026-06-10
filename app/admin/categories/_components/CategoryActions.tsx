'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Edit, Trash2 } from 'lucide-react'

export function CategoryActions({ categoryId, categoryName, productsCount }: { categoryId: string, categoryName: string, productsCount: number }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (productsCount > 0) {
      alert(`ไม่สามารถลบ "${categoryName}" ได้ เพราะมีสินค้าในหมวดหมู่นี้อยู่ ${productsCount} ชิ้น\nกรุณาลบหรือย้ายสินค้าออกก่อน`)
      return
    }

    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่ "${categoryName}"?`)) {
      return
    }

    try {
      setIsDeleting(true)
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete category')
      }

      router.refresh()
    } catch (error: any) {
      console.error(error)
      alert(error.message || 'เกิดข้อผิดพลาดในการลบหมวดหมู่')
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Link 
        href={`/admin/categories/${categoryId}/edit`}
        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition" 
        title="Edit Category"
      >
        <Edit className="w-4 h-4" />
      </Link>
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition disabled:opacity-50" 
        title={productsCount > 0 ? "ลบไม่ได้เพราะมีสินค้าอยู่" : "Delete Category"}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
