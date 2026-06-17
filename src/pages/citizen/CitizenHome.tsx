import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { MOCK_REPORTS, MOCK_NOTIFICATIONS, CATEGORY_LABELS, STATUS_LABELS, ZONES_DATA } from '../../data/mockData';
import { Card, StatCard } from '../../components/ui/Card';
import { Badge, StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Plus, ArrowRight, Bell, TrendingUp, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function CitizenHome() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (!user) return null;

  const myReports = MOCK_REPORTS.filter(r => r.citizenId === user.id || r.citizenId === 'citizen-001').slice(0, 10);
  const myNotifs = MOCK_NOTIFICATIONS.filter(n => !n.isRead).slice(0, 3);
  const stats = user.stats || { totalReports: myReports.length, resolvedReports: Math.floor(myReports.length * 0.6), pendingReports: Math.ceil(myReports.length * 0.4), points: 250 };

  const timeOfDay = new Date().getHours();
  const greeting = timeOfDay < 12 ? 'Bonjour' : timeOfDay < 18 ? 'Bon après-midi' : 'Bonsoir';

  // Community stats
  const communityStats = {
    todayReports: 23,
    resolvedThisWeek: 134,
    activeAgents: 17,
  };

  return (
    <div className="px-4 pb-6 space-y-5">
      {/* Welcome header */}
      <div className="pt-4">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-5 text-white relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <Avatar src={user.avatar} name={user.fullName} size="md" status="online" />
              <div>
                <p className="text-white/80 text-sm">{greeting},</p>
                <h2 className="font-bold text-white">{user.firstName}</h2>
              </div>
            </div>
            <p className="text-white/80 text-sm mb-4">
              {user.zone ? `Quartier: ${ZONES_DATA[user.zone].name}` : 'Bienvenue sur AMOGED-D4'}
            </p>
            <Button
              onClick={() => navigate('/citizen/report')}
              className="bg-white text-emerald-700 hover:bg-white/90 font-bold shadow-lg"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Faire un Signalement
            </Button>
          </div>
        </div>
      </div>

      {/* Personal stats */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Mes Statistiques</h3>
        <div className="grid grid-cols-2 gap-3">
          <Card padding="sm" className="border-l-4 border-l-emerald-500">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-gray-500">Résolus</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.resolvedReports}</p>
          </Card>
          <Card padding="sm" className="border-l-4 border-l-amber-500">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-gray-500">En attente</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingReports}</p>
          </Card>
          <Card padding="sm" className="border-l-4 border-l-blue-500">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-gray-500">Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalReports}</p>
          </Card>
          <Card padding="sm" className="border-l-4 border-l-purple-500">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-gray-500">Points</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.points}</p>
          </Card>
        </div>
      </div>

      {/* Recent notifications */}
      {myNotifs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              Notifications
              <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">{myNotifs.length}</span>
            </h3>
            <button onClick={() => navigate('/citizen/notifications')} className="text-xs text-emerald-600 dark:text-emerald-400">
              Voir tout →
            </button>
          </div>
          <div className="space-y-2">
            {myNotifs.map(notif => (
              <div key={notif.id} className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-sm flex-shrink-0">
                  🔔
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">{notif.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Community stats */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">📊 Activité Communautaire</h3>
        <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-900">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-bold text-emerald-600">{communityStats.todayReports}</p>
              <p className="text-xs text-gray-500 mt-0.5">Aujourd'hui</p>
            </div>
            <div className="border-x border-gray-200 dark:border-gray-700">
              <p className="text-2xl font-bold text-blue-600">{communityStats.resolvedThisWeek}</p>
              <p className="text-xs text-gray-500 mt-0.5">Résolus / sem.</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{communityStats.activeAgents}</p>
              <p className="text-xs text-gray-500 mt-0.5">Agents actifs</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent reports */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Mes Signalements Récents</h3>
          <button onClick={() => navigate('/citizen/my-reports')} className="text-xs text-emerald-600 dark:text-emerald-400">
            Voir tout →
          </button>
        </div>
        {myReports.length === 0 ? (
          <Card className="text-center py-8">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-sm text-gray-500">Aucun signalement pour l'instant</p>
            <Button size="sm" className="mt-3" onClick={() => navigate('/citizen/report')}>
              Faire mon premier signalement
            </Button>
          </Card>
        ) : (
          <div className="space-y-2.5">
            {myReports.slice(0, 4).map(report => (
              <div
                key={report.id}
                onClick={() => navigate('/citizen/my-reports')}
                className="flex items-center gap-3 p-3.5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800 cursor-pointer hover:shadow-sm transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl flex-shrink-0">
                  {CATEGORY_LABELS[report.category].icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {report.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {format(new Date(report.createdAt), 'dd MMM yyyy', { locale: fr })} • {report.location.district}
                  </p>
                </div>
                <StatusBadge status={report.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-4 border border-blue-200/50 dark:border-blue-800/30">
        <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2">💡 Le saviez-vous ?</h4>
        <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
          Chaque signalement résolu contribue à l'amélioration de la salubrité de Douala 4ème. Continuez à participer pour gagner des points et améliorer votre classement!
        </p>
      </div>
    </div>
  );
}
