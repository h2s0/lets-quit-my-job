import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/classNames';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonShape = 'default' | 'square' | 'full';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  iconOnly?: boolean;
  shape?: ButtonShape;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'border-transparent bg-primary text-white shadow-floating hover:bg-primary-hover',
  secondary: 'border-white/70 bg-white/80 text-text-primary shadow-floating backdrop-blur-sm hover:bg-white',
  outline: 'border-border-strong bg-surface/60 text-text-primary hover:bg-surface',
  ghost: 'border-border bg-surface/70 text-text-primary backdrop-blur-sm hover:bg-surface',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3 text-body-sm',
  md: 'min-h-12 px-4 text-body-md',
  lg: 'min-h-14 px-6 text-body-lg',
};

const shapeClasses: Record<ButtonShape, string> = {
  default: 'rounded-lg',
  square: 'rounded-none',
  full: 'rounded-full',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    iconOnly = false,
    shape = 'default',
    type = 'button',
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center border font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        shapeClasses[shape],
        iconOnly ? 'aspect-square p-0' : sizeClasses[size],
        iconOnly && size === 'sm' && 'size-9',
        iconOnly && size === 'md' && 'size-12',
        iconOnly && size === 'lg' && 'size-14',
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    />
  );
});
