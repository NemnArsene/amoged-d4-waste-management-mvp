import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import { Button } from '../../components/ui/Button';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { useAuthStore } from '../../store/useAuthStore';
import { CATEGORY_LABELS, ZONES_DATA } from '../../data/mockData';
import type { WasteCategory, UrgencyLevel, CollectionZone } from '../../types';
import { Camera, MapPin, AlertTriangle, ChevronLeft, Send, X, Navigation } from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

function LocationPicker({ onLocation }: { onLocation: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) { onLocation(e.latlng.lat, e.latlng.lng); }
  });
  return null;
}

const STEPS = ['Photo', 'Localisation', 'Détails', 'Confirmation'];

export function ReportForm() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [markerPos, setMarkerPos] = useState<LatLng | null>(null);
  const [form, setForm] = useState({
    title: '', description: '', category: '' as WasteCategory | '',
    urgency: 'MEDIUM' as UrgencyLevel, address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).slice(0, 3 - photos.length).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setPhotos(prev => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleMapClick = (lat: number, lng: number) => {
    setLocation({ lat, lng });
    setMarkerPos(new LatLng(lat, lng));
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) { toast.error('Géolocalisation non supportée'); return; }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        handleMapClick(latitude, longitude);
        toast.success('Localisation détectée!');
      },
      () => {
        // Demo fallback to Douala
        handleMapClick(4.0522, 9.6817);
        toast.success('Position simulée (Bonabéri, Douala)');
      }
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    toast.success('🎉 Signalement envoyé avec succès! Référence: RPT-2025-00501');
    navigate('/citizen/my-reports');
  };

  const canProceed = () => {
    if (step === 0) return photos.length > 0 || true; // Photos optionelles
    if (step === 1) return location !== null;
    if (step === 2) return form.title && form.category && form.description;
    return true;
  };

  const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(([key, val]) => ({
    value: key, label: `${val.icon} ${val.label}`
  }));

  const URGENCY_OPTIONS = [
    { value: 'LOW', label: '🟢 Faible — Pas d\'urgence immédiate' },
    { value: 'MEDIUM', label: '🟡 Moyen — À traiter rapidement' },
    { value: 'HIGH', label: '🟠 Élevé — Intervention urgente' },
    { value: 'CRITICAL', label: '🔴 Critique — Danger immédiat!' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => step === 0 ? navigate(-1) : setStep(s => s - 1)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex-1">
            <h2 className="font-bold text-gray-900 dark:text-white text-base">Nouveau Signalement</h2>
            <p className="text-xs text-gray-500">Étape {step + 1} sur {STEPS.length}: {STEPS[step]}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={cn(
                'flex-1 h-1.5 rounded-full transition-all',
                i < step ? 'bg-emerald-500' :
                i === step ? 'bg-emerald-300' : 'bg-gray-200 dark:bg-gray-700'
              )}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 overflow-y-auto pb-4">
        {/* Step 0: Photos */}
        {step === 0 && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center py-4">
              <div className="text-5xl mb-2">📸</div>
              <h3 className="font-bold text-gray-900 dark:text-white">Photographiez le problème</h3>
              <p className="text-sm text-gray-500 mt-1">Ajoutez jusqu'à 3 photos (optionnel mais recommandé)</p>
            </div>

            {/* Photo grid */}
            <div className="grid grid-cols-3 gap-3">
              {photos.map((photo, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden">
                  <img src={photo} alt={`Photo ${i+1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => setPhotos(prev => prev.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {photos.length < 3 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-emerald-400 hover:text-emerald-500 transition-all"
                >
                  <Camera className="w-6 h-6" />
                  <span className="text-xs font-medium">Ajouter</span>
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoAdd}
              style={{ display: 'none' }}
            />

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-xs text-blue-700 dark:text-blue-300">
              💡 Une bonne photo aide nos équipes à mieux comprendre la situation et accélérer l'intervention.
            </div>
          </div>
        )}

        {/* Step 1: Location */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center py-2">
              <div className="text-4xl mb-2">📍</div>
              <h3 className="font-bold text-gray-900 dark:text-white">Localisez l'incident</h3>
              <p className="text-sm text-gray-500 mt-1">Appuyez sur la carte ou utilisez votre position</p>
            </div>

            <Button
              fullWidth
              variant="outline"
              size="sm"
              leftIcon={<Navigation className="w-4 h-4" />}
              onClick={handleGeolocate}
            >
              Utiliser ma position actuelle
            </Button>

            <div className="h-64 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <MapContainer center={[4.0522, 9.6817]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker onLocation={handleMapClick} />
                {markerPos && <Marker position={markerPos} />}
              </MapContainer>
            </div>

            {location && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div className="text-xs text-emerald-700 dark:text-emerald-300">
                  <p className="font-semibold">Position sélectionnée</p>
                  <p>{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
                </div>
              </div>
            )}

            <Input
              label="Adresse précise (optionnel)"
              placeholder="Ex: Rue de la Liberté, Face au marché"
              value={form.address}
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              leftIcon={<MapPin className="w-4 h-4" />}
            />
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in pt-2">
            <Select
              label="Catégorie de déchets"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value as WasteCategory }))}
              options={CATEGORY_OPTIONS}
              placeholder="Sélectionner la catégorie"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Niveau d'urgence <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {URGENCY_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, urgency: opt.value as UrgencyLevel }))}
                    className={cn(
                      'w-full p-3 rounded-xl border-2 text-left text-sm font-medium transition-all',
                      form.urgency === opt.value
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Titre du signalement"
              placeholder="Ex: Tas d'ordures devant l'école"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
            />

            <Textarea
              label="Description détaillée"
              placeholder="Décrivez la situation en détail: taille, type de déchets, durée du problème, risques..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              required
              className="min-h-[120px]"
            />
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in pt-2">
            <div className="text-center pb-2">
              <div className="text-4xl mb-2">✅</div>
              <h3 className="font-bold text-gray-900 dark:text-white">Vérifiez votre signalement</h3>
              <p className="text-sm text-gray-500 mt-1">Confirmez avant d'envoyer</p>
            </div>

            {/* Summary card */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 space-y-3">
              {photos.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Photos ({photos.length})</p>
                  <div className="flex gap-2">
                    {photos.map((p, i) => (
                      <img key={i} src={p} alt="" className="w-16 h-16 rounded-xl object-cover" />
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Catégorie</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {form.category ? `${CATEGORY_LABELS[form.category].icon} ${CATEGORY_LABELS[form.category].label}` : '—'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Urgence</span>
                <span className={cn('font-bold', {
                  LOW: 'text-emerald-600', MEDIUM: 'text-amber-600',
                  HIGH: 'text-orange-600', CRITICAL: 'text-red-600'
                }[form.urgency])}>
                  {form.urgency}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Titre</span>
                <span className="font-medium text-gray-900 dark:text-white text-right max-w-[200px] truncate">{form.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Localisation</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Non défini'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Citoyen</span>
                <span className="font-medium text-gray-900 dark:text-white">{user?.fullName}</span>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
              En soumettant ce signalement, vous certifiez que les informations fournies sont exactes et conformes à la réalité.
            </div>
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="flex gap-3">
          {step > 0 && (
            <Button variant="outline" size="lg" onClick={() => setStep(s => s - 1)} className="flex-1">
              Retour
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button
              size="lg"
              className="flex-1"
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
            >
              Continuer
            </Button>
          ) : (
            <Button
              size="lg"
              className="flex-1"
              onClick={handleSubmit}
              loading={isSubmitting}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Envoyer le Signalement
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
