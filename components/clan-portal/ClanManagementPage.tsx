'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, FileText, UserPlus, Settings, MessageSquare, Crown, Shield, Target, Clock, Search, Filter, Check, X, MoreHorizontal, Upload, Trash2, Edit } from 'lucide-react';

interface ClanManagementPageProps {
  clanId: string;
}

// Mock clan data
const mockClanData = {
  '1': {
    id: '1',
    name: 'Elite Phantoms',
    tag: 'EPH',
    logo: '⚡',
    acs: 2847,
    members: 28,
    maxMembers: 30,
    region: 'NA',
    server: 'Atlas Main (10x)',
    description: 'Top-tier competitive clan seeking skilled players for tournaments and ranked play.',
    isPublic: true,
    discordServer: 'Elite Phantoms Gaming',
    createdDate: '2024-01-15'
  }
};

const mockMembers = [
  { 
    id: 1, 
    username: 'ShadowCommander', 
    role: 'Leader', 
    acs: 3142, 
    joinDate: '2024-01-15', 
    lastActive: '2024-06-20T10:30:00',
    status: 'online',
    serverActivity: { kills: 1247, deaths: 398, playtime: '156h' }
  },
  { 
    id: 2, 
    username: 'EliteSniper47', 
    role: 'Officer', 
    acs: 2987, 
    joinDate: '2024-01-20', 
    lastActive: '2024-06-20T09:15:00',
    status: 'online',
    serverActivity: { kills: 1098, deaths: 456, playtime: '134h' }
  },
  { 
    id: 3, 
    username: 'TacticalMaster', 
    role: 'Officer', 
    acs: 2891, 
    joinDate: '2024-02-01', 
    lastActive: '2024-06-19T22:45:00',
    status: 'away',
    serverActivity: { kills: 987, deaths: 378, playtime: '142h' }
  },
  { 
    id: 4, 
    username: 'CyberNinja', 
    role: 'Member', 
    acs: 2756, 
    joinDate: '2024-02-15', 
    lastActive: '2024-06-20T11:00:00',
    status: 'online',
    serverActivity: { kills: 876, deaths: 423, playtime: '98h' }
  }
];

const mockApplications = [
  {
    id: 1,
    username: 'ProGamer2024',
    acs: 2456,
    appliedDate: '2024-06-19',
    message: 'I\'m a dedicated player looking to join a competitive team. I have experience in tournaments and strong communication skills.',
    stats: { kdr: 2.34, hours: 456, wins: 67 }
  },
  {
    id: 2,
    username: 'SkillfulShooter',
    acs: 2189,
    appliedDate: '2024-06-18',
    message: 'Experienced player seeking an active clan for ranked matches and events.',
    stats: { kdr: 1.98, hours: 234, wins: 45 }
  }
];

const mockLogs = [
  { id: 1, type: 'member_join', message: 'CyberNinja joined the clan', timestamp: '2024-06-20T10:30:00', severity: 'info' },
  { id: 2, type: 'punishment', message: 'TacticalMaster received a warning for unsportsmanlike conduct', timestamp: '2024-06-19T15:20:00', severity: 'warning' },
  { id: 3, type: 'promotion', message: 'EliteSniper47 was promoted to Officer', timestamp: '2024-06-18T12:00:00', severity: 'success' },
  { id: 4, type: 'server_event', message: 'Clan participated in Atlas Tournament Quarter-Finals', timestamp: '2024-06-17T20:00:00', severity: 'info' }
];

export default function ClanManagementPage({ clanId }: ClanManagementPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'members' | 'logs' | 'applications' | 'customization' | 'discord'>('members');
  const [searchQuery, setSearchQuery] = useState('');
  const [memberFilter, setMemberFilter] = useState('all');

  const clan = mockClanData[clanId as keyof typeof mockClanData];

  const handleBackClick = () => {
    router.push('/clans');
  };

  const handleApproveApplication = (applicationId: number) => {
    console.log('Approving application:', applicationId);
  };

  const handleRejectApplication = (applicationId: number) => {
    console.log('Rejecting application:', applicationId);
  };

  const handleKickMember = (memberId: number) => {
    console.log('Kicking member:', memberId);
  };

  const handlePromoteMember = (memberId: number) => {
    console.log('Promoting member:', memberId);
  };

  if (!clan) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-white text-2xl font-bold mb-2">Clan Not Found</h2>
          <p className="text-[#CCCCCC]">The requested clan could not be found.</p>
        </div>
      </div>
    );
  }

  const filteredMembers = mockMembers.filter(member => {
    const matchesSearch = searchQuery === '' || 
      member.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = memberFilter === 'all' || 
      (memberFilter === 'online' && member.status === 'online') ||
      (memberFilter === 'officers' && (member.role === 'Leader' || member.role === 'Officer'));
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-[#CCCCCC] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Clans</span>
        </button>

        {/* Clan Header */}
        <div className="bg-[#111111] border border-[#444444] rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-[#E60000] rounded-2xl flex items-center justify-center text-3xl">
                {clan.logo}
              </div>
              <div>
                <h1 className="text-3xl font-black text-white mb-2">{clan.name}</h1>
                <div className="flex items-center gap-4 text-[#CCCCCC] mb-2">
                  <span>[{clan.tag}]</span>
                  <span>•</span>
                  <span>{clan.region}</span>
                  <span>•</span>
                  <span>{clan.server}</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-[#E60000]">ACS: <span className="font-bold">{clan.acs}</span></span>
                  <span className="text-[#E60000]">Members: <span className="font-bold">{clan.members}/{clan.maxMembers}</span></span>
                  <span className="text-[#CCCCCC]">Founded: <span className="font-bold">{new Date(clan.createdDate).toLocaleDateString()}</span></span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-[#E60000] mb-1">#{1}</div>
              <div className="text-[#CCCCCC]">Global Rank</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 bg-[#111111] border border-[#444444] rounded-lg p-2 mb-8">
          {[
            { id: 'members', label: 'Members', icon: Users },
            { id: 'logs', label: 'Logs', icon: FileText },
            { id: 'applications', label: 'Applications', icon: UserPlus, count: mockApplications.length },
            { id: 'customization', label: 'Customization', icon: Settings },
            { id: 'discord', label: 'Discord', icon: MessageSquare }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#E60000] text-white'
                  : 'text-[#CCCCCC] hover:text-white hover:bg-[#222222]'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {tab.count && (
                <span className="bg-[#E60000] text-white text-xs px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          
          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              {/* Controls */}
              <div className="bg-[#111111] border border-[#444444] rounded-lg p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#CCCCCC]" />
                    <input
                      type="text"
                      placeholder="Search members..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#222222] border border-[#444444] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#CCCCCC] focus:outline-none focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000]"
                    />
                  </div>
                  
                  <select
                    value={memberFilter}
                    onChange={(e) => setMemberFilter(e.target.value)}
                    className="bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000]"
                  >
                    <option value="all">All Members</option>
                    <option value="online">Online Only</option>
                    <option value="officers">Officers Only</option>
                  </select>

                  <button className="px-6 py-3 bg-[#E60000] hover:bg-[#cc0000] text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                    <UserPlus size={18} />
                    Invite Member
                  </button>
                </div>
              </div>

              {/* Members List */}
              <div className="bg-[#111111] border border-[#444444] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#222222] border-b border-[#444444]">
                      <tr>
                        <th className="text-left py-4 px-6 text-sm font-medium text-[#CCCCCC]">Member</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-[#CCCCCC]">Role</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-[#CCCCCC]">ACS</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-[#CCCCCC]">Server Activity</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-[#CCCCCC]">Last Active</th>
                        <th className="text-left py-4 px-6 text-sm font-medium text-[#CCCCCC]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#444444]">
                      {filteredMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-[#222222] transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${
                                member.status === 'online' ? 'bg-[#E60000]' :
                                member.status === 'away' ? 'bg-[#CCCCCC]' :
                                'bg-[#666666]'
                              }`}></div>
                              <span className="text-white font-medium">{member.username}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              member.role === 'Leader' ? 'bg-[#E60000]/20 text-[#E60000]' :
                              member.role === 'Officer' ? 'bg-[#CCCCCC]/20 text-[#CCCCCC]' :
                              'bg-[#666666]/20 text-[#666666]'
                            }`}>
                              {member.role}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-white font-bold">{member.acs}</td>
                          <td className="py-4 px-6">
                            <div className="text-sm text-[#CCCCCC]">
                              <div>K/D: {(member.serverActivity.kills / member.serverActivity.deaths).toFixed(2)}</div>
                              <div className="text-[#666666]">{member.serverActivity.playtime}</div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-[#CCCCCC] text-sm">
                            {new Date(member.lastActive).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              {member.role !== 'Leader' && (
                                <>
                                  <button
                                    onClick={() => handlePromoteMember(member.id)}
                                    className="p-2 text-[#E60000] hover:text-[#cc0000] transition-colors"
                                    title="Promote"
                                  >
                                    <Crown size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleKickMember(member.id)}
                                    className="p-2 text-[#CCCCCC] hover:text-white transition-colors"
                                    title="Kick"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </>
                              )}
                              <button className="p-2 text-[#CCCCCC] hover:text-white transition-colors">
                                <MoreHorizontal size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="bg-[#111111] border border-[#444444] rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Pending Applications ({mockApplications.length})</h3>
                
                <div className="space-y-4">
                  {mockApplications.map((application) => (
                    <div key={application.id} className="bg-[#222222] rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">{application.username}</h4>
                          <div className="flex items-center gap-4 text-sm text-[#CCCCCC]">
                            <span>ACS: <span className="text-[#E60000] font-bold">{application.acs}</span></span>
                            <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleRejectApplication(application.id)}
                            className="px-4 py-2 bg-[#333333] hover:bg-[#444444] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                          >
                            <X size={16} />
                            Reject
                          </button>
                          <button
                            onClick={() => handleApproveApplication(application.id)}
                            className="px-4 py-2 bg-[#E60000] hover:bg-[#cc0000] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                          >
                            <Check size={16} />
                            Approve
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-[#CCCCCC] mb-4">{application.message}</p>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-[#E60000] font-bold">{application.stats.kdr}</div>
                          <div className="text-[#666666]">K/D Ratio</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[#E60000] font-bold">{application.stats.hours}h</div>
                          <div className="text-[#666666]">Playtime</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[#E60000] font-bold">{application.stats.wins}</div>
                          <div className="text-[#666666]">Event Wins</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === 'logs' && (
            <div className="bg-[#111111] border border-[#444444] rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">Clan Activity Logs</h3>
              
              <div className="space-y-3">
                {mockLogs.map((log) => (
                  <div key={log.id} className="flex items-center gap-4 p-4 bg-[#222222] rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      log.severity === 'success' ? 'bg-[#E60000]' :
                      log.severity === 'warning' ? 'bg-[#CCCCCC]' :
                      log.severity === 'error' ? 'bg-[#E60000]' :
                      'bg-[#666666]'
                    }`}></div>
                    
                    <div className="flex-1">
                      <div className="text-white">{log.message}</div>
                      <div className="text-[#CCCCCC] text-sm">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                    
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      log.type === 'member_join' ? 'bg-[#E60000]/20 text-[#E60000]' :
                      log.type === 'punishment' ? 'bg-[#CCCCCC]/20 text-[#CCCCCC]' :
                      log.type === 'promotion' ? 'bg-[#E60000]/20 text-[#E60000]' :
                      'bg-[#666666]/20 text-[#666666]'
                    }`}>
                      {log.type.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customization Tab */}
          {activeTab === 'customization' && (
            <div className="space-y-6">
              <div className="bg-[#111111] border border-[#444444] rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-6">Clan Customization</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-[#CCCCCC] mb-2">Clan Name</label>
                    <input
                      type="text"
                      defaultValue={clan.name}
                      className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#CCCCCC] mb-2">Clan Tag</label>
                    <input
                      type="text"
                      defaultValue={clan.tag}
                      className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000]"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-[#CCCCCC] mb-2">Description</label>
                  <textarea
                    defaultValue={clan.description}
                    rows={4}
                    className="w-full bg-[#222222] border border-[#444444] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#E60000] focus:border-[#E60000]"
                  />
                </div>
                
                <div className="flex justify-end mt-6">
                  <button className="px-6 py-3 bg-[#E60000] hover:bg-[#cc0000] text-white font-medium rounded-lg transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Discord Tab */}
          {activeTab === 'discord' && (
            <div className="bg-[#111111] border border-[#444444] rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">Discord Integration</h3>
              
              <div className="space-y-6">
                <div className="bg-[#E60000]/10 border border-[#E60000]/50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-[#E60000] rounded-full"></div>
                    <span className="text-[#E60000] font-medium">Connected</span>
                  </div>
                  <div className="text-white font-medium">{clan.discordServer}</div>
                  <div className="text-[#CCCCCC] text-sm">Discord server linked and synchronized</div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-[#222222] rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Auto Role Sync</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-[#CCCCCC] text-sm">Automatically sync clan roles with Discord</span>
                      <input type="checkbox" checked className="w-5 h-5 text-[#E60000] bg-[#333333] border-[#444444] rounded" />
                    </div>
                  </div>
                  
                  <div className="bg-[#222222] rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Event Notifications</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-[#CCCCCC] text-sm">Send notifications for clan events</span>
                      <input type="checkbox" checked className="w-5 h-5 text-[#E60000] bg-[#333333] border-[#444444] rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}