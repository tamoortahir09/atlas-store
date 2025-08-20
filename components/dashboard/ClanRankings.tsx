'use client';

import { Trophy, Crown, Users, TrendingUp, Shield } from 'lucide-react';

const mockClans = [
  { id: 1, name: 'Elite Raiders', tag: 'RAID', elo: 2847, members: 28, wins: 147, losses: 23, winRate: 86.5, verified: true },
  { id: 2, name: 'Shadow Legion', tag: 'SHDW', elo: 2743, members: 32, wins: 134, losses: 31, winRate: 81.2, verified: true },
  { id: 3, name: 'Iron Wolves', tag: 'WOLF', elo: 2698, members: 25, wins: 128, losses: 27, winRate: 82.6, verified: false }
];

export default function ClanRankings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-2xl font-bold">Clan Rankings</h2>
          <p className="text-white/70 mt-1">Complete leaderboard of all active clans</p>
        </div>
      </div>

      <div className="glass-panel rounded-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-white font-bold text-lg mb-6">Global Clan Leaderboard</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/20">
              <tr>
                <th className="text-left p-4 text-white/70 font-medium">Rank</th>
                <th className="text-left p-4 text-white/70 font-medium">Clan</th>
                <th className="text-left p-4 text-white/70 font-medium">ELO</th>
                <th className="text-left p-4 text-white/70 font-medium">Members</th>
                <th className="text-left p-4 text-white/70 font-medium">Win Rate</th>
                <th className="text-left p-4 text-white/70 font-medium">W/L</th>
              </tr>
            </thead>
            <tbody>
              {mockClans.map((clan, index) => (
                <tr key={clan.id} className="hover:bg-glass-hover transition-colors">
                  <td className="p-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-400 text-black' :
                      index === 2 ? 'bg-amber-600 text-white' :
                      'bg-white/20 text-white'
                    }`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#CC0000]/20 rounded flex items-center justify-center">
                        <Shield size={14} className="text-[#CC0000]" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{clan.name}</div>
                        <div className="text-white/70 text-sm">[{clan.tag}]</div>
                      </div>
                      {clan.verified && (
                        <Shield size={12} className="text-blue-400" />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-[#CC0000] font-bold">{clan.elo}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-white">{clan.members}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-green-400 font-medium">{clan.winRate}%</div>
                  </td>
                  <td className="p-4">
                    <div className="text-white/70">{clan.wins}/{clan.losses}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}