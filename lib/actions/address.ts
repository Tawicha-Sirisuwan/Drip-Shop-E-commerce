"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { addressSchema, AddressInput } from "@/lib/zod-schemas";
import { revalidatePath } from "next/cache";

/**
 * ฟังก์ชันช่วยตรวจสอบสิทธิ์และดึงข้อมูล User จาก Session ปัจจุบัน
 * เพื่อความปลอดภัยในการทำธุรกรรมต่างๆ บนฐานข้อมูล
 */
async function getAuthenticatedUser() {
  const session = await auth();
  if (!session?.user?.email) {
    return null;
  }
  return await prisma.user.findUnique({
    where: { email: session.user.email },
  });
}

/**
 * Action สำหรับสร้างที่อยู่จัดส่งใหม่
 * @param data ข้อมูลที่อยู่จัดส่งที่ผ่านการป้อนจากฟอร์ม
 */
export async function createAddressAction(data: AddressInput) {
  try {
    // 1. ตรวจสอบสิทธิ์การเข้าสู่ระบบ
    const user = await getAuthenticatedUser();
    if (!user) {
      return { error: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" };
    }

    // 2. ตรวจสอบความถูกต้องของข้อมูลผ่าน Zod Schema
    const validatedFields = addressSchema.safeParse(data);
    if (!validatedFields.success) {
      return { error: "ข้อมูลที่อยู่จัดส่งไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง" };
    }

    const { name, phone, street, subdistrict, district, province, postalCode } = validatedFields.data;
    let isDefault = validatedFields.data.isDefault;

    // 3. ตรวจสอบจำนวนที่อยู่เดิมที่มีอยู่
    const addressCount = await prisma.address.count({
      where: { userId: user.id },
    });

    // หากเป็นที่อยู่แรกของผู้ใช้ ระบบจะบังคับให้เป็นที่อยู่หลักเสมอ
    if (addressCount === 0) {
      isDefault = true;
    }

    // 4. หากที่อยู่ใหม่นี้ถูกกำหนดให้เป็นที่อยู่หลัก (isDefault: true)
    // ให้ทำการอัปเดตที่อยู่อื่นๆ ทั้งหมดของผู้ใช้คนนี้ให้มีค่า isDefault: false ก่อน
    if (isDefault && addressCount > 0) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    // 5. บันทึกที่อยู่ใหม่ลงฐานข้อมูล
    const newAddress = await prisma.address.create({
      data: {
        userId: user.id,
        name,
        phone,
        street,
        subdistrict,
        district,
        province,
        postalCode,
        isDefault,
      },
    });

    // 6. เคลียร์แคชหน้าจัดการที่อยู่เพื่อให้แสดงผลลัพธ์ล่าสุดทันที
    revalidatePath("/account/addresses");

    return { success: "เพิ่มที่อยู่จัดส่งเรียบร้อยแล้ว", address: newAddress };
  } catch (error) {
    console.error("Create Address Error:", error);
    return { error: "เกิดข้อผิดพลาดในการสร้างที่อยู่จัดส่ง โปรดลองอีกครั้ง" };
  }
}

/**
 * Action สำหรับแก้ไขข้อมูลที่อยู่จัดส่งเดิม
 * @param id รหัส Address ID ที่ต้องการแก้ไข
 * @param data ข้อมูลใหม่ที่ต้องการบันทึกทับ
 */
export async function updateAddressAction(id: string, data: AddressInput) {
  try {
    // 1. ตรวจสอบสิทธิ์การเข้าสู่ระบบ
    const user = await getAuthenticatedUser();
    if (!user) {
      return { error: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" };
    }

    // 2. ตรวจสอบข้อมูลความถูกต้องผ่าน Zod Schema
    const validatedFields = addressSchema.safeParse(data);
    if (!validatedFields.success) {
      return { error: "ข้อมูลที่อยู่จัดส่งไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง" };
    }

    // 3. ตรวจสอบความเป็นเจ้าของที่อยู่ (Ownership validation) ป้องกันภัยคุกคามประเภท IDOR
    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });
    if (!existingAddress || existingAddress.userId !== user.id) {
      return { error: "ไม่พบที่อยู่จัดส่ง หรือคุณไม่มีสิทธิ์ในการจัดการที่อยู่นี้" };
    }

    const { name, phone, street, subdistrict, district, province, postalCode } = validatedFields.data;
    let isDefault = validatedFields.data.isDefault;

    // 4. จัดการตรรกะสถานะที่อยู่เริ่มต้น (Default Address Logic)
    if (isDefault) {
      // หากมีการตั้งค่าที่อยู่นี้ให้เป็นที่อยู่หลัก
      // ให้ยกเลิกที่อยู่หลักรายการอื่นๆ ทั้งหมดของผู้ใช้คนนี้
      await prisma.address.updateMany({
        where: {
          userId: user.id,
          id: { not: id },
        },
        data: { isDefault: false },
      });
    } else if (existingAddress.isDefault) {
      // หากเดิมรายการนี้เป็นที่อยู่หลัก แต่ถูกส่งค่ามาให้ปิด (isDefault: false)
      // ระบบจำเป็นต้องมองหารายการอื่นขึ้นมาแทนที่เป็นที่อยู่หลัก (ถ้ามีรายการอื่นอยู่)
      const otherAddress = await prisma.address.findFirst({
        where: {
          userId: user.id,
          id: { not: id },
        },
      });

      if (otherAddress) {
        await prisma.address.update({
          where: { id: otherAddress.id },
          data: { isDefault: true },
        });
      } else {
        // หากผู้ใช้มีที่อยู่นี้เพียงรายการเดียว จะบังคับให้ต้องรักษาความเป็นที่อยู่หลักเอาไว้
        isDefault = true;
      }
    }

    // 5. ดำเนินการอัปเดตข้อมูลลงฐานข้อมูล
    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        name,
        phone,
        street,
        subdistrict,
        district,
        province,
        postalCode,
        isDefault,
      },
    });

    // 6. เคลียร์แคชเพื่อให้ UI อัปเดตข้อมูล
    revalidatePath("/account/addresses");

    return { success: "แก้ไขข้อมูลที่อยู่จัดส่งสำเร็จ", address: updatedAddress };
  } catch (error) {
    console.error("Update Address Error:", error);
    return { error: "เกิดข้อผิดพลาดในการแก้ไขที่อยู่จัดส่ง โปรดลองอีกครั้ง" };
  }
}

/**
 * Action สำหรับการลบที่อยู่จัดส่งออก
 * @param id รหัส Address ID ที่ต้องการลบ
 */
export async function deleteAddressAction(id: string) {
  try {
    // 1. ตรวจสอบสิทธิ์การเข้าสู่ระบบ
    const user = await getAuthenticatedUser();
    if (!user) {
      return { error: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" };
    }

    // 2. ตรวจสอบความถูกต้องและความเป็นเจ้าของที่อยู่ก่อนดำเนินการลบจริง
    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });
    if (!existingAddress || existingAddress.userId !== user.id) {
      return { error: "ไม่พบที่อยู่จัดส่ง หรือคุณไม่มีสิทธิ์ลบที่อยู่นี้" };
    }

    const wasDefault = existingAddress.isDefault;

    // 3. ทำการลบที่อยู่ออกจากฐานข้อมูล
    await prisma.address.delete({
      where: { id },
    });

    // 4. หากที่อยู่หลักถูกลบออก และยังมีที่อยู่อื่นๆ หลงเหลืออยู่
    // ให้ทำการตั้งค่าที่อยู่รายการอื่นที่พบเป็นรายการแรกให้เป็นที่อยู่หลักแทนโดยอัตโนมัติ
    if (wasDefault) {
      const remainingAddress = await prisma.address.findFirst({
        where: { userId: user.id },
      });

      if (remainingAddress) {
        await prisma.address.update({
          where: { id: remainingAddress.id },
          data: { isDefault: true },
        });
      }
    }

    // 5. เคลียร์แคชของเส้นทาง
    revalidatePath("/account/addresses");

    return { success: "ลบที่อยู่จัดส่งเรียบร้อยแล้ว" };
  } catch (error) {
    console.error("Delete Address Error:", error);
    return { error: "เกิดข้อผิดพลาดในการลบที่อยู่จัดส่ง โปรดลองอีกครั้ง" };
  }
}

/**
 * Action สำหรับตั้งค่าให้ที่อยู่ที่เลือกเป็นที่อยู่หลักทันที
 * @param id รหัส Address ID ที่ต้องการเปลี่ยนเป็นที่อยู่หลัก
 */
export async function setDefaultAddressAction(id: string) {
  try {
    // 1. ตรวจสอบสิทธิ์การเข้าสู่ระบบ
    const user = await getAuthenticatedUser();
    if (!user) {
      return { error: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" };
    }

    // 2. ยืนยันความเป็นเจ้าของของที่อยู่นี้
    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });
    if (!existingAddress || existingAddress.userId !== user.id) {
      return { error: "ไม่พบที่อยู่จัดส่ง หรือคุณไม่มีสิทธิ์แก้ไขที่อยู่นี้" };
    }

    // 3. ปิดสถานะที่อยู่เริ่มต้นของรายการอื่นๆ ทั้งหมด
    await prisma.address.updateMany({
      where: {
        userId: user.id,
        id: { not: id },
      },
      data: { isDefault: false },
    });

    // 4. ตั้งค่ารายการนี้ให้เป็นที่อยู่หลัก
    await prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });

    // 5. รีเฟรชแคชหน้าจอ
    revalidatePath("/account/addresses");

    return { success: "ตั้งค่าเป็นที่อยู่หลักเรียบร้อยแล้ว" };
  } catch (error) {
    console.error("Set Default Address Error:", error);
    return { error: "เกิดข้อผิดพลาดในการตั้งค่าที่อยู่หลัก โปรดลองอีกครั้ง" };
  }
}
