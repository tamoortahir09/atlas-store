'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Trophy, Zap, ArrowRight, Star, Globe, Shield, Sword, Target, TrendingUp, Play } from 'lucide-react';
import { DitherBackground } from '../ui/animations';

const topGlobalTeams = [
  { 
    id: 1, 
    name: 'Elite Phantoms', 
    tag: 'EPH', 
    acs: 2847, 
    members: 28, 
    region: 'NA',
    logoIcon: Zap,
    logoColor: 'from-[#E60000] to-[#ff3333]',
    verified: true,
    trend: '+127'
  },
  { 
    id: 2, 
    name: 'Shadow Legion', 
    tag: 'SHD', 
    acs: 2743, 
    members: 32, 
    region: 'EU',
    logoIcon: Shield,
    logoColor: 'from-[#6B46C1] to-[#8B5CF6]',
    verified: true,
    trend: '+89'
  },
  { 
    id: 3, 
    name: 'Digital Hunters', 
    tag: 'DGH', 
    acs: 2698, 
    members: 25, 
    region: 'AS',
    logoIcon: Target,
    logoColor: 'from-[#059669] to-[#10B981]',
    verified: false,
    trend: '+156'
  },
  { 
    id: 4, 
    name: 'Neon Wolves', 
    tag: 'NWF', 
    acs: 2654, 
    members: 19, 
    region: 'NA',
    logoIcon: Sword,
    logoColor: 'from-[#DC2626] to-[#F87171]',
    verified: true,
    trend: '+43'
  },
  { 
    id: 5, 
    name: 'Cyber Storm', 
    tag: 'CYB', 
    acs: 2621, 
    members: 31, 
    region: 'EU',
    logoIcon: Zap,
    logoColor: 'from-[#0EA5E9] to-[#38BDF8]',
    verified: false,
    trend: '+78'
  }
];

const clanFeatures = [
  {
    icon: Users,
    title: 'Team Coordination',
    description: 'Advanced member management with role-based permissions and activity tracking.'
  },
  {
    icon: Trophy,
    title: 'Competitive Rankings',
    description: 'Climb the global leaderboards with ACS-based ranking system.'
  },
  {
    icon: Shield,
    title: 'Discord Integration',
    description: 'Seamless Discord bot integration for automated clan management.'
  },
  {
    icon: Zap,
    title: 'Exclusive Rewards',
    description: 'Unlock special customizations, badges, and in-game rewards.'
  }
];

export default function ClansWelcomePage() {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<'acs' | 'members' | 'trend'>('acs');
  const [animationPhase, setAnimationPhase] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleCreateTeam = () => {
    router.push('/clan/create');
  };

  const handleFindTeam = () => {
    router.push('/profile/1');
  };

  const handleViewTeam = (teamId: number) => {
    router.push(`/clan/${teamId}/manage`);
  };

  const handleViewLeaderboards = () => {
    router.push('/leaderboard');
  };

  const sortedTeams = [...topGlobalTeams].sort((a, b) => {
    switch (sortBy) {
      case 'acs':
        return b.acs - a.acs;
      case 'members':
        return b.members - a.members;
      case 'trend':
        return parseInt(b.trend.replace('+', '')) - parseInt(a.trend.replace('+', ''));
      default:
        return 0;
    }
  });

  return (
    <div className="bg-black relative">
      {/* Dither Background */}
      <DitherBackground />
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#E60000]/5 via-black/50 to-[#E60000]/3"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E60000]/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#E60000]/3 rounded-full blur-3xl animate-bounce"></div>
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
            {/* Left Content */}
            <div className="text-left">
              {/* Main Title */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-1 bg-[#E60000]"></div>
                  <span className="text-[#E60000] font-bold uppercase tracking-wider">Elite Clan System</span>
                </div>
                <h1 className="text-6xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-none">
                  ATLAS
                  <span className="block text-4xl lg:text-6xl text-[#E60000] mt-2">
                    CLANS
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-[#CCCCCC] max-w-2xl leading-relaxed mb-2">
                  Unite with elite players. Build unbreakable bonds.
                </p>
                <p className="text-2xl lg:text-3xl text-[#E60000] font-bold">
                  Dominate as one.
                </p>
              </div>

              {/* Features List */}
              <div className="mb-8 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-[#E60000] rounded-full"></div>
                  <span className="text-[#CCCCCC] text-lg">Advanced team coordination tools</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-[#E60000] rounded-full"></div>
                  <span className="text-[#CCCCCC] text-lg">Global competitive rankings</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-[#E60000] rounded-full"></div>
                  <span className="text-[#CCCCCC] text-lg">Exclusive rewards & customizations</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-[#E60000] rounded-full"></div>
                  <span className="text-[#CCCCCC] text-lg">Discord integration & automation</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleCreateTeam}
                  className="group relative px-8 py-4 bg-[#E60000] hover:bg-[#cc0000] text-white font-bold rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#E60000]/25"
                >
                  <span className="flex items-center gap-3">
                    <Users size={24} />
                    Create Elite Team
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>

                <button
                  onClick={handleFindTeam}
                  className="group relative px-8 py-4 bg-transparent border-2 border-[#CCCCCC] hover:border-[#E60000] hover:bg-[#E60000]/10 text-white font-bold rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center gap-3">
                    <Target size={24} />
                    Join the Elite
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 max-w-md">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#E60000] mb-1">2,847</div>
                  <div className="text-[#CCCCCC] text-sm">Active Teams</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#E60000] mb-1">47k+</div>
                  <div className="text-[#CCCCCC] text-sm">Elite Players</div>
                </div>
              </div>
            </div>

            {/* Right Video Section */}
            <div className="relative">
              <div className="relative aspect-[9/16] max-w-2xl mx-auto lg:max-w-none lg:aspect-video lg:h-[600px]">
                {/* Video Element */}
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  onLoadedData={() => setVideoLoaded(true)}
                  className="w-full h-full object-contain"
                >
                  <source src="/MainLoop.webm" type="video/webm" />
                  <source src="/Inspect.webm" type="video/webm" />
                  Your browser does not support the video tag.
                </video>

                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-[#E60000] rounded-full animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-[#E60000]/60 rounded-full animate-bounce"></div>
                <div className="absolute top-1/2 -left-12 w-6 h-6 bg-[#E60000]/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 Global Teams */}
      <div className="relative z-10 py-20 px-6 bg-gradient-to-b from-black/80 to-[#111111]/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-1 bg-[#E60000]"></div>
              <span className="text-[#E60000] font-bold uppercase tracking-wider">Global Rankings</span>
              <div className="w-12 h-1 bg-[#E60000]"></div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Elite <span className="text-[#E60000]">Leaderboard</span>
            </h2>
            <p className="text-xl text-[#CCCCCC] mb-8">The most dominant clans across all Atlas servers</p>
            
            {/* Sort Controls */}
            <div className="flex justify-center gap-4 mb-8">
              {[
                { key: 'acs', label: 'ACS Score', icon: Trophy },
                { key: 'members', label: 'Team Size', icon: Users },
                { key: 'trend', label: 'Growth', icon: TrendingUp }
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setSortBy(option.key as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    sortBy === option.key
                      ? 'bg-[#E60000] text-white shadow-lg shadow-[#E60000]/25'
                      : 'bg-[#111111] border border-[#444444] text-[#CCCCCC] hover:bg-[#222222] hover:border-[#666666]'
                  }`}
                >
                  <option.icon size={16} />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Podium for Top 3 */}
          <div className="mb-16">
            <div className="flex items-end justify-center gap-8 lg:gap-12 mb-8">
              {/* 2nd Place - Left */}
              <div
                onClick={() => handleViewTeam(sortedTeams[1].id)}
                className="group cursor-pointer flex flex-col items-center"
              >
                <div className="bg-[#111111]/80 border border-[#CCCCCC]/30 hover:border-[#CCCCCC]/50 hover:bg-[#111111] rounded-xl p-6 mb-4 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-[#CCCCCC]/10 backdrop-blur-sm w-64">
                  <div className="text-center">
                    <div className="mb-4 flex justify-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${sortedTeams[1].logoColor} rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg`}>
                        {(() => {
                          const IconComponent = sortedTeams[1].logoIcon;
                          return <IconComponent size={32} className="text-white" />;
                        })()}
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-[#CCCCCC] transition-colors">{sortedTeams[1].name}</h3>
                      {sortedTeams[1].verified && (
                        <Star size={16} className="text-[#CCCCCC] fill-current" />
                      )}
                    </div>
                    <div className="text-[#CCCCCC] font-mono mb-3">[{sortedTeams[1].tag}]</div>
                    <div className="text-2xl font-black text-white mb-2 group-hover:text-[#CCCCCC] transition-colors">{sortedTeams[1].acs}</div>
                    <div className="text-[#CCCCCC] text-sm mb-2">ACS Score</div>
                    <div className="flex items-center justify-center gap-2 text-[#CCCCCC] text-sm">
                      <Users size={14} />
                      {sortedTeams[1].members} members
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-t from-[#CCCCCC] to-[#999999] w-full h-24 rounded-t-lg flex items-center justify-center shadow-lg">
                  <div className="text-4xl font-black text-white">#2</div>
                </div>
              </div>

              {/* 1st Place - Center (Elevated) */}
              <div
                onClick={() => handleViewTeam(sortedTeams[0].id)}
                className="group cursor-pointer flex flex-col items-center"
              >
                <div className="bg-[#111111]/80 border-2 border-[#E60000]/50 hover:border-[#E60000] hover:bg-[#111111] rounded-xl p-8 mb-4 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-[#E60000]/25 backdrop-blur-sm w-72 relative">
                  {/* Crown */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-8 bg-gradient-to-t from-[#E60000] to-[#ff3333] rounded-t-lg flex items-center justify-center shadow-lg">
                      <Trophy size={20} className="text-white" />
                    </div>
                  </div>
                  <div className="text-center pt-2">
                    <div className="mb-4 flex justify-center">
                      <div className={`w-20 h-20 bg-gradient-to-br ${sortedTeams[0].logoColor} rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg`}>
                        {(() => {
                          const IconComponent = sortedTeams[0].logoIcon;
                          return <IconComponent size={40} className="text-white" />;
                        })()}
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold text-white group-hover:text-[#E60000] transition-colors">{sortedTeams[0].name}</h3>
                      {sortedTeams[0].verified && (
                        <Star size={18} className="text-[#695b5b] fill-current" />
                      )}
                    </div>
                    <div className="text-[#CCCCCC] font-mono mb-3">[{sortedTeams[0].tag}]</div>
                    <div className="text-3xl font-black text-white mb-2 group-hover:text-[#E60000] transition-colors">{sortedTeams[0].acs}</div>
                    <div className="text-[#CCCCCC] text-sm mb-2">ACS Score</div>
                    <div className="flex items-center justify-center gap-2 text-[#CCCCCC] text-sm">
                      <Users size={14} />
                      {sortedTeams[0].members} members
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-t from-[#E60000] to-[#ff3333] w-full h-32 rounded-t-lg flex items-center justify-center shadow-lg shadow-[#E60000]/25">
                  <div className="text-4xl font-black text-white">#1</div>
                </div>
              </div>

              {/* 3rd Place - Right */}
              <div
                onClick={() => handleViewTeam(sortedTeams[2].id)}
                className="group cursor-pointer flex flex-col items-center"
              >
                <div className="bg-[#111111]/80 border border-[#E60000]/30 hover:border-[#E60000]/50 hover:bg-[#111111] rounded-xl p-6 mb-4 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-[#E60000]/10 backdrop-blur-sm w-64">
                  <div className="text-center">
                    <div className="mb-4 flex justify-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${sortedTeams[2].logoColor} rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg`}>
                        {(() => {
                          const IconComponent = sortedTeams[2].logoIcon;
                          return <IconComponent size={32} className="text-white" />;
                        })()}
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-[#E60000] transition-colors">{sortedTeams[2].name}</h3>
                      {sortedTeams[2].verified && (
                        <Star size={16} className="text-[#E60000] fill-current" />
                      )}
                    </div>
                    <div className="text-[#CCCCCC] font-mono mb-3">[{sortedTeams[2].tag}]</div>
                    <div className="text-2xl font-black text-white mb-2 group-hover:text-[#E60000] transition-colors">{sortedTeams[2].acs}</div>
                    <div className="text-[#CCCCCC] text-sm mb-2">ACS Score</div>
                    <div className="flex items-center justify-center gap-2 text-[#CCCCCC] text-sm">
                      <Users size={14} />
                      {sortedTeams[2].members} members
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-t from-[#E60000]/70 to-[#cc0000]/70 w-full h-20 rounded-t-lg flex items-center justify-center shadow-lg">
                  <div className="text-4xl font-black text-white">#3</div>
                </div>
              </div>
            </div>
          </div>

          {/* 4th and 5th Place */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Runner-ups</h3>
              <div className="w-20 h-1 bg-[#E60000] mx-auto"></div>
            </div>
            {sortedTeams.slice(3, 5).map((team, index) => (
              <div
                key={team.id}
                onClick={() => handleViewTeam(team.id)}
                className="group bg-[#111111]/80 border border-[#444444] hover:border-[#E60000]/50 hover:bg-[#111111] rounded-xl p-6 cursor-pointer transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[#E60000]/10 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="text-3xl font-black w-12 text-center text-[#666666]">
                      #{index + 4}
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className={`w-12 h-12 bg-gradient-to-br ${team.logoColor} rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg`}>
                        {(() => {
                          const IconComponent = team.logoIcon;
                          return <IconComponent size={24} className="text-white" />;
                        })()}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-white group-hover:text-[#E60000] transition-colors">{team.name}</h3>
                        <span className="text-[#CCCCCC] font-mono">[{team.tag}]</span>
                        {team.verified && (
                          <Star size={16} className="text-[#E60000] fill-current" />
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          team.region === 'NA' ? 'bg-[#E60000]/20 text-[#E60000] border border-[#E60000]/30' :
                          team.region === 'EU' ? 'bg-[#CCCCCC]/20 text-[#CCCCCC] border border-[#CCCCCC]/30' :
                          'bg-[#E60000]/10 text-[#E60000] border border-[#E60000]/20'
                        }`}>
                          {team.region}
                        </span>
                      </div>
                      <div className="text-[#CCCCCC] flex items-center gap-2">
                        <Users size={14} />
                        {team.members} active members
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-black text-white mb-1 group-hover:text-[#E60000] transition-colors">{team.acs}</div>
                    <div className="text-[#CCCCCC] text-sm mb-1">ACS Score</div>
                    <div className="flex items-center justify-end gap-1 text-[#E60000] text-sm font-medium">
                      <TrendingUp size={14} />
                      {team.trend}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={handleViewLeaderboards}
              className="group px-8 py-4 bg-gradient-to-r from-[#E60000] to-[#cc0000] hover:from-[#cc0000] hover:to-[#b30000] text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#E60000]/25"
            >
              <span className="flex items-center gap-3">
                <Trophy size={20} />
                View Full Leaderboards
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* How Clans Work Infographic */}
      <div className="relative z-10 py-20 px-6 bg-gradient-to-b from-[#111111]/30 to-black/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-1 bg-[#E60000]"></div>
              <span className="text-[#E60000] font-bold uppercase tracking-wider">System Overview</span>
              <div className="w-12 h-1 bg-[#E60000]"></div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              How <span className="text-[#E60000]">Clans Work</span>
            </h2>
            <p className="text-xl text-[#CCCCCC]">Seamless integration across all Atlas platforms</p>
          </div>

          {/* Flow Diagram */}
          <div className="relative mb-16">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
              {/* Discord */}
              <div className="flex flex-col items-center group">
                <div className="w-28 h-28 bg-gradient-to-br from-[#E60000] to-[#cc0000] rounded-2xl flex items-center justify-center mb-4 transform hover:scale-110 transition-transform shadow-lg shadow-[#E60000]/25">
                  <Users size={44} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#E60000] transition-colors">Discord</h3>
                <p className="text-[#CCCCCC] text-center max-w-xs">
                  Auto-created channels, role sync, and bot integration
                </p>
              </div>

              {/* Arrow */}
              <div className="hidden lg:block">
                <ArrowRight size={32} className="text-[#E60000] animate-pulse" />
              </div>
              <div className="lg:hidden">
                <div className="w-px h-12 bg-[#E60000] animate-pulse"></div>
              </div>

              {/* Game */}
              <div className="flex flex-col items-center group">
                <div className="w-28 h-28 bg-gradient-to-br from-[#E60000] to-[#cc0000] rounded-2xl flex items-center justify-center mb-4 transform hover:scale-110 transition-transform shadow-lg shadow-[#E60000]/25">
                  <Sword size={44} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#E60000] transition-colors">Game</h3>
                <p className="text-[#CCCCCC] text-center max-w-xs">
                  Real-time stats tracking, events, and competitive matches
                </p>
              </div>

              {/* Arrow */}
              <div className="hidden lg:block">
                <ArrowRight size={32} className="text-[#E60000] animate-pulse" />
              </div>
              <div className="lg:hidden">
                <div className="w-px h-12 bg-[#E60000] animate-pulse"></div>
              </div>

              {/* Clan Portal */}
              <div className="flex flex-col items-center group">
                <div className="w-28 h-28 bg-gradient-to-br from-[#E60000] to-[#cc0000] rounded-2xl flex items-center justify-center mb-4 transform hover:scale-110 transition-transform shadow-lg shadow-[#E60000]/25">
                  <Globe size={44} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#E60000] transition-colors">Portal</h3>
                <p className="text-[#CCCCCC] text-center max-w-xs">
                  Management dashboard, leaderboards, and rewards
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {clanFeatures.map((feature, index) => (
              <div
                key={index}
                className="group bg-[#111111]/80 border border-[#444444] hover:border-[#E60000]/50 hover:bg-[#111111] rounded-xl p-6 text-center transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-[#E60000]/10 backdrop-blur-sm"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#E60000] to-[#cc0000] rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-[#E60000]/25">
                  <feature.icon size={32} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#E60000] transition-colors">{feature.title}</h3>
                <p className="text-[#CCCCCC] text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 px-6 bg-gradient-to-t from-[#111111]/30 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-12 h-1 bg-[#E60000]"></div>
              <span className="text-[#E60000] font-bold uppercase tracking-wider">Join the Elite</span>
              <div className="w-12 h-1 bg-[#E60000]"></div>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Ready to <span className="text-[#E60000]">Dominate</span>?
            </h2>
            <p className="text-xl lg:text-2xl text-[#CCCCCC] mb-8 leading-relaxed">
              Join thousands of elite players competing in the ultimate clan warfare experience.
              <span className="block mt-2 text-[#E60000] font-semibold">
                Your legacy starts here.
              </span>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={handleCreateTeam}
              className="group px-10 py-5 bg-gradient-to-r from-[#E60000] to-[#cc0000] hover:from-[#cc0000] hover:to-[#b30000] text-white font-bold rounded-xl text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#E60000]/25"
            >
              <span className="flex items-center gap-3">
                <Users size={24} />
                Start Your Legacy
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button
              onClick={handleFindTeam}
              className="group px-10 py-5 bg-transparent border-2 border-[#E60000] hover:bg-[#E60000] text-[#E60000] hover:text-white font-bold rounded-xl text-xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center gap-3">
                <Target size={24} />
                Explore Teams
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}