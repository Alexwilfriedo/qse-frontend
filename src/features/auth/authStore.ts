import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserInfo | null;
  isAuthenticated: boolean;
  forcePasswordChange: boolean;
  setAuth: (
    accessToken: string,
    refreshToken: string,
    user: UserInfo,
    forcePasswordChange?: boolean,
  ) => void;
  clearAuth: () => void;
  setUser: (user: UserInfo) => void;
  clearForcePasswordChange: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      forcePasswordChange: false,

      setAuth: (accessToken, refreshToken, user, forcePasswordChange = false) =>
        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: true,
          forcePasswordChange,
        }),

      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
          forcePasswordChange: false,
        }),

      setUser: (user) => set({ user }),

      clearForcePasswordChange: () => set({ forcePasswordChange: false }),
    }),
    {
      name: 'qse-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        forcePasswordChange: state.forcePasswordChange,
      }),
    },
  ),
);
