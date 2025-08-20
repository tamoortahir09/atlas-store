import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { paynowApi } from '@/lib/api/paynow';
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

export interface UseProfileDataResult {
  // Data
  customer: PayNowCustomer | null;
  packages: ProfilePackage[];
  transactions: ProfileTransaction[];
  stats: ProfileStats | null;
  
  // Loading states
  isLoading: boolean;
  isLoadingCustomer: boolean;
  isLoadingInventory: boolean;
  isLoadingSubscriptions: boolean;
  isLoadingProducts: boolean;
  
  // Error states
  error: string | null;
  
  // Actions
  refetch: () => Promise<void>;
  cancelSubscription: (subscriptionId: string) => Promise<void>;
}

// Global state to prevent multiple instances from making duplicate API calls
interface GlobalPayNowState {
  storeToken: string | null;
  customer: PayNowCustomer | null;
  packages: ProfilePackage[];
  transactions: ProfileTransaction[];
  stats: ProfileStats | null;
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
  error: null,
  isLoading: false,
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



function transformToProfileData(
  customer: PayNowCustomer,
  inventory: PayNowInventoryItem[],
  subscriptions: PayNowSubscription[]
): { packages: ProfilePackage[]; transactions: ProfileTransaction[]; stats: ProfileStats } {
  const packages: ProfilePackage[] = [];
  const transactions: ProfileTransaction[] = [];

  console.log('Transforming profile data:', {
    inventoryCount: inventory.length,
    subscriptionsCount: subscriptions.length
  });

  // Transform inventory items to packages
  inventory.forEach(item => {
    // For inventory items, we don't have product pricing from the store
    // Just use default price of 0 since this is for display purposes only
    const itemPrice = 0;
    
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
      features: [],
      tags: [],
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

async function fetchPayNowData(storeToken: string, user: any): Promise<void> {
  if (globalPayNowState.storeToken === storeToken && 
      Date.now() - globalPayNowState.lastFetchTime < CACHE_DURATION &&
      !globalPayNowState.error) {
    return;
  }

  try {
    globalPayNowState.isLoading = true;
    globalPayNowState.error = null;
    globalPayNowState.storeToken = storeToken;
    notifySubscribers();

    let customerToken = storeToken;
    let customer: PayNowCustomer;

    if (storeToken) {
      // We have a store token - use it directly
      console.log('Using store_token directly for profile data operations');
      
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

    // Step 2: Fetch customer data in parallel
    const [inventory, subscriptions] = await Promise.all([
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
      })()
    ]);

    // Step 3: Transform data
    const profileData = transformToProfileData(customer, inventory, subscriptions);
    globalPayNowState.packages = profileData.packages;
    globalPayNowState.transactions = profileData.transactions;
    globalPayNowState.stats = profileData.stats;
    globalPayNowState.lastFetchTime = Date.now();

  } catch (error) {
    globalPayNowState.error = error instanceof Error ? error.message : 'Failed to fetch PayNow data';
    console.error('Error fetching PayNow data:', error);
  } finally {
    globalPayNowState.isLoading = false;
    globalPayNowState.isLoadingCustomer = false;
    globalPayNowState.isLoadingInventory = false;
    globalPayNowState.isLoadingSubscriptions = false;

    notifySubscribers();
  }
}

export function useProfileData(): UseProfileDataResult {
  const { user } = useAuth();
  const [state, setState] = useState<GlobalPayNowState>({ ...globalPayNowState });
  
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

  // Load data when user changes or on mount
  useEffect(() => {
    if (user?.store_token) {
      // User has store token - fetch data using it directly
      console.log('User has store_token, fetching profile data directly');
      fetchPayNowData(user.store_token, user);
    } else if (user?.steam_id) {
      // User authenticated but no store token - use Steam ID fallback
      console.warn('User authenticated but no store_token available, using Steam ID fallback');
      fetchPayNowData('', user);
    } else {
      // Clear data if user logs out
      globalPayNowState.storeToken = null;
      globalPayNowState.customer = null;
      globalPayNowState.packages = [];
      globalPayNowState.transactions = [];
      globalPayNowState.stats = null;
      globalPayNowState.error = null;
      notifySubscribers();
    }
  }, [user?.store_token, user?.steam_id]);

  const refetch = useCallback(async () => {
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
      await paynowApi.customer.post(`/store/customer/subscriptions/${subscriptionId}/cancel`, user.store_token, {
        storeId: API_CONFIG.paynow.storeId,
      });

      // Refresh profile data after cancellation
      await refetch();
      
      console.log('Subscription cancelled and profile refreshed', {
        subscriptionId
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel subscription';
      console.error('Error cancelling subscription', err);
      throw new Error(errorMessage);
    }
  }, [user?.store_token, refetch]);

  return {
    // Data
    customer: state.customer,
    packages: state.packages,
    transactions: state.transactions,
    stats: state.stats,
    
    // Loading states
    isLoading: state.isLoading,
    isLoadingCustomer: state.isLoadingCustomer,
    isLoadingInventory: state.isLoadingInventory,
    isLoadingSubscriptions: state.isLoadingSubscriptions,
    isLoadingProducts: state.isLoadingProducts,
    
    // Error state
    error: state.error,
    
    // Actions
    refetch,
    cancelSubscription
  };
} 