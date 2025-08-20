'use client';

import { useState, useEffect } from 'react';
import { Server, Users, Globe, Zap, Clock, MapPin, Wifi, Shield, Star } from 'lucide-react';

interface ServerData {
  id: string;
  name: string;
  region: string;
  players: number;
  maxPlayers: number;
  status: 'online' | 'maintenance' | 'offline';
  ping: number;
  map: string;
  gamemode: string;
  wipeDate: string;
  featured: boolean;
  description: string;
  ip: string;
  port: number;
}

const mockServers: ServerData[] = [
  {
    id: 'atlas-main-1',
    name: 'Atlas Main [2x]',
    region: 'North America',
    players: 187,
    maxPlayers: 200,
    status: 'online',
    ping: 23,
    map: 'Procedural Map',
    gamemode: '2x Vanilla+',
    wipeDate: '2024-01-15',
    featured: true,
    description: 'Our flagship server with enhanced rates and quality of life improvements',
    ip: '192.168.1.100',
    port: 28015
  },
  {
    id: 'atlas-hardcore-1',
    name: 'Atlas Hardcore [1x]',
    region: 'North America',
    players: 143,
    maxPlayers: 150,
    status: 'online', 
    ping: 31,
    map: 'Custom Map',
    gamemode: '1x Hardcore',
    wipeDate: '2024-01-10',
    featured: true,
    description: 'Pure Rust experience with no modifications - for the hardcore players',
    ip: '192.168.1.101',
    port: 28016
  },
  {
    id: 'atlas-creative-1',
    name: 'Atlas Creative',
    region: 'North America',
    players: 67,
    maxPlayers: 100,
    status: 'online',
    ping: 18,
    map: 'Build Server',
    gamemode: 'Creative',
    wipeDate: 'Never',
    featured: false,
    description: 'Creative building server with unlimited resources and admin tools',
    ip: '192.168.1.102',
    port: 28017
  },
  {
    id: 'atlas-eu-1',
    name: 'Atlas EU [2x]',
    region: 'Europe',
    players: 156,
    maxPlayers: 200,
    status: 'online',
    ping: 89,
    map: 'Procedural Map',
    gamemode: '2x Vanilla+',
    wipeDate: '2024-01-12',
    featured: false,
    description: 'European server with the same great Atlas experience',
    ip: '192.168.2.100',
    port: 28015
  },
  {
    id: 'atlas-asia-1',
    name: 'Atlas Asia [3x]',
    region: 'Asia Pacific',
    players: 98,
    maxPlayers: 150,
    status: 'maintenance',
    ping: 156,
    map: 'Custom Map',
    gamemode: '3x Modded',
    wipeDate: '2024-01-08',
    featured: false,
    description: 'High-rate server with custom plugins and enhanced gameplay',
    ip: '192.168.3.100',
    port: 28015
  }
];

export default function ServersPage() {
  const [servers, setServers] = useState<ServerData[]>(mockServers);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setServers(prev => prev.map(server => ({
        ...server,
        players: Math.max(0, server.players + Math.floor(Math.random() * 6) - 3),
        ping: server.ping + Math.floor(Math.random() * 10) - 5
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredServers = servers.filter(server => {
    const regionMatch = selectedRegion === 'all' || server.region.toLowerCase().includes(selectedRegion.toLowerCase());
    const statusMatch = selectedStatus === 'all' || server.status === selectedStatus;
    return regionMatch && statusMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'maintenance': return 'Maintenance';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const getPopulationColor = (players: number, maxPlayers: number) => {
    const ratio = players / maxPlayers;
    if (ratio >= 0.9) return 'text-red-400';
    if (ratio >= 0.7) return 'text-yellow-400';
    return 'text-green-400';
  };

  const copyServerInfo = (server: ServerData) => {
    const serverInfo = `${server.ip}:${server.port}`;
    navigator.clipboard.writeText(serverInfo);
  };

  return (
    <div className="bg-black pt-20 pb-16 font-orbitron">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20px 20px, #E60000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-[#E60000]/20 border border-[#E60000]/50 px-4 py-2 rounded-lg mb-4">
            <span className="text-[#E60000] text-sm font-medium uppercase tracking-wider font-orbitron">
              Server Status
            </span>
          </div>
          
          <h1 className="text-white text-4xl lg:text-5xl font-bold mb-3 font-russo">
            Atlas <span className="text-[#E60000]">Servers</span>
          </h1>
          <p className="text-[#CCCCCC] text-lg max-w-2xl mx-auto font-orbitron">
            Connect to our high-performance Rust servers for the ultimate gaming experience
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <select 
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-[#111111] border border-[#444444] text-white px-4 py-2 rounded-lg focus:border-[#E60000] focus:outline-none"
          >
            <option value="all">All Regions</option>
            <option value="north america">North America</option>
            <option value="europe">Europe</option>
            <option value="asia">Asia Pacific</option>
          </select>
          
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#111111] border border-[#444444] text-white px-4 py-2 rounded-lg focus:border-[#E60000] focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="online">Online</option>
            <option value="maintenance">Maintenance</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {/* Server Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredServers.map((server) => (
            <div 
              key={server.id} 
              className="bg-[#111111] border border-[#444444] rounded-xl p-6 hover:border-[#E60000]/50 transition-all duration-300 group"
            >
              {/* Server Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Server size={24} className="text-[#E60000]" />
                    {server.featured && (
                      <Star size={12} className="absolute -top-1 -right-1 text-yellow-400 fill-current" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg group-hover:text-[#E60000] transition-colors">
                      {server.name}
                    </h3>
                    <p className="text-[#CCCCCC] text-sm">{server.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(server.status)} animate-pulse`}></div>
                  <span className="text-white text-sm font-medium">{getStatusText(server.status)}</span>
                </div>
              </div>

              {/* Server Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users size={16} className="text-[#CCCCCC]" />
                  </div>
                  <div className={`font-bold ${getPopulationColor(server.players, server.maxPlayers)}`}>
                    {server.players}/{server.maxPlayers}
                  </div>
                  <div className="text-[#666666] text-xs">Players</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Wifi size={16} className="text-[#CCCCCC]" />
                  </div>
                  <div className="text-white font-bold">{server.ping}ms</div>
                  <div className="text-[#666666] text-xs">Ping</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <MapPin size={16} className="text-[#CCCCCC]" />
                  </div>
                  <div className="text-white font-bold text-sm">{server.region.split(' ')[0]}</div>
                  <div className="text-[#666666] text-xs">Region</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock size={16} className="text-[#CCCCCC]" />
                  </div>
                  <div className="text-white font-bold text-sm">
                    {server.wipeDate === 'Never' ? 'Never' : new Date(server.wipeDate).toLocaleDateString()}
                  </div>
                  <div className="text-[#666666] text-xs">Last Wipe</div>
                </div>
              </div>

              {/* Server Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#CCCCCC] text-sm">Map:</span>
                  <span className="text-white font-medium">{server.map}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#CCCCCC] text-sm">Game Mode:</span>
                  <span className="text-white font-medium">{server.gamemode}</span>
                </div>
              </div>

              {/* Connect Button */}
              <button
                onClick={() => copyServerInfo(server)}
                disabled={server.status !== 'online'}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                  server.status === 'online'
                    ? 'bg-[#E60000] hover:bg-[#cc0000] text-white hover:shadow-lg hover:shadow-[#E60000]/25'
                    : 'bg-[#333333] text-[#666666] cursor-not-allowed'
                }`}
              >
                {server.status === 'online' ? (
                  <span className="flex items-center justify-center gap-2">
                    <Globe size={16} />
                    Connect - {server.ip}:{server.port}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Shield size={16} />
                    {server.status === 'maintenance' ? 'Under Maintenance' : 'Server Offline'}
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Server Info Section */}
        <div className="mt-16 bg-[#111111] border border-[#444444] rounded-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-white text-2xl font-bold mb-2 font-russo">
              How to <span className="text-[#E60000]">Connect</span>
            </h2>
            <p className="text-[#CCCCCC]">Follow these simple steps to join our servers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#E60000]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-[#E60000] font-bold text-xl">1</span>
              </div>
              <h3 className="text-white font-bold mb-2">Launch Rust</h3>
              <p className="text-[#CCCCCC] text-sm">Open Rust and go to the server browser</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#E60000]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-[#E60000] font-bold text-xl">2</span>
              </div>
              <h3 className="text-white font-bold mb-2">Press F1</h3>
              <p className="text-[#CCCCCC] text-sm">Open console and type: client.connect [IP:PORT]</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#E60000]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-[#E60000] font-bold text-xl">3</span>
              </div>
              <h3 className="text-white font-bold mb-2">Join & Play</h3>
              <p className="text-[#CCCCCC] text-sm">Wait for the map to load and start playing!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 