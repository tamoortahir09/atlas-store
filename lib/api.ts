// DEPRECATED: This file is deprecated in favor of specialized API clients
// Use the new API clients instead:
// - import { $atlasApi, atlasApi } from '@/lib/api/atlas';
// - import { $paynowApi, paynowApi } from '@/lib/api/paynow';

// Re-export the new API clients for backward compatibility
export { $atlasApi as $api, atlasApi as api, AtlasAPIError as ApiError } from './api/atlas';
export { $paynowApi, paynowApi, PayNowAPIError } from './api/paynow';

// Legacy types for backward compatibility
export interface ApiResponse<T = any> {
  data?: T;
  user?: any;
  accessToken?: string;
  refreshToken?: string;
  two_factor?: boolean;
  url?: string;
  temp_token?: string;
} 