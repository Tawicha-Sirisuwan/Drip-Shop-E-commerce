"use client";

import { useState } from "react";
import { Star, ListFilter, Filter, Eye, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import { CustomerProfileSheet } from "./customer-profile-sheet";

// Mock data based on example.html
const MOCK_CUSTOMERS = [
  {
    id: "1",
    name: "Alex Morgan",
    initials: "AM",
    avatarBg: "bg-blue-100",
    avatarText: "text-blue-700",
    joined: "May 2024",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    orders: 12,
    spent: "$1,450.00",
    status: "Active",
    statusBg: "bg-green-100",
    statusText: "text-green-800",
    vip: false,
    avatar: null,
  },
  {
    id: "2",
    name: "Sarah Connor",
    joined: "Jan 2023",
    email: "sarah.c@example.com",
    phone: "+44 7700 900077",
    location: "London, UK",
    orders: 45,
    spent: "$8,320.50",
    status: "VIP",
    statusBg: "bg-yellow-100",
    statusText: "text-yellow-800",
    vip: true,
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    id: "3",
    name: "David Miller",
    initials: "DM",
    avatarBg: "bg-orange-100",
    avatarText: "text-orange-700",
    joined: "Aug 2025",
    email: "david.m@example.com",
    phone: "+61 412 345 678",
    location: "Sydney, AU",
    orders: 1,
    spent: "$85.00",
    status: "Inactive",
    statusBg: "bg-gray-100",
    statusText: "text-gray-700",
    vip: false,
    avatar: null,
  },
  {
    id: "4",
    name: "Michael Brown",
    joined: "Nov 2024",
    email: "mike_b@example.com",
    phone: "+1 (555) 987-6543",
    location: "Chicago, USA",
    orders: 5,
    spent: "$450.00",
    status: "Active",
    statusBg: "bg-green-100",
    statusText: "text-green-800",
    vip: false,
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "5",
    name: "Emily Chen",
    initials: "EC",
    avatarBg: "bg-pink-100",
    avatarText: "text-pink-700",
    joined: "Feb 2022",
    email: "emily.chen@example.com",
    phone: "+65 9123 4567",
    location: "Singapore",
    orders: 28,
    spent: "$5,210.00",
    status: "VIP",
    statusBg: "bg-yellow-100",
    statusText: "text-yellow-800",
    vip: true,
    avatar: null,
  },
];

export function CustomerTable() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      {/* Filters & Actions Bar */}
      <div className="bg-white p-4 rounded-t-2xl border border-gray-200 border-b-0 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <button className="px-4 py-1.5 bg-gray-100 text-black rounded-full text-sm font-medium whitespace-nowrap">All Customers</button>
          <button className="px-4 py-1.5 text-gray-500 hover:bg-gray-100 hover:text-black rounded-full text-sm font-medium whitespace-nowrap transition">New</button>
          <button className="px-4 py-1.5 text-gray-500 hover:bg-gray-100 hover:text-black rounded-full text-sm font-medium whitespace-nowrap transition flex items-center">
            VIP <Star className="w-3 h-3 text-yellow-500 ml-1 fill-current" />
          </button>
          <button className="px-4 py-1.5 text-gray-500 hover:bg-gray-100 hover:text-black rounded-full text-sm font-medium whitespace-nowrap transition">Inactive</button>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="border border-gray-200 text-black px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition w-full md:w-auto justify-center">
            <ListFilter className="w-5 h-5" /> Sort
          </button>
          <button className="border border-gray-200 text-black px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition w-full md:w-auto justify-center">
            <Filter className="w-5 h-5" /> Filters
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-b-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-y border-gray-200">
                <th className="px-6 py-4 w-12 text-center">
                  <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" />
                </th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium text-center">Orders</th>
                <th className="px-6 py-4 font-medium">Total Spent</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {MOCK_CUSTOMERS.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition group">
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {customer.avatar ? (
                        <img src={customer.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${customer.avatarBg} ${customer.avatarText}`}>
                          {customer.initials}
                        </div>
                      )}
                      <div>
                        <button onClick={() => setIsDrawerOpen(true)} className="font-bold text-black hover:underline text-left">{customer.name}</button>
                        <p className="text-xs text-gray-500">Joined {customer.joined}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-black font-medium">{customer.email}</p>
                    <p className="text-xs text-gray-500">{customer.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{customer.location}</td>
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
                        onClick={() => setIsDrawerOpen(true)} 
                        className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition" 
                        title="View Profile"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition" title="Edit">
                        <Pencil className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing <span className="font-medium text-black">1</span> to <span className="font-medium text-black">5</span> of <span className="font-medium text-black">8,432</span> customers</p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:text-black hover:border-gray-300 disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-black text-white font-medium text-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-transparent text-gray-500 hover:bg-gray-100 font-medium text-sm transition">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-transparent text-gray-500 hover:bg-gray-100 font-medium text-sm transition">3</button>
            <span className="px-2 text-gray-400">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-transparent text-gray-500 hover:bg-gray-100 font-medium text-sm transition">1687</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 transition">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Drawer */}
      <CustomerProfileSheet isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
