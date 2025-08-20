'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { EmptyBasket } from './basket/EmptyBasket';
import { BasketItem } from './basket/BasketItem';
import { CompletedItems } from './basket/CompletedItems';
import { OrderSummary } from './basket/OrderSummary';
import { CustomNameAddon } from './basket/CustomNameAddon';
import { TargetedUpsells } from './basket/TargetedUpsells';
import { GiftModal } from '@/components/ui/GiftModal';
import { SubscriptionStepper } from './basket/SubscriptionStepper';
import { usePayNowProducts } from '@/hooks/usePayNowProducts';
import { createCheckout } from '@/lib/paynow';
import { debugCheckoutIssues } from '@/lib/debug-checkout';
import { hasActiveReferral, getReferrerSteam64 } from '@/lib/referral';
import type { CartItem } from '@/lib/store/types';

const STEPPER_STORAGE_KEY = 'atlas-subscription-stepper';
const COMPLETED_ITEMS_STORAGE_KEY = 'atlas-completed-items';

interface SubscriptionStepperState {
  startedAt: string;
  steps: Array<{ status: 'completed' | 'pending' }>;
}

export default function BasketPage() {
  const router = useRouter();
  const { items, removeItem, updateItemGift, addItem } = useCart();
  const { user, isAuthenticated, loading } = useAuth();
  const { toast } = useToast();
  const { gemPackages, ranks } = usePayNowProducts();

  // Debug authentication state
  console.log('Auth state in BasketPage:', {
    user,
    isAuthenticated,
    loading,
    userType: typeof user,
    userKeys: user ? Object.keys(user) : 'null'
  });
  
  // Mock accessories for now
  const accessories: any[] = [];
  
  const [showContent, setShowContent] = useState(false);
  const [giftModalOpen, setGiftModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{id: string; name: string} | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [showSubscriptionStepper, setShowSubscriptionStepper] = useState(false);
  const [completedItemIds, setCompletedItemIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(COMPLETED_ITEMS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(COMPLETED_ITEMS_STORAGE_KEY, JSON.stringify(completedItemIds));
    }
  }, [completedItemIds]);

  const activeItems = items.filter(item => !completedItemIds.includes(item.id));
  const completedItems = items.filter(item => completedItemIds.includes(item.id));

  // Total price calculation
  const total = activeItems.reduce((sum, item) => sum + item.price, 0);

  // Helper function to get custom name accessory
  const getCustomNameAccessory = () => {
    return accessories.find(accessory => accessory.id === 'custom-colored-name');
  };

  // Check if user has an active referral
  const isReferred = hasActiveReferral();
  const referrerSteam64 = getReferrerSteam64();

  // With PayNow line items support, all items can be processed in a single checkout
  const subscriptionItems = activeItems.filter(item => item.type === 'rank');
  const personalSubscriptionItems = activeItems.filter(item => item.type === 'rank' && !item.isGift);

  const hasMultipleSubscriptions = personalSubscriptionItems.length > 1;
  const hasNonSubscriptionItems = activeItems.some(item => item.type !== 'rank');
  
  // PayNow now supports all items in a single checkout with line items
  const requiresStepperCheckout = false; // Always use single checkout
  const canUseRegularCheckout = true; // Always use regular checkout

  // Animation for fade-in elements
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStepperState = sessionStorage.getItem(STEPPER_STORAGE_KEY);
      if (savedStepperState) {
        try {
          const parsedState = JSON.parse(savedStepperState) as SubscriptionStepperState;
          const savedTime = new Date(parsedState.startedAt);
          const now = new Date();
          const hoursDiff = (now.getTime() - savedTime.getTime()) / (1000 * 60 * 60);
    
          // If a valid, non-expired session exists with pending items, open the stepper
          if (hoursDiff < 24 && parsedState.steps.some(s => s.status !== 'completed')) {
            setShowSubscriptionStepper(true);
          } else {
            // Clean up expired or completed session data
            sessionStorage.removeItem(STEPPER_STORAGE_KEY);
          }
        } catch (e) {
          // Clean up corrupted data
          sessionStorage.removeItem(STEPPER_STORAGE_KEY);
        }
      }
    }
  }, []);

  const handleGiftClick = (itemId: string, itemName: string) => {
    setSelectedItem({ id: itemId, name: itemName });
    setGiftModalOpen(true);
  };

  const handleGiftSubmit = async (giftInfoList: { platform: string; id: string; displayName?: string }[]) => {
    if (!selectedItem) return;

    try {
      // For each recipient, add a new cart item as a gift
      giftInfoList.forEach(giftInfo => {
        // Find the original item to clone
        const originalItem = items.find(item => item.id === selectedItem.id);
        if (!originalItem) return;

        // Create a new cart item for this recipient
        const newItemId = `${selectedItem.id}-gift-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const giftItem = {
          ...originalItem,
          id: newItemId,
          isGift: true,
          giftTo: giftInfo
        };

        // Add the gift item to cart
        addItem(giftItem);
      });

      console.log('Gifts configured for item', {
        itemName: selectedItem.name,
        recipientCount: giftInfoList.length,
        recipients: giftInfoList.map(g => g.displayName || g.id)
      });
    } catch (error) {
      console.error('Failed to configure gifts:', error);
    }
  };

  const handleRemoveGift = (itemId: string) => {
    updateItemGift(itemId, null);
  };

  const handleQuickGemUpgrade = (currentItem: any, nextGemPackage: any) => {
    // Validate that the gem package has a PayNow product ID
    if (!nextGemPackage.payNowProductId) {
      console.error('Gem package missing PayNow product ID:', nextGemPackage);
      toast({
        title: "Error",
        description: "This gem package is not available for purchase at the moment.",
        variant: "destructive",
      });
      return;
    }

    // Remove current gem item
    removeItem(currentItem.id);
    
    // Add upgraded gem package
    addItem({
      id: `gem-${nextGemPackage.id}`,
      type: 'gems',
      quantity: 1,
      price: nextGemPackage.price,
      originalPrice: nextGemPackage.originalPrice,
      saleValue: nextGemPackage.saleValue,
      name: nextGemPackage.name,
      payNowProductId: nextGemPackage.payNowProductId,
    });
  };

  const handleAddCustomName = () => {
    const customNameAccessory = getCustomNameAccessory();
    
    if (!customNameAccessory) {
      console.error('Custom name accessory not found in accessories data');
      toast({
        title: "Error",
        description: "Custom name addon is not available at the moment.",
        variant: "destructive",
      });
      return;
    }

    if (!customNameAccessory.payNowProductId) {
      console.error('Custom name accessory missing PayNow product ID:', customNameAccessory);
      toast({
        title: "Error",
        description: "Custom name addon is not available for purchase at the moment.",
        variant: "destructive",
      });
      return;
    }

    addItem({
      id: `custom-name-${Date.now()}`,
      type: 'accessory',
      quantity: 1,
      price: customNameAccessory.price,
      originalPrice: customNameAccessory.originalPrice,
      saleValue: customNameAccessory.saleValue,
      name: customNameAccessory.name,
      payNowProductId: customNameAccessory.payNowProductId,
    });
  };

  const handleSubscriptionStepper = () => {
    setShowSubscriptionStepper(true);
  };

  const handleStepperClose = (completedIds: string[]) => {
    setShowSubscriptionStepper(false);
    
    // Mark items as completed
    setCompletedItemIds(prev => [...prev, ...completedIds]);
    
    // Show success toast for each completed item
    completedIds.forEach(itemId => {
      const item = items.find(i => i.id === itemId);
      if (item) {
        toast({
          title: "Purchase Successful",
          description: `Successfully purchased: ${item.name}`,
        });
      }
    });
    
    // Clean up stepper session data
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STEPPER_STORAGE_KEY);
    }
  };

  const handleRemoveCompletedItem = (itemId: string) => {
    // Remove from completed items list
    setCompletedItemIds(prev => prev.filter(id => id !== itemId));
    // Remove from cart entirely
    removeItem(itemId);
    toast({
      title: "Item Removed",
      description: "Completed item removed from basket",
    });
  };

  const handleCheckout = async () => {
    const itemsForCheckout = items.filter(item => !completedItemIds.includes(item.id || ''));
    if (itemsForCheckout.length === 0) {
      toast({
        title: "Empty Basket",
        description: "Your basket is empty or all items have been purchased.",
      });
      return;
    }

    // Check if user is authenticated
    if (!user || !isAuthenticated) {
      console.error('User not authenticated:', { user, isAuthenticated, loading });
      setCheckoutError('Please sign in with Steam to proceed with checkout.');
      return;
    }

    // Validate that all gift items have recipients assigned
    const giftItemsWithoutRecipients = itemsForCheckout.filter(item => 
      item.isGift === true && (!item.giftTo || !item.giftTo.id)
    );

    if (giftItemsWithoutRecipients.length > 0) {
      const itemNames = giftItemsWithoutRecipients.map(item => item.name).join(', ');
      setCheckoutError(`Please assign recipients for the following gift items: ${itemNames}`);
      return;
    }

    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      // Run comprehensive debug check
      const debugResult = debugCheckoutIssues(itemsForCheckout, user, isAuthenticated);
      
      // Additional debugging for cart items
      console.log('🛒 Detailed cart analysis before checkout:', {
        cartItems: items,
        itemsForCheckout,
        cartItemsWithProductIds: items.filter(item => item.payNowProductId),
        checkoutItemsWithProductIds: itemsForCheckout.filter(item => item.payNowProductId)
      });
      
      if (!debugResult.canProceed) {
        throw new Error(`Checkout validation failed: ${debugResult.issues.join('; ')}`);
      }

      console.log('Starting checkout with items', {
        itemCount: itemsForCheckout.length,
        giftItemCount: itemsForCheckout.filter(item => item.isGift).length,
        userSteamId: user.steam_id,
        user: user // Log full user object for debugging
      });

      // Validate cart items have PayNow product IDs
      const itemsWithoutProductIds = itemsForCheckout.filter(item => !item.payNowProductId);
      if (itemsWithoutProductIds.length > 0) {
        console.error('❌ Cart items missing PayNow product IDs:', itemsWithoutProductIds.map(item => ({
          id: item.id,
          type: item.type,
          name: item.name,
          price: item.price,
          payNowProductId: item.payNowProductId,
          isGift: item.isGift
        })));
        throw new Error(`Some items in your cart are not properly configured for checkout: ${itemsWithoutProductIds.map(item => item.name).join(', ')}`);
      }
      
      // Log all valid items that will be sent to checkout
      console.log('✅ All cart items have valid PayNow product IDs:', itemsForCheckout.map(item => ({
        id: item.id,
        type: item.type,
        name: item.name,
        price: item.price,
        payNowProductId: item.payNowProductId,
        isGift: item.isGift
      })));
      
      // Create checkout using PayNow integration
      const checkoutUrl = await createCheckout(itemsForCheckout, user, 'USD');

      if (!checkoutUrl) {
        throw new Error('No checkout URL received from PayNow');
      }

      toast({
        title: "Checkout Started",
        description: "Redirecting to PayNow checkout...",
      });
      
      // Redirect to PayNow checkout
      window.location.href = checkoutUrl;
      
    } catch (err) {
      console.error('Detailed checkout error:', err);
      
      let errorMessage = 'Failed to create checkout. Please try again.';
      
      if (err instanceof Error) {
        if (err.message.includes('Steam authentication required')) {
          errorMessage = 'Please sign in with Steam to proceed with checkout.';
        } else if (err.message.includes('not properly configured')) {
          errorMessage = 'Some items in your cart are not available for purchase at this time. Please contact support.';
        } else if (err.message.includes('PayNow validation failed')) {
          errorMessage = 'There was an issue processing your order. Please try again or contact support.';
        } else if (err.message.includes('No valid products')) {
          errorMessage = 'Unable to process your cart. Please refresh the page and try again.';
        } else if (err.message.includes('Could not find PayNow products')) {
          errorMessage = 'Some items in your cart are not available. Please remove them and try again.';
        } else {
          errorMessage = `Checkout failed: ${err.message}`;
        }
      }
      
      setCheckoutError(errorMessage);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleReplaceWithRank = (queueSkipItem: any, selectedRank: any) => {
    // Validate that the selected rank has a PayNow product ID
    if (!selectedRank.payNowProductId) {
      console.error('Selected rank missing PayNow product ID:', selectedRank);
      toast({
        title: "Error",
        description: "This rank is not available for purchase at the moment.",
        variant: "destructive",
      });
      return;
    }

    // Remove the queue skip item
    removeItem(queueSkipItem.id);
    
    // Add the selected rank
    addItem({
      id: `rank-${selectedRank.id}`,
      type: 'rank',
      quantity: 1,
      price: selectedRank.price,
      name: selectedRank.displayName || selectedRank.name,
      payNowProductId: selectedRank.payNowProductId,
    });
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#0A0A0A] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <EmptyBasket showContent={showContent} />
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className={`transition-all duration-700 ease-out ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Shopping Basket</h1>
            <Link href="/store">
              <button className="flex items-center gap-2 text-[#CCCCCC] hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span>Continue Shopping</span>
              </button>
            </Link>
          </div>

          {/* Completed Items */}
          <CompletedItems 
            completedItems={completedItems}
            onRemoveCompletedItem={handleRemoveCompletedItem}
          />

          {/* Items List */}
          <div className="mb-8 space-y-4">
            {activeItems.map((item) => (
              <BasketItem
                key={item.id}
                item={item}
                gemPackages={gemPackages}
                ranks={ranks}
                onGiftClick={handleGiftClick}
                onRemoveItem={removeItem}
                onRemoveGift={handleRemoveGift}
                onQuickGemUpgrade={handleQuickGemUpgrade}
                onReplaceWithRank={handleReplaceWithRank}
              />
            ))}
          </div>

          {/* Targeted Upsells Based on Cart Contents */}
          <TargetedUpsells className="mb-8" />

          {/* Custom Colored Name Package Addon */}
          <CustomNameAddon
            items={items}
            customNameAccessory={getCustomNameAccessory()}
            showContent={showContent}
            onAddCustomName={handleAddCustomName}
          />

          {/* Order Summary */}
          <div className={`transition-all duration-700 ease-out delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <OrderSummary
              activeItems={activeItems}
              total={total}
              isReferred={isReferred}
              referrerSteam64={referrerSteam64}
              requiresStepperCheckout={requiresStepperCheckout}
              canUseRegularCheckout={canUseRegularCheckout}
              hasMultipleSubscriptions={hasMultipleSubscriptions}
              hasNonSubscriptionItems={hasNonSubscriptionItems}
              subscriptionItems={subscriptionItems}
              checkoutError={checkoutError}
              isCheckingOut={isCheckingOut}
              onRegularCheckout={handleCheckout}
              onStepperCheckout={handleSubscriptionStepper}
            />
          </div>
        </div>
      </div>

      {/* Gift Modal */}
      <GiftModal
        isOpen={giftModalOpen}
        onClose={() => {
          setGiftModalOpen(false);
          setSelectedItem(null);
        }}
        onSubmit={handleGiftSubmit}
        itemName={selectedItem?.name || ''}
      />

      {/* Subscription Stepper Modal */}
      <SubscriptionStepper
        isOpen={showSubscriptionStepper}
        onClose={handleStepperClose}
        items={subscriptionItems}
      />
    </div>
  );
} 