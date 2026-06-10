import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { CategoryForm } from '../_components/CategoryForm'

export default function CreateCategoryPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <Link 
          href="/admin/categories"
          className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-[#E5E5E5] text-neutral-500 hover:text-black"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl uppercase text-black">Create Category</h1>
          <p className="text-sm text-neutral-500 mt-1">เพิ่มหมวดหมู่สินค้าใหม่เข้าระบบ</p>
        </div>
      </div>

      <CategoryForm />
    </div>
  )
}
