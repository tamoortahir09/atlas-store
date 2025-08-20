// Referral system utilities
// Handles referral link tracking and storage

const REFERRAL_STORAGE_KEY = 'atlas_referral_data';
const REFERRAL_EXPIRY_DAYS = 30;

export interface ReferralData {
  referrerSteamId: string;
  timestamp: number;
  expiresAt: number;
}

/**
 * Set referral data when a user visits with a referral link
 */
export function setReferral(referrerSteamId: string): void {
  if (!referrerSteamId || typeof window === 'undefined') return;
  
  const now = Date.now();
  const expiresAt = now + (REFERRAL_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  
  const referralData: ReferralData = {
    referrerSteamId,
    timestamp: now,
    expiresAt
  };
  
  try {
    localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(referralData));
    console.log('Referral data stored:', { referrerSteamId, expiresAt: new Date(expiresAt) });
  } catch (error) {
    console.error('Failed to store referral data:', error);
  }
}

/**
 * Get current referral data (if still valid)
 */
export function getReferralData(): ReferralData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(REFERRAL_STORAGE_KEY);
    if (!stored) return null;
    
    const referralData: ReferralData = JSON.parse(stored);
    const now = Date.now();
    
    // Check if referral has expired
    if (now > referralData.expiresAt) {
      localStorage.removeItem(REFERRAL_STORAGE_KEY);
      return null;
    }
    
    return referralData;
  } catch (error) {
    console.error('Failed to get referral data:', error);
    localStorage.removeItem(REFERRAL_STORAGE_KEY);
    return null;
  }
}

/**
 * Check if user has an active referral
 */
export function hasActiveReferral(): boolean {
  return getReferralData() !== null;
}

/**
 * Get the referrer's Steam64 ID
 */
export function getReferrerSteam64(): string | null {
  const referralData = getReferralData();
  return referralData?.referrerSteamId || null;
}

/**
 * Clear referral data
 */
export function clearReferral(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(REFERRAL_STORAGE_KEY);
    console.log('Referral data cleared');
  } catch (error) {
    console.error('Failed to clear referral data:', error);
  }
}

/**
 * Get referral info for display
 */
export function getReferralInfo(): {
  isReferred: boolean;
  referrerSteamId: string | null;
  daysRemaining: number;
} {
  const referralData = getReferralData();
  
  if (!referralData) {
    return {
      isReferred: false,
      referrerSteamId: null,
      daysRemaining: 0
    };
  }
  
  const now = Date.now();
  const daysRemaining = Math.ceil((referralData.expiresAt - now) / (24 * 60 * 60 * 1000));
  
  return {
    isReferred: true,
    referrerSteamId: referralData.referrerSteamId,
    daysRemaining: Math.max(0, daysRemaining)
  };
} 