import React from 'react';
import { 
  DollarSign, ShoppingCart, Users, Percent, 
  TrendingUp, TrendingDown, MoreVertical 
} from 'lucide-react';
import prisma from '@/lib/prisma';
import dayjs from 'dayjs';
import 'dayjs/locale/th';

dayjs.locale('th');

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // 1. ดึงข้อมูลจำนวนลูกค้า (Users ที่มี role = USER)
  const totalCustomers = await prisma.user.count({
    where: { role: 'USER' }
  });

  // 2. ดึงข้อมูลคำสั่งซื้อทั้งหมด
  const totalOrders = await prisma.order.count();

  // 3. คำนวณรายได้รวม (เฉพาะ Order ที่ชำระเงินแล้ว หรือส่งแล้ว)
  const paidOrders = await prisma.order.findMany({
    where: {
      status: {
        in: ['PAID', 'SHIPPED', 'DELIVERED']
      }
    },
    select: { total: true }
  });
  
  const totalRevenue = paidOrders.reduce((sum, order) => sum + Number(order.total), 0);

  // 4. ดึงคำสั่งซื้อล่าสุด 5 รายการ
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  // 5. ดึงสินค้ายอดนิยม (เรียงตามสินค้าที่อยู่ใน orderItems มากที่สุด)
  // หมายเหตุ: Prisma groupBy บน relation ค่อนข้างซับซ้อน เลยดึงสินค้ามา 3 ชิ้นล่าสุดแทนชั่วคราว
  const topProducts = await prisma.product.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    where: { isArchived: false }
  });

  // ฟังก์ชันแปลสถานะ
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">รอดำเนินการ</span>;
      case 'PAID':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">ชำระเงินแล้ว</span>;
      case 'SHIPPED':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">กำลังจัดส่ง</span>;
      case 'DELIVERED':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">จัดส่งสำเร็จ</span>;
      case 'CANCELLED':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">ยกเลิก</span>;
      default:
        return null;
    }
  };

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
      <h1 className="sm:hidden font-display text-2xl uppercase mb-6 text-black">ภาพรวมระบบ</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        
        {/* Stat Card 1 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5E5E5] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-[#666666] font-medium mb-1">รายได้รวม</p>
              <h3 className="font-display text-2xl sm:text-3xl text-black">฿{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-gray-500">นับเฉพาะคำสั่งซื้อที่ชำระเงินแล้ว</p>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5E5E5] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-[#666666] font-medium mb-1">คำสั่งซื้อทั้งหมด</p>
              <h3 className="font-display text-2xl sm:text-3xl text-black">{totalOrders.toLocaleString()}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#F0EEED] text-black flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-gray-500">รายการคำสั่งซื้อทั้งหมดในระบบ</p>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5E5E5] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-[#666666] font-medium mb-1">ลูกค้าที่ลงทะเบียน</p>
              <h3 className="font-display text-2xl sm:text-3xl text-black">{totalCustomers.toLocaleString()}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#F0EEED] text-black flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-gray-500">ผู้ใช้งานในระบบทั้งหมด</p>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100">
            <h2 className="font-bold text-lg sm:text-xl text-black">คำสั่งซื้อล่าสุด</h2>
            <button className="text-sm text-[#666666] hover:text-black underline font-medium cursor-pointer">ดูทั้งหมด</button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full min-w-[600px] text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[#666666] text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-4 font-medium">รหัสคำสั่งซื้อ</th>
                  <th className="px-6 py-4 font-medium">ลูกค้า</th>
                  <th className="px-6 py-4 font-medium">วันที่</th>
                  <th className="px-6 py-4 font-medium">ยอดรวม</th>
                  <th className="px-6 py-4 font-medium">สถานะ</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">ยังไม่มีคำสั่งซื้อในระบบ</td>
                  </tr>
                ) : (
                  recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-black">
                        {order.id.substring(0, 8).toUpperCase()}...
                      </td>
                      <td className="px-6 py-4 text-gray-800">
                        {order.user?.name || order.user?.email || 'Unknown User'}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {dayjs(order.createdAt).format('DD MMM YYYY HH:mm')}
                      </td>
                      <td className="px-6 py-4 font-medium text-black">
                        ฿{Number(order.total).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products Area */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-5 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg sm:text-xl text-black">สินค้าใหม่ล่าสุด</h2>
            <button className="text-gray-400 hover:text-black cursor-pointer"><MoreVertical className="w-5 h-5" /></button>
          </div>
          
          <div className="space-y-5 flex-1">
            {topProducts.length === 0 ? (
              <p className="text-center text-gray-500 py-4">ยังไม่มีสินค้าในระบบ</p>
            ) : (
              topProducts.map(product => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#F0EEED] rounded-lg overflow-hidden flex-shrink-0">
                    {product.images && product.images.length > 0 ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-black truncate">{product.name}</h4>
                    <p className="text-xs text-[#666666] mt-0.5">คงเหลือ {product.stock} ชิ้น</p>
                  </div>
                  <div className="font-bold text-sm text-black">฿{Number(product.price).toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
          
          <button className="w-full mt-6 py-2.5 border border-[#E5E5E5] text-sm font-bold rounded-xl hover:bg-gray-50 transition text-black cursor-pointer">
            ดูคลังสินค้าทั้งหมด
          </button>
        </div>

      </div>
    </main>
  );
}
