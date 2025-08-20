'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Gem, Star } from 'lucide-react';

interface EmptyBasketProps {
  showContent: boolean;
}

export function EmptyBasket({ showContent }: EmptyBasketProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 transition-all duration-700 ease-out ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-[#1A1A1A]/50 border-2 border-[#333333]/50 flex items-center justify-center">
          <ShoppingCart className="w-12 h-12 text-[#999999]" />
        </div>
        <div className="absolute -top-2 -right-2">
          <div className="w-8 h-8 rounded-full bg-[#E60000] flex items-center justify-center">
            <span className="text-white text-xs font-bold">0</span>
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-4">Your basket is empty</h2>
      <p className="text-[#CCCCCC] text-center mb-8 max-w-md">
        Start building your collection with our premium ranks and gem packages.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/store">
          <button className="bg-[#E60000] hover:bg-[#cc0000] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Browse Ranks
          </button>
        </Link>
        <Link href="/store#gems">
          <button className="bg-[#1A1A1A]/50 hover:bg-[#1A1A1A]/70 border border-[#333333]/50 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2">
            <Gem className="w-5 h-5" />
            Browse Gems
          </button>
        </Link>
      </div>
    </div>
  );
} 