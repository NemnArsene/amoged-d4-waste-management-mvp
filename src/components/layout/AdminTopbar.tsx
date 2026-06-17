import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Search, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { Avatar } from '../ui/Avatar';
import { cn } from '../../utils/cn';

const ROUTE_TITLES: Record<string, string> = {
  '/admin/dashboard': '📊 Dashboard',
  '/admin/reports': '⚠️ Signalements',
  '/admin/map': '🗺️ Carte Interactive',
  '/admin/interventions': '🚛 Interventions',
  '/admin/agents': '👷 Gestion des Agents',
  '/admin/users': '👥 Gestion des Utilisateurs',
  '/admin/reporting': '📈 Reporting & Analytics',
  '/admin/notifications': '🔔 Notifications',
  '/admin/audit': "📋 Journal d'Audit",
  '/admin/settings': '⚙️ Paramètres Système',
};

export function AdminTopbar() {
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, markAllRead } = useAppStore();
  const [showNotif, setShowNotif] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const title = ROUTE_TITLES[location.pathname] || 'AMOGED-D4';

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-800/60 px-4 md:px-6 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Title */}
        <h1 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
          {title}
        </h1>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-sm mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className={cn(
                'w-full pl-9 pr-4 py-2 text-sm rounded-xl',
                'bg-gray-100 dark:bg-gray-800 border-transparent',
                'text-gray-900 dark:text-white placeholder:text-gray-400',
                'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-gray-900',
                'transition-all duration-200'
              )}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setShowNotif(!showNotif); setShowMenu(false); }}
              className="relative p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white transition-all"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotif && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                      Tout marquer lu
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.slice(0, 8).map(notif => (
                    <div key={notif.id} className={cn(
                      'px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-0',
                      !notif.isRead && 'bg-emerald-50/50 dark:bg-emerald-900/10'
                    )}>
                      <div className="flex items-start gap-3">
                        {!notif.isRead && (
                          <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{notif.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notif.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-gray-200 dark:border-gray-800">
                  <button
                    onClick={() => { navigate('/admin/notifications'); setShowNotif(false); }}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium w-full text-center"
                  >
                    Voir toutes les notifications →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => { setShowMenu(!showMenu); setShowNotif(false); }}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <Avatar src={user?.avatar} name={user?.fullName || ''} size="sm" status="online" />
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">{user?.firstName}</p>
                <p className="text-xs text-gray-500 leading-tight">{user?.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.fullName}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <div className="py-1.5">
                  <button
                    onClick={() => { navigate('/admin/settings'); setShowMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <User className="w-4 h-4" />
                    Mon Profil
                  </button>
                  <button
                    onClick={() => { navigate('/admin/settings'); setShowMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <Settings className="w-4 h-4" />
                    Paramètres
                  </button>
                  <div className="border-t border-gray-200 dark:border-gray-800 my-1" />
                  <button
                    onClick={() => { logout(); navigate('/'); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside handler */}
      {(showNotif || showMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setShowNotif(false); setShowMenu(false); }}
        />
      )}
    </header>
  );
}
