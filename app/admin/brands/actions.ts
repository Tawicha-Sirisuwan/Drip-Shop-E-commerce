'use server'

import prisma from '@/lib/prisma'
import { brandSchema, BrandInput } from '@/lib/zod-schemas'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ฟังก์ชันสร้างแบรนด์ใหม่ (Create)
// ทำการตรวจสอบข้อมูลผ่าน Zod ก่อน หากถูกต้องจะสร้างใน Database
export async function createBrand(data: BrandInput) {
  const result = brandSchema.safeParse(data)
  
  if (!result.success) {
    return { error: 'ข้อมูลไม่ถูกต้อง' }
  }

  try {
    const existing = await prisma.brand.findUnique({
      where: { slug: result.data.slug }
    })

    if (existing) {
      return { error: 'Slug นี้ถูกใช้งานแล้ว' }
    }

    await prisma.brand.create({
      data: {
        name: result.data.name,
        slug: result.data.slug,
        logoUrl: result.data.logoUrl || null,
        description: result.data.description || null,
      }
    })
  } catch (error) {
    return { error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' }
  }

  revalidatePath('/admin/brands')
  redirect('/admin/brands')
}

// ฟังก์ชันอัปเดตแบรนด์ (Update)
export async function updateBrand(id: string, data: BrandInput) {
  const result = brandSchema.safeParse(data)
  
  if (!result.success) {
    return { error: 'ข้อมูลไม่ถูกต้อง' }
  }

  try {
    const existing = await prisma.brand.findUnique({
      where: { slug: result.data.slug }
    })

    // ตรวจสอบว่า slug ซ้ำกับแบรนด์อื่นหรือไม่
    if (existing && existing.id !== id) {
      return { error: 'Slug นี้ถูกใช้งานแล้ว' }
    }

    await prisma.brand.update({
      where: { id },
      data: {
        name: result.data.name,
        slug: result.data.slug,
        logoUrl: result.data.logoUrl || null,
        description: result.data.description || null,
      }
    })
  } catch (error) {
    return { error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' }
  }

  revalidatePath('/admin/brands')
  redirect('/admin/brands')
}

// ฟังก์ชันลบแบรนด์ (Delete)
export async function deleteBrand(id: string) {
  try {
    await prisma.brand.delete({
      where: { id }
    })
    revalidatePath('/admin/brands')
    return { success: true }
  } catch (error) {
    return { error: 'เกิดข้อผิดพลาดในการลบข้อมูล หรืออาจมีสินค้าที่ผูกกับแบรนด์นี้อยู่' }
  }
}
