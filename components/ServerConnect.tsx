'use client';

import { Copy, Users, Globe } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const servers = [
  { region: 'EU', name: 'EU5X', players: 45, maxPlayers: 200, lastWipe: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), wipeInterval: 7, type: 'Vanilla+' }, // Weekly (wiped 5 days ago)
  { region: 'EU', name: 'EU10X', players: 87, maxPlayers: 200, lastWipe: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), wipeInterval: 14, type: 'Modded' }, // Bi-weekly (wiped 10 days ago)
  { region: 'EU', name: 'EU 3X', players: 92, maxPlayers: 175, lastWipe: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), wipeInterval: 7, type: 'PvP' }, // Weekly (wiped 3 days ago)
  { region: 'NA', name: 'NA5X', players: 123, maxPlayers: 200, lastWipe: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), wipeInterval: 7, type: 'Vanilla+' }, // Weekly (wiped 1 day ago)
  { region: 'NA', name: 'NA10X', players: 156, maxPlayers: 200, lastWipe: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), wipeInterval: 30, type: 'Modded' }, // Monthly (wiped 15 days ago)
  { region: 'AU', name: 'AU 3X', players: 23, maxPlayers: 150, lastWipe: new Date(Date.now() - 2 * 60 * 60 * 1000), wipeInterval: 7, type: 'PvP' }, // Just wiped (2 hours ago)
  { region: 'EU', name: 'EU2X MONTHLY', players: 89, maxPlayers: 150, lastWipe: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), wipeInterval: 30, type: 'Long-term' }, // Monthly (wiped 20 days ago)
  { region: 'EU', name: 'EU2X MEDIUM', players: 34, maxPlayers: 100, lastWipe: new Date(Date.now() - 6 * 60 * 60 * 1000), wipeInterval: 14, type: 'Casual' }, // Just wiped (6 hours ago)
  { region: 'EU', name: 'EU2X QUAD', players: 67, maxPlayers: 150, lastWipe: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), wipeInterval: 7, type: 'Hardcore' }, // Weekly (wiped 4 days ago)
  { region: 'NA', name: 'NA2X MONTHLY', players: 78, maxPlayers: 150, lastWipe: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), wipeInterval: 30, type: 'Long-term' }, // Monthly (wiped 25 days ago)
];

function WipeTimer({ lastWipe, wipeInterval }: { lastWipe: Date, wipeInterval: number }) {
  const [timeDisplay, setTimeDisplay] = useState('');
  const [isJustWiped, setIsJustWiped] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const timeSinceWipe = now.getTime() - lastWipe.getTime();
      const hoursToMs = 60 * 60 * 1000;
      const daysToMs = 24 * hoursToMs;
      const nextWipe = new Date(lastWipe.getTime() + (wipeInterval * daysToMs));
      
      // Check if less than 12 hours since wipe
      if (timeSinceWipe < 12 * hoursToMs) {
        setIsJustWiped(true);
        const hours = Math.floor(timeSinceWipe / hoursToMs);
        const minutes = Math.floor((timeSinceWipe % hoursToMs) / (60 * 1000));
        setTimeDisplay(`${hours}h ${minutes}m ago`);
      } else {
        setIsJustWiped(false);
        const timeUntilWipe = nextWipe.getTime() - now.getTime();
        
        if (timeUntilWipe > 0) {
          const days = Math.floor(timeUntilWipe / daysToMs);
          const hours = Math.floor((timeUntilWipe % daysToMs) / hoursToMs);
          const minutes = Math.floor((timeUntilWipe % hoursToMs) / (60 * 1000));
          const seconds = Math.floor((timeUntilWipe % (60 * 1000)) / 1000);
          
          if (days > 0) {
            setTimeDisplay(`${days}d ${hours}h`);
          } else if (hours > 0) {
            setTimeDisplay(`${hours}h ${minutes}m`);
          } else if (minutes > 0) {
            setTimeDisplay(`${minutes}m ${seconds}s`);
          } else {
            setTimeDisplay(`${seconds}s`);
          }
        } else {
          setTimeDisplay('Wipe due');
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000); // Update every second for real-time countdown
    return () => clearInterval(interval);
  }, [lastWipe, wipeInterval]);

  return (
    <div className="text-center text-xs flex items-center justify-center gap-1">
      <div className={`font-medium ${isJustWiped ? 'text-green-400' : 'text-yellow-400'}`}>
        {isJustWiped ? 'Just Wiped' : 'Wipes in'}
      </div>
      <div className="text-white font-mono text-xs">
        {timeDisplay}
      </div>
    </div>
  );
}

export default function ServerConnect() {
  const [typeFilter, setTypeFilter] = useState<'All' | 'Vanilla' | 'Modded'>('All');
  const [regionFilter, setRegionFilter] = useState<'All' | 'EU' | 'NA' | 'AU'>('All');
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);
  const [animatedStats, setAnimatedStats] = useState({
    playersOnline: 0,
    activeServers: 0,
    regions: 0
  });
  const sectionRef = useRef<HTMLElement>(null);

  // Initialize visible cards array
  useEffect(() => {
    setVisibleCards(new Array(servers.length).fill(false));
  }, []);

  const filteredServers = servers.filter(server => {
    const typeMatch = typeFilter === 'All' || 
      (typeFilter === 'Vanilla' && (server.type === 'Vanilla+' || server.type === 'PvP' || server.type === 'Casual' || server.type === 'Hardcore')) ||
      (typeFilter === 'Modded' && (server.type === 'Modded' || server.type === 'Long-term'));
    
    const regionMatch = regionFilter === 'All' || server.region === regionFilter;
    
    return typeMatch && regionMatch;
  });

  // Calculate final stats
  const finalStats = {
    playersOnline: filteredServers.reduce((acc, server) => acc + server.players, 0),
    activeServers: filteredServers.length,
    regions: new Set(filteredServers.map(s => s.region)).size
  };

  // Animate numbers counting up
  const animateNumber = (target: number, key: keyof typeof animatedStats, delay: number = 0) => {
    setTimeout(() => {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current = Math.min(increment * step, target);
        
        setAnimatedStats(prev => ({
          ...prev,
          [key]: Math.floor(current)
        }));
        
        if (step >= steps || current >= target) {
          setAnimatedStats(prev => ({
            ...prev,
            [key]: target
          }));
          clearInterval(timer);
        }
      }, duration / steps);
    }, delay);
  };

  // Intersection Observer for section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          // Start number animations with delays
          animateNumber(finalStats.playersOnline, 'playersOnline', 500);
          animateNumber(finalStats.activeServers, 'activeServers', 700);
          animateNumber(finalStats.regions, 'regions', 900);
          
          // Stagger card animations
          const cards = new Array(servers.length).fill(false);
          servers.forEach((_, index) => {
            setTimeout(() => {
              setVisibleCards(prev => {
                const newCards = [...prev];
                newCards[index] = true;
                return newCards;
              });
            }, index * 100); // 100ms delay between each card
          });
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [finalStats.playersOnline, finalStats.activeServers, finalStats.regions]);

  const getRegionStyle = (region: string) => {
    switch (region) {
      case 'EU':
        return {
          bg: 'bg-gradient-to-br from-blue-500/20 to-blue-600/10',
          border: 'border-blue-400/30',
          text: 'text-blue-300',
          flag: 'bg-blue-500'
        };
      case 'NA':
        return {
          bg: 'bg-gradient-to-br from-red-500/20 to-red-600/10',
          border: 'border-red-400/30',
          text: 'text-red-300',
          flag: 'bg-red-500'
        };
      case 'AU':
        return {
          bg: 'bg-gradient-to-br from-green-500/20 to-green-600/10',
          border: 'border-green-400/30',
          text: 'text-green-300',
          flag: 'bg-green-500'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-500/20 to-gray-600/10',
          border: 'border-gray-400/30',
          text: 'text-gray-300',
          flag: 'bg-gray-500'
        };
    }
  };

  const handleCopyConnect = (serverName: string) => {
    const connectString = `connect atlas-${serverName.toLowerCase().replace(/\s+/g, '-')}.rust.com:28015`;
    navigator.clipboard.writeText(connectString);
    console.log(`Copied: ${connectString}`);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-black overflow-hidden flex items-center"
    >
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-50"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/Media/2025-06-22 17-01-13_3.mp4" type="video/mp4" />
      </video>
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,0,0,0.03)_0%,transparent_70%)]"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative w-full">
        <div className="relative max-w-7xl mx-auto px-6 py-16">
         {/* Section Header */}
         <div className={`text-center mb-12 transition-all duration-1000 transform ${
           isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
         }`}>
           <div className="flex items-center justify-center gap-4 mb-6">
             <div className="w-1 h-8 bg-[#E60000]"></div>
             <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-[0.3em]">
               SERVER-NETWORK
             </h2>
           </div>
           <p className="text-gray-400 text-lg max-w-2xl mx-auto">
             Join thousands of players across our global network of high-performance servers
           </p>
         </div>

         {/* Stats Bar */}
         <div className={`grid grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto transition-all duration-1000 delay-200 transform ${
           isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
         }`}>
           <div className="text-center">
             <div className="text-2xl font-bold text-white mb-1 font-mono">
               {animatedStats.playersOnline.toLocaleString()}
             </div>
             <div className="text-sm text-gray-400 uppercase tracking-wider">Players Online</div>
           </div>
           <div className="text-center">
             <div className="text-2xl font-bold text-white mb-1 font-mono">
               {animatedStats.activeServers}
             </div>
             <div className="text-sm text-gray-400 uppercase tracking-wider">Active Servers</div>
           </div>
           <div className="text-center">
             <div className="text-2xl font-bold text-white mb-1 font-mono">
               {animatedStats.regions}
             </div>
             <div className="text-sm text-gray-400 uppercase tracking-wider">Regions</div>
           </div>
         </div>

         {/* Filters */}
         <div className={`flex justify-center gap-8 mb-8 transition-all duration-1000 delay-400 transform ${
           isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
         }`}>
           {/* Type Filter */}
           <div className="flex items-center gap-3">
             <span className="text-gray-400 text-sm font-medium">Type:</span>
             <div className="flex gap-2">
               {(['All', 'Vanilla', 'Modded'] as const).map((type) => (
                 <button
                   key={type}
                   onClick={() => setTypeFilter(type)}
                   className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                     typeFilter === type
                       ? 'bg-[#E60000] text-white shadow-lg shadow-red-500/25'
                       : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                   }`}
                 >
                   {type}
                 </button>
               ))}
             </div>
           </div>

           {/* Region Filter */}
           <div className="flex items-center gap-3">
             <span className="text-gray-400 text-sm font-medium">Region:</span>
             <div className="flex gap-2">
               {(['All', 'EU', 'NA', 'AU'] as const).map((region) => (
                 <button
                   key={region}
                   onClick={() => setRegionFilter(region)}
                   className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                     regionFilter === region
                       ? 'bg-[#E60000] text-white shadow-lg shadow-red-500/25'
                       : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                   }`}
                 >
                   {region}
                 </button>
               ))}
             </div>
           </div>
         </div>
       </div>

       {/* Server Grid - Full Width */}
       <div className="w-full">
         <div className="grid grid-cols-5 gap-6 justify-items-center px-8 mb-12 max-w-7xl mx-auto">
           {filteredServers.map((server, index) => {
             const regionStyle = getRegionStyle(server.region);
             const originalIndex = servers.findIndex(s => s.name === server.name);
             
             return (
               <div
                 key={index}
                 className={`relative group cursor-pointer transform transition-all duration-700 hover:scale-105 hover:-translate-y-1 w-56 h-52 ${
                   visibleCards[originalIndex] 
                     ? 'opacity-100 translate-y-0 scale-100' 
                     : 'opacity-0 translate-y-12 scale-95'
                 }`}
                 style={{ transitionDelay: `${originalIndex * 100}ms` }}
               >
                 {/* Main Card */}
                 <div className={`
                   relative bg-gray-900/60 backdrop-blur-sm border ${regionStyle.border} 
                   rounded-lg p-5 hover:bg-gray-800/70 transition-all duration-300
                   shadow-lg hover:shadow-xl h-full flex flex-col justify-between
                 `}>
                   
                   {/* Top Section */}
                   <div className="flex-1">
                     {/* Header */}
                     <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-2">
                         <div className={`w-2.5 h-2.5 rounded-full ${regionStyle.flag} shadow-sm`}></div>
                         <span className={`text-base font-bold ${regionStyle.text} uppercase tracking-wider`}>
                           {server.region}
                         </span>
                       </div>
                       <div className="text-right ml-2">
                         <h3 className="text-white font-bold text-lg whitespace-nowrap">
                           {server.name}
                         </h3>
                       </div>
                     </div>

                     {/* Wipe Timer */}
                     <div className="text-center text-base mb-4">
                       <WipeTimer lastWipe={server.lastWipe} wipeInterval={server.wipeInterval} />
                     </div>

                     {/* Player Count */}
                     <div className="flex items-center justify-between mb-5">
                       <div className="flex items-center gap-2">
                         <Users size={14} className="text-gray-400" />
                         <span className="text-white font-medium text-base">
                           {server.players}<span className="text-gray-400">/{server.maxPlayers}</span>
                         </span>
                       </div>
                       <div className="w-16 bg-gray-700 rounded-full h-1.5 overflow-hidden">
                         <div 
                           className={`h-full transition-all duration-500 ${regionStyle.flag}`}
                           style={{ width: `${(server.players / server.maxPlayers) * 100}%` }}
                         ></div>
                       </div>
                     </div>
                   </div>

                   {/* Bottom Section - Connect Button */}
                   <div>
                     <button
                       onClick={() => handleCopyConnect(server.name)}
                       className="w-full bg-gradient-to-r from-gray-800 to-gray-700 hover:from-[#E60000] hover:to-[#B30000] 
                                text-gray-300 hover:text-white border border-gray-600 hover:border-red-500
                                rounded py-3 text-base font-bold uppercase tracking-wider 
                                transition-all duration-300 flex items-center justify-center gap-2
                                shadow-md hover:shadow-lg hover:shadow-red-500/25
                                transform hover:scale-[1.02] active:scale-[0.98]"
                     >
                       <Copy size={12} />
                       Connect
                     </button>
                   </div>
                 </div>
               </div>
             );
           })}
         </div>
       </div>

       {/* Bottom Info */}
       <div className={`text-center transition-all duration-1000 delay-1000 transform ${
         isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
       }`}>
         <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-full">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-gray-300 text-sm">
             Press <kbd className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs font-mono">F1</kbd> in-game and paste to connect
           </span>
         </div>
       </div>
      </div>
    </section>
  );
}