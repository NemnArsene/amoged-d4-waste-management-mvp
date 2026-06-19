import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Lock, Eye, EyeOff, Trash2, Shield } from 'lucide-react';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

const DEMO_ACCOUNTS = [
  { role: 'ADMIN' as const, label: 'Admin', email: 'admin@amoged-d4.cm', color: 'from-red-500 to-rose-600', icon: '👑' },
  { role: 'SUPERVISOR' as const, label: 'Superviseur', email: 'supervisor1@amoged-d4.cm', color: 'from-blue-500 to-indigo-600', icon: '🎯' },
  { role: 'AGENT' as const, label: 'Agent', email: 'agent1@amoged-d4.cm', color: 'from-purple-500 to-violet-600', icon: '👷' },
  { role: 'CITIZEN' as const, label: 'Citoyen', email: 'emmanuel.ngono0@gmail.com', color: 'from-emerald-500 to-teal-600', icon: '🏠' },
];

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { login, loginDemo, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'L\'email est requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Email invalide';
    if (!password) newErrors.password = 'Le mot de passe est requis';
    else if (password.length < 6) newErrors.password = 'Minimum 6 caractères';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    const result = await login(email, password);
    if (result.success) {
      const { user } = useAuthStore.getState();
      toast.success(`Bienvenue, ${user?.firstName}!`);
      if (user && ['ADMIN', 'SUPERVISOR', 'AGENT'].includes(user.role)) {
        navigate('/admin/dashboard');
      } else {
        navigate('/citizen/home');
      }
    } else {
      toast.error(result.message || 'Identifiants incorrects');
    }
  };

  /*
  const handleDemoLogin = (role: typeof DEMO_ACCOUNTS[0]['role']) => {
    loginDemo(role);
    toast.success('Connexion démo réussie!');
    if (['ADMIN', 'SUPERVISOR', 'AGENT'].includes(role)) {
      navigate('/admin/dashboard');
    } else {
      navigate('/citizen/home');
    }
  };
  */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col items-center justify-center p-4 md:p-8">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30 mb-4">
            <Trash2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">AMOGED-D4</h1>
          <p className="text-gray-400 text-sm mt-1">Portail de Connexion</p>
        </div>

        {/* Login card */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-3xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-1">Connexion</h2>
          <p className="text-gray-400 text-sm mb-6">Accédez à votre espace personnel</p>

          <div className="space-y-4">
            <Input
              label="Adresse Email"
              type="email"
              placeholder="votre@email.cm"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
            />

            <Input
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4" />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
            />

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                Mot de passe oublié?
              </Link>
            </div>

            <Button
              fullWidth
              size="lg"
              onClick={handleLogin}
              loading={isLoading}
              className="mt-2"
            >
              <Shield className="w-4 h-4" />
              Se Connecter
            </Button>
          </div>

          {/* Divider 
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-xs text-gray-500 font-medium">DÉMO RAPIDE</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>
          */}

          {/* Demo accounts 
          <div className="grid grid-cols-2 gap-2.5">
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.role}
                onClick={() => handleDemoLogin(acc.role)}
                className={cn(
                  'flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-gray-700/50',
                  'bg-gradient-to-br opacity-90 hover:opacity-100 transition-all',
                  'hover:border-gray-600 hover:scale-105 active:scale-95',
                  acc.color
                )}
              >
                <span className="text-2xl">{acc.icon}</span>
                <span className="text-xs font-bold text-white">{acc.label}</span>
                <span className="text-xs text-white/60 truncate max-w-full px-1 text-center leading-tight">
                  Demo
                </span>
              </button>
            ))}
          </div>
          */}

          <p className="text-center text-xs text-gray-500 mt-6">
            Pas encore de compte?{' '}
            <Link to="/register" className="text-emerald-400 font-medium hover:text-emerald-300">
              S'inscrire gratuitement
            </Link>
          </p>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Mairie de Douala 4ème © 2026 — AMOGED-D4 v1.0.0
        </p>
      </div>
    </div>
  );
}
