"use client";

import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";

const data = [
  { name: "Organic Search", value: 4500, color: "#8b5cf6" }, // Violet
  { name: "Direct", value: 3000, color: "#ec4899" },         // Pink
  { name: "Social Media", value: 2000, color: "#0ea5e9" },   // Sky Blue
  { name: "Referral", value: 1500, color: "#14b8a6" },       // Teal
];

export function TrafficChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[430px] w-full flex items-center justify-center bg-gray-50 animate-pulse rounded-xl"></div>;
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm col-span-1">
      <div className="mb-2">
        <h3 className="font-bold text-lg text-black">Traffic Sources</h3>
        <p className="text-sm text-gray-500">Where your customers are coming from</p>
      </div>

      <div className="h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ fontWeight: 600, color: '#000' }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              formatter={(value) => <span className="text-sm font-medium text-gray-700">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-500">
          <span className="font-bold text-black text-lg">68%</span> of traffic comes from Organic & Direct
        </p>
      </div>
    </div>
  );
}
