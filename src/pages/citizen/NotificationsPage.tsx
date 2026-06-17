import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { Bell, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '../../utils/cn';

const NOTIF_ICONS: Record<string, string> = {
  REPORT_CREATED: '✅', REPORT_ASSIGNED: '👷', REPORT_IN_PROGRESS: '🚛',
  REPORT_RESOLVED: '🎉', REPORT_REJECTED: '❌', SYSTEM: '🔔', ALERT: '⚠️', INFO: 'ℹ️',
  INTERVENTION_ASSIGNED: '📋', INTERVENTION_COMPLETED: '✅',
};

export function NotificationsPage() {
  const { user } = useAuthStore();
  const { notifications, markNotificationRead, markAllRead, unreadCount } = useAppStore();

  const myNotifs = notifications.slice(0, 30);
  const hasUnread = unreadCount > 0;

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Notifications</h2>
          {unreadCount > 0 && (
            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">{unreadCount}</span>
          )}
        </div>
        {hasUnread && (
          <Button
            size="sm"
            variant="ghost"
            onClick={markAllRead}
            leftIcon={<CheckCheck className="w-4 h-4" />}
          >
            Tout marquer lu
          </Button>
        )}
      </div>

      {myNotifs.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="Aucune notification"
          description="Vous serez notifié lorsqu'il y aura des mises à jour sur vos signalements."
        />
      ) : (
        <div className="space-y-2">
          {myNotifs.map(notif => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={cn(
                'flex items-start gap-3 p-4 rounded-2xl cursor-pointer transition-all border',
                !notif.isRead
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200/50 dark:border-emerald-800/30'
                  : 'bg-white dark:bg-gray-900 border-gray-200/60 dark:border-gray-800 opacity-70'
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0',
                !notif.isRead ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-gray-100 dark:bg-gray-800'
              )}>
                {NOTIF_ICONS[notif.type] || '🔔'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn('text-sm font-semibold', !notif.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400')}>
                    {notif.title}
                  </p>
                  {!notif.isRead && <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                  {notif.message}
                </p>
                <p className="text-xs text-gray-400 mt-1.5">
                  {format(new Date(notif.createdAt), 'dd MMM yyyy à HH:mm', { locale: fr })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
