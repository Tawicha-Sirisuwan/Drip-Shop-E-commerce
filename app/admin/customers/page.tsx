import  prisma  from "@/lib/prisma";
import { CustomerStats } from "./_components/customer-stats";
import { CustomerTable, CustomerData } from "./_components/customer-table";
import { Upload, Plus } from "lucide-react";
import { Prisma } from "@prisma/client";

export const metadata = {
  title: "Customers - Admin | SHOP.CO",
};

// Colors mapping for avatars and status to keep the UI rich
const AVATAR_COLORS = [
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-orange-100", text: "text-orange-700" },
  { bg: "bg-pink-100", text: "text-pink-700" },
  { bg: "bg-purple-100", text: "text-purple-700" },
  { bg: "bg-green-100", text: "text-green-700" },
];

export default async function CustomersPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const search = typeof searchParams.search === "string" ? searchParams.search : "";
  const filter = typeof searchParams.filter === "string" ? searchParams.filter : "all";

  const limit = 10;
  const skip = (page - 1) * limit;

  // Base where clause for USER role
  const where: Prisma.UserWhereInput = {
    role: "USER",
  };

  // Search logic
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  // Calculate 30 days ago for 'new' status
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Filter logic
  if (filter === "new") {
    where.createdAt = { gte: thirtyDaysAgo };
  } else if (filter === "inactive") {
    where.orders = { none: {} };
  } else if (filter === "vip") {
    // For VIP, we define it as having at least one order >= $200
    // This allows Prisma to filter it effectively at the DB level
    where.orders = { some: { total: { gte: 200 } } };
  }

  // To provide accurate stats across the whole DB (independent of search/filter)
  const [totalCustomers, activeMembers, vipCustomers] = await Promise.all([
    prisma.user.count({ where: { role: "USER" } }),
    prisma.user.count({ where: { role: "USER", orders: { some: {} } } }),
    prisma.user.count({ where: { role: "USER", orders: { some: { total: { gte: 200 } } } } }),
  ]);

  // Fetch paginated data
  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      orders: {
        select: {
          total: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });

  const totalFiltered = await prisma.user.count({ where });
  const totalPages = Math.ceil(totalFiltered / limit);

  // Map to Client Component Data structure
  const customers: CustomerData[] = users.map((user: {
    id: string;
    name: string | null;
    email: string;
    createdAt: Date;
    orders: { total: unknown }[];
  }, index: number) => {
    // Calculate total orders and total spent
    const totalOrders = user.orders.length;
    const totalSpent = user.orders.reduce((sum, order) => sum + Number(order.total), 0);
    
    // Determine VIP status for the row
    const isVip = totalSpent >= 200 || totalOrders >= 3;
    
    // Fallback UI data
    const name = user.name || "Unknown User";
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
      
    const colorTheme = AVATAR_COLORS[index % AVATAR_COLORS.length];

    // Determine status styling
    let status = "Inactive";
    let statusBg = "bg-gray-100";
    let statusText = "text-gray-700";

    if (isVip) {
      status = "VIP";
      statusBg = "bg-yellow-100";
      statusText = "text-yellow-800";
    } else if (totalOrders > 0) {
      status = "Active";
      statusBg = "bg-green-100";
      statusText = "text-green-800";
    } else if (user.createdAt >= thirtyDaysAgo) {
      status = "New";
      statusBg = "bg-blue-100";
      statusText = "text-blue-800";
    }

    return {
      id: user.id,
      name,
      initials,
      email: user.email,
      joined: user.createdAt.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      orders: totalOrders,
      spent: `$${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      status,
      vip: isVip,
      avatarBg: colorTheme.bg,
      avatarText: colorTheme.text,
      statusBg,
      statusText,
    };
  });

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
      
      {/* Header & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-black text-2xl uppercase">Customers</h1>
        
        <div className="flex items-center gap-3">
          <button className="border border-gray-200 bg-white text-black px-4 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2 text-sm flex-1 sm:flex-none shadow-sm">
            <Upload className="w-5 h-5" /> Import
          </button>
          <button className="bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2 text-sm flex-1 sm:flex-none shadow-sm">
            <Plus className="w-5 h-5" /> Add Customer
          </button>
        </div>
      </div>

      <CustomerStats total={totalCustomers} active={activeMembers} vip={vipCustomers} />
      
      <CustomerTable 
        customers={customers} 
        totalPages={totalPages} 
        currentPage={page} 
        totalFiltered={totalFiltered}
      />

    </main>
  );
}
