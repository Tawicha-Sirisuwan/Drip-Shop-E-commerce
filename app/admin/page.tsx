import React from 'react';
import { 
  DollarSign, ShoppingCart, Users, Percent, 
  TrendingUp, TrendingDown, MoreVertical 
} from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
      {/* Mobile Header Title */}
      <h1 className="sm:hidden font-display text-2xl uppercase mb-6 text-black">Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        
        {/* Stat Card 1 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5E5E5] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-[#666666] font-medium mb-1">Total Revenue</p>
              <h3 className="font-display text-2xl sm:text-3xl text-black">$45,231</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-green-600 font-bold flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3 h-3" /> +12.5%
            </span>
            <span className="text-gray-400 ml-2">from last month</span>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5E5E5] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-[#666666] font-medium mb-1">Total Orders</p>
              <h3 className="font-display text-2xl sm:text-3xl text-black">1,250</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#F0EEED] text-black flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-green-600 font-bold flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3 h-3" /> +8.2%
            </span>
            <span className="text-gray-400 ml-2">from last month</span>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5E5E5] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-[#666666] font-medium mb-1">Active Customers</p>
              <h3 className="font-display text-2xl sm:text-3xl text-black">8,432</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#F0EEED] text-black flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-red-500 font-bold flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded-md">
              <TrendingDown className="w-3 h-3" /> -2.4%
            </span>
            <span className="text-gray-400 ml-2">from last month</span>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5E5E5] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-[#666666] font-medium mb-1">Conversion Rate</p>
              <h3 className="font-display text-2xl sm:text-3xl text-black">3.24%</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#F0EEED] text-black flex items-center justify-center">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-green-600 font-bold flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3 h-3" /> +1.1%
            </span>
            <span className="text-gray-400 ml-2">from last month</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100">
            <h2 className="font-bold text-lg sm:text-xl text-black">Recent Orders</h2>
            <button className="text-sm text-[#666666] hover:text-black underline font-medium cursor-pointer">View All</button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full min-w-[600px] text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[#666666] text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                <tr className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-black">#ORD-001</td>
                  <td className="px-6 py-4 text-gray-800">Alex Morgan</td>
                  <td className="px-6 py-4 text-gray-500">Aug 20, 2026</td>
                  <td className="px-6 py-4 font-medium text-black">$145.00</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Delivered
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-black">#ORD-002</td>
                  <td className="px-6 py-4 text-gray-800">Sarah Connor</td>
                  <td className="px-6 py-4 text-gray-500">Aug 19, 2026</td>
                  <td className="px-6 py-4 font-medium text-black">$320.50</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Processing
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-black">#ORD-003</td>
                  <td className="px-6 py-4 text-gray-800">David Miller</td>
                  <td className="px-6 py-4 text-gray-500">Aug 19, 2026</td>
                  <td className="px-6 py-4 font-medium text-black">$85.00</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Delivered
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-black">#ORD-004</td>
                  <td className="px-6 py-4 text-gray-800">Emily Chen</td>
                  <td className="px-6 py-4 text-gray-500">Aug 18, 2026</td>
                  <td className="px-6 py-4 font-medium text-black">$210.00</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products Area */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-5 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg sm:text-xl text-black">Top Products</h2>
            <button className="text-gray-400 hover:text-black cursor-pointer"><MoreVertical className="w-5 h-5" /></button>
          </div>
          
          <div className="space-y-5 flex-1">
            {/* Product 1 */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#F0EEED] rounded-lg overflow-hidden flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=150&q=80" alt="T-shirt" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-black truncate">Gradient Graphic T-shirt</h4>
                <p className="text-xs text-[#666666] mt-0.5">324 Sales</p>
              </div>
              <div className="font-bold text-sm text-black">$145</div>
            </div>

            {/* Product 2 */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#F0EEED] rounded-lg overflow-hidden flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?auto=format&fit=crop&w=150&q=80" alt="Shirt" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-black truncate">Checkered Shirt</h4>
                <p className="text-xs text-[#666666] mt-0.5">210 Sales</p>
              </div>
              <div className="font-bold text-sm text-black">$180</div>
            </div>

            {/* Product 3 */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#F0EEED] rounded-lg overflow-hidden flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=150&q=80" alt="Jeans" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-black truncate">Skinny Fit Jeans</h4>
                <p className="text-xs text-[#666666] mt-0.5">185 Sales</p>
              </div>
              <div className="font-bold text-sm text-black">$240</div>
            </div>
          </div>
          
          <button className="w-full mt-6 py-2.5 border border-[#E5E5E5] text-sm font-bold rounded-xl hover:bg-gray-50 transition text-black cursor-pointer">
            View Inventory
          </button>
        </div>

      </div>
    </main>
  );
}
