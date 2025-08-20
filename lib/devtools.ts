// Development tools configuration for Redux
export const isDevelopment = process.env.NODE_ENV === 'development';

// Debug auth data for local development
export const DEV_AUTH_DATA = {
  "auth": {
    "user": {
      "name": "al2blues",
      "id": "de8dc4ac-de54-4407-95df-e3695e2d90c0",
      "steam_id": "76561199868856695",
      "discord_id": null,
      "discord_name": "",
      "avatar_image": "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRlOGRjNGFjLWRlNTQtNDQwNy05NWRmLWUzNjk1ZTJkOTBjMCIsInN0ZWFtX2lkIjoiNzY1NjExOTk4Njg4NTY2OTUiLCJpYXQiOjE3NTA3OTk1OTUsImV4cCI6MTc1MTQwNDM5NX0.pQ0_zOy7TdpaiZ61xwvwj4wUIGUkjtl1-6W_wt-6Miw",
      "refreshToken": "41fd6f8e-be36-4454-8b2a-893857477f27",
      "isLinked": false,
      "isCreator": false,
      "store_token": "f5gzSFeQmJdeCLyceTgBQSB9jCSHP2qDhzLwfUPnPrZjheQ7g5onqHuGxkWbF7BbzgqePF4"
    },
    "loading": true,
    "error": null,
    "isAuthenticated": true,
    "linkingFlow": false,
    "tempToken": null,
    "unlinkingDiscord": false,
    "unlinkingGoogle": false
  },
  "_persist": {
    "version": -1,
    "rehydrated": true
  }
};

// Extract just the user data for consistency with DevTools component
export const DEV_USER_DATA = DEV_AUTH_DATA.auth.user;

// Function to inject dev data into localStorage for testing
export function injectDevAuthData() {
  if (isDevelopment && typeof window !== 'undefined') {
    const devData = JSON.stringify(DEV_AUTH_DATA);
    localStorage.setItem('persist:root', devData);
    console.log('🔧 Dev auth data injected into localStorage');
    console.log('📧 Store token available:', DEV_AUTH_DATA.auth.user.store_token);
    console.log('🔄 Please refresh the page to load the dev data');
  }
}

// Expose dev function globally in development
if (isDevelopment && typeof window !== 'undefined') {
  (window as any).injectDevAuthData = injectDevAuthData;
  console.log('🛠️ Dev tools available: window.injectDevAuthData()');
}

// Redux DevTools configuration
export const devToolsConfig = isDevelopment && {
  name: 'Atlas Auth Store',
  maxAge: 50, // Keep last 50 actions
  trace: true, // Enable stack trace
  traceLimit: 25,
  features: {
    pause: true, // Start monitoring state after the first action
    lock: true, // Lock the monitor to inspect a specific action
    persist: true, // Persist the state in local storage
    export: true, // Export the state to a file
    import: 'custom' as const, // Import state from a file
    jump: true, // Jump to any action in the history
    skip: true, // Skip actions
    reorder: true, // Reorder actions
    dispatch: true, // Dispatch custom actions
    test: true, // Generate tests for actions
  },
  // Color scheme for better visibility
  theme: 'tomorrow',
  // Action sanitizer to hide sensitive data
  actionSanitizer: (action: any) => {
    if (action.type && action.type.includes('auth') && action.payload) {
      // Hide sensitive authentication data in DevTools
      const sanitized = { ...action };
      if (sanitized.payload.accessToken) {
        sanitized.payload = { 
          ...sanitized.payload, 
          accessToken: '[HIDDEN]',
          refreshToken: sanitized.payload.refreshToken ? '[HIDDEN]' : undefined,
          store_token: sanitized.payload.store_token ? '[HIDDEN]' : undefined
        };
      }
      return sanitized;
    }
    return action;
  },
  // State sanitizer to hide sensitive data
  stateSanitizer: (state: any) => {
    if (state.auth?.user?.accessToken) {
      return {
        ...state,
        auth: {
          ...state.auth,
          user: {
            ...state.auth.user,
            accessToken: '[HIDDEN]',
            refreshToken: state.auth.user.refreshToken ? '[HIDDEN]' : undefined,
            store_token: state.auth.user.store_token ? '[HIDDEN]' : undefined
          }
        }
      };
    }
    return state;
  }
};

// Logging configuration
export const logConfig = {
  // Log levels
  error: true,
  warning: isDevelopment,
  info: isDevelopment,
  debug: isDevelopment,
  
  // Colors for console logs
  colors: {
    action: '#03A9F4',
    state: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3'
  }
}; 