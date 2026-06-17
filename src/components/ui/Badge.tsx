import React from 'react';
import { cn } from '../../utils/cn';
import type { ReportStatus, UrgencyLevel } from '../../types';
import { STATUS_LABELS, URGENCY_LABELS } from '../../data/mockData';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    danger:  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    info:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    purple:  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full font-medium',
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: ReportStatus }) {
  const info = STATUS_LABELS[status];
  const variantMap: Record<ReportStatus, BadgeProps['variant']> = {
    PENDING: 'warning',
    ASSIGNED: 'info',
    IN_PROGRESS: 'purple',
    RESOLVED: 'success',
    REJECTED: 'danger',
    CANCELLED: 'default',
  };
  return <Badge variant={variantMap[status]}>{info.label}</Badge>;
}

export function UrgencyBadge({ urgency }: { urgency: UrgencyLevel }) {
  const info = URGENCY_LABELS[urgency];
  const variantMap: Record<UrgencyLevel, BadgeProps['variant']> = {
    LOW: 'success',
    MEDIUM: 'warning',
    HIGH: 'warning',
    CRITICAL: 'danger',
  };
  return (
    <Badge variant={variantMap[urgency]}>
      {urgency === 'CRITICAL' && '🔴 '}
      {urgency === 'HIGH' && '🟠 '}
      {urgency === 'MEDIUM' && '🟡 '}
      {urgency === 'LOW' && '🟢 '}
      {info.label}
    </Badge>
  );
}
