import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // เช็คก่อนว่ามี Category หรือยัง
    let category = await prisma.category.findFirst()
    
    if (!category) {
      category = await prisma.category.create({
        data: {
          name: 'เสื้อผ้า (Clothing)',
          slug: 'clothing',
          description: 'หมวดหมู่เสื้อผ้าเครื่องแต่งกาย'
        }
      })
    }
    
    return NextResponse.json({ success: true, category })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
