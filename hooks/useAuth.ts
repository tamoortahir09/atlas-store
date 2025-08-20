import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from './useRedux';
import {
  setUser,
  clearAuth,
  setError,
  clearError,
  initiateLogin,
  getSteamUrl,
  getDiscordUrl,
  getGoogleUrl,
  steamAuthReturn,
  discordAuthReturn,
  googleAuthReturn,
  unlinkDiscord,
  unlinkGoogle,
  unlinkDiscordLocal,
  unlinkGoogleLocal,
  refreshToken as refreshTokenThunk,
} from '@/lib/store';
import { AuthAPI } from '@/lib/auth';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  
  // Select state from Redux store
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);
  const error = useAppSelector((state) => state.auth.error);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const linkingFlow = useAppSelector((state) => state.auth.linkingFlow);
  // Note: unlinkingDiscord and unlinkingGoogle removed since we're doing client-side only unlinking

  // Update user state
  const updateUser = useCallback((newUser: any) => {
    if (newUser) {
      dispatch(setUser(newUser));
    } else {
      dispatch(clearAuth());
    }
  }, [dispatch]);

  // Authentication actions
  const login = {
    steam: () => {
      dispatch(getSteamUrl());
    },
    discord: () => {
      dispatch(getDiscordUrl());
    },
    google: () => {
      dispatch(getGoogleUrl());
    },
  };

  // Unlink actions (client-side only - no API calls)
  const unlink = {
    discord: () => {
      try {
        dispatch(unlinkDiscordLocal());
        console.log('🔗 Discord unlinked locally (client-side only)');
        return Promise.resolve();
      } catch (err) {
        console.error('❌ Failed to unlink Discord locally:', err);
        throw err;
      }
    },
    google: () => {
      try {
        dispatch(unlinkGoogleLocal());
        console.log('🔗 Google unlinked locally (client-side only)');
        return Promise.resolve();
      } catch (err) {
        console.error('❌ Failed to unlink Google locally:', err);
        throw err;
      }
    },
  };

  // Logout
  const logout = useCallback(() => {
    dispatch(clearAuth());
    AuthAPI.removeUser(); // Also clear from localStorage
  }, [dispatch]);

  // Refresh token
  const refreshToken = useCallback(async () => {
    try {
      const result = await dispatch(refreshTokenThunk()).unwrap();
      return result;
    } catch (err) {
      throw err;
    }
  }, [dispatch]);

  // Set error action
  const setErrorAction = useCallback((errorMessage: string) => {
    dispatch(setError(errorMessage));
  }, [dispatch]);

  // Clear error action
  const clearErrorAction = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Helper functions
  const isSteamLinked = !!user?.steam_id;
  const isDiscordLinked = !!user?.discord_id;
  const isGoogleLinked = !!user?.isCreator;

  // OAuth callback handlers
  const handleSteamCallback = useCallback(async (params: Record<string, any>) => {
    try {
      console.log('🔄 Dispatching Steam auth return...');
      const result = await dispatch(steamAuthReturn(params)).unwrap();
      console.log('✅ Steam auth return completed successfully');
      return result;
    } catch (err) {
      console.error('❌ Steam auth return failed:', err);
      throw err;
    }
  }, [dispatch]);

  const handleDiscordCallback = useCallback(async (params: Record<string, any>) => {
    try {
      const result = await dispatch(discordAuthReturn(params)).unwrap();
      return result;
    } catch (err) {
      throw err;
    }
  }, [dispatch]);

  const handleGoogleCallback = useCallback(async (params: Record<string, any>) => {
    try {
      const result = await dispatch(googleAuthReturn(params)).unwrap();
      return result;
    } catch (err) {
      throw err;
    }
  }, [dispatch]);

  return {
    // State
    user,
    loading,
    error,
    linkingFlow,
    
    // Status checks
    isAuthenticated,
    isSteamLinked,
    isDiscordLinked,
    isGoogleLinked,
    
    // Actions
    login,
    unlink,
    logout,
    refreshToken,
    updateUser,
    
    // Utilities
    setError: setErrorAction,
    clearError: clearErrorAction,
    
    // OAuth callbacks (new Redux functionality)
    handleSteamCallback,
    handleDiscordCallback,
    handleGoogleCallback,
  };
}; 