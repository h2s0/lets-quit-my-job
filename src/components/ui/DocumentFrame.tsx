import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/utils/classNames';

type DocumentFrameProps = HTMLAttributes<HTMLElement>;

export const DocumentFrame = forwardRef<HTMLElement, DocumentFrameProps>(function DocumentFrame(
  { className, ...props },
  ref,
) {
  return (
    <main
      ref={ref}
      className={cn(
        'mx-auto w-full max-w-document overflow-x-hidden sm:my-8 sm:shadow-paper',
        className,
      )}
      {...props}
    />
  );
});
