import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { cn } from '@/utils/classNames';

export type TypographyVariant =
  | 'display'
  | 'heading-lg'
  | 'heading-md'
  | 'heading-sm'
  | 'body-lg'
  | 'body-md'
  | 'body-sm'
  | 'caption';

type TypographyTone = 'primary' | 'secondary' | 'muted' | 'danger' | 'success' | 'warning';
type TypographyLeading = 'default' | 'relaxed' | 'loose';

type TypographyProps<T extends ElementType> = {
  as?: T;
  variant?: TypographyVariant;
  serif?: boolean;
  tone?: TypographyTone;
  leading?: TypographyLeading;
} & Omit<ComponentPropsWithoutRef<T>, 'as'>;

const variantClasses: Record<TypographyVariant, string> = {
  display: 'text-display font-semibold leading-none',
  'heading-lg': 'text-heading-lg font-semibold',
  'heading-md': 'text-heading-md font-semibold',
  'heading-sm': 'text-heading-sm font-semibold',
  'body-lg': 'text-body-lg font-normal',
  'body-md': 'text-body-md font-normal',
  'body-sm': 'text-body-sm font-normal',
  caption: 'text-caption font-normal',
};

const toneClasses: Record<TypographyTone, string> = {
  primary: 'text-text-primary',
  secondary: 'text-text-secondary',
  muted: 'text-text-muted',
  danger: 'text-danger',
  success: 'text-success',
  warning: 'text-warning',
};

const leadingClasses: Record<TypographyLeading, string> = {
  default: '',
  relaxed: 'leading-relaxed',
  loose: 'leading-loose',
};

export function Typography<T extends ElementType = 'p'>({
  as,
  variant = 'body-md',
  serif = false,
  tone = 'primary',
  leading = 'default',
  className,
  ...props
}: TypographyProps<T>) {
  const Component = as ?? 'p';
  return (
    <Component
      className={cn(
        toneClasses[tone],
        variantClasses[variant],
        serif ? 'font-serif' : 'font-sans',
        leadingClasses[leading],
        className,
      )}
      {...props}
    />
  );
}
