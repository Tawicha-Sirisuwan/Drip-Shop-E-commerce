'use client'

import { Search } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export function ProductSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)

  // ใช้วิธีการ Debounce (หน่วงเวลา) ป้องกันการยิง Server Request รัวๆ ทุกครั้งที่พิมพ์ตัวอักษร
  // ลดภาระ Database (Performance Optimization)
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (query) {
        params.set('q', query)
      } else {
        params.delete('q')
      }
      // รีเซ็ตหน้ากลับไปที่ 1 เสมอเมื่อมีการค้นหาคำใหม่
      params.set('page', '1')
      
      router.push(`${pathname}?${params.toString()}`)
    }, 400) // หน่วงเวลา 400ms

    return () => clearTimeout(timer)
  }, [query, router, pathname, searchParams])

  return (
    <div className="relative w-full sm:w-64">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-[#E5E5E5] rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
        placeholder="ค้นหาสินค้า (ชื่อ, URL)..."
      />
    </div>
  )
}
