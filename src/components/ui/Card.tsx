import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function Card({ children, className, glass = false, hover = false, padding = 'md', onClick }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4 md:p-5',
    lg: 'p-6 md:p-8',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl border',
        glass
          ? 'glass-light dark:glass border-white/50 dark:border-white/10'
          : 'bg-white dark:bg-gray-900 border-gray-200/60 dark:border-gray-800',
        'shadow-sm',
        hover && 'card-hover cursor-pointer',
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, icon, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-3 mb-4', className)}>
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base truncate">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// Stat card
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  color?: 'green' | 'blue' | 'orange' | 'red' | 'purple';
  className?: string;
}

export function StatCard({ title, value, subtitle, icon, trend, color = 'green', className }: StatCardProps) {
  const colors = {
    green:  { bg: 'bg-emerald-500', light: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
    blue:   { bg: 'bg-blue-500', light: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
    orange: { bg: 'bg-orange-500', light: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400' },
    red:    { bg: 'bg-red-500', light: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' },
    purple: { bg: 'bg-purple-500', light: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
  };

  const c = colors[color];

  return (
    <Card className={cn('card-hover', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">{title}</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={cn(
                'text-xs font-semibold',
                trend.value >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
              )}>
                {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-400">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0', c.light)}>
          <span className={cn('text-xl', c.text)}>{icon}</span>
        </div>
      </div>
    </Card>
  );
}

// Skeleton card
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <Card className={cn('animate-pulse', className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl skeleton" />
        <div className="flex-1">
          <div className="h-4 skeleton rounded w-3/4 mb-2" />
          <div className="h-3 skeleton rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 skeleton rounded" />
        <div className="h-3 skeleton rounded w-5/6" />
        <div className="h-3 skeleton rounded w-4/6" />
      </div>
    </Card>
  );
}
