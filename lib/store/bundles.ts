import type { Bundle } from './types';
import { getBundleProductId, PAYNOW_PRODUCT_IDS } from './productIds';

const bundleConfigs: Omit<Bundle, 'price' | 'originalPrice' | 'saleEndDate' | 'saleValue' | 'currency' | 'imageUrl' | 'payNowProductId' | 'isSubscription' | 'allowOneTimePurchase' | 'allowSubscription' | 'discountType' | 'discountAmount'>[] = [
  {
    id: "ultimate-bundle",
    payNowId: getBundleProductId("ultimate") || "276430877586628608",
    name: "Bundle: All Ranks",
    displayName: "Bundle: All Ranks",
    position: 0,
    include: Object.values(PAYNOW_PRODUCT_IDS.ranks).slice(1), // Exclude the first rank (VIP)
    discount: 35, // 25% discount
    freeGems: 250
  }
];

export const bundleConfigurations = bundleConfigs;

export function getBundleConfig(id: string) {
  return bundleConfigurations.find(bundle => bundle.id === id);
}

export function getAllBundleConfigs() {
  return bundleConfigurations;
} 