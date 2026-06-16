"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/lib/actions/orders";
import { OrderStatus } from "@prisma/client";

export default function  OrderStatusSelect ({ 
  orderId, 
  initialStatus 
}: { 
  readonly orderId : string; 
  readonly initialStatus: OrderStatus 
}) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    setStatus(newStatus);
    setLoading(true);
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error: any) {
      alert("ไม่สามารถอัปเดตสถานะได้: " + error.message);
      setStatus(initialStatus); // ย้อนกลับค่าเดิมถ้าอัปเดตไม่สำเร็จ
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className={`text-xs border rounded-md py-1.5 px-2 bg-white focus:outline-none focus:ring-1 focus:ring-black cursor-pointer transition ${
        loading ? "opacity-50" : "opacity-100"
      } border-gray-300 text-gray-700`}
    >
      <option value="PENDING">รอชำระเงิน</option>
      <option value="PAID">ชำระแล้ว (รอแพ็ค)</option>
      <option value="SHIPPED">จัดส่งแล้ว</option>
      <option value="DELIVERED">ส่งมอบสำเร็จ</option>
      <option value="CANCELLED">ยกเลิกออเดอร์</option>
    </select>
  );
}
