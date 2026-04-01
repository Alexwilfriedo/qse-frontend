import { useAuthStore } from '@/features/auth/authStore';
import axios, { AxiosError } from 'axios';
import { showToast } from './toast';

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
  timestamp: string;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('qse-auth');
    if (authData) {
      try {
        const { state } = JSON.parse(authData);
        if (state?.accessToken) {
          config.headers.Authorization = `Bearer ${state.accessToken}`;
        }
      } catch {
        // Ignore parse errors
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const status = error.response?.status;
    const apiError = error.response?.data;

    if (status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        useAuthStore.getState().clearAuth();
        showToast.error('Session expirée. Veuillez vous reconnecter.');
        window.location.href = '/login';
      }
    } else if (status === 403) {
      showToast.error(apiError?.message || 'Accès non autorisé');
    } else if (status === 404) {
      showToast.error(apiError?.message || 'Ressource non trouvée');
    } else if (status === 422) {
      showToast.error(apiError?.message || 'Erreur de validation');
    } else if (status && status >= 500) {
      showToast.error('Une erreur serveur est survenue');
    }

    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError && error.response?.data) {
    return error.response.data.message || 'Une erreur est survenue';
  }
  return 'Une erreur est survenue';
}
