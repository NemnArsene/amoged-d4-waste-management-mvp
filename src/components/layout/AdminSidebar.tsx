import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { Avatar } from '../ui/Avatar';
import {
  LayoutDashboard, AlertTriangle, Map, ClipboardList, Users,
  UserCog, BarChart3, Bell, Settings, FileText, ChevronLeft,
  ChevronRight, LogOut, Moon, Sun, Trash2, Gift
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: '/admin/reports', label: 'Signalements', icon: <AlertTriangle className="w-5 h-5" />, badge: 98 },
  { path: '/admin/map', label: 'Carte Interactive', icon: <Map className="w-5 h-5" /> },
  { path: '/admin/interventions', label: 'Interventions', icon: <ClipboardList className="w-5 h-5" /> },
  { path: '/admin/agents', label: 'Agents', icon: <Users className="w-5 h-5" /> },
  { path: '/admin/rewards', label: 'Programme de fidélité', icon: <Gift className="w-5 h-5" /> },
  { path: '/admin/users', label: 'Utilisateurs', icon: <UserCog className="w-5 h-5" /> },
  { path: '/admin/reporting', label: 'Reporting', icon: <BarChart3 className="w-5 h-5" /> },
  { path: '/admin/notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
  { path: '/admin/audit', label: "Journal d'Audit", icon: <FileText className="w-5 h-5" /> },
  { path: '/admin/settings', label: 'Paramètres', icon: <Settings className="w-5 h-5" /> },
];

export function AdminSidebar() {
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, collapseSidebar, theme, setTheme } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={cn(
      'fixed left-0 top-0 bottom-0 z-40 flex flex-col',
      'bg-gray-950 border-r border-gray-800/60',
      'transition-all duration-300 ease-in-out',
      sidebarCollapsed ? 'w-16' : 'w-64',
    )}>
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-5 border-b border-gray-800/60',
        sidebarCollapsed && 'justify-center px-0'
      )}>
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Trash2 className="w-5 h-5 text-white" />
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-white leading-tight">AMOGED-D4</h1>
            <p className="text-xs text-gray-500 truncate">Douala 4ème</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              'flex items-center gap-3 rounded-xl transition-all duration-200 group relative',
              sidebarCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5',
              isActive
                ? 'bg-emerald-600/20 text-emerald-400'
                : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
            )}
            title={sidebarCollapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-emerald-500 rounded-r-full" />
                )}
                <span className={cn('flex-shrink-0', isActive && 'text-emerald-400')}>
                  {item.icon}
                </span>
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
                {!sidebarCollapsed && item.badge && (
                  <span className="ml-auto bg-emerald-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
                {sidebarCollapsed && item.badge && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full" />
                )}
                {/* Tooltip for collapsed */}
                {sidebarCollapsed && (
                  <span className={cn(
                    'absolute left-full ml-2 px-2.5 py-1.5 rounded-lg text-xs font-medium',
                    'bg-gray-800 text-white whitespace-nowrap',
                    'opacity-0 group-hover:opacity-100 pointer-events-none',
                    'transition-opacity duration-200 z-50'
                  )}>
                    {item.label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-gray-800/60 p-2 space-y-1">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={cn(
            'w-full flex items-center gap-3 rounded-xl p-2.5 text-gray-400 hover:bg-gray-800/60 hover:text-white transition-all',
            sidebarCollapsed && 'justify-center'
          )}
          title="Changer le thème"
        >
          {theme === 'dark'
            ? <Sun className="w-4 h-4 flex-shrink-0" />
            : <Moon className="w-4 h-4 flex-shrink-0" />
          }
          {!sidebarCollapsed && (
            <span className="text-sm font-medium">{theme === 'dark' ? 'Mode Clair' : 'Mode Sombre'}</span>
          )}
        </button>

        {/* User card */}
        {user && (
          <div className={cn(
            'flex items-center gap-2.5 p-2.5 rounded-xl',
            sidebarCollapsed && 'justify-center'
          )}>
            <Avatar src={user.avatar} name={user.fullName} size="sm" status="online" />
            {!sidebarCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.fullName}</p>
                  <p className="text-xs text-gray-500 truncate">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                  title="Déconnexion"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={collapseSidebar}
          className={cn(
            'w-full flex items-center gap-3 rounded-xl p-2.5 text-gray-500 hover:text-white hover:bg-gray-800/60 transition-all',
            sidebarCollapsed ? 'justify-center' : 'justify-end pr-3'
          )}
        >
          {sidebarCollapsed
            ? <ChevronRight className="w-4 h-4" />
            : <>
                <span className="text-xs font-medium mr-auto">Réduire</span>
                <ChevronLeft className="w-4 h-4" />
              </>
          }
        </button>
      </div>
    </aside>
  );
}
