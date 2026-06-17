import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import {
  Home, PlusCircle, ClipboardList, CalendarDays, MoreHorizontal,
  Bell, Trash2, Moon, Sun
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/citizen/home', label: 'Accueil', icon: Home },
  { path: '/citizen/report', label: 'Signaler', icon: PlusCircle },
  { path: '/citizen/my-reports', label: 'Suivi', icon: ClipboardList },
  { path: '/citizen/calendar', label: 'Calendrier', icon: CalendarDays },
  { path: '/citizen/more', label: 'Plus', icon: MoreHorizontal },
];

export function CitizenLayout() {
  const { user } = useAuthStore();
  const { unreadCount, theme, setTheme } = useAppStore();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col max-w-md mx-auto relative">
      {/* Top header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">AMOGED-D4</h1>
              <p className="text-xs text-gray-500 leading-tight">Douala 4ème</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 transition-all"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => navigate('/citizen/notifications')}
              className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 transition-all"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 safe-bottom">
        <div className="flex items-center justify-around px-2 py-1.5">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200 min-w-0 flex-1',
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-gray-400 dark:text-gray-600'
              )}
            >
              {({ isActive }) => (
                <>
                  <div className={cn(
                    'p-1.5 rounded-xl transition-all duration-200',
                    isActive && 'bg-emerald-100 dark:bg-emerald-900/30'
                  )}>
                    <Icon className={cn('w-5 h-5', isActive ? 'stroke-[2.5px]' : 'stroke-2')} />
                  </div>
                  <span className={cn(
                    'text-xs transition-all duration-200 font-medium truncate',
                    isActive ? 'opacity-100' : 'opacity-60'
                  )}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
