'use client';

import { Settings, User, Bell, Shield, Eye } from 'lucide-react';

export default function DashboardSettings() {
  return (
    <div className="space-y-6">
      <div className="text-center py-20">
        <Settings size={64} className="mx-auto mb-6 text-[#E60000]" />
        <h2 className="text-white text-3xl font-bold mb-4">Dashboard Settings</h2>
        <p className="text-[#CCCCCC] text-lg max-w-2xl mx-auto">
          Customize your dashboard experience with personalization options, notifications, and privacy controls.
        </p>
        <div className="mt-8 text-[#666666]">
          <p>Coming Soon...</p>
        </div>
      </div>
    </div>
  );
}