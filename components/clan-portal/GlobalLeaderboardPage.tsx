'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, Medal, Calendar, Filter, TrendingUp } from 'lucide-react';

const leaderboardTabs = [
  { id: 'clans', label: 'Top Clans', icon: Trophy },
  { id: 'players', label: 'Top Players', icon: Medal },
  { id: 'events', label: 'Recent Events', icon: Calendar }
];

const mockTopClans = [
  { id: 1, name: 'Elite Phantoms', tag: 'EPH', acs: 2847, members: 28, region: 'NA', trend: '+127', verified: true },
  { id: 2, name: 'Shadow Legion', tag: 'SHD', acs: 2743, members: 32, region: 'EU', trend: '+89', verified: true },
  { id: 3, name: 'Digital Hunters', tag: 'DGH', acs: 2698, members: 25, region: 'AS', trend: '+156', verified: false },
  { id: 4, name: 'Neon Wolves', tag: 'NWF', acs: 2654, members: 19, region: 'NA', trend: '+43', verified: true },
  { id: 5, name: 'Cyber Storm', tag: 'CYB', acs: 2621, members: 31, region: 'EU', trend: '+78', verified: false }
];

const mockTopPlayers = [
  { id: 1, username: 'ShadowCommander', acs: 3142, clan: 'Elite Phantoms', clanTag: 'EPH', region: 'NA', kdr: 4.18 },
  { id: 2, username: 'EliteSniper47', acs: 3089, clan: 'Shadow Legion', clanTag: 'SHD', region: 'EU', kdr: 3.85 },
  { id: 3, username: 'TacticalMaster', acs: 3021, clan: 'Digital Hunters', clanTag: 'DGH', region: 'AS', kdr: 3.94 },
  { id: 4, username: 'CyberNinja', acs: 2987, clan: 'Neon Wolves', clanTag: 'NWF', region: 'NA', kdr: 3.67 },
  { id: 5, username: 'ProGamer2024', acs: 2934, clan: 'Cyber Storm', clanTag: 'CYB', region: 'EU', kdr: 3.52 }
];

const mockRecentEvents = [
  {
    id: 1,
    name: 'Atlas Championship Finals',
    date: '2024-06-20',
    winner: 'Elite Phantoms',
    participants: 32,
    prize: '$50,000',
    type: 'Tournament'
  },
  {
    id: 2,
    name: 'Weekly Clan Wars',
    date: '2024-06-19',
    winner: 'Shadow Legion',
    participants: 16,
    prize: '$10,000',
    type: 'Weekly'
  },
  {
    id: 3,
    name: 'Regional Qualifiers',
    date: '2024-06-18',
    winner: 'Digital Hunters',
    participants: 64,
    prize: '$25,000',
    type: 'Qualifier'
  }
];

export default function GlobalLeaderboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'clans' | 'players' | 'events'>('clans');
  const [timeFilter, setTimeFilter] = useState<'weekly' | 'monthly' | 'all-time'>('all-time');
  const [serverFilter, setServerFilter] = useState<string>('all');

  const handleBackClick = () => {
    router.push('/clans');
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-[#CCCCCC] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Clans</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">
            Global <span className="text-[#E60000]">Leaderboards</span>
          </h1>
          <p className="text-xl text-[#CCCCCC]">The ultimate ranking of Atlas's finest competitors</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-[#111111] border border-[#444444] rounded-lg p-1">
            {leaderboardTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#E60000] text-white'
                    : 'text-[#CCCCCC] hover:text-white hover:bg-[#222222]'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#111111] border border-[#444444] rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex items-center gap-3">
              <Filter size={20} className="text-[#CCCCCC]" />
              <span className="text-[#CCCCCC] font-medium">Filters:</span>
            </div>
            
            <div className="flex flex-wrap gap-4 flex-1">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as any)}
                className="bg-[#222222] border border-[#444444] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000]"
              >
                <option value="weekly">This Week</option>
                <option value="monthly">This Month</option>
                <option value="all-time">All Time</option>
              </select>

              <select
                value={serverFilter}
                onChange={(e) => setServerFilter(e.target.value)}
                className="bg-[#222222] border border-[#444444] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000]"
              >
                <option value="all">All Servers</option>
                <option value="atlas-main">Atlas Main (10x)</option>
                <option value="atlas-vanilla">Atlas Vanilla</option>
                <option value="atlas-hardcore">Atlas Hardcore (5x)</option>
              </select>
            </div>

            <div className="text-sm text-[#CCCCCC]">
              Updated: <span className="text-white">2 minutes ago</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          
          {/* Top Clans */}
          {activeTab === 'clans' && (
            <div className="bg-[#111111] border border-[#444444] rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-[#444444] bg-[#222222]">
                <h3 className="text-xl font-bold text-white">Top Performing Clans</h3>
                <p className="text-[#CCCCCC] text-sm mt-1">Ranked by Atlas Competitive Score (ACS)</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#222222] border-b border-[#444444]">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-medium text-[#CCCCCC]">Rank</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-[#CCCCCC]">Clan</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-[#CCCCCC]">ACS</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-[#CCCCCC]">Members</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-[#CCCCCC]">Region</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-[#CCCCCC]">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#444444]">
                    {mockTopClans.map((clan, index) => (
                      <tr key={clan.id} className="hover:bg-[#222222] transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <span className={`text-2xl font-bold ${
                              index === 0 ? 'text-[#E60000]' :
                              index === 1 ? 'text-[#CCCCCC]' :
                              index === 2 ? 'text-[#E60000]/70' :
                              'text-[#666666]'
                            }`}>
                              #{index + 1}
                            </span>
                            {index === 0 && <Trophy size={20} className="text-[#E60000]" />}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-white font-bold">{clan.name}</span>
                                <span className="text-[#CCCCCC]">[{clan.tag}]</span>
                                {clan.verified && (
                                  <div className="w-2 h-2 bg-[#E60000] rounded-full"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-2xl font-bold text-[#E60000]">
                            {clan.acs}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-white">{clan.members}</td>
                        <td className="py-4 px-6">
                          <span className="px-2 py-1 rounded text-xs font-medium bg-[#E60000]/20 text-[#E60000]">
                            {clan.region}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1 text-[#E60000]">
                            <TrendingUp size={16} />
                            <span className="font-medium">{clan.trend}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Top Players */}
          {activeTab === 'players' && (
            <div className="bg-[#111111] border border-[#444444] rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-[#444444] bg-[#222222]">
                <h3 className="text-xl font-bold text-white">Elite Players</h3>
                <p className="text-[#CCCCCC] text-sm mt-1">Individual player rankings across all clans</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#222222] border-b border-[#444444]">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-medium text-[#CCCCCC]">Rank</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-[#CCCCCC]">Player</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-[#CCCCCC]">ACS</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-[#CCCCCC]">Clan</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-[#CCCCCC]">K/D</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-[#CCCCCC]">Region</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#444444]">
                    {mockTopPlayers.map((player, index) => (
                      <tr key={player.id} className="hover:bg-[#222222] transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <span className={`text-2xl font-bold ${
                              index === 0 ? 'text-[#E60000]' :
                              index === 1 ? 'text-[#CCCCCC]' :
                              index === 2 ? 'text-[#E60000]/70' :
                              'text-[#666666]'
                            }`}>
                              #{index + 1}
                            </span>
                            {index === 0 && <Medal size={20} className="text-[#E60000]" />}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-white font-bold">{player.username}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-2xl font-bold text-[#E60000]">
                            {player.acs}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-[#E60000] font-medium">[{player.clanTag}] {player.clan}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-[#E60000] font-bold">{player.kdr}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2 py-1 rounded text-xs font-medium bg-[#E60000]/20 text-[#E60000]">
                            {player.region}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Events */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              {mockRecentEvents.map((event) => (
                <div key={event.id} className="bg-[#111111] border border-[#444444] rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{event.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-[#CCCCCC]">
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{event.participants} participants</span>
                        <span>•</span>
                        <span className="text-[#E60000] font-medium">{event.prize} prize pool</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#E60000]/20 text-[#E60000]">
                      {event.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Trophy size={20} className="text-[#E60000]" />
                    <span className="text-[#CCCCCC]">Winner:</span>
                    <span className="text-white font-bold">{event.winner}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}