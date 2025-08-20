'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Gift, CheckCircle, Info, X, Gem, Star, TrendingUp, Zap, Sparkles, Crown, Loader2 } from 'lucide-react';
import RankCard from './RankCard';
import GemCard from './GemCard';
import { GiftModal } from '@/components/ui/GiftModal';
import { RankDetailsModal } from '@/components/ui/RankDetailsModal';
import { VipDetailsModal } from '@/components/ui/VipDetailsModal';
import { usePayNowProducts } from '@/hooks/usePayNowProducts';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/lib/formatters';
import DitherBackground from '@/components/ui/animations/DitherBackground';
import type { CartItem, GemPackage } from '@/lib/store/types';

// Import the gem image
const atlasGemImage = '/atlas-gem.png';

const StorePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem, hasRankInCartForSelf, getRankInCartInfo, hasBundleInCartForSelf, getBundleInCartInfo } = useCart();
  const { user } = useAuth();
  const [showContent, setShowContent] = useState(false);
  const [showRankCards, setShowRankCards] = useState(false);
  const [selectedRankId, setSelectedRankId] = useState<string | null>(null);
  const [highlightRanks, setHighlightRanks] = useState(false);
  const [isBundleGiftModalOpen, setIsBundleGiftModalOpen] = useState(false);
  const [openRankModalId, setOpenRankModalId] = useState<string | null>(null);
  const rankRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const ranksSectionRef = useRef<HTMLElement | null>(null);
  
  // Currency (you can make this dynamic later)
  const currency = 'USD';
  // Get ranks, gems, and bundles from PayNow API
  const { ranks, gemPackages, bundles, isLoading } = usePayNowProducts();
  
  // Get the first bundle (Ultimate Bundle)
  const ultimateBundle = bundles[0];
  
  // Get ranks included in the bundle
  const includedRanks = ultimateBundle ? 
    ranks.filter(rank => ultimateBundle.include.includes(rank.id.toString())) : [];
  
  // Calculate bundle pricing
  const includedRanksTotal = includedRanks.reduce((sum, rank) => sum + rank.price, 0);
  
  // Bundle pricing - Use PayNow API final prices (including tax) like RankCard
  let bundlePrice = ultimateBundle?.price || 0; // Final price from PayNow (includes tax)
  let bundleOriginalPrice = ultimateBundle?.originalPrice || null; // Original price from PayNow
  let calculatedSalePrice = includedRanksTotal * (1 - (ultimateBundle?.discount || 25) / 100);
  
  // Real-time sale validation for bundle
  const bundleSaleEndDate = ultimateBundle?.saleEndDate;
  const bundleSaleIsActive = bundleSaleEndDate ? bundleSaleEndDate.getTime() > Date.now() : false;
  
  // Bundle discount detection - same logic as RankCard
  const hasPayNowData = ultimateBundle?.currency || ultimateBundle?.originalPrice || ultimateBundle?.payNowProductId;
  const baseBundleDiscount = bundleOriginalPrice && bundleOriginalPrice > bundlePrice;
  const hasBundleDiscount = baseBundleDiscount && bundleSaleIsActive;
  
  // Use PayNow final price when available (includes tax)
  const shouldUseCalculatedPrice = !ultimateBundle?.price && !hasPayNowData;
  if (shouldUseCalculatedPrice) {
    bundlePrice = calculatedSalePrice;
    bundleOriginalPrice = includedRanksTotal;
  }
  
  const bundleSavings = (bundleOriginalPrice || includedRanksTotal) - bundlePrice;
  
  // Calculate bundle discount percentage for display
  const getBundleDiscountPercentage = () => {
    if (!hasBundleDiscount || !bundleOriginalPrice) return 0;
    
    const calculatedPercentage = Math.round(((bundleOriginalPrice - bundlePrice) / bundleOriginalPrice) * 100);
    
    // Validate with PayNow API discount data if available
    if (ultimateBundle?.discountType === 'percent' && ultimateBundle?.discountAmount) {
      const apiPercentage = ultimateBundle.discountAmount >= 100 
        ? Math.round(ultimateBundle.discountAmount / 100)  // Basis points
        : Math.round(ultimateBundle.discountAmount);       // Direct percentage
      
      console.log('Bundle Discount Calculation', {
        calculatedFromPrices: `${calculatedPercentage}%`,
        fromPayNowAPI: `${apiPercentage}%`,
        usingCalculated: true,
        currentPrice: bundlePrice,
        originalPrice: bundleOriginalPrice,
        saleEndDate: bundleSaleEndDate?.toISOString(),
        saleIsActive: bundleSaleIsActive
      });
    }
    
    return calculatedPercentage;
  };
  
  const bundleDiscountPercentage = getBundleDiscountPercentage();

  const handleAddToCart = (item: any, type: 'rank' | 'gem' | 'bundle') => {
    console.log(`Adding ${type} to cart: ${item.displayName || item.name}`, {
      itemId: item.id,
      itemType: type,
    });
    addItem(item);
  };

  const handleAddGemToCart = (gemPackage: GemPackage) => {
    const cartItem: CartItem = {
      id: gemPackage.id.toString(),
      type: 'gems',
      quantity: 1,
      price: gemPackage.price,
      originalPrice: gemPackage.originalPrice,
      saleValue: gemPackage.saleValue,
      name: gemPackage.name,
      payNowProductId: gemPackage.payNowProductId || gemPackage.id.toString(),
    };
    addItem(cartItem);
  };

  // Instant loading - no delays for maximum responsiveness
  useEffect(() => {
    setShowContent(true);
    setShowRankCards(true);
  }, []);

  // Handle URL query parameters for highlighting
  useEffect(() => {
    const highlight = searchParams?.get('highlight');
    if (highlight === 'ranks') {
      // Enable highlighting
      setHighlightRanks(true);
      
      // Remove highlighting after 4 seconds
      setTimeout(() => {
        setHighlightRanks(false);
      }, 4000);
    }
  }, [searchParams]);

  // Handle rank navigation from modal
  useEffect(() => {
    if (selectedRankId && rankRefs.current[selectedRankId]) {
      const element = rankRefs.current[selectedRankId];
      element?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      // Add highlight effect
      element?.classList.add('ring-4', 'ring-rank-champion-500/50', 'ring-opacity-75');
      setTimeout(() => {
        element?.classList.remove('ring-4', 'ring-rank-champion-500/50', 'ring-opacity-75');
      }, 2000);
      
      setSelectedRankId(null);
    }
  }, [selectedRankId]);

  // Check if user already owns the bundle or has it in cart
  const userOwnsBundle = React.useMemo(() => {
    // You can implement this based on your user data
    return false;
  }, [user, ultimateBundle]);

  const bundleInCartForSelf = React.useMemo(() => {
    if (!ultimateBundle) return false;
    
    // Check if bundle is in cart for self-purchase (not as gift)
    return hasBundleInCartForSelf(ultimateBundle.payNowProductId || ultimateBundle.id.toString());
  }, [ultimateBundle, hasBundleInCartForSelf]);

  const shouldShowBundleGiftMode = userOwnsBundle || bundleInCartForSelf;

  const handleBuyAllRanks = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!ultimateBundle) return;
    
    if (shouldShowBundleGiftMode) {
      setIsBundleGiftModalOpen(true);
    } else {
      handleAddToCart(ultimateBundle, 'bundle');
      router.push('/store/basket');
    }
  };

  const handleBundleGiftSubmit = async (giftInfoList: { platform: string; id: string; displayName?: string }[]) => {
    if (!ultimateBundle) return;
    
    // Add each gift to the cart
    for (const giftInfo of giftInfoList) {
      console.log(`Adding bundle gift for ${giftInfo.displayName || giftInfo.id}`, {
        bundleId: ultimateBundle.id,
        recipientId: giftInfo.id,
        recipientPlatform: giftInfo.platform
      });
      const cartItem: CartItem = {
        id: ultimateBundle.id,
        type: 'bundle',
        quantity: 1,
        price: bundlePrice,
        originalPrice: ultimateBundle.originalPrice,
        saleValue: ultimateBundle.saleValue,
        name: ultimateBundle.displayName,
        payNowProductId: ultimateBundle.payNowProductId || ultimateBundle.id,
        isGift: true,
        giftTo: giftInfo
      };
      addItem(cartItem);
    }
    
    setIsBundleGiftModalOpen(false);
    router.push('/store/basket');
  };

  const handleRankSelect = (rankId: string) => {
    setSelectedRankId(rankId);
  };

  const handleOpenRankModal = (rankId: string) => {
    setOpenRankModalId(rankId);
  };

  const handleOpenRankModalByPosition = (rankPosition: number) => {
    const targetRank = ranks.find(rank => rank.position === rankPosition);
    if (targetRank) {
      handleOpenRankModal(targetRank.id.toString());
    }
  };

  const getRankTagStyling = (rank: any) => {
    const rankName = (rank.displayName || rank.name || '').toLowerCase();
    
    // Map rank names to their specific colors with much stronger backgrounds
    if (rankName.includes('champion')) {
      return { bg: 'bg-rank-champion-500/80', text: 'text-black', border: 'border-rank-champion-500' };
    }
    if (rankName.includes('vanguard')) {
      return { bg: 'bg-rank-vanguard-500/80', text: 'text-black', border: 'border-rank-vanguard-500' };
    }
    if (rankName.includes('mythic')) {
      return { bg: 'bg-rank-mythic-500/80', text: 'text-black', border: 'border-rank-mythic-500' };
    }
    if (rankName.includes('prime')) {
      return { bg: 'bg-rank-prime-500/80', text: 'text-black', border: 'border-rank-prime-500' };
    }
    if (rankName.includes('vip')) {
      return { bg: 'bg-rank-vip-500/80', text: 'text-black', border: 'border-rank-vip-500' };
    }
    
    // Default fallback
    return { bg: 'bg-rank-default-500/80', text: 'text-black', border: 'border-rank-default-500' };
  };

  // Pre-calculate rank-in-cart info for performance
  const ranksInCartInfo = ranks.reduce((acc, rank) => {
    acc[rank.id] = getRankInCartInfo(rank.id.toString());
    return acc;
  }, {} as { [key: string]: ReturnType<typeof getRankInCartInfo> });
  
  // Main render
  return (
    <>
      
      
      {/* Video Background */}
      <div className="fixed top-0 left-0 right-0 z-0" style={{ height: '100vh' }}>
        <video
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://cdn.atlasrust.com/StoreBG-Test.mp4" type="video/mp4" />
          {/* Fallback background */}
          <div className="absolute inset-0 bg-black" />
        </video>
      </div>

      {/* Loading State - Full Screen */}
      {isLoading && (
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-white mx-auto mb-4" />
            <p className="text-white text-lg font-medium">Loading Atlas Store...</p>
            <p className="text-gray-400 text-sm mt-2">Please wait while we load your packages</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && (
        <div 
          className="relative z-10 pt-4 pb-8"
        >
        
        <div className="relative z-10">
          <GiftModal
            isOpen={isBundleGiftModalOpen}
            onClose={() => setIsBundleGiftModalOpen(false)}
            onSubmit={handleBundleGiftSubmit}
            itemName={ultimateBundle?.displayName || 'Ultimate Bundle'}
          />

          {/* Centralized Rank Modals */}
          {openRankModalId && (() => {
            const selectedRank = ranks.find(rank => rank.id.toString() === openRankModalId);
            if (!selectedRank) return null;
            
            const isVip = selectedRank.position === 1;
            
            return isVip ? (
              <VipDetailsModal
                isOpen={true}
                onClose={() => setOpenRankModalId(null)}
                rank={selectedRank}
              />
            ) : (
              <RankDetailsModal
                rank={selectedRank}
                isOpen={true}
                onClose={() => setOpenRankModalId(null)}
                onOpenRankModal={handleOpenRankModalByPosition}
              />
            );
          })()}

          {/* Main content with cards */}
          <AnimatePresence>
            {showContent && (
              <motion.main
                className="container mx-auto px-4 pb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Store Header */}
              <section className="text-center mb-8 pt-4">
                <div className="flex justify-center items-center gap-8 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-300 font-medium">Instant Delivery</span>
                  </div>
                  <div className="w-px h-4 bg-gray-400"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-blue-300 font-medium">Secure Payment</span>
                  </div>
                  <div className="w-px h-4 bg-gray-400"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-purple-300 font-medium">24/7 Support</span>
                  </div>
                </div>
              </section>


              {/* Ranks Section */}
              <section ref={ranksSectionRef} className={`transition-all duration-500 rounded-xl ${highlightRanks ? 'bg-rank-champion-500/10' : ''}`}>
                <div className="mb-12"></div>

                {/* Rank Cards with inline loading */}
                {isLoading ? (
                  <div className="flex justify-center items-center py-20" role="status" aria-label="Loading ranks">
                    <Loader2 className="w-8 h-8 animate-spin text-rank-champion-500" />
                    <span className="ml-3 text-gray-400">Loading ranks...</span>
                  </div>
                ) : (
                  <div 
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                    style={{
                      opacity: showRankCards ? 1 : 0,
                      transition: `opacity 300ms ${ranks.length * 20 + 200}ms ease-out`
                    }}
                  >
                    {ranks.map((rank, index) => (
                                              <div 
                          key={rank.id} 
                          ref={(el) => { rankRefs.current[rank.id.toString()] = el; }}
                          style={{ 
                            transitionDelay: `${index * 20}ms`,
                            opacity: showRankCards ? 1 : 0,
                            transform: showRankCards ? 'translateY(0)' : 'translateY(8px)',
                            transitionProperty: 'opacity, transform',
                            transitionDuration: '300ms',
                            transitionTimingFunction: 'ease-out'
                          }}
                        >
                          <RankCard
                            rank={rank}
                            index={index}
                            onOpenRankModal={handleOpenRankModalByPosition}
                            onOpenModal={handleOpenRankModal}
                          />
                        </div>
                    ))}
                  </div>
                )}
              </section>
              
              {/* Ultimate Bundle Section - Redesigned */}
              {ultimateBundle && includedRanks.length > 0 && (
                <section className={`mt-8 transition-all duration-500 ease-out ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: `${ranks.length * 20 + 50}ms` }}>
                            <div className="relative w-full">
            {/* Animated glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500/50 via-yellow-500/50 to-red-500/50 rounded-2xl blur opacity-60 animate-pulse"></div>
            
            {/* Main bundle card */}
            <div className="relative bg-gradient-to-br from-gray-800/95 via-gray-900/95 to-gray-950/95 rounded-2xl border border-gray-700/50 backdrop-blur-sm overflow-hidden hover:scale-[1.02] transition-transform duration-150 ease-out">
                      {/* Top highlight bar */}
                      <div className="h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500"></div>
                      
                      <div className="py-4 px-4 lg:py-4 lg:px-6">
                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:justify-between lg:items-start">
                          <div className="flex-1 lg:max-w-2xl">
                            <h3 className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 mb-2">
                              {ultimateBundle?.displayName || 'Ultimate Bundle'}
                            </h3>
                            <p className="text-gray-300 text-sm mb-4">
                              Get instant access to all premium ranks and dominate every server
                            </p>
                            
                            {/* Benefits */}
                            <div className="flex flex-wrap gap-3">
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30">
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-sm font-medium">Save {formatCurrency(bundleSavings, currency)}</span>
                              </div>
                              
                              {hasBundleDiscount && bundleDiscountPercentage > 0 ? (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30">
                                  <Zap className="h-4 w-4" />
                                  <span className="text-sm font-medium">{bundleDiscountPercentage}% OFF</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 text-orange-400 rounded-lg border border-orange-500/30">
                                  <Zap className="h-4 w-4" />
                                  <span className="text-sm font-medium">{ultimateBundle?.discount || 25}% OFF</span>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30">
                                <Sparkles className="h-4 w-4" />
                                <span className="text-sm font-medium">+{ultimateBundle?.freeGems || 250} Free Gems</span>
                              </div>
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 bg-gradient-to-br from-orange-600/40 via-orange-600/30 to-gray-950/95 text-orange-400 rounded-lg border border-orange-500/30">
                              <img 
                                src="/atlas-gem.png" 
                                alt="Atlas Gem" 
                                className="h-4 w-4 flex-shrink-0 group-hover:scale-110 will-change-transform transition-transform duration-75 delay-0 ease-out"
                              />
                                <span className="text-sm font-medium">+50 Per Hour</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Pricing Section */}
                          <div className="flex flex-col items-center lg:items-end text-center lg:text-right lg:ml-auto">
                              {/* Price - aligned to right */}
                              <div className="flex items-center gap-3 mb-4 justify-center lg:justify-end">
                                {bundleOriginalPrice && (
                                  <span className="text-2xl text-gray-500 line-through">
                                    {formatCurrency(bundleOriginalPrice, currency)}
                                  </span>
                                )}
                                <span className="text-4xl lg:text-5xl font-bold text-white">
                                  {formatCurrency(bundlePrice, currency)}
                                </span>
                              </div>
                              
                              {/* Call to Action */}
                              <button
                              onClick={handleBuyAllRanks}
                              disabled={isLoading}
                              className={`group relative w-auto px-8 py-4 rounded-xl font-bold text-lg text-black shadow-2xl 
                                transform transition-all duration-150 ease-out
                                hover:scale-105 hover:shadow-yellow-500/25
                                active:scale-95
                                overflow-hidden
                                ${shouldShowBundleGiftMode
                                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500'
                                  : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400'
                                }
                                disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {/* Animated shine effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-400 ease-out"></div>
                              
                              <div className="relative flex items-center gap-3">
                                {shouldShowBundleGiftMode ? (
                                  <>
                                    <Gift className="h-5 w-5" />
                                    <span>PURCHASE AS GIFT</span>
                                  </>
                                ) : (
                                  <>
                                    <Star className="h-5 w-5" />
                                    <span>GET ALL RANKS NOW</span>
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                                  </>
                                )}
                                                              </div>
                              </button>
                              
                              {/* Rank Tags below button */}
                              <div className="flex flex-wrap gap-2 mt-4 mb-0 justify-center lg:justify-end">
                                {includedRanks.filter(rank => {
                                  const displayName = (rank.displayName || rank.name || '').toUpperCase();
                                  return !['PRIME', 'MYTHIC', 'VANGUARD', 'CHAMPION'].includes(displayName);
                                }).map((rank, index) => {
                                  const styling = getRankTagStyling(rank);
                                  return (
                                    <div 
                                      key={rank.id}
                                      className={`rank-tag ${styling.bg} ${styling.text} ${styling.border} 
                                        px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center 
                                        transition-all duration-150 hover:scale-105 shadow-lg`}
                                      style={{ 
                                        animationDelay: `${index * 50}ms`,
                                      }}
                                    >
                                      {rank.displayName?.toUpperCase() || rank.name?.toUpperCase()}
                                    </div>
                                  );
                                })}
                              </div>
                              
                              {/* Gift mode indicator */}
                            {shouldShowBundleGiftMode && (
                              <div className="mt-3 mb-0 flex items-center gap-2 text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2">
                                <Crown className="h-3 w-3" />
                                <span>
                                  {userOwnsBundle 
                                    ? "You already own this bundle"
                                    : "Already in your cart"
                                  }
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              

                    
              {/* Gems Section */}
              <section id="gems" className={`mt-6 transition-all duration-300 ease-out ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: `${ranks.length * 20 + 100}ms` }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  <AnimatePresence>
                    {gemPackages.slice(0, 5).map((pack, index) => (
                      <motion.div key={pack.id} layout>
                        <GemCard gemPackage={pack} index={index} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            </motion.main>
          )}
        </AnimatePresence>
        </div>
      </div>
      )}
    </>
  );
};

export default StorePage; 