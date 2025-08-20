'use client';

import { Sword, Shield, Target, Zap } from 'lucide-react';

export default function ClanWars() {
  return (
    <div className="space-y-6">
      <div className="text-center py-20">
        <Sword size={64} className="mx-auto mb-6 text-[#E60000]" />
        <h2 className="text-white text-3xl font-bold mb-4">Clan Wars</h2>
        <p className="text-[#CCCCCC] text-lg max-w-2xl mx-auto">
          Organized clan warfare system with matchmaking, war declarations, battle scheduling, and victory tracking.
        </p>
        <div className="mt-8 text-[#666666]">
          <p>Coming Soon...</p>
        </div>
      </div>
    </div>
  );
}