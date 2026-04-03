import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface Props {
  itemId: number;
  itemLabel: string;
  currentQuantity: number;
  onSubmit: (itemId: number, suggestedQuantity: number) => Promise<void>;
  onClose: () => void;
}

export const ContributionFormModal: React.FC<Props> = ({
  itemId,
  itemLabel,
  currentQuantity,
  onSubmit,
  onClose,
}) => {
  const { theme } = useTheme();
  const formRef = useRef<HTMLElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const el = formRef.current;
    if (!el) return;

    const handleSubmit = async (e: Event) => {
      if (!(e instanceof CustomEvent)) return;
      setError(null);
      setIsSubmitting(true);
      try {
        await onSubmit(itemId, e.detail.suggestedQuantity);
        setSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleCancel = () => onClose();

    el.addEventListener('contribution-submit', handleSubmit);
    el.addEventListener('contribution-cancel', handleCancel);
    return () => {
      el.removeEventListener('contribution-submit', handleSubmit);
      el.removeEventListener('contribution-cancel', handleCancel);
    };
  }, [itemId, onSubmit, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contrib-modal-title"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md">
        <h2 id="contrib-modal-title" className="sr-only">
          Proposer une modification de quantité
        </h2>

        {success ? (
          <div className="bg-slate-800 border border-green-500/30 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="text-green-400 text-2xl">✓</span>
            </div>
            <p className="text-white font-semibold mb-1">Suggestion envoyée</p>
            <p className="text-gray-400 text-sm mb-4">
              Le propriétaire du stock recevra votre proposition.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg"
            >
              Fermer
            </button>
          </div>
        ) : (
          <>
            {React.createElement('sh-contribution-form', {
              ref: (el: HTMLElement | null) => {
                formRef.current = el;
              },
              'item-label': itemLabel,
              'current-quantity': currentQuantity,
              disabled: isSubmitting,
              'data-theme': theme,
            })}
            {error && <p className="mt-2 text-sm text-red-400 text-center">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};
