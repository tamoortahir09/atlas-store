'use client';

import React, { useState, useEffect } from 'react';
import type { GemPackage } from '@/lib/store/types';
import { Button } from '@/components/ui/button';
import { Gem, Percent } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface GemCardProps {
  gemPackage: GemPackage;
  index: number;
}

const GemCard = ({ gemPackage, index }: GemCardProps) => {
  const [isRaining, setIsRaining] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100);
    
    return () => clearTimeout(timer);
  }, [index]);

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Validate PayNow product ID exists
    const productId = gemPackage.payNowProductId || gemPackage.id?.toString();
    if (!productId) {
      console.error('Gem package missing PayNow product ID:', gemPackage);
      toast({
        title: "Error",
        description: "This product is not available for purchase at the moment.",
        variant: "destructive",
      });
      return;
    }
    
    // Trigger gem rain animation
    setIsRaining(true);
    
    // Reset animation after delay
    setTimeout(() => setIsRaining(false), 2000);
    
    // Create cart item
    const cartItem = {
      id: `gems-${gemPackage.id}`,
      type: 'gems' as const,
      quantity: 1,
      price: gemPackage.price,
      originalPrice: gemPackage.originalPrice,
      saleValue: gemPackage.saleValue,
      name: gemPackage.name,
      payNowProductId: productId,
    };

    console.log('Adding gem package to cart:', cartItem);
    addItem(cartItem);
    
    toast({
      title: "Added to Cart",
      description: `${cartItem.name} has been added to your cart`,
    });
  };

  const isMaxValue = gemPackage.valueType === 'max'; // 16,500 Gems
  const isBestValue = gemPackage.valueType === 'best'; // 4,500 Gems
  const isPopular = gemPackage.valueType === 'popular';

  const getBadge = () => {
    if (isBestValue) return { text: 'BEST VALUE 💎', classes: 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400 shadow-lg shadow-green-500/25' };
    if (isMaxValue) return { text: 'MAX VALUE 👑', classes: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black border-yellow-400 shadow-lg shadow-yellow-500/25' };
    if (isPopular) return { text: 'MOST POPULAR 🔥', classes: 'bg-orange-600 text-white border-orange-500' };
    return null;
  };

  const getStyling = () => {
    if (isMaxValue) {
      return {
        bg: 'bg-gray-900 bg-gradient-to-br from-yellow-600/35 via-yellow-600/15 to-gray-950/95',
        border: 'border-yellow-600/40 border-2',
        text: 'text-white',
        accent: 'text-yellow-400',
        iconBg: 'bg-yellow-500/20',
        button: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold',
        glow: 'shadow-lg shadow-yellow-500/15',
        glowHover: 'hover:shadow-2xl hover:shadow-yellow-500/40',
        overlay: 'bg-gray-900/95'
      };
    }
    if (isBestValue) {
      return {
        bg: 'bg-gray-900 bg-gradient-to-br from-green-600/35 via-green-600/15 to-gray-950/95',
        border: 'border-green-600/40 border-2',
        text: 'text-white',
        accent: 'text-green-400',
        iconBg: 'bg-green-500/20',
        button: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold',
        glow: 'shadow-lg shadow-green-500/15',
        glowHover: 'hover:shadow-2xl hover:shadow-green-500/40',
        overlay: 'bg-gray-900/95'
      };
    }
    if (isPopular) {
      return {
        bg: 'bg-gray-900 bg-gradient-to-br from-orange-600/20 via-orange-600/10 to-gray-950/95',
        border: 'border-orange-600/40 border-2',
        text: 'text-white',
        accent: 'text-orange-400',
        iconBg: 'bg-orange-500/20',
        button: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold',
        glow: 'shadow-lg shadow-orange-500/15',
        glowHover: 'hover:shadow-2xl hover:shadow-orange-500/40',
        overlay: 'bg-gray-900/95'
      };
    }
    // Default styling
    return {
      bg: 'bg-gray-900 bg-gradient-to-br from-gray-700/75 via-gray-900/65 to-gray-950/45',
      border: 'border-gray-600/40 border',
      text: 'text-white',
      accent: 'text-gray-400',
      iconBg: 'bg-gray-500/20',
      button: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white',
      glow: 'shadow-lg shadow-gray-500/15',
      glowHover: 'hover:shadow-2xl hover:shadow-gray-500/40',
      overlay: 'bg-gray-900/95'
    };
  };

  const badge = getBadge();
  const styling = getStyling();
  const moreValue = gemPackage.bonus > 0 ? Math.round((gemPackage.bonus / gemPackage.amount) * 100) : 0;

  return (
    <div 
      className={`
        relative overflow-hidden rounded-2xl h-full flex flex-col cursor-pointer
        ${styling.bg} ${styling.border}
        ${styling.glow} ${styling.glowHover}
        transform transition-all duration-300 hover:scale-105
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      style={{ 
        animationDelay: `50ms`,
        transitionDelay: `50ms`
      }}
    >


      {/* Gem Rain Animation */}
      {isRaining && (
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden rounded-lg">
          {/* Falling gems */}
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                animationDelay: `${i * 100}ms`,
                animationDuration: '1.5s',
                animationTimingFunction: 'ease-in',
                animationFillMode: 'forwards'
              }}
            >
              <div 
                className="w-3 h-3 rounded-sm rotate-45 opacity-80 bg-gradient-to-br from-yellow-400 to-orange-500"
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.8))',
                  animation: `fall ${1.5 + Math.random() * 0.5}s ease-in forwards`,
                  animationDelay: `${i * 80}ms`
                }}
              />
            </div>
          ))}
          
          {/* Sparkle effects */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 150}ms`
              }}
            >
              <div 
                className="w-1 h-1 rounded-full opacity-90 bg-yellow-400"
                style={{
                  animation: 'twinkle 1s ease-in-out forwards',
                  animationDelay: `${i * 100}ms`
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Badge */}
      {badge && (
        <div className="absolute top-2 right-2 z-10">
          <div className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${badge.classes} font-competitive`}>
            {badge.text}
          </div>
        </div>
      )}

      {/* Sale badge */}
      {gemPackage.originalPrice && gemPackage.originalPrice > gemPackage.price && (
        <div className="absolute top-2 left-2 z-10">
          <div className="bg-atlas-red text-white text-[10px] font-semibold px-1.5 py-0.5 rounded border border-red-700 flex items-center gap-1 font-competitive">
            <Percent className="h-3 w-3" />
            SALE
          </div>
        </div>
      )}

      <div className="relative p-4 sm:p-6 flex flex-col h-full">
        <div className="flex-1">
                      {/* Gem Image - Use PayNow image with fallbacks */}
            <div className="flex justify-center items-center">
             <img
               src={gemPackage.imageUrl || (isMaxValue ? "https://imgur.com/2r2m5aN.png" : "https://i.imgur.com/77v45bA.png")}
               alt={`${gemPackage.name} - ${gemPackage.imageUrl ? 'PayNow Image' : 'Fallback Image'}`}
               className={`w-auto max-h-32 transition-transform duration-200 ${
                 isMaxValue ? 'drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 
                 isBestValue ? 'drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 
                 isPopular ? 'drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]' : ''
               }`}
               onError={(e) => {
                 // Fallback to default image if PayNow image fails
                 if (gemPackage.imageUrl && e.currentTarget.src === gemPackage.imageUrl) {
                   e.currentTarget.src = isMaxValue ? "https://imgur.com/2r2m5aN.png" : "https://i.imgur.com/77v45bA.png";
                 }
               }}
             />
            </div>

          {/* Amount */}
          <div className="text-center">
            <h3 className={`text-xl sm:text-2xl font-bold font-competitive ${styling.text} drop-shadow-lg`}>
              {gemPackage.name}
            </h3>
          </div>



          {/* Description */}
          <div className="text-center mt-4">
            <p className="text-gray-300 text-sm font-primary">
              
              {moreValue > 0 && (
                <span className={`block mt-1 font-medium ${styling.accent}`}>
                  +{moreValue}% More Value
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-4">
          {/* Server Tags */}
          <div className="mb-4">
            <p className="text-gray-400 text-xs mb-2 font-primary">Available on:</p>
            <div className="flex flex-wrap gap-1.5">
              <span className="bg-green-600/20 text-green-400 border-green-600/50 text-[10px] font-medium px-1.5 py-0.5 rounded border font-competitive">
                3x
              </span>
              <span className="bg-blue-600/20 text-blue-400 border-blue-600/50 text-[10px] font-medium px-1.5 py-0.5 rounded border font-competitive">
                5x
              </span>
              <span className="bg-red-600/20 text-red-400 border-red-600/50 text-[10px] font-medium px-1.5 py-0.5 rounded border font-competitive">
                10x
              </span>
            </div>
          </div>

          {/* Price and actions */}
          <div className="pt-4 border-t border-gray-700/50">
            <div className="mb-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl sm:text-3xl font-bold font-competitive ${styling.text} drop-shadow-lg`}>
                      ${gemPackage.price.toFixed(2)}
                    </span>
                    {gemPackage.originalPrice && gemPackage.originalPrice > gemPackage.price && (
                      <span className="text-sm text-gray-500 line-through font-primary">
                        ${gemPackage.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {gemPackage.saleValue && gemPackage.saleValue > 0 && (
                    <div className="text-xs text-green-400 font-medium font-primary">
                      Save ${gemPackage.saleValue.toFixed(2)}
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-1 font-primary">
                    One-time purchase
                  </div>
                </div>
              </div>
            </div>
          
            <div className="flex gap-2">
              <Button
                onClick={handleAddToCartClick}
                className={`
                  w-full font-bold py-2 px-4 rounded-lg text-sm font-competitive
                  hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  ${styling.button}
                `}

              >
                ADD TO CART
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GemCard; 