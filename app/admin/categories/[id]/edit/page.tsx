import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { CategoryForm } from '../../_components/CategoryForm'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const category = await prisma.category.findUnique({
    where: { id }
  })

  if (!category) {
    notFound()
  }

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
          <h1 className="font-display text-2xl uppercase text-black">Edit Category</h1>
          <p className="text-sm text-neutral-500 mt-1">แก้ไขข้อมูลหมวดหมู่สินค้า</p>
        </div>
      </div>

      <CategoryForm initialData={category} />
    </div>
  )
}
