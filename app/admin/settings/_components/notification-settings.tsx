"use client";

import { Save } from "lucide-react";

export function NotificationSettingsForm() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="font-bold text-lg text-black">Notification Preferences</h2>
        <p className="text-sm text-gray-500">Manage how you receive alerts and updates from the system.</p>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Email Notifications */}
        <div>
          <h3 className="text-sm font-bold text-black mb-4 uppercase tracking-wider">Email Notifications</h3>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100/50 transition">
              <div>
                <p className="font-medium text-black text-sm">New Order Alerts</p>
                <p className="text-xs text-gray-500 mt-0.5">Receive an email when a new order is placed.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100/50 transition">
              <div>
                <p className="font-medium text-black text-sm">Customer Messages</p>
                <p className="text-xs text-gray-500 mt-0.5">Get notified when a customer sends a message.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>

          </div>
        </div>

        {/* Marketing Notifications */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-sm font-bold text-black mb-4 uppercase tracking-wider">Marketing Updates</h3>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100/50 transition">
              <div>
                <p className="font-medium text-black text-sm">Product Updates</p>
                <p className="text-xs text-gray-500 mt-0.5">Receive emails about new features and improvements.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>

          </div>
        </div>

      </div>

      <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
        <button className="bg-black text-white px-6 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2 text-sm shadow-sm">
          <Save className="w-4 h-4" /> Save Preferences
        </button>
      </div>
    </div>
  );
}
