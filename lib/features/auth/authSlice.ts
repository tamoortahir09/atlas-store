import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { $atlasApi } from '@/lib/api/atlas';
import { API_CONFIG, APP_CONFIG } from '@/lib/config';
import { setGlobalGemBalance, clearGlobalGemBalance } from '@/hooks/useGemBalance';

// Types from the existing auth system
export interface User {
  accessToken: string;
  refreshToken: string;
  steam_id?: string;
  name?: string;
  discord_id?: string;
  discord_name?: string;
  avatar_image?: string; // User's avatar image URL
  isLinked?: boolean;
  isCreator?: boolean;
  store_token?: string; // PayNow customer token for store operations
  gems?: number; // User's gem balance from OAuth
  creator?: {
    name: string;
    email: string;
    image_url: string;
  };
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  linkingFlow: boolean;
  tempToken: string | null;
  // Loading states for specific operations
  unlinkingDiscord: boolean;
  unlinkingGoogle: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  linkingFlow: false,
  tempToken: null,
  unlinkingDiscord: false,
  unlinkingGoogle: false,
};

// Async Thunks for API operations

// URL generation thunks (for centralized navigation handling)
export const getSteamUrl = createAsyncThunk(
  'auth/getSteamUrl',
  async (_, { rejectWithValue }) => {
    try {
      const returnTo = `${APP_CONFIG.baseUrl}/auth/steam/return`;
      const url = `${API_CONFIG.atlas.baseURL}/public/steam?returnTo=${encodeURIComponent(returnTo)}`;
      window.location.href = url;
      return url;
    } catch (error) {
      return rejectWithValue('Failed to navigate to Steam auth');
    }
  }
);

export const getDiscordUrl = createAsyncThunk(
  'auth/getDiscordUrl',
  async (_, { rejectWithValue }) => {
    try {
      const url = `${API_CONFIG.atlas.baseURL}/auth/discord`;
      window.location.href = url;
      return url;
    } catch (error) {
      return rejectWithValue('Failed to navigate to Discord auth');
    }
  }
);

export const getGoogleUrl = createAsyncThunk(
  'auth/getGoogleUrl',
  async (_, { rejectWithValue }) => {
    try {
      const url = `${API_CONFIG.atlas.baseURL}/auth/google`;
      window.location.href = url;
      return url;
    } catch (error) {
      return rejectWithValue('Failed to navigate to Google auth');
    }
  }
);

// Track ongoing Steam auth requests to prevent duplicates
let steamAuthInProgress = false;

export const steamAuthReturn = createAsyncThunk(
  'auth/steamAuthReturn',
  async (params: Record<string, any>, { rejectWithValue }) => {
    // Prevent duplicate Steam auth calls
    if (steamAuthInProgress) {
      console.log('⏳ Steam auth already in progress, rejecting duplicate call');
      return rejectWithValue('Steam authentication already in progress');
    }

    try {
      steamAuthInProgress = true;
      console.log('🚀 Starting Steam auth return API call...');
      
      const data = await $atlasApi<any>('/public/steam/return', { params });
      
      if (data.two_factor && data.url && data.temp_token) {
        console.log('🔐 Two-factor authentication required');
        return { 
          type: 'two_factor', 
          url: data.url, 
          temp_token: data.temp_token 
        };
      }

      if (data.accessToken) {
        console.log('✅ Steam authentication successful');
        return { type: 'success', user: data };
      }

      throw new Error('Failed to authenticate');
    } catch (error) {
      console.error('❌ Steam auth API call failed:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Steam authentication failed');
    } finally {
      steamAuthInProgress = false;
    }
  }
);

// Track ongoing Discord auth requests to prevent duplicates
let discordAuthInProgress = false;

export const discordAuthReturn = createAsyncThunk(
  'auth/discordAuthReturn',
  async (params: Record<string, any>, { rejectWithValue, getState }) => {
    // Prevent duplicate Discord auth calls
    if (discordAuthInProgress) {
      console.log('⏳ Discord auth already in progress, rejecting duplicate call');
      return rejectWithValue('Discord authentication already in progress');
    }

    try {
      discordAuthInProgress = true;
      console.log('🚀 Starting Discord auth return API call...');
      
      const data = await $atlasApi<any>('/auth/discord', { params });
      
      if (data.user) {
        console.log('✅ Discord authentication successful');
        return data.user;
      }
      
      throw new Error('Failed to link Discord account');
    } catch (error) {
      console.error('❌ Discord auth API call failed:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Discord linking failed');
    } finally {
      discordAuthInProgress = false;
    }
  }
);

// Track ongoing Google auth requests to prevent duplicates
let googleAuthInProgress = false;

export const googleAuthReturn = createAsyncThunk(
  'auth/googleAuthReturn',
  async (params: Record<string, any>, { rejectWithValue }) => {
    // Prevent duplicate Google auth calls
    if (googleAuthInProgress) {
      console.log('⏳ Google auth already in progress, rejecting duplicate call');
      return rejectWithValue('Google authentication already in progress');
    }

    try {
      googleAuthInProgress = true;
      console.log('🚀 Starting Google auth return API call...');
      
      const data = await $atlasApi<any>('/auth/google', { params });
      
      if (data.user) {
        console.log('✅ Google authentication successful');
        return data.user;
      }
      
      throw new Error('Failed to link Google account');
    } catch (error) {
      console.error('❌ Google auth API call failed:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Google linking failed');
    } finally {
      googleAuthInProgress = false;
    }
  }
);

export const unlinkDiscord = createAsyncThunk(
  'auth/unlinkDiscord',
  async (_, { rejectWithValue }) => {
    try {
      const data = await $atlasApi<any>('/auth/discord/unlink', { method: 'POST' });
      
      if (data.user) {
        return data.user;
      }
      
      throw new Error('Failed to unlink Discord account');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to unlink Discord');
    }
  }
);

export const unlinkGoogle = createAsyncThunk(
  'auth/unlinkGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const data = await $atlasApi<any>('/auth/google/unlink', { method: 'POST' });
      
      if (data.user) {
        return data.user;
      }
      
      throw new Error('Failed to unlink Google account');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to unlink Google');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refreshToken = state.auth.user?.refreshToken;
      
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      const data = await $atlasApi<any>(`/auth/refreshtoken/${refreshToken}`, { method: 'POST' });
      
      if (data.accessToken) {
        return data;
      }
      
      throw new Error('Failed to refresh token');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Token refresh failed');
    }
  }
);

// Authentication slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous actions
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      
      // Set gem balance if provided in user data
      if (action.payload.gems !== undefined && action.payload.steam_id) {
        console.log('🟣 Updating gem balance from setUser:', action.payload.gems);
        setGlobalGemBalance(action.payload.steam_id, action.payload.gems);
      }
    },
    clearAuth: (state) => {
      // Clear gem balance when clearing auth
      console.log('🟣 Clearing gem balance for logout');
      clearGlobalGemBalance();
      
      state.user = null;
      state.isAuthenticated = false;
      state.linkingFlow = false;
      state.tempToken = null;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLinkingFlow: (state, action: PayloadAction<boolean>) => {
      state.linkingFlow = action.payload;
    },
    setTempToken: (state, action: PayloadAction<string | null>) => {
      state.tempToken = action.payload;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        
        // Update gem balance if gems are included in the profile update
        if (action.payload.gems !== undefined && state.user.steam_id) {
          console.log('🟣 Updating gem balance from profile update:', action.payload.gems);
          setGlobalGemBalance(state.user.steam_id, action.payload.gems);
        }
      }
    },
    // Client-side only unlink actions (no API calls)
    unlinkDiscordLocal: (state) => {
      if (state.user) {
        state.user = {
          ...state.user,
          discord_id: undefined,
          discord_name: undefined,
        };
      }
    },
    unlinkGoogleLocal: (state) => {
      if (state.user) {
        state.user = {
          ...state.user,
          isCreator: false,
          creator: undefined,
        };
      }
    },
    // Navigation actions for OAuth flows
    initiateLogin: (state, action: PayloadAction<'steam' | 'discord' | 'google'>) => {
      state.linkingFlow = true;
      state.error = null;
      // These will trigger browser navigation in the component
    },
  },
  extraReducers: (builder) => {
    // URL generation thunks
    builder
      .addCase(getSteamUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSteamUrl.fulfilled, (state) => {
        state.loading = false;
        // Don't set linkingFlow for Steam auth - it's for authentication, not linking
      })
      .addCase(getSteamUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(getDiscordUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDiscordUrl.fulfilled, (state) => {
        state.loading = false;
        state.linkingFlow = true;
      })
      .addCase(getDiscordUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(getGoogleUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGoogleUrl.fulfilled, (state) => {
        state.loading = false;
        state.linkingFlow = true;
      })
      .addCase(getGoogleUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Steam authentication
    builder
      .addCase(steamAuthReturn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(steamAuthReturn.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload.type === 'two_factor') {
          state.tempToken = action.payload.temp_token;
          // Browser navigation will be handled in component
        } else if (action.payload.type === 'success') {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.linkingFlow = false;
          
          if (action.payload.user.gems !== undefined && action.payload.user.steam_id) {
            console.log('🟣 Updating gem balance from Steam auth success:', action.payload.user.gems);
            setGlobalGemBalance(action.payload.user.steam_id, action.payload.user.gems);
          }
        }
      })
      .addCase(steamAuthReturn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Discord authentication
    builder
      .addCase(discordAuthReturn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(discordAuthReturn.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user = {
            ...state.user,
            discord_id: action.payload.discord_id,
            discord_name: action.payload.discord_name,
            isLinked: action.payload.isLinked,
          };
        }
        state.linkingFlow = false;
      })
      .addCase(discordAuthReturn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Google authentication
    builder
      .addCase(googleAuthReturn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleAuthReturn.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user = {
            ...state.user,
            isCreator: action.payload.isCreator,
            creator: action.payload.creator,
          };
        }
        state.linkingFlow = false;
      })
      .addCase(googleAuthReturn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Discord unlinking
    builder
      .addCase(unlinkDiscord.pending, (state) => {
        state.unlinkingDiscord = true;
        state.error = null;
      })
      .addCase(unlinkDiscord.fulfilled, (state, action) => {
        state.unlinkingDiscord = false;
        if (state.user) {
          state.user = {
            ...state.user,
            discord_id: action.payload.discord_id,
            discord_name: action.payload.discord_name,
            isLinked: action.payload.isLinked,
          };
        }
      })
      .addCase(unlinkDiscord.rejected, (state, action) => {
        state.unlinkingDiscord = false;
        state.error = action.payload as string;
      });

    // Google unlinking
    builder
      .addCase(unlinkGoogle.pending, (state) => {
        state.unlinkingGoogle = true;
        state.error = null;
      })
      .addCase(unlinkGoogle.fulfilled, (state, action) => {
        state.unlinkingGoogle = false;
        if (state.user) {
          state.user = {
            ...state.user,
            isCreator: action.payload.isCreator,
          };
          delete state.user.creator;
        }
      })
      .addCase(unlinkGoogle.rejected, (state, action) => {
        state.unlinkingGoogle = false;
        state.error = action.payload as string;
      });

    // Token refresh
    builder
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        
        // Update gem balance if included in refresh response
        if (action.payload.gems !== undefined && action.payload.steam_id) {
          console.log('🟣 Updating gem balance from token refresh:', action.payload.gems);
          setGlobalGemBalance(action.payload.steam_id, action.payload.gems);
        }
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // If token refresh fails, clear auth
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

// Export actions
export const {
  setUser,
  clearAuth,
  setLoading,
  setError,
  clearError,
  setLinkingFlow,
  setTempToken,
  updateUserProfile,
  unlinkDiscordLocal,
  unlinkGoogleLocal,
  initiateLogin,
} = authSlice.actions;

export default authSlice.reducer; 