'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { CartItem } from '@/lib/store/types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
  // Gift functionality
  updateItemGift: (id: string, giftInfo: { platform: string; id: string; displayName?: string } | null) => void;
  // Subscription functionality
  updateItemSubscription: (id: string, subscription: boolean) => void;
  // Rank purchase restrictions
  hasRankInCartForSelf: (rankId: string) => boolean;
  getRankInCartInfo: (rankId: string) => { forSelf: boolean; forGift: boolean; count: number };
  // Bundle purchase restrictions
  hasBundleInCartForSelf: (bundleId: string) => boolean;
  getBundleInCartInfo: (bundleId: string) => { forSelf: boolean; forGift: boolean; count: number };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize cart from localStorage on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('atlas_cart');
      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch (error) {
          console.error('Failed to parse cart from localStorage:', error);
        }
      }
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem('atlas_cart', JSON.stringify(items));
    }
  }, [items, isInitialized]);

  // Check if a rank is already in cart for personal purchase (not as gift)
  const hasRankInCartForSelf = useCallback((rankId: string): boolean => {
    return items.some(item => 
      item.type === 'rank' && 
      item.payNowProductId === rankId && 
      !item.isGift
    );
  }, [items]);

  // Get detailed rank information in cart
  const getRankInCartInfo = useCallback((rankId: string) => {
    const rankItems = items.filter(item => 
      item.type === 'rank' && 
      item.payNowProductId === rankId
    );
    
    return {
      forSelf: rankItems.some(item => !item.isGift),
      forGift: rankItems.some(item => item.isGift),
      count: rankItems.length
    };
  }, [items]);

  // Check if a bundle is already in cart for personal purchase (not as gift)
  const hasBundleInCartForSelf = useCallback((bundleId: string): boolean => {
    return items.some(item => 
      item.type === 'bundle' && 
      item.payNowProductId === bundleId && 
      !item.isGift
    );
  }, [items]);

  // Get detailed bundle information in cart
  const getBundleInCartInfo = useCallback((bundleId: string) => {
    const bundleItems = items.filter(item => 
      item.type === 'bundle' && 
      item.payNowProductId === bundleId
    );
    
    return {
      forSelf: bundleItems.some(item => !item.isGift),
      forGift: bundleItems.some(item => item.isGift),
      count: bundleItems.length
    };
  }, [items]);

  const addItem = useCallback((item: CartItem) => {
    // Generate unique ID for each cart item - NEVER combine items
    const uniqueCartId = `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newCartItem: CartItem = {
      ...item,
      id: uniqueCartId, // Override with unique ID
      quantity: 1, // Always 1 for separate items
    };

    setItems(current => [...current, newCartItem]);
    
    // Show success notification (you can replace this with your toast system)
    console.log(`${item.name} added to cart! 🛒`);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(current => current.filter(item => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const updateItemGift = useCallback((id: string, giftInfo: { platform: string; id: string; displayName?: string } | null) => {
    setItems(current => 
      current.map(item => 
        item.id === id 
          ? { 
              ...item, 
              isGift: !!giftInfo,
              giftTo: giftInfo || undefined,
              // Gift items should always be one-time purchases, not subscriptions
              subscription: giftInfo ? false : item.subscription
            }
          : item
      )
    );
  }, []);

  const updateItemSubscription = useCallback((id: string, subscription: boolean) => {
    setItems(current => 
      current.map(item => 
        item.id === id 
          ? { 
              ...item, 
              subscription: item.isGift ? false : subscription // Gift items cannot be subscriptions
            }
          : item
      )
    );
  }, []);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      clearCart, 
      total, 
      updateItemGift,
      updateItemSubscription,
      hasRankInCartForSelf,
      getRankInCartInfo,
      hasBundleInCartForSelf,
      getBundleInCartInfo
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 