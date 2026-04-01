import { api } from '@/lib/api';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string | null;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export interface NotificationsPage {
  content: Notification[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface NotificationPreferences {
  emailEnabled: boolean;
  inAppEnabled: boolean;
  digestFrequency: 'IMMEDIATE' | 'DAILY' | 'WEEKLY';
}

export const notificationsApi = {
  getNotifications: async (page = 0, size = 10): Promise<NotificationsPage> => {
    const response = await api.get(`/api/v1/notifications?page=${page}&size=${size}`);
    return response.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get('/api/v1/notifications/unread-count');
    return response.data.count;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.put(`/api/v1/notifications/${id}/read`);
  },

  getPreferences: async (): Promise<NotificationPreferences> => {
    const response = await api.get('/api/v1/users/me/notification-preferences');
    return response.data;
  },

  updatePreferences: async (prefs: NotificationPreferences): Promise<void> => {
    await api.put('/api/v1/users/me/notification-preferences', prefs);
  },
};
