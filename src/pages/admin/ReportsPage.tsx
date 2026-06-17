import { useState, useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Badge, StatusBadge, UrgencyBadge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  MOCK_REPORTS, MOCK_AGENTS, CATEGORY_LABELS, ZONES_DATA, STATUS_LABELS
} from '../../data/mockData';
import type { Report, ReportStatus, WasteCategory, CollectionZone } from '../../types';
import {
  Search, Filter, Eye, UserCheck, MapPin, Calendar,
  Download, RefreshCw, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'PENDING', label: '⏳ En Attente' },
  { value: 'ASSIGNED', label: '📌 Assigné' },
  { value: 'IN_PROGRESS', label: '🔄 En Cours' },
  { value: 'RESOLVED', label: '✅ Résolu' },
  { value: 'REJECTED', label: '❌ Rejeté' },
];

const ZONE_OPTIONS = [
  { value: '', label: 'Toutes les zones' },
  ...Object.entries(ZONES_DATA).map(([key, val]) => ({ value: key, label: val.name })),
];

const CATEGORY_OPTIONS = [
  { value: '', label: 'Toutes les catégories' },
  ...Object.entries(CATEGORY_LABELS).map(([key, val]) => ({ value: key, label: `${val.icon} ${val.label}` })),
];

const PAGE_SIZE = 15;

export function ReportsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [assignModal, setAssignModal] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [reports, setReports] = useState(MOCK_REPORTS);

  const filtered = useMemo(() => {
    return reports.filter(r => {
      const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.referenceNumber.toLowerCase().includes(search.toLowerCase()) ||
        r.citizenName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || r.status === statusFilter;
      const matchZone = !zoneFilter || r.location.zone === zoneFilter;
      const matchCat = !categoryFilter || r.category === categoryFilter;
      return matchSearch && matchStatus && matchZone && matchCat;
    });
  }, [reports, search, statusFilter, zoneFilter, categoryFilter]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const handleAssign = () => {
    if (!selectedReport || !selectedAgentId) return;
    const agent = MOCK_AGENTS.find(a => a.id === selectedAgentId);
    setReports(prev => prev.map(r =>
      r.id === selectedReport.id
        ? { ...r, status: 'ASSIGNED' as ReportStatus, assignedAgentId: agent?.id, assignedAgentName: agent?.fullName }
        : r
    ));
    setAssignModal(false);
    setSelectedReport(null);
    toast.success(`Signalement assigné à ${agent?.fullName}`);
  };

  const handleStatusChange = (reportId: string, status: ReportStatus) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status } : r));
    toast.success('Statut mis à jour');
  };

  return (
    <div className="space-y-4">
      {/* Stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(STATUS_LABELS).map(([status, info]) => {
          const count = reports.filter(r => r.status === status).length;
          return (
            <button
              key={status}
              onClick={() => { setStatusFilter(statusFilter === status ? '' : status); setPage(1); }}
              className={cn(
                'rounded-2xl p-3 text-left transition-all border-2',
                statusFilter === status
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'bg-white dark:bg-gray-900 border-transparent'
              )}
            >
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{info.label}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Rechercher par titre, référence, citoyen..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <Select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            options={STATUS_OPTIONS}
            className="w-full md:w-44"
          />
          <Select
            value={zoneFilter}
            onChange={e => { setZoneFilter(e.target.value); setPage(1); }}
            options={ZONE_OPTIONS}
            className="w-full md:w-44"
          />
          <Select
            value={categoryFilter}
            onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
            options={CATEGORY_OPTIONS}
            className="w-full md:w-48"
          />
          <Button variant="outline" size="md" onClick={() => { setSearch(''); setStatusFilter(''); setZoneFilter(''); setCategoryFilter(''); }}>
            <X className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="md" leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
        </div>
      </Card>

      {/* Results info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">{filtered.length}</span> signalements trouvés
        </p>
        <Button size="sm" variant="ghost" leftIcon={<RefreshCw className="w-4 h-4" />}>
          Actualiser
        </Button>
      </div>

      {/* Table */}
      <Card padding="none" className="overflow-hidden">
        {paginated.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="Aucun signalement trouvé"
            description="Modifiez vos filtres de recherche"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  {['Référence', 'Titre', 'Catégorie', 'Urgence', 'Zone', 'Citoyen', 'Assigné à', 'Statut', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {paginated.map(report => (
                  <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
                        {report.referenceNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{CATEGORY_LABELS[report.category].icon}</span>
                        <span className="font-medium text-gray-900 dark:text-white truncate text-xs">{report.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="default" size="sm">{CATEGORY_LABELS[report.category].label.split(' ').slice(0, 2).join(' ')}</Badge>
                    </td>
                    <td className="px-4 py-3"><UrgencyBadge urgency={report.urgency} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                        <MapPin className="w-3 h-3" />
                        {report.location.district}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Avatar name={report.citizenName} size="xs" />
                        <span className="text-xs text-gray-700 dark:text-gray-300 truncate max-w-[80px]">{report.citizenName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {report.assignedAgentName
                        ? <span className="text-xs text-gray-700 dark:text-gray-300 truncate max-w-[80px] block">{report.assignedAgentName}</span>
                        : <span className="text-xs text-gray-400 italic">Non assigné</span>
                      }
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={report.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(report.createdAt), 'dd MMM', { locale: fr })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {report.status === 'PENDING' && (
                          <button
                            onClick={() => { setSelectedReport(report); setAssignModal(true); }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
                            title="Assigner agent"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500">
              Page {page} sur {totalPages} ({filtered.length} résultats)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = page <= 3 ? i + 1 : page + i - 2;
                if (p < 1 || p > totalPages) return null;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      'w-8 h-8 rounded-lg text-xs font-medium transition-all',
                      p === page
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedReport && !assignModal}
        onClose={() => setSelectedReport(null)}
        title={selectedReport?.title}
        subtitle={selectedReport?.referenceNumber}
        size="lg"
      >
        {selectedReport && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Statut</p>
                <StatusBadge status={selectedReport.status} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Urgence</p>
                <UrgencyBadge urgency={selectedReport.urgency} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Catégorie</p>
                <p className="text-sm font-medium">{CATEGORY_LABELS[selectedReport.category].icon} {CATEGORY_LABELS[selectedReport.category].label}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Zone</p>
                <p className="text-sm font-medium flex items-center gap-1"><MapPin className="w-3 h-3" /> {selectedReport.location.district}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Adresse</p>
              <p className="text-sm text-gray-900 dark:text-white">{selectedReport.location.address}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Description</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selectedReport.description}</p>
            </div>

            {selectedReport.photos.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Photos ({selectedReport.photos.length})</p>
                <div className="grid grid-cols-3 gap-2">
                  {selectedReport.photos.map((photo, i) => (
                    <img key={i} src={photo} alt={`Photo ${i+1}`} className="w-full h-24 object-cover rounded-xl" />
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs text-gray-500 mb-2">Timeline</p>
              <div className="space-y-3">
                {selectedReport.timeline.map((event, i) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                      {i < selectedReport.timeline.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 mt-1" />
                      )}
                    </div>
                    <div className="pb-3 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{event.message}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {event.author} • {format(new Date(event.timestamp), 'dd MMM yyyy à HH:mm', { locale: fr })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedReport.status === 'PENDING' && (
              <div className="flex gap-3 pt-2">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => setAssignModal(true)}
                  leftIcon={<UserCheck className="w-4 h-4" />}
                >
                  Assigner un Agent
                </Button>
                <Button
                  variant="danger"
                  onClick={() => { handleStatusChange(selectedReport.id, 'REJECTED'); setSelectedReport(null); }}
                >
                  Rejeter
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Assign Modal */}
      <Modal
        isOpen={assignModal}
        onClose={() => { setAssignModal(false); setSelectedReport(null); }}
        title="Assigner un Agent"
        subtitle={`Signalement: ${selectedReport?.referenceNumber}`}
        size="sm"
      >
        <div className="space-y-4">
          <Select
            label="Choisir un agent"
            value={selectedAgentId}
            onChange={e => setSelectedAgentId(e.target.value)}
            options={MOCK_AGENTS.filter(a => a.isActive).map(a => ({
              value: a.id,
              label: `${a.fullName} — ${ZONES_DATA[a.assignedZone].name} (${a.activeInterventions} interventions)`
            }))}
            placeholder="Sélectionner un agent"
          />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" fullWidth onClick={() => setAssignModal(false)}>Annuler</Button>
            <Button variant="primary" fullWidth onClick={handleAssign} disabled={!selectedAgentId}>
              Confirmer l'Assignation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
