import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { User, Mail, Lock, Phone, MapPin, Trash2 } from 'lucide-react';
import { ZONES_DATA } from '../../data/mockData';
import type { CollectionZone } from '../../types';
import toast from 'react-hot-toast';

export function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirmPassword: '', zone: '' as CollectionZone | '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const update = (key: string, value: string | boolean) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName) e.firstName = 'Prénom requis';
    if (!form.lastName) e.lastName = 'Nom requis';
    if (!form.email) e.email = 'Email requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide';
    if (!form.phone) e.phone = 'Téléphone requis';
    if (!form.password) e.password = 'Mot de passe requis';
    else if (form.password.length < 8) e.password = 'Minimum 8 caractères';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Les mots de passe ne correspondent pas';
    if (!form.agreeTerms) e.agreeTerms = 'Vous devez accepter les CGU';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const result = await register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      zone: form.zone as CollectionZone,
      password: form.password,
    });
    if (result.success) {
      toast.success('Compte créé avec succès! 🎉');
      navigate('/citizen/home');
    } else {
      toast.error(result.message || 'Erreur lors de la création du compte');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col items-center justify-center p-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30 mb-3">
            <Trash2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-black text-white">Créer un Compte Citoyen</h1>
          <p className="text-gray-400 text-sm mt-1">Rejoignez la communauté AMOGED-D4</p>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-3xl p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Prénom"
                placeholder="Jean"
                value={form.firstName}
                onChange={e => update('firstName', e.target.value)}
                error={errors.firstName}
                leftIcon={<User className="w-4 h-4" />}
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
              />
              <Input
                label="Nom"
                placeholder="Mbarga"
                value={form.lastName}
                onChange={e => update('lastName', e.target.value)}
                error={errors.lastName}
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="jean.mbarga@gmail.com"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
            />

            <Input
              label="Téléphone"
              type="tel"
              placeholder="+237 6XX XXX XXX"
              value={form.phone}
              onChange={e => update('phone', e.target.value)}
              error={errors.phone}
              leftIcon={<Phone className="w-4 h-4" />}
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
            />

            <Select
              label="Votre Quartier"
              value={form.zone}
              onChange={e => update('zone', e.target.value)}
              options={Object.entries(ZONES_DATA).map(([key, val]) => ({ value: key, label: val.name }))}
              placeholder="Sélectionner votre quartier"
              leftIcon={<MapPin className="w-4 h-4" />}
              className="bg-gray-800/50 border-gray-700 text-white"
            />

            <Input
              label="Mot de passe"
              type="password"
              placeholder="Minimum 8 caractères"
              value={form.password}
              onChange={e => update('password', e.target.value)}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4" />}
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
            />

            <Input
              label="Confirmer le mot de passe"
              type="password"
              placeholder="Répéter le mot de passe"
              value={form.confirmPassword}
              onChange={e => update('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              leftIcon={<Lock className="w-4 h-4" />}
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
            />

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.agreeTerms}
                onChange={e => update('agreeTerms', e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-emerald-500"
              />
              <span className="text-xs text-gray-400 leading-relaxed">
                J'accepte les{' '}
                <span className="text-emerald-400">Conditions Générales d'Utilisation</span>
                {' '}et la{' '}
                <span className="text-emerald-400">Politique de Confidentialité</span>
                {' '}de la Mairie de Douala 4ème.
              </span>
            </label>
            {errors.agreeTerms && <p className="text-xs text-red-500">{errors.agreeTerms}</p>}

            <Button
              fullWidth
              size="lg"
              onClick={handleSubmit}
              loading={isLoading}
              className="mt-2"
            >
              🚀 Créer mon Compte
            </Button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-5">
            Déjà inscrit?{' '}
            <Link to="/login" className="text-emerald-400 font-medium hover:text-emerald-300">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
