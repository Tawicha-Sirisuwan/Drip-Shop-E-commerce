import { CustomerStats } from "./_components/customer-stats";
import { CustomerTable } from "./_components/customer-table";
import { Upload, Plus } from "lucide-react";

export const metadata = {
  title: "Customers - Admin | SHOP.CO",
};

export default function CustomersPage() {
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

      <CustomerStats />
      
      <CustomerTable />

    </main>
  );
}
