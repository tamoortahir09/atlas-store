import { configureStore, combineReducers, isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './features/auth/authSlice';
import { devToolsConfig, isDevelopment, logConfig } from './devtools';

// Redux Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
};

// Custom middleware for API error logging
const apiErrorLogger: Middleware = (api) => (next) => (action) => {
  // Log rejected API actions
  if (isRejectedWithValue(action)) {
    if (logConfig.error) {
      console.group(`🚨 API Error: ${action.type}`);
      console.error('Action:', action);
      console.error('Error:', action.payload);
      console.error('Meta:', action.meta);
      console.groupEnd();
    }

    // You could also send errors to a logging service here
    // logErrorToService(action.payload, action.type);
  }

  return next(action);
};

// Action logger middleware for development
const actionLogger: Middleware = (api) => (next) => (action: any) => {
  if (isDevelopment && action.type && logConfig.debug) {
    const state = api.getState() as RootState;
    console.group(`%c📋 Action: ${action.type}`, `color: ${logConfig.colors.action}`);
    console.log('Dispatching:', action);
    console.log('%cPrevious state:', `color: ${logConfig.colors.state}`, state);
    const result = next(action);
    console.log('%cNew state:', `color: ${logConfig.colors.state}`, api.getState());
    console.groupEnd();
    return result;
  }
  return next(action);
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      // Enable immutability and serializability checks in development
      immutableCheck: isDevelopment,
      actionCreatorCheck: isDevelopment,
    }).concat(apiErrorLogger);
  },
  devTools: devToolsConfig,
});

// Create persistor
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Import and re-export action creators for use in components
export { 
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
  // Async thunks
  getSteamUrl,
  getDiscordUrl,
  getGoogleUrl,
  steamAuthReturn,
  discordAuthReturn,
  googleAuthReturn,
  unlinkDiscord,
  unlinkGoogle,
  refreshToken
} from './features/auth/authSlice'; 