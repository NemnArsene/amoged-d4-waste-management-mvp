import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { Avatar } from '../../components/ui/Avatar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  User, Bell, Settings, HelpCircle, Phone, LogOut,
  Moon, Sun, ChevronRight, Star, Shield, BookOpen,
  Trash2, Award
} from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import { useUserPoints } from '../../hooks/useUserPoints';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  onClick?: () => void;
  badge?: string | number;
  danger?: boolean;
  rightElement?: React.ReactNode;
}

function MenuItem({ icon, label, subtitle, onClick, badge, danger, rightElement }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all text-left',
        danger ? 'hover:bg-red-50 dark:hover:bg-red-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
      )}
    >
      <div className={cn(
        'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
        danger ? 'bg-red-100 dark:bg-red-900/30 text-red-500' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
      )}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium', danger ? 'text-red-500' : 'text-gray-900 dark:text-white')}>
          {label}
        </p>
        {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {badge !== undefined && (
        <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{badge}</span>
      )}
      {rightElement}
      {!rightElement && !badge && (
        <ChevronRight className={cn('w-4 h-4 flex-shrink-0', danger ? 'text-red-300' : 'text-gray-300')} />
      )}
    </button>
  );
}

export function MorePage() {
  const { user, logout } = useAuthStore();
  const { unreadCount, theme, setTheme } = useAppStore();
  const navigate = useNavigate();
  const dynamicPoints = useUserPoints();

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('À bientôt!');
  };

  if (!user) return null;

  return (
    <div className="px-4 pt-4 pb-6 space-y-5">
      {/* Profile card */}
      <div
        onClick={() => navigate('/citizen/profile')}
        className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-4 text-white cursor-pointer hover:shadow-lg transition-all"
      >
        <div className="flex items-center gap-4">
          <Avatar src={user.avatar} name={user.fullName} size="xl" />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-base">{user.fullName}</h3>
            <p className="text-white/80 text-sm">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              {user.stats?.rank && (
                <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Award className="w-3 h-3" /> {user.stats.rank}
                </span>
              )}
              {dynamicPoints !== undefined && (
                <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" /> {dynamicPoints} pts
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/60" />
        </div>
      </div>

      {/* Account section */}
      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-1 mb-2">Mon Compte</p>
        <Card padding="sm" className="divide-y divide-gray-100 dark:divide-gray-800">
          <MenuItem
            icon={<User className="w-4 h-4" />}
            label="Mon Profil"
            subtitle="Informations personnelles"
            onClick={() => navigate('/citizen/profile')}
          />
          <MenuItem
            icon={<Bell className="w-4 h-4" />}
            label="Notifications"
            subtitle="Gérer mes alertes"
            badge={unreadCount > 0 ? unreadCount : undefined}
            onClick={() => navigate('/citizen/notifications')}
          />
          <MenuItem
            icon={<Shield className="w-4 h-4" />}
            label="Sécurité & Confidentialité"
            subtitle="Mot de passe, données"
          />
        </Card>
      </div>

      {/* App section */}
      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-1 mb-2">Application</p>
        <Card padding="sm" className="divide-y divide-gray-100 dark:divide-gray-800">
          <MenuItem
            icon={theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            label={theme === 'dark' ? 'Mode Clair' : 'Mode Sombre'}
            subtitle={`Thème actuel: ${theme === 'dark' ? 'Sombre' : 'Clair'}`}
            rightElement={
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={cn(
                  'w-11 h-6 rounded-full transition-all relative',
                  theme === 'dark' ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-600'
                )}
              >
                <span className={cn(
                  'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all',
                  theme === 'dark' ? 'left-5.5 translate-x-0.5' : 'left-0.5'
                )} />
              </button>
            }
          />
          <MenuItem
            icon={<Settings className="w-4 h-4" />}
            label="Paramètres"
            subtitle="Langue, notifications, zone"
          />
        </Card>
      </div>

      {/* Civic section */}
      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-1 mb-2">Citoyenneté</p>
        <Card padding="sm" className="divide-y divide-gray-100 dark:divide-gray-800">
          <MenuItem
            icon={<BookOpen className="w-4 h-4" />}
            label="Sensibilisation"
            subtitle="Guides et bonnes pratiques"
          />
          <MenuItem
            icon={<Award className="w-4 h-4" />}
            label="Mon Classement"
            subtitle={`Rang actuel: ${user.stats?.rank || 'Nouveau Citoyen'}`}
          />
          <MenuItem
            icon={<Star className="w-4 h-4 text-purple-500" />}
            label="Mes Récompenses"
            subtitle="Programme de fidélité"
            onClick={() => navigate('/citizen/rewards')}
          />
          <MenuItem
            icon={<Trash2 className="w-4 h-4" />}
            label="Guide de Tri des Déchets"
            subtitle="Bien séparer vos déchets"
          />
        </Card>
      </div>

      {/* Help section */}
      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-1 mb-2">Support</p>
        <Card padding="sm" className="divide-y divide-gray-100 dark:divide-gray-800">
          <MenuItem
            icon={<HelpCircle className="w-4 h-4" />}
            label="Aide & FAQ"
            subtitle="Questions fréquentes"
          />
          <MenuItem
            icon={<Phone className="w-4 h-4" />}
            label="Contacter la Mairie"
            subtitle="+237 233 422 000"
          />
        </Card>
      </div>

      {/* App info */}
      <Card padding="sm" className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <p className="text-xs font-bold text-gray-900 dark:text-white">AMOGED-D4</p>
        <p className="text-xs text-gray-500">Version 1.0.0 • Mairie de Douala 4ème</p>
        <p className="text-xs text-gray-400">© 2026 — Plateforme GovTech Smart City</p>
      </Card>

      {/* Logout */}
      <Card padding="sm">
        <MenuItem
          icon={<LogOut className="w-4 h-4" />}
          label="Se Déconnecter"
          subtitle="Fermer la session"
          onClick={handleLogout}
          danger
        />
      </Card>
    </div>
  );
}
