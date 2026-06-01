"use server";

import prisma from "@/lib/prisma";
import { RegisterInput, registerSchema } from "@/lib/zod-schemas";
import bcrypt from "bcryptjs";

export async function registerAction(data: RegisterInput) {
  try {
    const validatedData = registerSchema.safeParse(data);

    if (!validatedData.success) {
      return { error: "ข้อมูลไม่ถูกต้อง" };
    }

    const { name, email, password } = validatedData.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "อีเมลนี้ถูกใช้งานแล้ว" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // The role will default to USER as per schema
      },
    });

    return { success: "สมัครสมาชิกสำเร็จ สามารถเข้าสู่ระบบได้เลย" };
  } catch (error) {
    console.error("Register Error:", error);
    return { error: "เกิดข้อผิดพลาดบางอย่าง โปรดลองอีกครั้ง" };
  }
}
