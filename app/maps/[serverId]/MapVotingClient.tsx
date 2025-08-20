'use client';
import React, { useState, useEffect } from 'react';
import { Timer, Vote, ChevronLeft, Trophy, Users, ArrowRight, Calendar, Gem, X } from 'lucide-react';
import { clsx } from 'clsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { VIDEO_ASSETS, createVideoProps } from '../../../lib/r2-assets';

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
  status: 'active' | 'closed';
  voteStart: string;
  voteEnd: string;
  nextVoteStart?: string;
  nextWipeDate: string;
  maps: Map[];
  voteHistory: VoteHistory[];
  winningMap?: Map;
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
    status: 'active',
    voteStart: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    voteEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    nextWipeDate: '2024-04-04T15:00:00Z',
    maps: [
      { id: 'map1', name: 'Map 1', description: 'Mountainous terrain with deep valleys', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 45 },
      { id: 'map2', name: 'Map 2', description: 'Desert map with scattered water bodies', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 38 },
      { id: 'map3', name: 'Map 3', description: 'Snow-covered landscape with forests', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 42 },
      { id: 'map4', name: 'Map 4', description: 'Island chain with bridges', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 35 },
      { id: 'map5', name: 'Map 5', description: 'Harsh desert with rich monuments', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 25 },
      { id: 'map6', name: 'Map 6', description: 'Long beaches with inland forests', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 15 }
    ],
    voteHistory: []
  },
  {
    id: 'eu-weekly',
    name: 'EU Weekly',
    status: 'closed',
    voteStart: '2024-03-19T15:00:00Z',
    voteEnd: '2024-03-20T15:00:00Z',
    nextVoteStart: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    nextWipeDate: '2024-03-28T15:00:00Z',
    maps: [
      { id: 'map1', name: 'Map 1', description: 'Mountainous terrain with deep valleys', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 35 },
      { id: 'map2', name: 'Map 2', description: 'Desert map with scattered water bodies', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 28 },
      { id: 'map3', name: 'Map 3', description: 'Snow-covered landscape with forests', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 42 },
      { id: 'map4', name: 'Map 4', description: 'Island chain with bridges', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 15 },
      { id: 'map5', name: 'Map 5', description: 'Harsh desert with rich monuments', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 25 },
      { id: 'map6', name: 'Map 6', description: 'Long beaches with inland forests', imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', votes: 55 }
    ],
    voteHistory: [],
    winningMap: { 
      id: 'map6', 
      name: 'Map 6', 
      description: 'Long beaches with inland forests', 
      imageUrl: 'https://content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png', 
      votes: 55 
    }
  }
];

servers.forEach(server => {
  server.voteHistory = generateCumulativeVoteHistory(server.maps, 24);
});

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
}

interface MapVotingClientProps {
  serverId: string;
}

export default function MapVotingClient({ serverId }: MapVotingClientProps) {
  const router = useRouter();
  const server = servers.find(s => s.id === serverId);
  const [votedMap, setVotedMap] = useState<string | null>(null);
  const [additionalVotesUsed, setAdditionalVotesUsed] = useState<number>(0);
  const [showGemVoteModal, setShowGemVoteModal] = useState<boolean>(false);
  const [gemVoteMapId, setGemVoteMapId] = useState<string | null>(null);
  const [selectedVoteCount, setSelectedVoteCount] = useState<number>(1);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mapVotes, setMapVotes] = useState<Record<string, number>>(() => {
    const initialVotes: Record<string, number> = {};
    server?.maps.forEach(map => {
      initialVotes[map.id] = map.votes;
    });
    return initialVotes;
  });
  const totalVotes = Object.values(mapVotes).reduce((sum, votes) => sum + votes, 0);
  const timeRemaining = useCountdown(server?.voteEnd);

  // Check authentication status on mount
  useEffect(() => {
    // In real app: check auth token, call auth API, etc.
    // For demo: simulate checking authentication (maybe user is already logged in)
    const checkAuth = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate 50% chance user is already logged in
      const isAuthenticated = Math.random() > 0.5;
      setIsLoggedIn(isAuthenticated);
      setAuthChecked(true);
      
      if (isAuthenticated) {
        console.log('User already authenticated');
      } else {
        console.log('User needs to login');
      }
    };
    
    checkAuth();
  }, []);

  // Add entrance animations CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
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
  useEffect(() => {
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

  // Calculate gem cost with increasing price per vote, considering already used additional votes
  const calculateGemCost = (voteCount: number): number => {
    const startingTier = additionalVotesUsed + 1; // Start from next tier
    let totalCost = 0;
    
    for (let i = 0; i < voteCount; i++) {
      const currentTier = startingTier + i;
      if (currentTier === 1) totalCost += 100;
      else if (currentTier === 2) totalCost += 120;
      else if (currentTier === 3) totalCost += 140;
      else if (currentTier === 4) totalCost += 160;
      else if (currentTier === 5) totalCost += 180;
      else totalCost += 180; // Max tier
    }
    
    return totalCost;
  };

  const getPerVoteCost = (voteCount: number): number => {
    return Math.round(calculateGemCost(voteCount) / voteCount);
  };

  const handleLogin = () => {
    // In a real app, this would redirect to login page or open login modal
    console.log('Redirecting to login...');
    // For demo purposes, simulate login process
    setTimeout(() => {
      setIsLoggedIn(true);
      console.log('Login successful');
    }, 1000);
  };

  const handleVote = (mapId: string) => {
    if (!isLoggedIn) {
      handleLogin();
      return;
    }
    setVotedMap(mapId);
    // Add 1 vote to the map
    setMapVotes(prev => ({
      ...prev,
      [mapId]: prev[mapId] + 1
    }));
    // In a real app, this would make an API call to record the vote
    console.log(`Voted for map ${mapId}`);
  };

  const handleGemVote = (mapId: string, voteCount: number) => {
    if (!isLoggedIn) {
      handleLogin();
      return;
    }
    const gemCost = calculateGemCost(voteCount);
    setVotedMap(mapId);
    setAdditionalVotesUsed(additionalVotesUsed + voteCount);
    // Add the gem votes to the map
    setMapVotes(prev => ({
      ...prev,
      [mapId]: prev[mapId] + voteCount
    }));
    setShowGemVoteModal(false);
    setGemVoteMapId(null);
    setSelectedVoteCount(1);
    // In a real app, this would make an API call to record the gem votes and deduct gems
    console.log(`Cast ${voteCount} gem votes for map ${mapId} - ${gemCost} gems deducted`);
  };

  const openGemVoteModal = (mapId: string) => {
    if (!isLoggedIn) {
      handleLogin();
      return;
    }
    setGemVoteMapId(mapId);
    setSelectedVoteCount(1);
    setShowGemVoteModal(true);
  };

  const closeGemVoteModal = () => {
    setShowGemVoteModal(false);
    setGemVoteMapId(null);
    setSelectedVoteCount(1);
  };

  if (!server) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-300 mb-2">Server not found</h2>
          <Link
            href="/maps"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Return to server list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
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
      
      {/* Gem Vote Confirmation Modal */}
      {showGemVoteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Cast Additional Votes</h3>
            <p className="text-gray-300 mb-6">How many votes would you like to cast?</p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Number of votes</label>
              <div className="flex items-center space-x-4">
                <div className="flex-1 text-center">
                  <input
                    type="range"
                    min="1"
                    max={Math.min(5, 5 - additionalVotesUsed)}
                    value={Math.min(selectedVoteCount, 5 - additionalVotesUsed)}
                    onChange={(e) => setSelectedVoteCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((Math.min(selectedVoteCount, 5 - additionalVotesUsed) - 1) / Math.max(1, (5 - additionalVotesUsed) - 1)) * 100}%, #374151 ${((Math.min(selectedVoteCount, 5 - additionalVotesUsed) - 1) / Math.max(1, (5 - additionalVotesUsed) - 1)) * 100}%, #374151 100%)`
                    }}
                  />
                  <div className="mt-2 text-2xl font-bold text-white">{Math.min(selectedVoteCount, 5 - additionalVotesUsed)}</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Per vote cost:</span>
                  <div className="flex items-center space-x-1">
                    <Gem className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-white">{getPerVoteCost(Math.min(selectedVoteCount, 5 - additionalVotesUsed))}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-300">Total cost:</span>
                  <div className="flex items-center space-x-1">
                    <Gem className="w-5 h-5 text-purple-400" />
                    <span className="text-lg font-bold text-white">{calculateGemCost(Math.min(selectedVoteCount, 5 - additionalVotesUsed))}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Maximum {5 - additionalVotesUsed} votes remaining • Premium pricing for multiple votes</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={closeGemVoteModal}
                className="flex-1 py-2 px-4 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => gemVoteMapId && handleGemVote(gemVoteMapId, Math.min(selectedVoteCount, 5 - additionalVotesUsed))}
                className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Confirm</span>
                <div className="flex items-center space-x-1">
                  <Gem className="w-4 h-4" />
                  <span className="text-sm">{calculateGemCost(Math.min(selectedVoteCount, 5 - additionalVotesUsed))}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="relative z-20 space-y-8 pt-20 w-full mx-auto px-4">
        <button
          onClick={() => router.push('/maps')}
          className={`flex items-center space-x-2 text-gray-400 hover:text-white transition-colors animate-in ${!isLoading ? 'loaded' : ''}`}
          style={{ animationDelay: '0.2s' }}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to servers</span>
        </button>
        <div 
          className={`text-center animate-in ${!isLoading ? 'loaded' : ''}`}
          style={{ animationDelay: '0.4s' }}
        >
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            {server.name} Map Vote
          </h2>
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <Timer className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400">
                {server.status === 'active' ? (
                  timeRemaining ? (
                    <span className="font-mono text-emerald-400">
                      {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
                    </span>
                  ) : (
                    'Vote ended'
                  )
                ) : server.winningMap ? (
                  <>
                    Winning Map: <span className="text-emerald-400">{server.winningMap.name}</span>
                  </>
                ) : (
                  'Vote not started'
                )}
              </span>
            </div>
            {votedMap && (
              <div className="flex items-center space-x-2">
                <Vote className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">
                  Total Votes: {totalVotes}
                </span>
              </div>
            )}
          </div>
        </div>
        {server.status === 'active' && (
          <div 
            className={`h-[300px] relative animate-in ${!isLoading ? 'loaded' : ''}`}
            style={{ animationDelay: '0.6s' }}
          >
            {!votedMap && (
              <div className="absolute inset-0 backdrop-blur-sm bg-gray-900/40 z-10 flex items-center justify-center">
                <div className="text-center">
                  <Vote className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-lg font-medium text-gray-300">Vote to view results</p>
                </div>
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={server.voteHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
                <XAxis 
                  dataKey="timestamp" 
                  type="category"
                  tick={{ fill: '#9CA3AF' }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                  }}
                />
                <YAxis 
                  tick={{ fill: '#9CA3AF' }}
                  domain={[0, 'dataMax']}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '0.5rem'
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                />
                {votedMap && <Legend />}
                {server.maps.map((map, index) => (
                  <Line
                    key={map.id}
                    type="monotone"
                    dataKey={`votes.${map.id}`}
                    name={map.name}
                    stroke={`hsl(${index * (360 / server.maps.length)}, 70%, 60%)`}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        {server.status === 'active' ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {server.maps.map((map, index) => (
              <div
                key={map.id}
                className={clsx(
                  "relative glass-card rounded-xl border overflow-hidden transition-all duration-300 animate-in",
                  votedMap === map.id 
                    ? "border-emerald-500/40"
                    : "border-blue-500/20 hover:border-blue-500/40",
                  !isLoading ? 'loaded' : ''
                )}
                style={{ animationDelay: `${0.8 + (index * 0.1)}s` }}
              >
                <div className={clsx(
                  "absolute inset-0 opacity-20",
                  votedMap === map.id
                    ? "bg-gradient-to-tr from-emerald-500/50 via-transparent to-transparent"
                    : "bg-gradient-to-tr from-blue-500/50 via-transparent to-transparent"
                )} />
                <div className="relative z-10">
                  <div className="relative">
                    <img
                      src="https://images-ext-1.discordapp.net/external/A-nM8KpD75iltIiWp66it9a15HPSxF45RoYM3JsbNac/https/content.rustmaps.com/maps/265/4b3ed83a603c4c528d7a85309febfeeb/map_icons.png?format=webp&quality=lossless&width=960&height=960"
                      alt={map.name}
                      className={clsx(
                        "w-full aspect-square object-cover transition-all duration-300",
                        votedMap && mapVotes[map.id] <= (server?.maps.find(m => m.id === map.id)?.votes || 0) ? "grayscale" : ""
                      )}
                    />
                    {mapVotes[map.id] > (server?.maps.find(m => m.id === map.id)?.votes || 0) && (
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-emerald-500/40 to-transparent pointer-events-none" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-white">{map.name}</h3>
                      <div className="flex items-center space-x-2">
                        {votedMap && (
                          <div className="text-sm font-medium text-gray-400">
                            {((mapVotes[map.id] / totalVotes) * 100).toFixed(1)}%
                          </div>
                        )}
                        {mapVotes[map.id] > (server?.maps.find(m => m.id === map.id)?.votes || 0) ? (
                          <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                            Voted
                          </div>
                        ) : (
                          <div className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs font-medium rounded-full">
                            Unvoted
                          </div>
                        )}
                      </div>
                    </div>
                    {votedMap && (
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-gray-400">{mapVotes[map.id]} votes</span>
                        </div>
                      </div>
                    )}
                    <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
                      {votedMap && (
                        <div
                          className={clsx(
                            "absolute left-0 top-0 bottom-0 rounded-full transition-all duration-300",
                            votedMap === map.id ? "bg-emerald-500" : "bg-blue-500"
                          )}
                          style={{ width: `${(mapVotes[map.id] / totalVotes) * 100}%` }}
                        />
                      )}
                    </div>
                    
                    {votedMap === null ? (
                      <button
                        onClick={() => handleVote(map.id)}
                        className={clsx(
                          "w-full py-2 rounded-lg flex items-center justify-center space-x-2 font-semibold text-base transition-all duration-300 shadow-md border",
                          isLoggedIn 
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 border-blue-500 hover:border-blue-600"
                            : "bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 border-gray-600 hover:border-gray-700"
                        )}
                      >
                        <Vote className="w-4 h-4" />
                        <span>{isLoggedIn ? 'Vote' : 'Login to Vote'}</span>
                      </button>
                    ) : votedMap === map.id ? (
                      <div className="space-y-2">
                        <button
                          disabled
                          className="w-full py-2 rounded-lg flex items-center justify-center space-x-2 font-semibold text-base transition-all duration-300 shadow-md bg-emerald-500 text-white border border-emerald-500"
                        >
                          <Vote className="w-4 h-4" />
                          <span>Voted</span>
                        </button>
                        {additionalVotesUsed < 5 && (
                          <button
                            onClick={() => openGemVoteModal(map.id)}
                            className="w-full py-2 rounded-lg flex items-center justify-center space-x-2 font-semibold text-sm transition-all duration-300 shadow-md bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border border-purple-500 hover:border-purple-600"
                          >
                            <Gem className="w-4 h-4" />
                            <span>Vote Again - {5 - additionalVotesUsed} Remaining</span>
                          </button>
                        )}
                        {additionalVotesUsed >= 5 && (
                          <div className="w-full py-2 rounded-lg flex items-center justify-center space-x-2 font-semibold text-sm bg-gray-800 text-gray-400 border border-gray-700">
                            <Vote className="w-4 h-4" />
                            <span>Max Additional Votes Reached</span>
                          </div>
                        )}
                      </div>
                    ) : additionalVotesUsed < 5 ? (
                      <div className="space-y-2">
                        {mapVotes[map.id] > (server?.maps.find(m => m.id === map.id)?.votes || 0) ? (
                          <button
                            disabled
                            className="w-full py-2 rounded-lg flex items-center justify-center space-x-2 font-semibold text-base transition-all duration-300 shadow-md bg-emerald-500 text-white border border-emerald-500"
                          >
                            <Vote className="w-4 h-4" />
                            <span>Voted</span>
                          </button>
                        ) : (
                          <button
                            disabled
                            className="w-full py-2 rounded-lg flex items-center justify-center space-x-2 font-semibold text-base transition-all duration-300 shadow-md bg-gray-800 text-gray-400 border border-gray-700 cursor-not-allowed"
                          >
                            <X className="w-4 h-4" />
                            <span>Unvoted</span>
                          </button>
                        )}
                        <button
                          onClick={() => openGemVoteModal(map.id)}
                          className="w-full py-2 rounded-lg flex items-center justify-center space-x-2 font-semibold text-base transition-all duration-300 shadow-md bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border border-purple-500 hover:border-purple-600"
                        >
                          <Gem className="w-4 h-4" />
                          <span>Vote with Gems</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {mapVotes[map.id] > (server?.maps.find(m => m.id === map.id)?.votes || 0) ? (
                          <button
                            disabled
                            className="w-full py-2 rounded-lg flex items-center justify-center space-x-2 font-semibold text-base transition-all duration-300 shadow-md bg-emerald-500 text-white border border-emerald-500"
                          >
                            <Vote className="w-4 h-4" />
                            <span>Voted</span>
                          </button>
                        ) : (
                          <button
                            disabled
                            className="w-full py-2 rounded-lg flex items-center justify-center space-x-2 font-semibold text-base transition-all duration-300 shadow-md bg-gray-800 text-gray-400 border border-gray-700 cursor-not-allowed"
                          >
                            <X className="w-4 h-4" />
                            <span>Unvoted</span>
                          </button>
                        )}
                        <button
                          disabled
                          className="w-full py-2 rounded-lg flex items-center justify-center space-x-2 font-semibold text-sm bg-gray-800 text-gray-400 border border-gray-700 cursor-not-allowed"
                        >
                          <Gem className="w-4 h-4" />
                          <span>Max Votes Reached</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : server.winningMap && (
          <div className="relative glass-card p-8 rounded-xl border border-emerald-500/20">
            <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-emerald-500/50 via-transparent to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Trophy className="w-8 h-8 text-emerald-400" />
                  <h3 className="text-2xl font-bold">Winning Map</h3>
                </div>
                <div className="text-emerald-400 font-bold text-lg">
                  {((server.winningMap.votes / totalVotes) * 100).toFixed(1)}% of votes
                </div>
              </div>
              <div className="relative h-64 rounded-xl overflow-hidden mb-6">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent z-10" />
                <img
                  src={server.winningMap.imageUrl}
                  alt={server.winningMap.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <h3 className="text-3xl font-bold text-white mb-2">{server.winningMap.name}</h3>
                  <p className="text-lg text-gray-300">{server.winningMap.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">{server.winningMap.votes} total votes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">Wipe starts {formatDate(server.nextWipeDate)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 