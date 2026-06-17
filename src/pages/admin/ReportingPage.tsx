import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import { Card, CardHeader, StatCard } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MOCK_DASHBOARD_STATS, CATEGORY_LABELS, ZONES_DATA } from '../../data/mockData';
import { Download, TrendingUp, TrendingDown, Activity, Clock } from 'lucide-react';

const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316', '#14b8a6', '#ec4899'];

export function ReportingPage() {
  const stats = MOCK_DASHBOARD_STATS;

  const kpiCards = [
    { title: 'Taux de Résolution', value: `${stats.resolutionRate}%`, trend: '+5.2%', positive: true, icon: <TrendingUp className="w-5 h-5" />, color: 'green' as const },
    { title: 'Délai Moyen', value: `${stats.averageResolutionTime}h`, trend: '-2.3h', positive: true, icon: <Clock className="w-5 h-5" />, color: 'blue' as const },
    { title: 'Satisfaction', value: `${stats.citizenSatisfaction}/5`, trend: '+0.3', positive: true, icon: <Activity className="w-5 h-5" />, color: 'purple' as const },
    { title: 'Signalements/Mois', value: stats.monthReports, trend: '+18%', positive: true, icon: <TrendingUp className="w-5 h-5" />, color: 'orange' as const },
  ];

  const combinedTrend = stats.reportsTrend.map((r, i) => ({
    date: r.date,
    signalements: r.count,
    interventions: stats.interventionsTrend[i]?.count || 0,
    resolus: Math.floor(r.count * 0.7),
  }));

  const zoneData = stats.reportsByZone.map(z => ({
    zone: ZONES_DATA[z.zone].name,
    value: z.count,
  }));

  const categoryData = stats.reportsByCategory.map(c => ({
    name: CATEGORY_LABELS[c.category].label.split(' ').slice(0, 2).join(' '),
    value: c.count,
    fullName: CATEGORY_LABELS[c.category].label,
    color: CATEGORY_LABELS[c.category].color,
  }));

  const radarData = [
    { metric: 'Réactivité', value: 82 },
    { metric: 'Résolution', value: 74 },
    { metric: 'Satisfaction', value: 84 },
    { metric: 'Couverture', value: 91 },
    { metric: 'Prévention', value: 65 },
    { metric: 'Collaboration', value: 78 },
  ];

  const weeklyData = [
    { day: 'Lun', reports: 23, resolved: 18 },
    { day: 'Mar', reports: 31, resolved: 25 },
    { day: 'Mer', reports: 28, resolved: 22 },
    { day: 'Jeu', reports: 19, resolved: 16 },
    { day: 'Ven', reports: 35, resolved: 28 },
    { day: 'Sam', reports: 42, resolved: 31 },
    { day: 'Dim', reports: 15, resolved: 12 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tableau de Reporting</h2>
          <p className="text-sm text-gray-500 mt-0.5">Analytics & Indicateurs de Performance — Douala 4ème</p>
        </div>
        <Button leftIcon={<Download className="w-4 h-4" />} variant="outline" size="sm">
          Exporter PDF
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(kpi => (
          <Card key={kpi.title}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{kpi.value}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <span className={kpi.positive ? 'text-emerald-600 text-xs font-semibold' : 'text-red-500 text-xs font-semibold'}>
                    {kpi.positive ? '↑' : '↓'} {kpi.trend}
                  </span>
                  <span className="text-xs text-gray-400">vs mois précédent</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                {kpi.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main trend chart */}
      <Card>
        <CardHeader
          title="Évolution Mensuelle"
          subtitle="Signalements, interventions et résolutions"
          action={
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-500 inline-block" />Signalements</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-500 inline-block" />Interventions</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-purple-500 inline-block" />Résolus</span>
            </div>
          }
        />
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={combinedTrend}>
            <defs>
              <linearGradient id="gr1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gr2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
            <Area type="monotone" dataKey="signalements" stroke="#059669" fill="url(#gr1)" strokeWidth={2} dot={false} name="Signalements" />
            <Area type="monotone" dataKey="interventions" stroke="#3b82f6" fill="url(#gr2)" strokeWidth={2} dot={false} name="Interventions" />
            <Area type="monotone" dataKey="resolus" stroke="#8b5cf6" fill="none" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Résolus" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly distribution */}
        <Card className="lg:col-span-2">
          <CardHeader title="Distribution Hebdomadaire" subtitle="Signalements par jour de la semaine" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px' }} />
              <Bar dataKey="reports" fill="#059669" radius={[4, 4, 0, 0]} name="Signalements" />
              <Bar dataKey="resolved" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Résolus" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Radar performance */}
        <Card>
          <CardHeader title="Performance Globale" subtitle="Indicateurs multi-dimensionnels" />
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
              <Radar name="Score" dataKey="value" stroke="#059669" fill="#059669" fillOpacity={0.3} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '11px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Zone breakdown */}
        <Card>
          <CardHeader title="Performance par Zone" subtitle="Signalements et capacité de traitement" />
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={zoneData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis dataKey="zone" type="category" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={85} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '11px' }} />
              <Bar dataKey="value" fill="#059669" radius={[0, 6, 6, 0]} name="Signalements">
                {zoneData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Category pie */}
        <Card>
          <CardHeader title="Répartition par Catégorie" subtitle="Types de déchets signalés" />
          <div className="flex items-start gap-4">
            <ResponsiveContainer width="60%" height={220}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} paddingAngle={2} dataKey="value">
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color || COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '11px' }} formatter={(v, n, p) => [v, p.payload.fullName]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5 overflow-auto max-h-52">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cat.color || COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-gray-600 dark:text-gray-400 flex-1 truncate">{cat.name}</span>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">{cat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Summary table */}
      <Card>
        <CardHeader title="Résumé par Zone" subtitle="Tableau récapitulatif des performances" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                {['Zone', 'Signalements', 'En cours', 'Résolus', 'Taux', 'Agents'].map(h => (
                  <th key={h} className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {stats.reportsByZone.map(({ zone, count }) => {
                const resolved = Math.floor(count * 0.7);
                const inProgress = Math.floor(count * 0.15);
                const rate = Math.round((resolved / count) * 100);
                return (
                  <tr key={zone} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="py-3 font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: ZONES_DATA[zone].color }} />
                      {ZONES_DATA[zone].name}
                    </td>
                    <td className="py-3 font-semibold">{count}</td>
                    <td className="py-3 text-purple-600">{inProgress}</td>
                    <td className="py-3 text-emerald-600 font-semibold">{resolved}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${rate}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{rate}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-400">
                      {Math.floor(count / 40) + 2}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
