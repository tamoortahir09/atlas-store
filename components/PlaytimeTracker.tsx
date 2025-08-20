'use client';

import React, { useState, useEffect } from 'react';
import { Gift, Zap, Star, Trophy, Crown, Diamond, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

interface Milestone {
  hours: number;
  label: string;
  reward: string;
  description: string;
  icon: LucideIcon;
  rarity: Rarity;
  unlocked: boolean;
  items: string[];
}

export default function PlaytimeTracker() {
  const [currentHours, setCurrentHours] = useState(156); // Example: 156 hours this month
  const [animatedHours, setAnimatedHours] = useState(0);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  // Milestone rewards with different tiers
  const milestones: Milestone[] = [
    {
      hours: 10,
      label: "10H",
      reward: "Starter Pack",
      description: "Basic survival kit with essential items",
      icon: Gift,
      rarity: "common",
      unlocked: true,
      items: ["Bandages x5", "Water Bottle", "Basic Tools"]
    },
    {
      hours: 200,
      label: "200H",
      reward: "Legendary Cache",
      description: "Rare and powerful items for elite players",
      icon: Diamond,
      rarity: "legendary",
      unlocked: false,
      items: ["Legendary Weapon", "Rare Skin", "Exclusive Badge"]
    },
    {
      hours: 300,
      label: "300H",
      reward: "Master's Arsenal",
      description: "Ultimate collection for master players",
      icon: Crown,
      rarity: "legendary",
      unlocked: false,
      items: ["Master Weapon Set", "Elite Skin Pack", "VIP Status"]
    },
    {
      hours: 500,
      label: "500H",
      reward: "Atlas Champion",
      description: "Exclusive rewards for Atlas champions",
      icon: Trophy,
      rarity: "mythic",
      unlocked: false,
      items: ["Champion Title", "Unique Skin", "Server Recognition"]
    },
    {
      hours: 750,
      label: "750H",
      reward: "Legend Status",
      description: "Reserved for the most dedicated players",
      icon: Diamond,
      rarity: "mythic",
      unlocked: false,
      items: ["Legend Badge", "Exclusive Access", "Special Privileges"]
    },
    {
      hours: 1000,
      label: "1000H",
      reward: "Atlas Elite",
      description: "The pinnacle of Atlas achievement",
      icon: Crown,
      rarity: "mythic",
      unlocked: false,
      items: ["Elite Status", "Ultimate Rewards", "Developer Recognition"]
    }
  ];

  const getRarityColor = (rarity: Rarity): string => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400';
      case 'uncommon': return 'text-green-400 border-green-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      case 'mythic': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getRarityBg = (rarity: Rarity): string => {
    switch (rarity) {
      case 'common': return 'bg-gray-800';
      case 'uncommon': return 'bg-gray-800';
      case 'rare': return 'bg-gray-800';
      case 'epic': return 'bg-gray-800';
      case 'legendary': return 'bg-gray-800';
      case 'mythic': return 'bg-gray-800';
      default: return 'bg-gray-800';
    }
  };

  // Calculate progress percentage
  const maxHours = Math.max(...milestones.map(m => m.hours));
  const progressPercentage = Math.min((currentHours / maxHours) * 100, 100);

  // Animate the hours counter
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = currentHours / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setAnimatedHours(Math.floor(increment * step));
      
      if (step >= steps) {
        setAnimatedHours(currentHours);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [currentHours]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  return (
    <section className="relative bg-gradient-to-b from-black via-gray-900 to-black py-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00FF94]/5 via-transparent to-[#00FF94]/5"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(0, 255, 148, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(0, 255, 148, 0.05) 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Character Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20"> 
        <div className="w-full h-full bg-gradient-to-t from-black via-transparent to-black"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-1 h-8 bg-[#00FF94]"></div>
            <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-[0.3em]">
              EARN-REWARDS
            </h2>
          </div>

          {/* Current Hours Display */}
          <div className="relative">
            <div className="text-8xl font-bold text-white mb-4" style={{
              textShadow: '0 0 20px rgba(0, 255, 148, 0.5)',
              background: 'linear-gradient(45deg, #00FF94, #ffffff)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {formatNumber(animatedHours)}
            </div>
            <p className="text-gray-400 text-lg uppercase tracking-wider">
              Your Hours This Month
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative mb-16">
          {/* Main Progress Line */}
          <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#00FF94] to-[#00FF94]/60 transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>

          {/* Milestone Markers */}
          <div className="absolute inset-0 flex justify-between items-center">
            {milestones.map((milestone, index) => {
              const position = (milestone.hours / maxHours) * 100;
              const isUnlocked = currentHours >= milestone.hours;
              const isCurrent = !isUnlocked && currentHours >= (milestones[index - 1]?.hours || 0);
              
              return (
                <div
                  key={milestone.hours}
                  className="absolute transform -translate-x-1/2"
                  style={{ left: `${position}%` }}
                >
                  {/* Milestone Icon */}
                  <div
                    className="relative cursor-pointer group"
                    onClick={() => setSelectedMilestone(milestone)}
                  >
                    <div className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 ${
                      isUnlocked 
                        ? `${getRarityBg(milestone.rarity)} ${getRarityColor(milestone.rarity)} shadow-lg` 
                        : isCurrent
                        ? 'bg-gray-800 border-[#00FF94] text-[#00FF94] shadow-lg shadow-[#00FF94]/25'
                        : 'bg-gray-800 border-gray-600 text-gray-500'
                    }`}>
                      <milestone.icon className="w-8 h-8" />
                      {isUnlocked && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00FF94] rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>

                    {/* Milestone Label */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                      <div className={`text-sm font-bold ${
                        isUnlocked ? 'text-[#00FF94]' : isCurrent ? 'text-[#00FF94]' : 'text-gray-500'
                      }`}>
                        {milestone.label}
                      </div>
                    </div>

                    {/* Tooltip */}
                    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                      <div className={`bg-gray-900 border rounded-lg p-3 text-center min-w-48 ${getRarityColor(milestone.rarity)}`}>
                        <div className="font-bold text-white text-sm mb-1">{milestone.reward}</div>
                        <div className="text-xs text-gray-400 mb-2">{milestone.description}</div>
                        <div className="text-xs">
                          {milestone.items.map((item, i) => (
                            <div key={i} className="text-gray-300">• {item}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-[#00FF94] to-[#00CC75] hover:from-[#00CC75] hover:to-[#00AA5E] text-black font-bold py-4 px-8 rounded-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#00FF94]/25">
            Join Atlas Servers
          </button>
          <p className="text-gray-400 text-sm mt-4">
            Play across all Atlas servers and earn rewards
          </p>
        </div>
      </div>
    </section>
  );
} 