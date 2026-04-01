import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { notificationsApi, NotificationPreferences } from '../notificationsApi';
import { useAuthStore } from '@/features/auth/authStore';
import { showToast } from '@/lib/toast';

export function useNotifications(page = 0, size = 10) {
  return useQuery({
    queryKey: ['notifications', page, size],
    queryFn: () => notificationsApi.getNotifications(page, size),
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationsApi.getUnreadCount(),
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: ['notification-preferences'],
    queryFn: () => notificationsApi.getPreferences(),
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (prefs: NotificationPreferences) => notificationsApi.updatePreferences(prefs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
    },
  });
}

/**
 * Hook pour la connexion SSE aux notifications temps réel.
 * Se connecte automatiquement quand l'utilisateur est authentifié.
 */
export function useNotificationStream() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();
  const eventSourceRef = useRef<EventSource | null>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef(0);

  useEffect(() => {
    if (!accessToken) return;

    const maxRetries = 5;
    const baseRetryDelay = 3000;

    const connect = () => {
      // EventSource ne supporte pas les headers, on passe le token en query param
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const url = `${baseUrl}/api/v1/notifications/stream?token=${encodeURIComponent(accessToken)}`;

      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.addEventListener('connected', () => {
        console.log('SSE: Connected to notification stream');
        retryCountRef.current = 0; // Reset retry count on successful connection
      });

      eventSource.addEventListener('notification', (event) => {
        try {
          const notification = JSON.parse(event.data);
          console.log('SSE: Received notification', notification);

          // Invalider les queries pour rafraîchir les données
          queryClient.invalidateQueries({ queryKey: ['notifications'] });

          // Afficher un toast
          showToast.info(notification.title, {
            description: notification.message,
          });
        } catch (e) {
          console.error('SSE: Failed to parse notification', e);
        }
      });

      eventSource.onerror = () => {
        console.error('SSE: Connection error');
        eventSource.close();
        eventSourceRef.current = null;

        // Retry with exponential backoff
        if (retryCountRef.current < maxRetries) {
          const delay = baseRetryDelay * Math.pow(2, retryCountRef.current);
          console.log(`SSE: Reconnecting in ${delay}ms (attempt ${retryCountRef.current + 1}/${maxRetries})`);
          retryCountRef.current++;
          retryTimeoutRef.current = setTimeout(connect, delay);
        } else {
          console.error('SSE: Max retries reached, giving up');
        }
      };
    };

    connect();

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      eventSourceRef.current = null;
    };
  }, [accessToken, queryClient]);
}
