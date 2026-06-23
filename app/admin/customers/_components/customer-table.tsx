"use client";

import { useState } from "react";
import { Star, Eye, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { CustomerProfileSheet } from "./customer-profile-sheet";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export interface CustomerData {
  id: string;
  name: string;
  initials: string;
  email: string;
  joined: string;
  orders: number;
  spent: string;
  status: string;
  vip: boolean;
  avatarBg: string;
  avatarText: string;
  statusBg: string;
  statusText: string;
}

interface CustomerTableProps {
  customers: CustomerData[];
  totalPages: number;
  currentPage: number;
  totalFiltered: number;
}

export function CustomerTable({ customers, totalPages, currentPage, totalFiltered }: CustomerTableProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentFilter = searchParams.get("filter") || "all";
  const currentSearch = searchParams.get("search") || "";
  const [searchValue, setSearchValue] = useState(currentSearch);

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    // Reset page to 1 when filter or search changes
    if (name !== "page") {
      params.set("page", "1");
    }
    return params.toString();
  };

  const handleFilterClick = (filter: string) => {
    router.push(pathname + "?" + createQueryString("filter", filter === "all" ? "" : filter));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(pathname + "?" + createQueryString("search", searchValue));
  };

  const openProfile = (id: string) => {
    // Pass id to context or state when implemented fully
    setIsDrawerOpen(true);
  };

  const startRecord = totalFiltered === 0 ? 0 : (currentPage - 1) * 10 + 1;
  const endRecord = Math.min(currentPage * 10, totalFiltered);

  return (
    <>
      {/* Filters & Actions Bar */}
      <div className="bg-white p-4 rounded-t-2xl border border-gray-200 border-b-0 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-2 w-full xl:w-auto overflow-x-auto no-scrollbar pb-1 xl:pb-0">
          <button 
            onClick={() => handleFilterClick("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${currentFilter === "all" ? "bg-gray-100 text-black" : "text-gray-500 hover:bg-gray-100 hover:text-black"}`}
          >
            All Customers
          </button>
          <button 
            onClick={() => handleFilterClick("new")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${currentFilter === "new" ? "bg-gray-100 text-black" : "text-gray-500 hover:bg-gray-100 hover:text-black"}`}
          >
            New
          </button>
          <button 
            onClick={() => handleFilterClick("vip")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition flex items-center ${currentFilter === "vip" ? "bg-gray-100 text-black" : "text-gray-500 hover:bg-gray-100 hover:text-black"}`}
          >
            VIP <Star className="w-3 h-3 text-yellow-500 ml-1 fill-current" />
          </button>
          <button 
            onClick={() => handleFilterClick("inactive")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${currentFilter === "inactive" ? "bg-gray-100 text-black" : "text-gray-500 hover:bg-gray-100 hover:text-black"}`}
          >
            Inactive
          </button>
        </div>
        
        {/* Search & Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
          <form onSubmit={handleSearch} className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </form>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-b-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-y border-gray-200">
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium text-center">Orders</th>
                <th className="px-6 py-4 font-medium">Total Spent</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${customer.avatarBg} ${customer.avatarText}`}>
                          {customer.initials}
                        </div>
                        <div>
                          <button onClick={() => openProfile(customer.id)} className="font-bold text-black hover:underline text-left">{customer.name}</button>
                          <p className="text-xs text-gray-500">Joined {customer.joined}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-black font-medium">{customer.email}</p>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-black">{customer.orders}</td>
                    <td className="px-6 py-4 font-medium text-black">{customer.spent}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${customer.statusBg} ${customer.statusText}`}>
                        {customer.vip && <Star className="w-3 h-3 mr-1 text-yellow-600 fill-current" />} 
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openProfile(customer.id)} 
                          className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition" 
                          title="View Profile"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing <span className="font-medium text-black">{startRecord}</span> to <span className="font-medium text-black">{endRecord}</span> of <span className="font-medium text-black">{totalFiltered}</span> customers</p>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => router.push(pathname + "?" + createQueryString("page", (currentPage - 1).toString()))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:text-black hover:border-gray-300 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-gray-500 px-2">Page {currentPage} of {totalPages}</span>
              <button 
                onClick={() => router.push(pathname + "?" + createQueryString("page", (currentPage + 1).toString()))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 disabled:opacity-50 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer */}
      <CustomerProfileSheet isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
