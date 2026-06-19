import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CouponForm from './_components/CouponForm'

export default function CreateCouponPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/coupons" className="w-10 h-10 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center text-gray-600 hover:bg-gray-50 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-display text-2xl uppercase">สร้างโค้ดส่วนลด</h1>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-6 sm:p-8">
        <CouponForm />
      </div>
    </div>
  )
}
