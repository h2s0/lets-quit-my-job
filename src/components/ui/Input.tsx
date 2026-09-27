import { forwardRef, type InputHTMLAttributes } from 'react';
import { inputClassName, type InputSize, type InputVariant } from '@/components/ui/inputStyles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  inputSize?: InputSize;
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, variant = 'default', inputSize = 'md', invalid = false, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={inputClassName({ variant, inputSize, invalid, className })}
      {...props}
    />
  );
});

export type { InputSize, InputVariant };
