import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { $atlasApi } from '@/lib/api/atlas';

export interface GemBalance {
  balance: number;
  lastUpdated: string;
}

export interface UseGemBalanceResult {
  gemBalance: number | null;
  lastUpdated: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  clearCache: () => void;
  setGemBalance: (balance: number) => void;
}

// Global state to prevent multiple instances from making duplicate API calls
interface GlobalGemState {
  steamId: string | null;
  balance: number | null;
  lastUpdated: string | null;
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  lastFetchTime: number;
  subscribers: Set<(state: GlobalGemState) => void>;
}

const globalGemState: GlobalGemState = {
  steamId: null,
  balance: null,
  lastUpdated: null,
  error: null,
  isLoading: false,
  isRefreshing: false,
  lastFetchTime: 0,
  subscribers: new Set()
};

// Minimum time between API calls (5 minutes)
const MIN_FETCH_INTERVAL = 5 * 60 * 1000;
// Auto-refresh interval (10 minutes)
const AUTO_REFRESH_INTERVAL = 10 * 60 * 1000;

// Global fetch function to prevent duplicate calls
let fetchPromise: Promise<void> | null = null;

// Global function to set gem balance directly (for OAuth flow and auth updates)
// Global function to set gem balance directly (for OAuth flow and auth updates)
export function setGlobalGemBalance(steamId: string, balance: number): void {
  // Update global state
  globalGemState.steamId = steamId;
  globalGemState.balance = balance;
  globalGemState.lastUpdated = new Date().toISOString();
  globalGemState.error = null;
  globalGemState.lastFetchTime = Date.now();
  
  // Clear any loading states since we're setting the data directly
  globalGemState.isLoading = false;
  globalGemState.isRefreshing = false;
  
  // Notify all subscribers of the change
  notifySubscribers();
  
  console.log(`✅ Global gem balance successfully updated to ${balance} for ${steamId}`);
}

// Global function to clear gem balance (for logout)
export function clearGlobalGemBalance(): void {
  console.log(`💎 Clearing global gem balance`);
  
  globalGemState.steamId = null;
  globalGemState.balance = null;
  globalGemState.lastUpdated = null;
  globalGemState.error = null;
  globalGemState.isLoading = false;
  globalGemState.isRefreshing = false;
  globalGemState.lastFetchTime = 0;
  
  // Notify all subscribers of the change
  notifySubscribers();
  
  console.log(`✅ Global gem balance cleared`);
}

async function globalFetchGemBalance(steamId: string, isRefresh = false): Promise<void> {
  if (fetchPromise) {
    console.log('💎 Gem balance fetch already in progress, reusing existing promise');
    return fetchPromise;
  }

  const now = Date.now();
  const timeSinceLastFetch = now - globalGemState.lastFetchTime;
  
  // Check if we have fresh data and don't need to refetch
  if (!isRefresh && timeSinceLastFetch < MIN_FETCH_INTERVAL && globalGemState.balance !== null && globalGemState.steamId === steamId) {
    console.log('💎 Gem balance is fresh, skipping API call');
    return;
  }

  fetchPromise = (async () => {
    try {
      globalGemState.isLoading = !isRefresh;
      globalGemState.isRefreshing = isRefresh;
      globalGemState.error = null;
      notifySubscribers();

      console.log(`Fetching gem balance for Steam ID: ${steamId}`);
      
      // Use Atlas API directly - the steam_id will be extracted from the JWT token automatically
      const data = await $atlasApi(`/api/client/store`, { 
        useIngress: true 
      });
      
      if (!data.user || typeof data.user.gems !== 'number') {
        throw new Error('Invalid response format or missing gems data');
      }

      globalGemState.steamId = steamId;
      globalGemState.balance = data.user.gems;
      globalGemState.lastUpdated = data.user.updated_at || new Date().toISOString();
      globalGemState.lastFetchTime = now;
      globalGemState.error = null;
      
      console.log('Gem balance updated globally', { balance: data.user.gems });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch gem balance';
      console.error('Error fetching gem balance', {
        error: err,
        steamId,
        hasToken: !!globalGemState,
        isRefresh
      });
      globalGemState.error = errorMessage;
    } finally {
      globalGemState.isLoading = false;
      globalGemState.isRefreshing = false;
      notifySubscribers();
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}

function notifySubscribers() {
  globalGemState.subscribers.forEach(callback => callback(globalGemState));
}

// Global auto-refresh timer
let autoRefreshTimer: NodeJS.Timeout | null = null;

function startAutoRefresh(steamId: string) {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer);
  }
  
  autoRefreshTimer = setInterval(() => {
    if (globalGemState.subscribers.size > 0) {
      console.log(`Auto-refreshing gem balance (${globalGemState.subscribers.size} subscribers)`);
      globalFetchGemBalance(steamId, true);
    } else {
      console.log('Stopping auto-refresh - no active subscribers');
      if (autoRefreshTimer) {
        clearInterval(autoRefreshTimer);
        autoRefreshTimer = null;
      }
    }
  }, AUTO_REFRESH_INTERVAL);
}

function stopAutoRefresh() {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer);
    autoRefreshTimer = null;
  }
}

export function useGemBalance(): UseGemBalanceResult {
  const { user } = useAuth();
  
  const [localState, setLocalState] = useState({
    gemBalance: globalGemState.balance,
    lastUpdated: globalGemState.lastUpdated,
    isLoading: globalGemState.isLoading,
    isRefreshing: globalGemState.isRefreshing,
    error: globalGemState.error
  });

  const initializedRef = useRef(false);
  const currentSteamIdRef = useRef<string | null>(null);

  // Subscribe to global state changes
  useEffect(() => {
    const updateLocalState = (state: GlobalGemState) => {
      setLocalState({
        gemBalance: state.balance,
        lastUpdated: state.lastUpdated,
        isLoading: state.isLoading,
        isRefreshing: state.isRefreshing,
        error: state.error
      });
    };

    globalGemState.subscribers.add(updateLocalState);
    
    return () => {
      globalGemState.subscribers.delete(updateLocalState);
    };
  }, []);

  // Handle user changes and initial fetch
  useEffect(() => {
    const steamId = user?.steam_id;
    
    if (!steamId) {
      if (currentSteamIdRef.current) {
        console.log('User logged out - clearing gem balance state');
        globalGemState.steamId = null;
        globalGemState.balance = null;
        globalGemState.lastUpdated = null;
        globalGemState.error = null;
        globalGemState.isLoading = false;
        globalGemState.isRefreshing = false;
        notifySubscribers();
        stopAutoRefresh();
        currentSteamIdRef.current = null;
        initializedRef.current = false;
      }
      return;
    }

    if (steamId === currentSteamIdRef.current && initializedRef.current) {
      return;
    }

    currentSteamIdRef.current = steamId;
    
    if (!initializedRef.current || globalGemState.steamId !== steamId) {
      console.log(`New user detected: ${user.name} (${steamId})`);
      initializedRef.current = true;
      
      if (globalGemState.steamId && globalGemState.steamId !== steamId) {
        globalGemState.balance = null;
        globalGemState.lastUpdated = null;
        globalGemState.error = null;
      }
      
      globalFetchGemBalance(steamId);
      startAutoRefresh(steamId);
    }
  }, [user?.steam_id, user?.name]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (globalGemState.subscribers.size === 0) {
        stopAutoRefresh();
      }
    };
  }, []);

  const refresh = useCallback(async (): Promise<void> => {
    const steamId = user?.steam_id;
    if (steamId) {
      await globalFetchGemBalance(steamId, true);
    }
  }, [user?.steam_id]);

  const clearCache = useCallback(() => {
    const steamId = user?.steam_id;
    if (steamId) {
      console.log(`💎 Clearing gem balance cache for ${steamId}`);
      globalGemState.balance = null;
      globalGemState.lastUpdated = null;
      globalGemState.error = null;
      globalGemState.lastFetchTime = 0;
      notifySubscribers();
    } else {
      console.log(`💎 Clearing all gem balance data (full logout)`);
      clearGlobalGemBalance();
    }
  }, [user?.steam_id]);

  const setGemBalance = useCallback((balance: number) => {
    const steamId = user?.steam_id;
    if (steamId) {
      console.log(`💎 Setting gem balance via hook: ${balance} for ${steamId}`);
      setGlobalGemBalance(steamId, balance);
    } else {
      console.warn('💎 Cannot set gem balance - no Steam ID available');
    }
  }, [user?.steam_id]);

  return {
    gemBalance: localState.gemBalance,
    lastUpdated: localState.lastUpdated,
    isLoading: localState.isLoading,
    isRefreshing: localState.isRefreshing,
    error: localState.error,
    refresh,
    clearCache,
    setGemBalance
  };
} 