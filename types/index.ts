export interface InventoryItem {
    position: number;
    shortname: string;
    quantity: number;
  }
  
  export interface TagInventory {
    tag: string;
    weapons: InventoryItem[];
    resources: InventoryItem[];
  }
  
  export interface TagConfig {
    name: string;
    boxColor: string;
    textColor: string;
  }
  
  export interface TagConfiguration {
    tag: string;
    teleportTimer: number;
    homeAmount: number;
    loadoutCoolDown: number;
    loadoutTimer: number;
    teleportLimit: number;
    rpBoost: number;
    rpMultiplier: number;
    extraGems: number;
    queueSkip: boolean;
    hqmUpgrade: boolean;
    craftUncraftable: boolean;
    customColor: boolean;
    kits: boolean;
  }

  export interface Rank {
    id: string | number;
    position: number; // 1-5
    containerColor: string;
    valueColor: string;
    description: string;
    threePoints: string;
    nameColor: string;
    tags: string[];
    configurations: TagConfiguration[];
    inventories: TagInventory[]; // Each tag has its own inventory
    // PayNow integration fields
    price: number;
    name?: string;
    displayName?: string;
    benefits?: string[];
    originalPrice?: number;
    saleValue?: number;
    saleEndDate?: Date;
    currency?: string;
    imageUrl?: string; // PayNow product image
    // Discount information from PayNow API
    discountType?: string; // "percent" or "fixed"
    discountAmount?: number; // The discount amount (e.g., 2000 for 20% or fixed amount)
  }
  
  export interface GemPackage {
    id: string | number;
    amount: number;
    secondaryTime: number;
    tags: string[];
    name: string;
    bonus: number;
    valueType?: 'best' | 'max' | 'popular'; // Value indicator
    // PayNow integration fields
    price: number;
    originalPrice?: number;
    saleValue?: number;
    saleEndDate?: Date;
    currency?: string;
    imageUrl?: string; // PayNow product image
    payNowProductId?: string; // PayNow product ID for checkout mapping
  }
  
  export interface Bundle {
    id: string;
    payNowId: string;
    name: string;
    displayName: string;
    position: number; // Should be 0
    include: string[]; // All the rank IDs
    discount: number; // Discount amount
    freeGems: number;
    // PayNow integration fields
    price: number;
    originalPrice?: number;
    saleValue?: number;
    saleEndDate?: Date;
    currency?: string;
    imageUrl?: string; // PayNow product image
    payNowProductId?: string; // PayNow product ID for checkout mapping
    // Subscription information
    isSubscription?: boolean; // Whether this is a subscription product
    allowOneTimePurchase?: boolean; // Whether one-time purchases are allowed
    allowSubscription?: boolean; // Whether subscriptions are allowed
    // Discount information from PayNow API
    discountType?: string; // "percent" or "fixed"
    discountAmount?: number; // The discount amount (e.g., 2000 for 20% or fixed amount)
  }
  
  export interface AccessoryPackage {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'customization' | 'cosmetic' | 'utility';
    features: string[];
    payNowProductId: string;
    // PayNow integration fields
    price: number;
    originalPrice?: number;
    saleValue?: number;
    saleEndDate?: Date;
    currency?: string;
    imageUrl?: string; // PayNow product image
  }
  
  export interface CartItem {
    id: string;
    type: 'rank' | 'gems' | 'queue_skip' | 'bundle' | 'accessory';
    quantity: number;
    price: number;
    name: string;
    payNowProductId?: string; // PayNow product ID for checkout mapping
    isGift?: boolean;
    giftTo?: {
      platform: string;
      id: string;
      displayName?: string;
      customerId?: string; // PayNow customer ID for gift recipients
    };
    subscription?: boolean; // Indicates if the item is a subscription (always false for gift items)
  }