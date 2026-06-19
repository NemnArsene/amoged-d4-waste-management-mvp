import { useState } from 'react';
import { CATEGORY_LABELS, STATUS_LABELS } from '../../data/mockData';
import { useAuthStore } from '../../store/useAuthStore';
import { useReportStore } from '../../store/useReportStore';
import { Card } from '../../components/ui/Card';
import { StatusBadge, UrgencyBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import type { Report } from '../../types';
import { MapPin, Calendar, Clock, Star, MessageSquare, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '../../utils/cn';

const STATUS_TABS = ['Tous', 'En Attente', 'En Cours', 'Résolus', 'Rejetés'];

export function MyReportsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('Tous');
  const [selected, setSelected] = useState<Report | null>(null);

  const { reports } = useReportStore();

  const myReports = reports.filter(r =>
    r.citizenId === user?.id || r.citizenId === 'citizen-001'
  );

  const filtered = myReports.filter(r => {
    if (activeTab === 'Tous') return true;
    if (activeTab === 'En Attente') return ['PENDING', 'ASSIGNED'].includes(r.status);
    if (activeTab === 'En Cours') return r.status === 'IN_PROGRESS';
    if (activeTab === 'Résolus') return r.status === 'RESOLVED';
    if (activeTab === 'Rejetés') return r.status === 'REJECTED';
    return true;
  });

  const getProgressPercent = (report: Report) => {
    const steps = { PENDING: 10, ASSIGNED: 35, IN_PROGRESS: 65, RESOLVED: 100, REJECTED: 0, CANCELLED: 0 };
    return steps[report.status] || 0;
  };

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Mes Signalements</h2>
        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full font-medium">
          {myReports.length} total
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {STATUS_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
              activeTab === tab
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Reports list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="📭"
          title="Aucun signalement"
          description="Vous n'avez pas encore de signalements dans cette catégorie."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(report => (
            <div
              key={report.id}
              onClick={() => setSelected(report)}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800 p-4 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl flex-shrink-0">
                  {CATEGORY_LABELS[report.category].icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                        {report.title}
                      </h3>
                      <p className="text-xs font-mono text-gray-400 mt-0.5">{report.referenceNumber}</p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end gap-1">
                      <StatusBadge status={report.status} />
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{report.location.district}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(report.createdAt), 'dd MMM', { locale: fr })}</span>
                  </div>

                  {/* Progress bar */}
                  {!['REJECTED', 'CANCELLED'].includes(report.status) && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progression</span>
                        <span>{getProgressPercent(report)}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            report.status === 'RESOLVED' ? 'bg-emerald-500' : 'bg-blue-500'
                          )}
                          style={{ width: `${getProgressPercent(report)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Rating for resolved */}
                  {report.status === 'RESOLVED' && (
                    <div className="mt-2 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={cn(
                            'w-3.5 h-3.5',
                            star <= (report.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                          )}
                        />
                      ))}
                      {report.rating && <span className="text-xs text-gray-500 ml-1">Note: {report.rating}/5</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title}
        subtitle={selected?.referenceNumber}
      >
        {selected && (
          <div className="space-y-5">
            {/* Status & Urgency */}
            <div className="flex gap-2">
              <StatusBadge status={selected.status} />
              <UrgencyBadge urgency={selected.urgency} />
            </div>

            {/* Photos */}
            {selected.photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {selected.photos.map((photo, i) => (
                  <img key={i} src={photo} alt="" className="w-full h-20 object-cover rounded-xl" />
                ))}
              </div>
            )}

            {/* Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span className="text-gray-700 dark:text-gray-300">{selected.location.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  Créé le {format(new Date(selected.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                </span>
              </div>
              {selected.assignedAgentName && (
                <div className="flex items-center gap-2 text-sm">
                  <MessageSquare className="w-4 h-4 text-purple-500" />
                  <span className="text-gray-700 dark:text-gray-300">Agent: {selected.assignedAgentName}</span>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{selected.description}</p>

            {/* Timeline */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">📋 Historique</h4>
              <div className="space-y-3">
                {selected.timeline.map((event, i) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                      {i < selected.timeline.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 mt-1 min-h-[16px]" />
                      )}
                    </div>
                    <div className="pb-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{event.message}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {event.author} • {format(new Date(event.timestamp), 'dd MMM à HH:mm', { locale: fr })}
                      </p>
                      {event.photo && (
                        <img src={event.photo} alt="Preuve" className="mt-2 h-16 rounded-lg object-cover" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resolution */}
            {selected.resolutionNote && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">✅ Note de résolution</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-300">{selected.resolutionNote}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
