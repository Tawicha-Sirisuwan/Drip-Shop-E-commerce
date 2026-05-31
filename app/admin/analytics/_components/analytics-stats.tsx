import { DollarSign, ShoppingCart, Users, Activity, TrendingUp, TrendingDown } from "lucide-react";

export function AnalyticsStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Revenue Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
          <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div>
          <h3 className="font-black text-2xl">$45,231.89</h3>
          <p className="text-xs text-green-600 flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +20.1% from last month
          </p>
        </div>
      </div>

      {/* Orders Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">Total Orders</p>
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>
        <div>
          <h3 className="font-black text-2xl">+2,350</h3>
          <p className="text-xs text-green-600 flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +15.2% from last month
          </p>
        </div>
      </div>

      {/* Visitors Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">Unique Visitors</p>
          <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div>
          <h3 className="font-black text-2xl">12,234</h3>
          <p className="text-xs text-red-500 flex items-center gap-1 mt-1 font-medium">
            <TrendingDown className="w-3 h-3" /> -4.1% from last month
          </p>
        </div>
      </div>

      {/* Conversion Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">Conversion Rate</p>
          <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>
        <div>
          <h3 className="font-black text-2xl">3.8%</h3>
          <p className="text-xs text-green-600 flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +1.2% from last month
          </p>
        </div>
      </div>
    </div>
  );
}
