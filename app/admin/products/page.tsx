import React from 'react';
import Link from 'next/link';
import { Plus, Filter, Download, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Gradient Graphic T-shirt',
    category: 'T-Shirts',
    sku: 'TS-GRAD-01',
    price: 145.00,
    stock: 124,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 2,
    name: 'Checkered Shirt',
    category: 'Shirts',
    sku: 'SH-CHK-02',
    price: 180.00,
    stock: 85,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 3,
    name: 'Skinny Fit Jeans',
    category: 'Jeans',
    sku: 'JN-SKN-03',
    price: 240.00,
    stock: 0,
    status: 'Out of Stock',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 4,
    name: 'One Life Graphic T-shirt',
    category: 'T-Shirts',
    sku: 'TS-ONEL-04',
    price: 260.00,
    stock: null,
    status: 'Draft',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 5,
    name: 'Black Basic Tee',
    category: 'T-Shirts',
    sku: 'TS-BLK-05',
    price: 80.00,
    stock: 215,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=150&q=80',
  }
];

export default async function ProductsPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  // In Next.js 15, searchParams is asynchronous
  const searchParams = await props.searchParams;
  const currentStatus = typeof searchParams.status === 'string' ? searchParams.status : 'all';

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Mobile Header & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="sm:hidden font-display text-2xl uppercase">Products</h1>
        
        <Link href="/admin/products/new" className="bg-black text-white px-5 py-2.5 rounded-full font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2 text-sm w-full sm:w-auto shadow-md">
          <Plus className="w-5 h-5 font-bold" /> Add New Product
        </Link>
      </div>

      {/* Filters & Actions Bar */}
      <div className="bg-white p-4 rounded-t-2xl border border-[#E5E5E5] border-b-0 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <Link href="/admin/products?status=all" className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${currentStatus === 'all' ? 'bg-[#F0EEED] text-black' : 'text-[#666666] hover:bg-[#F0EEED] hover:text-black'}`}>All Products</Link>
          <Link href="/admin/products?status=active" className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${currentStatus === 'active' ? 'bg-[#F0EEED] text-black' : 'text-[#666666] hover:bg-[#F0EEED] hover:text-black'}`}>Active</Link>
          <Link href="/admin/products?status=draft" className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${currentStatus === 'draft' ? 'bg-[#F0EEED] text-black' : 'text-[#666666] hover:bg-[#F0EEED] hover:text-black'}`}>Draft</Link>
          <Link href="/admin/products?status=outofstock" className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${currentStatus === 'outofstock' ? 'bg-[#F0EEED] text-black' : 'text-[#666666] hover:bg-[#F0EEED] hover:text-black'}`}>Out of Stock</Link>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="border border-[#E5E5E5] text-black px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition w-full md:w-auto justify-center">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button className="border border-[#E5E5E5] text-black px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition w-full md:w-auto justify-center">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-b-2xl border border-[#E5E5E5] shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[#666666] text-xs uppercase tracking-wider border-y border-[#E5E5E5]">
                <th className="px-6 py-4 w-12 text-center">
                  <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" />
                </th>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">SKU</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              
              {MOCK_PRODUCTS.filter(p => {
                 if (currentStatus === 'active') return p.status === 'Active';
                 if (currentStatus === 'draft') return p.status === 'Draft';
                 if (currentStatus === 'outofstock') return p.status === 'Out of Stock';
                 return true; // 'all'
              }).map((product) => (
                <tr 
                  key={product.id} 
                  className={`hover:bg-gray-50 transition group ${product.status === 'Out of Stock' ? 'bg-red-50/30' : ''}`}
                >
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" />
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-4 ${product.status === 'Draft' ? 'opacity-60' : ''}`}>
                      <div className="w-12 h-12 bg-[#F0EEED] rounded-md overflow-hidden flex-shrink-0">
                        <img src={product.image} alt={product.name} className={`w-full h-full object-cover ${product.status === 'Draft' ? 'grayscale' : ''}`} />
                      </div>
                      <div>
                        <p className="font-bold text-black text-base">{product.name}</p>
                        <p className="text-xs text-[#666666] mt-0.5">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{product.sku}</td>
                  <td className="px-6 py-4 font-medium text-black">${product.price.toFixed(2)}</td>
                  <td className={`px-6 py-4 ${product.status === 'Out of Stock' ? 'text-red-600 font-bold' : 'text-black'}`}>
                    {product.stock !== null ? product.stock : '-'}
                  </td>
                  <td className="px-6 py-4">
                    {product.status === 'Active' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                      </span>
                    )}
                    {product.status === 'Out of Stock' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Out of Stock
                      </span>
                    )}
                    {product.status === 'Draft' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {MOCK_PRODUCTS.filter(p => {
                 if (currentStatus === 'active') return p.status === 'Active';
                 if (currentStatus === 'draft') return p.status === 'Draft';
                 if (currentStatus === 'outofstock') return p.status === 'Out of Stock';
                 return true;
              }).length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-[#666666]">
                    No products found in this category.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-[#666666]">Showing <span className="font-medium text-black">1</span> to <span className="font-medium text-black">5</span> of <span className="font-medium text-black">42</span> results</p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:text-black hover:border-gray-300 disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-black text-white font-medium text-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-transparent text-[#666666] hover:bg-gray-100 font-medium text-sm transition">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-transparent text-[#666666] hover:bg-gray-100 font-medium text-sm transition">3</button>
            <span className="px-2 text-gray-400">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-transparent text-[#666666] hover:bg-gray-100 font-medium text-sm transition">9</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 transition">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
