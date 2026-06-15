import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailsClient from "./_components/ProductDetailsClient";
import { Prisma } from "@prisma/client";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// ประเภทข้อมูลสินค้าที่แปลง Decimal เป็น number แล้ว เพื่อส่งข้ามไปยัง Client Component ได้
type SerializedProduct = Omit<
  Prisma.ProductGetPayload<{ include: { variants: true; category: true } }>,
  'price'
> & { price: number }

// ฟังก์ชันสร้าง Metadata เพื่อผลดีต่อ SEO
export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return { title: "ไม่พบสินค้า" };
  }

  return {
    title: `${product.name} | E-Commerce`,
    description: product.description,
  };
}

// คอมโพเนนต์แบบ Server ที่ดึงข้อมูลและส่งต่อให้ Client
export default async function ProductDetailPage({ params }: ProductPageProps) {
  // Next.js 15: params ถูกส่งมาเป็น Promise เราต้อง await ก่อนนำไปใช้
  const { slug } = await params;

  // ค้นหาสินค้าพร้อมกับดึง Variants มาด้วย
  const product = await prisma.product.findUnique({
    where: {
      slug,
      isArchived: false,
    },
    include: {
      category: true,
      variants: true, // ดึงตัวเลือกสินค้ามาใช้งาน
    },
  });

  // ถ้าไม่พบสินค้าให้แสดงหน้า 404
  if (!product) {
    notFound();
  }

  // แปลงค่า Decimal ของ Prisma ให้เป็นตัวเลขธรรมดา (Number)
  // เพื่อไม่ให้เกิด Error ในการส่งต่อข้อมูลข้ามไปยัง Client Component
  const serializedProduct: SerializedProduct = {
    ...product,
    price: Number(product.price),
  };

  return (
    <div className="bg-white text-black antialiased font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* 
          อธิบาย: โยนการเรนเดอร์ UI แบบ Interactive ไปให้ Client Component
          ซึ่งช่วยให้ Server ทำงานน้อยลง และทำให้หน้าเว็บตอบสนองต่อผู้ใช้ได้ไวขึ้น 
        */}
        <ProductDetailsClient product={serializedProduct} />
      </div>
    </div>
  );
}
