"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const session = await auth();
    // Security: Check RBAC
    if ((session?.user as any)?.role !== "ADMIN") {
      throw new Error("Unauthorized: Admin access required");
    }

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    // Revalidate the orders page to show updated data
    revalidatePath("/admin/orders");
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update order status:", error);
    throw new Error(error.message || "Failed to update order status");
  }
}
