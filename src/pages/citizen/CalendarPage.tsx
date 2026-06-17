import { useState } from 'react';
import { MOCK_SCHEDULES, ZONES_DATA } from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuthStore } from '../../store/useAuthStore';
import { Calendar, Clock, MapPin, Users, ChevronRight, Bell } from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '../../utils/cn';

const DAY_NAMES = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const FREQ_LABELS = {
  DAILY: { label: 'Quotidien', color: 'success' as const },
  TWICE_WEEKLY: { label: '2x/Semaine', color: 'info' as const },
  WEEKLY: { label: 'Hebdomadaire', color: 'warning' as const },
  BI_WEEKLY: { label: '2x/Mois', color: 'default' as const },
};

export function CalendarPage() {
  const { user } = useAuthStore();
  const [selectedSchedule, setSelectedSchedule] = useState(MOCK_SCHEDULES[0]);
  const today = new Date();

  // My zone schedule
  const myZoneSchedule = user?.zone
    ? MOCK_SCHEDULES.find(s => s.zone === user.zone)
    : MOCK_SCHEDULES[0];

  // Generate upcoming collections (next 14 days)
  const upcomingCollections = MOCK_SCHEDULES.flatMap(schedule =>
    Array.from({ length: 14 }, (_, i) => addDays(today, i)).filter(date =>
      schedule.dayOfWeek.includes(date.getDay())
    ).map(date => ({ schedule, date }))
  ).sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 10);

  // Mini calendar
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const calendarDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getCollectionsForDay = (date: Date) => {
    return MOCK_SCHEDULES.filter(s => s.dayOfWeek.includes(date.getDay()));
  };

  return (
    <div className="px-4 pt-4 pb-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">📅 Calendrier de Collecte</h2>
        <p className="text-xs text-gray-500">{format(today, 'MMMM yyyy', { locale: fr })}</p>
      </div>

      {/* My zone highlight */}
      {myZoneSchedule && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 text-white">
          <div className="flex items-start gap-3">
            <div className="text-3xl">🏠</div>
            <div className="flex-1">
              <p className="text-white/80 text-xs mb-0.5">Votre quartier</p>
              <h3 className="font-bold text-base">{ZONES_DATA[myZoneSchedule.zone].name}</h3>
              <div className="flex items-center gap-1.5 mt-1.5 text-white/80 text-xs">
                <Clock className="w-3 h-3" />
                {myZoneSchedule.startTime} – {myZoneSchedule.endTime}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {myZoneSchedule.dayOfWeek.map(d => (
                  <span key={d} className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-lg font-medium">
                    {DAY_NAMES[d]}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/70">Prochaine collecte</p>
              <p className="text-sm font-bold">
                {format(new Date(myZoneSchedule.nextCollection), 'dd MMM', { locale: fr })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mini week calendar */}
      <Card padding="sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Cette Semaine</h3>
          <p className="text-xs text-gray-500">{format(weekStart, 'dd MMM', { locale: fr })} – {format(addDays(weekStart, 6), 'dd MMM', { locale: fr })}</p>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, i) => {
            const collections = getCollectionsForDay(date);
            const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
            const isMyZone = collections.some(c => c.zone === user?.zone);

            return (
              <div key={i} className={cn(
                'flex flex-col items-center p-1.5 rounded-xl',
                isToday && 'bg-emerald-100 dark:bg-emerald-900/30',
              )}>
                <span className="text-xs text-gray-400 mb-1">{DAY_NAMES[date.getDay()]}</span>
                <span className={cn(
                  'text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full',
                  isToday ? 'bg-emerald-500 text-white' : 'text-gray-900 dark:text-white'
                )}>
                  {format(date, 'd')}
                </span>
                {collections.length > 0 && (
                  <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                    {collections.slice(0, 3).map((c, j) => (
                      <span
                        key={j}
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          c.zone === user?.zone ? 'bg-emerald-500' : 'bg-blue-300'
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Mon quartier
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-300" />
            Autres zones
          </div>
        </div>
      </Card>

      {/* Upcoming collections */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          🚛 Prochaines Collectes
        </h3>
        <div className="space-y-2.5">
          {upcomingCollections.slice(0, 8).map((item, i) => {
            const isMyZone = item.schedule.zone === user?.zone;
            const isToday = format(item.date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

            return (
              <div
                key={`${item.schedule.id}-${i}`}
                onClick={() => setSelectedSchedule(item.schedule)}
                className={cn(
                  'flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all',
                  isMyZone
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300',
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0',
                  isToday ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-800'
                )}>
                  🚛
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {ZONES_DATA[item.schedule.zone].name}
                    </p>
                    {isMyZone && <Badge variant="success" size="sm">Mon quartier</Badge>}
                    {isToday && <Badge variant="warning" size="sm">Aujourd'hui</Badge>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(item.date, 'EEEE dd MMM', { locale: fr })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.schedule.startTime}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
              </div>
            );
          })}
        </div>
      </div>

      {/* All zones schedule */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">📋 Planning Complet</h3>
        <div className="space-y-2">
          {MOCK_SCHEDULES.map(schedule => (
            <Card
              key={schedule.id}
              padding="sm"
              hover
              onClick={() => setSelectedSchedule(schedule)}
              className={cn(
                'transition-all',
                selectedSchedule?.id === schedule.id && 'ring-2 ring-emerald-500'
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: ZONES_DATA[schedule.zone].color + '20' }}
                >
                  🗺️
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{schedule.zoneName}</h4>
                    <Badge variant={FREQ_LABELS[schedule.frequency].color} size="sm">
                      {FREQ_LABELS[schedule.frequency].label}
                    </Badge>
                    {schedule.zone === user?.zone && <Badge variant="success" size="sm">Ma zone</Badge>}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-1.5">
                    {schedule.dayOfWeek.map(d => (
                      <span key={d} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-0.5 rounded-lg">
                        {DAY_NAMES[d]}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{schedule.startTime}–{schedule.endTime}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{schedule.coverageArea.split(',')[0]}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Reminder tip */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border border-amber-200/50 dark:border-amber-800/30">
        <div className="flex items-start gap-3">
          <Bell className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Astuce</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5 leading-relaxed">
              Préparez vos poubelles la veille du passage du camion. Sortez-les avant {myZoneSchedule?.startTime || '7h00'} le jour de la collecte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
