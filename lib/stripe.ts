import Stripe from "stripe";

// ตรวจสอบว่ามี STRIPE_SECRET_KEY หรือไม่
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Missing STRIPE_SECRET_KEY environment variable. Payment features will not work.");
}

// สร้างและส่งออก instance ของ Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock", {
  apiVersion: "2026-05-27.dahlia", // ระบุ API Version ให้ตรงกับ TypeScript Types ของแพ็กเกจปัจจุบัน
  typescript: true,
});
