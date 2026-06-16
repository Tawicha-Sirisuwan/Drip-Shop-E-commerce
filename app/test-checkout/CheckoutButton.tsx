"use client";

import { useState } from "react";
import { createCheckoutSession } from "@/lib/actions/checkout";

export default function CheckoutButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const res = await createCheckoutSession({
        items: [{ productId, quantity: 1 }],
      });
      if (res?.url) {
        window.location.href = res.url; // เปลี่ยนหน้าไปยัง Stripe
      }
    } catch (error: any) {
      alert("Error: " + error.message);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 disabled:bg-gray-400 transition-colors shadow-md w-full sm:w-auto"
    >
      {loading ? "กำลังส่งไปยัง Stripe..." : "ทดสอบชำระเงิน (ซื้อ 1 ชิ้น)"}
    </button>
  );
}
