import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { BrandForm } from '../_components/BrandForm'

export const dynamic = 'force-dynamic'

interface EditBrandPageProps {
  params: Promise<{ id: string }>
}

export default async function EditBrandPage({ params }: EditBrandPageProps) {
  const { id } = await params
  
  const brand = await prisma.brand.findUnique({
    where: { id }
  })

  if (!brand) {
    notFound()
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl uppercase text-black mb-2">Edit Brand</h1>
        <p className="text-sm text-neutral-500">แก้ไขข้อมูลแบรนด์ {brand.name}</p>
      </div>

      <BrandForm initialData={brand} />
    </div>
  )
}
