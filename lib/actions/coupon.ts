"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { DiscountType } from "@prisma/client";

const CreateCouponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  type: z.nativeEnum(DiscountType),
  value: z.number().positive(),
  minOrderAmount: z.number().nullable().optional(),
  maxUses: z.number().int().positive().nullable().optional(),
  expiryDate: z.date().nullable().optional(),
});

import { revalidatePath } from "next/cache";

// สร้างคูปองใหม่ (สำหรับ Admin เท่านั้น)
export async function createCouponAction(input: unknown) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const validated = CreateCouponSchema.safeParse(input);
  if (!validated.success) {
    throw new Error("Invalid input");
  }

  const { code, type, value, minOrderAmount, maxUses, expiryDate } = validated.data;

  // เช็คว่าโค้ดซ้ำในฐานข้อมูลเราไหม
  const existing = await prisma.coupon.findUnique({ where: { code } });
  if (existing) {
    throw new Error("Coupon code already exists");
  }

  try {
    // 1. สร้าง Coupon ใน Stripe
    const stripeCoupon = await stripe.coupons.create({
      id: code, // Set ID to code for easy reference
      name: code,
      percent_off: type === "PERCENTAGE" ? value : undefined,
      amount_off: type === "FIXED" ? value * 100 : undefined, // THB เป็นหน่วยสลึง (สตางค์) เช่น 100 = 1 THB
      currency: type === "FIXED" ? "thb" : undefined,
      duration: "once", // ใช้ลดครั้งเดียวต่อการชำระเงิน
    });

    // 2. สร้าง Promotion Code ใน Stripe ผูกกับ Coupon ที่เพิ่งสร้าง
    const promotionCode = await stripe.promotionCodes.create({
      promotion: {
        type: 'coupon',
        coupon: stripeCoupon.id
      },
      code: code,
      max_redemptions: maxUses || undefined,
      expires_at: expiryDate ? Math.floor(expiryDate.getTime() / 1000) : undefined,
      restrictions: {
        minimum_amount: minOrderAmount ? minOrderAmount * 100 : undefined,
        minimum_amount_currency: minOrderAmount ? "thb" : undefined,
      }
    });

    // 3. บันทึกลงฐานข้อมูลของเรา
    const newCoupon = await prisma.coupon.create({
      data: {
        code,
        type,
        value,
        minOrderAmount,
        maxUses,
        expiryDate,
      },
      select: { id: true, code: true, type: true, value: true }
    });

    revalidatePath('/admin/coupons');

    return {
      ...newCoupon,
      value: Number(newCoupon.value)
    };
  } catch (error: any) {
    console.error("Create coupon error:", error);
    throw new Error(error.message || "Failed to create coupon in Stripe/DB");
  }
}

// ลบคูปอง (หรือปิดใช้งาน)
export async function deleteCouponAction(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  // เราอาจจะทำแค่ Soft delete หรือตั้ง isActive = false เพื่อให้ประวัติออเดอร์ไม่พัง
  await prisma.coupon.update({
    where: { id },
    data: { isActive: false },
  });
  
  revalidatePath('/admin/coupons');
  
  return { success: true };
}

// ตรวจสอบคูปองสำหรับหน้าตะกร้าสินค้า
export async function validateCouponAction(code: string, cartTotal: number) {
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
  
  if (!coupon || !coupon.isActive) {
    return { success: false, error: "Invalid or expired coupon" };
  }

  if (coupon.expiryDate && new Date() > coupon.expiryDate) {
    return { success: false, error: "Coupon has expired" };
  }

  if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
    return { success: false, error: "Coupon usage limit reached" };
  }

  if (coupon.minOrderAmount && cartTotal < Number(coupon.minOrderAmount)) {
    return { success: false, error: `Minimum order amount is ฿${coupon.minOrderAmount}` };
  }

  // คำนวณส่วนลดเบื้องต้นให้ UI ดู (Stripe จะจัดการของจริงตอนจ่ายเงิน)
  let discountAmount = 0;
  if (coupon.type === "PERCENTAGE") {
    discountAmount = cartTotal * (Number(coupon.value) / 100);
  } else {
    discountAmount = Number(coupon.value);
  }

  if (discountAmount > cartTotal) discountAmount = cartTotal; // ห้ามลดเกินราคาสินค้า

  return {
    success: true,
    discountAmount,
    coupon: { id: coupon.id, code: coupon.code }
  };
}
