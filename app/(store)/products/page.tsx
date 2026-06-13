import prisma from "@/lib/prisma";
import Link from "next/link";
import AddToCartButton from "@/components/cart/AddToCartButton";

export const metadata = {
  title: "สินค้าทั้งหมด | E-Commerce",
  description: "เลือกซื้อสินค้าคุณภาพทั้งหมดของเรา",
};

// คอมโพเนนต์หลักสำหรับแสดงหน้ารายการสินค้าทั้งหมด
export default async function ProductsPage() {
  // ดึงข้อมูลสินค้าทั้งหมดที่ยังไม่ถูกเก็บเข้ากรุ (isArchived = false)
  const products = await prisma.product.findMany({
    where: {
      isArchived: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-bold text-4xl mb-8">สินค้าทั้งหมด</h1>

      {products.length === 0 ? (
        <p className="text-gray-500">ยังไม่มีสินค้าในขณะนี้</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <div key={product.id} className="group flex flex-col">
              <Link href={`/product/${product.slug}`} className="cursor-pointer flex-1">
                <div className="bg-[#F0EEED] rounded-[20px] aspect-square overflow-hidden mb-4 relative">
                  {/* แสดงรูปแรก หรือถ้ารูปไม่มีให้แสดงสีเทา */}
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                      ไม่มีรูปภาพ
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-1 leading-tight text-black group-hover:underline">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-bold text-xl sm:text-2xl">
                    ฿{Number(product.price).toLocaleString()}
                  </span>
                </div>
              </Link>

              {/* ปุ่มเพิ่มลงตะกร้า */}
              <div className="mt-auto">
                <AddToCartButton
                  product={{
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    image: product.images?.[0] || "",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
