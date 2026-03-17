import React, { useEffect, useRef, useState } from 'react';
import type { StockFormModalProps } from '@/types';
import { ButtonWrapper } from '@/components/common/ButtonWrapper';
import { StocksAPI } from '@/services/api/stocksAPI';

const STOCK_CATEGORIES = [
  { value: 'alimentation', label: 'Alimentation' },
  { value: 'hygiene', label: 'Hygiène' },
  { value: 'artistique', label: 'Artistique' },
] as const;

export const StockFormModal: React.FC<StockFormModalProps> = ({
  mode,
  stock,
  onSuccess,
  onClose,
}) => {
  const [label, setLabel] = useState(stock?.label ?? '');
  const [description, setDescription] = useState(stock?.description ?? '');
  const [category, setCategory] = useState(stock?.category ?? '');
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
    if (label.trim().length < 3) {
      setError('Le nom du stock doit contenir au moins 3 caractères.');
      return;
    }
    if (!description.trim()) {
      setError('La description est requise.');
      return;
    }
    if (!category.trim()) {
      setError('La catégorie est requise.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      if (mode === 'create') {
        await StocksAPI.createStock({
          label: label.trim(),
          description,
          category,
          quantity: 0,
          value: 0,
        });
      } else {
        await StocksAPI.updateStock({
          id: stock!.id,
          label: label.trim(),
          description,
          category,
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

  const title = mode === 'create' ? 'Nouveau stock' : 'Modifier le stock';
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
        aria-labelledby="stock-form-title"
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6"
      >
        <h2 id="stock-form-title" className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          {title}
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="stock-label"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Nom du stock <span aria-hidden="true">*</span>
            </label>
            <input
              id="stock-label"
              ref={firstInputRef}
              type="text"
              value={label}
              onChange={e => setLabel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-required="true"
              aria-invalid={error && !label.trim() ? 'true' : undefined}
              aria-describedby={error && !label.trim() ? 'stock-form-error' : undefined}
            />
          </div>

          <div>
            <label
              htmlFor="stock-description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Description <span aria-hidden="true">*</span>
            </label>
            <input
              id="stock-description"
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-required="true"
              aria-invalid={error && !description.trim() ? 'true' : undefined}
              aria-describedby={error && !description.trim() ? 'stock-form-error' : undefined}
            />
          </div>

          <div>
            <label
              htmlFor="stock-category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Catégorie <span aria-hidden="true">*</span>
            </label>
            <select
              id="stock-category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-required="true"
              aria-invalid={error && !category.trim() ? 'true' : undefined}
              aria-describedby={error && !category.trim() ? 'stock-form-error' : undefined}
            >
              <option value="">-- Choisir une catégorie --</option>
              {STOCK_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p id="stock-form-error" role="alert" className="text-sm text-red-500">
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
