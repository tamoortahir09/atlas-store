'use client';

import React, { useState, useEffect } from 'react';
import { X, Crown, ShoppingCart, Zap, Star, Users, Shield, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { GiftModal } from './GiftModal';
import { usePayNowProducts } from '@/hooks/usePayNowProducts';
import { formatCurrency } from '@/lib/formatters';
import { getAccessoryProductId } from '@/lib/store/productIds';
import { useToast } from '@/hooks/use-toast';
import { Portal } from './Portal';

interface QueueSkipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QueueSkipProduct {
  price: number;
  originalPrice?: number;
  saleEndDate?: Date;
  isLoading: boolean;
  payNowProductId?: string;
}

export function QueueSkipModal({ isOpen, onClose }: QueueSkipModalProps) {
  const { addItem } = useCart();
  const { ranks, isLoadingProducts } = usePayNowProducts();
  const [giftModalOpen, setGiftModalOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [queueSkipProduct, setQueueSkipProduct] = useState<QueueSkipProduct>({
    price: 14.99, // Fallback price
    isLoading: true
  });

  const queueSkipProductId = getAccessoryProductId('queueSkip');

  // Get queue skip product data from ranks (VIP rank 1)
  useEffect(() => {
    if (!isLoadingProducts && ranks.length > 0) {
      // Find VIP rank 1 (position 1) since queue skip is actually VIP Package 1
      const vipRank1 = ranks.find(rank => rank.position === 1);
      
      if (vipRank1) {
        setQueueSkipProduct({
          price: vipRank1.price,
          originalPrice: vipRank1.originalPrice,
          saleEndDate: undefined, // Add sale logic if needed
          isLoading: false,
          payNowProductId: vipRank1.payNowProductId
        });
      } else {
        console.warn('VIP rank 1 not found in ranks data');
        setQueueSkipProduct(prev => ({ ...prev, isLoading: false }));
      }
    }
  }, [ranks, isLoadingProducts]);

  // Get the lowest rank price from the API (excluding VIP position 1, only actual ranks)
  const getLowestRankPrice = () => {
    if (isLoadingProducts || ranks.length === 0) {
      return 22.79; // Fallback to Prime rank price
    }
    
    // Filter out VIP (position 1) and find the lowest priced actual rank
    const actualRanks = ranks.filter(rank => rank.position !== 1);
    
    if (actualRanks.length === 0) {
      return 22.79; // Fallback if no actual ranks found
    }
    
    // Find the lowest priced actual rank (should be Prime at position 2)
    const lowestPrice = Math.min(...actualRanks.map(rank => rank.price));
    return lowestPrice;
  };

  const lowestRankPrice = getLowestRankPrice();
  const upgradePrice = lowestRankPrice - queueSkipProduct.price;
  const showUpgradePrice = upgradePrice > 0;

  // Check if queue skip has an active sale
  const hasQueueSkipSale = queueSkipProduct.originalPrice && 
                          queueSkipProduct.originalPrice > queueSkipProduct.price &&
                          queueSkipProduct.saleEndDate &&
                          queueSkipProduct.saleEndDate.getTime() > Date.now();

  if (!isOpen) return null;

  const handleBuyNow = () => {
    // Find VIP rank 1 (position 1) since queue skip is actually VIP Package 1
    const vipRank1 = ranks.find(rank => rank.position === 1);
    
    if (vipRank1) {
      // Add VIP rank 1 instead of queue_skip
      addItem({
        id: `rank-${vipRank1.id}`,
        type: 'rank',
        quantity: 1,
        price: vipRank1.price,
        name: vipRank1.displayName || vipRank1.name || 'VIP Package 1',
        payNowProductId: vipRank1.payNowProductId,
      });
      
      toast({
        title: "Added to Cart",
        description: `${vipRank1.displayName || vipRank1.name || 'VIP Package 1'} has been added to your cart`,
      });
    } else {
      // Fallback to the old queue_skip type if VIP rank 1 is not found
      addItem({
        id: 'vip-queue-skip',
        type: 'queue_skip',
        quantity: 1,
        price: queueSkipProduct.price,
        name: 'VIP Queue Skip Pass',
        payNowProductId: queueSkipProduct.payNowProductId,
      });
      
      toast({
        title: "Added to Cart",
        description: "VIP Queue Skip Pass has been added to your cart",
      });
    }
    onClose();
  };

  const handleGiftSubmit = async (giftInfoList: { platform: string; id: string; displayName?: string }[]) => {
    try {
      console.log('Gift VIP Queue Skip Pass', {
        recipientCount: giftInfoList.length,
        recipients: giftInfoList.map(g => g.displayName || g.id)
      });
      
      // Find VIP rank 1 (position 1) since queue skip is actually VIP Package 1
      const vipRank1 = ranks.find(rank => rank.position === 1);
      
      // Add a gift item for each recipient
      giftInfoList.forEach((giftInfo, index) => {
        if (vipRank1) {
          // Add VIP rank 1 gift instead of queue_skip
          addItem({
            id: `rank-gift-${vipRank1.id}-${Date.now()}-${index}`,
            type: 'rank',
            quantity: 1,
            price: vipRank1.price,
            name: `${vipRank1.displayName || vipRank1.name || 'VIP Package 1'} (Gift)`,
            isGift: true,
            giftTo: giftInfo,
            payNowProductId: vipRank1.payNowProductId,
          });
        } else {
          // Fallback to the old queue_skip type if VIP rank 1 is not found
          addItem({
            id: `vip-queue-skip-gift-${Date.now()}-${index}`,
            type: 'queue_skip',
            quantity: 1,
            price: queueSkipProduct.price,
            name: 'VIP Queue Skip Pass (Gift)',
            isGift: true,
            giftTo: giftInfo,
            payNowProductId: queueSkipProduct.payNowProductId,
          });
        }
      });
      
      toast({
        title: "Gifts Added to Cart",
        description: `${giftInfoList.length} gift(s) have been added to your cart`,
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to process gift:', error);
      toast({
        title: "Error",
        description: "Failed to add gifts to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Enhanced backdrop with gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/70 via-gray-900/80 to-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal with enhanced design */}
      <div className="relative bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 max-w-lg w-full overflow-hidden">
        {/* Animated gradient border */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-2xl opacity-75 blur-sm animate-pulse"></div>
        
        {/* Content container */}
        <div className="relative bg-gray-900/95 rounded-2xl">
          {/* Header with gradient background */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-600/10"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600"></div>
            
            <div className="relative p-6 pb-4">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-all duration-300 rounded-full hover:bg-gray-800/50 hover:scale-110"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header content */}
              <div className="flex items-start gap-4 pr-12">
                                  <div className="relative">
                    <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
                      <Zap className="h-8 w-8 text-green-500" />
                    </div>
                    <div className="absolute -top-1 -right-1 text-green-500 text-sm animate-bounce">⚡</div>
                  </div>
                <div className="flex-1">
                                      <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500 mb-1">
                      Queue Skip Pass
                    </h2>
                  <p className="text-gray-400 text-sm">
                    Skip the wait, join instantly
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="pb-4"></div>
          <div className="px-6 pb-6">
            {/* Upgrade section moved to top */}
            {showUpgradePrice && (
              <div className="bg-gradient-to-r from-purple-500/10 to-red-500/10 border border-purple-500/30 rounded-xl p-4 mb-6 text-center">
                <p className="text-purple-300 font-semibold text-sm">
                  💡 <span className="text-white">Upgrade to a rank for just</span> <span className="text-purple-400 font-bold">{formatCurrency(upgradePrice, 'USD')} more</span>
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Get Queue Skip + ALL rank benefits
                </p>
              </div>
            )}

            {/* Options comparison */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              {/* Queue Skip Option */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 relative">
                                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-green-500" />
                      <span className="font-semibold text-white">Queue Skip Only</span>
                    </div>
                  <div className="text-right">
                    {queueSkipProduct.isLoading ? (
                      <span className="text-gray-400 text-sm">Loading...</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-green-500 font-bold text-lg">{formatCurrency(queueSkipProduct.price, 'USD')}</span>
                        {hasQueueSkipSale && queueSkipProduct.originalPrice && (
                          <span className="text-gray-500 line-through text-sm">{formatCurrency(queueSkipProduct.originalPrice, 'USD')}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                    30-day access pass
                  </li>
                </ul>
                {/* Server tags positioned absolutely */}
                <div className="absolute bottom-2 right-2">
                  <div className="flex flex-wrap gap-1 justify-end">
                    <span className="bg-purple-500/20 text-purple-400 text-[9px] font-medium px-1 py-0.5 rounded backdrop-blur-sm">
                      2x
                    </span>
                    <span className="bg-blue-500/20 text-blue-400 text-[9px] font-medium px-1 py-0.5 rounded backdrop-blur-sm">
                      3x
                    </span>
                    <span className="bg-green-500/20 text-green-400 text-[9px] font-medium px-1 py-0.5 rounded backdrop-blur-sm">
                      5x
                    </span>
                    <span className="bg-red-500/20 text-red-400 text-[9px] font-medium px-1 py-0.5 rounded backdrop-blur-sm">
                      10x
                    </span>
                  </div>
                </div>
              </div>

              {/* Rank Packages Option */}
              <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 rounded-xl p-4 border border-purple-500/30 relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  BEST VALUE
                </div>
                <div className="absolute top-8 right-2 text-right">
                  <span className="text-purple-400 font-bold text-sm">
                    {isLoadingProducts ? 'Loading...' : `From ${formatCurrency(lowestRankPrice, 'USD')}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-5 w-5 text-purple-400" />
                  <span className="font-semibold text-white">Rank Packages</span>
                </div>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    <span className="text-purple-400 font-medium">30-day access pass</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    Resources & weapons
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    Colored name
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    Faster Teleport
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    More Homes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    The list goes on...
                  </li>
                </ul>
                {/* Server tags positioned absolutely */}
                <div className="absolute bottom-2 right-2">
                  <div className="flex flex-wrap gap-1 justify-end">
                    <span className="bg-blue-500/20 text-blue-400 text-[9px] font-medium px-1 py-0.5 rounded backdrop-blur-sm">
                      3x
                    </span>
                    <span className="bg-green-500/20 text-green-400 text-[9px] font-medium px-1 py-0.5 rounded backdrop-blur-sm">
                      5x
                    </span>
                    <span className="bg-red-500/20 text-red-400 text-[9px] font-medium px-1 py-0.5 rounded backdrop-blur-sm">
                      10x
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons with enhanced design */}
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/store')}
                className="w-full h-11 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold border-0 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300"
              >
                <Crown className="h-5 w-5" />
                <span>Browse Rank Packages</span>
              </Button>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={() => setGiftModalOpen(true)}
                  className="h-11 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold border-0 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300"
                >
                  <Gift className="h-5 w-5" />
                  <span>Gift to Friend</span>
                </Button>

                <Button
                  onClick={handleBuyNow}
                  disabled={queueSkipProduct.isLoading}
                  className="h-11 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold border-0 shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>
                    {queueSkipProduct.isLoading ? 'Loading...' : `Buy Now - ${formatCurrency(queueSkipProduct.price, 'USD')}`}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gift Modal */}
      <GiftModal
        isOpen={giftModalOpen}
        onClose={() => setGiftModalOpen(false)}
        onSubmit={handleGiftSubmit}
        itemName="VIP Queue Skip Pass"
      />
    </div>
  );

  return <Portal>{modalContent}</Portal>;
} 