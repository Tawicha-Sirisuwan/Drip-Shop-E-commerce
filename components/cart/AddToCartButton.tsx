"use client";

import React from 'react';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // ป้องกันการ trigger click ของ parent component
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className="mt-3 w-full bg-black text-white py-2 rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
    >
      <ShoppingCart className="w-4 h-4" />
      เพิ่มลงตะกร้า
    </button>
  );
}
