'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Package, Tag, FileText, LayoutGrid, Info, Check, Image as ImageIcon, X, UploadCloud } from 'lucide-react'

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be greater than 0'),
  stock: z.number().int().nonnegative('Stock cannot be negative'),
  categoryId: z.string().min(1, 'Category is required'),
  isFeatured: z.boolean().default(false),
  images: z.array(z.string()).default([]),
})

type ProductFormValues = z.infer<typeof productSchema>

export function ProductForm({ categories, initialData }: { categories: any[], initialData?: any }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: initialData || {
      name: '',
      slug: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: '',
      isFeatured: false,
      images: [],
    }
  })

  const isFeatured = watch('isFeatured')
  const currentImages = watch('images') || []

  // ฟังก์ชันแปลงไฟล์เป็น Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setValue('images', [...currentImages, base64String], { shouldValidate: true })
      // รีเซ็ตค่า input เพื่อให้สามารถเลือกไฟล์เดิมได้อีก
      e.target.value = ''
    }
    reader.readAsDataURL(file)
  }

  // ฟังก์ชันลบรูป
  const handleRemoveImage = (indexToRemove: number) => {
    setValue('images', currentImages.filter((_, idx) => idx !== indexToRemove), { shouldValidate: true })
  }

  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    try {
      setError(null)
      const url = initialData ? `/api/admin/products/${initialData.id}` : '/api/admin/products'
      const method = initialData ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        // ดัก Error กรณีไฟล์ใหญ่เกินไป (Payload Too Large) หรือ Server ส่งเป็น HTML กลับมา
        let errorMessage = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
        try {
          const errorData = await res.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          if (res.status === 413) {
            errorMessage = 'ขนาดรูปภาพใหญ่เกินไป (เกินขีดจำกัดของเซิร์ฟเวอร์)'
          } else {
            errorMessage = `Server Error (${res.status})`
          }
        }
        throw new Error(errorMessage)
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-10">
      {error && (
        <div className="p-4 flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
          <Info className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Grid Layout for Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Left Column: Main Information */}
        <div className="xl:col-span-2 space-y-6 lg:space-y-8">
          
          {/* General Information Section */}
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
            <h2 className="text-lg font-bold text-black mb-5 flex items-center gap-2">
              <FileText className="w-5 h-5 text-neutral-400" />
              General Information
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Product Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-4 w-4 text-neutral-400" />
                  </div>
                  <input
                    {...register('name')}
                    className="w-full rounded-lg border border-[#E5E5E5] pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-shadow"
                    placeholder="e.g. Minimalist Chair"
                  />
                </div>
                {errors.name && <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1"><Info className="w-3.5 h-3.5" />{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Slug</label>
                <input
                  {...register('slug')}
                  className="w-full rounded-lg border border-[#E5E5E5] px-3 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-shadow font-mono text-neutral-600 bg-neutral-50"
                  placeholder="e.g. minimalist-chair"
                />
                <p className="text-xs text-neutral-500 mt-1.5">Unique URL identifier for the product.</p>
                {errors.slug && <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1"><Info className="w-3.5 h-3.5" />{errors.slug.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Description</label>
                <textarea
                  {...register('description')}
                  rows={5}
                  className="w-full rounded-lg border border-[#E5E5E5] px-3 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-shadow resize-none leading-relaxed"
                  placeholder="Describe your product details..."
                />
                {errors.description && <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1"><Info className="w-3.5 h-3.5" />{errors.description.message}</p>}
              </div>
            </div>
          </div>

          {/* Media Section (Base64 Implementation) */}
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
            <h2 className="text-lg font-bold text-black mb-5 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-neutral-400" />
              Media
            </h2>
            
            {/* Image Previews */}
            {currentImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                {currentImages.map((img, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border border-[#E5E5E5] aspect-square bg-gray-50 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <div>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <label 
                htmlFor="image-upload"
                className="border-2 border-dashed border-[#E5E5E5] rounded-xl p-8 flex flex-col items-center justify-center text-center bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer group w-full"
              >
                <div className="w-12 h-12 bg-white border border-[#E5E5E5] rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-5 h-5 text-neutral-400" />
                </div>
                <p className="text-sm font-medium text-black">Click to upload image</p>
                <p className="text-xs text-neutral-500 mt-1">PNG, JPG (Base64 Mode)</p>
              </label>
              {errors.images && <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1"><Info className="w-3.5 h-3.5" />{errors.images.message}</p>}
            </div>
          </div>

        </div>

        {/* Right Column: Pricing, Inventory, Organization */}
        <div className="space-y-6 lg:space-y-8">
          
          {/* Pricing & Inventory */}
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
            <h2 className="text-lg font-bold text-black mb-5 flex items-center gap-2">
              <span className="font-serif italic text-lg text-neutral-400 w-5 text-center">฿</span>
              Pricing & Inventory
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Price (บาท)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-neutral-400 font-medium">฿</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    {...register('price', { valueAsNumber: true })}
                    className="w-full rounded-lg border border-[#E5E5E5] pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-shadow"
                    placeholder="0.00"
                  />
                </div>
                {errors.price && <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1"><Info className="w-3.5 h-3.5" />{errors.price.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Stock Quantity</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Package className="h-4 w-4 text-neutral-400" />
                  </div>
                  <input
                    type="number"
                    {...register('stock', { valueAsNumber: true })}
                    className="w-full rounded-lg border border-[#E5E5E5] pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-shadow"
                    placeholder="0"
                  />
                </div>
                {errors.stock && <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1"><Info className="w-3.5 h-3.5" />{errors.stock.message}</p>}
              </div>
            </div>
          </div>

          {/* Organization */}
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
            <h2 className="text-lg font-bold text-black mb-5 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-neutral-400" />
              Organization
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Category</label>
                <select
                  {...register('categoryId')}
                  className="w-full rounded-lg border border-[#E5E5E5] px-3 py-2.5 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-shadow appearance-none bg-white cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                >
                  <option value="" disabled className="text-gray-400">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1"><Info className="w-3.5 h-3.5" />{errors.categoryId.message}</p>}
              </div>

              {/* Custom Toggle Switch for Featured */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Visibility</label>
                <div 
                  className="flex items-center justify-between p-3.5 border border-[#E5E5E5] rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors"
                  onClick={() => setValue('isFeatured', !isFeatured, { shouldValidate: true })}
                >
                  <div>
                    <p className="text-sm font-medium text-black">Featured Product</p>
                    <p className="text-xs text-neutral-500 mt-0.5">Show on homepage</p>
                  </div>
                  <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isFeatured ? 'bg-black' : 'bg-neutral-200'}`}>
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isFeatured ? 'translate-x-4.5' : 'translate-x-1'}`} style={{ transform: isFeatured ? 'translateX(1.125rem)' : 'translateX(0.125rem)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 mt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-[#E5E5E5] rounded-lg hover:bg-neutral-50 hover:text-black transition-colors cursor-pointer"
        >
          Discard
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
              {initialData ? 'Update Product' : 'Save Product'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
