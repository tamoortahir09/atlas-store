// PayNow Product ID Configuration
// These IDs map to actual PayNow products in the store

export const PAYNOW_PRODUCT_IDS = {
  ranks: {
    1: "276430864861114368",  // VIP (position 1)
    2: "276430881923543040",  // Prime (position 2)
    3: "276430881357312000",  // Mythic (position 3)
    4: "276430880849805312",  // Vanguard (position 4)
    5: "276430880359071744",  // Champion (position 5)
  } as Record<number, string>,
  gems: {
    starter: "434411450803429376",    // 80 Gems
    basic: "434411628079886336",      // 1,000 Gems
    premium: "434411765393006592",    // 2,200 Gems
    deluxe: "434411898855768064",     // 4,500 Gems
    ultimate: "434412001259687936",   // 16,500 Gems
  },
  bundles: {
    ultimate: "276430877586628608",   // Ultimate Bundle
  },
  accessories: {
    queueSkip: "276430864861114368",  // Queue Skip
    customName: "435510552412831744", // Custom Name
  }
};

// Helper functions to get product IDs
export const getRankProductId = (position: number): string | undefined => {
  return PAYNOW_PRODUCT_IDS.ranks[position];
};

export const getGemProductId = (type: keyof typeof PAYNOW_PRODUCT_IDS.gems): string | undefined => {
  return PAYNOW_PRODUCT_IDS.gems[type];
};

export const getBundleProductId = (type: keyof typeof PAYNOW_PRODUCT_IDS.bundles): string | undefined => {
  return PAYNOW_PRODUCT_IDS.bundles[type];
};

export const getAccessoryProductId = (type: keyof typeof PAYNOW_PRODUCT_IDS.accessories): string | undefined => {
  return PAYNOW_PRODUCT_IDS.accessories[type];
};

export const getAllRankProductIds = (): string[] => {
  return Object.values(PAYNOW_PRODUCT_IDS.ranks);
};

// Get all product IDs as a flat array
export const getAllProductIds = (): string[] => {
  const allIds: string[] = [];
  
  // Add rank IDs
  Object.values(PAYNOW_PRODUCT_IDS.ranks).forEach(id => allIds.push(id));
  
  // Add gem IDs
  Object.values(PAYNOW_PRODUCT_IDS.gems).forEach(id => allIds.push(id));
  
  // Add bundle IDs
  Object.values(PAYNOW_PRODUCT_IDS.bundles).forEach(id => allIds.push(id));
  
  // Add accessory IDs
  Object.values(PAYNOW_PRODUCT_IDS.accessories).forEach(id => allIds.push(id));
  
  // Remove duplicates
  return Array.from(new Set(allIds));
}; 