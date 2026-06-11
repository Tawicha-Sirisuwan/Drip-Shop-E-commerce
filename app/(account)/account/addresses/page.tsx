import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import AddressesClient from "./AddressesClient";

export const metadata = {
  title: "ที่อยู่จัดส่ง - Drip Shop",
  description: "จัดการข้อมูลที่อยู่สำหรับการจัดส่งสินค้าของคุณ",
};

/**
 * หน้าจัดการที่อยู่จัดส่ง (Addresses Server Component)
 * ดึงข้อมูลที่อยู่จริงของผู้ใช้ที่ล็อกอินอยู่ในระบบผ่าน Prisma
 * และแสดงผลร่วมกับ AddressesClient Component
 */
export default async function AddressesPage() {
  // 1. ตรวจสอบสิทธิ์การเข้าสู่ระบบผ่าน NextAuth
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  // 2. ดึงข้อมูลผู้ใช้จากฐานข้อมูลเพื่อนำ ID มาค้นหาที่อยู่
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  // 3. ดึงข้อมูลที่อยู่ทั้งหมดของผู้ใช้รายนี้ โดยเรียงลำดับให้ที่อยู่หลักแสดงผลเป็นลำดับแรก
  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [
      { isDefault: "desc" }, // แสดงที่อยู่หลัก (isDefault: true) ขึ้นก่อน
      { createdAt: "desc" },  // ตามด้วยเรียงลำดับเวลาที่สร้างล่าสุด
    ],
  });

  // 4. ส่งผ่านข้อมูลที่อยู่จริงเข้าคอมโพเนนต์การจัดการฝั่ง Client
  return <AddressesClient initialAddresses={addresses} />;
}
