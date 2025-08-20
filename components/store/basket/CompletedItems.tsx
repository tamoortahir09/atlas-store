'use client';

import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import type { CartItem } from '@/lib/store/types';

interface CompletedItemsProps {
  completedItems: CartItem[];
  onRemoveCompletedItem: (itemId: string) => void;
}

export function CompletedItems({ completedItems, onRemoveCompletedItem }: CompletedItemsProps) {
  if (completedItems.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-bold text-green-400">Completed Purchases</h3>
        </div>
        
        <div className="space-y-3">
          {completedItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-green-900/10 border border-green-500/20 rounded-lg p-3">
              <div>
                <p className="font-medium text-store-text-primary">{item.name}</p>
                <p className="text-sm text-store-text-muted">
                  {formatCurrency(item.price, 'USD')} • {item.type}
                  {item.isGift && item.giftTo && ` • Gift for ${item.giftTo.displayName || item.giftTo.id}`}
                </p>
              </div>
              <button
                onClick={() => onRemoveCompletedItem(item.id)}
                className="text-store-text-muted hover:text-atlas-red transition-colors"
                title="Remove from list"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 