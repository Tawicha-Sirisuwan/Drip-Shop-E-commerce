import { ProductForm } from '../../create/_components/ProductForm'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Prisma } from '@prisma/client'

// \u0e1b\u0e23\u0e30\u0e40\u0e20\u0e17\u0e2a\u0e33\u0e2b\u0e23\u0e31\u0e1a\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32\u0e17\u0e35\u0e48\u0e41\u0e1b\u0e25\u0e07 price \u0e08\u0e32\u0e01 Decimal \u0e40\u0e1b\u0e47\u0e19 number \u0e41\u0e25\u0e49\u0e27 \u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e2a\u0e48\u0e07\u0e43\u0e2b\u0e49 ProductForm
type InitialDataForEdit = Omit<
  Prisma.ProductGetPayload<{ include: { variants: true } }>,
  'price'
> & { price: number }

export const dynamic = 'force-dynamic'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [categories, brands, product] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
    prisma.product.findUnique({ where: { id }, include: { variants: true } })
  ])

  if (!product) {
    notFound()
  }

  // แปลง Decimal เป็น Number ก่อนส่งให้ ProductForm
  // ใช้ type annotation ชัดเจนเพื่อให้ TypeScript ตรวจสอบ type ได้
  const initialData: InitialDataForEdit = {
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
          <ProductForm categories={categories} brands={brands} initialData={initialData} />
        )}
      </div>
    </div>
  )
}
