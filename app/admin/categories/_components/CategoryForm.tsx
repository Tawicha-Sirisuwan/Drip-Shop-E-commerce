'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Tag, FileText, Info, Check } from 'lucide-react'
import { Prisma } from '@prisma/client'

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
})

type CategoryFormValues = z.infer<typeof categorySchema>

// ประเภทข้อมูลของ Category ที่ส่งมาเมื่อเป็นโหมด Edit (มาจาก Prisma โดยตรง)
type CategoryInitialData = Prisma.CategoryGetPayload<object>

export function CategoryForm({ initialData }: { initialData?: CategoryInitialData }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema) as Resolver<CategoryFormValues>,
    defaultValues: initialData
      ? {
          // แปลง initialData จาก Prisma ให้ตรงกับ CategoryFormValues schema
          // description: null จาก Prisma ต้องแปลงเป็น undefined เพราะ Zod schema ใช้ optional() (string | undefined)
          name: initialData.name,
          slug: initialData.slug,
          description: initialData.description ?? undefined,
        }
      : {
          name: '',
          slug: '',
          description: '',
        },
  })

  const onSubmit: SubmitHandler<CategoryFormValues> = async (data) => {
    try {
      setError(null)
      const url = initialData ? `/api/admin/categories/${initialData.id}` : '/api/admin/categories'
      const method = initialData ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || `Failed to ${initialData ? 'update' : 'create'} category`)
      }

      router.push('/admin/categories')
      router.refresh()
    } catch (err: unknown) {
      // ตรวจสอบก่อนเข้าถึง .message เพราะ err อาจไม่ใช่ Error object เสมอไป
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ')
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
          <Tag className="w-5 h-5 text-neutral-400" />
          Category Details
        </h2>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Category Name</label>
            <input
              {...register('name')}
              className="w-full rounded-lg border border-[#E5E5E5] px-3 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-shadow"
              placeholder="e.g. Tops, Bottoms, Accessories"
            />
            {errors.name && <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1"><Info className="w-3.5 h-3.5" />{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Slug</label>
            <input
              {...register('slug')}
              className="w-full rounded-lg border border-[#E5E5E5] px-3 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-shadow font-mono text-neutral-600 bg-neutral-50"
              placeholder="e.g. tops, bottoms"
            />
            <p className="text-xs text-neutral-500 mt-1.5">URL ที่ใช้สำหรับเข้าถึงหมวดหมู่นี้ เช่น /categories/tops</p>
            {errors.slug && <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1"><Info className="w-3.5 h-3.5" />{errors.slug.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Description (Optional)</label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full rounded-lg border border-[#E5E5E5] px-3 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-shadow resize-none leading-relaxed"
              placeholder="รายละเอียดหมวดหมู่..."
            />
            {errors.description && <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1"><Info className="w-3.5 h-3.5" />{errors.description.message}</p>}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-[#E5E5E5] rounded-lg hover:bg-neutral-50 hover:text-black transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              {initialData ? 'Update Category' : 'Save Category'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
