import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { MOCK_CITIZENS, MOCK_SUPERVISORS, MOCK_AGENTS, MOCK_ADMIN, ZONES_DATA } from '../../data/mockData';
import type { User, UserRole } from '../../types';
import { Search, UserPlus, Shield, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

const ALL_USERS: User[] = [MOCK_ADMIN, ...MOCK_SUPERVISORS, ...MOCK_AGENTS as User[], ...MOCK_CITIZENS.slice(0, 30)];

const ROLE_CONFIG: Record<UserRole, { label: string; color: 'default' | 'danger' | 'info' | 'warning' | 'success' | 'purple'; bg: string }> = {
  ADMIN: { label: 'Administrateur', color: 'danger', bg: 'bg-red-50 text-red-700' },
  SUPERVISOR: { label: 'Superviseur', color: 'info', bg: 'bg-blue-50 text-blue-700' },
  AGENT: { label: 'Agent', color: 'purple', bg: 'bg-purple-50 text-purple-700' },
  CITIZEN: { label: 'Citoyen', color: 'success', bg: 'bg-emerald-50 text-emerald-700' },
};

export function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const filtered = ALL_USERS.filter(u => {
    const matchSearch = !search || u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleCounts = {
    ADMIN: ALL_USERS.filter(u => u.role === 'ADMIN').length,
    SUPERVISOR: ALL_USERS.filter(u => u.role === 'SUPERVISOR').length,
    AGENT: ALL_USERS.filter(u => u.role === 'AGENT').length,
    CITIZEN: ALL_USERS.filter(u => u.role === 'CITIZEN').length,
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(roleCounts).map(([role, count]) => {
          const cfg = ROLE_CONFIG[role as UserRole];
          return (
            <button
              key={role}
              onClick={() => setRoleFilter(roleFilter === role ? '' : role)}
              className={cn(
                'rounded-2xl p-4 text-left border-2 transition-all',
                roleFilter === role
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'bg-white dark:bg-gray-900 border-transparent'
              )}
            >
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
              <p className="text-xs text-gray-500 mt-0.5">{cfg.label}s</p>
            </button>
          );
        })}
      </div>

      {/* Filters + actions */}
      <Card padding="sm">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="flex-1">
            <Input
              placeholder="Rechercher par nom, email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <Select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            options={[
              { value: '', label: 'Tous les rôles' },
              { value: 'ADMIN', label: '👑 Administrateur' },
              { value: 'SUPERVISOR', label: '🎯 Superviseur' },
              { value: 'AGENT', label: '👷 Agent' },
              { value: 'CITIZEN', label: '🏠 Citoyen' },
            ]}
            className="w-full md:w-44"
          />
          <Button leftIcon={<UserPlus className="w-4 h-4" />} size="sm">
            Ajouter Utilisateur
          </Button>
        </div>
      </Card>

      {/* Users table */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                {['Utilisateur', 'Rôle', 'Zone', 'Téléphone', 'Statut', 'Email vérifié', 'Dernière connexion', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map(user => {
                const cfg = ROLE_CONFIG[user.role];
                return (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={user.avatar} name={user.fullName} size="sm" />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{user.fullName}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[140px]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={cfg.color} size="sm">{cfg.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                      {user.zone ? ZONES_DATA[user.zone].name : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {user.phone}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                        user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      )}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', user.isActive ? 'bg-emerald-500' : 'bg-gray-400')} />
                        {user.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.isEmailVerified
                        ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                        : <XCircle className="w-4 h-4 text-gray-300" />
                      }
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('fr-FR') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all" title="Modifier">
                          ✏️
                        </button>
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all" title="Permissions">
                          <Shield className="w-3.5 h-3.5" />
                        </button>
                        {user.role !== 'ADMIN' && (
                          <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all" title="Désactiver">
                            🚫
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-500">{filtered.length} utilisateurs • {ALL_USERS.filter(u => u.isActive).length} actifs</p>
        </div>
      </Card>
    </div>
  );
}
