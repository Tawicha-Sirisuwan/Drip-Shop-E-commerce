import { Users, UserCheck, Star } from "lucide-react";

export function CustomerStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 text-black flex items-center justify-center">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Total Customers</p>
          <h3 className="font-black text-xl mt-0.5">8,432</h3>
        </div>
      </div>
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
          <UserCheck className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Active Members</p>
          <h3 className="font-black text-xl mt-0.5">6,120</h3>
        </div>
      </div>
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center">
          <Star className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">VIP Customers</p>
          <h3 className="font-black text-xl mt-0.5">450</h3>
        </div>
      </div>
    </div>
  );
}
