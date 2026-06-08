'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Edit, Trash2 } from 'lucide-react'

export function ProductActions({ productId, productName }: { productId: string, productName: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบสินค้า "${productName}"?`)) {
      return
    }

    try {
      setIsDeleting(true)
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete product')

      router.refresh()
    } catch (error) {
      console.error(error)
      alert('เกิดข้อผิดพลาดในการลบสินค้า')
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Link 
        href={`/admin/products/${productId}/edit`}
        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition" 
        title="Edit Product"
      >
        <Edit className="w-4 h-4" />
      </Link>
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition disabled:opacity-50" 
        title="Delete Product"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
