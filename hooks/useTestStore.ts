import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { $atlasApi } from '@/lib/api/atlas';

// --- Blacklist Types ---
export interface BlacklistParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'expired' | 'all';
  type?: string;
}

export interface BlacklistItem {
  id: string | number;
  username?: string;
  steam_id?: string;
  reason?: string;
  banned_by?: string;
  ban_date?: string;
  expires?: string;
  status?: 'active' | 'expired';
  type?: 'permanent' | 'temporary';
}

// --- Simple async thunk-like functions (mocked) ---
export const getBlacklistRows = async (params: BlacklistParams) => {
  return $atlasApi<{ items: BlacklistItem[]; totalPages: number; currentPage: number }>(
    '/admin/blacklist',
    { method: 'GET', params }
  );
};

export const createBlacklistRequest = async (body: any) => {
  // Simulate API call
  return new Promise<BlacklistItem>((resolve) => {
    setTimeout(() => {
      resolve({ id: Math.random(), ...body, status: 'active', type: body.type || 'permanent' });
    }, 300);
  });
};

export const manageBlacklistRow = async (q: { id: string | number; [key: string]: any }) => {
  // Simulate API call
  return new Promise<BlacklistItem>((resolve) => {
    setTimeout(() => {
      resolve(q); // Just return q as the updated item
    }, 300);
  });
};

export const unbanBlacklistItem = async (q: { id: string | number; [key: string]: any }) => {
  // Simulate API call
  return new Promise<BlacklistItem>((resolve) => {
    setTimeout(() => {
      resolve({ id: q.id, status: 'expired' });
    }, 300);
  });
};

// --- Blacklist Store Hook (mock state) ---
export const useBlacklistStore = () => {
  // No real redux state, just mock actions
  // You can replace this with useState/useReducer for local state if needed
  const dispatch = useAppDispatch();
  const blacklistState = {};

  const actions = {
    async getRows(params: BlacklistParams) {
      return await getBlacklistRows(params);
    },
    async createRequest(body: any) {
      return await createBlacklistRequest(body);
    },
    async manageRow(q: { id: string | number; [key: string]: any }) {
      return await manageBlacklistRow(q);
    },
    async unban(q: { id: string | number; [key: string]: any }) {
      return await unbanBlacklistItem(q);
    },
    clearError: () => {},
    resetState: () => {},
  };

  return {
    ...blacklistState,
    ...actions,
  };
};
