'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Trophy, Clock, Zap, Users, Target, Sword, Star, AlertTriangle, CheckCircle, XCircle, Filter, Search } from 'lucide-react';

interface PlayerProfilePageProps {
  playerId: string;
}

// Mock player data
const mockPlayerData = {
  '1': {
    id: '1',
    username: 'EliteSniper47',
    avatar: '🎯',
    discordTag: 'EliteSniper47#1337',
    acs: 2847,
    rank: 15,
    clan: null,
    stats: {
      kdr: 3.21,
      totalHours: 1247,
      eventsWon: 23,
      accuracy: 68.4,
      headshotRate: 42.1,
      winRate: 76.8
    },
    violations: [
      { type: 'Verbal Warning', date: '2024-05-15', reason: 'Unsportsmanlike conduct', severity: 'low' }
    ],
    achievements: [
      { name: 'Headshot Master', icon: '🎯', rarity: 'legendary' },
      { name: 'Tournament Winner', icon: '🏆', rarity: 'epic' },
      { name: 'Clan Founder', icon: '⚡', rarity: 'rare' }
    ],
    invites: [
      { clanId: 2, clanName: 'Shadow Legion', clanTag: 'SHD', sentDate: '2024-06-19', expires: '2024-06-26' },
      { clanId: 4, clanName: 'Neon Wolves', clanTag: 'NWF', sentDate: '2024-06-18', expires: '2024-06-25' }
    ]
  }
};

const mockOpenClans = [
  {
    id: 1,
    name: 'Elite Phantoms',
    tag: 'EPH',
    acs: 2847,
    members: 28,
    maxMembers: 30,
    region: 'NA',
    language: 'English',
    type: 'Competitive',
    requirements: 'ACS 2000+',
    description: 'Top-tier competitive clan seeking skilled players.',
    verified: true
  },
  {
    id: 3,
    name: 'Digital Hunters',
    tag: 'DGH',
    acs: 2698,
    members: 25,
    maxMembers: 32,
    region: 'AS',
    language: 'English',
    type: 'Semi-Pro',
    requirements: 'ACS 1800+',
    description: 'Semi-professional team focused on tournaments.',
    verified: false
  },
  {
    id: 5,
    name: 'Cyber Storm',
    tag: 'CYB',
    acs: 2621,
    members: 31,
    maxMembers: 35,
    region: 'EU',
    language: 'Multi',
    type: 'Casual',
    requirements: 'ACS 1500+',
    description: 'Friendly community clan for all skill levels.',
    verified: false
  }
];

export default function PlayerProfilePage({ playerId }: PlayerProfilePageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'clans' | 'applications'>('overview');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const player = mockPlayerData[playerId as keyof typeof mockPlayerData];

  const handleBackClick = () => {
    router.push('/clans');
  };

  const handleAcceptInvite = (clanId: number) => {
    console.log('Accepting invite from clan:', clanId);
    // Handle invite acceptance
  };

  const handleDeclineInvite = (clanId: number) => {
    console.log('Declining invite from clan:', clanId);
    // Handle invite decline
  };

  const handleApplyToClan = (clanId: number) => {
    console.log('Applying to clan:', clanId);
    // Handle clan application
  };

  if (!player) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-white text-2xl font-bold mb-2">Player Not Found</h2>
          <p className="text-[#CCCCCC]">The requested player profile could not be found.</p>
        </div>
      </div>
    );
  }

  const filteredClans = mockOpenClans.filter(clan => {
    const matchesRegion = filterRegion === 'all' || clan.region === filterRegion;
    const matchesType = filterType === 'all' || clan.type === filterType;
    const matchesSearch = searchQuery === '' || 
      clan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clan.tag.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesRegion && matchesType && matchesSearch;
  });

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

        {/* Player Header */}
        <div className="bg-[#111111] border border-[#444444] rounded-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Avatar & Basic Info */}
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-[#E60000] rounded-2xl flex items-center justify-center text-4xl">
                {player.avatar}
              </div>
              <div>
                <h1 className="text-3xl font-black text-white mb-2">{player.username}</h1>
                <div className="flex items-center gap-4 text-[#CCCCCC] mb-4">
                  <span>{player.discordTag}</span>
                  <span>•</span>
                  <span className="text-[#E60000]">Global Rank #{player.rank}</span>
                </div>
                {player.clan ? (
                  <div className="flex items-center gap-2 bg-[#E60000]/20 border border-[#E60000]/50 px-3 py-1 rounded-lg">
                    <Shield size={16} className="text-[#E60000]" />
                    <span className="text-[#E60000] font-medium">{player.clan}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-[#333333] border border-[#666666] px-3 py-1 rounded-lg">
                    <Users size={16} className="text-[#CCCCCC]" />
                    <span className="text-[#CCCCCC]">No Clan</span>
                  </div>
                )}
              </div>
            </div>

            {/* ACS Score */}
            <div className="lg:ml-auto text-center lg:text-right">
              <div className="text-5xl font-black text-[#E60000] mb-2">
                {player.acs}
              </div>
              <div className="text-[#CCCCCC] font-medium">Atlas Competitive Score</div>
              <div className="text-[#E60000] text-sm mt-1">+47 this week</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-[#111111] border border-[#444444] rounded-lg p-1 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: Trophy },
            { id: 'clans', label: 'Find Clans', icon: Users },
            { id: 'applications', label: 'Applications', icon: Target }
          ].map((tab) => (
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

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#111111] border border-[#444444] rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target size={24} className="text-[#E60000]" />
                  <h3 className="text-lg font-bold text-white">Combat Stats</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#CCCCCC]">K/D Ratio</span>
                    <span className="text-[#E60000] font-bold">{player.stats.kdr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#CCCCCC]">Accuracy</span>
                    <span className="text-[#E60000] font-bold">{player.stats.accuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#CCCCCC]">Headshot Rate</span>
                    <span className="text-[#E60000] font-bold">{player.stats.headshotRate}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#111111] border border-[#444444] rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock size={24} className="text-[#E60000]" />
                  <h3 className="text-lg font-bold text-white">Experience</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#CCCCCC]">Total Hours</span>
                    <span className="text-white font-bold">{player.stats.totalHours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#CCCCCC]">Events Won</span>
                    <span className="text-[#E60000] font-bold">{player.stats.eventsWon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#CCCCCC]">Win Rate</span>
                    <span className="text-[#E60000] font-bold">{player.stats.winRate}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#111111] border border-[#444444] rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Star size={24} className="text-[#E60000]" />
                  <h3 className="text-lg font-bold text-white">Achievements</h3>
                </div>
                <div className="space-y-2">
                  {player.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-xl">{achievement.icon}</span>
                      <span className={`text-sm font-medium ${
                        achievement.rarity === 'legendary' ? 'text-[#E60000]' :
                        achievement.rarity === 'epic' ? 'text-[#CCCCCC]' :
                        'text-[#999999]'
                      }`}>
                        {achievement.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Violations */}
            {player.violations.length > 0 && (
              <div className="bg-[#E60000]/10 border border-[#E60000]/50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle size={24} className="text-[#E60000]" />
                  <h3 className="text-lg font-bold text-white">Violation History</h3>
                </div>
                <div className="space-y-3">
                  {player.violations.map((violation, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="text-[#E60000] font-medium">{violation.type}</div>
                        <div className="text-[#CCCCCC] text-sm">{violation.reason}</div>
                      </div>
                      <div className="text-[#CCCCCC] text-sm">{new Date(violation.date).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Invites */}
            {player.invites.length > 0 && (
              <div className="bg-[#111111] border border-[#444444] rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Zap size={24} className="text-[#E60000]" />
                  <h3 className="text-lg font-bold text-white">Pending Clan Invites</h3>
                </div>
                <div className="space-y-4">
                  {player.invites.map((invite, index) => (
                    <div key={index} className="flex items-center justify-between bg-[#222222] rounded-lg p-4">
                      <div>
                        <div className="text-white font-bold">{invite.clanName}</div>
                        <div className="text-[#CCCCCC] text-sm">[{invite.clanTag}] • Expires {new Date(invite.expires).toLocaleDateString()}</div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAcceptInvite(invite.clanId)}
                          className="px-4 py-2 bg-[#E60000] hover:bg-[#cc0000] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <CheckCircle size={16} />
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeclineInvite(invite.clanId)}
                          className="px-4 py-2 bg-[#333333] hover:bg-[#444444] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <XCircle size={16} />
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'clans' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-[#111111] border border-[#444444] rounded-lg p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#CCCCCC]" />
                  <input
                    type="text"
                    placeholder="Search clans..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#222222] border border-[#444444] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000]"
                  />
                </div>
                
                <select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  className="bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000]"
                >
                  <option value="all">All Regions</option>
                  <option value="NA">North America</option>
                  <option value="EU">Europe</option>
                  <option value="AS">Asia</option>
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000]"
                >
                  <option value="all">All Types</option>
                  <option value="Competitive">Competitive</option>
                  <option value="Semi-Pro">Semi-Pro</option>
                  <option value="Casual">Casual</option>
                </select>
              </div>
            </div>

            {/* Clan List */}
            <div className="space-y-4">
              {filteredClans.map((clan) => (
                <div key={clan.id} className="bg-[#111111] border border-[#444444] hover:border-[#666666] rounded-lg p-6 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="text-xl font-bold text-white">{clan.name}</h3>
                        <span className="text-[#CCCCCC]">[{clan.tag}]</span>
                        {clan.verified && (
                          <Star size={16} className="text-[#E60000] fill-current" />
                        )}
                        <span className="px-2 py-1 rounded text-xs font-medium bg-[#E60000]/20 text-[#E60000]">
                          {clan.region}
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-[#333333] text-[#CCCCCC]">
                          {clan.type}
                        </span>
                      </div>
                      
                      <p className="text-[#CCCCCC] mb-3">{clan.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-[#CCCCCC]">
                        <span>ACS: <span className="text-[#E60000] font-bold">{clan.acs}</span></span>
                        <span>Members: <span className="text-white">{clan.members}/{clan.maxMembers}</span></span>
                        <span>Language: <span className="text-white">{clan.language}</span></span>
                        <span>Requirements: <span className="text-[#E60000]">{clan.requirements}</span></span>
                      </div>
                    </div>
                    
                    <div className="ml-6">
                      <button
                        onClick={() => handleApplyToClan(clan.id)}
                        className="px-6 py-3 bg-[#E60000] hover:bg-[#cc0000] text-white font-medium rounded-lg transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="bg-[#111111] border border-[#444444] rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-white mb-2">No Applications</h3>
            <p className="text-[#CCCCCC]">You haven't submitted any clan applications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}