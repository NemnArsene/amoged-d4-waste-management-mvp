import { useState } from 'react';
import { useReportStore } from '../../store/useReportStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge, UrgencyBadge } from '../../components/ui/Badge';
import { Input, Textarea } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Camera, MapPin, CheckCircle, Navigation } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';
import type { Report } from '../../types';

export function AgentMissionsPage() {
  const { user } = useAuthStore();
  const { reports, resolveReport } = useReportStore();
  const { addNotification } = useAppStore();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<string>('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const myMissions = reports.filter(r => r.assignedAgentId === user.id);
  const activeMissions = myMissions.filter(r => ['ASSIGNED', 'IN_PROGRESS'].includes(r.status));
  const completedMissions = myMissions.filter(r => r.status === 'RESOLVED');

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast.success('Localisation récupérée');
        },
        () => toast.error('Erreur de localisation')
      );
    } else {
      toast.error('Géolocalisation non supportée');
    }
  };

  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResolve = async () => {
    if (!selectedReport || !note) return;
    setIsSubmitting(true);

    // Simulate network delay
    await new Promise(r => setTimeout(r, 1000));

    resolveReport(selectedReport.id, user.id, user.fullName, note, photo, location || undefined);

    addNotification({
      userId: selectedReport.citizenId,
      type: 'REPORT_RESOLVED',
      title: 'Signalement Traité ! ✅',
      message: `Votre signalement "${selectedReport.title}" a été résolu. Merci !`,
      priority: 'NORMAL',
      isRead: false
    });

    toast.success('Mission terminée avec succès');
    setIsSubmitting(false);
    setSelectedReport(null);
    setNote('');
    setPhoto('');
    setLocation(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mes Missions</h2>
          <p className="text-sm text-gray-500">Gérez les signalements qui vous sont assignés</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card padding="sm" className="border-l-4 border-l-amber-500">
          <p className="text-sm text-gray-500">Missions Actives</p>
          <p className="text-2xl font-bold">{activeMissions.length}</p>
        </Card>
        <Card padding="sm" className="border-l-4 border-l-emerald-500">
          <p className="text-sm text-gray-500">Missions Terminées</p>
          <p className="text-2xl font-bold">{completedMissions.length}</p>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">Missions en cours</h3>
        {activeMissions.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-500">Aucune mission active pour le moment.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {activeMissions.map(report => (
              <Card key={report.id} hover className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-mono text-emerald-600">{report.referenceNumber}</span>
                    <StatusBadge status={report.status} />
                    <UrgencyBadge urgency={report.urgency} />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{report.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{report.location.address}</span>
                  </div>
                </div>
                <Button onClick={() => setSelectedReport(report)}>
                  Traiter
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selectedReport}
        onClose={() => {
          setSelectedReport(null);
          setNote('');
          setPhoto('');
          setLocation(null);
        }}
        title="Traitement de la mission"
        subtitle={selectedReport?.referenceNumber}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Preuve photo (optionnel)</label>
            {!photo ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Cliquez pour prendre une photo</p>
                </div>
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoAdd} />
              </label>
            ) : (
              <div className="relative rounded-xl overflow-hidden h-48">
                <img src={photo} alt="Preuve" className="w-full h-full object-cover" />
                <button
                  onClick={() => setPhoto('')}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm transition-colors"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Localisation GPS</label>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleGetLocation} leftIcon={<Navigation className="w-4 h-4" />}>
                {location ? 'Localisation OK' : 'Capturer ma position'}
              </Button>
            </div>
          </div>

          <Textarea
            label="Note d'intervention"
            placeholder="Décrivez l'intervention effectuée..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
            rows={3}
          />

          <Button
            fullWidth
            variant="success"
            leftIcon={<CheckCircle className="w-5 h-5" />}
            onClick={handleResolve}
            disabled={!note || isSubmitting}
            loading={isSubmitting}
          >
            Marquer comme Résolu
          </Button>
        </div>
      </Modal>
    </div>
  );
}
