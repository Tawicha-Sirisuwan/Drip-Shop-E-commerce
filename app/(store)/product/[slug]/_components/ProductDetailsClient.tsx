'use client';

import React, { useState, useMemo } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingCart, AlertCircle, ChevronRight, Check } from 'lucide-react';
import { Prisma } from '@prisma/client';
import ReviewSection from './ReviewSection';

// \u0e43\u0e0a\u0e49 Omit \u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e41\u0e17\u0e19\u0e17\u0e35\u0e48 price: Decimal \u0e14\u0e49\u0e27\u0e22 price: number
// \u0e40\u0e1e\u0e23\u0e32\u0e30 Server Component \u0e41\u0e1b\u0e25\u0e07 Prisma Decimal \u0e40\u0e1b\u0e47\u0e19 number \u0e40\u0e23\u0e35\u0e22\u0e1a\u0e23\u0e49\u0e2d\u0e22\u0e01\u0e48\u0e2d\u0e19\u0e2a\u0e48\u0e07\u0e21\u0e32
type ProductWithVariants = Omit<
  Prisma.ProductGetPayload<{ include: { variants: true; category: true; reviews: { include: { user: { select: { name: true } } } } } }>,
  'price'
> & { price: number };

interface ProductDetailsClientProps {
  product: ProductWithVariants;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  
  const addItem = useCartStore((state) => state.addItem);

  // ดึงรายการสีที่มีทั้งหมดออกมาแบบไม่ซ้ำ
  const availableColors = useMemo(() => {
    const colors = product.variants.map(v => v.color).filter(Boolean) as string[];
    return Array.from(new Set(colors));
  }, [product.variants]);

  // ดึงรายการไซส์ที่มีทั้งหมดออกมาแบบไม่ซ้ำ
  const availableSizes = useMemo(() => {
    const sizes = product.variants.map(v => v.size).filter(Boolean) as string[];
    return Array.from(new Set(sizes));
  }, [product.variants]);

  // หา Variant ที่ตรงกับ สีและไซส์ ที่เลือก
  const currentVariant = useMemo(() => {
    if (product.variants.length === 0) return null;
    return product.variants.find(
      v => (v.color === selectedColor || (!v.color && !selectedColor)) && 
           (v.size === selectedSize || (!v.size && !selectedSize))
    );
  }, [product.variants, selectedColor, selectedSize]);

  // คำนวณสต็อกรวมทั้งหมดของสินค้านี้
  const totalStock = product.variants.length > 0 
    ? product.variants.reduce((acc, v) => acc + v.stock, 0)
    : product.stock;

  // คำนวณสต็อกที่จะนำมาโชว์ที่หน้าจอ
  // ถ้ามี Variant และ "ลูกค้ากดเลือกครบแล้ว" -> โชว์สต็อกของตัวเลือกนั้น
  // ถ้ายังไม่เลือก -> โชว์สต็อกรวมทั้งหมด
  const currentStock = (product.variants.length > 0 && selectedColor && selectedSize)
    ? (currentVariant?.stock || 0) 
    : totalStock;

  // จะตีว่า "Sold Out" ก็ต่อเมื่อ:
  // 1. ถ้าเลือกสี/ไซส์ครบแล้ว -> แต่ตัวนั้นสต็อก <= 0
  // 2. ถ้ายังไม่เลือกอะไรเลย -> เช็คว่าสต็อกรวมทั้งหมด <= 0 ไหม
  const isSoldOut = product.variants.length > 0 
    ? (selectedColor && selectedSize ? (currentVariant?.stock || 0) <= 0 : totalStock <= 0)
    : totalStock <= 0;

  const handleAddToCart = () => {
    // ถ้ามี Variant แต่ยังเลือกไม่ครบ
    if (product.variants.length > 0 && (!selectedColor || !selectedSize)) {
      alert("กรุณาเลือกสีและไซส์ก่อนเพิ่มลงตะกร้า");
      return;
    }

    const itemName = currentVariant 
      ? `${product.name} - ${currentVariant.color} / ${currentVariant.size}` 
      : product.name;

    addItem({
      id: currentVariant ? currentVariant.id : product.id,
      productId: product.id,
      name: itemName,
      price: Number(product.price),
      image: product.images?.[selectedImageIdx] || "",
      quantity: 1,
    });
    
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
      {/* ฝั่งซ้าย: แกลเลอรีรูปภาพ (Image Gallery) */}
      <div className="flex flex-col-reverse lg:flex-row gap-4">
        {/* รูปขนาดย่อ (Thumbnails) */}
        {product.images && product.images.length > 1 && (
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible no-scrollbar py-2 lg:py-0">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIdx(idx)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                  selectedImageIdx === idx ? 'border-black opacity-100 shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
        
        {/* รูปหลัก (Main Image) */}
        <div className="bg-[#F0EEED] rounded-[24px] overflow-hidden aspect-[4/5] lg:aspect-square flex-1 relative group shadow-sm">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[selectedImageIdx]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
              ไม่มีรูปภาพ
            </div>
          )}
          {isSoldOut && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-black text-white px-8 py-3 rounded-full font-bold text-xl shadow-2xl tracking-widest uppercase rotate-[-12deg]">
                Sold Out
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ฝั่งขวา: รายละเอียด (Product Info) */}
      <div className="flex flex-col py-2 lg:py-6">
        <nav className="text-sm font-medium text-gray-400 mb-6 flex items-center gap-2">
          <span className="hover:text-black cursor-pointer transition-colors">หน้าหลัก</span>
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-black cursor-pointer transition-colors">สินค้า</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-black">{product.category.name}</span>
        </nav>
        
        <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl mb-4 leading-tight tracking-tight">
          {product.name}
        </h1>
        
        <div className="font-bold text-3xl mb-8 flex items-baseline gap-2">
          <span>฿{Number(product.price).toLocaleString()}</span>
        </div>

        <p className="text-gray-600 mb-10 leading-relaxed text-lg font-light">
          {product.description}
        </p>

        <hr className="border-[#E5E5E5] mb-8" />

        {/* สี (Colors) */}
        {availableColors.length > 0 && (
          <div className="mb-8">
            <h3 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wider">Select Color</h3>
            <div className="flex flex-wrap gap-3">
              {availableColors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-6 py-2.5 rounded-full border text-sm font-medium transition-all cursor-pointer ${
                    selectedColor === color 
                      ? 'border-black bg-black text-white shadow-md' 
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/*  ไซส์ (Sizes) */}
        {availableSizes.length > 0 && (
          <div className="mb-10">
            <h3 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wider">Select Size</h3>
            <div className="flex flex-wrap gap-3">
              {availableSizes.map(size => {
                // เช็คว่าถ้าเลือกสีนี้แล้ว ไซส์นี้ยังมีของไหม (Visual check)
                const variantOfThisSize = product.variants.find(v => v.size === size && (selectedColor ? v.color === selectedColor : true));
                const hasStock = variantOfThisSize && variantOfThisSize.stock > 0;
                
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-2.5 rounded-full border text-sm font-medium transition-all cursor-pointer ${
                      selectedSize === size 
                        ? 'border-black bg-black text-white shadow-md' 
                        : !hasStock && selectedColor
                          ? 'border-gray-100 bg-gray-50 text-gray-300 line-through'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/*สถานะสต็อก */}
        <div className="mb-8 flex items-center gap-2">
          {isSoldOut ? (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg font-medium text-sm">
              <AlertCircle className="w-5 h-5" /> สินค้าหมด
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg font-medium text-sm">
              <Check className="w-5 h-5" /> มีสินค้าในสต็อก ({currentStock} ชิ้น)
            </div>
          )}
        </div>

        {/* ปุ่มเพิ่มลงตะกร้า */}
        <div className="mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={isSoldOut}
            className={`w-full py-4 rounded-full font-bold flex items-center justify-center gap-3 transition-all text-lg shadow-lg cursor-pointer ${
              isSoldOut 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                : 'bg-black text-white hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            {isSoldOut ? 'สินค้าหมดชั่วคราว' : 'เพิ่มลงตะกร้า'}
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="md:col-span-2">
        <ReviewSection productId={product.id} reviews={product.reviews || []} />
      </div>
    </div>
  );
}
