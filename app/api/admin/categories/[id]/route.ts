import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
})

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const category = await prisma.category.findUnique({
      where: { id }
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const validatedData = categorySchema.parse(body)

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(updatedCategory)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.flatten().fieldErrors }, { status: 400 })
    }
    if ((error as any).code === 'P2002') {
      return NextResponse.json({ error: 'Slug นี้ถูกใช้งานแล้ว กรุณาใช้คำอื่น' }, { status: 400 })
    }
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    // Check if category has products before deleting
    const productsCount = await prisma.product.count({
      where: { categoryId: id }
    })
    
    if (productsCount > 0) {
      return NextResponse.json(
        { error: `ไม่สามารถลบได้ มีสินค้าผูกกับหมวดหมู่นี้อยู่ ${productsCount} ชิ้น` }, 
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
