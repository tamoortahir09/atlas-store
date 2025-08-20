"use client";
import React, { useState, useEffect } from 'react';
import { X, Crown, Zap, Users, Clock, Gift, Star, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/formatters';
import { useToast } from '@/hooks/use-toast';
import type { Rank } from '@/lib/store/types';
import { Portal } from './Portal';

interface VipDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rank: Rank;
}

interface VipProduct {
  price: number;
  originalPrice?: number;
  saleEndDate?: Date;
  isLoading: boolean;
  payNowProductId?: string;
}

export function VipDetailsModal({ isOpen, onClose, rank }: VipDetailsModalProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [vipProduct, setVipProduct] = useState<VipProduct>({
    price: rank.price || 14.99,
    isLoading: false,
    payNowProductId: rank.payNowProductId
  });

  const handleAddToCart = () => {
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

    const cartItem = {
      id: `rank-${rank.id}`,
      type: 'rank' as const,
      quantity: 1,
      price: rank.price,
      originalPrice: rank.originalPrice,
      saleValue: rank.saleValue,
      name: rank.displayName || rank.name || 'VIP Package',
      payNowProductId: rank.payNowProductId,
    };

    addItem(cartItem);
    toast({
      title: "Added to Cart",
      description: `${cartItem.name} has been added to your cart`,
    });
    onClose();
  };

  if (!isOpen) return null;

  // Check if VIP has an active sale
  const hasVipSale = vipProduct.originalPrice && 
                    vipProduct.originalPrice > vipProduct.price &&
                    vipProduct.saleEndDate &&
                    vipProduct.saleEndDate.getTime() > Date.now();

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-gradient-to-b from-gray-900/95 to-black/95 
          w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-700/50
          transform transition-all duration-300 scale-100">
          
          <div className="flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600/20 to-purple-600/20 border border-purple-500/30">
                  <Crown className="h-8 w-8 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-purple-400">VIP Access Details</h2>
                  <p className="text-gray-400 mt-1">Priority queue access & exclusive benefits</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">
              {/* VIP Benefits Section */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-300 mb-6">VIP Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Priority Queue Access */}
                  <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/10 p-6 rounded-xl border border-purple-500/20">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-purple-500/20">
                        <Zap className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-purple-300 mb-2">Priority Queue Access</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          Skip server queues instantly and get priority access to all servers. 
                          No more waiting in line - jump straight into the action!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* VIP Server Benefits */}
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/10 p-6 rounded-xl border border-blue-500/20">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-blue-500/20">
                        <Users className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-blue-300 mb-2">VIP Server Access</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          Access to VIP-only areas and reserved slots on popular servers. 
                          Enjoy a premium gaming experience with fellow VIP members.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Instant Connection */}
                  <div className="bg-gradient-to-br from-green-500/10 to-green-500/10 p-6 rounded-xl border border-green-500/20">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-green-500/20">
                        <Clock className="h-6 w-6 text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-green-300 mb-2">Instant Connection</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          Connect instantly to any server without waiting. Perfect for when you want to 
                          play with friends or join popular events.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* VIP Support */}
                  <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/10 p-6 rounded-xl border border-yellow-500/20">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-yellow-500/20">
                        <Shield className="h-6 w-6 text-yellow-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-yellow-300 mb-2">Priority Support</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          Get priority support from our team with faster response times and 
                          dedicated VIP assistance for any issues.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* How It Works Section */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-300 mb-4">How VIP Access Works</h3>
                <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="p-4 rounded-full bg-purple-500/20 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl font-bold text-purple-400">1</span>
                      </div>
                      <h4 className="font-semibold text-gray-300 mb-2">Purchase VIP</h4>
                      <p className="text-gray-400 text-sm">
                        Get instant VIP access upon purchase completion
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="p-4 rounded-full bg-purple-500/20 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl font-bold text-purple-400">2</span>
                      </div>
                      <h4 className="font-semibold text-gray-300 mb-2">Connect to Server</h4>
                      <p className="text-gray-400 text-sm">
                        Join any server and skip the queue automatically
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="p-4 rounded-full bg-purple-500/20 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl font-bold text-purple-400">3</span>
                      </div>
                      <h4 className="font-semibold text-gray-300 mb-2">Enjoy Premium Experience</h4>
                      <p className="text-gray-400 text-sm">
                        Experience priority access and VIP benefits
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              {hasVipSale && (
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-red-500/10 to-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-500/20">
                        <Star className="h-5 w-5 text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-400">Limited Time Sale!</h4>
                        <p className="text-gray-400 text-sm">
                          Save {formatCurrency((vipProduct.originalPrice || 0) - vipProduct.price, 'USD')} on VIP Access
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Purchase Section */}
            <div className="p-6 border-t border-gray-700/50 bg-gray-800/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-gray-400">VIP Access Price</span>
                  <div className="flex items-center gap-3">
                    {hasVipSale && vipProduct.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        {formatCurrency(vipProduct.originalPrice, 'USD')}
                      </span>
                    )}
                    <div className="text-3xl font-bold text-purple-400">
                      {formatCurrency(vipProduct.price, 'USD')}
                    </div>
                  </div>
                  {hasVipSale && (
                    <div className="text-sm text-green-400 mt-1">
                      You save {formatCurrency((vipProduct.originalPrice || 0) - vipProduct.price, 'USD')}!
                    </div>
                  )}
                </div>
                
                <Button
                  onClick={handleAddToCart}
                  disabled={vipProduct.isLoading}
                  size="lg"
                  className="w-full sm:w-auto min-w-[200px] h-[50px] text-lg
                    bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 
                    text-white font-bold transform transition-all duration-200
                    hover:scale-105 active:scale-95 shadow-xl
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {vipProduct.isLoading ? 'Loading...' : 'Get VIP Access'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Portal>
  );
} 