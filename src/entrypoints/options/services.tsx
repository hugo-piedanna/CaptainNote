import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useAnnouncer } from '@/hooks/useAnnouncer';
import { t } from '@/lib/i18n';

/** A destructive action to confirm (FR-options-layout). */
export interface ConfirmRequest {
  title: string;
  message: string;
  confirmLabel: string;
}

interface Services {
  /** Polite screen reader announcement. */
  announce: (text: string) => void;
  /** Resolves true when the user confirms, false on cancel or Escape. */
  confirm: (request: ConfirmRequest) => Promise<boolean>;
}

const ServicesContext = createContext<Services | null>(null);

function useServices(): Services {
  const services = useContext(ServicesContext);
  if (!services) throw new Error('OptionsServices is missing');
  return services;
}

export const useAnnounce = () => useServices().announce;
export const useConfirm = () => useServices().confirm;

/** Page-wide services: the live region and the confirmation dialog. */
export function OptionsServices({ children }: { children: ReactNode }) {
  const { regionRef, announce } = useAnnouncer();
  const [pending, setPending] = useState<(ConfirmRequest & { resolve: (ok: boolean) => void }) | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const messageId = useId();

  const confirm = useCallback(
    (request: ConfirmRequest) => new Promise<boolean>((resolve) => setPending({ ...request, resolve })),
    [],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!pending || !dialog || dialog.open) return;
    // showModal makes the rest of the page inert and returns focus to the opener on close.
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    cancelRef.current?.focus();
  }, [pending]);

  const close = (ok: boolean) => {
    const dialog = dialogRef.current;
    if (dialog?.open) {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    }
    pending?.resolve(ok);
    setPending(null);
  };

  return (
    <ServicesContext.Provider value={{ announce, confirm }}>
      {children}
      <dialog
        ref={dialogRef}
        className="dialog"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        onCancel={(e) => {
          e.preventDefault();
          close(false);
        }}>
        {pending && (
          <>
            <h2
              id={titleId}
              className="dialog__title">
              {pending.title}
            </h2>
            <p
              id={messageId}
              className="dialog__message">
              {pending.message}
            </p>
            <div className="dialog__actions">
              <button
                ref={cancelRef}
                type="button"
                className="btn btn--ghost"
                onClick={() => close(false)}>
                {t.optCancel}
              </button>
              <button
                type="button"
                className="btn btn--danger"
                onClick={() => close(true)}>
                {pending.confirmLabel}
              </button>
            </div>
          </>
        )}
      </dialog>
      <div
        ref={regionRef}
        className="sr-only"
        role="status"
      />
    </ServicesContext.Provider>
  );
}
