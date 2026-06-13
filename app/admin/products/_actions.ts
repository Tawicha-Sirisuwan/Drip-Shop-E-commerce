'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { productSchema, type ProductFormValues } from './_schemas'

/**
 * Server Action สำหรับการบันทึกข้อมูลสินค้า (ทั้ง Create และ Update)
 * @param data ข้อมูลจากฟอร์มที่ผ่านการ Validate จากหน้าจอเบื้องต้นแล้ว
 */
export async function saveProduct(data: ProductFormValues) {
  try {
    // 1. ตรวจสอบสิทธิ์การเข้าถึง (RBAC - Role-Based Access Control)
    // อธิบาย: เป็น Best Practice ทางด้าน Security เพื่อป้องกันกรณีมีผู้เจตนาร้าย (Attacker) ยิง Action เข้ามาตรงๆ โดยไม่ผ่านหน้า UI
    const session = await auth()
    if (!session?.user?.email) {
      throw new Error('Unauthorized. You must be logged in.')
    }
    
    // ดึงข้อมูล User จาก Database เพื่อตรวจสอบ Role อย่างละเอียดและปลอดภัยที่สุด
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    })

    if (dbUser?.role !== 'ADMIN') {
      throw new Error('Forbidden. Only admins can perform this action.')
    }

    // 2. ตรวจสอบและคัดกรองข้อมูล (Data Validation)
    // อธิบาย: ใช้ Zod ช่วยกรองข้อมูลอีกรอบ เผื่อฝั่ง Client ฝ่าด่านมาได้ 
    const validatedData = productSchema.parse(data)
    const { id, variants, ...productData } = validatedData

    if (id) {
      // 3A. กรณีอัปเดตข้อมูล (Update)
      // อธิบาย: เราใช้เทคนิค deleteMany แล้วค่อย create เพื่อทำการรีเซ็ต Variant ให้ตรงกับข้อมูลใหม่ในฟอร์มเสมอ 
      await prisma.product.update({
        where: { id },
        data: {
          ...productData,
          variants: {
            deleteMany: {},
            create: variants.map(v => ({
              color: v.color || null,
              size: v.size || null,
              stock: v.stock
            }))
          }
        }
      })
    } else {
      // 3B. กรณีสร้างข้อมูลใหม่ (Create)
      await prisma.product.create({
        data: {
          ...productData,
          variants: {
            create: variants.map(v => ({
              color: v.color || null,
              size: v.size || null,
              stock: v.stock
            }))
          }
        }
      })
    }

    // 4. ล้างแคชหน้าเว็บเพจต่างๆ (Cache Revalidation)
    // อธิบาย: Next.js (App Router) แคชข้อมูลเก่งมาก เราต้องสั่ง revalidatePath เพื่อให้ผู้ใช้/ลูกค้า เห็นข้อมูลสินค้าใหม่ทันทีโดยไม่ต้องรอ
    revalidatePath('/admin/products')
    revalidatePath('/products')
    
    return { success: true }
  } catch (error) {
    // ดัก Error ของ Zod เผื่อเป็นประโยชน์ในการ Debug
    if (error instanceof z.ZodError) {
      console.error('Validation Error:', error.flatten().fieldErrors)
      throw new Error('Invalid data format')
    }
    
    // แปลง Error จาก Prisma ให้เป็นข้อความที่หน้าจออ่านง่าย
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Product save error:', errorMessage)
    throw new Error(errorMessage)
  }
}
