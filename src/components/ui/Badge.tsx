import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/classNames';

type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-surface-muted text-text-secondary',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success-muted text-success',
  warning: 'bg-warning-muted text-warning',
  danger: 'bg-danger-muted text-danger',
};

export function Badge({ className, variant = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-1 text-caption font-medium',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
