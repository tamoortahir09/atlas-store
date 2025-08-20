// Debug utilities for PayNow checkout troubleshooting
import type { CartItem } from '@/lib/store/types';
import { checkPayNowEnvironment } from './env-check';

export function debugCheckoutIssues(
  cartItems: CartItem[], 
  user: any, 
  isAuthenticated: boolean
) {
  console.log('🔍 Debugging Checkout Issues...');
  
  const issues: string[] = [];
  const warnings: string[] = [];
  
  // 1. Check environment configuration
  const envCheck = checkPayNowEnvironment();
  if (!envCheck.isValid) {
    issues.push(`Environment configuration: ${envCheck.issues.join(', ')}`);
  }
  
  // 2. Check user authentication
  if (!user) {
    issues.push('User object is null/undefined');
  } else {
    console.log('User object structure:', {
      type: typeof user,
      keys: Object.keys(user),
      steamId: user.steam_id || user.steamId || user.id || 'NOT_FOUND',
      name: user.name || user.personaname || user.displayName || 'NOT_FOUND'
    });
    
    if (!isAuthenticated) {
      issues.push('User is not authenticated according to Redux state');
    }
    
    const steamId = user.steam_id || user.steamId || user.id;
    if (!steamId) {
      issues.push('User object missing Steam ID (checked steam_id, steamId, id fields)');
    }
  }
  
  // 3. Check cart items
  if (!cartItems || cartItems.length === 0) {
    issues.push('No cart items provided');
  } else {
    console.log('Cart items analysis:', {
      totalItems: cartItems.length,
      itemTypes: Array.from(new Set(cartItems.map(item => item.type))),
      itemsWithPayNowId: cartItems.filter(item => item.payNowProductId).length,
      itemsWithoutPayNowId: cartItems.filter(item => !item.payNowProductId).length
    });
    
    const itemsWithoutProductIds = cartItems.filter(item => !item.payNowProductId);
    if (itemsWithoutProductIds.length > 0) {
      issues.push(`${itemsWithoutProductIds.length} cart items missing PayNow product IDs: ${itemsWithoutProductIds.map(item => item.name).join(', ')}`);
    }
    
    const giftItems = cartItems.filter(item => item.isGift);
    const giftItemsWithoutRecipients = giftItems.filter(item => !item.giftTo || !item.giftTo.id);
    if (giftItemsWithoutRecipients.length > 0) {
      issues.push(`${giftItemsWithoutRecipients.length} gift items missing recipients`);
    }
  }
  
  // 4. Check browser environment
  if (typeof window === 'undefined') {
    warnings.push('Running in server-side environment');
  }
  
  const result = {
    hasIssues: issues.length > 0,
    issues,
    warnings,
    canProceed: issues.length === 0
  };
  
  console.log('🔍 Checkout Debug Results:', result);
  
  if (result.hasIssues) {
    console.error('❌ Checkout Issues Found:', issues);
  } else {
    console.log('✅ No critical checkout issues found');
  }
  
  if (warnings.length > 0) {
    console.warn('⚠️ Checkout Warnings:', warnings);
  }
  
  return result;
}

export function debugPayNowAPI() {
  console.log('🔍 PayNow API Debug Info:');
  
  const config = {
    storeId: process.env.NEXT_PUBLIC_PAYNOW_STORE_ID,
    hasStoreId: !!process.env.NEXT_PUBLIC_PAYNOW_STORE_ID,
    apiEndpoints: {
      products: '/api/paynow/products',
      customer: '/api/paynow/customer',
      checkout: '/api/paynow/checkout'
    },
    environment: process.env.NODE_ENV
  };
  
  console.log('PayNow Configuration:', config);
  
  return config;
} 