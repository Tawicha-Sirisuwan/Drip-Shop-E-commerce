"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: "Jan", revenue: 4000, profit: 2400 },
  { name: "Feb", revenue: 3000, profit: 1398 },
  { name: "Mar", revenue: 5000, profit: 3800 },
  { name: "Apr", revenue: 2780, profit: 1908 },
  { name: "May", revenue: 6890, profit: 4800 },
  { name: "Jun", revenue: 2390, profit: 1800 },
  { name: "Jul", revenue: 3490, profit: 2300 },
  { name: "Aug", revenue: 7490, profit: 5300 },
  { name: "Sep", revenue: 5490, profit: 3300 },
  { name: "Oct", revenue: 8490, profit: 6300 },
  { name: "Nov", revenue: 9490, profit: 7300 },
  { name: "Dec", revenue: 11490, profit: 8300 },
];

export function RevenueChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[350px] w-full flex items-center justify-center bg-gray-50 animate-pulse rounded-xl"></div>;
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm col-span-1 lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-lg text-black">Revenue Overview</h3>
          <p className="text-sm text-gray-500">Monthly revenue and profit performance</p>
        </div>
        <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 outline-none focus:border-purple-500">
          <option>This Year</option>
          <option>Last Year</option>
          <option>Last 6 Months</option>
        </select>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/> {/* Violet 500 */}
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>  {/* Pink 500 fading out */}
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/> {/* Sky 500 */}
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>  {/* Teal 500 fading out */}
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748b' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ fontWeight: 600 }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              name="Gross Revenue"
            />
            <Area 
              type="monotone" 
              dataKey="profit" 
              stroke="#0ea5e9" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorProfit)" 
              name="Net Profit"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
