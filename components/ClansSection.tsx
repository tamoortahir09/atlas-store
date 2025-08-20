'use client';

import { Users, MapPin, Trophy, DollarSign, Calendar, Settings, Target, Crown, Bell, Search, Filter, Plus, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';

export default function ClansSection() {
  return (
    <section className="py-16 bg-black border-t border-gray-700/50">
      <div className="max-w-full mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-[#E60000]/20 border border-[#E60000]/50 px-4 py-2 rounded mb-6">
            <span className="text-[#E60000] text-sm font-medium uppercase tracking-wider">
              Clan Management
            </span>
          </div>
          
          <h2 className="text-white text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Command Your Empire
            <span className="block text-2xl lg:text-3xl text-[#CCCCCC] font-normal mt-2">
              Advanced Clan Control System
            </span>
          </h2>
          
          <p className="text-[#CCCCCC] text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
            Take control with Atlas's comprehensive clan management platform. Coordinate your team, track territories, manage resources, and dominate the wasteland with powerful tools designed for serious players.
          </p>
        </div>

        {/* Full-Width Clan Manager Interface */}
        <div className="relative max-w-6xl mx-auto">
          {/* Main Application Window */}
          <div className="bg-[#111111] border border-[#444444] rounded-lg shadow-2xl overflow-hidden relative">
            {/* Top Bar */}
            <div className="bg-[#1f1f1f] border-b border-[#444444] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-[#ff5f57] rounded-full"></div>
                  <div className="w-3 h-3 bg-[#ffbd2e] rounded-full"></div>
                  <div className="w-3 h-3 bg-[#28ca42] rounded-full"></div>
                </div>
                <span className="text-white text-sm font-medium">Atlas Clan Manager</span>
              </div>
              <div className="flex items-center gap-3">
                <Bell size={16} className="text-[#CCCCCC] hover:text-white cursor-pointer" />
                <Settings size={16} className="text-[#CCCCCC] hover:text-white cursor-pointer" />
              </div>
            </div>

            {/* Main Interface */}
            <div className="flex h-[500px]">
              {/* Sidebar */}
              <div className="w-64 bg-[#1a1a1a] border-r border-[#444444] p-4">
                {/* Clan Header */}
                <div className="flex items-center gap-3 mb-6 p-3 bg-[#E60000]/15 rounded-lg border border-[#E60000]/30">
                  <Crown size={20} className="text-[#E60000]" />
                  <div>
                    <div className="text-white font-bold">RUST LEGENDS</div>
                    <div className="text-[#CCCCCC] text-sm">Leader Dashboard</div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="space-y-2">
                  <div className="bg-[#E60000]/25 text-[#E60000] px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 font-medium">
                    <Users size={16} />
                    <span>Members</span>
                  </div>
                  <div className="text-[#CCCCCC] hover:text-white hover:bg-[#2a2a2a] px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 cursor-pointer transition-all">
                    <MapPin size={16} />
                    <span>Territory</span>
                  </div>
                  <div className="text-[#CCCCCC] hover:text-white hover:bg-[#2a2a2a] px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 cursor-pointer transition-all">
                    <DollarSign size={16} />
                    <span>Economy</span>
                  </div>
                  <div className="text-[#CCCCCC] hover:text-white hover:bg-[#2a2a2a] px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 cursor-pointer transition-all">
                    <Trophy size={16} />
                    <span>Events</span>
                  </div>
                  <div className="text-[#CCCCCC] hover:text-white hover:bg-[#2a2a2a] px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 cursor-pointer transition-all">
                    <Target size={16} />
                    <span>Bounties</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 space-y-3">
                  <div className="bg-[#2a2a2a] border border-[#444444] rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Users size={14} className="text-[#E60000]" />
                      <span className="text-[#CCCCCC] text-xs">Active Members</span>
                    </div>
                    <div className="text-white font-bold text-lg">24/30</div>
                  </div>
                  
                  <div className="bg-[#2a2a2a] border border-[#444444] rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign size={14} className="text-[#E60000]" />
                      <span className="text-[#CCCCCC] text-xs">Total Bounty</span>
                    </div>
                    <div className="text-white font-bold text-lg">$45.2K</div>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-6">
                {/* Header with Actions */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white font-bold text-xl">Clan Members</h3>
                    <p className="text-[#CCCCCC] text-sm">Manage your 24 active members</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#CCCCCC]" />
                      <input 
                        type="text" 
                        placeholder="Search members..."
                        className="bg-[#2a2a2a] border border-[#444444] rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-[#CCCCCC] w-48 focus:border-[#E60000] focus:outline-none"
                      />
                    </div>
                    <button className="bg-[#E60000] hover:bg-[#cc0000] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all">
                      <Plus size={14} />
                      Invite Member
                    </button>
                  </div>
                </div>

                {/* Members Table */}
                <div className="bg-[#1a1a1a] border border-[#444444] rounded-lg overflow-hidden">
                  {/* Table Header */}
                  <div className="border-b border-[#444444] px-4 py-3 flex items-center gap-4 text-sm text-[#CCCCCC] font-medium bg-[#222222]">
                    <div className="w-6"></div>
                    <div className="flex-1">Member</div>
                    <div className="w-24">Role</div>
                    <div className="w-20">Status</div>
                    <div className="w-24">Last Seen</div>
                    <div className="w-20">Actions</div>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-[#444444]">
                    {/* Member 1 - Leader */}
                    <div className="px-4 py-3 flex items-center gap-4 hover:bg-[#2a2a2a] text-sm transition-all">
                      <div className="w-6 h-6 rounded-full bg-green-500"></div>
                      <div className="flex-1 flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#E60000]/25 rounded-full flex items-center justify-center">
                          <span className="text-[#E60000] text-sm font-bold">SX</span>
                        </div>
                        <span className="text-white font-medium">ShadowX_42</span>
                      </div>
                      <div className="w-24">
                        <span className="bg-[#E60000]/20 text-[#E60000] px-2 py-1 rounded text-xs font-medium">Leader</span>
                      </div>
                      <div className="w-20">
                        <span className="text-green-400 text-sm font-medium">Online</span>
                      </div>
                      <div className="w-24 text-[#CCCCCC] text-sm">Now</div>
                      <div className="w-20">
                        <MoreHorizontal size={16} className="text-[#CCCCCC] hover:text-white cursor-pointer" />
                      </div>
                    </div>

                    {/* Member 2 - Officer */}
                    <div className="px-4 py-3 flex items-center gap-4 hover:bg-[#2a2a2a] text-sm transition-all">
                      <div className="w-6 h-6 rounded-full bg-green-500"></div>
                      <div className="flex-1 flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500/25 rounded-full flex items-center justify-center">
                          <span className="text-blue-400 text-sm font-bold">RK</span>
                        </div>
                        <span className="text-white font-medium">RustKing</span>
                      </div>
                      <div className="w-24">
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-medium">Officer</span>
                      </div>
                      <div className="w-20">
                        <span className="text-green-400 text-sm font-medium">Online</span>
                      </div>
                      <div className="w-24 text-[#CCCCCC] text-sm">2m ago</div>
                      <div className="w-20">
                        <MoreHorizontal size={16} className="text-[#CCCCCC] hover:text-white cursor-pointer" />
                      </div>
                    </div>

                    {/* Member 3 - Offline */}
                    <div className="px-4 py-3 flex items-center gap-4 hover:bg-[#2a2a2a] text-sm transition-all">
                      <div className="w-6 h-6 rounded-full bg-gray-500"></div>
                      <div className="flex-1 flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-500/25 rounded-full flex items-center justify-center">
                          <span className="text-gray-300 text-sm font-bold">NV</span>
                        </div>
                        <span className="text-white font-medium">Nomad_VII</span>
                      </div>
                      <div className="w-24">
                        <span className="bg-gray-500/20 text-gray-300 px-2 py-1 rounded text-xs font-medium">Member</span>
                      </div>
                      <div className="w-20">
                        <span className="text-gray-400 text-sm">Offline</span>
                      </div>
                      <div className="w-24 text-[#CCCCCC] text-sm">3h ago</div>
                      <div className="w-20">
                        <MoreHorizontal size={16} className="text-[#CCCCCC] hover:text-white cursor-pointer" />
                      </div>
                    </div>

                    {/* Member 4 */}
                    <div className="px-4 py-3 flex items-center gap-4 hover:bg-[#2a2a2a] text-sm transition-all">
                      <div className="w-6 h-6 rounded-full bg-green-500"></div>
                      <div className="flex-1 flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-500/25 rounded-full flex items-center justify-center">
                          <span className="text-purple-400 text-sm font-bold">VP</span>
                        </div>
                        <span className="text-white font-medium">VoidPredator</span>
                      </div>
                      <div className="w-24">
                        <span className="bg-gray-500/20 text-gray-300 px-2 py-1 rounded text-xs font-medium">Member</span>
                      </div>
                      <div className="w-20">
                        <span className="text-green-400 text-sm font-medium">Online</span>
                      </div>
                      <div className="w-24 text-[#CCCCCC] text-sm">1m ago</div>
                      <div className="w-20">
                        <MoreHorizontal size={16} className="text-[#CCCCCC] hover:text-white cursor-pointer" />
                      </div>
                    </div>

                    {/* Member 5 */}
                    <div className="px-4 py-3 flex items-center gap-4 hover:bg-[#2a2a2a] text-sm transition-all">
                      <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
                      <div className="flex-1 flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-500/25 rounded-full flex items-center justify-center">
                          <span className="text-yellow-400 text-sm font-bold">IR</span>
                        </div>
                        <span className="text-white font-medium">IronRaider</span>
                      </div>
                      <div className="w-24">
                        <span className="bg-gray-500/20 text-gray-300 px-2 py-1 rounded text-xs font-medium">Member</span>
                      </div>
                      <div className="w-20">
                        <span className="text-yellow-400 text-sm font-medium">Away</span>
                      </div>
                      <div className="w-24 text-[#CCCCCC] text-sm">15m ago</div>
                      <div className="w-20">
                        <MoreHorizontal size={16} className="text-[#CCCCCC] hover:text-white cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Stats and Info */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-[#CCCCCC]">4 Online</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-[#CCCCCC]">1 Away</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span className="text-[#CCCCCC]">19 Offline</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-[#E60000]" />
                      <span className="text-[#CCCCCC]">Next Cashout:</span>
                      <span className="text-[#E60000] font-bold">23:42:16</span>
                    </div>
                    <div className="text-[#CCCCCC]">
                      Showing 5 of 24 members
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 border-2 border-[#E60000]/30 rounded-full"></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 border-2 border-[#E60000]/30 rounded-full"></div>
          
          {/* Background Glow */}
          <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#E60000]/3 rounded-full blur-3xl"></div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <button className="bg-[#E60000] hover:bg-[#cc0000] text-white px-8 py-4 rounded-lg transition-all duration-200 font-medium uppercase tracking-wider shadow-lg hover:shadow-[#E60000]/20">
            Access Clan Dashboard
          </button>
          <p className="text-[#CCCCCC] text-sm mt-4">Join Atlas today and start building your empire</p>
        </div>
      </div>
    </section>
  );
}