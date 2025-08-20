'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { usePayNowProducts } from '@/hooks/usePayNowProducts';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  ArrowRight, 
  Diamond, 
  Star,
  Package,
  Crown
} from 'lucide-react';
import type { CartItem } from '@/lib/store/types';

interface TargetedUpsellProps {
  className?: string;
}

interface UpsellOffer {
  id: string;
  type: 'gem_upgrade' | 'bundle_offer' | 'vip_explanation';
  title: string;
  description: string;
  currentPrice: number;
  newPrice: number;
  savings: number;
  icon: React.ReactNode;
  buttonText: string;
  payNowProductId?: string;
  additionalGems?: number; // For gem upgrades - additional gems
  totalGems?: number; // For gem upgrades - total gems in the new package
  higherRanks?: any[]; // For VIP explanations - higher ranks available
  vipRank1?: any; // For VIP explanations - current VIP rank
  bundleDetails?: {
    extraRanks: any[];
    gems: number;
    totalValue: number;
    currentValue: number;
    savings: number;
  };
}

function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function TargetedUpsells({ className = '' }: TargetedUpsellProps) {
  const { items, addItem, removeItem } = useCart();
  const { ranks, gemPackages, bundles, isLoadingProducts } = usePayNowProducts();
  const { toast } = useToast();
  
  const [offers, setOffers] = useState<UpsellOffer[]>([]);
  const [showContent, setShowContent] = useState(false);
  const [upgradedOffers, setUpgradedOffers] = useState<Set<string>>(new Set());
  const [lastCartSignature, setLastCartSignature] = useState<string>('');
  const [expandedVipOptions, setExpandedVipOptions] = useState<string | null>(null);

  // Animation delay
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Reset upgraded offers when cart changes significantly
  useEffect(() => {
    const cartSignature = items.map(item => `${item.type}-${item.payNowProductId}`).sort().join('|');
    
    // If cart contents changed significantly (not just additions), reset upgraded offers
    if (lastCartSignature && cartSignature !== lastCartSignature) {
      // Check if items were removed (not just added)
      const previousItemCount = lastCartSignature.split('|').filter(Boolean).length;
      const currentItemCount = items.length;
      
      if (currentItemCount < previousItemCount) {
        setUpgradedOffers(new Set());
      }
    }
    
    setLastCartSignature(cartSignature);
  }, [items, lastCartSignature]);

  // Calculate targeted upsells based on cart contents
  useEffect(() => {
    if (!items.length || !ranks.length || !gemPackages.length || isLoadingProducts) {
      setOffers([]);
      return;
    }

    const newOffers: UpsellOffer[] = [];
    
    // 1. VIP PACKAGE UPSELLING FOR MODDED SERVERS
    const rankItems = items.filter(item => item.type === 'rank' && !item.isGift);
    
    // Check if they have VIP rank 1 (position 1) and offer upgrades to all higher ranks
    const vipRank1Items = rankItems.filter(rankItem => {
      const rank = ranks.find(r => r.payNowProductId === rankItem.payNowProductId);
      return rank && rank.position === 1;
    });

    if (vipRank1Items.length > 0) {
      const vipRank1 = ranks.find(r => r.position === 1);
      const higherRanks = ranks.filter(r => r.position > 1).sort((a, b) => a.position - b.position);
      
      const vipExplanationOfferId = 'vip-modded-server-explanation';
      
      if (!upgradedOffers.has(vipExplanationOfferId) && vipRank1 && higherRanks.length > 0) {
        newOffers.push({
          id: vipExplanationOfferId,
          type: 'vip_explanation',
          title: 'Upgrade Your VIP Package',
          description: 'Get queue skip + exclusive perks for modded servers',
          currentPrice: vipRank1.price,
          newPrice: higherRanks[0].price,
          savings: higherRanks[0].price - vipRank1.price,
          icon: <Crown className="h-5 w-5" />,
          buttonText: 'View Options',
          higherRanks,
          vipRank1
        });
      }
    }

    // 2. BUNDLE OFFERS FOR RANK HOLDERS
    if (rankItems.length >= 1 && bundles.length > 0) {
      const ultimateBundle = bundles[0]; // Assuming first bundle is the ultimate one
      const currentRankTotal = rankItems.reduce((sum, item) => sum + item.price, 0);
      
      // Check if any of the ranks they have are included in the bundle
      const hasIncludedRanks = rankItems.some(rankItem => {
        const rankProductId = rankItem.payNowProductId;
        return rankProductId && ultimateBundle.include.includes(rankProductId);
      });
      
      const bundleOfferId = `bundle-offer-${ultimateBundle.id}`;
      
      // Skip if this bundle upgrade has already been processed
      if (!upgradedOffers.has(bundleOfferId) && ultimateBundle && ultimateBundle.price > currentRankTotal && hasIncludedRanks) {
        const additionalCost = ultimateBundle.price - currentRankTotal;
        
        // Calculate what ranks they DON'T have yet (extra ranks they'll get)
        const currentRankProductIds = new Set(rankItems.map(item => item.payNowProductId));
        const allBundleRanks = ranks.filter(rank => 
          ultimateBundle.include.includes(rank.payNowProductId || rank.id.toString())
        ).sort((a, b) => a.position - b.position);
        
        const extraRanks = allBundleRanks.filter(rank => 
          !currentRankProductIds.has(rank.payNowProductId || rank.id.toString())
        );
        
        // Calculate total individual value vs bundle price
        const totalIndividualValue = allBundleRanks.reduce((sum, rank) => sum + rank.price, 0);
        
        // Calculate gem value for bonus gems (e.g., 1500 gems)
        const gemValue = (() => {
          // Find the best gem package rate to value the bonus gems
          const sortedGems = [...gemPackages].sort((a, b) => (a.price / a.amount) - (b.price / b.amount));
          const bestRate = sortedGems[0]?.price / sortedGems[0]?.amount || 0.01;
          return (ultimateBundle.freeGems || 1500) * bestRate;
        })();
        
        // Total value including ranks and gems
        const totalValueWithGems = totalIndividualValue + gemValue;
        const actualSavings = totalValueWithGems - ultimateBundle.price;
        
        newOffers.push({
          id: bundleOfferId,
          type: 'bundle_offer',
          title: 'Bundle Upgrade',
          description: `Get every rank package + ${ultimateBundle.freeGems || 1500} bonus gems for just ${formatCurrency(additionalCost)} more`,
          currentPrice: currentRankTotal,
          newPrice: ultimateBundle.price,
          savings: additionalCost,
          icon: <Package className="h-5 w-5" />,
          buttonText: 'Upgrade Now!',
          payNowProductId: ultimateBundle.payNowProductId,
          bundleDetails: {
            extraRanks: extraRanks,
            gems: ultimateBundle.freeGems || 1500,
            totalValue: totalValueWithGems,
            currentValue: currentRankTotal,
            savings: actualSavings
          }
        });
      }
    }

    setOffers(newOffers);
  }, [items, ranks, gemPackages, bundles, upgradedOffers, isLoadingProducts]);

  const handleAcceptOffer = (offer: UpsellOffer) => {
    if (offer.type === 'vip_explanation') {
      // Toggle expanded state for VIP rank options
      setExpandedVipOptions(expandedVipOptions === offer.id ? null : offer.id);
      return;
    }
    
    if (offer.type === 'bundle_offer') {
      // This is a bundle offer - find the bundle to add
      const bundle = bundles.find(b => b.payNowProductId === offer.payNowProductId);
      if (!bundle) {
        toast({
          title: "Error",
          description: "Bundle not found. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Validate bundle has PayNow product ID
      if (!bundle.payNowProductId) {
        toast({
          title: "Error",
          description: "This bundle is not available for purchase at the moment.",
          variant: "destructive",
        });
        return;
      }
      
      // Remove all current rank items that are included in the bundle
      const rankItemsToRemove = items.filter(item => 
        item.type === 'rank' && 
        !item.isGift && 
        item.payNowProductId && 
        bundle.include.includes(item.payNowProductId)
      );
      
      // Also remove queue skip items since bundle includes all ranks
      const queueSkipItemsToRemove = items.filter(item => 
        item.type === 'queue_skip' && !item.isGift
      );
      
      [...rankItemsToRemove, ...queueSkipItemsToRemove].forEach(item => {
        removeItem(item.id);
      });
      
      // Add the bundle
      addItem({
        id: `bundle-${bundle.id}`,
        type: 'bundle',
        quantity: 1,
        price: bundle.price,
        name: bundle.displayName || bundle.name,
        payNowProductId: bundle.payNowProductId,
      });
      
      // Mark this offer as upgraded
      setUpgradedOffers(prev => new Set([...Array.from(prev), offer.id]));
      
      toast({
        title: "Bundle Added",
        description: `${bundle.displayName || bundle.name} has been added to your cart.`,
      });
    }
  };

  const handleUpgradeToRank = (rank: any, vipRank1: any) => {
    // Validate that the selected rank has a PayNow product ID
    if (!rank.payNowProductId) {
      toast({
        title: "Error",
        description: "This rank is not available for purchase at the moment.",
        variant: "destructive",
      });
      return;
    }

    // Remove the current VIP rank 1
    const vipItems = items.filter(item => {
      const itemRank = ranks.find(r => r.payNowProductId === item.payNowProductId);
      return item.type === 'rank' && !item.isGift && itemRank && itemRank.position === 1;
    });
    
    vipItems.forEach(item => {
      removeItem(item.id);
    });
    
    // Add the new rank
    addItem({
      id: `rank-${rank.id}`,
      type: 'rank',
      quantity: 1,
      price: rank.price,
      name: rank.displayName || rank.name || `Rank ${rank.position}`,
      payNowProductId: rank.payNowProductId,
    });
    
    // Mark the VIP explanation as upgraded and close options
    setUpgradedOffers(prev => new Set([...Array.from(prev), 'vip-modded-server-explanation']));
    setExpandedVipOptions(null);
    
    toast({
      title: "Rank Upgraded",
      description: `Upgraded to ${rank.displayName || rank.name}`,
    });
  };

  if (!offers.length) return null;

  return (
    <div className={`${className} ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700 ease-out space-y-6`}>
      {offers.map((offer, index) => (
        offer.type === 'bundle_offer' ? (
          // Bundle offers use the custom container style
          <div key={offer.id} className={`transition-all duration-700 ease-out ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${index * 100}ms` }}>
            <div className="relative bg-gradient-to-br from-gray-800/95 via-gray-900/95 to-gray-950/95 rounded-xl border-2 border-neutral-700/40 p-5 shadow-xl shadow-neutral-900/50">
              {/* Animated top accent bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl animate-pulse"></div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400 shadow-md">
                    {offer.icon}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-white">{offer.title}</h3>
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 text-xs font-bold rounded-full border border-blue-500/30 shadow-md">
                        ALL RANKS INCLUDED
                      </span>
                    </div>
                    {offer.bundleDetails && (
                      <div className="space-y-1">
                        <div className="text-gray-300 font-medium">
                          <span className="font-bold">Includes:</span>{' '}
                          <div className="inline-flex flex-wrap gap-1 mt-1">
                            {ranks.filter(rank => 
                              offer.bundleDetails && 
                              bundles[0] && 
                              bundles[0].include.includes(rank.payNowProductId || rank.id.toString())
                            ).sort((a, b) => a.position - b.position).map((rank) => {
                              const rankName = (rank.displayName || `Rank ${rank.position}`).toLowerCase();
                              let rankColor = '#93c5fd'; // default blue
                              let badgeColor = 'bg-blue-500/20 border-blue-500/40'; // default blue
                              
                              if (rankName.includes('prime')) {
                                rankColor = '#60a5fa'; // blue
                                badgeColor = 'bg-blue-500/20 border-blue-500/40';
                              }
                              else if (rankName.includes('mythic')) {
                                rankColor = '#c084fc'; // purple  
                                badgeColor = 'bg-purple-500/20 border-purple-500/40';
                              }
                              else if (rankName.includes('vanguard')) {
                                rankColor = '#f87171'; // red
                                badgeColor = 'bg-red-500/20 border-red-500/40';
                              }
                              else if (rankName.includes('champion')) {
                                rankColor = '#facc15'; // yellow
                                badgeColor = 'bg-yellow-500/20 border-yellow-500/40';
                              }
                              
                              return (
                                <span 
                                  key={rank.id}
                                  className={`px-1.5 py-0.5 rounded border text-xs font-medium ${badgeColor}`}
                                  style={{ color: rankColor, fontSize: '10px' }}
                                >
                                  {rank.displayName || `Rank ${rank.position}`}
                                </span>
                              );
                            })}
                            <span className="px-1.5 py-0.5 rounded border bg-yellow-500/20 border-yellow-500/40 text-yellow-300 font-medium" style={{ fontSize: '10px' }}>
                              {offer.bundleDetails.gems.toLocaleString()} gems
                            </span>
                            <span className="px-1.5 py-0.5 rounded border bg-green-500/20 border-green-500/40 text-green-300 font-medium" style={{ fontSize: '10px' }}>
                              Custom Colored Name
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <div className="text-2xl font-bold text-white">
                    +{formatCurrency(offer.savings)}
                  </div>
                  <Button
                    onClick={() => handleAcceptOffer(offer)}
                    disabled={upgradedOffers.has(offer.id)}
                    size="sm"
                    className={`font-bold px-4 py-2 transition-all duration-300 ${
                      upgradedOffers.has(offer.id)
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                    }`}
                  >
                    {upgradedOffers.has(offer.id) ? (
                      <span className="flex items-center gap-2">
                        <span className="text-green-100">✓</span>
                        Upgraded!
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {offer.buttonText}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // VIP explanation offers use simpler styling
          <div key={offer.id} className={`transition-all duration-700 ease-out ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${index * 100}ms` }}>
            <div className="bg-neutral-800/40 rounded-lg border border-neutral-700/40 p-4">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-medium text-white">Better Value Options</h3>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-700/20 border border-neutral-600/30 hover:border-neutral-500/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-purple-500/20 text-purple-400">
                    {offer.icon}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{offer.title}</span>
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                        Better Value!
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-400">
                      {offer.description}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {offer.type === 'vip_explanation' && expandedVipOptions === offer.id && offer.higherRanks && offer.vipRank1 && (
                    <div className="flex gap-2">
                      {offer.higherRanks.slice(0, 3).map((rank: any) => {
                        const additionalCost = rank.price - offer.vipRank1!.price;
                        return (
                          <Button
                            key={rank.id}
                            onClick={() => handleUpgradeToRank(rank, offer.vipRank1)}
                            size="sm"
                            className="bg-purple-500/80 hover:bg-purple-600 text-white text-xs px-2 py-1 h-auto"
                          >
                            {rank.displayName || `Rank ${rank.position}`} (+{formatCurrency(additionalCost)})
                          </Button>
                        );
                      })}
                    </div>
                  )}
                  
                  <Button
                    onClick={() => handleAcceptOffer(offer)}
                    size="sm"
                    disabled={upgradedOffers.has(offer.id)}
                    className={`${
                      upgradedOffers.has(offer.id)
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                    }`}
                  >
                    {upgradedOffers.has(offer.id) ? (
                      <>✓ Upgraded!</>
                    ) : (
                      <>
                        {expandedVipOptions === offer.id ? 'Hide' : 'View'} Options
                        <ArrowRight className={`h-3 w-3 ml-1 transition-transform ${
                          expandedVipOptions === offer.id ? 'rotate-90' : ''
                        }`} />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      ))}
    </div>
  );
} 