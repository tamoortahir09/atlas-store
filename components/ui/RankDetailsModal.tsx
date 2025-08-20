"use client";
import React, { useState } from 'react';
import type { Rank, TagConfiguration } from '@/lib/store/types';
import { X, Globe, Gift, Zap, Palette, Package, Clock, RefreshCw, Shield, Star, Users, Crown, Home, Target, TrendingUp, Play, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/formatters';
import { useToast } from '@/hooks/use-toast';
import { Portal } from './Portal';

interface InventoryItem {
  name: string;
  quantity: number;
  image: string;
  shortname: string;
  position: number;
}

interface InventorySection {
  items: InventoryItem[];
  cooldown: string;
  availableUntil: string;
}

interface ServerInventories {
  resources: InventoryItem[];
  weapons: InventoryItem[];
}

interface TagInventory {
  tag: string;
  resources: any[];
  weapons: any[];
}

interface RankDetailsModalProps {
  rank: Rank;
  isOpen: boolean;
  onClose: () => void;
  onOpenRankModal?: (rankPosition: number) => void;
}

const CUSTOM_COLOR_PRICE = 4.99;

// Helper function to get item display name
const getItemDisplayName = (shortname: string): string => {
  const itemNames: { [key: string]: string } = {
    'wood': 'Wood',
    'stones': 'Stones',
    'metal.fragments': 'Metal Fragments',
    'cloth': 'Cloth',
    'leather': 'Leather',
    'metal.refined': 'High Quality Metal',
    'sulfur': 'Sulfur',
    'gunpowder': 'Gunpowder',
    'explosives': 'Explosives',
    'rifle.ak': 'AK47',
    'rifle.lr300': 'LR-300',
    'smg.mp5': 'MP5A4',
    'pistol.m92': 'M92 Pistol',
    'shotgun.pump': 'Pump Shotgun',
    'ammo.rifle.hv': 'HV 5.56 Rifle Ammo',
    'ammo.pistol.hv': 'HV Pistol Ammo',
    'syringe.medical': 'Medical Syringe',
    'bandage': 'Bandage',
  };
  return itemNames[shortname] || shortname.replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Helper function to format time display
const secondsToDisplay = (seconds: number): string => {
  if (seconds === 0) return 'None';
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
};

// Bonus Benefits Configuration
interface BonusBenefit {
  id: string;
  order: number; // Display order (lower numbers first)
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  getValue: (rank: Rank, config?: TagConfiguration | null) => string;
  isAvailable: (rank: Rank, config?: TagConfiguration | null) => boolean;
  upgradeTarget?: number;
  upgradeRankName?: string;
  colorScheme: {
    bg: string;
    iconBg: string;
    iconColor: string;
    textColor: string;
    upgradeBg: string;
    upgradeText: string;
  };
}

const bonusBenefitsConfig: BonusBenefit[] = [
  {
    id: 'extraGems',
    order: 1,
    icon: Gift,
    title: 'Gems Per Hour',
    getValue: (rank, config) => config?.extraGems?.toLocaleString() || '0',
    isAvailable: () => true, // Always available
    colorScheme: {
      bg: 'border-gray-700/50 hover:border-blue-500/30',
      iconBg: 'bg-blue-500/20 group-hover:bg-blue-500/30',
      iconColor: 'text-blue-400',
      textColor: 'text-blue-400',
      upgradeBg: 'bg-blue-600/20 hover:bg-blue-600/30',
      upgradeText: 'text-blue-400 border-blue-500/30'
    }
  },
  {
    id: 'queueSkip',
    order: 3,
    icon: Users,
    title: 'Queue Skip',
    getValue: (rank, config) => config?.queueSkip ? 'Enabled' : 'Not Available',
    isAvailable: (rank, config) => config?.queueSkip === true,
    upgradeTarget: 2,
    upgradeRankName: 'Prime+',
    colorScheme: {
      bg: 'border-gray-700/50 hover:border-green-500/30',
      iconBg: 'bg-green-500/20 group-hover:bg-green-500/30',
      iconColor: 'text-green-400',
      textColor: 'text-green-400',
      upgradeBg: 'bg-blue-600/20 hover:bg-blue-600/30',
      upgradeText: 'text-blue-400 border-blue-500/30'
    }
  },
  {
    id: 'rpMultiplier',
    order: 11,
    icon: TrendingUp,
    title: 'RP Multiplier',
    getValue: (rank, config) => `${config?.rpMultiplier || 1}x`,
    isAvailable: (rank, config) => (config?.tag != '3x'),
    colorScheme: {
      bg: 'border-gray-700/50 hover:border-yellow-500/30',
      iconBg: 'bg-yellow-500/20 group-hover:bg-yellow-500/30',
      iconColor: 'text-yellow-400',
      textColor: 'text-yellow-400',
      upgradeBg: 'bg-yellow-600/20 hover:bg-yellow-600/30',
      upgradeText: 'text-yellow-400 border-yellow-500/30'
    }
  },
  {
    id: 'loadoutCooldown',
    order: 10,
    icon: Clock,
    title: 'Loadout Cooldown',
    getValue: (rank, config) => config?.loadoutCoolDown === 0 ? 'No Cooldown' : secondsToDisplay(config?.loadoutCoolDown || 0),
    isAvailable: (rank, config) => (config?.tag != '3x'),
    colorScheme: {
      bg: 'border-gray-700/50 hover:border-blue-500/30',
      iconBg: 'bg-blue-500/20 group-hover:bg-blue-500/30',
      iconColor: 'text-blue-400',
      textColor: 'text-blue-400',
      upgradeBg: 'bg-blue-600/20 hover:bg-blue-600/30',
      upgradeText: 'text-blue-400 border-blue-500/30'
    }
  },
  {
    id: 'teleportTimer',
    order: 7,
    icon: Globe,
    title: 'Teleport Timer',
    getValue: (rank, config) => config?.teleportTimer === 0 ? 'Instant' : secondsToDisplay(config?.teleportTimer || 0),
    isAvailable: (rank, config) => (config?.tag != '3x'),
    colorScheme: {
      bg: 'border-gray-700/50 hover:border-green-500/30',
      iconBg: 'bg-green-500/20 group-hover:bg-green-500/30',
      iconColor: 'text-green-400',
      textColor: 'text-green-400',
      upgradeBg: 'bg-green-600/20 hover:bg-green-600/30',
      upgradeText: 'text-green-400 border-green-500/30'
    }
  },
  {
    id: 'homeAmount',
    order: 9,
    icon: Home,
    title: 'Home Amount',
    getValue: (rank, config) => (config?.homeAmount || 1).toString(),
    isAvailable: (rank, config) => (config?.tag != '3x'),
    colorScheme: {
      bg: 'border-gray-700/50 hover:border-indigo-500/30',
      iconBg: 'bg-indigo-500/20 group-hover:bg-indigo-500/30',
      iconColor: 'text-indigo-400',
      textColor: 'text-indigo-400',
      upgradeBg: 'bg-gradient-to-br from-indigo-600/45 via-indigo-600/40',
      upgradeText: 'text-indigo-400 border-indigo-500/30'
    }
  },
  {
    id: 'hqmUpgrade',
    order: 4,
    icon: Shield,
    title: 'HQM Upgrade',
    getValue: (rank, config) => config?.hqmUpgrade ? 'Enabled' : 'Not Available',
    isAvailable: (rank, config) => (config?.hqmUpgrade === true && config?.tag != '3x'),
    upgradeTarget: 4,
    upgradeRankName: 'Vanguard+',
    colorScheme: {
      bg: 'border-gray-700/50 hover:border-green-500/30',
      iconBg: 'bg-green-500/20 group-hover:bg-green-500/30',
      iconColor: 'text-green-400',
      textColor: 'text-green-400',
      upgradeBg: 'bg-gradient-to-br from-red-600/45 via-red-600/40',
      upgradeText: 'text-red-400 border-red-500/30'
    }
  },
  {
    id: 'craftUncraftable',
    order: 5,
    icon: Zap,
    title: 'Craft Uncraftable',
    getValue: (rank, config) => config?.craftUncraftable ? 'Enabled' : 'Not Available',
    isAvailable: (rank, config) => (config?.craftUncraftable === true && config?.tag != '3x'),
    upgradeTarget: 5,
    upgradeRankName: 'Champion',
    colorScheme: {
      bg: 'border-gray-700/10 hover:border-pink-500/30',
      iconBg: 'bg-pink-500/20 group-hover:bg-pink-500/30',
      iconColor: 'text-pink-400',
      textColor: 'text-pink-400',
      upgradeBg: 'bg-gradient-to-br from-yellow-600/75 via-yellow-600/40 to-gray-800/95',
      upgradeText: 'text-yellow-400 border-yellow-500/30'
    }
  },
  // {
  //   id: 'customColor',
  //   order: 6,
  //   icon: Palette,
  //   title: 'Custom Color',
  //   getValue: (rank, config) => config?.customColor ? 'Enabled' : 'Not Available',
  //   isAvailable: (rank, config) => config?.customColor === true,
  //   upgradeTarget: 5,
  //   upgradeRankName: 'Champion',
  //   colorScheme: {
  //     bg: 'border-gray-700/50 hover:border-purple-500/30',
  //     iconBg: 'bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-yellow-500/20 group-hover:from-purple-500/30 group-hover:via-pink-500/30 group-hover:to-yellow-500/30',
  //     iconColor: 'text-purple-400',
  //     textColor: 'text-purple-400',
  //     upgradeBg: 'bg-gray-800',
  //     upgradeText: 'text-gray-400 border-gray-500/30'
  //   }
  // },
  // {
  //   id: 'kits',
  //   order: 2,
  //   icon: Package,
  //   title: 'Starter Kits',
  //   getValue: (rank) => rank.kits ? 'Enabled' : 'Not Available',
  //   isAvailable: (rank) => rank.kits === true,
  //   upgradeTarget: 2,
  //   upgradeRankName: 'Prime+',
  //   colorScheme: {
  //     bg: 'border-gray-700/50 hover:border-cyan-500/30',
  //     iconBg: 'bg-cyan-500/20 group-hover:bg-cyan-500/30',
  //     iconColor: 'text-cyan-400',
  //     textColor: 'text-cyan-400',
  //     upgradeBg: 'bg-blue-600/20 hover:bg-blue-600/30',
  //     upgradeText: 'text-blue-400 border-blue-500/30'
  //   }
  // }
];

export function RankDetailsModal({ rank, isOpen, onClose, onOpenRankModal }: RankDetailsModalProps) {
  const [selectedServer, setSelectedServer] = useState<string>(rank.tags?.[2] || '10x');
  const [includeCustomColor, setIncludeCustomColor] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    // Validate PayNow product ID exists
    if (!rank.payNowProductId) {
      console.error('Rank missing PayNow product ID:', rank);
      toast({
        title: "Error",
        description: "This product is not available for purchase at the moment.",
        variant: "destructive",
      });
      return;
    }

    const cartItem = {
      id: `rank-${rank.id}`,
      type: 'rank' as const,
      quantity: 1,
      price: rank.price + (includeCustomColor ? CUSTOM_COLOR_PRICE : 0),
      name: `${rank.displayName || rank.name}${includeCustomColor ? ' (with Custom Colored Name)' : ''}`,
      payNowProductId: rank.payNowProductId,
    };

    addItem(cartItem);
    toast({
      title: "Added to Cart",
      description: `${cartItem.name} has been added to your cart`,
    });
    onClose();
  };

  const handleUpgradeToRank = (targetRankPosition: number) => {
    if (onOpenRankModal) {
      onClose();
      onOpenRankModal(targetRankPosition);
    }
  };

  // Get the current server's inventory data
  const getCurrentInventory = (): TagInventory | null => {
    if (!rank.inventories || !Array.isArray(rank.inventories)) return null;
    return rank.inventories.find((inv: TagInventory) => inv.tag === selectedServer) || null;
  };

  // Get the current server's configuration data
  const getCurrentConfiguration = (): TagConfiguration | null => {
    if (!rank.configurations || !Array.isArray(rank.configurations)) return null;
    return rank.configurations.find((config: TagConfiguration) => config.tag === selectedServer) || null;
  };

  if (!isOpen) return null;

  const isChampion = rank.position === 5;
  const isVanguard = rank.position === 4;
  const isMythic = rank.position === 3;
  const isPrime = rank.position === 2;
  const isVip = rank.position === 1;

  const currentInventory = getCurrentInventory();
  const currentConfiguration = getCurrentConfiguration();

  // Helper functions for checking time values
  const getLoadoutCooldownDisplay = (seconds: number) => secondsToDisplay(seconds);
  const getTeleportTimerDisplay = (seconds: number) => secondsToDisplay(seconds);

  // Check if available on all servers
  const isAvailableOnAllServers = rank.tags && rank.tags.length >= 3 && rank.tags.includes('3x') && rank.tags.includes('5x') && rank.tags.includes('10x');

  // Filter benefits based on availability or user preference
  const visibleBenefits = bonusBenefitsConfig
    .filter(benefit => {
      // You can add custom filtering logic here
      // For example, only show certain benefits for certain ranks
      return true; // Show all benefits for now
    })
    //.sort((a, b) => a.order - b.order); // Sort by order property

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        {/* Enhanced Background with Video/Pattern */}
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}>
          {/* Video Background */}
          <div className="absolute inset-0 opacity-20">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="https://cdn.atlasrust.com/StoreBG-Test.mp4" type="video/mp4" />
              {/* Fallback gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
            </video>
          </div>
          
          {/* Overlay pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-900/50 to-black/80" />
        </div>
        
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="relative bg-gradient-to-br from-gray-900/98 via-gray-800/98 to-black/98 
            w-full max-w-5xl rounded-2xl shadow-2xl border border-gray-600/30 backdrop-blur-xl
            transform transition-all duration-300 scale-100 ring-1 ring-gray-500/20">
            
            {/* Top accent bar */}
            <div className={`h-1 rounded-t-2xl ${
              isChampion ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
              isVanguard ? 'bg-gradient-to-r from-red-500 to-red-600' :
              isMythic ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
              isPrime ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
              'bg-gradient-to-r from-gray-500 to-gray-600'
            }`} />
            
            <div className="flex flex-col max-h-[85vh]">
              <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl border ${
                    isChampion ? 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-500/30' :
                    isVanguard ? 'bg-gradient-to-r from-red-600/20 to-red-600/20 border-red-500/30' :
                    isMythic ? 'bg-gradient-to-r from-purple-600/20 to-purple-600/20 border-purple-500/30' :
                    isPrime ? 'bg-gradient-to-r from-blue-600/20 to-blue-600/20 border-blue-500/30' :
                    'bg-gradient-to-r from-gray-600/20 to-gray-600/20 border-gray-500/30'
                  }`}>
                    <Crown className={`h-8 w-8 ${
                      isChampion ? 'text-yellow-400' :
                      isVanguard ? 'text-red-400' :
                      isMythic ? 'text-purple-400' :
                      isPrime ? 'text-blue-400' :
                      'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <h2 className={`text-3xl font-bold ${
                      isChampion ? 'text-yellow-400' :
                      isVanguard ? 'text-red-400' :
                      isMythic ? 'text-purple-400' :
                      isPrime ? 'text-blue-400' :
                      'text-gray-400'
                    }`}>
                      {rank.displayName || rank.name} Details
                    </h2>
                    <div className="flex items-center justify-between gap-4 mt-2 w-full">
                        <p className="text-gray-300 flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          {isAvailableOnAllServers ? 'Can be used across all servers' : `Available on ${rank.tags?.join(', ')} servers`}
                        </p>
                        {/* Server Selectors */}
                        <div className="flex items-center gap-2">
                          {rank.tags?.map((serverTag) => (
                            <button
                              key={serverTag}
                              onClick={() => setSelectedServer(serverTag)}
                              className={`
                                px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200
                                ${selectedServer === serverTag
                                  ? isChampion
                                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                    : isVanguard
                                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                      : isMythic
                                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                        : isPrime
                                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                  : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-700/50'
                                }
                              `}
                            >
                              {serverTag}
                            </button>
                          ))}
                        </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">

                {/* Dynamic Bonus Benefits Section */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-300 mb-6 flex items-center gap-3">
                    <Star className="h-6 w-6 text-yellow-400" />
                    Bonus Benefits
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {visibleBenefits.map((benefit) => {
                      const IconComponent = benefit.icon;
                      const isAvailable = benefit.isAvailable(rank, currentConfiguration);
                      const value = benefit.getValue(rank, currentConfiguration);
                      const colors = benefit.colorScheme;
                      
                      return (
                        <div 
                          key={benefit.id}
                          className={`bg-gray-800/60 backdrop-blur-sm p-4 rounded-xl border transition-all duration-200 group ${
                            isAvailable ? colors.bg : ((colors as any).bgDisabled || 'border-gray-700/50 bg-gray-900/20 backdrop-blur-sm')
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`h-10 w-10 flex items-center justify-center rounded-lg transition-colors ${
                              isAvailable ? colors.iconBg : 'bg-gray-600/20'
                            }`}>
                              <IconComponent className={`h-6 w-6 ${
                                isAvailable ? colors.iconColor : 'text-gray-500'
                              }`} />
                            </div>
                            <div>
                              <span className="text-gray-400 text-xs">{benefit.title}</span>
                              <div className={`font-bold text-lg -mt-1 ${
                                isAvailable ? colors.textColor : 'text-gray-500'
                              }`}>
                                {value}
                              </div>
                            </div>
                          </div>
                          {isAvailable ? (
                            <div className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">
                              ✓ Included
                            </div>
                          ) : benefit.upgradeTarget && value === 'Not Available' ? (
                            <button
                              onClick={() => handleUpgradeToRank(benefit.upgradeTarget!)}
                              disabled={benefit.title === 'Custom Color'}
                              className={`w-full text-xs font-medium py-1 px-2 rounded ${colors.upgradeBg} ${colors.upgradeText} border transition-colors`}
                            >
                              {benefit.title === 'Custom Color' ? 'Coming Soon' : `Available in ${benefit.upgradeRankName}`}
                            </button>
                          ) : <button className="w-full text-xs font-medium py-1 px-2 rounded bg-gray-500/20 text-gray-400 border transition-colors">
                            Not Eligible</button>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Enhanced Starter Kit Section */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-300 mb-6 flex items-center gap-3">
                    <Package className="h-6 w-6 text-cyan-400" />
                    Kit Details
                    <div className="flex items-center gap-2">
                          {rank.tags?.map((serverTag) => (
                            <button
                              key={serverTag}
                              onClick={() => setSelectedServer(serverTag)}
                              className={`
                                px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200
                                ${selectedServer === serverTag
                                  ? isChampion
                                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                    : isVanguard
                                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                      : isMythic
                                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                        : isPrime
                                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                  : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-700/50'
                                }
                              `}
                            >
                              {serverTag}
                            </button>
                          ))}
                        </div>
                  </h3>
                  {currentInventory ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Resources Column */}
                      <div className="space-y-6">
                        <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50">
                          <div className="p-4 border-b border-gray-700/50">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-green-500/20">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                              </div>
                              <h4 className="text-lg font-semibold text-gray-300">Resources</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-2 text-gray-400">
                                <Clock className="h-4 w-4" />
                                <span>Available until: </span>
                                <span className="text-gray-300">Wipe</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-400">
                                <RefreshCw className="h-4 w-4" />
                                <span>Cooldown: </span>
                                <span className="text-gray-300">{secondsToDisplay(currentConfiguration?.loadoutCoolDown || 0)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="grid grid-cols-6 gap-2">
                              {/* Main inventory slots - 30 slots (5 rows x 6 columns) */}
                              {Array.from({ length: 30 }).map((_, index) => {
                                const item = currentInventory.resources?.find((res: any) => res.position === index + 1);
                                return (
                                  <div 
                                    key={index}
                                    className="aspect-square bg-gray-900/50 rounded-lg border border-gray-700/50 p-1
                                      hover:border-gray-600 transition-colors relative group"
                                  >
                                    {item && (
                                      <>
                                        <img 
                                          src={`https://cdn.rustapi.io/images/thumbnails/${item.shortname}.png`}
                                          alt={getItemDisplayName(item.shortname)}
                                          className="w-full h-full object-contain"
                                          onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                          }}
                                        />
                                        {item.quantity > 1 && (
                                          <div className="absolute bottom-0.5 right-0.5 text-xs font-medium text-gray-300 bg-gray-900/90 px-1 rounded">
                                            {item.quantity.toLocaleString()}
                                          </div>
                                        )}
                                        <div className="absolute inset-0 bg-gray-900/90 opacity-0 group-hover:opacity-100 transition-opacity
                                          flex items-center justify-center">
                                          <div className="text-xs text-center text-gray-200 font-medium">
                                            {getItemDisplayName(item.shortname)}
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Weapons Column */}
                      <div className="space-y-6">
                        <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50">
                          <div className="p-4 border-b border-gray-700/50">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-red-500/20">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                              </div>
                              <h4 className="text-lg font-semibold text-gray-300">Weapons & Equipment</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-2 text-gray-400">
                                <Clock className="h-4 w-4" />
                                <span>Available until: </span>
                                <span className="text-gray-300">Wipe</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-400">
                                <RefreshCw className="h-4 w-4" />
                                <span>Cooldown: </span>
                                <span className="text-gray-300">{secondsToDisplay(currentConfiguration?.loadoutCoolDown || 0)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="grid grid-cols-6 gap-2">
                              {/* Main inventory slots - 30 slots (5 rows x 6 columns) */}
                              {Array.from({ length: 30 }).map((_, index) => {
                                const item = currentInventory.weapons?.find((weap: any) => weap.position === index + 1);
                                return (
                                  <div 
                                    key={index}
                                    className="aspect-square bg-gray-900/50 rounded-lg border border-gray-700/50 p-1
                                      hover:border-gray-600 transition-colors relative group"
                                  >
                                    {item && (
                                      <>
                                        <img 
                                          src={`https://cdn.rustapi.io/images/thumbnails/${item.shortname}.png`}
                                          alt={getItemDisplayName(item.shortname)}
                                          className="w-full h-full object-contain"
                                          onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                          }}
                                        />
                                        {item.quantity > 1 && (
                                          <div className="absolute bottom-0.5 right-0.5 text-xs font-medium text-gray-300 bg-gray-900/90 px-1 rounded">
                                            {item.quantity.toLocaleString()}
                                          </div>
                                        )}
                                        <div className="absolute inset-0 bg-gray-900/90 opacity-0 group-hover:opacity-100 transition-opacity
                                          flex items-center justify-center">
                                          <div className="text-xs text-center text-gray-200 font-medium">
                                            {getItemDisplayName(item.shortname)}
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No starter kit available for this rank</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Footer */}
              <div className="p-6 border-t border-gray-700/50 bg-gray-800/50 backdrop-blur-sm rounded-b-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-gray-400">Price</span>
                    <div className="flex flex-col">
                      <div className={`text-3xl font-bold ${
                        isChampion ? 'text-yellow-400' :
                        isVanguard ? 'text-red-400' :
                        isMythic ? 'text-purple-400' :
                        isPrime ? 'text-blue-400' :
                        'text-gray-400'
                      }`}>
                        {formatCurrency(rank.price + (includeCustomColor ? CUSTOM_COLOR_PRICE : 0), 'USD')}
                      </div>
                      {includeCustomColor && (
                        <div className="text-sm text-gray-400">
                          Includes Custom Colored Name (+{formatCurrency(CUSTOM_COLOR_PRICE, 'USD')})
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    className={`
                      w-full sm:w-auto min-w-[200px] h-[50px] text-lg
                      ${isChampion 
                        ? 'bg-gradient-to-r from-yellow-600 to-orange-500 hover:from-yellow-500 hover:to-orange-400 text-black'
                        : isVanguard
                          ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white'
                          : isMythic
                            ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white'
                            : isPrime
                              ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white'
                              : 'bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400 text-white'
                      }
                      font-bold transform transition-all duration-200
                      hover:scale-105 active:scale-95 shadow-xl backdrop-blur-sm
                    `}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
} 