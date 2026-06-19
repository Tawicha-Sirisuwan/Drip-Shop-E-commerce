"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createReviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export async function createReviewAction(input: unknown) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "กรุณาเข้าสู่ระบบก่อนทำการรีวิว" };
    }

    const validated = createReviewSchema.safeParse(input);
    if (!validated.success) {
      return { error: "ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง" };
    }

    const { productId, rating, comment } = validated.data;
    const userId = session.user.id;

    // ตรวจสอบว่าเคยรีวิวสินค้านี้ไปแล้วหรือยัง
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingReview) {
      return { error: "คุณเคยรีวิวสินค้านี้ไปแล้ว" };
    }

    // ตรวจสอบว่าเคยสั่งซื้อสินค้านี้และสถานะเป็น DELIVERED หรือไม่ (Optional but good practice)
    // สำหรับ MVP นี้เราตรวจสอบเบื้องต้น หรืออนุญาตให้รีวิวได้เลยถ้าต้องการ
    // ลองเปิดให้ทุกคนที่ล็อกอินรีวิวได้ก่อน (หรือสามารถเปิด comment โค้ดส่วนนี้เพื่อบังคับซื้อก่อน)
    
    const hasOrdered = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: "DELIVERED",
        },
      },
    });

    if (!hasOrdered) {
       return { error: "คุณต้องสั่งซื้อและได้รับสินค้านี้แล้วเท่านั้น จึงจะสามารถรีวิวได้" };
    }

    // บันทึก Review ลงฐานข้อมูล
    const newReview = await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        comment: comment?.trim() || null,
      },
    });

    // ค้นหาสินค้าเพื่อดึง slug สำหรับเคลียร์แคช
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { slug: true },
    });

    if (product) {
      revalidatePath(`/product/${product.slug}`);
      revalidatePath(`/products`);
    }

    return { success: "ขอบคุณสำหรับรีวิวของคุณ!", review: newReview };
  } catch (error) {
    console.error("Create Review Error:", error);
    return { error: "เกิดข้อผิดพลาดในการบันทึกรีวิว โปรดลองอีกครั้ง" };
  }
}
