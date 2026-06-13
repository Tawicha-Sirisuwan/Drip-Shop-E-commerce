import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/cart/AddToCartButton";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

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

// คอมโพเนนต์แสดงรายละเอียดสินค้าแบบเจาะจง (ผ่าน Slug)
export default async function ProductDetailPage({ params }: ProductPageProps) {
  // Next.js 15: params ถูกส่งมาเป็น Promise เราต้อง await ก่อนนำไปใช้
  const { slug } = await params;

  // ค้นหาสินค้าจาก slug ที่ได้รับมาจาก URL
  const product = await prisma.product.findUnique({
    where: {
      slug,
      isArchived: false,
    },
    include: {
      category: true, // ดึงข้อมูลหมวดหมู่มาด้วย
    },
  });

  // ถ้าไม่พบสินค้าให้แสดงหน้า 404 Not Found
  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* คอลัมน์ซ้าย: รูปภาพสินค้า */}
        <div className="bg-[#F0EEED] rounded-[20px] overflow-hidden aspect-square">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
              ไม่มีรูปภาพ
            </div>
          )}
        </div>

        {/* คอลัมน์ขวา: รายละเอียดสินค้า */}
        <div className="flex flex-col">
          <nav className="text-sm text-gray-500 mb-4">
            หน้าหลัก / สินค้า / <span className="text-black">{product.category.name}</span>
          </nav>
          
          <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
            {product.name}
          </h1>
          
          <div className="font-bold text-3xl mb-6">
            ฿{Number(product.price).toLocaleString()}
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed">
            {product.description}
          </p>

          <hr className="border-gray-200 mb-8" />

          {/* ตรวจสอบสต็อก */}
          <div className="mb-6">
            <span className="font-medium text-gray-700">สถานะ: </span>
            {product.stock > 0 ? (
              <span className="text-green-600">มีสินค้า ({product.stock} ชิ้น)</span>
            ) : (
              <span className="text-red-600">สินค้าหมด</span>
            )}
          </div>

          {/* ปุ่มเพิ่มลงตะกร้า */}
          <div className="mt-auto">
            {product.stock > 0 ? (
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: Number(product.price),
                  image: product.images?.[0] || "",
                }}
              />
            ) : (
              <button 
                disabled 
                className="w-full bg-gray-300 text-gray-500 py-4 rounded-full font-bold cursor-not-allowed"
              >
                สินค้าหมดชั่วคราว
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
