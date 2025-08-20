'use client';

import React, { useState, useEffect } from 'react';
import type { Rank } from '@/lib/store/types';
import { Button } from '@/components/ui/button';
import { Crown, Shield, Star, ArrowRightLeft, Zap } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';


interface RankCardProps {
  rank: Rank;
  index: number;
  onOpenRankModal?: (rankPosition: number) => void;
  onOpenModal?: (rankId: string) => void;
}

const getRankIcon = (position: number) => {
  switch (position) {
    case 1:
      return <ArrowRightLeft className="w-6 h-6 sm:w-8 sm:h-8" />;
    case 2:
      return <Star className="w-6 h-6 sm:w-8 sm:h-8" />;
    case 3:
      return <Zap className="w-6 h-6 sm:w-8 sm:h-8" />;
    case 4:
      return <Star className="w-6 h-6 sm:w-8 sm:h-8" />;
    case 5:
      return <Crown className="w-6 h-6 sm:w-8 sm:h-8" />;
    default:
      return <Shield className="w-6 h-6 sm:w-8 sm:h-8" />;
  }
};

const getRankStyling = (position: number) => {
  switch (position) {
    case 1: // VIP - Distinct with green glow
      return {
        bg: 'bg-gray-900 bg-gradient-to-br from-green-600/35 via-green-600/15 to-gray-950/95',
        border: 'border-green-600/40 border',
        text: 'text-white',
        accent: 'text-rank-vip-accent',
        bulletColor: 'bg-rank-vip-accent',
        iconBg: 'bg-rank-vip-accent/20',
        iconColor: 'text-rank-vip-accent',
        button: 'bg-rank-vip-accent hover:bg-rank-vip-accent/80 text-white',
        glow: 'shadow-lg shadow-green-500/15',
        glowHover: 'hover:shadow-2xl hover:shadow-green-500/40',
        overlay: 'bg-gray-900/95'
      };
    case 2: // Prime - Normal kit styling
      return {
        bg: 'bg-gray-900 bg-gradient-to-br from-gray-700/75 via-gray-900/65 to-gray-950/45',
        border: 'border-gray-800/50 border',
        text: 'text-white',
        textColor: 'text-white font-bold',
        accent: 'text-rank-prime-accent',
        bulletColor: 'bg-rank-prime-accent',
        iconBg: 'bg-rank-prime-accent/20',
        iconColor: 'text-rank-prime-accent',
        button: 'bg-purple-600 hover:bg-purple-700 text-white',
        glow: 'shadow-lg shadow-purple-500/10',
        glowHover: 'hover:shadow-2xl hover:shadow-purple-500/30',
        overlay: 'bg-gray-900/95'
      };
    case 3: // Mythic - Normal kit styling
      return {
        bg: 'bg-gray-900 bg-gradient-to-br from-gray-700/75 via-gray-900/65 to-gray-950/45',
        border: 'border-gray-800/50 border',
        text: 'text-white',
        textColor: 'text-white font-bold',
        accent: 'text-rank-mythic-accent',
        bulletColor: 'bg-rank-mythic-accent',
        iconBg: 'bg-rank-mythic-accent/20',
        iconColor: 'text-rank-mythic-accent',
        button: 'bg-purple-600 hover:bg-purple-700 text-white',
        glow: 'shadow-lg shadow-purple-500/10',
        glowHover: 'hover:shadow-2xl hover:shadow-purple-500/30',
        overlay: 'bg-gray-900/95'
      };
    case 4: // Vanguard - Normal kit styling
      return {
        bg: 'bg-gray-900 bg-gradient-to-br from-gray-700/75 via-gray-900/65 to-gray-950/45',
        border: 'border-gray-800/50 border',
        text: 'text-white',
        textColor: 'text-white font-bold',
        accent: 'text-rank-vanguard-accent',
        bulletColor: 'bg-rank-vanguard-accent',
        iconBg: 'bg-rank-vanguard-accent/20',
        iconColor: 'text-rank-vanguard-accent',
        button: 'bg-purple-600 hover:bg-purple-700 text-white',
        glow: 'shadow-lg shadow-purple-500/10',
        glowHover: 'hover:shadow-2xl hover:shadow-purple-500/30',
        overlay: 'bg-gray-900/95'
      };
    case 5: // Champion - Highest kit with golden styling
      return {
        bg: 'bg-gray-900 bg-gradient-to-br from-yellow-600/35 via-yellow-600/15 to-gray-950/95',
        border: 'border-yellow-600/40 border',
        text: 'text-white',
        textColor: 'text-rank-champion-accent font-bold',
        accent: 'text-rank-champion-accent',
        bulletColor: 'bg-rank-champion-accent',
        iconBg: 'bg-rank-champion-accent/20',
        iconColor: 'text-rank-champion-accent',
        button: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold',
        glow: 'shadow-lg shadow-yellow-500/15',
        glowHover: 'hover:shadow-2xl hover:shadow-yellow-500/40',
        overlay: 'bg-gray-900/95'
      };
    default:
      return {
        bg: 'bg-gray-900 bg-gradient-to-br from-gray-800/95 via-gray-900/75 to-gray-950/65',
        border: 'border-gray-800/50 border',
        text: 'text-white',
        accent: 'text-atlas-red',
        bulletColor: 'bg-atlas-red',
        iconBg: 'bg-atlas-red/20',
        iconColor: 'text-atlas-red',
        button: 'bg-atlas-red hover:bg-atlas-red-hover text-white',
        glow: 'shadow-lg shadow-atlas-red/10',
        glowHover: 'hover:shadow-2xl hover:shadow-atlas-red/30',
        overlay: 'bg-gray-900/95'
      };
  }
};

const RankCard = ({ rank, index, onOpenRankModal, onOpenModal }: RankCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const styling = getRankStyling(rank.position);
  const isChampion = rank.position === 5;
  const isVip = rank.position === 1;
  const { addItem, hasRankInCartForSelf } = useCart();
  const { toast } = useToast();

  // Check if this rank is already in cart for self (not as gift)
  const isInCartForSelf = hasRankInCartForSelf(rank.id?.toString() || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100);
    
    return () => clearTimeout(timer);
  }, [index]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click events
    
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
    
    // Create cart item
    const cartItem = {
      id: `rank-${rank.id}`,
      type: 'rank' as const,
      quantity: 1,
      price: rank.price,
      originalPrice: rank.originalPrice,
      saleValue: rank.saleValue,
      name: rank.displayName || rank.name || `Rank ${rank.position}`,
      payNowProductId: rank.payNowProductId,
      subscription: true
    };

    console.log('Adding rank to cart:', cartItem);
    addItem(cartItem);
    
    toast({
      title: "Added to Cart",
      description: `${cartItem.name} has been added to your cart`,
    });
  };

  const handleCardClick = () => {
    if (onOpenModal) {
      onOpenModal(rank.id.toString());
    }
  };

  const renderServerTags = () => {
    const getTagColor = (tag: string) => {
      switch (tag) {
        case '3x':
          return 'bg-green-900/50 text-green-400 border-green-700/50';
        case '5x':
          return 'bg-blue-900/50 text-blue-400 border-blue-700/50';
        case '10x':
          return 'bg-red-900/50 text-red-400 border-red-700/50';
        case 'All servers':
          return 'bg-gray-900/50 text-gray-400 border-gray-700/50';
        default:
          return 'bg-gray-900/50 text-gray-400 border-gray-700/50';
      }
    };
    
    // For VIP (position 1), show "All servers" instead of regular tags
    const tagsToShow = rank.position === 1 ? ['All servers'] : rank.tags;
    
    return (
      <>
        <p className="text-store-text-muted text-xs mb-2 font-primary">Available on:</p>
        <div className="flex flex-wrap gap-1.5">
          {tagsToShow.map((tag) => (
            <span 
              key={tag}
              className={`${getTagColor(tag)} text-[10px] font-medium px-1.5 py-0.5 rounded border font-competitive`}
            >
              {tag}
            </span>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <div 
        onClick={handleCardClick}
        className={`
          relative overflow-hidden rounded-2xl h-full flex flex-col cursor-pointer
          ${styling.bg} ${styling.border}
          ${styling.glow} ${styling.glowHover}
          transform transition-all duration-150 hover:scale-105
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          ${isChampion ? 'ring-1 ring-yellow-600/30' : ''}
        `}
        style={{ 
          //transitionDelay: `${index * 50}ms`,
          boxShadow: isChampion ? '0 0 30px rgba(255, 215, 0, 0.2)' : undefined
        }}
      >


      {/* Background images - PayNow images with fallbacks */}
      {rank.position === 1 && (
        <div 
          className="absolute inset-0 overflow-visible"
          style={{
            width: '120%',
            height: '120%',
            top: '-10%',
            left: '-10%',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `url('${rank.imageUrl || 'https://imagedelivery.net/X9Tw3lClLTBX0eQsukZAYA/rank1-bg-image/public'}') no-repeat`,
              backgroundSize: rank.imageUrl ? '80%' : '90%',
              transform: rank.imageUrl ? 'rotate(-20deg)' : 'rotate(-20deg) translateX(105px) translateY(-15px)',
              opacity: rank.imageUrl ? '0.35' : '0.35',
              backgroundPosition: rank.imageUrl ? 'right -40px center' : 'center right -25%',
              mask: rank.imageUrl ? 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.4) 60%, rgba(255,255,255,1) 80%)' : 'none',
              WebkitMask: rank.imageUrl ? 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.4) 60%, rgba(255,255,255,1) 85%)' : 'none',
            }}
          />
        </div>
      )}

      {rank.position === 2 && (
        <div 
          className="absolute inset-0 overflow-visible"
          style={{
            width: '120%',
            height: '120%',
            top: '-10%',
            left: '-10%',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `url('${rank.imageUrl || 'https://imagedelivery.net/X9Tw3lClLTBX0eQsukZAYA/rank2-bg-image/public'}') no-repeat`,
              backgroundSize: rank.imageUrl ? '75%' : '90%',
              transform: rank.imageUrl ? 'rotate(-20deg)' : 'rotate(-20deg) translateX(105px) translateY(-15px)',
              opacity: rank.imageUrl ? '0.35' : '0.05',
              backgroundPosition: rank.imageUrl ? 'right -40px center' : 'center right -25%',
              mask: rank.imageUrl ? 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.4) 60%, rgba(255,255,255,1) 85%)' : 'none',
              WebkitMask: rank.imageUrl ? 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.4) 60%, rgba(255,255,255,1) 85%)' : 'none',
            }}
          />
        </div>
      )}

      {rank.position === 3 && (
        <div 
          className="absolute inset-0 overflow-visible"
          style={{
            width: '120%',
            height: '120%',
            top: '-10%',
            left: '-10%',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `url('${rank.imageUrl || 'https://imagedelivery.net/X9Tw3lClLTBX0eQsukZAYA/cc147769-c5de-4fc6-3f0a-e8ce6ebac000/public'}') no-repeat`,
              backgroundSize: rank.imageUrl ? '75%' : '90%',
              transform: rank.imageUrl ? 'rotate(-20deg)' : 'rotate(-20deg) translateX(105px) translateY(-15px)',
              opacity: rank.imageUrl ? '0.35' : '0.05',
              backgroundPosition: rank.imageUrl ? 'right -40px center' : 'center right -25%',
              mask: rank.imageUrl ? 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.4) 60%, rgba(255,255,255,1) 85%)' : 'none',
              WebkitMask: rank.imageUrl ? 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.4) 60%, rgba(255,255,255,1) 85%)' : 'none',
            }}
          />
        </div>
      )}

      {rank.position === 4 && (
        <div 
          className="absolute inset-0 overflow-visible"
          style={{
            width: '120%',
            height: '120%',
            top: '-10%',
            left: '-10%',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `url('${rank.imageUrl || 'https://imagedelivery.net/X9Tw3lClLTBX0eQsukZAYA/4b699ff2-1879-49ab-4bd3-09002eb70a00/public'}') no-repeat`,
              backgroundSize: rank.imageUrl ? '75%' : '90%',
              transform: rank.imageUrl ? 'rotate(-20deg)' : 'rotate(-20deg) translateX(105px) translateY(-15px)',
              opacity: rank.imageUrl ? '0.35' : '0.05',
              backgroundPosition: rank.imageUrl ? 'right -40px center' : 'center right -25%',
              mask: rank.imageUrl ? 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.4) 60%, rgba(255,255,255,1) 85%)' : 'none',
              WebkitMask: rank.imageUrl ? 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.4) 60%, rgba(255,255,255,1) 85%)' : 'none',
            }}
          />
        </div>
      )}

      {rank.position === 5 && (
        <div 
          className="absolute inset-0 overflow-visible"
          style={{
            width: '120%',
            height: '120%',
            top: '-12.5%',
            left: '-10%',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `url('${rank.imageUrl || 'https://imagedelivery.net/X9Tw3lClLTBX0eQsukZAYA/rank5-bg-image/public'}') no-repeat`,
              backgroundSize: rank.imageUrl ? '75%' : '90%',
              transform: rank.imageUrl ? 'rotate(-20deg)' : 'rotate(-20deg) translateX(105px) translateY(-15px)',
              opacity: rank.imageUrl ? '0.35' : '0.05',
              backgroundPosition: rank.imageUrl ? 'right -40px center' : 'center right -25%',
              mask: rank.imageUrl ? 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.4) 60%, rgba(255,255,255,1) 85%)' : 'none',
              WebkitMask: rank.imageUrl ? 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.4) 60%, rgba(255,255,255,1) 85%)' : 'none',
            }}
          />
        </div>
      )}
      
      {/* Sale badge */}
      {rank.originalPrice && rank.originalPrice > rank.price && (
        <div className="absolute top-2 right-2 z-10">
          <div className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full border text-white bg-red-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded border border-red-500 flex items-center gap-1">
            🔥 SALE
          </div>
        </div>
      )}

      {/* Popular badge for position 4 */}
      {rank.position === 4 && (
        <div className="absolute top-2 right-2 z-10">
          <div className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full border text-white  font-competitive bg-gradient-to-r from-purple-500 to-purple-600 text-black border-purple-600 shadow-lg shadow-purple-600/25">
            POPULAR 🔥
          </div>
        </div>
      )}

      <div className="relative p-4 sm:p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start mb-4 sm:mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className={`p-1.5 sm:p-2 rounded-lg ${styling.iconBg} ${styling.iconColor}`}>
                {getRankIcon(rank.position)}
              </div>
              <h3 className={`text-xl sm:text-2xl font-bold font-competitive ${rank.position === 1 ? 'text-rank-vip-accent' : rank.position === 5 ? 'text-rank-champion-accent' : styling.text} drop-shadow-lg`}>
                {rank.displayName || rank.name}
              </h3>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm font-primary">
              {rank.description}
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-2.5 sm:space-y-3 flex-1 mb-4">
          {rank.position === 1 ? (
            // VIP-specific benefits (queue skip only)
            <>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <div className={`h-1.5 w-1.5 rounded-full ${styling.bulletColor}`} />
                <span className="text-gray-200 font-primary">Skip server queue instantly</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <div className={`h-1.5 w-1.5 rounded-full ${styling.bulletColor}`} />
                <span className="text-gray-200 font-primary">Priority server access</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <div className={`h-1.5 w-1.5 rounded-full ${styling.bulletColor}`} />
                <span className="text-gray-200 font-primary">No interruptions</span>
              </div>
            </>
          ) : (
            // Other ranks use their original benefits
            (rank.benefits || []).map((benefit: string, benefitIndex: number) => (
              (benefitIndex === 3 ? (
                <div key={benefitIndex} className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className={`h-1.5 w-1.5 rounded-full ${styling.bulletColor}`} />
                  <span className={`text-gray-200 font-primary ${styling.textColor}`}>+{benefit}</span>
                </div>
              ) : (
                <div key={benefitIndex} className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className={`h-1.5 w-1.5 rounded-full ${styling.bulletColor}`} />
                  <span className="text-gray-200 font-primary ">{benefit}</span>
                </div>
              ))
            ))
          )}
        </div>

        {/* Server Tags */}
        <div className="mb-4">
          {renderServerTags()}
        </div>

        {/* Price and actions */}
        <div className="mt-auto border-t border-gray-700/50">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <div className="flex items-end gap-1">
              <div className="flex flex-col items-start justify-end">
              <div>
              {rank.originalPrice && rank.originalPrice > rank.price && (
                  <span className="text-sm text-gray-500 line-through font-primary">
                    {formatCurrency(rank.originalPrice, 'USD')}
                  </span>
                )}
              </div>
                <span className={`text-2xl sm:text-3xl ${rank.originalPrice && rank.originalPrice > rank.price ? 'pt-0': 'pt-4'} -mb-1 font-bold font-competitive ${rank.position === 1 ? 'text-rank-vip-accent' : rank.position === 5 ? 'text-rank-champion-accent' : styling.text} drop-shadow-lg`}>
                  {formatCurrency(rank.price, 'USD')}
                </span>
              </div>
              <div className="flex flex-col items-start justify-start">

                <span className={`text-sm text-gray-400 font-primary ${rank.originalPrice && rank.originalPrice > rank.price ? '' : 'self-end'}`}>
                    /mo
                </span>
              </div>

              </div>
              {rank.saleValue && rank.saleValue > 0 && (
                <div className="text-xs text-green-400 font-medium font-primary">
                  Save {formatCurrency(rank.saleValue, 'USD')}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex">
            <Button
              onClick={handleAddToCart}
              disabled={isInCartForSelf}
              className={`
                w-full font-bold py-2 px-4 rounded-lg text-sm font-competitive
                hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-150
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                ${styling.button}
              `}
            >
              {isInCartForSelf ? 'IN CART' : 'ADD TO CART'}
            </Button>
          </div>
        </div>
      </div>
    </div>


  </>
  );
};

export default RankCard; 