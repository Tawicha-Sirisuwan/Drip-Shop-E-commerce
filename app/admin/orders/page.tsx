import React from 'react';
import Link from 'next/link';
import { Filter, Download, Eye, Truck, Package, PackageCheck, AlertCircle } from 'lucide-react';

const MOCK_ORDERS = [
  {
    id: 'ORD-001',
    customer: 'Alex Morgan',
    date: 'Aug 20, 2026',
    itemsCount: 3,
    total: 145.00,
    paymentStatus: 'Paid',
    deliveryStatus: 'Shipped',
    trackingNumber: 'TH123456789EX',
  },
  {
    id: 'ORD-002',
    customer: 'Sarah Connor',
    date: 'Aug 19, 2026',
    itemsCount: 1,
    total: 320.50,
    paymentStatus: 'Paid',
    deliveryStatus: 'Processing',
    trackingNumber: null,
  },
  {
    id: 'ORD-003',
    customer: 'David Miller',
    date: 'Aug 19, 2026',
    itemsCount: 2,
    total: 85.00,
    paymentStatus: 'Pending',
    deliveryStatus: 'Pending',
    trackingNumber: null,
  },
  {
    id: 'ORD-004',
    customer: 'Emily Chen',
    date: 'Aug 18, 2026',
    itemsCount: 4,
    total: 210.00,
    paymentStatus: 'Failed',
    deliveryStatus: 'Cancelled',
    trackingNumber: null,
  },
  {
    id: 'ORD-005',
    customer: 'Michael Wong',
    date: 'Aug 18, 2026',
    itemsCount: 1,
    total: 45.00,
    paymentStatus: 'Paid',
    deliveryStatus: 'Processing',
    trackingNumber: null,
  }
];

export default async function OrdersPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const currentStatus = typeof searchParams.status === 'string' ? searchParams.status : 'all';

  const filteredOrders = MOCK_ORDERS.filter(order => {
    if (currentStatus === 'pending') return order.deliveryStatus === 'Pending';
    if (currentStatus === 'processing') return order.deliveryStatus === 'Processing';
    if (currentStatus === 'shipped') return order.deliveryStatus === 'Shipped';
    return true; // 'all'
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Mobile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="sm:hidden font-display text-2xl uppercase">Orders</h1>
        <div className="hidden sm:block"></div> {/* Spacer */}
      </div>

      {/* Filters & Actions Bar */}
      <div className="bg-white p-4 rounded-t-2xl border border-[#E5E5E5] border-b-0 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <Link href="/admin/orders?status=all" className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${currentStatus === 'all' ? 'bg-[#F0EEED] text-black' : 'text-[#666666] hover:bg-[#F0EEED] hover:text-black'}`}>All Orders</Link>
          <Link href="/admin/orders?status=pending" className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${currentStatus === 'pending' ? 'bg-[#F0EEED] text-black' : 'text-[#666666] hover:bg-[#F0EEED] hover:text-black'}`}>
            New (Pending) <span className="ml-1 bg-red-100 text-red-600 px-1.5 rounded-full text-xs">12</span>
          </Link>
          <Link href="/admin/orders?status=processing" className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${currentStatus === 'processing' ? 'bg-[#F0EEED] text-black' : 'text-[#666666] hover:bg-[#F0EEED] hover:text-black'}`}>กำลังแพ็ค (Processing)</Link>
          <Link href="/admin/orders?status=shipped" className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${currentStatus === 'shipped' ? 'bg-[#F0EEED] text-black' : 'text-[#666666] hover:bg-[#F0EEED] hover:text-black'}`}>จัดส่งแล้ว (Shipped)</Link>
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

      {/* Orders Table */}
      <div className="bg-white rounded-b-2xl border border-[#E5E5E5] shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[#666666] text-xs uppercase tracking-wider border-y border-[#E5E5E5]">
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Delivery Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition group">
                  <td className="px-6 py-4">
                    <span className="font-bold text-black">#{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-black">{order.customer}</p>
                    <p className="text-xs text-[#666666] mt-0.5">{order.itemsCount} items</p>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 font-medium text-black">${order.total.toFixed(2)}</td>
                  
                  {/* Payment Status */}
                  <td className="px-6 py-4">
                    {order.paymentStatus === 'Paid' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Paid
                      </span>
                    )}
                    {order.paymentStatus === 'Pending' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                    {order.paymentStatus === 'Failed' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Failed
                      </span>
                    )}
                  </td>

                  {/* Delivery Status & Action */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 items-start">
                      {order.deliveryStatus === 'Pending' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                          <AlertCircle className="w-3.5 h-3.5" /> รอจัดการ (Pending)
                        </span>
                      )}
                      {order.deliveryStatus === 'Processing' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          <Package className="w-3.5 h-3.5" /> กำลังแพ็คของ (Processing)
                        </span>
                      )}
                      {order.deliveryStatus === 'Shipped' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                          <Truck className="w-3.5 h-3.5" /> จัดส่งแล้ว (Shipped)
                        </span>
                      )}
                      {order.deliveryStatus === 'Cancelled' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                          <AlertCircle className="w-3.5 h-3.5" /> ยกเลิก (Cancelled)
                        </span>
                      )}

                      {/* Display Tracking Number if shipped */}
                      {order.trackingNumber && (
                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded mt-1">
                          {order.trackingNumber}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* UI Mockup for Status Update Select */}
                      <select 
                        className="text-xs border border-gray-300 rounded-md py-1.5 px-2 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                        defaultValue={order.deliveryStatus}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">กำลังแพ็คของ</option>
                        <option value="Shipped">อัปเดตเลขพัสดุ...</option>
                        <option value="Cancelled">ยกเลิกออเดอร์</option>
                      </select>
                      
                      <button className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-[#666666]">
                    No orders found.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-[#666666]">Showing <span className="font-medium text-black">1</span> to <span className="font-medium text-black">5</span> of <span className="font-medium text-black">128</span> results</p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:text-black hover:border-gray-300 disabled:opacity-50" disabled>
              &lt;
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-black text-white font-medium text-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-transparent text-[#666666] hover:bg-gray-100 font-medium text-sm transition">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-transparent text-[#666666] hover:bg-gray-100 font-medium text-sm transition">3</button>
            <span className="px-2 text-gray-400">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 transition">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
