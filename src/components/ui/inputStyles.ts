import { cn } from '@/utils/classNames';

export type InputVariant = 'default' | 'document' | 'table';
export type InputSize = 'sm' | 'md';

interface InputStyleOptions {
  variant?: InputVariant;
  inputSize?: InputSize;
  invalid?: boolean;
  className?: string;
}

const variantClasses: Record<InputVariant, string> = {
  default: 'rounded-md border border-border bg-surface px-3 focus:border-primary',
  document: 'border-0 border-b border-border bg-transparent px-1 focus:border-primary',
  table: 'border-0 border-r border-b border-border-strong bg-transparent px-3 focus:border-primary',
};

const sizeClasses: Record<InputSize, string> = {
  sm: 'min-h-9 text-body-sm',
  md: 'min-h-12 text-body-md',
};

export function inputClassName({
  variant = 'default',
  inputSize = 'md',
  invalid = false,
  className,
}: InputStyleOptions = {}): string {
  return cn(
    'w-full min-w-0 text-text-primary outline-none transition placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50',
    variantClasses[variant],
    sizeClasses[inputSize],
    invalid && 'border-danger bg-danger-muted/70 text-danger ring-1 ring-inset ring-danger placeholder:text-danger focus:border-danger focus-visible:ring-danger/30',
    className,
  );
}
