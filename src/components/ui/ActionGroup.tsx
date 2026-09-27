import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/utils/classNames';

type ActionGroupProps = HTMLAttributes<HTMLElement>;

export const ActionGroup = forwardRef<HTMLElement, ActionGroupProps>(function ActionGroup(
  { className, ...props },
  ref,
) {
  return (
    <nav
      ref={ref}
      className={cn('z-10 mx-7 grid grid-cols-2 gap-3', className)}
      {...props}
    />
  );
});
