import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CheckCheck, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '../../utils/cn';

const PRIORITY_CONFIG = {
  LOW: { label: 'Faible', variant: 'default' as const },
  NORMAL: { label: 'Normal', variant: 'info' as const },
  HIGH: { label: 'Élevé', variant: 'warning' as const },
  URGENT: { label: 'Urgent', variant: 'danger' as const },
};

export function AdminNotificationsPage() {
  const { notifications, markNotificationRead, markAllRead, unreadCount } = useAppStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-500" />
            Centre de Notifications
            {unreadCount > 0 && (
              <span className="text-sm bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">{unreadCount}</span>
            )}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">Toutes les alertes et mises à jour système</p>
        </div>
        {unreadCount > 0 && (
          <Button size="sm" variant="outline" onClick={markAllRead} leftIcon={<CheckCheck className="w-4 h-4" />}>
            Tout marquer lu
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{notifications.length}</p>
          <p className="text-xs text-gray-500">Total</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-red-500">{unreadCount}</p>
          <p className="text-xs text-gray-500">Non lues</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-emerald-500">{notifications.filter(n => n.isRead).length}</p>
          <p className="text-xs text-gray-500">Lues</p>
        </Card>
      </div>

      {/* Notifications list */}
      <Card padding="none" className="overflow-hidden">
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={cn(
                'flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors',
                !notif.isRead
                  ? 'bg-emerald-50/50 dark:bg-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/30 opacity-75'
              )}
            >
              {!notif.isRead && (
                <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
              )}
              <div className={cn('flex-1', notif.isRead && 'ml-4')}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className={cn('text-sm font-semibold', !notif.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400')}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1.5">
                      {format(new Date(notif.createdAt), 'dd MMM yyyy à HH:mm', { locale: fr })}
                    </p>
                  </div>
                  <Badge variant={PRIORITY_CONFIG[notif.priority].variant} size="sm">
                    {PRIORITY_CONFIG[notif.priority].label}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
