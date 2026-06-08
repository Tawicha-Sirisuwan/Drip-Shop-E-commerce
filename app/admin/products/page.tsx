import Link from 'next/link'
import { PlusCircle, Filter, Package, AlertCircle } from 'lucide-react'
import prisma from '@/lib/prisma'
import { ProductActions } from './_components/ProductActions'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    where: { isArchived: false },
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl uppercase">Products</h1>
        <Link 
          href="/admin/products/create" 
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition w-full sm:w-auto justify-center"
        >
          <PlusCircle className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-t-2xl border border-[#E5E5E5] border-b-0 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <Link href="/admin/products" className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition bg-[#F0EEED] text-black">All Products</Link>
          <Link href="#" className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition text-[#666666] hover:bg-[#F0EEED] hover:text-black">
            In Stock
          </Link>
          <Link href="#" className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition text-[#666666] hover:bg-[#F0EEED] hover:text-black">
            Out of Stock
          </Link>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="border border-[#E5E5E5] text-black px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition w-full md:w-auto justify-center">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-b-2xl border border-[#E5E5E5] shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[#666666] text-xs uppercase tracking-wider border-y border-[#E5E5E5]">
                <th className="px-6 py-4 font-medium">Product Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[#666666]">
                    ไม่พบสินค้าในระบบ คลิก "Add Product" เพื่อสร้างสินค้าใหม่
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-black">{product.name}</p>
                      <p className="text-xs text-[#666666] mt-0.5 font-mono">{product.slug}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {product.category?.name || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4 font-medium text-black">
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4">
                      {product.stock > 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                          <Package className="w-3.5 h-3.5" /> In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                          <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ProductActions productId={product.id} productName={product.name} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (Static UI matching orders page) */}
        {products.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-[#666666]">Showing <span className="font-medium text-black">1</span> to <span className="font-medium text-black">{products.length}</span> of <span className="font-medium text-black">{products.length}</span> results</p>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:text-black hover:border-gray-300 disabled:opacity-50" disabled>
                &lt;
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-black text-white font-medium text-sm">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 disabled:opacity-50 transition" disabled>
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
