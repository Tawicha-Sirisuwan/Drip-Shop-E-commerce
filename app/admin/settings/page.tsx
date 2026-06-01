import { SettingsContent } from "./_components/settings-content";

export const metadata = {
  title: "Settings - Admin | SHOP.CO",
};

export default function SettingsPage() {
  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-black text-2xl uppercase font-display text-black">Store Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your store preferences, notifications, and security configurations.</p>
      </div>

      {/* Main Content (Tabs and Forms) */}
      <SettingsContent />

    </main>
  );
}
