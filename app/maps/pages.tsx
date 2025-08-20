'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Timer, Vote, ChevronRight, ChevronLeft, Trophy, Users, ArrowRight, Calendar, MapPin, Clock, Star, Globe } from 'lucide-react';
import { clsx } from 'clsx';
import Link from 'next/link';
import { VIDEO_ASSETS, createVideoProps } from '../../lib/r2-assets';

function useCountdown(targetDate: string | undefined) {
  const [timeRemaining, setTimeRemaining] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    if (!targetDate) return;
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;
      if (diff <= 0) {
        setTimeRemaining(null);
        return;
      }
      setTimeRemaining({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    };
    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);
  return timeRemaining;
}

interface Map {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  votes: number;
}

interface VoteHistory {
  timestamp: string;
  votes: Record<string, number>;
}

interface Server {
  id: string;
  name: string;
  region: 'EU' | 'US' | 'ASIA' | 'OCE';
  type: 'Monthly' | 'Weekly' | 'Bi-Weekly' | 'Solo/Duo' | 'Trio' | 'Main';
  status: 'active' | 'closed' | 'upcoming';
  voteStart: string;
  voteEnd: string;
  nextVoteStart?: string;
  nextWipeDate: string;
  playerCount: number;
  maxPlayers: number;
  maps: Map[];
  voteHistory: VoteHistory[];
  winningMap?: Map;
  featured?: boolean;
}

const generateCumulativeVoteHistory = (maps: Map[], hours: number) => {
  const history: VoteHistory[] = [];
  const mapVotes: Record<string, number> = {};
  maps.forEach(map => { mapVotes[map.id] = 0; });
  for (let i = 0; i < hours; i++) {
    const timestamp = new Date(Date.now() - (hours - 1 - i) * 3600000).toISOString();
    maps.forEach(map => {
      const newVotes = Math.floor(Math.random() * 5);
      mapVotes[map.id] += newVotes;
    });
    history.push({ timestamp, votes: { ...mapVotes } });
  }
  return history;
};

const servers: Server[] = [
  {
    id: 'eu-monthly',
    name: 'EU Monthly',
    region: 'EU',
    type: 'Monthly',
    status: 'active',
    voteStart: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    voteEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    nextWipeDate: '2024-04-04T15:00:00Z',
    playerCount: 180,
    maxPlayers: 200,
    featured: true,
    maps: [
      { id: 'map1', name: 'Mountain Valley', description: 'Mountainous terrain with deep valleys', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 45 },
      { id: 'map2', name: 'Desert Oasis', description: 'Desert map with scattered water bodies', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 38 },
      { id: 'map3', name: 'Winter Highlands', description: 'Snow-covered landscape with forests', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 42 },
      { id: 'map4', name: 'Island Chain', description: 'Island chain with bridges', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 35 },
      { id: 'map5', name: 'Badlands', description: 'Harsh desert with rich monuments', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 25 },
      { id: 'map6', name: 'Coastal Plains', description: 'Long beaches with inland forests', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 15 }
    ],
    voteHistory: []
  },
  {
    id: 'us-weekly',
    name: 'US Weekly',
    region: 'US',
    type: 'Weekly',
    status: 'active',
    voteStart: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    voteEnd: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(),
    nextWipeDate: '2024-03-28T15:00:00Z',
    playerCount: 150,
    maxPlayers: 175,
    maps: [
      { id: 'map1', name: 'Rocky Canyon', description: 'Deep canyons with elevated plateaus', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 28 },
      { id: 'map2', name: 'Forest Lake', description: 'Dense forests surrounding a central lake', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 33 },
      { id: 'map3', name: 'Tundra Expanse', description: 'Vast tundra with scattered monuments', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 22 },
      { id: 'map4', name: 'Archipelago', description: 'Multiple islands connected by water routes', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 41 }
    ],
    voteHistory: []
  },
  {
    id: 'eu-weekly',
    name: 'EU Weekly',
    region: 'EU',
    type: 'Weekly',
    status: 'closed',
    voteStart: '2024-03-19T15:00:00Z',
    voteEnd: '2024-03-20T15:00:00Z',
    nextVoteStart: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    nextWipeDate: '2024-03-28T15:00:00Z',
    playerCount: 165,
    maxPlayers: 200,
    maps: [
      { id: 'map1', name: 'Mountain Valley', description: 'Mountainous terrain with deep valleys', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 35 },
      { id: 'map2', name: 'Desert Oasis', description: 'Desert map with scattered water bodies', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 28 },
      { id: 'map3', name: 'Winter Highlands', description: 'Snow-covered landscape with forests', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 42 },
      { id: 'map4', name: 'Island Chain', description: 'Island chain with bridges', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 15 },
      { id: 'map5', name: 'Badlands', description: 'Harsh desert with rich monuments', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 25 },
      { id: 'map6', name: 'Coastal Plains', description: 'Long beaches with inland forests', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 55 }
    ],
    voteHistory: [],
    winningMap: { 
      id: 'map6', 
      name: 'Coastal Plains', 
      description: 'Long beaches with inland forests', 
      imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', 
      votes: 55 
    }
  },
  {
    id: 'asia-main',
    name: 'ASIA Main',
    region: 'ASIA',
    type: 'Main',
    status: 'upcoming',
    voteStart: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
    voteEnd: new Date(Date.now() + 1000 * 60 * 60 * 30).toISOString(),
    nextWipeDate: '2024-04-01T08:00:00Z',
    playerCount: 0,
    maxPlayers: 250,
    maps: [
      { id: 'map1', name: 'Sakura Valley', description: 'Cherry blossom filled valleys', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 0 },
      { id: 'map2', name: 'Bamboo Forest', description: 'Dense bamboo groves with clearings', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 0 },
      { id: 'map3', name: 'Rice Terraces', description: 'Terraced hillsides with water features', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 0 }
    ],
    voteHistory: []
  },
  {
    id: 'us-duo',
    name: 'US Solo/Duo',
    region: 'US',
    type: 'Solo/Duo',
    status: 'active',
    voteStart: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    voteEnd: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(),
    nextWipeDate: '2024-03-30T20:00:00Z',
    playerCount: 95,
    maxPlayers: 125,
    maps: [
      { id: 'map1', name: 'Small Valley', description: 'Compact map perfect for solo/duo', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 18 },
      { id: 'map2', name: 'Twin Peaks', description: 'Two mountain peaks with central valley', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 23 },
      { id: 'map3', name: 'Coastal Retreat', description: 'Peaceful coastal map with good loot', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 31 }
    ],
    voteHistory: []
  },
  {
    id: 'oce-trio',
    name: 'OCE Trio',
    region: 'OCE',
    type: 'Trio',
    status: 'active',
    voteStart: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    voteEnd: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
    nextWipeDate: '2024-03-29T12:00:00Z',
    playerCount: 72,
    maxPlayers: 90,
    featured: true,
    maps: [
      { id: 'map1', name: 'Outback Plains', description: 'Vast plains with scattered rock formations', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 12 },
      { id: 'map2', name: 'Reef Islands', description: 'Tropical islands with coral reefs', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 19 },
      { id: 'map3', name: 'Desert Coast', description: 'Coastal desert with hidden oases', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 8 },
      { id: 'map4', name: 'Canyon Rivers', description: 'River systems cutting through canyons', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 15 }
    ],
    voteHistory: []
  }
];

servers.forEach(server => {
  server.voteHistory = generateCumulativeVoteHistory(server.maps, 24);
});

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getRegionColor(region: string) {
  switch (region) {
    case 'EU': return 'text-blue-400 bg-blue-500/10';
    case 'US': return 'text-red-400 bg-red-500/10';
    case 'ASIA': return 'text-yellow-400 bg-yellow-500/10';
    case 'OCE': return 'text-green-400 bg-green-500/10';
    default: return 'text-gray-400 bg-gray-500/10';
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active': return 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20';
    case 'closed': return 'text-gray-400 bg-gray-500/10 border border-gray-500/20';
    case 'upcoming': return 'text-orange-400 bg-orange-500/10 border border-orange-500/20';
    default: return 'text-gray-400 bg-gray-500/10';
  }
}

function SlideToggle({ 
  options, 
  selected, 
  onChange, 
  label 
}: { 
  options: { value: string; label: string; color?: string }[]; 
  selected: string; 
  onChange: (value: string) => void; 
  label: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <div className="flex gap-2">
        {options.map((option) => {
          const isSelected = selected === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={clsx(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                isSelected
                  ? option.color || "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                  : "text-gray-400 hover:text-gray-300 bg-black/30 hover:bg-black/50"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ServerCard({ server }: { server: Server }) {
  const timeRemaining = useCountdown(
    server.status === 'active' ? server.voteEnd : 
    server.status === 'upcoming' ? server.voteStart : 
    server.nextVoteStart
  );
  const totalVotes = server.maps.reduce((sum, map) => sum + map.votes, 0);
  const leadingMap = server.maps.reduce((prev, current) => 
    prev.votes > current.votes ? prev : current
  );
  
  // Check if ending soon (less than 6 hours)
  const isEndingSoon = timeRemaining && (
    (timeRemaining.days === 0 && timeRemaining.hours < 6) ||
    (timeRemaining.days === 0 && timeRemaining.hours === 0)
  );
  
  const populationPercentage = (server.playerCount / server.maxPlayers) * 100;
  
  return (
    <div 
      className={clsx(
        "relative backdrop-blur-md bg-black/40 p-6 rounded-xl border transition-all duration-300 hover:transform hover:-translate-y-1 overflow-hidden group flex flex-col h-full",
        isEndingSoon
          ? "border-orange-500/30 hover:border-orange-500/50 hover:bg-black/50"
          : server.status === 'active'
          ? "border-emerald-500/30 hover:border-emerald-500/50 hover:bg-black/50"
          : server.status === 'upcoming'
          ? "border-orange-500/30 hover:border-orange-500/50 hover:bg-black/50"
          : "border-gray-500/30 hover:border-gray-500/50 hover:bg-black/50"
      )}
      style={isEndingSoon ? {
        animation: 'subtle-pulse 3s ease-in-out infinite'
      } : undefined}
    >

      
              <div className={clsx(
        "absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity",
        isEndingSoon
          ? "bg-gradient-to-tr from-orange-500/50 via-transparent to-transparent"
          : server.status === 'active'
          ? "bg-gradient-to-tr from-emerald-500/50 via-transparent to-transparent"
          : server.status === 'upcoming'
          ? "bg-gradient-to-tr from-orange-500/50 via-transparent to-transparent"
          : "bg-gradient-to-tr from-gray-500/50 via-transparent to-transparent"
      )} />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{server.name}</h3>
            <div className="flex items-center gap-2">
              <span className={clsx("px-2 py-1 rounded-md text-xs font-medium", getRegionColor(server.region))}>
                {server.region}
              </span>
              <span className="px-2 py-1 rounded-md text-xs font-medium bg-purple-500/10 text-purple-400">
                {server.type}
              </span>
            </div>
          </div>
          <div className={clsx(
            "px-3 py-1 rounded-full text-sm font-medium", 
            isEndingSoon ? "text-orange-400 bg-orange-500/10 border border-orange-500/20" : getStatusColor(server.status)
          )}>
            {isEndingSoon ? 'Ending Soon' : server.status.charAt(0).toUpperCase() + server.status.slice(1)}
          </div>
        </div>
        
        <div className="space-y-3 flex-grow">
          {/* Amount of Votes */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Vote className="w-4 h-4" />
              <span>Amount of votes:</span>
            </div>
            <div className="text-right">
              <div className="font-medium text-white">
                {totalVotes} votes
              </div>
              <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={clsx(
                    "h-full rounded-full transition-all",
                    totalVotes > 100 ? "bg-emerald-500" :
                    totalVotes > 50 ? "bg-yellow-500" : "bg-red-500"
                  )}
                  style={{ width: `${Math.min((totalVotes / 150) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Timer */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>
                {isEndingSoon ? 'Ending soon:' :
                 server.status === 'active' ? 'Vote ends:' : 
                 server.status === 'upcoming' ? 'Vote starts:' : 
                 'Next vote:'}
              </span>
            </div>
            <div className="font-medium">
              {timeRemaining ? (
                <div className="text-right">
                  <div className={clsx(
                    "font-mono text-sm",
                    isEndingSoon ? "text-orange-400" :
                    server.status === 'active' ? "text-emerald-400" : 
                    server.status === 'upcoming' ? "text-orange-400" : "text-blue-400"
                  )}>
                    {timeRemaining.days > 0 && `${timeRemaining.days}d `}
                    {timeRemaining.hours}h {timeRemaining.minutes}m
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(
                      server.status === 'active' ? server.voteEnd : 
                      server.status === 'upcoming' ? server.voteStart : 
                      server.nextVoteStart || ''
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">Time expired</div>
              )}
            </div>
          </div>
          
          {/* Wipe Date */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Wipe date:</span>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-300">{formatDate(server.nextWipeDate)}</div>
            </div>
          </div>
          
          {/* Vote Status */}
          {server.status === 'active' && totalVotes > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Trophy className="w-4 h-4" />
                <span>Leading:</span>
              </div>
              <div className="font-medium text-blue-400">
                {leadingMap.name} ({Math.round((leadingMap.votes / totalVotes) * 100)}%)
              </div>
            </div>
          )}
          
          {server.winningMap && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Trophy className="w-4 h-4" />
                <span>Winner:</span>
              </div>
              <div className="font-medium text-emerald-400">{server.winningMap.name}</div>
            </div>
          )}
          
          {/* Maps Count */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>Maps:</span>
            </div>
            <div className="font-medium text-gray-300">{server.maps.length} options</div>
          </div>
        </div>
        
        {/* Action Button - Always at bottom */}
        <div className="mt-4">
          <Link
            href={`/maps/${server.id}`}
            className={clsx(
              "flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 group/button",
              isEndingSoon
                ? "bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 hover:text-orange-300 border border-orange-500/20 hover:border-orange-500/40"
                : server.status === 'active' 
                ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40"
                : server.status === 'upcoming'
                ? "bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 hover:text-orange-300 border border-orange-500/20 hover:border-orange-500/40"
                : "bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 hover:text-gray-300 border border-gray-500/20 hover:border-gray-500/40"
            )}
          >
            <span className="font-medium">
              {isEndingSoon ? 'Ending Soon' :
               server.status === 'active' ? 'Vote Now' : 
               server.status === 'upcoming' ? 'View Maps' : 
               'View Results'}
            </span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/button:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MapVoting() {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const [isLoading, setIsLoading] = useState(true);

  // Add subtle pulse animation CSS
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes subtle-pulse {
        0%, 100% { 
          opacity: 1; 
          border-color: rgb(107 114 128 / 0.2);
          background-color: rgb(0 0 0 / 0.4);
        }
        50% { 
          opacity: 0.9; 
          border-color: rgb(107 114 128 / 0.4);
          background-color: rgb(0 0 0 / 0.5);
        }
      }
      @keyframes slideInUp {
        0% { 
          opacity: 0; 
          transform: translateY(30px); 
        }
        100% { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
      @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      
      /* Hide content initially to prevent flicker */
      .animate-in {
        opacity: 0;
        transform: translateY(30px);
      }
      
      .animate-in.loaded {
        animation: slideInUp 0.6s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Wait for content to be ready before showing animations
  React.useEffect(() => {
    // First wait for a short delay to ensure DOM is ready
    const initialDelay = setTimeout(() => {
      // Then wait for any images/resources to load
      const images = document.querySelectorAll('img');
      let loadedImages = 0;
      
      if (images.length === 0) {
        // No images to load, start animations immediately
        setIsLoading(false);
        return;
      }
      
      const checkAllLoaded = () => {
        loadedImages++;
        if (loadedImages === images.length) {
          // All images loaded, start animations
          setTimeout(() => setIsLoading(false), 200);
        }
      };
      
      images.forEach(img => {
        if (img.complete) {
          checkAllLoaded();
        } else {
          img.addEventListener('load', checkAllLoaded);
          img.addEventListener('error', checkAllLoaded); // Count errors as "loaded" too
        }
      });
      
      // Fallback: don't wait more than 3 seconds
      setTimeout(() => {
        if (isLoading) setIsLoading(false);
      }, 3000);
      
    }, 100);
    
    return () => clearTimeout(initialDelay);
  }, [isLoading]);

  // Helper function to check if ending soon
  const isServerEndingSoon = (server: Server) => {
    const targetDate = server.status === 'active' ? server.voteEnd : 
                      server.status === 'upcoming' ? server.voteStart : 
                      server.nextVoteStart;
    
    if (!targetDate) return false;
    
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const diff = target - now;
    
    if (diff <= 0) return false;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    return days === 0 && hours < 6;
  };

  const regionOptions = [
    { value: 'all', label: 'All' },
    { value: 'EU', label: 'EU', color: 'bg-blue-500/20 text-blue-300 border border-blue-500/40' },
    { value: 'US', label: 'US', color: 'bg-red-500/20 text-red-300 border border-red-500/40' },
    { value: 'ASIA', label: 'ASIA', color: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40' },
    { value: 'OCE', label: 'OCE', color: 'bg-green-500/20 text-green-300 border border-green-500/40' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active', color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' },
    { value: 'concluded', label: 'Concluded', color: 'bg-gray-500/20 text-gray-300 border border-gray-500/40' }
  ];

  const filteredServers = useMemo(() => {
    return servers
      .filter(server => {
        const matchesRegion = selectedRegion === 'all' || server.region === selectedRegion;
        const matchesStatus = selectedStatus === 'all' || 
          (selectedStatus === 'active' && (server.status === 'active' || server.status === 'upcoming')) ||
          (selectedStatus === 'concluded' && server.status === 'closed');
        
        return matchesRegion && matchesStatus;
      })
      .sort((a, b) => {
        // Helper function to get time remaining for a server
        const getTimeRemaining = (server: Server) => {
          const now = new Date().getTime();
          if (server.status === 'active') {
            return new Date(server.voteEnd).getTime() - now;
          } else if (server.status === 'upcoming') {
            return new Date(server.voteStart).getTime() - now;
          } else {
            return Infinity; // Closed servers go to the end
          }
        };
        
        const timeRemainingA = getTimeRemaining(a);
        const timeRemainingB = getTimeRemaining(b);
        
        // Check if servers are ending soon (less than 6 hours)
        const isEndingSoonA = isServerEndingSoon(a);
        const isEndingSoonB = isServerEndingSoon(b);
        
        // Ending soon servers come first
        if (isEndingSoonA && !isEndingSoonB) return -1;
        if (!isEndingSoonA && isEndingSoonB) return 1;
        
        // If both are ending soon or both are not, sort by time remaining (soonest first)
        if (isEndingSoonA && isEndingSoonB) {
          return timeRemainingA - timeRemainingB;
        }
        
        // Among non-ending-soon servers, prioritize active over upcoming
        if (a.status === 'active' && b.status === 'upcoming') return -1;
        if (a.status === 'upcoming' && b.status === 'active') return 1;
        
        // Within same status, sort by time remaining (soonest first)
        return timeRemainingA - timeRemainingB;
      });
  }, [selectedRegion, selectedStatus]);





  return (
    <div className="relative">
      {/* AtlasMap video background - R2 hosted with CDN caching */}
      <video
        {...createVideoProps(VIDEO_ASSETS.MAPS_BACKGROUND, {
          autoPlay: true,
          loop: true,
          muted: true,
          playsInline: true,
          className: "fixed inset-0 w-full h-full object-cover z-0"
        })}
      />
      {/* Dark overlay for readability */}
      <div className="fixed inset-0 bg-black/70 z-10 pointer-events-none" />
      
      {/* Main content */}
      <div className="relative z-20 container mx-auto px-4 pt-24 pb-8 max-w-7xl">
        {/* Header */}
        <div className={`text-center mb-12 animate-in ${!isLoading ? 'loaded' : ''}`}>
          <h1 
            className={`text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 animate-in ${!isLoading ? 'loaded' : ''}`}
            style={{ animationDelay: '0.2s' }}
          >
            MAP VOTING
          </h1>
          <p 
            className={`text-gray-300 text-lg mb-8 max-w-2xl mx-auto animate-in ${!isLoading ? 'loaded' : ''}`}
            style={{ animationDelay: '0.4s' }}
          >
            The wipe starts here. Vote for your next battlefield.
          </p>
          

        </div>

        {/* Filters - Centered */}
        <div 
          className={`flex justify-center mb-12 animate-in ${!isLoading ? 'loaded' : ''}`}
          style={{ animationDelay: '0.8s' }}
        >
          <div className="flex gap-6">
            <SlideToggle
              label="Region"
              options={regionOptions}
              selected={selectedRegion}
              onChange={setSelectedRegion}
            />
            <SlideToggle
              label="Status"
              options={statusOptions}
              selected={selectedStatus}
              onChange={setSelectedStatus}
            />
          </div>
        </div>

        {/* Server Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredServers.map((server, index) => (
            <div
              key={server.id}
              className={`animate-in ${!isLoading ? 'loaded' : ''}`}
              style={{ animationDelay: `${1.0 + (index * 0.1)}s` }}
            >
              <ServerCard server={server} />
            </div>
          ))}
        </div>

        {/* No results */}
        {filteredServers.length === 0 && (
          <div 
            className={`text-center py-12 animate-in ${!isLoading ? 'loaded' : ''}`}
            style={{ animationDelay: '1.2s' }}
          >
            <div className="backdrop-blur-md bg-black/40 border border-gray-500/20 rounded-xl p-8 max-w-md mx-auto">
              <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No servers found</h3>
              <p className="text-gray-400">Try adjusting your filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 