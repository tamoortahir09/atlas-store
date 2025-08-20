export const API_CONFIG = {
  atlas: {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://services.atlasrust.com/api',
    ingressURL: process.env.NEXT_PUBLIC_ATLAS_INGRESS_ENDPOINT || 'https://ingress.atlasrust.com',
    apiKey: process.env.NEXT_PUBLIC_ATLAS_API || process.env.ATLASAPI
  },
  paynow: {
    baseURL: process.env.NEXT_PUBLIC_PAYNOW_API_URL || 'https://api.paynow.gg/v1',
    storeId: process.env.NEXT_PUBLIC_PAYNOW_STORE_ID,
    apiKey: process.env.NEXT_PUBLIC_PAYNOW_API || process.env.PAYNOW_API
  }
};

export const APP_CONFIG = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  baseUrl: typeof window !== 'undefined' ? window.location.origin : '',
}; 