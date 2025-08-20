'use client';

import { Medal, Trophy, Crown, User } from 'lucide-react';

const mockPlayers = [
  { id: 1, username: 'DeathDealer', clan: 'Elite Raiders', clanTag: 'RAID', elo: 3142, level: 147, kills: 2847, deaths: 891, kdr: 3.19 },
  { id: 2, username: 'SniperElite', clan: 'Shadow Legion', clanTag: 'SHDW', elo: 3089, level: 134, kills: 2634, deaths: 923, kdr: 2.85 },
  { id: 3, username: 'PlayerOne#1234', clan: 'Elite Raiders', clanTag: 'RAID', elo: 1847, level: 89, kills: 1234, deaths: 456, kdr: 2.71 }
];

export default function PlayerRankings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-2xl font-bold">Player Rankings</h2>
          <p className="text-white/70 mt-1">Top players across all clans with detailed statistics</p>
        </div>
      </div>

      <div className="glass-panel rounded-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-white font-bold text-lg mb-6">Global Player Leaderboard</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/20">
              <tr>
                <th className="text-left p-4 text-white/70 font-medium">Rank</th>
                <th className="text-left p-4 text-white/70 font-medium">Player</th>
                <th className="text-left p-4 text-white/70 font-medium">Clan</th>
                <th className="text-left p-4 text-white/70 font-medium">ELO</th>
                <th className="text-left p-4 text-white/70 font-medium">Level</th>
                <th className="text-left p-4 text-white/70 font-medium">K/D</th>
                <th className="text-left p-4 text-white/70 font-medium">Kills</th>
              </tr>
            </thead>
            <tbody>
              {mockPlayers.map((player, index) => (
                <tr key={player.id} className="hover:bg-glass-hover transition-colors">
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
                      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                        <User size={14} className="text-white/70" />
                      </div>
                      <div className="text-white font-medium">{player.username}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-[#CC0000] font-medium">[{player.clanTag}] {player.clan}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-white font-bold">{player.elo}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-blue-400 font-medium">{player.level}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-green-400 font-medium">{player.kdr}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-white/70">{player.kills}</div>
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