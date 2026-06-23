import Link from 'next/link'
import { PlusCircle, Tag } from 'lucide-react'
import prisma from '@/lib/prisma'
import { CouponActions } from './_components/CouponActions'
import dayjs from 'dayjs'

import { Prisma } from '@prisma/client'
import { AdminSearch } from '../_components/AdminSearch'
import { AdminPagination } from '../_components/AdminPagination'

export const dynamic = 'force-dynamic'

export default async function AdminCouponsPage(props: { readonly searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const search = typeof searchParams.search === 'string' ? searchParams.search : '';
  const limit = 10;
  const skip = (page - 1) * limit;

  const whereCondition: Prisma.CouponWhereInput = {};
  if (search) {
    whereCondition.code = { contains: search, mode: 'insensitive' };
  }

  const totalItems = await prisma.coupon.count({ where: whereCondition });
  const totalPages = Math.ceil(totalItems / limit);

  const coupons = await prisma.coupon.findMany({
    where: whereCondition,
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl uppercase">โค้ดส่วนลด</h1>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <AdminSearch placeholder="ค้นหาโค้ดส่วนลด..." />
          <Link 
            href="/admin/coupons/create" 
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition w-full sm:w-auto justify-center"
          >
            <PlusCircle className="w-4 h-4" /> สร้างโค้ดส่วนลด
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[#666666] text-xs uppercase tracking-wider border-b border-[#E5E5E5]">
                <th className="px-6 py-4 font-medium">โค้ด</th>
                <th className="px-6 py-4 font-medium">ส่วนลด</th>
                <th className="px-6 py-4 font-medium">ขั้นต่ำ</th>
                <th className="px-6 py-4 font-medium">การใช้งาน</th>
                <th className="px-6 py-4 font-medium">วันหมดอายุ</th>
                <th className="px-6 py-4 font-medium">สถานะ</th>
                <th className="px-6 py-4 font-medium text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-[#666666]">
                    ไม่พบข้อมูลคูปองส่วนลด คลิก "สร้างโค้ดส่วนลด" เพื่อสร้างใหม่
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#F0EEED] flex items-center justify-center text-gray-500">
                          <Tag className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-black font-mono">{coupon.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {coupon.type === 'PERCENTAGE' ? `${Number(coupon.value)}%` : `฿${Number(coupon.value)}`}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {coupon.minOrderAmount ? `฿${Number(coupon.minOrderAmount)}` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.currentUses} / {coupon.maxUses ? coupon.maxUses : '∞'}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {coupon.expiryDate ? dayjs(coupon.expiryDate).format('DD MMM YYYY') : 'ไม่มีวันหมดอายุ'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {coupon.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <CouponActions couponId={coupon.id} code={coupon.code} isActive={coupon.isActive} />
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
