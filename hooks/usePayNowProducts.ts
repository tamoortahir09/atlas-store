import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { getAllRankConfigs } from '@/lib/store/ranks';
import { gemConfigurations } from '@/lib/store/gems';
import { getAllBundleConfigs } from '@/lib/store/bundles';
import { PAYNOW_PRODUCT_IDS, getRankProductId, getGemProductId } from '@/lib/store/productIds';
import type { Rank, GemPackage, Bundle } from '@/lib/store/types';
import { $paynowApi, paynowApi } from '@/lib/api/paynow';
import { API_CONFIG } from '@/lib/config';

// PayNow API Types
export interface PayNowCustomer {
  id: string;
  store_id: string;
  profile?: {
    id: string;
    platform: 'steam' | 'minecraft' | 'xbox';
    name: string;
    avatar_url?: string;
  };
  steam_id?: string;
  steam?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  name?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface PayNowInventoryItem {
  id: string;
  store_id: string;
  customer_id: string;
  order_id?: string;
  order_line_id?: string;
  quantity_index?: number;
  product: {
    id: string;
    store_id: string;
    version_id: string;
    slug: string;
    name: string;
  };
  state: 'usable' | 'active' | 'used' | 'revoked';
  expirable: boolean;
  gift: boolean;
  added_at: string;
  active_at?: string;
  expires_at?: string;
  removed_at?: string;
  revoked_at?: string;
  revoke_reason?: 'admin' | 'refund' | 'chargeback';
}

export interface PayNowSubscription {
  id: string;
  pretty_id: string;
  store_id: string;
  customer: PayNowCustomer;
  status: 'created' | 'active' | 'canceled';
  checkout_id: string;
  checkout_line_id: string;
  billing_name?: string;
  billing_email?: string;
  billing_country?: string;
  gift: boolean;
  gift_to_customer?: PayNowCustomer;
  product_id: string;
  product_version_id: string;
  product_name: string;
  product_image_url?: string;
  interval_value: number;
  interval_scale: 'day' | 'week' | 'month' | 'year';
  currency: string;
  tax_inclusive: boolean;
  price: number;
  price_str: string;
  discount_amount: number;
  discount_amount_str: string;
  subtotal_amount: number;
  subtotal_amount_str: string;
  tax_amount: number;
  tax_amount_str: string;
  total_amount: number;
  total_amount_str: string;
  current_period_start?: string;
  current_period_end?: string;
  billing_cycle_sequence: number;
  created_at: string;
  updated_at?: string;
  active_at?: string;
  canceled_at?: string;
  cancel_reason?: string;
}

export interface PayNowProduct {
  id: string;
  store_id: string;
  slug: string;
  image_url?: string;
  name: string;
  description: string;
  enabled: boolean;
  sort_order: number;
  price: number;
  currency: string;
  allow_one_time_purchase: boolean;
  allow_subscription: boolean;
  subscription_interval_value: number;
  subscription_interval_scale: 'day' | 'week' | 'month' | 'year';
  stock?: {
    available_to_purchase: boolean;
    customer_available?: number;
  };
  pricing?: {
    active_sale?: any;
    sale_value?: number;
    vat_rate?: any;
    price_original: number;
    price_final: number;
  };
  tags: Array<{
    id: string;
    slug: string;
    name: string;
  }>;
  created_at: string;
  updated_at?: string;
}

// Transform types for the Profile component
export interface ProfilePackage {
  id: string;
  productId: string;
  name: string;
  type: 'rank' | 'subscription' | 'one_time' | 'gift' | 'gems';
  status: 'active' | 'expired' | 'pending';
  purchaseDate: string;
  expiryDate: string;
  price: number;
  giftedBy?: string;
  giftedTo?: string;
  features: string[];
  tags: string[];
  // PayNow specific IDs
  paynowId?: string; // The main PayNow ID
  prettyId?: string; // Human-readable ID for subscriptions
  orderId?: string; // Order ID for inventory items
}

export interface ProfileTransaction {
  id: string;
  date: string;
  type: 'purchase' | 'gift_sent' | 'gift_received';
  packageName: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  recipient?: string;
  sender?: string;
  // PayNow specific IDs
  paynowId?: string; // The PayNow ID for reference
  orderId?: string; // Order ID if available
}

export interface ProfileStats {
  totalSpent: number;
  activeProducts: number;
  gemBalance: number;
  gemsEarned: number;
  referralsCount: number;
  memberSince: string;
}

export interface UsePayNowProductsResult {
  // Data for Profile Page
  customer: PayNowCustomer | null;
  packages: ProfilePackage[];
  transactions: ProfileTransaction[];
  stats: ProfileStats | null;
  
  // Data for Store Page
  ranks: Rank[];
  gemPackages: GemPackage[];
  bundles: Bundle[];

  // Loading states
  isLoading: boolean;
  isLoadingCustomer: boolean;
  isLoadingInventory: boolean;
  isLoadingSubscriptions: boolean;
  isLoadingProducts: boolean;
  
  // Error states
  error: string | null;
  
  // Actions
  refresh: () => Promise<void>;
  cancelSubscription: (subscriptionId: string) => Promise<void>;
}

// Global state to prevent multiple instances from making duplicate API calls
interface GlobalPayNowState {
  storeToken: string | null;
  customer: PayNowCustomer | null;
  packages: ProfilePackage[];
  transactions: ProfileTransaction[];
  stats: ProfileStats | null;
  ranks: Rank[];
  gemPackages: GemPackage[];
  bundles: Bundle[];
  error: string | null;
  isLoading: boolean;
  isLoadingCustomer: boolean;
  isLoadingInventory: boolean;
  isLoadingSubscriptions: boolean;
  isLoadingProducts: boolean;
  lastFetchTime: number;
  subscribers: Set<(state: GlobalPayNowState) => void>;
}

const globalPayNowState: GlobalPayNowState = {
  storeToken: null,
  customer: null,
  packages: [],
  transactions: [],
  stats: null,
  ranks: [],
  gemPackages: [],
  bundles: [],
  error: null,
  isLoading: true,
  isLoadingCustomer: false,
  isLoadingInventory: false,
  isLoadingSubscriptions: false,
  isLoadingProducts: false,
  lastFetchTime: 0,
  subscribers: new Set()
};

const CACHE_DURATION = 30000; // 30 seconds

function notifySubscribers() {
  globalPayNowState.subscribers.forEach(callback => callback(globalPayNowState));
}

async function createOrGetCustomer(storeToken: string, steamUser: any): Promise<{ customer: PayNowCustomer; token: string }> {
  // If we have a store_token, use it directly - no need to create/lookup customer
  if (storeToken) {
    try {
      // Use the store token to get customer info directly
      const customer = await paynowApi.customer.get('/store/customer', storeToken);
      console.log('Using store_token directly for customer:', customer.id);
      
      return {
        customer,
        token: storeToken // Use the provided store token
      };
    } catch (error: any) {
      console.error('Store token invalid or expired:', error);
      // Don't fallback for now - if store token is invalid, we need to handle that properly
      throw new Error('Store token is invalid or expired. Please re-authenticate.');
    }
  }

  // Fallback for users without store_token (legacy flow)
  const storeId = API_CONFIG.paynow.storeId;
  const steamId = steamUser.steam_id;
  
  if (!steamId) {
    throw new Error('No valid store token and no Steam ID available for customer lookup');
  }

  console.log('No store_token available, using Steam ID fallback for:', steamId);
  
  // Try to lookup existing customer by Steam ID
  let customer = null;
  try {
    customer = await paynowApi.admin.get(`/stores/${storeId}/customers/lookup`, { steam_id: steamId });
    console.log('Found existing customer by Steam ID:', customer.id);
  } catch (lookupError: any) {
    if (lookupError.status !== 404) {
      console.error('Customer lookup failed:', lookupError);
    }
  }

  // Create customer if not found
  if (!customer) {
    const customerData = {
      steam_id: steamId,
      name: steamUser.name || 'Unknown Player',
      metadata: {
        created_via: 'atlas_store_integration',
        created_at: new Date().toISOString()
      }
    };

    customer = await paynowApi.admin.post(`/stores/${storeId}/customers`, customerData);
    console.log('Created new customer:', customer.id);
  }

  // Generate customer token
  const tokenData = await paynowApi.admin.post(`/stores/${storeId}/customers/${customer.id}/tokens`);

  return {
    customer,
    token: tokenData.token
  };
}

async function getCustomerInventory(token: string): Promise<PayNowInventoryItem[]> {
  console.log('Fetching customer inventory with token...');
  const inventory = await paynowApi.customer.get('/store/customer/command_delivery', token);
  console.log('Retrieved customer inventory:', inventory.length, 'items');
  return inventory;
}

async function getCustomerSubscriptions(token: string): Promise<PayNowSubscription[]> {
  console.log('Fetching customer subscriptions with token...');
  const subscriptions = await paynowApi.customer.get('/store/customer/subscriptions', token);
  console.log('Retrieved customer subscriptions:', subscriptions.length, 'subscriptions');
  return subscriptions;
}

async function getStoreProducts(storeId: string): Promise<PayNowProduct[]> {
  return await paynowApi.public.get('/store/products', { store_id: storeId });
}

/**
 * Merges local rank configurations with data fetched from PayNow.
 */
function mergeRankData(rankConfig: Rank, payNowProduct: PayNowProduct | null): Rank {
  if (!payNowProduct) {
    return rankConfig;
  }
  const finalPrice = (payNowProduct.pricing?.price_final ?? payNowProduct.price) / 100;
  const originalPrice = payNowProduct.pricing?.price_original ? payNowProduct.pricing.price_original / 100 : undefined;

  return {
    ...rankConfig,
    id: payNowProduct.id,
    name: payNowProduct.name,
    displayName: payNowProduct.name,
    price: finalPrice,
    originalPrice,
    currency: payNowProduct.currency,
    imageUrl: payNowProduct.image_url,
    payNowProductId: payNowProduct.id,
  };
}

/**
 * Merges local gem configurations with data fetched from PayNow.
 */
function mergeGemData(gemConfig: GemPackage, payNowProduct: PayNowProduct | null): GemPackage {
  if (!payNowProduct) {
    return { ...gemConfig, price: gemConfig.price || 5.00 };
  }
  const finalPrice = (payNowProduct.pricing?.price_final ?? payNowProduct.price) / 100;
  const originalPrice = payNowProduct.pricing?.price_original ? payNowProduct.pricing.price_original / 100 : undefined;

  return {
    ...gemConfig,
    price: finalPrice,
    originalPrice,
    currency: payNowProduct.currency,
    imageUrl: payNowProduct.image_url,
    payNowProductId: payNowProduct.id,
  };
}

/**
 * Merges local bundle configurations with data fetched from PayNow.
 */
function mergeBundleData(bundleConfig: any, payNowProduct: PayNowProduct | null): Bundle {
    const baseConfig = {
        ...bundleConfig,
        price: 0, // Default price
        currency: 'USD',
    };

    if (!payNowProduct) {
        return baseConfig;
    }

    const finalPrice = (payNowProduct.pricing?.price_final ?? payNowProduct.price) / 100;
    const originalPrice = payNowProduct.pricing?.price_original ? payNowProduct.pricing.price_original / 100 : undefined;

    return {
        ...baseConfig,
        id: payNowProduct.id,
        name: payNowProduct.name,
        displayName: payNowProduct.name,
        price: finalPrice,
        originalPrice,
        currency: payNowProduct.currency,
        imageUrl: payNowProduct.image_url,
        payNowProductId: payNowProduct.id,
        // Add other fields from PayNow product if needed
    };
}

function transformToProfileData(
  customer: PayNowCustomer,
  inventory: PayNowInventoryItem[],
  subscriptions: PayNowSubscription[],
  products: PayNowProduct[]
): { packages: ProfilePackage[]; transactions: ProfileTransaction[]; stats: ProfileStats } {
  const packages: ProfilePackage[] = [];
  const transactions: ProfileTransaction[] = [];

  console.log('Transforming profile data:', {
    inventoryCount: inventory.length,
    subscriptionsCount: subscriptions.length,
    productsCount: products.length
  });

  // Transform inventory items to packages
  inventory.forEach(item => {
    const product = products.find(p => p.id === item.product.id);
    
    // Convert price properly - PayNow prices might be in cents or dollars
    let itemPrice = 0;
    if (product?.price) {
      // If price is greater than 1000, assume it's in cents and convert to dollars
      itemPrice = product.price > 1000 ? product.price / 100 : product.price;
    }
    
    const pkg: ProfilePackage = {
      id: item.id,
      productId: item.product.id,
      name: item.product.name,
      type: item.gift ? 'gift' : 'one_time',
      status: item.state === 'active' ? 'active' : 'expired',
      purchaseDate: item.added_at,
      expiryDate: item.expires_at || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      price: itemPrice,
      giftedBy: item.gift ? 'Unknown' : undefined,
      features: product?.description ? [product.description] : [],
      tags: product?.tags.map(tag => tag.name) || [],
      paynowId: item.id,
      orderId: item.order_id
    };
    
    packages.push(pkg);

    // Add transaction for this item
    const transaction: ProfileTransaction = {
      id: `inv_${item.id}`,
      date: item.added_at,
      type: item.gift ? 'gift_received' : 'purchase',
      packageName: item.product.name,
      amount: itemPrice,
      status: 'completed',
      paynowId: item.id,
      orderId: item.order_id
    };
    
    transactions.push(transaction);
    
    console.log('Added inventory item:', {
      name: item.product.name,
      price: itemPrice,
      originalPrice: product?.price,
      state: item.state
    });
  });

  // Transform subscriptions to packages
  subscriptions.forEach(sub => {
    // PayNow subscription amounts are always in cents, convert to dollars
    const subPrice = sub.total_amount / 100;
    
    const pkg: ProfilePackage = {
      id: sub.id,
      productId: sub.product_id,
      name: sub.product_name,
      type: 'subscription',
      status: sub.status === 'active' ? 'active' : 'expired',
      purchaseDate: sub.created_at,
      expiryDate: sub.current_period_end || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      price: subPrice,
      giftedBy: sub.gift ? 'Unknown' : undefined,
      features: [sub.product_name],
      tags: [],
      paynowId: sub.id,
      prettyId: sub.pretty_id
    };
    
    packages.push(pkg);

    // Add transaction for this subscription
    const transaction: ProfileTransaction = {
      id: `sub_${sub.id}`,
      date: sub.created_at,
      type: sub.gift ? 'gift_received' : 'purchase',
      packageName: sub.product_name,
      amount: subPrice,
      status: 'completed',
      paynowId: sub.id
    };
    
    transactions.push(transaction);
    
    console.log('Added subscription:', {
      name: sub.product_name,
      price: subPrice,
      originalAmount: sub.total_amount,
      status: sub.status
    });
  });

  console.log('Profile data transformation complete:', {
    packagesCount: packages.length,
    transactionsCount: transactions.length,
    totalSpent: transactions.reduce((sum, t) => sum + t.amount, 0)
  });

  const stats: ProfileStats = {
    totalSpent: transactions.reduce((sum, t) => sum + t.amount, 0),
    activeProducts: packages.filter(p => p.status === 'active').length,
    gemBalance: 0, // This would come from gem balance API
    gemsEarned: 0, // This would come from gem purchases API
    referralsCount: 0, // This would come from referral tracking
    memberSince: customer.created_at
  };

  return { packages, transactions, stats };
}

function transformToStoreData(products: PayNowProduct[]): { ranks: Rank[], gemPackages: GemPackage[], bundles: Bundle[] } {
  const productMap = new Map(products.map(p => [p.id, p]));
  const rankConfigs = getAllRankConfigs();

  const ranks = rankConfigs.map(config => {
    const productId = getRankProductId(config.position);
    const product = productId ? productMap.get(productId) || null : null;
    return mergeRankData(config, product);
  });

  const gemPacks = gemConfigurations.map(config => {
    const productId = config.payNowProductId;
    const product = productId ? productMap.get(productId) || null : null;
    return mergeGemData(config, product);
  });

  // Process bundles
  const bundleConfigs = getAllBundleConfigs();
  const bundles = bundleConfigs.map(config => {
      const product = config.payNowId ? (productMap.get(config.payNowId) ?? null) : null;
      return mergeBundleData(config, product);
  });

  return { ranks, gemPackages: gemPacks, bundles };
}

// Helper function to check if data is fresh and valid
function isDataFresh(lastFetchTime: number, cacheTime: number = CACHE_DURATION): boolean {
  return Date.now() - lastFetchTime < cacheTime;
}

// Helper function to check if store data is complete and fresh
function hasValidStoreData(): boolean {
  return globalPayNowState.ranks.length > 0 && 
         globalPayNowState.gemPackages.length > 0 && 
         globalPayNowState.bundles.length > 0 &&
         isDataFresh(globalPayNowState.lastFetchTime) &&
         !globalPayNowState.error;
}

// Add request deduplication for fetchStoreDataOnly
let storeDataFetchPromise: Promise<void> | null = null;

async function fetchStoreDataOnly(): Promise<void> {
  // If there's already a request in progress, return the existing promise
  if (storeDataFetchPromise) {
    console.log('⏳ Store data fetch already in progress, reusing existing promise');
    return storeDataFetchPromise;
  }

  // Check if we have fresh data and don't need to fetch
  if (hasValidStoreData()) {
    console.log('✅ Store data is fresh, skipping API call');
    return;
  }

  storeDataFetchPromise = (async () => {
    try {
      console.log('🚀 Starting store data fetch...');
      globalPayNowState.isLoadingProducts = true;
      globalPayNowState.error = null;
      notifySubscribers();

      // Fetch store products (no authentication required)
      const products = await getStoreProducts(API_CONFIG.paynow.storeId!);
      
      // Transform data for store page
      const storeData = transformToStoreData(products);
      globalPayNowState.ranks = storeData.ranks;
      globalPayNowState.gemPackages = storeData.gemPackages;
      globalPayNowState.bundles = storeData.bundles;
      
      globalPayNowState.lastFetchTime = Date.now();
      globalPayNowState.isLoading = false;
    } catch (error) {
      globalPayNowState.error = error instanceof Error ? error.message : 'Failed to fetch store data';
      console.error('Error fetching store data:', error);
    } finally {
      globalPayNowState.isLoadingProducts = false;
      notifySubscribers();
      storeDataFetchPromise = null; // Clear the promise when done
    }
  })();

  return storeDataFetchPromise;
}

// Add request deduplication for fetchPayNowData
let payNowDataFetchPromise: Promise<void> | null = null;

async function fetchPayNowData(storeToken: string, user: any): Promise<void> {
  // If there's already a request in progress, return the existing promise
  if (payNowDataFetchPromise) {
    console.log('⏳ PayNow data fetch already in progress, reusing existing promise');
    return payNowDataFetchPromise;
  }

  // Check if we have fresh data and don't need to fetch
  if (globalPayNowState.storeToken === storeToken && 
      isDataFresh(globalPayNowState.lastFetchTime) &&
      !globalPayNowState.error) {
    console.log('✅ PayNow data is fresh, skipping API call');
    return;
  }

  payNowDataFetchPromise = (async () => {
    try {
      console.log('🚀 Starting PayNow data fetch for token:', storeToken ? 'present' : 'none');
      globalPayNowState.isLoading = true;
      globalPayNowState.error = null;
      globalPayNowState.storeToken = storeToken;
      notifySubscribers();

    let customerToken = storeToken;
    let customer: PayNowCustomer;

    if (storeToken) {
      // We have a store token - use it directly
      console.log('Using store_token directly for PayNow operations');
      
      globalPayNowState.isLoadingCustomer = true;
      notifySubscribers();
      
      try {
        customer = await paynowApi.customer.get('/store/customer', storeToken);
        console.log('Retrieved customer info using store_token:', customer.id);
      } catch (error) {
        console.error('Failed to get customer with store_token:', error);
        throw new Error('Store token is invalid or expired. Please re-authenticate.');
      } finally {
        globalPayNowState.isLoadingCustomer = false;
        notifySubscribers();
      }
    } else {
      // No store token - use legacy Steam ID flow
      console.log('No store_token available, using Steam ID fallback');
      
    globalPayNowState.isLoadingCustomer = true;
    notifySubscribers();
    
      const customerResult = await createOrGetCustomer('', user);
      customer = customerResult.customer;
      customerToken = customerResult.token;
      
    globalPayNowState.isLoadingCustomer = false;
      notifySubscribers();
    }

    globalPayNowState.customer = customer;
    notifySubscribers();

    // Step 2: Fetch customer data and store products in parallel
    const [inventory, subscriptions, products] = await Promise.all([
      (async () => {
        globalPayNowState.isLoadingInventory = true;
        notifySubscribers();
        try {
          return await getCustomerInventory(customerToken);
        } finally {
          globalPayNowState.isLoadingInventory = false;
          notifySubscribers();
        }
      })(),
      (async () => {
        globalPayNowState.isLoadingSubscriptions = true;
        notifySubscribers();
        try {
          return await getCustomerSubscriptions(customerToken);
        } finally {
          globalPayNowState.isLoadingSubscriptions = false;
          notifySubscribers();
        }
      })(),
      (async () => {
        globalPayNowState.isLoadingProducts = true;
        notifySubscribers();
        try {
          return await getStoreProducts(API_CONFIG.paynow.storeId!);
        } finally {
          globalPayNowState.isLoadingProducts = false;
          notifySubscribers();
        }
      })()
    ]);

    // Step 3: Transform data for profile page
    const profileData = transformToProfileData(customer, inventory, subscriptions, products);
    globalPayNowState.packages = profileData.packages;
    globalPayNowState.transactions = profileData.transactions;
    globalPayNowState.stats = profileData.stats;

    // Step 4: Transform data for store page
    const storeData = transformToStoreData(products);
    globalPayNowState.ranks = storeData.ranks;
    globalPayNowState.gemPackages = storeData.gemPackages;
    globalPayNowState.bundles = storeData.bundles;
    
    globalPayNowState.lastFetchTime = Date.now();

    } catch (error) {
      globalPayNowState.error = error instanceof Error ? error.message : 'Failed to fetch PayNow data';
      console.error('Error fetching PayNow data:', error);
    } finally {
      globalPayNowState.isLoading = false;
      globalPayNowState.isLoadingCustomer = false;
      globalPayNowState.isLoadingInventory = false;
      globalPayNowState.isLoadingSubscriptions = false;
      globalPayNowState.isLoadingProducts = false;
      notifySubscribers();
      payNowDataFetchPromise = null; // Clear the promise when done
    }
  })();

  return payNowDataFetchPromise;
}

export function usePayNowProducts(): UsePayNowProductsResult {
  const { user } = useAuth();
  const [state, setState] = useState<GlobalPayNowState>({ ...globalPayNowState });
  const stateRef = useRef(state);
  stateRef.current = state;

  // Subscribe to global state changes
  useEffect(() => {
    const callback = (newState: GlobalPayNowState) => {
      setState({ ...newState });
    };

    globalPayNowState.subscribers.add(callback);
    return () => {
      globalPayNowState.subscribers.delete(callback);
    };
  }, []);

  // Consolidated data fetching effect
  useEffect(() => {
    const fetchData = async () => {
      if (user?.store_token) {
        // User has store token - fetch all data using the token directly
        console.log('User has store_token, fetching PayNow data directly');
        await fetchPayNowData(user.store_token, user);
      } else if (user?.steam_id) {
        // User authenticated but no store token - use Steam ID fallback
        console.warn('User authenticated but no store_token available, using Steam ID fallback');
        await fetchPayNowData('', user);
      } else {
        // User is not authenticated - only fetch public store data if needed
        if (!hasValidStoreData()) {
          await fetchStoreDataOnly();
        }
        // Clear user-specific data regardless
        globalPayNowState.storeToken = null;
        globalPayNowState.customer = null;
        globalPayNowState.packages = [];
        globalPayNowState.transactions = [];
        globalPayNowState.stats = null;
        notifySubscribers();
      }
    };

    fetchData();
  }, [user?.store_token, user?.steam_id]);

  const refresh = useCallback(async () => {
    if (user?.store_token) {
      globalPayNowState.lastFetchTime = 0; // Force refresh
      await fetchPayNowData(user.store_token, user);
    } else if (user?.steam_id) {
      globalPayNowState.lastFetchTime = 0; // Force refresh
      await fetchPayNowData('', user);
    }
  }, [user?.store_token, user?.steam_id]);

  const cancelSubscription = useCallback(async (subscriptionId: string) => {
    if (!user?.store_token) {
      throw new Error('Store token required for subscription cancellation');
    }
    
    try {
      console.log(`Cancelling subscription ${subscriptionId} using store_token`);
      
      await paynowApi.customer.delete(`/store/customer/subscriptions/${subscriptionId}`, user.store_token);

      console.log(`Successfully cancelled subscription ${subscriptionId}`);
      
      // Refresh data to reflect the cancellation
      await refresh();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to cancel subscription');
    }
  }, [refresh, user?.store_token]);

  return {
    customer: state.customer,
    packages: state.packages,
    transactions: state.transactions,
    stats: state.stats,
    isLoading: state.isLoading,
    isLoadingCustomer: state.isLoadingCustomer,
    isLoadingInventory: state.isLoadingInventory,
    isLoadingSubscriptions: state.isLoadingSubscriptions,
    isLoadingProducts: state.isLoadingProducts,
    error: state.error,
    refresh,
    cancelSubscription,
    ranks: state.ranks,
    gemPackages: state.gemPackages,
    bundles: state.bundles,
  };
} 