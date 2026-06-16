"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";

// กำหนด Schema สำหรับตรวจสอบข้อมูล (Validate) ก่อนนำไปใช้งาน
const CheckoutItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional().nullable(),
  quantity: z.number().min(1),
});

const CheckoutSchema = z.object({
  items: z.array(CheckoutItemSchema).min(1),
  shippingAddress: z.string().optional(),
});

// Server Action สำหรับการสร้าง Stripe Checkout Session
// อ้างอิงตาม Golden Patterns ที่กำหนดใน AGENTS.md (ตรวจสอบ RBAC, Validate ด้วย Zod, เลือกฟิลด์เฉพาะที่ต้องการ)
export async function createCheckoutSession(input: unknown): Promise<{ url: string }> {
  try {
    // 1. ตรวจสอบว่าผู้ใช้ Login หรือไม่
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // 2. Validate input จากฝั่ง Client
    const validated = CheckoutSchema.safeParse(input);
    if (!validated.success) throw new Error("Invalid input");

    const { items, shippingAddress } = validated.data;

    // 3. ดึงข้อมูลสินค้าจาก Database เพื่อให้ได้ราคาและข้อมูลที่ถูกต้องเสมอ (ป้องกันการแก้ไขราคาจาก Client)
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, price: true, images: true }
    });

    if (products.length !== productIds.length) {
      throw new Error("Some products were not found");
    }

    // เตรียมข้อมูลสินค้าที่จะส่งไปให้ Stripe (line_items)
    // ใช้ any ชั่วคราวเพื่อรองรับโครงสร้างของ Stripe SDK หรือใช้ import Stripe จาก stripe
    const line_items: any[] = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;

      const price = Number(product.price);
      totalAmount += price * item.quantity;

      // ตรวจสอบ URL รูปภาพ: ต้องขึ้นต้นด้วย http และมีความยาวไม่เกิน 2000 ตัวอักษร
      // ป้องกันกรณีรูปภาพถูกเก็บเป็น Base64 (data:image/png;base64,...) ซึ่งยาวเกิน 2048 ตัวอักษรและ Stripe ไม่รับ
      let validImages: string[] = [];
      if (product.images.length > 0) {
        const imgUrl = product.images[0];
        if (imgUrl.startsWith("http") && imgUrl.length <= 2000) {
          validImages = [imgUrl];
        }
      }

      line_items.push({
        price_data: {
          currency: "thb",
          product_data: {
            name: product.name,
            images: validImages,
          },
          // Stripe ต้องการราคาเป็นหน่วยที่เล็กที่สุด (THB เป็นหน่วยสตางค์ จึงต้องคูณ 100)
          unit_amount: Math.round(price * 100), 
        },
        quantity: item.quantity,
      });
    }

    // 4. สร้าง Order ใน Database (สถานะเริ่มต้นเป็น PENDING)
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: totalAmount,
        status: "PENDING",
        shippingAddress: shippingAddress,
        orderItems: {
          create: items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            return {
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              price: product ? Number(product.price) : 0,
            };
          }),
        },
      },
      select: { id: true }
    });

    // 5. สร้าง Stripe Checkout Session
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // ใช้แค่บัตรเครดิตก่อน ป้องกัน Error จาก PromptPay ที่ยังไม่ได้เปิดใช้งานใน Dashboard
      mode: "payment",
      line_items,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      client_reference_id: order.id, // ส่ง Order ID ไปเป็น Reference เพื่อใช้ใน Webhook
    });

    if (!stripeSession.url) {
      throw new Error("Failed to create Stripe session URL");
    }

    // 6. อัปเดต Order ด้วย stripeSessionId ของ Stripe
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: stripeSession.id }
    });

    // 7. ส่งคืน URL เพื่อให้ Client ทำการ Redirect ไปจ่ายเงิน
    return { url: stripeSession.url };

  } catch (error: any) {
    console.error("Checkout Session Error:", error);
    
    // ดักจับ Error ที่เรารู้จักและต้องการให้ Client ทราบ
    if (error.message === "Unauthorized") {
      throw new Error("กรุณาเข้าสู่ระบบก่อนทำการชำระเงินครับ");
    }
    if (error.message === "Some products were not found") {
      throw new Error("สินค้าบางรายการไม่มีในระบบ (อาจถูกลบไปแล้ว) กรุณาลบออกจากตะกร้าครับ");
    }
    if (error.message === "Invalid input") {
      throw new Error("ข้อมูลสินค้าไม่ถูกต้อง");
    }

    // ช่วง Debug: คืนค่า Error Message จริงกลับไปให้ผู้ใช้เห็น จะได้รู้ว่าพังที่จุดไหน
    throw new Error(`เกิดข้อผิดพลาด: ${error.message}`);
  }
}
