import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import dayjs from 'dayjs'
import 'dayjs/locale/th'

dayjs.locale('th')

export default async function OrderHistoryPage() {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect('/login')
  }

  // Find user to get ID
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    redirect('/login')
  }

  // Get orders
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    }
  })

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
    <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 shadow-sm">
      <h1 className="font-display text-2xl uppercase mb-6 text-black">ประวัติคำสั่งซื้อ</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <h3 className="text-lg font-bold text-black mb-2">ยังไม่มีประวัติคำสั่งซื้อ</h3>
          <p className="text-gray-500 mb-6">คุณยังไม่เคยทำการสั่งซื้อสินค้าใดๆ ในระบบของเรา</p>
          <a href="/" className="inline-block bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
            ไปช้อปปิ้งกันเลย
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-[#E5E5E5] rounded-xl overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 p-4 border-b border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                  <div>
                    <p className="text-gray-500 font-medium">วันที่สั่งซื้อ</p>
                    <p className="text-black font-semibold">{dayjs(order.createdAt).format('DD MMM YYYY')}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">ยอดรวม</p>
                    <p className="text-black font-semibold">฿{Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">รหัสคำสั่งซื้อ</p>
                    <p className="text-black font-semibold font-mono text-xs mt-0.5">{order.id}</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 sm:p-6 divide-y divide-gray-100">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                      {item.product.images && item.product.images.length > 0 ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-black truncate">{item.product.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">จำนวน: {item.quantity} ชิ้น</p>
                    </div>
                    <div className="text-sm font-bold text-black whitespace-nowrap">
                      ฿{Number(item.price).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
