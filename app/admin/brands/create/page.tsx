import { BrandForm } from '../_components/BrandForm'

export default function CreateBrandPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl uppercase text-black mb-2">Create Brand</h1>
        <p className="text-sm text-neutral-500">เพิ่มแบรนด์ใหม่เข้าสู่ระบบ เพื่อนำไปผูกกับสินค้า</p>
      </div>

      <BrandForm />
    </div>
  )
}
