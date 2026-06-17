import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { MOCK_AUDIT_LOGS } from '../../data/mockData';
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '../../utils/cn';

const ROLE_COLORS = {
  ADMIN: 'danger', SUPERVISOR: 'info', AGENT: 'purple', CITIZEN: 'success',
} as const;

const ACTION_COLORS: Record<string, string> = {
  LOGIN: 'text-emerald-600', LOGOUT: 'text-gray-500', CREATE_REPORT: 'text-blue-600',
  UPDATE_REPORT: 'text-amber-600', DELETE_REPORT: 'text-red-600', ASSIGN_AGENT: 'text-purple-600',
  CREATE_INTERVENTION: 'text-indigo-600', UPDATE_INTERVENTION: 'text-orange-600',
  CREATE_USER: 'text-teal-600', UPDATE_USER: 'text-cyan-600', DEACTIVATE_USER: 'text-red-500',
  EXPORT_REPORT: 'text-emerald-500', VIEW_DASHBOARD: 'text-blue-400', CHANGE_SETTINGS: 'text-gray-600',
};

export function AuditPage() {
  const [search, setSearch] = useState('');
  const sorted = MOCK_AUDIT_LOGS
    .filter(log => !search || log.userName.toLowerCase().includes(search.toLowerCase()) || log.action.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Journal d'Audit</h2>
          <p className="text-sm text-gray-500">Traçabilité complète des actions système</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-4 h-4" />
          Mis à jour en temps réel
        </div>
      </div>

      <Card padding="sm">
        <Input
          placeholder="Rechercher dans les journaux..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </Card>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                {['Horodatage', 'Utilisateur', 'Rôle', 'Action', 'Ressource', 'Détails', 'IP', 'Statut'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {sorted.map(log => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div>
                      <p className="text-xs font-medium text-gray-900 dark:text-white">
                        {format(new Date(log.timestamp), 'dd MMM yyyy', { locale: fr })}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(log.timestamp), 'HH:mm:ss')}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={log.userName} size="xs" />
                      <span className="text-xs font-medium text-gray-900 dark:text-white truncate max-w-[100px]">{log.userName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={ROLE_COLORS[log.userRole]} size="sm">{log.userRole}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs font-mono font-semibold', ACTION_COLORS[log.action] || 'text-gray-600')}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{log.resource}</td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <p className="text-xs text-gray-500 truncate">{log.details}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-gray-500">{log.ipAddress}</span>
                  </td>
                  <td className="px-4 py-3">
                    {log.success
                      ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                      : <XCircle className="w-4 h-4 text-red-500" />
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-500">{sorted.length} entrées dans le journal d'audit</p>
        </div>
      </Card>
    </div>
  );
}
