import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { StatCard, Card, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import {
  MOCK_DASHBOARD_STATS, MOCK_REPORTS, MOCK_AGENTS,
  CATEGORY_LABELS, ZONES_DATA, STATUS_LABELS
} from '../../data/mockData';
import { useAuthStore } from '../../store/useAuthStore';
import {
  AlertTriangle, CheckCircle, Clock, TrendingUp,
  Users, Truck, Star, ArrowRight, RefreshCw
} from 'lucide-react';
import { cn } from '../../utils/cn';
import type { ReportStatus } from '../../types';

export function AdminDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const stats = MOCK_DASHBOARD_STATS;

  const recentReports = MOCK_REPORTS.slice(0, 8);

  // Chart data
  const trendData = stats.reportsTrend.slice(period === '7d' ? -7 : period === '30d' ? -30 : -90);

  const pieData = [
    { name: 'Résolu', value: stats.resolvedReports, color: '#059669' },
    { name: 'En cours', value: stats.inProgressReports, color: '#8b5cf6' },
    { name: 'En attente', value: stats.pendingReports, color: '#f59e0b' },
    { name: 'Rejeté', value: stats.rejectedReports, color: '#ef4444' },
  ];

  const categoryData = stats.reportsByCategory.slice(0, 6).map(item => ({
    name: CATEGORY_LABELS[item.category].label.split(' ').slice(0, 2).join(' '),
    value: item.count,
    color: CATEGORY_LABELS[item.category].color,
  }));

  const zoneData = stats.reportsByZone.map(item => ({
    name: ZONES_DATA[item.zone].name,
    signalements: item.count,
    color: ZONES_DATA[item.zone].color,
  }));

  const timeOfDay = new Date().getHours();
  const greeting = timeOfDay < 12 ? 'Bonjour' : timeOfDay < 18 ? 'Bon après-midi' : 'Bonsoir';

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 rounded-2xl p-5 md:p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-white/80 text-sm font-medium">{greeting},</p>
            <h2 className="text-xl md:text-2xl font-bold mt-0.5">{user?.firstName} {user?.lastName}</h2>
            <p className="text-white/70 text-sm mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
              {stats.todayReports} nouveaux signalements aujourd'hui
            </p>
          </div>
          <div className="text-right text-white/60 text-sm hidden md:block">
            <p className="font-medium text-white">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="mt-1">Taux de résolution: <span className="text-white font-bold">{stats.resolutionRate}%</span></p>
          </div>
        </div>
        <div className="relative mt-4 flex flex-wrap gap-2">
          {[
            { label: `${stats.activeAgents} agents actifs`, icon: '👷' },
            { label: `${stats.activeInterventions} interventions`, icon: '🚛' },
            { label: `${stats.citizenSatisfaction}/5 satisfaction`, icon: '⭐' },
          ].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs font-medium">
              {item.icon} {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          title="Total Signalements"
          value={stats.totalReports.toLocaleString()}
          subtitle="Depuis le début"
          icon={<AlertTriangle className="w-5 h-5" />}
          color="orange"
          trend={{ value: 12, label: 'vs mois dernier' }}
        />
        <StatCard
          title="Résolus"
          value={stats.resolvedReports.toLocaleString()}
          subtitle={`${stats.resolutionRate}% du total`}
          icon={<CheckCircle className="w-5 h-5" />}
          color="green"
          trend={{ value: 8, label: 'ce mois' }}
        />
        <StatCard
          title="En Attente"
          value={stats.pendingReports.toLocaleString()}
          subtitle="À traiter"
          icon={<Clock className="w-5 h-5" />}
          color="blue"
          trend={{ value: -5, label: 'vs hier' }}
        />
        <StatCard
          title="Délai Moyen"
          value={`${stats.averageResolutionTime}h`}
          subtitle="Résolution"
          icon={<TrendingUp className="w-5 h-5" />}
          color="purple"
          trend={{ value: -15, label: 'amélioration' }}
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Trend chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <CardHeader
              title="Évolution des Signalements"
              subtitle="Tendance temporelle"
              className="mb-0"
            />
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-0.5">
              {(['7d', '30d', '90d'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
                    period === p
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="count" stroke="#059669" fill="url(#colorReports)" strokeWidth={2.5} dot={false} name="Signalements" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie chart */}
        <Card>
          <CardHeader title="Répartition par Statut" subtitle="Vue globale" />
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{item.name}</span>
                <span className="text-xs font-bold text-gray-900 dark:text-white ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Zone chart */}
        <Card>
          <CardHeader title="Signalements par Zone" subtitle="Distribution géographique" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={zoneData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={80} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '11px' }} />
              <Bar dataKey="signalements" fill="#059669" radius={[0, 6, 6, 0]} name="Signalements">
                {zoneData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Category chart */}
        <Card>
          <CardHeader title="Par Catégorie" subtitle="Types de déchets signalés" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '11px' }} />
              <Bar dataKey="value" name="Signalements" radius={[6, 6, 0, 0]}>
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent reports */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <CardHeader title="Signalements Récents" subtitle="Dernières 24 heures" className="mb-0" />
            <Button size="sm" variant="ghost" onClick={() => navigate('/admin/reports')} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Voir tout
            </Button>
          </div>
          <div className="space-y-2">
            {recentReports.map(report => (
              <div
                key={report.id}
                onClick={() => navigate('/admin/reports')}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg flex-shrink-0">
                  {CATEGORY_LABELS[report.category].icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {report.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {report.location.district} • {new Date(report.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={
                    report.status === 'RESOLVED' ? 'success' :
                    report.status === 'IN_PROGRESS' ? 'purple' :
                    report.status === 'PENDING' ? 'warning' : 'danger'
                  } size="sm">
                    {STATUS_LABELS[report.status].label}
                  </Badge>
                  <span className="text-xs text-gray-400">{report.referenceNumber}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top agents */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardHeader title="Meilleurs Agents" subtitle="Ce mois" className="mb-0" />
            <Button size="sm" variant="ghost" onClick={() => navigate('/admin/agents')} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Voir
            </Button>
          </div>
          <div className="space-y-3">
            {MOCK_AGENTS.slice(0, 5).map((agent, i) => (
              <div key={agent.id} className="flex items-center gap-3">
                <div className={cn(
                  'w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0',
                  i === 0 ? 'bg-amber-100 text-amber-600' :
                  i === 1 ? 'bg-gray-100 text-gray-600' :
                  i === 2 ? 'bg-orange-100 text-orange-600' :
                  'bg-gray-50 text-gray-500'
                )}>
                  {i + 1}
                </div>
                <Avatar src={agent.avatar} name={agent.fullName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{agent.fullName}</p>
                  <p className="text-xs text-gray-500">{agent.completedInterventions} interventions</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{agent.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
