"use client";

import { Save } from "lucide-react";

export function GeneralSettingsForm() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="font-bold text-lg text-black">General Information</h2>
        <p className="text-sm text-gray-500">Update your store's basic information and contact details.</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Store Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-black">Store Name</label>
            <input 
              type="text" 
              defaultValue="SHOP.CO"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm text-black"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-black">Support Email</label>
            <input 
              type="email" 
              defaultValue="support@shop.co"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm text-black"
            />
          </div>
        </div>

        {/* Currency & Timezone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-black">Store Currency</label>
            <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm text-black appearance-none">
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="THB">THB (฿) - Thai Baht</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-black">Timezone</label>
            <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm text-black appearance-none">
              <option value="UTC">UTC (Universal Coordinated Time)</option>
              <option value="EST">EST (Eastern Standard Time)</option>
              <option value="BKK">BKK (Asia/Bangkok)</option>
            </select>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-black">Store Address</label>
          <textarea 
            rows={3}
            defaultValue="123 Commerce Street, Suite 100\nNew York, NY 10001\nUnited States"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm text-black resize-none"
          ></textarea>
        </div>
      </div>

      <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
        <button className="bg-black text-white px-6 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2 text-sm shadow-sm">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>
    </div>
  );
}
