import Link from 'next/link'
import { PlusCircle, Edit, Trash2 } from 'lucide-react'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-neutral-500 mt-1 text-sm">
            จัดการสินค้าและสต๊อกในระบบ
          </p>
        </div>
        <Link 
          href="/admin/products/create" 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-neutral-800 h-10 px-4 py-2"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Link>
      </div>

      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 border-b text-neutral-500 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                    ไม่พบสินค้าในระบบ คลิก "Add Product" เพื่อสร้างสินค้าใหม่
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-neutral-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-neutral-500">
                      {product.category?.name || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4 text-neutral-900">
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-neutral-500">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4">
                      {product.stock > 0 ? (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                          In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="text-neutral-400 hover:text-blue-600 transition-colors">
                        <Edit className="h-4 w-4 inline" />
                      </button>
                      <button className="text-neutral-400 hover:text-red-600 transition-colors">
                        <Trash2 className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
