import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { $atlasApi } from '@/lib/api/atlas';

export interface GemPurchase {
  id: number;
  user_id: string;
  amount: number;
  created_at: string;
  type: 'spend' | 'earn';
  data: {
    item_name: string;
  };
  save_id: string;
  is_confirmed: boolean;
  updated_at: string;
  transaction_id: string | null;
  is_rollback: boolean;
}

export interface UseGemPurchasesResult {
  gemPurchases: GemPurchase[];
  lastUpdated: Date | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  clearCache: () => void;
}

// Global state to prevent multiple instances from making duplicate API calls
interface GlobalGemPurchasesState {
  steamId: string | null;
  purchases: GemPurchase[];
  lastUpdated: Date | null;
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  lastFetchTime: number;
  subscribers: Set<(state: GlobalGemPurchasesState) => void>;
}

const globalGemPurchasesState: GlobalGemPurchasesState = {
  steamId: null,
  purchases: [],
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

async function globalFetchGemPurchases(steamId: string, isRefresh = false): Promise<void> {
  if (fetchPromise) {
    return fetchPromise;
  }

  const now = Date.now();
  const timeSinceLastFetch = now - globalGemPurchasesState.lastFetchTime;
  
  if (!isRefresh && timeSinceLastFetch < MIN_FETCH_INTERVAL && globalGemPurchasesState.purchases.length > 0) {
    return;
  }

  fetchPromise = (async () => {
    try {
      globalGemPurchasesState.isLoading = !isRefresh;
      globalGemPurchasesState.isRefreshing = isRefresh;
      globalGemPurchasesState.error = null;
      notifySubscribers();

      console.log(`Fetching gem purchases for Steam ID: ${steamId}`);
      
      // Use Atlas API directly - the steam_id will be extracted from the JWT token automatically
      const data = await $atlasApi(`/api/client/store/purchases`, { 
        useIngress: true 
      });

      let purchases: GemPurchase[];

      // Handle both possible response formats
      if (Array.isArray(data)) {
        purchases = data;
      } else if (data && typeof data === 'object' && 'rows' in data && Array.isArray(data.rows)) {
        purchases = data.rows;
      } else {
        throw new Error('Invalid response format or missing rows data');
      }

      globalGemPurchasesState.steamId = steamId;
      globalGemPurchasesState.purchases = purchases;
      globalGemPurchasesState.lastUpdated = new Date();
      globalGemPurchasesState.lastFetchTime = now;
      globalGemPurchasesState.error = null;
      
      console.log('Gem purchases updated globally', { count: purchases.length });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch gem purchases';
      console.error('Error fetching gem purchases', err);
      globalGemPurchasesState.error = errorMessage;
    } finally {
      globalGemPurchasesState.isLoading = false;
      globalGemPurchasesState.isRefreshing = false;
      notifySubscribers();
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}

function notifySubscribers() {
  globalGemPurchasesState.subscribers.forEach(callback => callback(globalGemPurchasesState));
}

// Global auto-refresh timer
let autoRefreshTimer: NodeJS.Timeout | null = null;

function startAutoRefresh(steamId: string) {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer);
  }
  
  autoRefreshTimer = setInterval(() => {
    if (globalGemPurchasesState.subscribers.size > 0) {
      console.log(`Auto-refreshing gem purchases (${globalGemPurchasesState.subscribers.size} subscribers)`);
      globalFetchGemPurchases(steamId, true);
    } else {
      console.log('Stopping gem purchases auto-refresh - no active subscribers');
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

export function useGemPurchases(): UseGemPurchasesResult {
  const { user } = useAuth();
  
  const [localState, setLocalState] = useState({
    gemPurchases: globalGemPurchasesState.purchases,
    lastUpdated: globalGemPurchasesState.lastUpdated,
    isLoading: globalGemPurchasesState.isLoading,
    isRefreshing: globalGemPurchasesState.isRefreshing,
    error: globalGemPurchasesState.error
  });

  const initializedRef = useRef(false);
  const currentSteamIdRef = useRef<string | null>(null);

  // Subscribe to global state changes
  useEffect(() => {
    const updateLocalState = (state: GlobalGemPurchasesState) => {
      setLocalState({
        gemPurchases: state.purchases,
        lastUpdated: state.lastUpdated,
        isLoading: state.isLoading,
        isRefreshing: state.isRefreshing,
        error: state.error
      });
    };

    globalGemPurchasesState.subscribers.add(updateLocalState);
    
    return () => {
      globalGemPurchasesState.subscribers.delete(updateLocalState);
    };
  }, []);

  // Handle user changes and initial fetch
  useEffect(() => {
    const steamId = user?.steam_id;
    
    if (!steamId) {
      if (currentSteamIdRef.current) {
        console.log('User logged out - clearing gem purchases state');
        globalGemPurchasesState.steamId = null;
        globalGemPurchasesState.purchases = [];
        globalGemPurchasesState.lastUpdated = null;
        globalGemPurchasesState.error = null;
        globalGemPurchasesState.isLoading = false;
        globalGemPurchasesState.isRefreshing = false;
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
    
    if (!initializedRef.current || globalGemPurchasesState.steamId !== steamId) {
      console.log(`New user detected for gem purchases: ${user.name} (${steamId})`);
      initializedRef.current = true;
      
      if (globalGemPurchasesState.steamId && globalGemPurchasesState.steamId !== steamId) {
        globalGemPurchasesState.purchases = [];
        globalGemPurchasesState.lastUpdated = null;
        globalGemPurchasesState.error = null;
      }
      
      globalFetchGemPurchases(steamId);
      startAutoRefresh(steamId);
    }
  }, [user?.steam_id, user?.name]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (globalGemPurchasesState.subscribers.size === 0) {
        stopAutoRefresh();
      }
    };
  }, []);

  const refresh = useCallback(async (): Promise<void> => {
    const steamId = user?.steam_id;
    if (steamId) {
      await globalFetchGemPurchases(steamId, true);
    }
  }, [user?.steam_id]);

  const clearCache = useCallback(() => {
    const steamId = user?.steam_id;
    if (steamId) {
      globalGemPurchasesState.purchases = [];
      globalGemPurchasesState.lastUpdated = null;
      globalGemPurchasesState.error = null;
      globalGemPurchasesState.lastFetchTime = 0;
      notifySubscribers();
    }
  }, [user?.steam_id]);

  return {
    gemPurchases: localState.gemPurchases,
    lastUpdated: localState.lastUpdated,
    isLoading: localState.isLoading,
    isRefreshing: localState.isRefreshing,
    error: localState.error,
    refresh,
    clearCache
  };
} 