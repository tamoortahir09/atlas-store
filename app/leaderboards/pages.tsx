'use client';

import { useState, useEffect, useMemo } from 'react';
import { Trophy, Medal, Crown, Target, Skull, TrendingUp, Search, Filter, Users, Zap, Calendar, Star, ChevronUp, ChevronDown, Award, Shield, Flame, Sword, Crosshair } from 'lucide-react';

interface PlayerData {
  id: string;
  username: string;
  level: number;
  kills: number;
  deaths: number;
  kdr: number;
  playtime: string;
  clan: string;
  clanTag: string;
  lastSeen: string;
  server: string;
  rank: number;
  previousRank: number;
  acs: number; // Atlas Competitive Score
}

// Atlas Rank System (similar to Valorant/CSGO)
type RankTier = 'demonic_top5' | 'demonic_top25' | 'obsidian3' | 'obsidian2' | 'obsidian1' | 'purple3' | 'purple2' | 'purple1' | 'blue3' | 'blue2' | 'blue1' | 'gold3' | 'gold2' | 'gold1' | 'silver3' | 'silver2' | 'silver1' | 'bronze3' | 'bronze2' | 'bronze1';

interface RankConfig {
  tier: RankTier;
  name: string;
  image: string;
  minACS: number;
  maxACS: number;
  description: string;
  color: string;
}

// Rank tier configurations (based on ACS thresholds)
const RANK_CONFIGS: Record<RankTier, RankConfig> = {
  demonic_top5: {
    tier: 'demonic_top5',
    name: 'Demonic Elite',
    image: '/Emblems/Demonic_Top5.png',
    minACS: 3100,
    maxACS: 9999,
    description: 'Top 5 Global Elite',
    color: 'text-red-500'
  },
  demonic_top25: {
    tier: 'demonic_top25',
    name: 'Demonic Legend',
    image: '/Emblems/Demonic_Top25.png',
    minACS: 3000,
    maxACS: 3099,
    description: 'Top 25 Global Legend',
    color: 'text-red-400'
  },
  obsidian3: {
    tier: 'obsidian3',
    name: 'Obsidian III',
    image: '/Emblems/ob3.png',
    minACS: 2900,
    maxACS: 2999,
    description: 'Obsidian Tier III',
    color: 'text-gray-800'
  },
  obsidian2: {
    tier: 'obsidian2',
    name: 'Obsidian II',
    image: '/Emblems/ob2.png',
    minACS: 2800,
    maxACS: 2899,
    description: 'Obsidian Tier II',
    color: 'text-gray-700'
  },
  obsidian1: {
    tier: 'obsidian1',
    name: 'Obsidian I',
    image: '/Emblems/ob1.png',
    minACS: 2700,
    maxACS: 2799,
    description: 'Obsidian Tier I',
    color: 'text-gray-600'
  },
  purple3: {
    tier: 'purple3',
    name: 'Ascendant III',
    image: '/Emblems/p3.png',
    minACS: 2600,
    maxACS: 2699,
    description: 'Ascendant Tier III',
    color: 'text-purple-500'
  },
  purple2: {
    tier: 'purple2',
    name: 'Ascendant II',
    image: '/Emblems/p2.png',
    minACS: 2500,
    maxACS: 2599,
    description: 'Ascendant Tier II',
    color: 'text-purple-400'
  },
  purple1: {
    tier: 'purple1',
    name: 'Ascendant I',
    image: '/Emblems/p1.png',
    minACS: 2400,
    maxACS: 2499,
    description: 'Ascendant Tier I',
    color: 'text-purple-300'
  },
  blue3: {
    tier: 'blue3',
    name: 'Diamond III',
    image: '/Emblems/blue3.png',
    minACS: 2300,
    maxACS: 2399,
    description: 'Diamond Tier III',
    color: 'text-blue-500'
  },
  blue2: {
    tier: 'blue2',
    name: 'Diamond II',
    image: '/Emblems/blue2.png',
    minACS: 2200,
    maxACS: 2299,
    description: 'Diamond Tier II',
    color: 'text-blue-400'
  },
  blue1: {
    tier: 'blue1',
    name: 'Diamond I',
    image: '/Emblems/blue1.png',
    minACS: 2100,
    maxACS: 2199,
    description: 'Diamond Tier I',
    color: 'text-blue-300'
  },
  gold3: {
    tier: 'gold3',
    name: 'Platinum III',
    image: '/Emblems/Gold3.png',
    minACS: 2000,
    maxACS: 2099,
    description: 'Platinum Tier III',
    color: 'text-yellow-500'
  },
  gold2: {
    tier: 'gold2',
    name: 'Platinum II',
    image: '/Emblems/Gold2.png',
    minACS: 1900,
    maxACS: 1999,
    description: 'Platinum Tier II',
    color: 'text-yellow-400'
  },
  gold1: {
    tier: 'gold1',
    name: 'Platinum I',
    image: '/Emblems/Gold1.png',
    minACS: 1800,
    maxACS: 1899,
    description: 'Platinum Tier I',
    color: 'text-yellow-300'
  },
  silver3: {
    tier: 'silver3',
    name: 'Gold III',
    image: '/Emblems/s3.png',
    minACS: 1700,
    maxACS: 1799,
    description: 'Gold Tier III',
    color: 'text-gray-400'
  },
  silver2: {
    tier: 'silver2',
    name: 'Gold II',
    image: '/Emblems/s2.png',
    minACS: 1600,
    maxACS: 1699,
    description: 'Gold Tier II',
    color: 'text-gray-300'
  },
  silver1: {
    tier: 'silver1',
    name: 'Gold I',
    image: '/Emblems/s1.png',
    minACS: 1500,
    maxACS: 1599,
    description: 'Gold Tier I',
    color: 'text-gray-200'
  },
  bronze3: {
    tier: 'bronze3',
    name: 'Silver III',
    image: '/Emblems/br3.png',
    minACS: 1400,
    maxACS: 1499,
    description: 'Silver Tier III',
    color: 'text-amber-600'
  },
  bronze2: {
    tier: 'bronze2',
    name: 'Silver II',
    image: '/Emblems/br2.png',
    minACS: 1300,
    maxACS: 1399,
    description: 'Silver Tier II',
    color: 'text-amber-500'
  },
  bronze1: {
    tier: 'bronze1',
    name: 'Silver I',
    image: '/Emblems/br1.png',
    minACS: 0,
    maxACS: 1299,
    description: 'Silver Tier I',
    color: 'text-amber-400'
  }
};

// Function to get rank based on leaderboard position and ACS score
const getRankFromPosition = (position: number, acs: number): RankConfig => {
  // Top 3 get Demonic Elite regardless of ACS
  if (position <= 3) {
    return RANK_CONFIGS.demonic_top5; // Using demonic_top5 for Demonic Elite
  }
  
  // Top 4-25 get Demonic Legend regardless of ACS  
  if (position <= 25) {
    return RANK_CONFIGS.demonic_top25; // Using demonic_top25 for Demonic Legend
  }
  
  // Everyone else uses ACS-based ranking
  const ranks = Object.values(RANK_CONFIGS).filter(rank => 
    rank.tier !== 'demonic_top5' && rank.tier !== 'demonic_top25'
  );
  return ranks.find(rank => acs >= rank.minACS && acs <= rank.maxACS) || RANK_CONFIGS.bronze1;
};

interface ClanData {
  id: string;
  name: string;
  tag: string;
  members: number;
  totalKills: number;
  averageKDR: number;
  totalPlaytime: string;
  leader: string;
  acs: number;
  rank: number;
  previousRank: number;
  region: string;
}

const mockPlayers: PlayerData[] = [
  {
    id: '1',
    username: 'ShadowCommander',
    level: 87,
    kills: 2847,
    deaths: 681,
    kdr: 4.18,
    playtime: '247h 32m',
    clan: 'Elite Phantoms',
    clanTag: 'EPH',
    lastSeen: '2024-01-20',
    server: 'Atlas Main [2x]',
    rank: 1,
    previousRank: 2,
    acs: 3142
  },
  {
    id: '2',
    username: 'EliteSniper47',
    level: 84,
    kills: 2634,
    deaths: 684,
    kdr: 3.85,
    playtime: '231h 18m',
    clan: 'Shadow Legion',
    clanTag: 'SHD',
    lastSeen: '2024-01-20',
    server: 'Atlas Main [2x]',
    rank: 2,
    previousRank: 1,
    acs: 3089
  },
  {
    id: '3',
    username: 'TacticalMaster',
    level: 82,
    kills: 2456,
    deaths: 623,
    kdr: 3.94,
    playtime: '198h 45m',
    clan: 'Digital Hunters',
    clanTag: 'DGH',
    lastSeen: '2024-01-19',
    server: 'Atlas Hardcore [1x]',
    rank: 3,
    previousRank: 4,
    acs: 3021
  },
  {
    id: '4',
    username: 'CyberNinja',
    level: 79,
    kills: 2289,
    deaths: 624,
    kdr: 3.67,
    playtime: '187h 22m',
    clan: 'Neon Wolves',
    clanTag: 'NWF',
    lastSeen: '2024-01-20',
    server: 'Atlas Main [2x]',
    rank: 4,
    previousRank: 3,
    acs: 2987
  },
  {
    id: '5',
    username: 'ProGamer2024',
    level: 76,
    kills: 2134,
    deaths: 607,
    kdr: 3.52,
    playtime: '165h 33m',
    clan: 'Cyber Storm',
    clanTag: 'CYB',
    lastSeen: '2024-01-19',
    server: 'Atlas EU [2x]',
    rank: 5,
    previousRank: 6,
    acs: 2934
  },
  {
    id: '6',
    username: 'StealthHunter',
    level: 74,
    kills: 1987,
    deaths: 589,
    kdr: 3.37,
    playtime: '142h 18m',
    clan: 'Outback Warriors',
    clanTag: 'OBW',
    lastSeen: '2024-01-20',
    server: 'Atlas AU [2x]',
    rank: 6,
    previousRank: 7,
    acs: 2876
  },
  {
    id: '7',
    username: 'NoobDestroyer',
    level: 71,
    kills: 1823,
    deaths: 621,
    kdr: 2.94,
    playtime: '138h 45m',
    clan: 'Brazilian Elite',
    clanTag: 'BRE',
    lastSeen: '2024-01-19',
    server: 'Atlas Main [2x]',
    rank: 7,
    previousRank: 8,
    acs: 2754
  },
  {
    id: '8',
    username: 'QuantumSniper',
    level: 68,
    kills: 1645,
    deaths: 578,
    kdr: 2.85,
    playtime: '124h 12m',
    clan: 'Rising Sun',
    clanTag: 'RSN',
    lastSeen: '2024-01-20',
    server: 'Atlas Asia [2x]',
    rank: 8,
    previousRank: 9,
    acs: 2687
  },
  {
    id: '9',
    username: 'FrostByte',
    level: 65,
    kills: 1534,
    deaths: 567,
    kdr: 2.71,
    playtime: '118h 33m',
    clan: 'Nordic Legends',
    clanTag: 'NOR',
    lastSeen: '2024-01-19',
    server: 'Atlas EU [2x]',
    rank: 9,
    previousRank: 10,
    acs: 2623
  },
  {
    id: '10',
    username: 'PhoenixRising',
    level: 63,
    kills: 1423,
    deaths: 598,
    kdr: 2.38,
    playtime: '112h 55m',
    clan: 'Seoul Squad',
    clanTag: 'SEO',
    lastSeen: '2024-01-20',
    server: 'Atlas Asia [2x]',
    rank: 10,
    previousRank: 11,
    acs: 2567
  }
];

// Generate additional players for top 100 with distributed ACS scores across all ranks
const generateAdditionalPlayers = (): PlayerData[] => {
  const baseNames = [
    'ShadowStrike', 'EliteForce', 'NightHawk', 'CyberDemon', 'PhantomKill', 'ViperSnipe', 'TacticalOps',
    'StormBreaker', 'IronSight', 'DeathDealer', 'BlitzKrieg', 'SniperElite', 'RogueAgent', 'GhostRecon',
    'DarkAngel', 'FireStorm', 'IceBreaker', 'ThunderBolt', 'SteelStorm', 'BloodHound', 'WarMachine',
    'ColdSteel', 'RedAlert', 'BlackOps', 'SilentKill', 'RapidFire', 'DeadShot', 'VenomStrike',
    'TitanForce', 'NeonBlade', 'CrimsonEdge', 'SolarFlare', 'LunarEclipse', 'ArcticWolf', 'DesertEagle',
    'JungleCat', 'MountainLion', 'OceanStorm', 'VolcanicRage', 'ThunderClap', 'LightningBolt', 'EarthQuake',
    'WindStorm', 'FrostBite', 'HeatWave', 'TidalWave', 'Avalanche', 'Tornado', 'Hurricane',
    'Cyclone', 'Tempest', 'Blizzard', 'Inferno', 'Glacier', 'Meteor', 'Comet', 'Asteroid',
    'Satellite', 'Rocket', 'Missile', 'Torpedo', 'Bullet', 'Shell', 'Grenade', 'Bomb',
    'Explosion', 'Impact', 'Crash', 'Smash', 'Crush', 'Destroy', 'Annihilate', 'Obliterate',
    'Dominate', 'Conquer', 'Victory', 'Triumph', 'Champion', 'Legend', 'Hero', 'Warrior',
    'Fighter', 'Soldier', 'Marine', 'Ranger', 'Commando', 'Special', 'Elite', 'Pro', 'Master'
  ];
  
  const clans = [
    { name: 'Elite Phantoms', tag: 'EPH' }, { name: 'Shadow Legion', tag: 'SHD' },
    { name: 'Digital Hunters', tag: 'DGH' }, { name: 'Neon Wolves', tag: 'NWF' },
    { name: 'Cyber Storm', tag: 'CYB' }, { name: 'Outback Warriors', tag: 'OBW' },
    { name: 'Brazilian Elite', tag: 'BRE' }, { name: 'Rising Sun', tag: 'RSN' },
    { name: 'Nordic Legends', tag: 'NOR' }, { name: 'Seoul Squad', tag: 'SEO' },
    { name: 'Alpha Strike', tag: 'AST' }, { name: 'Omega Force', tag: 'OMG' },
    { name: 'Delta Squad', tag: 'DLT' }, { name: 'Gamma Ray', tag: 'GMR' },
    { name: 'Beta Team', tag: 'BTA' }, { name: 'Sigma Elite', tag: 'SGM' }
  ];
  
  const servers = [
    'Atlas Main [2x]', 'Atlas EU [2x]', 'Atlas US [2x]', 'Atlas Asia [2x]', 
    'Atlas AU [2x]', 'Atlas Hardcore [1x]', 'Atlas PvP [3x]', 'Atlas Vanilla [1x]'
  ];
  
  const additionalPlayers: PlayerData[] = [];
  
  // Generate ACS scores that create a good distribution across ranks
  // Start from 2500 and go down to 800 to cover all rank tiers
  let startACS = 2500;
  
  for (let i = 0; i < 90; i++) {
    const clan = clans[Math.floor(Math.random() * clans.length)];
    const server = servers[Math.floor(Math.random() * servers.length)];
    const baseName = baseNames[Math.floor(Math.random() * baseNames.length)];
    const suffix = Math.floor(Math.random() * 9999);
    const username = `${baseName}${suffix}`;
    
    // Decrease ACS gradually with some randomness
    const acsVariation = Math.floor(Math.random() * 50) - 25; // ±25 variation
    const acs = Math.max(800, startACS - Math.floor(i * 18) + acsVariation);
    
    // Generate stats that correlate with ACS
    const level = Math.floor(50 + (acs / 50));
    const kills = Math.floor(800 + (acs * 0.8) + Math.random() * 500);
    const deaths = Math.floor(kills / (1.5 + (acs / 3000)));
    const kdr = kills / deaths;
    const playtimeHours = Math.floor(80 + (level * 2) + Math.random() * 100);
    const playtime = `${playtimeHours}h ${Math.floor(Math.random() * 60)}m`;
    
    const previousRank = 11 + i + Math.floor(Math.random() * 3) - 1;
    const currentRank = 11 + i;
    
    additionalPlayers.push({
      id: (11 + i).toString(),
      username,
      level,
      kills,
      deaths,
      kdr: Math.round(kdr * 100) / 100,
      playtime,
      clan: clan.name,
      clanTag: clan.tag,
      lastSeen: '2024-01-' + (15 + Math.floor(Math.random() * 5)).toString(),
      server,
      rank: currentRank,
      previousRank,
      acs
    });
  }
  
  return additionalPlayers;
};

const mockClans: ClanData[] = [
  {
    id: '1',
    name: 'Elite Phantoms',
    tag: 'EPH',
    members: 28,
    totalKills: 45672,
    averageKDR: 3.84,
    totalPlaytime: '2847h',
    leader: 'ShadowCommander',
    acs: 2847,
    rank: 1,
    previousRank: 1,
    region: 'North America'
  },
  {
    id: '2',
    name: 'Shadow Legion',
    tag: 'SHD',
    members: 32,
    totalKills: 42156,
    averageKDR: 3.67,
    totalPlaytime: '3124h',
    leader: 'EliteSniper47',
    acs: 2743,
    rank: 2,
    previousRank: 3,
    region: 'Europe'
  },
  {
    id: '3',
    name: 'Digital Hunters',
    tag: 'DGH',
    members: 25,
    totalKills: 38943,
    averageKDR: 3.92,
    totalPlaytime: '2456h',
    leader: 'TacticalMaster',
    acs: 2698,
    rank: 3,
    previousRank: 2,
    region: 'Asia Pacific'
  }
];

type LeaderboardTab = 'players' | 'clans' | 'weekly' | 'monthly';
type SortOption = 'acs' | 'kdr' | 'kills' | 'playtime' | 'level';

// Rank emblem component - just the image with tooltip
const RankEmblem = ({ position, acs }: { position: number; acs: number }) => {
  const rank = getRankFromPosition(position, acs);
  
  return (
    <img 
      src={rank.image} 
      alt={rank.name}
      className="w-6 h-6 object-contain"
      title={`${rank.name} - ${rank.description}`}
    />
  );
};

export default function LeaderboardsPage() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('players');
  const [sortBy, setSortBy] = useState<SortOption>('acs');
  const [searchQuery, setSearchQuery] = useState('');
  const [serverFilter, setServerFilter] = useState('all');
  
  // Lazy initialization of all players to prevent blocking during module load
  const allPlayers = useMemo(() => [...mockPlayers, ...generateAdditionalPlayers()], []);
  
  const [players, setPlayers] = useState<PlayerData[]>(allPlayers);
  const [clans, setClans] = useState<ClanData[]>(mockClans);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers(prev => prev.map(player => ({
        ...player,
        kills: player.kills + Math.floor(Math.random() * 3),
        deaths: player.deaths + Math.floor(Math.random() * 2)
      })));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const filteredPlayers = players
    .filter(player => {
      const matchesSearch = player.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           player.clan.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesServer = serverFilter === 'all' || player.server.includes(serverFilter);
      return matchesSearch && matchesServer;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'acs': return b.acs - a.acs;
        case 'kdr': return b.kdr - a.kdr;
        case 'kills': return b.kills - a.kills;
        case 'level': return b.level - a.level;
        default: return a.rank - b.rank;
      }
    });

  const getRankChange = (current: number, previous: number) => {
    const change = previous - current;
    if (change > 0) return { direction: 'up', value: change, color: 'text-green-400' };
    if (change < 0) return { direction: 'down', value: Math.abs(change), color: 'text-red-400' };
    return { direction: 'same', value: 0, color: 'text-gray-400' };
  };

  const tabs = [
    { id: 'players', label: 'Players', icon: Trophy },
    { id: 'clans', label: 'Teams', icon: Users },
    { id: 'weekly', label: 'Weekly', icon: Calendar },
    { id: 'monthly', label: 'Monthly', icon: Star }
  ];

  return (
    <div className="bg-gray-950 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-light text-white mb-4">
              Performance Analytics
            </h1>
            <p className="text-lg text-gray-400 font-light">
              Comprehensive competitive metrics and player statistics across all Atlas servers
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-xl mb-8">
          <div className="flex border-b border-gray-700/50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as LeaderboardTab)}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-5 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-white border-b-2 border-red-500 bg-gray-800'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Controls */}
          <div className="p-6 bg-gray-800/30">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search players or teams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-80 transition-all duration-200"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-4 py-2.5 bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                >
                  <option value="acs">Atlas Score</option>
                  <option value="kdr">K/D Ratio</option>
                  <option value="kills">Eliminations</option>
                  <option value="level">Level</option>
                </select>
                <select
                  value={serverFilter}
                  onChange={(e) => setServerFilter(e.target.value)}
                  className="px-4 py-2.5 bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                >
                  <option value="all">All Servers</option>
                  <option value="Atlas Main">Atlas Main</option>
                  <option value="Atlas EU">Atlas EU</option>
                  <option value="Atlas Hardcore">Atlas Hardcore</option>
                </select>
              </div>
              <div className="text-sm text-gray-400">
                Top {Math.min(100, filteredPlayers.length)} {activeTab === 'clans' ? 'teams' : 'players'} shown
              </div>
            </div>
          </div>
        </div>



        {/* Data Table */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700/50 bg-gray-800/20">
            <h2 className="text-lg font-medium text-white">
              {activeTab === 'players' ? 'Top 100 Player Rankings' : 
               activeTab === 'clans' ? 'Top Team Rankings' : 
               `Top 100 ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Leaderboard`}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Sorted by {sortBy === 'acs' ? 'Atlas Competitive Score' : sortBy.toUpperCase()}
            </p>
          </div>
          
          <div className="overflow-x-auto">
            {activeTab === 'clans' ? (
              <table className="w-full">
                <thead className="bg-gray-800/30 border-b border-gray-700/50">
                  <tr>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">ACS</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Team</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Members</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Avg K/D</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Total Kills</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Leader</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Region</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  {clans.map((clan, index) => {
                    const rankChange = getRankChange(clan.rank, clan.previousRank);
                    return (
                      <tr key={clan.id} className="hover:bg-gray-800/20 transition-all duration-200">
                        <td className="py-4 px-6">
                          <span className="text-sm font-medium text-red-400">{clan.acs.toLocaleString()}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-white">{index + 1}</span>
                            <div className={`flex items-center gap-1 text-xs ${rankChange.color}`}>
                              {rankChange.direction === 'up' && <ChevronUp size={12} />}
                              {rankChange.direction === 'down' && <ChevronDown size={12} />}
                              {rankChange.direction !== 'same' && rankChange.value}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <div className="text-sm font-medium text-white">{clan.name}</div>
                            <div className="text-sm text-red-400">[{clan.tag}]</div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-white">{clan.members}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-white">{clan.averageKDR.toFixed(2)}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-white">{clan.totalKills.toLocaleString()}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-white">{clan.leader}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800/50 backdrop-blur-sm text-gray-300 border border-gray-700/30">
                            {clan.region}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-800/30 border-b border-gray-700/50">
                  <tr>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">ACS</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Player</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Level</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">K/D</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Eliminations</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Playtime</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  {filteredPlayers.slice(0, 100).map((player, index) => {
                    const rankChange = getRankChange(player.rank, player.previousRank);
                    return (
                      <tr key={player.id} className="hover:bg-gray-800/20 transition-all duration-200">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <RankEmblem position={index + 1} acs={player.acs} />
                            <span className="text-sm font-medium text-red-400">{player.acs.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-white">{index + 1}</span>
                            <div className={`flex items-center gap-1 text-xs ${rankChange.color}`}>
                              {rankChange.direction === 'up' && <ChevronUp size={12} />}
                              {rankChange.direction === 'down' && <ChevronDown size={12} />}
                              {rankChange.direction !== 'same' && rankChange.value}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm font-medium text-white">{player.username}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-white">{player.level}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`text-sm font-medium ${
                            player.kdr >= 3 ? 'text-white' :
                            player.kdr >= 2 ? 'text-gray-300' :
                            'text-gray-400'
                          }`}>
                            {player.kdr.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-white">{player.kills.toLocaleString()}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-white">{player.playtime}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl hover:bg-gray-800/30 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Active Players</p>
                <p className="text-2xl font-light text-white">1,247</p>
              </div>
              <div className="p-3 bg-gray-800/50 backdrop-blur-sm rounded-xl">
                <Trophy className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl hover:bg-gray-800/30 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Active Teams</p>
                <p className="text-2xl font-light text-white">89</p>
              </div>
              <div className="p-3 bg-gray-800/50 backdrop-blur-sm rounded-xl">
                <Users className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl hover:bg-gray-800/30 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Eliminations</p>
                <p className="text-2xl font-light text-white">2.8M</p>
              </div>
              <div className="p-3 bg-gray-800/50 backdrop-blur-sm rounded-xl">
                <Target className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl hover:bg-gray-800/30 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Hours Today</p>
                <p className="text-2xl font-light text-white">15.2K</p>
              </div>
              <div className="p-3 bg-gray-800/50 backdrop-blur-sm rounded-xl">
                <TrendingUp className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 