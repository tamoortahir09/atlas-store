import { API_CONFIG } from '../config';

// Get auth token from Redux-persisted state
function getAuthTokenFromStore(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    // Try to get from redux persist storage
    const persistRoot = localStorage.getItem('persist:root');
    if (persistRoot) {
      const parsedRoot = JSON.parse(persistRoot);
      if (parsedRoot.auth) {
        const authData = JSON.parse(parsedRoot.auth);
        return authData?.user?.accessToken || null;
      }
    }
    
    // Fallback to direct user storage (for migration compatibility)
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user?.accessToken || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error reading auth token:', error);
    return null;
  }
}

export class AtlasAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'AtlasAPIError';
  }
}

// Atlas API client for main API endpoints
export async function $atlasApi<T = any>(
  endpoint: string,
  options: {
    method?: string;
    params?: Record<string, any>;
    data?: any;
    headers?: Record<string, string>;
    useIngress?: boolean; // For endpoints that use ingress URL
  } = {}
): Promise<T> {
  const {
    method = 'GET',
    params,
    data,
    headers = {},
    useIngress = false,
  } = options;

  // Choose base URL
  const baseURL = useIngress ? API_CONFIG.atlas.ingressURL : API_CONFIG.atlas.baseURL;
  
  // Build URL with params if provided
  let url = `${baseURL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    if (searchParams.toString()) {
      url += `?${searchParams.toString()}`;
    }
  }

  // Setup headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add auth token if available
  const token = getAuthTokenFromStore();
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  // Add Atlas API key for ingress endpoints
  if (useIngress) {
    const token = getAuthTokenFromStore();
    if(!token) {
      throw new Error('No token found');
    }
    requestHeaders['x-access-token'] = token;
  }

  // Setup request options
  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  // Add body for non-GET requests
  if (data && method !== 'GET') {
    requestOptions.body = JSON.stringify(data);
  }

  try {
    console.log(`Atlas API ${method} ${url}`, { params, data });
    
    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new AtlasAPIError(
        `Atlas API Error: ${response.status} ${response.statusText} - ${errorText}`,
        response.status,
        response
      );
    }

    const result = await response.json();
    console.log(`Atlas API Response:`, result);
    
    return result;
  } catch (error) {
    console.error(`Atlas API Error for ${method} ${url}:`, error);
    throw error;
  }
}

// Convenience methods for Atlas API
export const atlasApi = {
  get: <T = any>(endpoint: string, params?: Record<string, any>, useIngress = false) =>
    $atlasApi<T>(endpoint, { method: 'GET', params, useIngress }),
  
  post: <T = any>(endpoint: string, data?: any, useIngress = false) =>
    $atlasApi<T>(endpoint, { method: 'POST', data, useIngress }),
  
  put: <T = any>(endpoint: string, data?: any, useIngress = false) =>
    $atlasApi<T>(endpoint, { method: 'PUT', data, useIngress }),
  
  delete: <T = any>(endpoint: string, useIngress = false) =>
    $atlasApi<T>(endpoint, { method: 'DELETE', useIngress }),
}; 