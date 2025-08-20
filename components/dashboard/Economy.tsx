'use client';

import { DollarSign, TrendingUp, Gem, Coins } from 'lucide-react';

export default function Economy() {
  return (
    <div className="space-y-6">
      <div className="text-center py-20">
        <DollarSign size={64} className="mx-auto mb-6 text-[#E60000]" />
        <h2 className="text-white text-3xl font-bold mb-4">Clan Economy</h2>
        <p className="text-[#CCCCCC] text-lg max-w-2xl mx-auto">
          Comprehensive economic system with clan banks, resource trading, gem management, and financial analytics.
        </p>
        <div className="mt-8 text-[#666666]">
          <p>Coming Soon...</p>
        </div>
      </div>
    </div>
  );
}