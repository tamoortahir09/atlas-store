'use client';

import React from 'react';
import { CreditCard, AlertTriangle, Info } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import type { CartItem } from '@/lib/store/types';

interface OrderSummaryProps {
  activeItems: CartItem[];
  total: number;
  isReferred?: boolean;
  referrerSteam64?: string | null;
  requiresStepperCheckout: boolean;
  canUseRegularCheckout: boolean;
  hasMultipleSubscriptions: boolean;
  hasNonSubscriptionItems: boolean;
  subscriptionItems: CartItem[];
  checkoutError: string | null;
  isCheckingOut: boolean;
  onRegularCheckout: () => void;
  onStepperCheckout: () => void;
}

export function OrderSummary({
  activeItems,
  total,
  isReferred = false,
  referrerSteam64,
  requiresStepperCheckout,
  canUseRegularCheckout,
  hasMultipleSubscriptions,
  hasNonSubscriptionItems,
  subscriptionItems,
  checkoutError,
  isCheckingOut,
  onRegularCheckout,
  onStepperCheckout
}: OrderSummaryProps) {
  if (activeItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#1A1A1A]/50 border border-[#333333]/50 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Order Summary</h3>
      
      {/* Items List */}
      <div className="space-y-2 mb-4">
        {activeItems.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-[#CCCCCC]">
              {item.name} {item.isGift && '(Gift)'}
            </span>
            <div className="flex flex-col items-end"> 
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="text-xs text-gray-500 line-through">
                  {formatCurrency(item.originalPrice, 'USD')}
                </span>
              )}
              <span className="text-white font-medium">
                {formatCurrency(item.price, 'USD')}
              </span>
              {item.saleValue && item.saleValue > 0 && (
                <span className="text-xs text-green-400">
                  Save {formatCurrency(item.saleValue, 'USD')}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Total */}
      <div className="border-t border-[#333333]/50 pt-4 mb-6">
        <div className="flex justify-between text-lg font-bold">
          <span className="text-white">Total</span>
          <span className="text-white">{formatCurrency(total, 'USD')}</span>
        </div>
        <p className="text-xs text-[#999999] mt-1">
          All prices include applicable taxes
        </p>
      </div>

      {/* Referral Information */}
      {isReferred && referrerSteam64 && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-green-400 font-medium mb-1">Referral Active</p>
              <p className="text-[#CCCCCC]">
                Your referrer will earn 7 gems for every $1 you spend!
              </p>
              <p className="text-xs text-[#999999] mt-1">
                Referrer ID: {referrerSteam64}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PayNow now supports all items in a single checkout - no limitations info needed */}

      {/* Error Message */}
      {checkoutError && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-red-400 text-sm">{checkoutError}</p>
          </div>
        </div>
      )}

      {/* Checkout Buttons */}
      <div className="space-y-3">
        <Button
          onClick={onRegularCheckout}
          disabled={isCheckingOut}
          className="w-full bg-[#E60000] hover:bg-[#cc0000] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isCheckingOut ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Proceed to Checkout
            </>
          )}
        </Button>
      </div>

      {/* Payment Info */}
      <div className="mt-4 text-xs text-[#999999] text-center">
        <p>Secure checkout powered by PayNow</p>
        <p>Your payment information is encrypted and secure</p>
      </div>
    </div>
  );
} 