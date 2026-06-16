import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import CheckoutButton from "./CheckoutButton";
import Link from "next/link";

export default async function TestCheckoutPage() {
  const session = await auth();

  // ป้องกันคนไม่ได้ล็อกอินเข้ามาทดสอบ
  if (!session?.user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border text-center max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4 text-red-600">กรุณาเข้าสู่ระบบก่อนทดสอบ</h1>
          <p className="text-gray-600 mb-6">คุณต้องมีบัญชีผู้ใช้เพื่อผูกกับออเดอร์ในฐานข้อมูลครับ</p>
          <Link href="/login" className="block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition">
            ไปที่หน้า Login
          </Link>
        </div>
      </div>
    );
  }

  // ดึงสินค้ามั่วๆ มา 1 ชิ้นเพื่อใช้เป็นตัวทดสอบ
  const product = await prisma.product.findFirst({
    select: { id: true, name: true, price: true, stock: true },
  });

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border text-center max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4 text-red-600">ไม่พบสินค้าในระบบ</h1>
          <p className="text-gray-600">กรุณาเพิ่มสินค้าผ่านระบบแอดมินก่อนทำการทดสอบครับ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border p-8 space-y-8">
        <div className="border-b pb-6">
          <h1 className="text-3xl font-bold text-black">🧪 หน้าทดสอบระบบ Stripe (แบบไม่ใช้ CLI)</h1>
          <p className="text-gray-500 mt-2">หน้านี้สร้างขึ้นมาเพื่อทดสอบ Server Action และ Success Page โดยเฉพาะ</p>
        </div>
        
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
          <h2 className="text-lg font-bold text-blue-900 mb-3">👤 ข้อมูลผู้ทดสอบ (คุณ)</h2>
          <div className="space-y-1 text-blue-800">
            <p><strong>ชื่อ:</strong> {session.user.name}</p>
            <p><strong>อีเมล:</strong> {session.user.email}</p>
          </div>
        </div>

        <div className="bg-gray-50 border p-6 rounded-xl">
          <h2 className="text-lg font-bold text-black mb-3">📦 สินค้าที่จะใช้ทดสอบ</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>ชื่อสินค้า:</strong> {product.name}</p>
            <p><strong>ราคา:</strong> {Number(product.price)} บาท</p>
            <p><strong>สต็อกปัจจุบันใน DB:</strong> <span className="text-orange-600 font-bold">{product.stock} ชิ้น</span></p>
          </div>
          <p className="text-sm text-gray-500 mt-4 bg-gray-200 inline-block px-3 py-1 rounded">
            * สังเกตสต็อกปัจจุบันไว้ เมื่อคุณชำระเงินสำเร็จ สต็อกสินค้านี้ควรจะลดลง 1 ชิ้น
          </p>
        </div>

        <div className="text-center pt-4">
          <CheckoutButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}
