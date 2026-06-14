import { z } from 'zod'

export const variantSchema = z.object({
  color: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  stock: z.number().int().nonnegative('Stock cannot be negative').default(0),
})

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be greater than 0'),
  stock: z.number().int().nonnegative('Stock cannot be negative'),
  categoryId: z.string().min(1, 'Category is required'),
  brandId: z.string().nullable().optional().transform(val => val === "" ? null : val),
  isFeatured: z.boolean().default(false),
  images: z.array(z.string()).default([]),
  variants: z.array(variantSchema).default([]),
})

export type ProductFormValues = z.infer<typeof productSchema>
