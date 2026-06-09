'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export function ProductPagination({ totalPages, currentPage }: { totalPages: number, currentPage: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // ฟังก์ชันสร้าง URL เมื่อทำการเปลี่ยนหน้า โดยเก็บ Query Params เดิมเอาไว้ทั้งหมด
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    return `${pathname}?${params.toString()}`
  }

  const handlePageChange = (page: number) => {
    router.push(createPageUrl(page))
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-1">
      <button 
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="w-8 h-8 flex items-center justify-center rounded border border-[#E5E5E5] text-gray-600 hover:text-black hover:border-gray-300 disabled:opacity-50 transition"
      >
        &lt;
      </button>
      
      {/* วนลูปสร้างปุ่มตัวเลขหน้า */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button 
          key={page}
          onClick={() => handlePageChange(page)}
          className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition ${
            currentPage === page 
              ? 'bg-black text-white' 
              : 'border border-[#E5E5E5] text-gray-600 hover:text-black hover:border-gray-300'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button 
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="w-8 h-8 flex items-center justify-center rounded border border-[#E5E5E5] text-gray-600 hover:text-black hover:border-gray-300 disabled:opacity-50 transition"
      >
        &gt;
      </button>
    </div>
  )
}
