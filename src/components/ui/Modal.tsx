import { useEffect, useId, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ open, onClose, title, description, children, footer }: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/50"
        onClick={onClose}
        aria-label="모달 닫기"
      />
      <section
        className="relative z-10 w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-paper"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Typography as="h2" id={titleId} variant="heading-sm">{title}</Typography>
            {description && (
              <Typography id={descriptionId} variant="body-sm" className="text-text-secondary">
                {description}
              </Typography>
            )}
          </div>
          <Button variant="ghost" size="sm" iconOnly onClick={onClose} aria-label="닫기">
            <span aria-hidden="true">×</span>
          </Button>
        </div>
        <div className="mt-6">{children}</div>
        {footer && <footer className="mt-6 flex justify-end gap-2">{footer}</footer>}
      </section>
    </div>
  );
}
