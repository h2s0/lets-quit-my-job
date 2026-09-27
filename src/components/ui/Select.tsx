import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/classNames';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  variant?: 'default' | 'document';
  selectSize?: 'sm' | 'md';
  invalid?: boolean;
}

const variantClasses = {
  default: 'rounded-md border border-border bg-surface px-3 focus:border-primary',
  document: 'border-0 border-b border-border bg-transparent px-1 focus:border-primary',
};

const sizeClasses = {
  sm: 'min-h-9 text-body-sm',
  md: 'min-h-12 text-body-md',
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, variant = 'default', selectSize = 'md', invalid = false, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'w-full text-text-primary outline-none transition focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[selectSize],
        invalid && 'border-danger bg-danger-muted/70 text-danger focus-visible:ring-danger/30',
        className,
      )}
      {...props}
    />
  );
});
