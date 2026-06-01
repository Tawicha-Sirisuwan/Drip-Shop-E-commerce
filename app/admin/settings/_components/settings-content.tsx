"use client";

import { useState } from "react";
import { Settings, Bell, Lock, Store } from "lucide-react";
import { GeneralSettingsForm } from "./general-settings";
import { NotificationSettingsForm } from "./notification-settings";

type Tab = "general" | "notifications" | "security";

export function SettingsContent() {
  const [activeTab, setActiveTab] = useState<Tab>("general");

  return (
    <div className="flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <nav className="space-y-1">
          <button 
            onClick={() => setActiveTab("general")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm ${
              activeTab === "general" 
                ? "bg-black text-white shadow-sm" 
                : "text-gray-500 hover:bg-gray-100 hover:text-black"
            }`}
          >
            <Store className="w-5 h-5" />
            General
          </button>

          <button 
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm ${
              activeTab === "notifications" 
                ? "bg-black text-white shadow-sm" 
                : "text-gray-500 hover:bg-gray-100 hover:text-black"
            }`}
          >
            <Bell className="w-5 h-5" />
            Notifications
          </button>

          <button 
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm ${
              activeTab === "security" 
                ? "bg-black text-white shadow-sm" 
                : "text-gray-500 hover:bg-gray-100 hover:text-black"
            }`}
          >
            <Lock className="w-5 h-5" />
            Security
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 max-w-4xl">
        {activeTab === "general" && <GeneralSettingsForm />}
        {activeTab === "notifications" && <NotificationSettingsForm />}
        {activeTab === "security" && (
          <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center">
            <Lock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-black mb-2">Security Settings</h3>
            <p className="text-gray-500 text-sm">Security settings module is coming soon.</p>
          </div>
        )}
      </div>

    </div>
  );
}
