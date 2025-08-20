'use client';

import { useState } from 'react';
import { Users, Crown, Settings, UserPlus, UserMinus, Shield, Edit, Save, Eye, EyeOff, Upload, Gem, Mail, Globe, Calendar, Clock, Target, AlertCircle, CheckCircle, XCircle, Plus, Minus, User } from 'lucide-react';

const mockClanData = {
  name: 'Elite Raiders',
  tag: 'RAID',
  description: 'Elite PvP clan dominating Atlas servers',
  longDescription: 'Elite Raiders is a premier competitive clan focused on dominating the Atlas Rust servers through superior tactics, coordination, and skill.',
  banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=300&fit=crop',
  recruiting: true,
  isPublic: true,
  website: 'https://eliteraiders.gg',
  discord: 'https://discord.gg/eliteraiders',
  founded: '2024-01-15',
  leader: 'RaidKing47',
  elo: 2847,
  rank: 1,
  members: 28,
  maxMembers: 50,
  wins: 147,
  losses: 23,
  requirements: {
    minElo: 1500,
    minHours: 100,
    ageRestriction: '18+',
    region: 'Global'
  }
};

const mockMembers = [
  { 
    id: 1, 
    username: 'RaidKing47', 
    role: 'Leader', 
    elo: 3142, 
    status: 'online', 
    joinDate: '2024-01-15', 
    lastActive: '2 min ago',
    wipeAvailability: 'confirmed',
    preferredRole: 'Leader',
    hours: 2847
  },
  { 
    id: 2, 
    username: 'ViceLeader', 
    role: 'Officer', 
    elo: 2987, 
    status: 'online', 
    joinDate: '2024-01-16', 
    lastActive: '15 min ago',
    wipeAvailability: 'confirmed',
    preferredRole: 'Support',
    hours: 2156
  },
  { 
    id: 3, 
    username: 'TacticalOps', 
    role: 'Officer', 
    elo: 2891, 
    status: 'away', 
    joinDate: '2024-01-20', 
    lastActive: '2 hours ago',
    wipeAvailability: 'maybe',
    preferredRole: 'Strategist',
    hours: 1934
  },
  { 
    id: 4, 
    username: 'PlayerOne#1234', 
    role: 'Officer', 
    elo: 1847, 
    status: 'online', 
    joinDate: '2024-02-01', 
    lastActive: 'Now',
    wipeAvailability: 'confirmed',
    preferredRole: 'Builder',
    hours: 1234
  },
  { 
    id: 5, 
    username: 'DeathDealer', 
    role: 'Member', 
    elo: 2756, 
    status: 'online', 
    joinDate: '2024-02-01', 
    lastActive: '5 min ago',
    wipeAvailability: 'confirmed',
    preferredRole: 'PvP',
    hours: 1789
  },
  { 
    id: 6, 
    username: 'BuildMaster', 
    role: 'Member', 
    elo: 2234, 
    status: 'offline', 
    joinDate: '2024-02-15', 
    lastActive: '1 day ago',
    wipeAvailability: 'unavailable',
    preferredRole: 'Builder',
    hours: 987
  },
  { 
    id: 7, 
    username: 'FarmBot2024', 
    role: 'Member', 
    elo: 1456, 
    status: 'online', 
    joinDate: '2024-03-01', 
    lastActive: '30 min ago',
    wipeAvailability: 'maybe',
    preferredRole: 'Farmer',
    hours: 2345
  },
  { 
    id: 8, 
    username: 'ExplosiveExpert', 
    role: 'Member', 
    elo: 2567, 
    status: 'away', 
    joinDate: '2024-02-28', 
    lastActive: '3 hours ago',
    wipeAvailability: 'confirmed',
    preferredRole: 'Raider',
    hours: 1567
  }
];

const mockJoinRequests = [
  { id: 1, username: 'NewPlayer123', elo: 1876, hours: 156, appliedDate: '2024-06-20', message: 'I want to join your clan to improve my PvP skills.' },
  { id: 2, username: 'RustVeteran', elo: 2145, hours: 834, appliedDate: '2024-06-19', message: 'Experienced player looking for an active clan.' }
];

const mockWipeInfo = {
  wipeDate: '2024-06-27T18:00:00Z',
  serverName: 'Atlas Rust Main',
  maxTeamSize: 8,
  estimatedPlayers: 200,
  mapSize: '4000x4000',
  wipeCycle: 'Monthly'
};

const wipeRoles = [
  { id: 'leader', name: 'Team Leader', icon: Crown, description: 'Overall strategy and coordination', limit: 1 },
  { id: 'pvp', name: 'PvP Specialist', icon: Target, description: 'Combat and raid defense', limit: 3 },
  { id: 'builder', name: 'Base Builder', icon: Settings, description: 'Base design and construction', limit: 2 },
  { id: 'farmer', name: 'Resource Farmer', icon: Gem, description: 'Resource gathering and management', limit: 2 },
  { id: 'raider', name: 'Raider', icon: Shield, description: 'Offensive operations and raids', limit: 2 },
  { id: 'support', name: 'Support', icon: Users, description: 'Logistics and team support', limit: 2 }
];

export default function ClanManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [clanSettings, setClanSettings] = useState(mockClanData);
  const [isEditing, setIsEditing] = useState(false);
  const [wipeTeam, setWipeTeam] = useState<Array<{memberId: number, roleId: string}>>([
    { memberId: 1, roleId: 'leader' },
    { memberId: 2, roleId: 'support' },
    { memberId: 4, roleId: 'builder' },
    { memberId: 5, roleId: 'pvp' },
    { memberId: 8, roleId: 'raider' }
  ]);

  const handleApproveRequest = (requestId: number) => {
    console.log('Approving join request:', requestId);
  };

  const handleRejectRequest = (requestId: number) => {
    console.log('Rejecting join request:', requestId);
  };

  const handleKickMember = (memberId: number) => {
    if (confirm('Are you sure you want to kick this member?')) {
      console.log('Kicking member:', memberId);
    }
  };

  const handlePromoteMember = (memberId: number) => {
    console.log('Promoting member:', memberId);
  };

  const handleSaveSettings = () => {
    setIsEditing(false);
    console.log('Saving clan settings:', clanSettings);
  };

  const handleAddToWipeTeam = (memberId: number, roleId: string) => {
    const role = wipeRoles.find(r => r.id === roleId);
    const currentRoleCount = wipeTeam.filter(t => t.roleId === roleId).length;
    
    if (role && currentRoleCount < role.limit) {
      // Remove member from team if already assigned
      const newTeam = wipeTeam.filter(t => t.memberId !== memberId);
      // Add with new role
      setWipeTeam([...newTeam, { memberId, roleId }]);
    }
  };

  const handleRemoveFromWipeTeam = (memberId: number) => {
    setWipeTeam(wipeTeam.filter(t => t.memberId !== memberId));
  };

  const getTimeUntilWipe = () => {
    const now = new Date();
    const wipeDate = new Date(mockWipeInfo.wipeDate);
    const timeDiff = wipeDate.getTime() - now.getTime();
    
    if (timeDiff <= 0) return 'Wipe has started!';
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  const getMemberInTeam = (memberId: number) => {
    return wipeTeam.find(t => t.memberId === memberId);
  };

  const getRoleAssignments = (roleId: string) => {
    return wipeTeam.filter(t => t.roleId === roleId);
  };

  const availableMembers = mockMembers.filter(m => m.wipeAvailability === 'confirmed');
  const maybeMembers = mockMembers.filter(m => m.wipeAvailability === 'maybe');
  const unavailableMembers = mockMembers.filter(m => m.wipeAvailability === 'unavailable');

  return (
    <div className="space-y-6">
      {/* Clan Header */}
      <div className="glass-panel rounded-lg overflow-hidden">
        <div className="relative h-40 bg-gradient-to-r from-[#CC0000]/20 to-[#CC0000]/5">
          <img 
            src={clanSettings.banner} 
            alt={`${clanSettings.name} banner`}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-end justify-between">
              <div className="flex items-end gap-4">
                <div className="w-12 h-12 bg-[#CC0000]/20 rounded-lg flex items-center justify-center">
                  <Shield size={24} className="text-[#CC0000]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-white text-2xl font-bold">{clanSettings.name}</h1>
                    <span className="text-white/70">[{clanSettings.tag}]</span>
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Shield size={12} className="text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <span>Rank #{clanSettings.rank}</span>
                    <span>ELO {clanSettings.elo}</span>
                    <span>{clanSettings.members}/{clanSettings.maxMembers} Members</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 glass-panel p-1 rounded-lg overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Eye },
          { id: 'members', label: 'Members', icon: Users },
          { id: 'wipe-team', label: 'Wipe Team', icon: Target },
          { id: 'requests', label: 'Join Requests', icon: UserPlus },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#CC0000]/20 text-white'
                : 'text-white/70 hover:text-white hover:bg-glass-hover'
            }`}
          >
            <tab.icon size={16} />
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Clan Stats */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-panel rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#CC0000] mb-1">{clanSettings.wins}</div>
                <div className="text-white/70 text-sm">Wins</div>
              </div>
              <div className="glass-panel rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-400 mb-1">{clanSettings.losses}</div>
                <div className="text-white/70 text-sm">Losses</div>
              </div>
              <div className="glass-panel rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">{Math.round((clanSettings.wins / (clanSettings.wins + clanSettings.losses)) * 100)}%</div>
                <div className="text-white/70 text-sm">Win Rate</div>
              </div>
              <div className="glass-panel rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">{mockMembers.filter(m => m.status === 'online').length}</div>
                <div className="text-white/70 text-sm">Online</div>
              </div>
            </div>

            <div className="glass-panel rounded-lg p-6">
              <h3 className="text-white font-bold text-lg mb-4">About</h3>
              <p className="text-white/70 mb-4">{clanSettings.longDescription}</p>
              <div className="text-white/50 text-sm">Founded {new Date(clanSettings.founded).toLocaleDateString()}</div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="glass-panel rounded-lg p-6">
              <h4 className="text-white font-bold mb-4">Leadership</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Crown size={20} className="text-yellow-400" />
                  <div>
                    <div className="text-white font-medium">{clanSettings.leader}</div>
                    <div className="text-white/70 text-sm">Clan Leader</div>
                  </div>
                </div>
                {mockMembers.filter(m => m.role === 'Officer').map((officer) => (
                  <div key={officer.id} className="flex items-center gap-3">
                    <Shield size={20} className="text-blue-400" />
                    <div>
                      <div className="text-white font-medium">{officer.username}</div>
                      <div className="text-white/70 text-sm">Officer</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-lg p-6">
              <h4 className="text-white font-bold mb-4">Links</h4>
              <div className="space-y-3">
                {clanSettings.website && (
                  <a href={clanSettings.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <Globe size={16} />
                    <span>Website</span>
                  </a>
                )}
                {clanSettings.discord && (
                  <a href={clanSettings.discord} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <Users size={16} />
                    <span>Discord</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="glass-panel rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-xl font-bold">Manage Members ({mockMembers.length})</h3>
              <button className="px-4 py-2 bg-[#CC0000]/20 hover:bg-[#CC0000]/30 text-white rounded-lg transition-colors flex items-center gap-2">
                <UserPlus size={16} />
                Invite Member
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/20">
                <tr>
                  <th className="text-left p-4 text-white/70 font-medium">Member</th>
                  <th className="text-left p-4 text-white/70 font-medium">Role</th>
                  <th className="text-left p-4 text-white/70 font-medium">ELO</th>
                  <th className="text-left p-4 text-white/70 font-medium">Wipe Status</th>
                  <th className="text-left p-4 text-white/70 font-medium">Last Active</th>
                  <th className="text-left p-4 text-white/70 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-glass-hover transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          member.status === 'online' ? 'bg-green-400' :
                          member.status === 'away' ? 'bg-yellow-400' :
                          'bg-white/30'
                        }`}></div>
                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                          <User size={14} className="text-white/70" />
                        </div>
                        <div className="text-white font-medium">{member.username}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`px-2 py-1 rounded text-xs font-medium inline-block ${
                        member.role === 'Leader' ? 'bg-yellow-500/20 text-yellow-400' :
                        member.role === 'Officer' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-white/10 text-white/70'
                      }`}>
                        {member.role}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-[#CC0000] font-bold">{member.elo}</div>
                    </td>
                    <td className="p-4">
                      <div className={`px-2 py-1 rounded text-xs font-medium inline-block ${
                        member.wipeAvailability === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                        member.wipeAvailability === 'maybe' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {member.wipeAvailability === 'confirmed' ? 'Playing' :
                         member.wipeAvailability === 'maybe' ? 'Maybe' :
                         'Not Playing'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-white/70">{member.lastActive}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {member.role !== 'Leader' && member.username !== 'PlayerOne#1234' && (
                          <>
                            <button
                              onClick={() => handlePromoteMember(member.id)}
                              className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-sm transition-colors flex items-center gap-1"
                            >
                              <Crown size={12} />
                              Promote
                            </button>
                            <button
                              onClick={() => handleKickMember(member.id)}
                              className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm transition-colors flex items-center gap-1"
                            >
                              <UserMinus size={12} />
                              Kick
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'wipe-team' && (
        <div className="space-y-6">
          {/* Wipe Information Header */}
          <div className="bg-gradient-to-r from-[#CC0000]/10 to-[#CC0000]/5 glass-panel rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white text-xl font-bold mb-2">Next Wipe: {mockWipeInfo.serverName}</h3>
                <div className="flex items-center gap-6 text-sm text-white/70">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-[#CC0000]" />
                    <span>{new Date(mockWipeInfo.wipeDate).toLocaleDateString()} at {new Date(mockWipeInfo.wipeDate).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-[#CC0000]" />
                    <span>{getTimeUntilWipe()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-[#CC0000]" />
                    <span>Max Team: {mockWipeInfo.maxTeamSize}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#CC0000]">{wipeTeam.length}/{mockWipeInfo.maxTeamSize}</div>
                <div className="text-white/70 text-sm">Team Members</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Wipe Team */}
            <div className="glass-panel rounded-lg">
              <div className="p-6">
                <h3 className="text-white text-xl font-bold mb-4">Current Wipe Team</h3>
                <p className="text-white/70 mb-6">Members selected for the upcoming wipe</p>

                {/* Role-based Team Display */}
                <div className="space-y-4">
                  {wipeRoles.map((role) => {
                    const assignments = getRoleAssignments(role.id);
                    const IconComponent = role.icon;
                    return (
                      <div key={role.id} className="bg-black/20 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <IconComponent size={20} className="text-[#CC0000]" />
                            <div>
                              <div className="text-white font-medium">{role.name}</div>
                              <div className="text-white/50 text-sm">{role.description}</div>
                            </div>
                          </div>
                          <div className="text-sm text-white/70">
                            {assignments.length}/{role.limit}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {assignments.map((assignment) => {
                            const member = mockMembers.find(m => m.id === assignment.memberId);
                            if (!member) return null;
                            
                            return (
                              <div key={assignment.memberId} className="flex items-center justify-between bg-white/5 rounded p-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                                    <User size={14} className="text-white/70" />
                                  </div>
                                  <div>
                                    <div className="text-white font-medium">{member.username}</div>
                                    <div className="text-white/70 text-sm">ELO {member.elo} • {member.hours}h</div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleRemoveFromWipeTeam(member.id)}
                                  className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded transition-colors"
                                >
                                  <Minus size={14} className="text-red-400" />
                                </button>
                              </div>
                            );
                          })}
                          
                          {assignments.length === 0 && (
                            <div className="text-center py-4 text-white/50 text-sm">
                              No members assigned to this role
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Available Members */}
            <div className="space-y-6">
              {/* Confirmed Members */}
              <div className="glass-panel rounded-lg">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle size={16} className="text-green-400" />
                    <h4 className="text-white font-bold">Confirmed ({availableMembers.length})</h4>
                  </div>
                </div>
                <div className="px-4 pb-4 space-y-3 max-h-64 overflow-y-auto">
                  {availableMembers.map((member) => {
                    const inTeam = getMemberInTeam(member.id);
                    return (
                      <div key={member.id} className={`flex items-center justify-between p-3 rounded transition-colors ${
                        inTeam ? 'bg-[#CC0000]/20' : 'bg-black/20 hover:bg-black/30'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                            <User size={14} className="text-white/70" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{member.username}</div>
                            <div className="text-white/70 text-sm">
                              ELO {member.elo} • Prefers {member.preferredRole}
                            </div>
                          </div>
                        </div>
                        
                        {inTeam ? (
                          <div className="flex items-center gap-2">
                            <div className="text-[#CC0000] text-sm font-medium">
                              {wipeRoles.find(r => r.id === inTeam.roleId)?.name}
                            </div>
                            <button
                              onClick={() => handleRemoveFromWipeTeam(member.id)}
                              className="p-1 bg-red-500/20 hover:bg-red-500/30 rounded transition-colors"
                            >
                              <Minus size={12} className="text-red-400" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-1">
                            {wipeRoles.map((role) => {
                              const currentCount = getRoleAssignments(role.id).length;
                              const canAdd = currentCount < role.limit && wipeTeam.length < mockWipeInfo.maxTeamSize;
                              const IconComponent = role.icon;
                              
                              return (
                                <button
                                  key={role.id}
                                  onClick={() => handleAddToWipeTeam(member.id, role.id)}
                                  disabled={!canAdd}
                                  className={`p-2 rounded transition-colors text-sm ${
                                    canAdd 
                                      ? 'bg-white/10 hover:bg-[#CC0000]/20 text-white/70 hover:text-[#CC0000]' 
                                      : 'bg-white/5 text-white/30 cursor-not-allowed'
                                  }`}
                                  title={`Add as ${role.name}`}
                                >
                                  <IconComponent size={12} />
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Maybe Members */}
              <div className="glass-panel rounded-lg">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle size={16} className="text-yellow-400" />
                    <h4 className="text-white font-bold">Maybe ({maybeMembers.length})</h4>
                  </div>
                </div>
                <div className="px-4 pb-4 space-y-3 max-h-32 overflow-y-auto">
                  {maybeMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-2 bg-black/20 rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                          <User size={14} className="text-white/70" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{member.username}</div>
                          <div className="text-white/50 text-sm">ELO {member.elo}</div>
                        </div>
                      </div>
                      <div className="text-yellow-400 text-sm">Undecided</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unavailable Members */}
              <div className="glass-panel rounded-lg">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <XCircle size={16} className="text-red-400" />
                    <h4 className="text-white font-bold">Not Playing ({unavailableMembers.length})</h4>
                  </div>
                </div>
                <div className="px-4 pb-4 space-y-3 max-h-24 overflow-y-auto">
                  {unavailableMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-2 bg-black/20 rounded opacity-60">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                          <User size={14} className="text-white/70" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{member.username}</div>
                          <div className="text-white/50 text-sm">ELO {member.elo}</div>
                        </div>
                      </div>
                      <div className="text-red-400 text-sm">Unavailable</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-xl font-bold">Join Requests ({mockJoinRequests.length})</h3>
          </div>
          
          {mockJoinRequests.map((request) => (
            <div key={request.id} className="glass-panel rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <User size={18} className="text-white/70" />
                    </div>
                    <h4 className="text-white font-bold text-lg">{request.username}</h4>
                    <div className="text-[#CC0000] font-medium">ELO {request.elo}</div>
                    <div className="text-white/70">{request.hours}h played</div>
                  </div>
                  <p className="text-white/70 mb-3">{request.message}</p>
                  <div className="text-white/50 text-sm">Applied {new Date(request.appliedDate).toLocaleDateString()}</div>
                </div>
                <div className="flex gap-3 ml-6">
                  <button
                    onClick={() => handleRejectRequest(request.id)}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApproveRequest(request.id)}
                    className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))}

          {mockJoinRequests.length === 0 && (
            <div className="text-center py-12">
              <UserPlus size={48} className="text-white/30 mx-auto mb-4" />
              <h3 className="text-white text-xl font-bold mb-2">No Pending Requests</h3>
              <p className="text-white/70">All join requests have been processed.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="glass-panel rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white text-xl font-bold">Clan Settings</h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-[#CC0000]/20 hover:bg-[#CC0000]/30 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Edit size={16} />
                Edit Settings
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-[#CC0000]/20 hover:bg-[#CC0000]/30 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 font-medium mb-2">Clan Name</label>
                <input
                  type="text"
                  value={clanSettings.name}
                  onChange={(e) => setClanSettings({...clanSettings, name: e.target.value})}
                  disabled={!isEditing}
                  className="w-full glass-panel rounded-lg px-4 py-3 text-white disabled:opacity-50 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/70 font-medium mb-2">Clan Tag</label>
                <input
                  type="text"
                  value={clanSettings.tag}
                  onChange={(e) => setClanSettings({...clanSettings, tag: e.target.value})}
                  disabled={!isEditing}
                  maxLength={6}
                  className="w-full glass-panel rounded-lg px-4 py-3 text-white disabled:opacity-50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white/70 font-medium mb-2">Website URL</label>
                <input
                  type="url"
                  value={clanSettings.website}
                  onChange={(e) => setClanSettings({...clanSettings, website: e.target.value})}
                  disabled={!isEditing}
                  className="w-full glass-panel rounded-lg px-4 py-3 text-white disabled:opacity-50 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/70 font-medium mb-2">Discord Invite</label>
                <input
                  type="url"
                  value={clanSettings.discord}
                  onChange={(e) => setClanSettings({...clanSettings, discord: e.target.value})}
                  disabled={!isEditing}
                  className="w-full glass-panel rounded-lg px-4 py-3 text-white disabled:opacity-50 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-white/70 font-medium mb-2">Description</label>
            <textarea
              value={clanSettings.longDescription}
              onChange={(e) => setClanSettings({...clanSettings, longDescription: e.target.value})}
              disabled={!isEditing}
              rows={4}
              className="w-full glass-panel rounded-lg px-4 py-3 text-white disabled:opacity-50 focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}