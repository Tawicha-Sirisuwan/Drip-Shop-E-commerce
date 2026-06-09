'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export function ProductFilters() {
  const searchParams = useSearchParams()
  const currentStatus = searchParams.get('status') || 'all'
  const currentQuery = searchParams.get('q')

  // ฟังก์ชันช่วยสร้าง URL สำหรับแต่ละ Tab โดยรักษาสถานะการค้นหา (Query) ปัจจุบันไว้
  const createFilterUrl = (status: string) => {
    const params = new URLSearchParams()
    if (currentQuery) params.set('q', currentQuery)
    if (status !== 'all') params.set('status', status)
    
    // เมื่อกดเปลี่ยน Tab Filter เราจะให้กลับไปเริ่มที่หน้า 1
    params.set('page', '1')
    return `/admin/products?${params.toString()}`
  }

  const tabs = [
    { id: 'all', label: 'All Products' },
    { id: 'in-stock', label: 'In Stock' },
    { id: 'out-of-stock', label: 'Out of Stock' },
  ]

  return (
    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
      {tabs.map((tab) => (
        <Link 
          key={tab.id}
          href={createFilterUrl(tab.id)} 
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
            currentStatus === tab.id 
              ? 'bg-[#F0EEED] text-black' 
              : 'text-[#666666] hover:bg-[#F0EEED] hover:text-black'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}
