import { ProductForm } from '../../create/_components/ProductForm'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [categories, product] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.product.findUnique({ where: { id }, include: { variants: true } })
  ])

  if (!product) {
    notFound()
  }

  // แปลง Decimal เป็น Number ก่อนส่งให้ Client Component
  const initialData = {
    ...product,
    price: Number(product.price),
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <Link href="/admin/products" className="text-sm text-neutral-500 hover:text-black inline-flex items-center mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-neutral-500 mt-1 text-sm">
          แก้ไขข้อมูลสินค้า "{product.name}"
        </p>
      </div>
      
      <div className="bg-transparent">
        {categories.length === 0 ? (
          <div className="text-center py-6 bg-white border rounded-lg shadow-sm">
            <p className="text-neutral-500 mb-4">คุณต้องสร้าง Category ก่อนจึงจะสามารถแก้ไขสินค้าได้</p>
          </div>
        ) : (
          <ProductForm categories={categories} initialData={initialData} />
        )}
      </div>
    </div>
  )
}
