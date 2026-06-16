import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";
import ClearCart from "./ClearCart";

export default async function CheckoutSuccessPage(props: {
 readonly searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {    
  const searchParams = await props.searchParams;
  const sessionId = typeof searchParams.session_id === "string" ? searchParams.session_id : undefined;

  if (!sessionId) {
    redirect("/"); // ไม่มี session ID ให้กลับไปหน้าแรก
  }

  let isSuccess = false;
  let orderId = "";

  try {
    // 1. ตรวจสอบสถานะกับ Stripe โดยตรง (เพื่อความปลอดภัย ทดแทนการใช้ Webhook)
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    orderId = session.client_reference_id || "";

    if (session.payment_status === "paid" && orderId) {
      isSuccess = true;

      // 2. ค้นหาออเดอร์ในฐานข้อมูล
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { orderItems: true },
      });

      // 3. ทำการตัดสต็อกเฉพาะตอนที่สถานะยังเป็น PENDING
      // ป้องกันปัญหาลูกค้ารีเฟรชหน้า Success แล้วสต็อกโดนตัดซ้ำ
      if (order?.status === "PENDING") {
        await prisma.$transaction(async (tx) => {
          // อัปเดตสถานะเป็น PAID
          await tx.order.update({
            where: { id: order.id },
            data: { status: "PAID" },
          });

          // วนลูปตัดสต็อกสินค้า
          for (const item of order.orderItems) {
            if (item.variantId) {
              await tx.productVariant.update({
                where: { id: item.variantId },
                data: { stock: { decrement: item.quantity } },
              });
            } else {
              await tx.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } },
              });
            }
          }
        });
        console.log(`[Success Page] Order ${order.id} paid and stock deducted.`);
      }
    }
  } catch (error) {
    console.error("Error retrieving Stripe session:", error);
  }

  // แสดงผลหน้า UI
  return (
    <div className="bg-white min-h-screen w-full flex flex-col items-center justify-center p-4">
      {isSuccess ? (
        <div className="text-center space-y-6 max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border">
          <ClearCart />
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          <h1 className="text-3xl font-bold text-gray-900">ชำระเงินสำเร็จ!</h1>
          <p className="text-gray-600">
            ขอบคุณที่สั่งซื้อสินค้า หมายเลขคำสั่งซื้อของคุณคือ <br />
            <span className="font-mono text-sm font-semibold bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
              {orderId}
            </span>
          </p>
          <div className="pt-4 flex flex-col gap-3">
            <Link
              href="/account"
              className="w-full block bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
            >
              ดูประวัติการสั่งซื้อ
            </Link>
            <Link
              href="/"
              className="w-full block bg-gray-100 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              กลับหน้าแรก
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6 max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border">
          <XCircle className="w-20 h-20 text-red-500 mx-auto" />
          <h1 className="text-3xl font-bold text-gray-900">ชำระเงินไม่สำเร็จ</h1>
          <p className="text-gray-600">
            เกิดข้อผิดพลาดบางอย่าง หรือคุณยกเลิกการชำระเงิน
          </p>
          <div className="pt-4">
            <Link
              href="/cart"
              className="w-full block bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
            >
              กลับไปหน้าตะกร้าสินค้า
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
