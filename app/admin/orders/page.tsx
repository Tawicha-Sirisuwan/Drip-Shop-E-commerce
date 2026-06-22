import React from 'react';
import Link from 'next/link';
import { Filter, Download, Eye, Truck, Package, PackageCheck, AlertCircle } from 'lucide-react';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { OrderStatus } from '@prisma/client';
import OrderStatusSelect from './OrderStatusSelect';

export default async function OrdersPage(props: { readonly searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  // 1. Check RBAC
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    redirect("/");
  }

  const searchParams = await props.searchParams;
  const currentStatus = typeof searchParams.status === 'string' ? searchParams.status : 'all';

  // 2. Build Prisma condition based on tabs
  const whereCondition: any = {};
  if (currentStatus === 'pending') {
    whereCondition.status = 'PENDING';
  } else if (currentStatus === 'processing') {
    whereCondition.status = 'PAID';
  } else if (currentStatus === 'shipped') {
    whereCondition.status = 'SHIPPED';
  } else if (currentStatus === 'delivered') {
    whereCondition.status = 'DELIVERED';
  }

  // 3. Fetch real orders from Database
  const orders = await prisma.order.findMany({
    where: whereCondition,
    include: {
      user: { select: { name: true, email: true } },
      orderItems: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  const getStatusIconAndStyle = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return { icon: <AlertCircle className="w-3.5 h-3.5" />, text: 'รอชำระเงิน', style: 'bg-yellow-50 text-yellow-700 border border-yellow-200' };
      case 'PAID':
        return { icon: <Package className="w-3.5 h-3.5" />, text: 'ชำระแล้ว (รอแพ็ค)', style: 'bg-blue-50 text-blue-700 border border-blue-200' };
      case 'SHIPPED':
        return { icon: <Truck className="w-3.5 h-3.5" />, text: 'จัดส่งแล้ว', style: 'bg-indigo-50 text-indigo-700 border border-indigo-200' };
      case 'DELIVERED':
        return { icon: <PackageCheck className="w-3.5 h-3.5" />, text: 'ถึงผู้รับแล้ว', style: 'bg-green-50 text-green-700 border border-green-200' };
      case 'CANCELLED':
        return { icon: <AlertCircle className="w-3.5 h-3.5" />, text: 'ยกเลิก', style: 'bg-gray-100 text-gray-700 border border-gray-200' };
      default:
        return { icon: <AlertCircle className="w-3.5 h-3.5" />, text: status, style: 'bg-gray-100 text-gray-700 border border-gray-200' };
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Mobile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="sm:hidden font-display text-2xl uppercase">Orders</h1>
      </div>

      {/* Filters & Actions Bar */}
      <div className="bg-white p-4 rounded-t-2xl border border-[#E5E5E5] border-b-0 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <Link href="/admin/orders?status=all" className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${currentStatus === 'all' ? 'bg-[#F0EEED] text-black' : 'text-[#666666] hover:bg-[#F0EEED] hover:text-black'}`}>All Orders</Link>
          <Link href="/admin/orders?status=pending" className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${currentStatus === 'pending' ? 'bg-[#F0EEED] text-black' : 'text-[#666666] hover:bg-[#F0EEED] hover:text-black'}`}>
            รอชำระเงิน (Pending)
          </Link>
          <Link href="/admin/orders?status=processing" className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${currentStatus === 'processing' ? 'bg-[#F0EEED] text-black' : 'text-[#666666] hover:bg-[#F0EEED] hover:text-black'}`}>รอจัดส่ง (Paid)</Link>
          <Link href="/admin/orders?status=shipped" className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${currentStatus === 'shipped' ? 'bg-[#F0EEED] text-black' : 'text-[#666666] hover:bg-[#F0EEED] hover:text-black'}`}>ส่งแล้ว (Shipped)</Link>
          <Link href="/admin/orders?status=delivered" className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${currentStatus === 'delivered' ? 'bg-[#F0EEED] text-black' : 'text-[#666666] hover:bg-[#F0EEED] hover:text-black'}`}>สำเร็จ (Delivered)</Link>
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
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              
              {orders.map((order) => {
                const statusDetails = getStatusIconAndStyle(order.status);
                const itemsCount = order.orderItems.reduce((acc, item) => acc + item.quantity, 0);
                
                return (
                <tr key={order.id} className="hover:bg-gray-50 transition group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-black bg-gray-100 px-2 py-1 rounded">
                      {order.id.slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-black">{order.user?.name || order.user?.email || 'Unknown User'}</p>
                    <p className="text-xs text-[#666666] mt-0.5">{itemsCount} items</p>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {order.createdAt.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 font-medium text-black">
                    ฿{Number(order.total).toLocaleString()}
                  </td>
                  
                  {/* Delivery Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusDetails.style}`}>
                      {statusDetails.icon} {statusDetails.text}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <OrderStatusSelect orderId={order.id} initialStatus={order.status} />
                      
                      <Link href={`/admin/orders/${order.id}`} className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition" title="View Details">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              )})}

              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[#666666]">
                    ไม่มีรายการคำสั่งซื้อ
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
