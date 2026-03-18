import React, { useEffect, useRef, useState } from 'react';
import type { StockDetailItem } from '@/types';
import { ButtonWrapper } from '@/components/common/ButtonWrapper';
import { ItemsAPI } from '@/services/api/itemsAPI';

interface ItemFormModalProps {
  mode: 'create' | 'edit';
  stockId: number | string;
  item?: StockDetailItem;
  onSuccess: () => void;
  onClose: () => void;
}

export const ItemFormModal: React.FC<ItemFormModalProps> = ({
  mode,
  stockId,
  item,
  onSuccess,
  onClose,
}) => {
  const [label, setLabel] = useState(item?.label ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [minimumStock, setMinimumStock] = useState(String(item?.minimumStock ?? 1));
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSubmit = async () => {
    if (!label.trim()) {
      setError("Le nom de l'item est requis.");
      return;
    }
    const minStock = Number(minimumStock);
    if (isNaN(minStock) || minStock < 0) {
      setError('Le stock minimum doit être un nombre positif ou nul.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      if (mode === 'create') {
        await ItemsAPI.addItem(stockId, {
          label: label.trim(),
          description,
          minimumStock: minStock,
          quantity,
        });
      } else {
        await ItemsAPI.updateItem(stockId, item!.id, {
          label: label.trim(),
          description,
          minimumStock: minStock,
        });
      }
      onSuccess();
      onClose();
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = mode === 'create' ? 'Nouvel item' : "Modifier l'item";
  const submitLabel = mode === 'create' ? 'Créer' : 'Enregistrer';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-form-title"
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6"
      >
        <h2 id="item-form-title" className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          {title}
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="item-label"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Nom <span aria-hidden="true">*</span>
            </label>
            <input
              id="item-label"
              ref={firstInputRef}
              type="text"
              value={label}
              onChange={e => setLabel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-required="true"
              aria-invalid={error && !label.trim() ? 'true' : undefined}
              aria-describedby={error && !label.trim() ? 'item-form-error' : undefined}
            />
          </div>

          <div>
            <label
              htmlFor="item-description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Description
            </label>
            <input
              id="item-description"
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label
              htmlFor="item-minimum-stock"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Stock minimum
            </label>
            <input
              id="item-minimum-stock"
              type="number"
              min={0}
              value={minimumStock}
              onChange={e => setMinimumStock(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {mode === 'create' && (
            <div>
              <label
                htmlFor="item-quantity"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Quantité initiale
              </label>
              <input
                id="item-quantity"
                type="number"
                min={0}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          {error && (
            <p id="item-form-error" role="alert" className="text-sm text-red-500">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <ButtonWrapper variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </ButtonWrapper>
          <ButtonWrapper
            variant="primary"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {submitLabel}
          </ButtonWrapper>
        </div>
      </div>
    </div>
  );
};
