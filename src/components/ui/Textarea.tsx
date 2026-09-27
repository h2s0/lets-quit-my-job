import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/classNames';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'document';
  invalid?: boolean;
}

const variantClasses = {
  default: 'rounded-md border border-border bg-surface p-3 focus:border-primary',
  document: 'rounded-none border-0 bg-transparent p-2 focus:ring-inset',
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, variant = 'default', invalid = false, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'w-full resize-none text-body-sm text-text-primary outline-none transition placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        invalid && 'bg-danger-muted/70 text-danger focus-visible:ring-danger/30',
        className,
      )}
      {...props}
    />
  );
});
