import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

// API Route ใช้เฉพาะการรับ Webhook เท่านั้น ตามกฎ Golden Patterns
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // 1. อ่านข้อมูล raw body และ signature จาก request header
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.warn("STRIPE_WEBHOOK_SECRET is not set. Webhook verification will fail.");
      return NextResponse.json({ error: "Webhook secret missing" }, { status: 400 });
    }

    let event: Stripe.Event;

    // 2. ตรวจสอบ Signature ป้องกันการยิง API ปลอม
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 3. ตรวจสอบประเภทของ Event
    // Event ที่เราสนใจคือการชำระเงินสำเร็จ (checkout.session.completed)
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // client_reference_id คือ order.id ที่เราส่งไปตอนสร้าง Session
      const orderId = session.client_reference_id;

      if (orderId) {
        // Parse shipping address
        let shippingAddressStr = null;
        if (session.customer_details?.address) {
          const addr = session.customer_details.address;
          const addressObj = {
            name: session.customer_details.name || "",
            phone: session.customer_details.phone || "",
            street: addr.line1 || "",
            subdistrict: addr.line2 || "",
            district: addr.city || "",
            province: addr.state || "",
            postalCode: addr.postal_code || "",
          };
          shippingAddressStr = JSON.stringify(addressObj);
        }

        // อัปเดตสถานะออเดอร์เป็น PAID ทันทีที่จ่ายเงินสำเร็จ พร้อมบันทึกที่อยู่จัดส่ง
        await prisma.order.update({
          where: { id: orderId },
          data: { 
            status: "PAID",
            ...(shippingAddressStr ? { shippingAddress: shippingAddressStr } : {})
          },
        });

        // ดึงรายการสินค้าทั้งหมดในออเดอร์นี้
        const orderItems = await prisma.orderItem.findMany({
          where: { orderId: orderId },
          select: { productId: true, variantId: true, quantity: true },
        });

        // 4. ตัดสต็อกสินค้า (Inventory Deduction)
        // ใช้ Prisma Transaction เพื่อให้มั่นใจว่าข้อมูลทั้งหมดถูกอัปเดตพร้อมกันอย่างปลอดภัย
        await prisma.$transaction(async (tx) => {
          for (const item of orderItems) {
            if (item.variantId) {
              // กรณีมีตัวเลือก (เช่น สี, ไซส์) ให้ตัดสต็อกที่ ProductVariant
              await tx.productVariant.update({
                where: { id: item.variantId },
                data: { stock: { decrement: item.quantity } },
              });
            } else {
              // กรณีไม่มีตัวเลือก ให้ตัดสต็อกสินค้าหลัก
              await tx.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } },
              });
            }
          }
        });

        console.log(`[Webhook Success] Order: ${orderId} - Paid and stock deducted.`);
      }
    }

    // 5. ส่ง Response กลับไปหา Stripe ว่าได้รับข้อมูลเรียบร้อย
    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    // ไม่เปิดเผย Error ที่แท้จริงให้ฝั่ง Client เห็นเพื่อความปลอดภัย
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
