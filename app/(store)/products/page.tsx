import prisma from "@/lib/prisma";
import Link from "next/link";
import AddToCartButton from "@/components/cart/AddToCartButton";

export const metadata = {
  title: "สินค้าทั้งหมด | E-Commerce",
  description: "เลือกซื้อสินค้าคุณภาพทั้งหมดของเรา",
};

interface ProductsPageProps {
  searchParams: Promise<{
    brand?: string;
  }>;
}

// คอมโพเนนต์หลักสำหรับแสดงหน้ารายการสินค้าทั้งหมด พร้อมระบบกรองแบรนด์
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // รับค่า Search Params จาก URL (เช่น ?brand=nike)
  const resolvedSearchParams = await searchParams;
  const brandSlugRaw = resolvedSearchParams.brand;
  const activeBrandSlug = brandSlugRaw ? decodeURIComponent(brandSlugRaw) : undefined;

  // ดึงข้อมูลแบรนด์ทั้งหมดมาทำเป็นปุ่มตัวกรอง (เลือกมาแค่ที่จำเป็นเพื่อ Performance)
  const brands = await prisma.brand.findMany({
    select: { name: true, slug: true },
    orderBy: { name: "asc" },
  });

  // สร้างเงื่อนไขในการดึงข้อมูลสินค้า
  const whereCondition: any = {
    isArchived: false,
  };

  // ถ้ามีการเลือกแบรนด์ ให้กรองเฉพาะสินค้าของแบรนด์นั้น
  if (activeBrandSlug) {
    whereCondition.brand = { slug: activeBrandSlug };
  }

  // ดึงข้อมูลสินค้าตามเงื่อนไข
  const products = await prisma.product.findMany({
    where: whereCondition,
    orderBy: {
      createdAt: "desc",
    },
    // เลือกฟิลด์เฉพาะที่จำเป็น (Performance Rule)
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      images: true,
      variants: {
        select: { stock: true }
      },
      stock: true,
    }
  });

  return (
    <div className="bg-white min-h-screen w-full antialiased font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-[#666666] mb-8">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>&gt;</span>
          <span className="text-black font-medium">Products</span>
        </div>

        <h1 className="font-black text-4xl sm:text-5xl uppercase tracking-tight text-black mb-8">
          สินค้าทั้งหมด
        </h1>

        {/* ตัวกรองแบรนด์ (Brand Filter) แบบใช้งาน Search Params */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-gray-100">
          <Link 
            href="/products"
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
              !activeBrandSlug 
                ? 'bg-black text-white border-black shadow-md' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black'
            }`}
          >
            All Brands
          </Link>
          {brands.map((b) => (
            <Link 
              key={b.slug}
              href={`/products?brand=${encodeURIComponent(b.slug)}`}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
                activeBrandSlug === b.slug 
                  ? 'bg-black text-white border-black shadow-md' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black'
              }`}
            >
              {b.name}
            </Link>
          ))}
        </div>

        {/* Grid แสดงสินค้า */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">ไม่พบสินค้า</h3>
            <p className="text-gray-500">แบรนด์นี้อาจจะยังไม่มีสินค้าในขณะนี้ครับ</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {products.map((product) => {
              // คำนวณสต็อกรวมจากทุก Variant
              const totalStock = product.variants.length > 0 
                ? product.variants.reduce((acc, v) => acc + v.stock, 0)
                : product.stock;
              const isSoldOut = totalStock <= 0;

              return (
                <div key={product.id} className="group flex flex-col">
                  <Link href={`/product/${product.slug}`} className="cursor-pointer flex-1">
                    <div className="bg-[#F0EEED] rounded-[20px] aspect-square overflow-hidden mb-4 relative">
                      {/* แสดงรูปแรก หรือถ้ารูปไม่มีให้แสดงสีเทา */}
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isSoldOut ? 'opacity-40 grayscale' : ''}`}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                          ไม่มีรูปภาพ
                        </div>
                      )}
                      
                      {/* ป้าย Sold Out */}
                      {isSoldOut && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="bg-black/80 backdrop-blur-sm text-white px-5 py-2 rounded-full font-bold text-sm tracking-widest uppercase shadow-xl">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-base sm:text-lg mb-1 leading-tight text-black group-hover:underline line-clamp-1">
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
                    {isSoldOut ? (
                      <button disabled className="w-full bg-gray-100 text-gray-400 py-2.5 rounded-full font-medium flex items-center justify-center gap-2 text-sm cursor-not-allowed border border-gray-200">
                        สินค้าหมด
                      </button>
                    ) : (
                      <AddToCartButton
                        product={{
                          id: product.id,
                          name: product.name,
                          price: Number(product.price),
                          image: product.images?.[0] || "",
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
