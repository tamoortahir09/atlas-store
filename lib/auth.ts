// Types for user authentication
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
  creator?: {
    name: string;
    email: string;
    image_url: string;
  };
}

export interface AuthResponse {
  accessToken?: string;
  refreshToken?: string;
  user?: User;
  two_factor?: boolean;
  url?: string;
  temp_token?: string;
}

// Authentication API calls
export class AuthAPI {
  private static BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://services.atlasrust.com/api';

  // Get current user from localStorage
  static getUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  // Set user in localStorage
  static setUser(user: User | null): void {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!this.getUser();
  }

  // Get Steam authentication URL
  static getSteamUrl(): void {
    const returnTo = `${window.location.origin}/auth/steam/return`;
    window.location.href = `${this.BASE_URL}/public/steam?returnTo=${encodeURIComponent(returnTo)}`;
  }

  // Get Discord authentication URL
  static getDiscordUrl(): void {
    window.location.href = `${this.BASE_URL}/auth/discord`;
  }

  // Get Google authentication URL
  static getGoogleUrl(): void {
    window.location.href = `${this.BASE_URL}/auth/google`;
  }

  // Handle Steam authentication return
  static async authReturn(params: URLSearchParams): Promise<AuthResponse> {
    console.log("Steam auth return hit");
    
    // Convert URLSearchParams to object for API call
    const paramsObj = Object.fromEntries(params);
    
    const { $api } = await import('@/lib/api');
    const data = await $api<AuthResponse>('/public/steam/return', { params: paramsObj });
    
    if (data.two_factor && data.url && data.temp_token) {
      localStorage.setItem('temp_token', data.temp_token);
      window.location.href = data.url;
      return data;
    }

    if (data.accessToken) {
      this.setUser(data as User);
      return data;
    }

    throw new Error('Failed to authenticate');
  }

  // Handle Discord authentication return
  static async discordAuthReturn(params: URLSearchParams): Promise<AuthResponse> {
    const paramsObj = Object.fromEntries(params);
    
    const { $api } = await import('@/lib/api');
    const data = await $api<AuthResponse>('/auth/discord', { params: paramsObj });
    
    if (data.user) {
      const currentUser = this.getUser();
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          discord_id: data.user.discord_id,
          discord_name: data.user.discord_name,
          isLinked: data.user.isLinked,
        };
        this.setUser(updatedUser);
      }
    }

    return data;
  }

  // Handle Google authentication return
  static async googleAuthReturn(params: URLSearchParams): Promise<AuthResponse> {
    const paramsObj = Object.fromEntries(params);
    
    const { $api } = await import('@/lib/api');
    const data = await $api<AuthResponse>('/auth/google', { params: paramsObj });
    
    if (data.user) {
      const currentUser = this.getUser();
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          isCreator: data.user.isCreator,
          creator: data.user.creator,
        };
        this.setUser(updatedUser);
      }
    }

    return data;
  }

  // Unlink Discord account
  static async unlinkDiscord(): Promise<void> {
    const user = this.getUser();
    if (!user) throw new Error('No user found');

    const { $api } = await import('@/lib/api');
    const data = await $api<AuthResponse>('/auth/discord/unlink', { method: 'POST' });
    
    if (data.user) {
      const updatedUser = {
        ...user,
        discord_id: data.user.discord_id,
        discord_name: data.user.discord_name,
        isLinked: data.user.isLinked,
      };
      this.setUser(updatedUser);
    }
  }

  // Unlink Google account
  static async unlinkGoogle(): Promise<void> {
    const user = this.getUser();
    if (!user) throw new Error('No user found');

    const { $api } = await import('@/lib/api');
    const data = await $api<AuthResponse>('/auth/google/unlink', { method: 'POST' });
    
    if (data.user) {
      const updatedUser = {
        ...user,
        isCreator: data.user.isCreator,
      };
      delete updatedUser.creator;
      this.setUser(updatedUser);
    }
  }

  // Refresh authentication token
  static async refreshToken(): Promise<AuthResponse> {
    const user = this.getUser();
    if (!user?.refreshToken) {
      throw new Error('No refresh token found');
    }

    const { $api } = await import('@/lib/api');
    const data = await $api<AuthResponse>(`/auth/refreshtoken/${user.refreshToken}`, { method: 'POST' });
    
    if (data.accessToken) {
      this.setUser(data as User);
      return data;
    }

    throw new Error('Failed to refresh token');
  }

  // Remove user and clear storage
  static removeUser(): void {
    this.setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('temp_token');
      localStorage.removeItem('linking_flow');
    }
  }

  // Purge all localStorage
  static purgeAllLocalStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }

  // Linking flow management
  static setLinkingFlow(flow: boolean): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('linking_flow', JSON.stringify(flow));
    }
  }

  static getLinkingFlow(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const flow = localStorage.getItem('linking_flow');
      return flow ? JSON.parse(flow) : false;
    } catch {
      return false;
    }
  }
} 