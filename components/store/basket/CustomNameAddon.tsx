'use client';

import React from 'react';
import { Palette, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import type { CartItem } from '@/lib/store/types';

interface CustomNameAddonProps {
  items: CartItem[];
  customNameAccessory?: {
    id: string;
    name: string;
    price: number;
    payNowProductId: string;
    description?: string;
  };
  showContent: boolean;
  onAddCustomName: () => void;
}

export function CustomNameAddon({
  items,
  customNameAccessory,
  showContent,
  onAddCustomName
}: CustomNameAddonProps) {
  // Check if user already has custom name in cart
  const hasCustomNameInCart = items.some(item => 
    item.type === 'accessory' && item.name.toLowerCase().includes('custom')
  );

  // Check if user has any ranks in cart (custom name is typically for rank holders)
  const hasRanksInCart = items.some(item => item.type === 'rank');

  // Don't show if no ranks in cart or if already have custom name
  if (!hasRanksInCart || hasCustomNameInCart || !customNameAccessory) {
    return null;
  }

  return (
    <div className={`mb-8 transition-all duration-700 ease-out delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <Palette className="w-6 h-6 text-purple-400" />
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-purple-300 mb-2">
                Add Custom Colored Name
              </h3>
              <p className="text-store-text-muted text-sm mb-2">
                Stand out with a custom colored name in-game. Perfect complement to your new rank!
              </p>
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold text-purple-300">
                  {formatCurrency(customNameAccessory.price, 'USD')}
                </span>
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                  One-time purchase
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onAddCustomName}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
} 