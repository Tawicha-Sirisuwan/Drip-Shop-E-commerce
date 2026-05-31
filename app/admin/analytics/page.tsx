import { Download } from "lucide-react";
import { AnalyticsStats } from "./_components/analytics-stats";
import { RevenueChart } from "./_components/revenue-chart";
import { TrafficChart } from "./_components/traffic-chart";

export const metadata = {
  title: "Analytics - Admin | SHOP.CO",
};

export default function AnalyticsPage() {
  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      
      {/* Header & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-black text-2xl uppercase font-display">Analytics Overview</h1>
        
        <div className="flex items-center gap-3">
          <button className="border border-gray-200 bg-white text-black px-4 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2 text-sm flex-1 sm:flex-none shadow-sm">
            <Download className="w-5 h-5" /> Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <AnalyticsStats />
      
      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <RevenueChart />
        <TrafficChart />
      </div>

    </main>
  );
}
