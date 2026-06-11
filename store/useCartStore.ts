import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // อาจเป็น productId หรือ variantId
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  // Getters (คำนวณแบบ Real-time)
  getTotalItems: () => number;
  getTotalPrice: () => number;
}




export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      // เพิ่มสินค้าลงตะกร้า (หรือบวกจำนวนเพิ่มถ้ามีอยู่แล้ว)
      addItem: (newItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === newItem.id
          );

          if (existingItemIndex > -1) {
            // มีสินค้าชนิดนี้อยู่แล้ว -> อัปเดตจำนวน
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity || 1;
            return { items: updatedItems };
          }

          // เป็นสินค้าใหม่ -> เพิ่มเข้า array
          return {
            items: [...state.items, { ...newItem, quantity: newItem.quantity || 1 }],
          };
        });
      },

      // ลบสินค้าออกจากตะกร้า
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      // ปรับจำนวนสินค้าโดยตรง (เช่น ผู้ใช้พิมพ์ตัวเลขใน input)
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }));
      },

      // ล้างตะกร้า (มักใช้หลังจาก Checkout สำเร็จ)
      clearCart: () => {
        set({ items: [] });
      },

      // 📌 Getter methods: คำนวณจำนวนชิ้นรวม
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // 📌 Getter methods: คำนวณราคารวม
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'shopping-cart-storage', // ชื่อ key ที่จะถูกเซฟใน localStorage
    }
  )
);
