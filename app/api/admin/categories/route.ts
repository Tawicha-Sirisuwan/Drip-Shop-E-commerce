import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
})

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = categorySchema.parse(body)

    const newCategory = await prisma.category.create({
      data: validatedData
    })

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.flatten().fieldErrors }, { status: 400 })
    }
    // Handle unique constraint error for slug
    if ((error as any).code === 'P2002') {
      return NextResponse.json({ error: 'Slug นี้ถูกใช้งานแล้ว กรุณาใช้คำอื่น' }, { status: 400 })
    }
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
