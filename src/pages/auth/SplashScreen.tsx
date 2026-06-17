import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Trash2 } from 'lucide-react';

export function SplashScreen() {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated && user) {
        if (['ADMIN', 'SUPERVISOR', 'AGENT'].includes(user.role)) {
          navigate('/admin/dashboard');
        } else {
          navigate('/citizen/home');
        }
      } else {
        navigate('/onboarding');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-700 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 animate-fade-in-up">
        {/* Logo */}
        <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-2xl">
          <Trash2 className="w-12 h-12 text-white" />
        </div>

        {/* App name */}
        <div className="text-center">
          <h1 className="text-4xl font-black text-white tracking-tight">AMOGED-D4</h1>
          <p className="text-white/80 text-base mt-2 font-medium">Gestion des Déchets Urbains</p>
          <p className="text-white/60 text-sm mt-1">Douala 4ème Arrondissement</p>
        </div>

        {/* Loading indicator */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex gap-2">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-white/60"
                style={{
                  animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
          <p className="text-white/50 text-xs">Chargement de l'application...</p>
        </div>
      </div>

      {/* Bottom branding */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-white/40 text-xs">Mairie de Douala 4ème © 2025</p>
        <p className="text-white/30 text-xs mt-1">Powered by GovTech Smart City Platform</p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.5); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
