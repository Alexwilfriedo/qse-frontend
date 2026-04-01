import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, AlertTriangle, Clock, ExternalLink } from 'lucide-react';
import { useNotifications, useMarkAsRead } from '../hooks/useNotifications';
import { Notification } from '../notificationsApi';
import { NotificationType } from '../notificationTypes';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NotificationDropdownProps {
  onClose: () => void;
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const navigate = useNavigate();
  const { data, isLoading } = useNotifications(0, 10);
  const markAsRead = useMarkAsRead();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead.mutate(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case NotificationType.ACTION_OVERDUE:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case NotificationType.ACTION_DUE_SOON:
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case NotificationType.ACTION_VALIDATED:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-brand-500" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-50">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
        <button
          onClick={() => navigate('/notifications')}
          className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          Voir tout
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Chargement...</div>
        ) : !data?.content.length ? (
          <div className="p-4 text-center text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            Aucune notification
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {data.content.map((notification) => (
              <li
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${!notification.read ? 'bg-brand-50/50 dark:bg-brand-900/20' : ''
                  }`}
              >
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!notification.read ? 'font-medium' : ''} text-gray-900 dark:text-gray-100`}>
                    {notification.title}
                  </p>
                  {notification.message && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: fr })}
                  </p>
                </div>
                {notification.link && (
                  <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
