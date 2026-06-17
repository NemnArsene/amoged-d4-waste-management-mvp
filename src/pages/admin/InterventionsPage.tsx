import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar, AvatarGroup } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { MOCK_INTERVENTIONS, MOCK_AGENTS, ZONES_DATA } from '../../data/mockData';
import type { Intervention } from '../../types';
import { Search, Plus, MapPin, Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '../../utils/cn';

const STATUS_CONFIG = {
  PENDING: { label: 'En Attente', bg: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
  IN_PROGRESS: { label: 'En Cours', bg: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500 animate-pulse' },
  COMPLETED: { label: 'Terminée', bg: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  CANCELLED: { label: 'Annulée', bg: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' },
};

const PRIORITY_COLORS = {
  LOW: 'border-l-gray-300', MEDIUM: 'border-l-amber-400',
  HIGH: 'border-l-orange-500', CRITICAL: 'border-l-red-500',
};

export function InterventionsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedInt, setSelectedInt] = useState<Intervention | null>(null);
  const [interventions, setInterventions] = useState(MOCK_INTERVENTIONS);

  const filtered = interventions.filter(i => {
    const matchSearch = !search || i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.referenceNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const completeIntervention = (id: string) => {
    setInterventions(prev => prev.map(i =>
      i.id === id ? { ...i, status: 'COMPLETED' as const, completedAt: new Date().toISOString() } : i
    ));
    setSelectedInt(null);
  };

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
          const count = interventions.filter(i => i.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
              className={cn(
                'rounded-2xl p-4 text-left border-2 transition-all bg-white dark:bg-gray-900',
                statusFilter === status ? 'border-emerald-500' : 'border-transparent'
              )}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className={cn('w-2 h-2 rounded-full', cfg.dot)} />
                <span className="text-xs text-gray-500">{cfg.label}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Rechercher une intervention..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <Select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'Tous les statuts' },
              { value: 'PENDING', label: '⏳ En Attente' },
              { value: 'IN_PROGRESS', label: '🔄 En Cours' },
              { value: 'COMPLETED', label: '✅ Terminée' },
              { value: 'CANCELLED', label: '❌ Annulée' },
            ]}
            className="w-full md:w-44"
          />
          <Button leftIcon={<Plus className="w-4 h-4" />} size="sm">
            Créer Intervention
          </Button>
        </div>
      </Card>

      {/* Interventions list */}
      <div className="space-y-3">
        {filtered.slice(0, 30).map(intervention => {
          const statusCfg = STATUS_CONFIG[intervention.status];
          const agents = MOCK_AGENTS.filter(a => intervention.assignedAgentIds.includes(a.id));

          return (
            <Card
              key={intervention.id}
              hover
              onClick={() => setSelectedInt(intervention)}
              className={cn('border-l-4', PRIORITY_COLORS[intervention.priority])}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">{intervention.referenceNumber}</span>
                    <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full', statusCfg.bg)}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', statusCfg.dot)} />
                      {statusCfg.label}
                    </span>
                    {intervention.priority === 'CRITICAL' && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">🚨 Critique</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{intervention.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{intervention.description}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ZONES_DATA[intervention.zone].name}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(intervention.scheduledAt), 'dd MMM à HH:mm', { locale: fr })}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />~{intervention.estimatedDuration} min</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{agents.length} agents</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <AvatarGroup
                    users={agents.map(a => ({ name: a.fullName, avatar: a.avatar }))}
                    size="xs"
                    max={3}
                  />
                  {intervention.status === 'IN_PROGRESS' && (
                    <Button
                      size="xs"
                      variant="success"
                      onClick={(e) => { e.stopPropagation(); completeIntervention(intervention.id); }}
                      leftIcon={<CheckCircle className="w-3 h-3" />}
                    >
                      Terminer
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Detail modal */}
      <Modal
        isOpen={!!selectedInt}
        onClose={() => setSelectedInt(null)}
        title={selectedInt?.title}
        subtitle={selectedInt?.referenceNumber}
        size="lg"
      >
        {selectedInt && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Statut</p>
                <span className={cn('inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full', STATUS_CONFIG[selectedInt.status].bg)}>
                  {STATUS_CONFIG[selectedInt.status].label}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Zone</p>
                <p className="font-medium text-sm flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-500" />{ZONES_DATA[selectedInt.zone].name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Planifié le</p>
                <p className="font-medium text-sm">{format(new Date(selectedInt.scheduledAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Durée estimée</p>
                <p className="font-medium text-sm">{selectedInt.estimatedDuration} minutes</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Description</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selectedInt.description}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">Agents assignés ({selectedInt.assignedAgentIds.length})</p>
              <div className="space-y-2">
                {MOCK_AGENTS.filter(a => selectedInt.assignedAgentIds.includes(a.id)).map(agent => (
                  <div key={agent.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <Avatar src={agent.avatar} name={agent.fullName} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{agent.fullName}</p>
                      <p className="text-xs text-gray-500">{agent.agentId} • {ZONES_DATA[agent.assignedZone].name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">Équipement requis</p>
              <div className="flex flex-wrap gap-2">
                {selectedInt.equipment.map((eq, i) => (
                  <Badge key={i} variant="default">{eq}</Badge>
                ))}
              </div>
            </div>

            {selectedInt.status === 'IN_PROGRESS' && (
              <Button variant="success" fullWidth onClick={() => completeIntervention(selectedInt.id)} leftIcon={<CheckCircle className="w-4 h-4" />}>
                Marquer comme Terminée
              </Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
