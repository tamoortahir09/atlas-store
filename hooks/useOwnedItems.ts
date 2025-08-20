import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { $atlasApi } from '@/lib/api/atlas';

export interface OwnedItem {
  purchase_id: number;
  id: string;
  reciever_id: string;
  name: string;
  item_id: string;
  price: number;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  isActive: boolean;
}

export interface UseOwnedItemsResult {
  ownedItems: OwnedItem[];
  lastUpdated: Date | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  clearCache: () => void;
}

// Global state to prevent multiple instances from making duplicate API calls
interface GlobalOwnedItemsState {
  steamId: string | null;
  items: OwnedItem[];
  lastUpdated: Date | null;
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  lastFetchTime: number;
  subscribers: Set<(state: GlobalOwnedItemsState) => void>;
}

const globalOwnedItemsState: GlobalOwnedItemsState = {
  steamId: null,
  items: [],
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

async function globalFetchOwnedItems(steamId: string, isRefresh = false): Promise<void> {
  if (fetchPromise) {
    return fetchPromise;
  }

  const now = Date.now();
  const timeSinceLastFetch = now - globalOwnedItemsState.lastFetchTime;
  
  if (!isRefresh && timeSinceLastFetch < MIN_FETCH_INTERVAL && globalOwnedItemsState.items.length > 0) {
    return;
  }

  fetchPromise = (async () => {
    try {
      globalOwnedItemsState.isLoading = !isRefresh;
      globalOwnedItemsState.isRefreshing = isRefresh;
      globalOwnedItemsState.error = null;
      notifySubscribers();

      console.log(`Fetching owned items for Steam ID: ${steamId}`);
      
      // Use Atlas API directly - the steam_id will be extracted from the JWT token automatically
      // const data = await $atlasApi(`/api/client/store/owned-items`, { 
      //   useIngress: true 
      // });
      const data: any = [];
      let items: OwnedItem[];

      // Type guard function
      const hasRows = (obj: any): obj is { rows: OwnedItem[] } => {
        return obj && typeof obj === 'object' && 'rows' in obj && Array.isArray(obj.rows);
      };

      // Handle both possible response formats
      if (Array.isArray(data)) {
        items = data;
      } else if (hasRows(data)) {
        items = data.rows;
      } else {
        throw new Error('Invalid response format or missing rows data');
      }

      globalOwnedItemsState.steamId = steamId;
      globalOwnedItemsState.items = items;
      globalOwnedItemsState.lastUpdated = new Date();
      globalOwnedItemsState.lastFetchTime = now;
      globalOwnedItemsState.error = null;
      
      console.log('Owned items updated globally', { count: items.length });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch owned items';
      console.error('Error fetching owned items', err);
      globalOwnedItemsState.error = errorMessage;
    } finally {
      globalOwnedItemsState.isLoading = false;
      globalOwnedItemsState.isRefreshing = false;
      notifySubscribers();
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}

function notifySubscribers() {
  globalOwnedItemsState.subscribers.forEach(callback => callback(globalOwnedItemsState));
}

// Global auto-refresh timer
let autoRefreshTimer: NodeJS.Timeout | null = null;

function startAutoRefresh(steamId: string) {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer);
  }
  
  autoRefreshTimer = setInterval(() => {
    if (globalOwnedItemsState.subscribers.size > 0) {
      console.log(`Auto-refreshing owned items (${globalOwnedItemsState.subscribers.size} subscribers)`);
      globalFetchOwnedItems(steamId, true);
    } else {
      console.log('Stopping owned items auto-refresh - no active subscribers');
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

export function useOwnedItems(): UseOwnedItemsResult {
  const { user } = useAuth();
  
  const [localState, setLocalState] = useState({
    ownedItems: globalOwnedItemsState.items,
    lastUpdated: globalOwnedItemsState.lastUpdated,
    isLoading: globalOwnedItemsState.isLoading,
    isRefreshing: globalOwnedItemsState.isRefreshing,
    error: globalOwnedItemsState.error
  });

  const initializedRef = useRef(false);
  const currentSteamIdRef = useRef<string | null>(null);

  // Subscribe to global state changes
  useEffect(() => {
    const updateLocalState = (state: GlobalOwnedItemsState) => {
      setLocalState({
        ownedItems: state.items,
        lastUpdated: state.lastUpdated,
        isLoading: state.isLoading,
        isRefreshing: state.isRefreshing,
        error: state.error
      });
    };

    globalOwnedItemsState.subscribers.add(updateLocalState);
    
    return () => {
      globalOwnedItemsState.subscribers.delete(updateLocalState);
    };
  }, []);

  // Handle user changes and initial fetch
  useEffect(() => {
    const steamId = user?.steam_id;
    
    if (!steamId) {
      if (currentSteamIdRef.current) {
        console.log('User logged out - clearing owned items state');
        globalOwnedItemsState.steamId = null;
        globalOwnedItemsState.items = [];
        globalOwnedItemsState.lastUpdated = null;
        globalOwnedItemsState.error = null;
        globalOwnedItemsState.isLoading = false;
        globalOwnedItemsState.isRefreshing = false;
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
    
    if (!initializedRef.current || globalOwnedItemsState.steamId !== steamId) {
      console.log(`New user detected for owned items: ${user.name} (${steamId})`);
      initializedRef.current = true;
      
      if (globalOwnedItemsState.steamId && globalOwnedItemsState.steamId !== steamId) {
        globalOwnedItemsState.items = [];
        globalOwnedItemsState.lastUpdated = null;
        globalOwnedItemsState.error = null;
      }
      
      globalFetchOwnedItems(steamId);
      startAutoRefresh(steamId);
    }
  }, [user?.steam_id, user?.name]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (globalOwnedItemsState.subscribers.size === 0) {
        stopAutoRefresh();
      }
    };
  }, []);

  const refresh = useCallback(async (): Promise<void> => {
    const steamId = user?.steam_id;
    if (steamId) {
      await globalFetchOwnedItems(steamId, true);
    }
  }, [user?.steam_id]);

  const clearCache = useCallback(() => {
    const steamId = user?.steam_id;
    if (steamId) {
      globalOwnedItemsState.items = [];
      globalOwnedItemsState.lastUpdated = null;
      globalOwnedItemsState.error = null;
      globalOwnedItemsState.lastFetchTime = 0;
      notifySubscribers();
    }
  }, [user?.steam_id]);

  return {
    ownedItems: localState.ownedItems,
    lastUpdated: localState.lastUpdated,
    isLoading: localState.isLoading,
    isRefreshing: localState.isRefreshing,
    error: localState.error,
    refresh,
    clearCache
  };
} 