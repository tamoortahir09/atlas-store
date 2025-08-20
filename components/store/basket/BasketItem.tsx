'use client';

import React, { useState } from 'react';
import { X, Gift, ExternalLink, ArrowUp, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import type { CartItem } from '@/lib/store/types';

interface BasketItemProps {
  item: CartItem;
  gemPackages: any[];
  ranks: any[];
  onGiftClick: (itemId: string, itemName: string) => void;
  onRemoveItem: (itemId: string) => void;
  onRemoveGift: (itemId: string) => void;
  onQuickGemUpgrade: (currentItem: CartItem, nextGemPackage: any) => void;
  onReplaceWithRank: (queueSkipItem: CartItem, selectedRank: any) => void;
}

export function BasketItem({
  item,
  gemPackages,
  ranks,
  onGiftClick,
  onRemoveItem,
  onRemoveGift,
  onQuickGemUpgrade,
  onReplaceWithRank
}: BasketItemProps) {
  const [showRankDropdown, setShowRankDropdown] = useState(false);
  
  const isGemItem = item.type === 'gems';
  const isRankItem = item.type === 'rank';
  const isQueueSkipItem = item.name?.toLowerCase().includes('queue skip') && item.type !== 'rank';
  
  const getGemUpgradeInfo = (item: CartItem) => {
    if (!isGemItem) return null;
    
    const currentGemPackage = gemPackages.find(pkg => 
      pkg.payNowProductId === item.payNowProductId ||
      pkg.id.toString() === item.payNowProductId ||
      pkg.name === item.name
    );
    
    if (!currentGemPackage) return null;
    
    // Find the next gem package with higher amount
    const nextGemPackage = gemPackages.find(pkg => 
      pkg.amount > currentGemPackage.amount && 
      pkg.payNowProductId
    );
    
    if (!nextGemPackage) return null;
    
    return {
      currentGemPackage,
      nextGemPackage,
      additionalCost: nextGemPackage.price - currentGemPackage.price,
      additionalGems: nextGemPackage.amount - currentGemPackage.amount
    };
  };

  const gemUpgradeInfo = getGemUpgradeInfo(item);

  // Function to get the appropriate image for the item
  const getItemImage = () => {
    switch (item.type) {
      case 'rank':
        // Find the rank by matching PayNow product ID or name
        const matchingRank = ranks.find(rank => 
          rank.payNowProductId === item.payNowProductId ||
          rank.id === item.payNowProductId ||
          rank.displayName === item.name ||
          rank.name === item.name
        );
        return matchingRank?.imageUrl;
      
      case 'gems':
        // Find the gem package by matching PayNow product ID or name
        const matchingGemPackage = gemPackages.find(pkg => 
          pkg.payNowProductId === item.payNowProductId ||
          pkg.id.toString() === item.payNowProductId ||
          pkg.name === item.name
        );
        // Return PayNow image or fallback to default atlas gem image
        return matchingGemPackage?.imageUrl || '/atlas-gem.png';
      
      case 'accessory':
      case 'bundle':
      default:
        return null; // No specific image available
    }
  };

  // Function to get fallback emoji if no image is available
  const getFallbackIcon = () => {
    switch (item.type) {
      case 'rank':
        return '👑';
      case 'gems':
        return '💎';
      case 'accessory':
        return '✨';
      case 'bundle':
        return '📦';
      default:
        return '🎮';
    }
  };

  const getItemColor = () => {
    switch (item.type) {
      case 'rank':
        return 'border-yellow-600/40 bg-yellow-600/10';
      case 'gems':
        return 'border-purple-600/40 bg-purple-600/10';
      case 'accessory':
        return 'border-blue-500/40 bg-blue-500/10';
      case 'bundle':
        return 'border-[#E60000]/40 bg-[#E60000]/10';
      default:
        return 'border-[#333333]/50 bg-[#1A1A1A]/10';
    }
  };

  const itemImage = getItemImage();

  return (
    <div className={`bg-[#1A1A1A]/50 border-2 ${getItemColor()} rounded-xl p-4 sm:p-6 transition-all duration-200 hover:shadow-lg`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          {/* Item Icon/Image */}
          <div className="w-12 h-12 rounded-lg bg-[#1A1A1A]/50 border border-[#333333]/50 flex items-center justify-center overflow-hidden">
            {itemImage ? (
              <img
                src={itemImage}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-200 hover:scale-110"
                onError={(e) => {
                  // Fallback to emoji if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="text-2xl">${getFallbackIcon()}</div>`;
                  }
                }}
              />
            ) : (
              <div className="text-2xl">
                {getFallbackIcon()}
              </div>
            )}
          </div>
          
          {/* Item Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {item.name}
                  {item.isGift && (
                    <span className="ml-2 inline-flex items-center gap-1 bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-xs font-medium">
                      <Gift className="w-3 h-3" />
                      Gift
                    </span>
                  )}
                </h3>
                <p className="text-[#999999] text-sm capitalize">{item.type}</p>
              </div>
              <div className="text-right">
                <div className="flex flex-col items-end">
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatCurrency(item.originalPrice, 'USD')}
                    </span>
                  )}
                  <p className="text-xl font-bold text-white">
                    {formatCurrency(item.price, 'USD')}
                  </p>
                  {item.saleValue && item.saleValue > 0 && (
                    <span className="text-sm text-green-400">
                      Save {formatCurrency(item.saleValue, 'USD')}
                    </span>
                  )}
                </div>
                <p className="text-[#999999] text-sm">{item.subscription && !item.isGift ? 'Renews Monthly' : 'Qty: ' + item.quantity}</p>
              </div>
            </div>

            {/* Gift Recipient Info */}
            {item.isGift && item.giftTo && (
              <div className="mb-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-300 text-sm font-medium">
                      Gift for: {item.giftTo.displayName || item.giftTo.id}
                    </p>
                    <p className="text-[#999999] text-xs">
                      Platform: {item.giftTo.platform}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveGift(item.id)}
                    className="text-[#999999] hover:text-[#E60000] transition-colors"
                    title="Remove gift recipient"
                  >
                    <X className="w-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Quick Upgrade for Gems */}
            {isGemItem && gemUpgradeInfo && !item.isGift && (
              <div className="mb-3 p-3 bg-blue-600/10 border border-blue-600/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 text-sm font-medium">
                      Upgrade to {gemUpgradeInfo.nextGemPackage.name}
                    </p>
                    <p className="text-[#CCCCCC] text-xs">
                      +{formatCurrency(gemUpgradeInfo.additionalCost, 'USD')} more • +{gemUpgradeInfo.additionalGems} gems
                    </p>
                  </div>
                  <button
                    onClick={() => onQuickGemUpgrade(item, gemUpgradeInfo.nextGemPackage)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1"
                  >
                    <ArrowUp className="w-3 h-3" />
                    Upgrade
                  </button>
                </div>
              </div>
            )}

            {/* Queue Skip Upsell */}
            {isQueueSkipItem && !item.isGift && (
              <div className="mb-3 bg-gradient-to-br from-green-900/20 via-gray-800/40 to-emerald-900/20 rounded-lg border border-green-500/20 p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/25 to-emerald-600/25 text-green-300">
                          <TrendingUp className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-green-200">💡 Did you know our ranks all include queue skip?</h4>
                          <p className="text-xs text-green-200/70">
                            If you're playing our modded servers, get better value and upgrade to a rank package
                          </p>
                        </div>
                      </div>
                    
                                          <button
                        onClick={() => setShowRankDropdown(!showRankDropdown)}
                        className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white text-xs px-3 py-2 transition-all duration-300 rounded-lg"
                      >
                      {showRankDropdown ? 'Hide' : 'Show Options'}
                    </button>
                  </div>
                  
                  {/* Rank Options Dropdown */}
                  {showRankDropdown && (
                    <div className="space-y-2">
                      {ranks
                        .filter(rank => rank.price > 0) // Only paid ranks
                        .filter(rank => {
                          const rankName = rank.displayName || rank.name;
                          const currentItemName = item.name;
                          
                          if (rankName === currentItemName) return false;
                          if (rank.id && item.payNowProductId && rank.id.toString() === item.payNowProductId) return false;
                          
                          return true;
                        })
                        .sort((a, b) => a.price - b.price)
                        .map((rank) => {
                          const costDifference = rank.price - item.price;
                          const isMoreExpensive = costDifference > 0;
                          const isCheaper = costDifference < 0;
                          
                          return (
                            <div
                              key={rank.id}
                              className="flex items-center justify-between bg-gray-700/40 rounded-lg p-3 border border-gray-600/30 hover:border-yellow-500/20 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 flex-shrink-0 rounded overflow-hidden bg-gradient-to-br from-gray-600/50 to-gray-700/50 border border-gray-500/30">
                                  {rank.imageUrl ? (
                                    <img
                                      src={rank.imageUrl}
                                      alt={rank.displayName || rank.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const parent = target.parentElement;
                                        if (parent) {
                                          parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-sm">👑</div>';
                                        }
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-sm">👑</div>
                                  )}
                                </div>
                                <div>
                                  <h5 className="text-sm font-semibold text-white">{rank.displayName || rank.name}</h5>
                                  <p className="text-xs text-gray-400">Queue skip + exclusive perks</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <div className="text-sm font-bold text-white">
                                    {formatCurrency(rank.price, 'USD')}
                                  </div>
                                  {isMoreExpensive && (
                                    <div className="text-xs text-yellow-300">
                                      +{formatCurrency(costDifference, 'USD')}
                                    </div>
                                  )}
                                  {isCheaper && (
                                    <div className="text-xs text-green-300">
                                      -{formatCurrency(Math.abs(costDifference), 'USD')}
                                    </div>
                                  )}
                                  {costDifference === 0 && (
                                    <div className="text-xs text-green-300">
                                      Same price!
                                    </div>
                                  )}
                                </div>
                                
                                <button
                                  onClick={() => onReplaceWithRank(item, rank)}
                                  className="px-4 py-2 text-xs font-medium rounded-lg transition-colors bg-purple-600 hover:bg-purple-500 text-white"
                                >
                                  Replace
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      
                      {ranks.filter(rank => rank.price > 0).length === 0 && (
                        <div className="text-center text-gray-400 py-2 text-sm">
                          No rank packages available.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              {!item.isGift && (
                <button
                  onClick={() => onGiftClick(item.id, item.name)}
                  className="flex items-center gap-1 text-purple-300 hover:text-purple-400 text-sm font-medium transition-colors"
                >
                  <Gift className="w-4 h-4" />
                  Make this a gift
                </button>
              )}
              
              <button
                onClick={() => onRemoveItem(item.id)}
                className="flex items-center gap-1 text-[#E60000] hover:text-[#cc0000] text-sm font-medium transition-colors ml-auto"
              >
                <X className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 