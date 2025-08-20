'use client';

import { Calendar, Clock, Users, Trophy } from 'lucide-react';

export default function Events() {
  return (
    <div className="space-y-6">
      <div className="text-center py-20">
        <Calendar size={64} className="mx-auto mb-6 text-[#E60000]" />
        <h2 className="text-white text-3xl font-bold mb-4">Clan Events</h2>
        <p className="text-[#CCCCCC] text-lg max-w-2xl mx-auto">
          Event management system with tournament organization, raid scheduling, and community activities.
        </p>
        <div className="mt-8 text-[#666666]">
          <p>Coming Soon...</p>
        </div>
      </div>
    </div>
  );
}