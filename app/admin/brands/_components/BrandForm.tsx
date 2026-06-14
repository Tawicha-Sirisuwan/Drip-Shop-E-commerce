'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Info, Check, Briefcase } from 'lucide-react'
import { brandSchema, BrandInput } from '@/lib/zod-schemas'
import { createBrand, updateBrand } from '../actions'

interface BrandFormProps {
  initialData?: {
    id: string
    name: string
    slug: string
    logoUrl?: string | null
    description?: string | null
  }
}

// Component สำหรับฟอร์มสร้าง/แก้ไข แบรนด์ (Client Component)
// ใช้ react-hook-form คู่กับ zod ในการจัดการ form state และ validation
export function BrandForm({ initialData }: BrandFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BrandInput>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      logoUrl: initialData?.logoUrl || '',
      description: initialData?.description || '',
    }
  })

  // ฟังก์ชันจัดการเมื่อกด Submit เรียกใช้ Server Actions โดยตรง
  const onSubmit: SubmitHandler<BrandInput> = async (data) => {
    setError(null)
    const result = initialData 
      ? await updateBrand(initialData.id, data)
      : await createBrand(data)
      
    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-10 max-w-3xl">
      {error && (
        <div className="p-4 flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
          <Info className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
        <h2 className="text-lg font-bold text-black mb-5 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-neutral-400" />
          รายละเอียดแบรนด์
        </h2>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">ชื่อแบรนด์ (Brand Name)</label>
            <input
              {...register('name')}
              className="w-full rounded-lg border border-[#E5E5E5] px-3 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-shadow"
              placeholder="เช่น Nike, Adidas, Apple"
            />
            {errors.name && <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1"><Info className="w-3.5 h-3.5" />{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Slug (URL)</label>
            <input
              {...register('slug')}
              className="w-full rounded-lg border border-[#E5E5E5] px-3 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-shadow font-mono text-neutral-600 bg-neutral-50"
              placeholder="เช่น nike, apple"
            />
            <p className="text-xs text-neutral-500 mt-1.5">ใช้เป็น URL เช่น /brands/nike</p>
            {errors.slug && <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1"><Info className="w-3.5 h-3.5" />{errors.slug.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Logo URL (ตัวเลือก)</label>
            <input
              {...register('logoUrl')}
              className="w-full rounded-lg border border-[#E5E5E5] px-3 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-shadow text-neutral-600"
              placeholder="https://example.com/logo.png"
            />
            {errors.logoUrl && <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1"><Info className="w-3.5 h-3.5" />{errors.logoUrl.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">รายละเอียด (ตัวเลือก)</label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full rounded-lg border border-[#E5E5E5] px-3 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-shadow resize-none leading-relaxed"
              placeholder="คำอธิบายแบรนด์..."
            />
            {errors.description && <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1"><Info className="w-3.5 h-3.5" />{errors.description.message}</p>}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-[#E5E5E5] rounded-lg hover:bg-neutral-50 hover:text-black transition-colors cursor-pointer"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              กำลังบันทึก...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              {initialData ? 'อัปเดตแบรนด์' : 'สร้างแบรนด์'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
