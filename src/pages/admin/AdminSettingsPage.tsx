import { useState } from 'react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { Avatar } from '../../components/ui/Avatar';
import { Save, Bell, Shield, Globe, Database, Palette } from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

export function AdminSettingsPage() {
  const { user } = useAuthStore();
  const { theme, setTheme } = useAppStore();
  const [activeSection, setActiveSection] = useState('profile');

  const SECTIONS = [
    { id: 'profile', label: 'Profil', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'system', label: 'Système', icon: '⚙️' },
    { id: 'security', label: 'Sécurité', icon: '🔐' },
    { id: 'appearance', label: 'Apparence', icon: '🎨' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <Card padding="sm" className="lg:col-span-1 h-fit">
        <nav className="space-y-1">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                activeSection === s.id
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              )}
            >
              <span className="text-base">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </nav>
      </Card>

      {/* Content */}
      <div className="lg:col-span-3 space-y-4">
        {activeSection === 'profile' && (
          <Card>
            <CardHeader title="Informations du Profil" subtitle="Gérez vos informations personnelles" />
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                <Avatar src={user?.avatar} name={user?.fullName || ''} size="2xl" />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{user?.fullName}</p>
                  <p className="text-sm text-gray-500">{user?.role}</p>
                  <Button size="xs" variant="outline" className="mt-2">Changer la photo</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Prénom" defaultValue={user?.firstName} />
                <Input label="Nom" defaultValue={user?.lastName} />
                <Input label="Email" type="email" defaultValue={user?.email} />
                <Input label="Téléphone" defaultValue={user?.phone} />
              </div>
              <Button leftIcon={<Save className="w-4 h-4" />} onClick={() => toast.success('Profil sauvegardé!')}>
                Sauvegarder
              </Button>
            </div>
          </Card>
        )}

        {activeSection === 'notifications' && (
          <Card>
            <CardHeader title="Paramètres de Notifications" subtitle="Configurez vos alertes" />
            <div className="space-y-4">
              {[
                { label: 'Nouveaux signalements', desc: 'Notifier lors d\'un nouveau signalement', enabled: true },
                { label: 'Interventions assignées', desc: 'Notifier lors d\'une nouvelle assignation', enabled: true },
                { label: 'Signalements résolus', desc: 'Notifier quand un signalement est résolu', enabled: true },
                { label: 'Alertes critiques', desc: 'Alertes pour les signalements critiques', enabled: true },
                { label: 'Rapports hebdomadaires', desc: 'Résumé hebdomadaire par email', enabled: false },
                { label: 'Notifications push', desc: 'Notifications push sur mobile', enabled: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeSection === 'system' && (
          <Card>
            <CardHeader title="Paramètres Système" subtitle="Configuration de la plateforme AMOGED-D4" />
            <div className="space-y-4">
              <Select
                label="Langue par défaut"
                options={[{ value: 'fr', label: '🇫🇷 Français' }, { value: 'en', label: '🇬🇧 English' }]}
                defaultValue="fr"
              />
              <Input label="Nombre maximum de photos par signalement" type="number" defaultValue="3" />
              <Input label="Délai d'escalade (heures)" type="number" defaultValue="24" />
              <Input label="Contact urgence mairie" defaultValue="+237 233 422 000" />
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Mode Maintenance</p>
                  <p className="text-xs text-gray-500">Désactiver temporairement l'accès public</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                </label>
              </div>
              <Button leftIcon={<Save className="w-4 h-4" />} onClick={() => toast.success('Paramètres sauvegardés!')}>
                Sauvegarder les paramètres
              </Button>
            </div>
          </Card>
        )}

        {activeSection === 'appearance' && (
          <Card>
            <CardHeader title="Apparence" subtitle="Personnalisez l'interface" />
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Thème</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: '☀️ Clair' },
                    { value: 'dark', label: '🌙 Sombre' },
                    { value: 'system', label: '💻 Système' },
                  ].map(t => (
                    <button
                      key={t.value}
                      onClick={() => setTheme(t.value as 'light' | 'dark' | 'system')}
                      className={cn(
                        'p-4 rounded-2xl border-2 text-center transition-all',
                        theme === t.value
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      )}
                    >
                      <span className="text-2xl block mb-1">{t.label.split(' ')[0]}</span>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{t.label.split(' ')[1]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeSection === 'security' && (
          <Card>
            <CardHeader title="Sécurité" subtitle="Gérez la sécurité de votre compte" />
            <div className="space-y-4">
              <Input label="Mot de passe actuel" type="password" placeholder="••••••••" />
              <Input label="Nouveau mot de passe" type="password" placeholder="••••••••" />
              <Input label="Confirmer le nouveau mot de passe" type="password" placeholder="••••••••" />
              <Button leftIcon={<Shield className="w-4 h-4" />} onClick={() => toast.success('Mot de passe modifié!')}>
                Modifier le mot de passe
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
