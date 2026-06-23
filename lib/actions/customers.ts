"use server";

import  prisma  from "@/lib/prisma";
import { auth } from "@/auth";
import { DiscountType } from "@prisma/client";

export async function getCustomerProfile(id: string) {
  // Verify auth and RBAC
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      role: true,
      addresses: {
        where: { isDefault: true },
        take: 1,
        select: {
          phone: true,
          street: true,
          subdistrict: true,
          district: true,
          province: true,
          postalCode: true,
        }
      },
      orders: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          status: true,
          total: true,
          createdAt: true,
          orderItems: {
            select: { id: true }
          }
        }
      }
    }
  });

  if (!user) throw new Error("Customer not found");

  // Calculate stats
  const allOrders = await prisma.order.findMany({
    where: { userId: id },
    select: { total: true }
  });

  const totalOrdersCount = allOrders.length;
  const totalSpent = allOrders.reduce((sum, order) => sum + Number(order.total), 0);
  const aov = totalOrdersCount > 0 ? totalSpent / totalOrdersCount : 0;
  const isVip = totalSpent >= 200 || totalOrdersCount >= 3;

  return {
    ...user,
    orders: user.orders.map(order => ({
      ...order,
      total: Number(order.total)
    })),
    totalOrdersCount,
    totalSpent,
    aov,
    isVip
  };
}

export async function generateAndSendDiscount(customerId: string, value: number, type: "FIXED" | "PERCENTAGE") {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: customerId },
    select: { email: true, name: true }
  });
  if (!user) throw new Error("Customer not found");

  const code = `GIFT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  await prisma.coupon.create({
    data: {
      code,
      type: type as DiscountType,
      value,
      maxUses: 1,
      isActive: true,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  });

  await new Promise(resolve => setTimeout(resolve, 800));

  return { success: true, code, email: user.email };
}
