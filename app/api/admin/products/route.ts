import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const variantSchema = z.object({
  color: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  stock: z.number().int().nonnegative('Stock cannot be negative').default(0),
})

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  stock: z.number().int().nonnegative('Stock cannot be negative'),
  categoryId: z.string().min(1, 'Category is required'),
  isFeatured: z.boolean().default(false),
  images: z.array(z.string()).default([]),
  variants: z.array(variantSchema).default([]),
})

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isArchived: false
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = productSchema.parse(body)

    const { variants, ...productData } = validatedData

    const newProduct = await prisma.product.create({
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

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.flatten().fieldErrors }, { status: 400 })
    }
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
