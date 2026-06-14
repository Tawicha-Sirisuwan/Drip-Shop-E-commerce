import { ProductForm } from './_components/ProductForm'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CreateProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } })
  ])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/admin/products" className="text-sm text-neutral-500 hover:text-black inline-flex items-center mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
        <p className="text-neutral-500 mt-1 text-sm">
          เพิ่มสินค้าใหม่เข้าสู่ระบบร้านค้าของคุณ
        </p>
      </div>
      
      <div className="bg-white border rounded-lg shadow-sm p-6">
        {categories.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-neutral-500 mb-4">คุณต้องสร้าง Category ก่อนจึงจะสามารถเพิ่มสินค้าได้</p>
            {/* TODO: Add link to create category once that page exists */}
          </div>
        ) : (
          <ProductForm categories={categories} brands={brands} />
        )}
      </div>
    </div>
  )
}
