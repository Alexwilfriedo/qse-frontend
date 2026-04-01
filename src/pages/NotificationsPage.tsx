import { Bell, CheckCircle, AlertTriangle, Clock, Check } from 'lucide-react';
import { PageHeader, Card, Button, Badge } from '@/components/ui';
import { useNotifications, useMarkAsRead } from '@/features/notifications';
import { NotificationType } from '@/features/notifications/notificationTypes';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Notification } from '@/features/notifications/notificationsApi';

export default function NotificationsPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useNotifications(page, 20);
  const markAsRead = useMarkAsRead();
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch (type) {
      case NotificationType.ACTION_OVERDUE:
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case NotificationType.ACTION_DUE_SOON:
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case NotificationType.ACTION_VALIDATED:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-brand-500" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead.mutate(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent, notification: Notification) => {
    e.stopPropagation();
    if (!notification.read) {
      markAsRead.mutate(notification.id);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Toutes vos notifications"
      />

      <Card>
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Chargement...</div>
        ) : !data?.content.length ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Aucune notification</p>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {data.content.map((notification) => (
                <li
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${!notification.read ? 'bg-brand-50/50 dark:bg-brand-900/20' : ''
                    }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm ${!notification.read ? 'font-semibold' : ''} text-gray-900 dark:text-gray-100`}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <Badge variant="brand">Nouveau</Badge>
                      )}
                    </div>
                    {notification.message && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: fr })}
                    </p>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleMarkAsRead(e, notification)}
                      className="flex-shrink-0"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </li>
              ))}
            </ul>

            {data.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  Précédent
                </Button>
                <span className="text-sm text-gray-500">
                  Page {page + 1} sur {data.totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= data.totalPages - 1}
                >
                  Suivant
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
