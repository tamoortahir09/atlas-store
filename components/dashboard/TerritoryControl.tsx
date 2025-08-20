'use client';

import { Map, Flag, Shield, Sword } from 'lucide-react';

export default function TerritoryControl() {
  return (
    <div className="space-y-6">
      <div className="text-center py-20">
        <Map size={64} className="mx-auto mb-6 text-[#E60000]" />
        <h2 className="text-white text-3xl font-bold mb-4">Territory Control</h2>
        <p className="text-[#CCCCCC] text-lg max-w-2xl mx-auto">
          Advanced territory management system with real-time map control, resource monitoring, and strategic warfare features.
        </p>
        <div className="mt-8 text-[#666666]">
          <p>Coming Soon...</p>
        </div>
      </div>
    </div>
  );
}