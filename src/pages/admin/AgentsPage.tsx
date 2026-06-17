import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { MOCK_AGENTS, ZONES_DATA } from '../../data/mockData';
import type { Agent } from '../../types';
import { Search, Star, MapPin, Truck, Phone, Mail, Activity } from 'lucide-react';
import { cn } from '../../utils/cn';

const STATUS_CONFIG = {
  ACTIVE: { label: 'Actif', variant: 'success' as const, dot: 'bg-emerald-500' },
  ON_MISSION: { label: 'En Mission', variant: 'info' as const, dot: 'bg-blue-500 animate-pulse' },
  ON_LEAVE: { label: 'En Congé', variant: 'warning' as const, dot: 'bg-amber-500' },
  INACTIVE: { label: 'Inactif', variant: 'default' as const, dot: 'bg-gray-400' },
};

const VEHICLE_ICONS = { TRUCK: '🚛', MINIVAN: '🚐', MOTORCYCLE: '🏍️', TRICYCLE: '🛺' };

export function AgentsPage() {
  const [search, setSearch] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = MOCK_AGENTS.filter(a => {
    const matchSearch = !search || a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.agentId.toLowerCase().includes(search.toLowerCase());
    const matchZone = !zoneFilter || a.assignedZone === zoneFilter;
    const matchStatus = !statusFilter || a.status === statusFilter;
    return matchSearch && matchZone && matchStatus;
  });

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Agents', count: MOCK_AGENTS.length, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Actifs', count: MOCK_AGENTS.filter(a => a.status === 'ACTIVE').length, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'En Mission', count: MOCK_AGENTS.filter(a => a.status === 'ON_MISSION').length, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'En Congé', count: MOCK_AGENTS.filter(a => a.status === 'ON_LEAVE').length, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        ].map(s => (
          <Card key={s.label} padding="sm">
            <div className={cn('inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2', s.bg)}>
              <Activity className={cn('w-5 h-5', s.color)} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.count}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="flex-1">
            <Input
              placeholder="Rechercher un agent..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <Select
            value={zoneFilter}
            onChange={e => setZoneFilter(e.target.value)}
            options={[{ value: '', label: 'Toutes les zones' }, ...Object.entries(ZONES_DATA).map(([k, v]) => ({ value: k, label: v.name }))]}
            className="w-full md:w-44"
          />
          <Select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'Tous statuts' },
              { value: 'ACTIVE', label: '✅ Actif' },
              { value: 'ON_MISSION', label: '🔵 En Mission' },
              { value: 'ON_LEAVE', label: '⏸ En Congé' },
              { value: 'INACTIVE', label: '⭕ Inactif' },
            ]}
            className="w-full md:w-40"
          />
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setView('grid')}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all', view === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500')}
            >
              ⊞ Grille
            </button>
            <button
              onClick={() => setView('list')}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all', view === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500')}
            >
              ☰ Liste
            </button>
          </div>
        </div>
      </Card>

      {/* Agent grid */}
      <div className={cn(
        'grid gap-4',
        view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
      )}>
        {filtered.map(agent => {
          const statusCfg = STATUS_CONFIG[agent.status];
          return (
            <Card
              key={agent.id}
              hover
              onClick={() => setSelectedAgent(agent)}
              className={cn(view === 'list' && 'flex-row')}
            >
              <div className={cn('flex gap-4', view === 'list' ? 'flex-row items-center' : 'flex-col')}>
                <div className="flex items-start gap-3 flex-1">
                  <div className="relative">
                    <Avatar src={agent.avatar} name={agent.fullName} size={view === 'grid' ? 'lg' : 'md'} />
                    <span className={cn('absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900', statusCfg.dot)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm">{agent.fullName}</h3>
                      <Badge variant={statusCfg.variant} size="sm">{statusCfg.label}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">{agent.agentId}</p>

                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <MapPin className="w-3 h-3 text-emerald-500" />
                        {ZONES_DATA[agent.assignedZone].name}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <Phone className="w-3 h-3 text-blue-500" />
                        {agent.phone}
                      </div>
                      {agent.vehicleType && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                          <Truck className="w-3 h-3 text-purple-500" />
                          {VEHICLE_ICONS[agent.vehicleType]} {agent.vehiclePlate}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className={cn(
                  'flex gap-3',
                  view === 'grid' ? 'mt-3 pt-3 border-t border-gray-100 dark:border-gray-800' : 'ml-auto flex-shrink-0'
                )}>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{agent.completedInterventions}</p>
                    <p className="text-xs text-gray-500">Terminées</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{agent.activeInterventions}</p>
                    <p className="text-xs text-gray-500">En cours</p>
                  </div>
                  {agent.rating && (
                    <div className="text-center">
                      <div className="flex items-center gap-0.5 justify-center">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{agent.rating}</p>
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      </div>
                      <p className="text-xs text-gray-500">Note</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <div className="text-5xl mb-3">👷</div>
            <p className="text-gray-500 dark:text-gray-400">Aucun agent trouvé</p>
          </div>
        </Card>
      )}
    </div>
  );
}
