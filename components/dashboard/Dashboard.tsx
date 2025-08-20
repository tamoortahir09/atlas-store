'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  Users, 
  Trophy, 
  Medal,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  ExternalLink,
  Bell,
  Search,
  User,
  ChevronDown,
  Shield,
  Map,
  Sword
} from 'lucide-react';

// Import dashboard components
import ClanManagement from './ClanManagement';
import ClanRankings from './ClanRankings';
import PlayerRankings from './PlayerRankings';
import TerritoryControl from './TerritoryControl';
import ClanWars from './ClanWars';
import Economy from './Economy';
import Events from './Events';
import Analytics from './Analytics';
import DashboardSettings from './DashboardSettings';

interface DashboardProps {
  initialPage?: string;
}

const sidebarItems = [
  { id: 'home', label: 'Dashboard', icon: Home },
  { id: 'clan', label: 'My Clan', icon: Users },
  { id: 'clan-rankings', label: 'Clan Rankings', icon: Trophy },
  { id: 'player-rankings', label: 'Player Rankings', icon: Medal },
  { id: 'territory', label: 'Territory Control', icon: Map },
  { id: 'wars', label: 'Clan Wars', icon: Sword },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'economy', label: 'Economy', icon: DollarSign },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Dashboard({ initialPage = 'home' }: DashboardProps) {
  const router = useRouter();
  const [activePage, setActivePage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState('');

  // Update activePage when initialPage changes
  useEffect(() => {
    setActivePage(initialPage);
  }, [initialPage]);

  const handleNavigation = (pageId: string) => {
    setActivePage(pageId);
    if (pageId === 'home') {
      router.push('/dashboard');
    } else {
      router.push(`/dashboard/${pageId}`);
    }
  };

  const handleExitDashboard = () => {
    router.push('/clans');
  };

  const renderPageContent = () => {
    switch (activePage) {
      case 'home':
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-[#111111] border border-[#444444] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">Welcome back, PlayerOne</h1>
                  <p className="text-[#CCCCCC]">Member of <span className="text-[#E60000] font-semibold">The Ravens</span> • Last seen 2 hours ago</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-[#E60000]">
                    <Shield size={16} />
                    <span className="text-sm">5 recent activities</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#E60000]">
                    <Bell size={16} />
                    <span className="text-sm">3 new notifications</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#111111] border border-[#444444] rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[#CCCCCC] text-sm font-medium">ACS Score</h3>
                  <Trophy size={16} className="text-[#E60000]" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">1847</div>
                <div className="text-xs text-[#E60000]">+23 this week</div>
              </div>

              <div className="bg-[#111111] border border-[#444444] rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[#CCCCCC] text-sm font-medium">Clan Rank</h3>
                  <Medal size={16} className="text-[#E60000]" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">#1</div>
                <div className="text-xs text-[#E60000]">Global ranking</div>
              </div>

              <div className="bg-[#111111] border border-[#444444] rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[#CCCCCC] text-sm font-medium">Members</h3>
                  <Users size={16} className="text-[#E60000]" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">29/50</div>
                <div className="text-xs text-[#E60000]">Clan members</div>
              </div>

              <div className="bg-[#111111] border border-[#444444] rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[#CCCCCC] text-sm font-medium">Recent Wars</h3>
                  <BarChart3 size={16} className="text-[#E60000]" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">12</div>
                <div className="text-xs text-[#E60000]">Recent wars</div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="bg-[#111111] border border-[#444444] rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                  <button className="text-[#E60000] text-sm hover:text-[#cc0000]">View All</button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#E60000] rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-white text-sm">You earned the 'Raid Leader' achievement</div>
                      <div className="text-[#CCCCCC] text-xs">6 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#E60000] rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-white text-sm">Elite Raiders captured monument base</div>
                      <div className="text-[#CCCCCC] text-xs">8 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#E60000] rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-white text-sm">Clan Leader joined your clan</div>
                      <div className="text-[#CCCCCC] text-xs">1 day ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#E60000] rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-white text-sm">War declared against Shadow Legion</div>
                      <div className="text-[#CCCCCC] text-xs">2 days ago</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-[#111111] border border-[#444444] rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">Upcoming Events</h3>
                  <button className="text-[#E60000] text-sm hover:text-[#cc0000]">View All</button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#222222] rounded-lg">
                    <div>
                      <div className="text-white font-medium">Clan War vs Shadow Legion</div>
                      <div className="text-[#CCCCCC] text-sm">Arena PvP event</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#E60000] text-sm font-medium">WAR</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#222222] rounded-lg">
                    <div>
                      <div className="text-white font-medium">Weekly Raid Night</div>
                      <div className="text-[#CCCCCC] text-sm">Server-wide raid event</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#E60000] text-sm font-medium">RAID</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#222222] rounded-lg">
                    <div>
                      <div className="text-white font-medium">Tournament Finals</div>
                      <div className="text-[#CCCCCC] text-sm">Cross-server competitive event</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#E60000] text-sm font-medium">TOURNAMENT</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Clan Performers */}
            <div className="bg-[#111111] border border-[#444444] rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Top Clan Performers</h3>
                <button className="text-[#E60000] text-sm hover:text-[#cc0000]">View All Players</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-4 p-4 bg-[#222222] rounded-lg">
                  <div className="w-10 h-10 bg-[#E60000] rounded-full flex items-center justify-center text-white font-bold">
                    👑
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">RaidKingCT</div>
                    <div className="text-[#CCCCCC] text-sm">Leader</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#E60000] font-bold">2847</div>
                    <div className="text-[#CCCCCC] text-xs">ACS</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[#222222] rounded-lg">
                  <div className="w-10 h-10 bg-[#CCCCCC] rounded-full flex items-center justify-center text-white font-bold">
                    🥈
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">SniperElite</div>
                    <div className="text-[#CCCCCC] text-sm">Officer</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#E60000] font-bold">2645</div>
                    <div className="text-[#CCCCCC] text-xs">ACS</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[#222222] rounded-lg">
                  <div className="w-10 h-10 bg-[#E60000]/70 rounded-full flex items-center justify-center text-white font-bold">
                    🥉
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">PlayerGreen34</div>
                    <div className="text-[#CCCCCC] text-sm">Officer</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#E60000] font-bold">2341</div>
                    <div className="text-[#CCCCCC] text-xs">ACS</div>
                  </div>
                </div>
              </div>
                         </div>

             {/* Quick Actions */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               <button
                 onClick={() => handleNavigation('clan')}
                 className="bg-[#E60000] hover:bg-[#cc0000] text-white p-4 rounded-lg font-medium transition-colors"
               >
                 Manage Clan
               </button>
               <button
                 onClick={() => handleNavigation('wars')}
                 className="bg-[#333333] hover:bg-[#444444] text-white p-4 rounded-lg font-medium transition-colors"
               >
                 View Wars
               </button>
               <button
                 onClick={() => handleNavigation('events')}
                 className="bg-[#333333] hover:bg-[#444444] text-white p-4 rounded-lg font-medium transition-colors"
               >
                 Upcoming Events
               </button>
               <button
                 onClick={() => handleNavigation('analytics')}
                 className="bg-[#333333] hover:bg-[#444444] text-white p-4 rounded-lg font-medium transition-colors"
               >
                 View Analytics
               </button>
             </div>
           </div>
         );
      case 'clan':
        return <ClanManagement />;
      case 'clan-rankings':
        return <ClanRankings />;
      case 'player-rankings':
        return <PlayerRankings />;
      case 'territory':
        return <TerritoryControl />;
      case 'wars':
        return <ClanWars />;
      case 'economy':
        return <Economy />;
      case 'events':
        return <Events />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <DashboardSettings />;
      default:
        return (
          <div className="bg-[#111111] border border-[#444444] rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">🚧</div>
            <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
            <p className="text-[#CCCCCC]">This section is under development</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#111111] border-r border-[#444444] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#444444]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#E60000] rounded-lg flex items-center justify-center">
                <Shield size={16} className="text-white" />
              </div>
              <span className="text-white font-bold">Atlas Clans</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-[#E60000] text-sm font-medium">PlayerOne#24</div>
            <div className="text-[#CCCCCC] text-xs">The Ravens • Officer</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activePage === item.id
                    ? 'bg-[#E60000] text-white'
                    : 'text-[#CCCCCC] hover:text-white hover:bg-[#222222]'
                }`}
              >
                <item.icon size={16} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#444444]">
          <button
            onClick={handleExitDashboard}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[#CCCCCC] hover:text-white hover:bg-[#222222] transition-colors"
          >
            <ExternalLink size={16} />
            <span className="text-sm">Exit Dashboard</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-[#111111] border-b border-[#444444] px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">
              {sidebarItems.find(item => item.id === activePage)?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#CCCCCC]" />
                <input
                  type="text"
                  placeholder="Search clans, players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#222222] border border-[#444444] rounded-lg pl-10 pr-4 py-2 text-white placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000] w-64"
                />
              </div>
              <button className="relative p-2 text-[#CCCCCC] hover:text-white transition-colors">
                <Bell size={20} />
                <div className="absolute top-1 right-1 w-2 h-2 bg-[#E60000] rounded-full"></div>
              </button>
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 bg-[#E60000] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  P
                </div>
                <ChevronDown size={16} className="text-[#CCCCCC]" />
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto">
          {renderPageContent()}
        </div>
      </div>
    </div>
  );
}