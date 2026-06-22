import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, Package, User, MapPin, CreditCard } from 'lucide-react';
import OrderStatusSelect from '../OrderStatusSelect';
import dayjs from 'dayjs';
import 'dayjs/locale/th';

dayjs.locale('th');

// Interface สำหรับข้อมูลที่อยู่จัดส่งที่ถูกบันทึกเป็น JSON ใน Database
interface ShippingAddress {
  name?: string;
  phone?: string;
  street?: string;
  subdistrict?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  text?: string;
}

export default async function AdminOrderDetailPage(props: { readonly params: Promise<{ id: string }> }) {
  // 1. ตรวจสอบสิทธิ์ (RBAC) ว่าเป็นแอดมินหรือไม่ ถ้าไม่ใช่ให้ redirect กลับไปหน้าแรก
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") {
    redirect("/");
  }

  const params = await props.params;
  const { id } = params;

  // 2. ดึงข้อมูลคำสั่งซื้อจาก Database พร้อมกับข้อมูล User และ OrderItems
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        include: {
          addresses: true
        }
      },
      orderItems: {
        include: { product: true }
      }
    }
  });

  // ถ้าไม่พบคำสั่งซื้อ (เช่น ใส่ ID มั่ว) ให้แสดงข้อความ error
  if (!order) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">ไม่พบคำสั่งซื้อ</h2>
        <Link href="/admin/orders" className="text-blue-600 hover:underline">
          กลับไปหน้าคำสั่งซื้อ
        </Link>
      </div>
    );
  }

  // 3. จัดการข้อมูลที่อยู่สำหรับจัดส่ง
  let addressObj: ShippingAddress | null = null;

  // ให้ความสำคัญกับข้อมูลในตาราง Address ก่อนเสมอ (เพราะปัจจุบันระบบตะกร้าไม่ได้ให้ลูกค้าเลือกที่อยู่ตอนจ่ายเงิน)
  if (order.user?.addresses && order.user.addresses.length > 0) {
    // เลือกที่อยู่ที่เป็น Default ก่อน ถ้าไม่มีให้เอาอันแรก
    const fallbackAddress = order.user.addresses.find(a => a.isDefault) || order.user.addresses[0];
    addressObj = {
      name: fallbackAddress.name,
      phone: fallbackAddress.phone,
      street: fallbackAddress.street,
      subdistrict: fallbackAddress.subdistrict,
      district: fallbackAddress.district,
      province: fallbackAddress.province,
      postalCode: fallbackAddress.postalCode,
    };
  } 
  // หากในตาราง Address ไม่มีข้อมูลเลย ค่อยไปดึงข้อมูลเก่าจากฟิลด์ shippingAddress ที่อาจมีตกค้างอยู่
  else if (order.shippingAddress) {
    try {
      addressObj = JSON.parse(order.shippingAddress) as ShippingAddress;
    } catch (e) {
      addressObj = { text: order.shippingAddress };
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* ส่วนหัวของหน้า (Header) */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="font-display text-2xl uppercase text-black font-bold">Order Details</h1>
            <p className="text-sm text-gray-500 font-mono">#{order.id}</p>
          </div>
        </div>
        
        {/* ให้แอดมินเปลี่ยนสถานะสินค้าได้โดยตรงจากหน้านี้ */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-sm font-medium text-gray-600 ml-2">สถานะ:</span>
          <OrderStatusSelect orderId={order.id} initialStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* คอลัมน์ซ้าย: รายการสินค้า (Order Items) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#E5E5E5] flex items-center gap-2">
              <Package className="w-5 h-5 text-black" />
              <h2 className="font-bold text-lg text-black">รายการสินค้า ({order.orderItems.length})</h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {order.orderItems.map((item) => (
                <div key={item.id} className="p-5 flex items-center gap-4">
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
                    <p className="text-xs text-gray-500 mt-1">
                      ราคา: ฿{Number(item.price).toLocaleString()} x {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-bold text-black whitespace-nowrap">
                    ฿{(Number(item.price) * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-5 bg-gray-50 border-t border-[#E5E5E5] flex justify-between items-center">
              <span className="font-medium text-gray-600">ยอดรวมทั้งสิ้น (Total)</span>
              <span className="font-display text-xl text-black font-bold">฿{Number(order.total).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* คอลัมน์ขวา: ข้อมูลลูกค้าและที่อยู่จัดส่ง */}
        <div className="space-y-6">
          
          {/* ข้อมูลลูกค้า (Customer Info) */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-black" />
              <h2 className="font-bold text-lg text-black">ข้อมูลลูกค้า</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 mb-0.5">ชื่อ</p>
                <p className="font-medium text-black">{order.user?.name || '-'}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-0.5">อีเมล</p>
                <p className="font-medium text-black">{order.user?.email || '-'}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-0.5">วันที่สั่งซื้อ</p>
                <p className="font-medium text-black">
                  {dayjs(order.createdAt).format('DD MMM YYYY HH:mm')}
                </p>
              </div>
            </div>
          </div>

          {/* ข้อมูลการจัดส่ง (Shipping Info) */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-black" />
              <h2 className="font-bold text-lg text-black">ที่อยู่สำหรับจัดส่ง</h2>
            </div>
            
            {addressObj ? (
              <div className="space-y-2 text-sm text-black">
                {addressObj.text ? (
                  <p>{addressObj.text}</p>
                ) : (
                  <>
                    <p className="font-bold">{addressObj.name}</p>
                    <p>{addressObj.phone}</p>
                    <p className="text-gray-600 mt-2">
                      {addressObj.street} {addressObj.subdistrict} <br />
                      {addressObj.district} {addressObj.province} {addressObj.postalCode}
                    </p>
                  </>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">ไม่มีข้อมูลที่อยู่จัดส่ง</p>
            )}
          </div>

          {/* ข้อมูลการชำระเงิน (Payment Info) */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-black" />
              <h2 className="font-bold text-lg text-black">การชำระเงิน</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 mb-0.5">Stripe Session ID</p>
                <p className="font-mono text-xs text-black break-all bg-gray-50 p-2 rounded border border-gray-100">
                  {order.stripeSessionId || '-'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
