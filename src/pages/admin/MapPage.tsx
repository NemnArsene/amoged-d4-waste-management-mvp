import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, ZoomControl } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Card } from '../../components/ui/Card';
import { Badge, StatusBadge, UrgencyBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Input';
import { MOCK_REPORTS, MOCK_AGENTS, CATEGORY_LABELS, ZONES_DATA, STATUS_LABELS } from '../../data/mockData';
import type { Report } from '../../types';
import { MapPin, Layers, Filter } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAppStore } from '../../store/useAppStore';

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',
  ASSIGNED: '#3b82f6',
  IN_PROGRESS: '#8b5cf6',
  RESOLVED: '#059669',
  REJECTED: '#ef4444',
  CANCELLED: '#6b7280',
};

const URGENCY_RADIUS: Record<string, number> = {
  LOW: 8, MEDIUM: 10, HIGH: 13, CRITICAL: 16,
};

export function MapPage() {
  const { theme } = useAppStore();
  const [statusFilter, setStatusFilter] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');
  const [selected, setSelected] = useState<Report | null>(null);
  const [showAgents, setShowAgents] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const filtered = MOCK_REPORTS.filter(r => {
    const matchStatus = !statusFilter || r.status === statusFilter;
    const matchZone = !zoneFilter || r.location.zone === zoneFilter;
    return matchStatus && matchZone;
  });

  const counts = {
    pending: MOCK_REPORTS.filter(r => r.status === 'PENDING').length,
    inProgress: MOCK_REPORTS.filter(r => r.status === 'IN_PROGRESS').length,
    resolved: MOCK_REPORTS.filter(r => r.status === 'RESOLVED').length,
  };

  useEffect(() => {
    const timer = setTimeout(() => setMapReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-4 h-full">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'En Attente', count: counts.pending, color: 'bg-amber-500' },
          { label: 'En Cours', count: counts.inProgress, color: 'bg-purple-500' },
          { label: 'Résolus', count: counts.resolved, color: 'bg-emerald-500' },
          { label: 'Total', count: MOCK_REPORTS.length, color: 'bg-blue-500' },
        ].map(item => (
          <Card key={item.label} padding="sm" className="text-center">
            <div className={cn('w-2 h-2 rounded-full mx-auto mb-1.5', item.color)} />
            <p className="text-xl font-bold text-gray-900 dark:text-white">{item.count}</p>
            <p className="text-xs text-gray-500">{item.label}</p>
          </Card>
        ))}
      </div>

      {/* Map + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}>
        {/* Map */}
        <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 relative">
          {/* Map controls overlay */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
            <Select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'Tous statuts' },
                { value: 'PENDING', label: 'En Attente' },
                { value: 'IN_PROGRESS', label: 'En Cours' },
                { value: 'RESOLVED', label: 'Résolus' },
              ]}
              className="bg-white/95 dark:bg-gray-900/95 text-xs shadow-lg w-36"
            />
            <Select
              value={zoneFilter}
              onChange={e => setZoneFilter(e.target.value)}
              options={[
                { value: '', label: 'Toutes zones' },
                ...Object.entries(ZONES_DATA).map(([k, v]) => ({ value: k, label: v.name }))
              ]}
              className="bg-white/95 dark:bg-gray-900/95 text-xs shadow-lg w-36"
            />
          </div>

          {/* Agents toggle */}
          <div className="absolute top-3 right-3 z-20">
            <button
              onClick={() => setShowAgents(!showAgents)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium shadow-lg transition-all',
                showAgents
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/95 dark:bg-gray-900/95 text-gray-700 dark:text-gray-300'
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              Agents
            </button>
          </div>

          {/* Count overlay */}
          <div className="absolute bottom-3 left-3 z-20 bg-white/95 dark:bg-gray-900/95 rounded-xl px-3 py-2 shadow-lg">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
              <MapPin className="w-3 h-3 inline mr-1 text-emerald-500" />
              {filtered.length} points affichés
            </p>
          </div>

          {mapReady && (
            <MapContainer
              center={[4.0522, 9.6817]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
              scrollWheelZoom={true}
              doubleClickZoom={true}
              className={theme === 'dark' ? 'leaflet-dark' : ''}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ZoomControl position="bottomright" />

              {/* Report markers */}
              {filtered.slice(0, 200).map(report => (
                <CircleMarker
                  key={report.id}
                  center={[report.location.lat, report.location.lng]}
                  radius={URGENCY_RADIUS[report.urgency]}
                  fillColor={STATUS_COLORS[report.status]}
                  color="white"
                  weight={2}
                  fillOpacity={0.85}
                  eventHandlers={{ click: () => setSelected(report) }}
                >
                  <Popup>
                    <div className="p-1 min-w-[180px]">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-base">{CATEGORY_LABELS[report.category].icon}</span>
                        <span className="font-semibold text-xs">{report.title}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{report.referenceNumber}</p>
                      <p className="text-xs text-gray-600 mb-2">{report.location.address}</p>
                      <div className="flex gap-1">
                        <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: STATUS_COLORS[report.status] + '30', color: STATUS_COLORS[report.status] }}>
                          {STATUS_LABELS[report.status].label}
                        </span>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

              {/* Agent markers */}
              {showAgents && MOCK_AGENTS.filter(a => a.status === 'ON_MISSION').map(agent => {
                const zone = ZONES_DATA[agent.assignedZone];
                return (
                  <CircleMarker
                    key={agent.id}
                    center={[zone.center[0] + (Math.random() - 0.5) * 0.01, zone.center[1] + (Math.random() - 0.5) * 0.01]}
                    radius={10}
                    fillColor="#3b82f6"
                    color="white"
                    weight={2.5}
                    fillOpacity={0.9}
                  >
                    <Popup>
                      <div className="p-1">
                        <p className="font-semibold text-xs">👷 {agent.fullName}</p>
                        <p className="text-xs text-gray-500">{zone.name}</p>
                        <p className="text-xs text-blue-600 font-medium">En mission</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          )}
        </div>

        {/* Sidebar */}
        <div className="overflow-y-auto space-y-3">
          <Card padding="sm">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Légende</h3>
            <div className="space-y-2">
              {Object.entries(STATUS_LABELS).map(([status, info]) => (
                <div key={status} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: STATUS_COLORS[status] }} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{info.label}</span>
                  <span className="text-xs font-bold text-gray-900 dark:text-white ml-auto">
                    {MOCK_REPORTS.filter(r => r.status === status).length}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent alerts */}
          <Card padding="sm">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              🚨 Alertes Critiques
            </h3>
            <div className="space-y-2">
              {MOCK_REPORTS.filter(r => r.urgency === 'CRITICAL' && r.status === 'PENDING').slice(0, 5).map(r => (
                <div
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                >
                  <p className="text-xs font-semibold text-red-800 dark:text-red-300 truncate">{r.title}</p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">{r.location.district}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Selected report */}
          {selected && (
            <Card padding="sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Détails</h3>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-xl">{CATEGORY_LABELS[selected.category].icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{selected.title}</p>
                    <p className="text-xs text-gray-500 font-mono">{selected.referenceNumber}</p>
                  </div>
                </div>
                <StatusBadge status={selected.status} />
                <UrgencyBadge urgency={selected.urgency} />
                <p className="text-xs text-gray-600 dark:text-gray-400">{selected.location.address}</p>
                <p className="text-xs text-gray-500">{selected.citizenName} • {new Date(selected.createdAt).toLocaleDateString('fr-FR')}</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
