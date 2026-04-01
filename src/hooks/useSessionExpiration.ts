import { useAuthStore } from '@/features/auth/authStore';
import { showToast } from '@/lib/toast';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Décode un token JWT et retourne son payload.
 */
function decodeJwt(token: string): { exp?: number } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Hook qui surveille l'expiration du token JWT et déconnecte l'utilisateur
 * automatiquement quand la session expire.
 */
export function useSessionExpiration() {
  const navigate = useNavigate();
  const { accessToken, clearAuth, isAuthenticated } = useAuthStore();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (!isAuthenticated || !accessToken) {
      return;
    }

    const payload = decodeJwt(accessToken);
    if (!payload?.exp) {
      return;
    }

    const expirationTime = payload.exp * 1000;
    const now = Date.now();
    const timeUntilExpiration = expirationTime - now;

    if (timeUntilExpiration <= 0) {
      clearAuth();
      showToast.error('Session expirée. Veuillez vous reconnecter.');
      navigate('/login');
      return;
    }

    // Déconnexion 30 secondes avant l'expiration réelle pour éviter les erreurs
    const bufferTime = 30 * 1000;
    const timeoutDelay = Math.max(timeUntilExpiration - bufferTime, 0);

    timeoutRef.current = setTimeout(() => {
      clearAuth();
      showToast.error('Session expirée. Veuillez vous reconnecter.');
      navigate('/login');
    }, timeoutDelay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [accessToken, clearAuth, isAuthenticated, navigate]);
}
