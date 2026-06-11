import { z } from "zod";

// Schema สำหรับฟอร์มเข้าสู่ระบบ (Login Schema)
export const loginSchema = z.object({
  email: z.string().email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
  password: z.string().min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }),
});

// Schema สำหรับฟอร์มสมัครสมาชิก (Register Schema)
export const registerSchema = z.object({
  name: z.string().min(2, { message: "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร" }),
  email: z.string().email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
  password: z.string().min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

// Schema สำหรับฟอร์มอัปเดตประวัติส่วนตัว (Profile Update Schema)
export const updateProfileSchema = z.object({
  name: z.string().min(2, { message: "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร" }),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, { message: "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร" }).optional(),
  confirmNewPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: "กรุณากรอกรหัสผ่านเดิมเพื่อยืนยันการเปลี่ยนรหัสผ่าน",
  path: ["currentPassword"],
}).refine((data) => {
  if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
    return false;
  }
  return true;
}, {
  message: "รหัสผ่านใหม่ไม่ตรงกัน",
  path: ["confirmNewPassword"],
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// Schema สำหรับข้อมูลที่อยู่จัดส่ง (Address Schema)
// ใช้สำหรับตรวจสอบความถูกต้องของข้อมูลที่อยู่จัดส่งของผู้ใช้ ทั้งฝั่ง Client และ Server
export const addressSchema = z.object({
  name: z.string().min(2, { message: "กรุณาระบุชื่อผู้รับอย่างน้อย 2 ตัวอักษร" }),
  // ตรวจสอบเบอร์โทรศัพท์: ต้องขึ้นต้นด้วย 0 และตามด้วยตัวเลข 8 หรือ 9 หลัก (เช่น 0812345678)
  phone: z.string().regex(/^0[0-9]{8,9}$/, { message: "เบอร์โทรศัพท์ไม่ถูกต้อง (เช่น 0812345678)" }),
  street: z.string().min(5, { message: "กรุณาระบุที่อยู่/ถนนอย่างน้อย 5 ตัวอักษร" }),
  subdistrict: z.string().min(2, { message: "กรุณาระบุแขวง/ตำบล" }),
  district: z.string().min(2, { message: "กรุณาระบุเขต/อำเภอ" }),
  province: z.string().min(2, { message: "กรุณาระบุจังหวัด" }),
  // ตรวจสอบรหัสไปรษณีย์: ต้องเป็นตัวเลข 5 หลัก
  postalCode: z.string().regex(/^[0-9]{5}$/, { message: "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก" }),
  isDefault: z.boolean(),
});

export type AddressInput = z.infer<typeof addressSchema>;
