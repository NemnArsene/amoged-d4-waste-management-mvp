import { cn } from '../../utils/cn';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function EmptyState({ icon = '📭', title, description, action, size = 'md', className }: EmptyStateProps) {
  const sizes = {
    sm: { icon: 'text-4xl', title: 'text-base', desc: 'text-sm', padding: 'py-8' },
    md: { icon: 'text-5xl', title: 'text-lg', desc: 'text-sm', padding: 'py-12' },
    lg: { icon: 'text-6xl', title: 'text-xl', desc: 'text-base', padding: 'py-16' },
  };

  const s = sizes[size];

  return (
    <div className={cn('flex flex-col items-center justify-center text-center', s.padding, className)}>
      <div className={cn('mb-4', s.icon)}>{icon}</div>
      <h3 className={cn('font-semibold text-gray-900 dark:text-white mb-2', s.title)}>{title}</h3>
      {description && (
        <p className={cn('text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-6', s.desc)}>{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} size="sm">{action.label}</Button>
      )}
    </div>
  );
}

// Error state
interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Une erreur est survenue',
  description = 'Impossible de charger les données. Veuillez réessayer.',
  onRetry,
  className
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-12', className)}>
      <div className="text-5xl mb-4">⚠️</div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-6">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          Réessayer
        </Button>
      )}
    </div>
  );
}

// Offline state
export function OfflineState() {
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg">
        <span className="text-lg">📡</span>
        Mode hors ligne - Données en cache
      </div>
    </div>
  );
}

// Loading spinner
export function Spinner({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <svg className={cn('animate-spin text-emerald-600', sizes[size])} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  );
}
