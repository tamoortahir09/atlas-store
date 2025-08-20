import { API_CONFIG } from '../config';

export class PayNowAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'PayNowAPIError';
  }
}

// PayNow API client
export async function $paynowApi<T = any>(
  endpoint: string,
  options: {
    method?: string;
    params?: Record<string, any>;
    data?: any;
    headers?: Record<string, string>;
    customerToken?: string; // For customer-authenticated endpoints
    useAPIKey?: boolean; // For admin endpoints
  } = {}
): Promise<T> {
  const {
    method = 'GET',
    params,
    data,
    headers = {},
    customerToken,
    useAPIKey = false,
  } = options;

  // Build URL with params if provided
  let url = `${API_CONFIG.paynow.baseURL}${endpoint}`;
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

  // Add authentication
  if (customerToken) {
    requestHeaders.Authorization = `Customer ${customerToken}`;
  } else if (useAPIKey && API_CONFIG.paynow.apiKey) {
    requestHeaders.Authorization = `apikey ${API_CONFIG.paynow.apiKey}`;
  }

  // Add store ID header if available
  if (API_CONFIG.paynow.storeId) {
    requestHeaders['x-paynow-store-id'] = API_CONFIG.paynow.storeId;
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
    console.log(`PayNow API ${method} ${url}`, { params, data });
    
    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new PayNowAPIError(
        `PayNow API Error: ${response.status} ${response.statusText} - ${errorText}`,
        response.status,
        response
      );
    }

    const result = await response.json();
    console.log(`PayNow API Response:`, result);
    
    return result;
  } catch (error) {
    console.error(`PayNow API Error for ${method} ${url}:`, error);
    throw error;
  }
}

// Convenience methods for PayNow API
export const paynowApi = {
  // Customer-authenticated endpoints
  customer: {
    get: <T = any>(endpoint: string, customerToken: string, params?: Record<string, any>) =>
      $paynowApi<T>(endpoint, { method: 'GET', params, customerToken }),
    
    post: <T = any>(endpoint: string, customerToken: string, data?: any) =>
      $paynowApi<T>(endpoint, { method: 'POST', data, customerToken }),
    
    delete: <T = any>(endpoint: string, customerToken: string, params?: Record<string, any>) =>
      $paynowApi<T>(endpoint, { method: 'DELETE', params, customerToken }),
  },
  
  // Admin/API key endpoints
  admin: {
    get: <T = any>(endpoint: string, params?: Record<string, any>) =>
      $paynowApi<T>(endpoint, { method: 'GET', params, useAPIKey: true }),
    
    post: <T = any>(endpoint: string, data?: any) =>
      $paynowApi<T>(endpoint, { method: 'POST', data, useAPIKey: true }),
    
    put: <T = any>(endpoint: string, data?: any) =>
      $paynowApi<T>(endpoint, { method: 'PUT', data, useAPIKey: true }),
    
    delete: <T = any>(endpoint: string) =>
      $paynowApi<T>(endpoint, { method: 'DELETE', useAPIKey: true }),
  },
  
  // Public endpoints (no auth)
  public: {
    get: <T = any>(endpoint: string, params?: Record<string, any>) =>
      $paynowApi<T>(endpoint, { method: 'GET', params }),
    
    post: <T = any>(endpoint: string, data?: any) =>
      $paynowApi<T>(endpoint, { method: 'POST', data }),
  },
}; 