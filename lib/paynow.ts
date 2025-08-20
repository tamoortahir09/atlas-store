// PayNow.gg API integration for Atlas-2.0 (Next.js)
import type { CartItem } from '@/lib/store/types';
import { checkPayNowEnvironment, logPayNowConfig } from './env-check';
import { paynowApi } from '@/lib/api/paynow';
import { API_CONFIG } from '@/lib/config';
import { getReferralData } from './referral';

// PayNow API configuration

// PayNow Product interface based on API documentation
export interface PayNowProduct {
  id: string;
  store_id: string;
  version_id: string;
  image_url?: string;
  slug: string;
  name: string;
  description: string;
  enabled_at?: string;
  enabled_until?: string;
  label?: string;
  sort_order: number;
  price: number;
  currency: string;
  single_game_server_only: boolean;
  allow_one_time_purchase: boolean;
  allow_subscription: boolean;
  pricing?: {
    price_original: number;
    price_final: number;
    sale_value?: number;
    ends_at?: string;  // Sale end date
  };
  stock?: {
    available_to_purchase: boolean;
    customer_available: number;
  };
  tags?: Array<{
    id: string;
    slug: string;
    name: string;
  }>;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Checkout line item interface
interface CheckoutLineItem {
  product_id: string;
  quantity: number;
  subscription?: boolean; // New field for PayNow line items
  selected_gameserver_id?: string;
  gift_to?: {
    platform: string;
    id: string;
  };
  gift_to_customer_id?: string;
  metadata?: Record<string, any>;
}

interface CreateCheckoutOptions {
  lines: CheckoutLineItem[];
  return_url?: string;
  cancel_url?: string;
  coupon_id?: string;
  affiliate_code?: string;
  auto_redirect?: boolean;
  subscription?: boolean;
  metadata?: Record<string, any>;
}

// Cache for PayNow data to avoid repeated API calls
let productsCache: PayNowProduct[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch specific products from PayNow store using individual product IDs
 */
export async function fetchPayNowProducts(currency?: string): Promise<PayNowProduct[]> {
  // Check cache first
  const now = Date.now();
  if (productsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return productsCache;
  }

  try {
    // Import product IDs (dynamic import to avoid circular dependencies)
    const { getAllProductIds } = await import('@/lib/store/productIds');
    const productIds = getAllProductIds();
    
    console.log(`Fetching ${productIds.length} specific PayNow products`, { productIds });

    const storeId = API_CONFIG.paynow.storeId;
    if (!storeId) {
      throw new Error('PayNow store ID not configured');
    }

    // Fetch each product individually using PayNow API
    const productPromises = productIds.map(async (productId) => {
      try {
        const product = await paynowApi.public.get(`/store/products/${productId}`);
        
        console.log(`✅ Successfully fetched PayNow product ${productId}:`, {
          id: product.id,
          name: product.name,
          enabled: product.enabled_at && (!product.enabled_until || new Date(product.enabled_until) > new Date()),
          price: product.price
        });
        return product;
      } catch (error: any) {
        console.error(`❌ Failed to fetch PayNow product ${productId}:`, {
          status: error.status,
          message: error.message,
          productId
        });
        return null; // Return null for failed requests instead of throwing
      }
    });

    // Wait for all product fetches to complete
    const productResults = await Promise.allSettled(productPromises);
    
    // Filter out failed requests and null results
    const products: PayNowProduct[] = productResults
      .filter((result): result is PromiseFulfilledResult<PayNowProduct> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);
    
    // Update cache
    productsCache = products;
    cacheTimestamp = now;
    
    console.log(`Successfully fetched ${products.length} out of ${productIds.length} products from PayNow store`);
    
    return products;
  } catch (error) {
    console.error('Error fetching PayNow products', error);
    throw error;
  }
}

/**
 * Converts our internal CartItem format to PayNow's CheckoutLineItem format.
 */
export async function cartItemsToCheckoutLines(cartItems: CartItem[], currency?: string): Promise<CheckoutLineItem[]> {
  console.log('🛒 Converting cart items to checkout lines:', {
    totalItems: cartItems.length,
    currency,
    items: cartItems.map(item => ({
      id: item.id,
      type: item.type,
      name: item.name,
      price: item.price,
      payNowProductId: item.payNowProductId,
      hasProductId: !!item.payNowProductId,
      subscription: true
    }))
  });

  const allPayNowProducts = await fetchPayNowProducts(currency);
  console.log(`📦 Fetched ${allPayNowProducts.length} PayNow products for validation`);

  const lines: CheckoutLineItem[] = [];
  const skippedItems: string[] = [];
  
  for (const cartItem of cartItems) {
    console.log(`Processing cart item: ${cartItem.name}`, {
      payNowProductId: cartItem.payNowProductId,
      hasProductId: !!cartItem.payNowProductId
    });

    if (!cartItem.payNowProductId) {
      console.error(`❌ Cart item missing PayNow product ID: "${cartItem.name}"`, cartItem);
      skippedItems.push(cartItem.name);
      continue;
    }

    const payNowProduct = allPayNowProducts.find(p => p.id === cartItem.payNowProductId);

    if (payNowProduct) {
      console.log(`✅ Found PayNow product for ${cartItem.name}:`, {
        productId: payNowProduct.id,
        productName: payNowProduct.name,
        price: payNowProduct.price,
        allowOneTime: payNowProduct.allow_one_time_purchase,
        allowSubscription: payNowProduct.allow_subscription
      });

      // Check for subscription type based on PayNow product data
      const isSubscription = payNowProduct.allow_subscription && !payNowProduct.allow_one_time_purchase;

      // Use the new PayNow line items structure with subscription field
      // Gift items should always be one-time purchases, not subscriptions
      const finalSubscriptionValue = cartItem.isGift ? false : (cartItem.subscription || false);
      
      if (cartItem.isGift && cartItem.subscription) {
        console.log(`🎁 Converting subscription item to one-time purchase for gift: ${cartItem.name}`);
      }
      
      const lineItem: CheckoutLineItem = {
        product_id: payNowProduct.id,
        quantity: cartItem.quantity,
        subscription: finalSubscriptionValue, // Set subscription field directly on line item
        metadata: {
          isGift: cartItem.isGift?.toString() || 'false',
          cartItemId: cartItem.id, // Include our internal cart ID for tracking
        },
      };

      if (cartItem.isGift && cartItem.giftTo) {
        lineItem.gift_to = {
          platform: cartItem.giftTo.platform,
          id: cartItem.giftTo.id,
        };
        
        // Add gift_to_customer_id if available
        if (cartItem.giftTo.customerId) {
          lineItem.gift_to_customer_id = cartItem.giftTo.customerId;
        }
      }
      
      lines.push(lineItem);
      console.log(`✅ Added line item for ${cartItem.name}`);
    } else {
      console.error(`❌ Could not find PayNow product with ID "${cartItem.payNowProductId}" for item "${cartItem.name}"`);
      skippedItems.push(cartItem.name);
    }
  }
  
  console.log('🛒 Checkout lines conversion complete:', {
    originalItems: cartItems.length,
    createdLines: lines.length,
    skippedItems: skippedItems.length,
    skippedItemNames: skippedItems
  });

  if (lines.length === 0) {
    throw new Error(`No valid items for checkout. ${skippedItems.length > 0 ? `Skipped items: ${skippedItems.join(', ')}` : 'All items were invalid.'}`);
  }
  
  return lines;
}

/**
 * Get or create a PayNow customer
 */
async function getOrCreateCustomer(user: any): Promise<{ customer: any; token: string }> {
  const storeId = API_CONFIG.paynow.storeId;
  if (!storeId) {
    throw new Error('PayNow store ID not configured');
  }

  // If user has a store_token, use it directly
  if (user.store_token) {
    try {
      const customer = await paynowApi.customer.get('/store/customer', user.store_token);
      console.log('Using existing store_token for checkout customer:', customer.id);
      return {
        customer,
        token: user.store_token
      };
    } catch (error) {
      console.error('Error using store_token for checkout:', error);
      throw new Error('Store token is invalid or expired. Please re-authenticate.');
    }
  }

  // Fallback to Steam ID creation/lookup for users without store_token
  console.log('No store_token available, using Steam ID for customer creation');
  
  const steamId = user.steam_id;
  if (!steamId) {
    throw new Error('No valid store token and no Steam ID available for customer lookup');
  }

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
      name: user.name || 'Unknown Player',
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

/**
 * Create a checkout on PayNow via Next.js API routes
 */
export async function createCheckout(
  cartItems: CartItem[], 
  user?: any,
  currency?: string,
  options: { itemIdForCallback?: string } = {}
): Promise<string> {
  if (!cartItems || cartItems.length === 0) {
    throw new Error('No items provided for checkout');
  }

  try {
    // Check PayNow configuration first
    const envCheck = logPayNowConfig();
    if (!envCheck.isValid) {
      throw new Error(`PayNow configuration error: ${envCheck.issues.join(', ')}`);
    }

    // Set checkout timestamp for payment page access validation
    localStorage.setItem('lastCheckoutTime', Date.now().toString());
    console.log('Checkout timestamp set for payment page access validation');
    
    // Validate user authentication
    if (!user) {
      throw new Error('Authentication required. Please sign in to continue.');
    }

    // Check for store_token or Steam ID
    const hasStoreToken = !!user.store_token;
    const steamId = user.steam_id || user.steamId || user.id;
    const userName = user.name || user.personaname || user.displayName || 'Unknown User';

    if (!hasStoreToken && !steamId) {
      console.error('User object missing both store_token and Steam ID:', user);
      throw new Error('Authentication required. Please sign in with Steam to continue.');
    }

    console.log(`Creating checkout for authenticated user`, {
      hasStoreToken,
      steamId: steamId,
      userName: userName,
      checkoutMethod: hasStoreToken ? 'store_token' : 'steam_id'
    });

    // Get customer token - prioritize store_token for direct usage
    const { token: customerToken } = await getOrCreateCustomer(user);

    // Convert cart items to checkout line items
    const lines = await cartItemsToCheckoutLines(cartItems, currency);

    // With PayNow line items, subscription is handled per line item
    const hasGiftItems = cartItems.some(cartItem => cartItem.isGift === true);
    const hasSubscriptionItems = cartItems.some(cartItem => cartItem.subscription === true);

    // Get referral data for checkout
    const referralData = getReferralData();
    
    const checkoutMetadata = {
      source: 'atlas_store',
      user_steam_id: steamId,
      user_name: userName,
      cart_summary: cartItems.map(item => `${item.quantity}x ${item.name}`).join(', '),
      has_gifts: hasGiftItems.toString(),
      has_subscriptions: hasSubscriptionItems.toString(),
      ...(referralData && {
        referral_active: 'true',
        referrer_steam_id: referralData.referrerSteamId,
        referral_timestamp: referralData.timestamp.toString()
      }),
      ...(options.itemIdForCallback && { item_id_for_callback: options.itemIdForCallback })
    };

    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_BASE_URL || 'https://atlasrust.com';

    const successUrl = `${baseUrl}/store/payment-success`;
    const cancelUrl = `${baseUrl}/store/payment-cancel`;

    // Create checkout with line-level subscription handling
    const checkoutData: CreateCheckoutOptions = {
      lines,
      metadata: checkoutMetadata,
      return_url: successUrl,
      cancel_url: cancelUrl,
      auto_redirect: false, // Let us handle the redirect
      //subscription: hasSubscriptionItems, // Use simplified subscription detection
    };

    console.log(`Checkout with line-level subscription support`, {
      hasGiftItems,
      hasSubscriptionItems,
      lineCount: lines.length,
      subscriptionLines: lines.filter(line => line.subscription).length,
      authMethod: hasStoreToken ? 'store_token' : 'steam_id'
    });

    // console.log(`Creating PayNow checkout for authenticated user`, {
    //   ...checkoutData,
    //   lines: checkoutData.lines.map(l => ({ product_id: l.product_id, quantity: l.quantity })),
    //   metadataKeys: Object.keys(checkoutMetadata),
    // });
    //console.debug('Creating PayNow checkout for authenticated user');
//console.debug('product lines:', checkoutData.lines.map(l => ({ product_id: l.product_id, quantity: l.quantity })));
//console.debug('metadata keys:', Object.keys(checkoutMetadata));
    const responseData = await paynowApi.customer.post('/checkouts', customerToken, {
      ...checkoutData,
      customer_token: customerToken
    });
    
    return responseData.url;
  } catch (error) {
    console.error('Error creating PayNow checkout', error);
    throw error;
  }
}

/**
 * Get all available products from PayNow for the store
 */
export async function getAvailableProducts(currency?: string): Promise<PayNowProduct[]> {
  return await fetchPayNowProducts(currency);
}

/**
 * Clear all local caches for PayNow data
 */
export function clearCache(): void {
  productsCache = null;
  cacheTimestamp = 0;
  console.log('PayNow data cache cleared.');
} 