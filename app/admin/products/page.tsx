import Link from 'next/link'
import { PlusCircle, Filter, Package, AlertCircle } from 'lucide-react'
import prisma from '@/lib/prisma'
import { ProductActions } from './_components/ProductActions'
import { ProductSearch } from './_components/ProductSearch'
import { ProductFilters } from './_components/ProductFilters'
import { ProductPagination } from './_components/ProductPagination'
import { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  
  // 1. รับค่าตัวแปรจาก URL Search Params เพื่อนำไปทำ Query Filtering (Server-Side)
  const query = typeof resolvedParams.q === 'string' ? resolvedParams.q : ''
  const status = typeof resolvedParams.status === 'string' ? resolvedParams.status : 'all'
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) : 1
  const limit = 10 // จำนวนสินค้าต่อหน้า
  
  // 2. สร้าง Prisma Where Condition (เงื่อนไขการค้นหา) อย่างยืดหยุ่น
  // การใช้ Server-Side Query แบบนี้ช่วยป้องกันการส่งข้อมูลที่ไม่ได้ใช้ไปยัง Client 
  const whereCondition: Prisma.ProductWhereInput = {
    isArchived: false,
    ...(query ? {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { slug: { contains: query, mode: 'insensitive' } },
      ]
    } : {}),
    ...(status === 'in-stock' ? { stock: { gt: 0 } } : {}),
    ...(status === 'out-of-stock' ? { stock: { equals: 0 } } : {}),
  }

  // 3. ใช้ Transaction เพื่อ Query ข้อมูล 2 อย่างพร้อมกัน (จำนวนรวม + ข้อมูลจริง)
  // วิธีนี้ลดเวลาที่ต้องรอ Database Query (ลด Latency) เมื่อเทียบกับการทำทีละคำสั่ง
  const [totalProducts, products] = await prisma.$transaction([
    prisma.product.count({ where: whereCondition }),
    prisma.product.findMany({
      where: whereCondition,
      include: { category: true, variants: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })
  ])

  // 4. คำนวณตัวเลข Pagination
  const totalPages = Math.ceil(totalProducts / limit)
  const startItem = totalProducts === 0 ? 0 : (page - 1) * limit + 1
  const endItem = Math.min(page * limit, totalProducts)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl uppercase">Products</h1>
        <Link 
          href="/admin/products/create" 
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition w-full sm:w-auto justify-center"
        >
          <PlusCircle className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Filters Bar (Client Components ถูกเรียกใช้งานที่นี่) */}
      <div className="bg-white p-4 rounded-t-2xl border border-[#E5E5E5] border-b-0 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <ProductFilters />
        
        {/* Search & Filter Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <ProductSearch />
          {/* ปุ่ม Filters เผื่อสำหรับเปิด Modal/Drawer ขั้นสูงในอนาคต */}
          <button className="border border-[#E5E5E5] text-black px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition w-full sm:w-auto justify-center">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-b-2xl border border-[#E5E5E5] shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[#666666] text-xs uppercase tracking-wider border-y border-[#E5E5E5]">
                <th className="px-6 py-4 font-medium">Product Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[#666666]">
                    ไม่พบสินค้าที่ค้นหา
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  // คำนวณสต็อกรวมทั้งหมด
                  const totalStock = product.variants.length > 0 
                    ? product.variants.reduce((acc, v) => acc + v.stock, 0)
                    : product.stock;

                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-black">{product.name}</p>
                        <p className="text-xs text-[#666666] mt-0.5 font-mono">{product.slug}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {product.category?.name || 'Uncategorized'}
                      </td>
                      <td className="px-6 py-4 font-medium text-black">
                        ฿{Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        {/* โชว์แจกแจง Stock แบบละเอียด */}
                        {product.variants.length > 0 ? (
                          <div className="flex flex-col gap-1.5 text-xs">
                            <div className="font-semibold text-black bg-gray-100 px-2 py-1 rounded w-max">รวม: {totalStock} ชิ้น</div>
                            <div className="max-h-[80px] overflow-y-auto pr-2 space-y-1">
                              {product.variants.map(v => (
                                <div key={v.id} className="text-gray-600 border-l-2 border-gray-300 pl-2 flex justify-between items-center gap-4">
                                  <span>{v.color || 'N/A'}, {v.size || 'N/A'}</span>
                                  <span className={`font-medium ${v.stock <= 0 ? 'text-red-500' : 'text-black'}`}>{v.stock}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-500 font-medium">{product.stock} ชิ้น</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {totalStock > 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                            <Package className="w-3.5 h-3.5" /> In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                            <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ProductActions productId={product.id} productName={product.name} />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination UI */}
        {totalProducts > 0 && (
          <div className="px-6 py-4 border-t border-[#E5E5E5] flex items-center justify-between">
            <p className="text-sm text-[#666666]">
              Showing <span className="font-medium text-black">{startItem}</span> to <span className="font-medium text-black">{endItem}</span> of <span className="font-medium text-black">{totalProducts}</span> results
            </p>
            <ProductPagination totalPages={totalPages} currentPage={page} />
          </div>
        )}
      </div>
    </div>
  )
}
