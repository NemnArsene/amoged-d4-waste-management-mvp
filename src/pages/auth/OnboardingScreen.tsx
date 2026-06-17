import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '../../utils/cn';

const SLIDES = [
  {
    emoji: '🌆',
    title: 'Bienvenue sur AMOGED-D4',
    subtitle: 'La plateforme GovTech qui révolutionne la gestion des déchets à Douala 4ème',
    bg: 'from-emerald-600 to-teal-700',
    description: 'Participez à la construction d\'une ville plus propre et plus saine pour tous les habitants.',
  },
  {
    emoji: '📸',
    title: 'Signalez en 30 secondes',
    subtitle: 'Photo + localisation = signalement envoyé',
    bg: 'from-blue-600 to-indigo-700',
    description: 'Prenez une photo du problème, notre application géolocalise automatiquement l\'incident et l\'envoie aux équipes compétentes.',
  },
  {
    emoji: '🗺️',
    title: 'Suivi en Temps Réel',
    subtitle: 'Visualisez l\'avancement de votre signalement',
    bg: 'from-purple-600 to-violet-700',
    description: 'Suivez chaque étape du traitement de votre signalement : assignation, intervention, résolution.',
  },
  {
    emoji: '📅',
    title: 'Calendrier de Collecte',
    subtitle: 'Ne manquez plus jamais la collecte',
    bg: 'from-orange-500 to-amber-600',
    description: 'Consultez les horaires de passage des camions dans votre quartier et recevez des notifications avant chaque collecte.',
  },
  {
    emoji: '🏆',
    title: 'Devenez Citoyen Exemplaire',
    subtitle: 'Vos actions comptent pour la communauté',
    bg: 'from-rose-500 to-pink-600',
    description: 'Chaque signalement résolu vous rapporte des points. Rejoignez le classement des citoyens les plus actifs de Douala 4ème!',
  },
];

export function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slide = SLIDES[currentSlide];
  const isLast = currentSlide === SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) navigate('/login');
    else setCurrentSlide(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide(prev => prev - 1);
  };

  return (
    <div className={cn(
      'min-h-screen flex flex-col transition-all duration-500',
      `bg-gradient-to-br ${slide.bg}`
    )}>
      {/* Skip button */}
      <div className="flex justify-end p-6">
        <button
          onClick={() => navigate('/login')}
          className="text-white/70 text-sm font-medium hover:text-white transition-colors"
        >
          Passer →
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="animate-fade-in-up" key={currentSlide}>
          {/* Emoji illustration */}
          <div className="text-8xl mb-8 animate-bounce">
            {slide.emoji}
          </div>

          {/* Text */}
          <h2 className="text-3xl font-black text-white mb-3 leading-tight">
            {slide.title}
          </h2>
          <p className="text-white/80 text-lg font-medium mb-4">
            {slide.subtitle}
          </p>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto">
            {slide.description}
          </p>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="px-8 pb-12 space-y-6">
        {/* Dots */}
        <div className="flex justify-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={cn(
                'rounded-full transition-all duration-300',
                i === currentSlide
                  ? 'w-6 h-2 bg-white'
                  : 'w-2 h-2 bg-white/40'
              )}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-4">
          {currentSlide > 0 && (
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          <Button
            onClick={handleNext}
            className={cn(
              'flex-1 py-4 text-base rounded-2xl bg-white hover:bg-white/90',
              'text-gray-900 font-bold shadow-2xl transition-all'
            )}
          >
            {isLast ? '🚀 Commencer' : 'Suivant'}
            {!isLast && <ChevronRight className="w-5 h-5" />}
          </Button>
        </div>

        <p className="text-white/40 text-xs text-center">
          Vous avez déjà un compte?{' '}
          <button onClick={() => navigate('/login')} className="text-white/70 underline">
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
}
