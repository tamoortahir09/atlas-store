'use client';

import { Activity, BarChart, TrendingUp, Target } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="text-center py-20">
        <Activity size={64} className="mx-auto mb-6 text-[#E60000]" />
        <h2 className="text-white text-3xl font-bold mb-4">Analytics Dashboard</h2>
        <p className="text-[#CCCCCC] text-lg max-w-2xl mx-auto">
          Advanced analytics and insights with performance metrics, trends analysis, and strategic recommendations.
        </p>
        <div className="mt-8 text-[#666666]">
          <p>Coming Soon...</p>
        </div>
      </div>
    </div>
  );
}