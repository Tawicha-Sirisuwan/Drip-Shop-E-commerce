import Link from 'next/link'
import { PlusCircle, Briefcase } from 'lucide-react'
import prisma from '@/lib/prisma'
import { BrandActions } from './_components/BrandActions'

import { Prisma } from '@prisma/client'
import { AdminSearch } from '../_components/AdminSearch'
import { AdminPagination } from '../_components/AdminPagination'

export const dynamic = 'force-dynamic'

// หน้าแสดงรายการแบรนด์ทั้งหมด ดึงข้อมูลตรงจาก Prisma (Server Component)
export default async function AdminBrandsPage(props: { readonly searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const search = typeof searchParams.search === 'string' ? searchParams.search : '';
  const limit = 10;
  const skip = (page - 1) * limit;

  const whereCondition: Prisma.BrandWhereInput = {};
  if (search) {
    whereCondition.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { slug: { contains: search, mode: 'insensitive' } },
    ];
  }

  const totalItems = await prisma.brand.count({ where: whereCondition });
  const totalPages = Math.ceil(totalItems / limit);

  const brands = await prisma.brand.findMany({
    where: whereCondition,
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl uppercase">Brands</h1>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <AdminSearch placeholder="ค้นหาแบรนด์ (ชื่อ, Slug)..." />
          <Link 
            href="/admin/brands/create" 
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition w-full sm:w-auto justify-center"
          >
            <PlusCircle className="w-4 h-4" /> Add Brand
          </Link>
        </div>
      </div>

      {/* Brands Table */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[#666666] text-xs uppercase tracking-wider border-b border-[#E5E5E5]">
                <th className="px-6 py-4 font-medium">Brand Name</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium text-center">Products Count</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {brands.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-[#666666]">
                    ไม่พบแบรนด์สินค้า คลิก "Add Brand" เพื่อสร้างใหม่
                  </td>
                </tr>
              ) : (
                brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-gray-50 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#F0EEED] flex items-center justify-center text-gray-500 overflow-hidden">
                          {brand.logoUrl ? (
                            <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-cover" />
                          ) : (
                            <Briefcase className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-black">{brand.name}</p>
                          <p className="text-xs text-[#666666] mt-0.5 font-mono">{brand.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                      {brand.description || '-'}
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-black">
                      {brand._count.products}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <BrandActions brandId={brand.id} brandName={brand.name} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <AdminPagination currentPage={page} totalPages={totalPages} totalItems={totalItems} itemsPerPage={limit} />
      </div>
    </div>
  )
}
