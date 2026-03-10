import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

import { HeaderWrapper } from '@/components/layout/HeaderWrapper';
import { FooterWrapper } from '@/components/layout/FooterWrapper';
import { NavSection } from '@/components/layout/NavSection';
import { CardWrapper } from '@/components/common/CardWrapper';
import { ButtonWrapper as Button } from '@/components/common/ButtonWrapper';
import { MetricCardWrapper } from '@/components/dashboard/MetricCardWrapper';

import { useStocks } from '@/hooks/useStocks';
import { useItems } from '@/hooks/useItems';
import { useTheme } from '@/hooks/useTheme';
import { logger } from '@/utils/logger';
import type { StockItem } from '@/types';

export const StockDetailPage: React.FC = () => {
  const { stockId } = useParams<{ stockId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const { getStockById, loadStocks } = useStocks();
  const { loadItems, addItem, updateItem, deleteItem, isLoading, errors } = useItems(stockId ?? '');

  const [items, setItems] = useState<StockItem[]>([]);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const loadStocksRef = useRef(loadStocks);
  loadStocksRef.current = loadStocks;
  const loadItemsRef = useRef(loadItems);
  loadItemsRef.current = loadItems;

  const themeClasses = {
    background: theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50',
    text: theme === 'dark' ? 'text-white' : 'text-gray-900',
    textMuted: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    card: theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200',
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        await loadStocksRef.current();
        const result = await loadItemsRef.current();
        if (mounted && result) {
          setItems(result);
        }
        if (mounted) setIsPageLoaded(true);
      } catch (error) {
        logger.error('Erreur lors du chargement du détail stock:', error);
        if (mounted) setIsPageLoaded(true);
      }
    };

    initialize();
    return () => {
      mounted = false;
    };
  }, [stockId]);

  const stock = stockId ? getStockById(stockId) : undefined;

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = items.filter(item => item.quantity <= item.minimumStock);

  const handleAddItem = async () => {
    const result = await addItem({
      label: 'Nouvel item',
      quantity: 1,
      minimumStock: 1,
    });
    if (result) {
      setItems(prev => [...prev, result]);
    }
  };

  const handleUpdateQuantity = async (item: StockItem, delta: number) => {
    const newQty = Math.max(0, item.quantity + delta);
    const result = await updateItem(item.id, { quantity: newQty });
    if (result) {
      setItems(prev => prev.map(i => (i.id === item.id ? result : i)));
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    await deleteItem(itemId);
    setItems(prev => prev.filter(i => i.id !== itemId));
  };

  if (!isPageLoaded) {
    return (
      <main
        className={`min-h-screen ${themeClasses.background} ${themeClasses.text} flex items-center justify-center`}
        role="status"
        aria-live="polite"
        aria-label="Chargement du détail du stock"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
          <span className={themeClasses.textMuted}>Chargement...</span>
        </div>
      </main>
    );
  }

  if (!stock) {
    return (
      <main
        className={`min-h-screen ${themeClasses.background} ${themeClasses.text} flex items-center justify-center`}
      >
        <CardWrapper className="max-w-md text-center">
          <h2 className="text-xl font-bold mb-4">Stock introuvable</h2>
          <p className={`${themeClasses.textMuted} mb-4`}>
            Le stock demandé n&apos;existe pas ou vous n&apos;y avez pas accès.
          </p>
          <Button onClick={() => navigate('/')}>Retour au tableau de bord</Button>
        </CardWrapper>
      </main>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text}`}>
      <HeaderWrapper />

      <NavSection>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate('/')}
            aria-label="Retour au tableau de bord"
          >
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{stock.label}</h1>
            <p className={themeClasses.textMuted}>
              {stock.category ?? 'Sans catégorie'}
              {stock.description ? ` — ${stock.description}` : ''}
            </p>
          </div>
        </div>
      </NavSection>

      <main id="main-content" className="max-w-7xl mx-auto px-6 py-8" role="main">
        {/* Métriques */}
        <section
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          aria-labelledby="metrics-heading"
        >
          <h2 id="metrics-heading" className="sr-only">
            Métriques du stock
          </h2>
          <MetricCardWrapper
            title="Nombre d'items"
            value={items.length}
            icon="package"
            color="info"
          />
          <MetricCardWrapper
            title="Quantité totale"
            value={totalQuantity}
            icon="trending-up"
            color="success"
          />
          <MetricCardWrapper
            title="Items en stock bas"
            value={lowStockItems.length}
            icon="alert-triangle"
            color={lowStockItems.length > 0 ? 'warning' : 'success'}
          />
        </section>

        {/* Erreurs */}
        {(errors.load ?? errors.add ?? errors.update ?? errors.delete) && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg" role="alert">
            <p className="text-red-400 text-sm">
              {errors.load?.message ??
                errors.add?.message ??
                errors.update?.message ??
                errors.delete?.message}
            </p>
          </div>
        )}

        {/* Liste des items */}
        <section aria-labelledby="items-heading">
          <div className="flex items-center justify-between mb-6">
            <h2 id="items-heading" className="text-2xl font-bold">
              Items ({items.length})
            </h2>
            <Button
              variant="primary"
              icon={Plus}
              onClick={handleAddItem}
              loading={isLoading.add}
              aria-label="Ajouter un item à ce stock"
            >
              Ajouter un item
            </Button>
          </div>

          {isLoading.load && (
            <div className="flex justify-center py-8" role="status" aria-live="polite">
              <div
                className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"
                aria-hidden="true"
              />
            </div>
          )}

          {!isLoading.load && items.length === 0 && (
            <div className="text-center py-12" role="status">
              <div className="w-12 h-12 mx-auto mb-4 opacity-50">📦</div>
              <p className={themeClasses.textMuted}>Aucun item dans ce stock.</p>
              <Button
                variant="primary"
                icon={Plus}
                onClick={handleAddItem}
                loading={isLoading.add}
                className="mt-4"
              >
                Ajouter le premier item
              </Button>
            </div>
          )}

          {!isLoading.load && items.length > 0 && (
            <ul className="space-y-3" aria-label="Liste des items">
              {items.map(item => (
                <li key={item.id}>
                  <CardWrapper
                    className={`flex items-center justify-between gap-4 ${themeClasses.card}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.label}</p>
                      {item.description && (
                        <p className={`text-sm truncate ${themeClasses.textMuted}`}>
                          {item.description}
                        </p>
                      )}
                      <p className="text-xs mt-1">
                        <span
                          className={
                            item.quantity <= item.minimumStock
                              ? 'text-orange-400'
                              : 'text-green-400'
                          }
                        >
                          {item.quantity <= item.minimumStock ? '⚠ Stock bas' : '✓ OK'}
                        </span>
                        <span className={`ml-2 ${themeClasses.textMuted}`}>
                          Min : {item.minimumStock}
                        </span>
                      </p>
                    </div>

                    <div
                      className="flex items-center gap-2"
                      aria-label={`Quantité : ${item.quantity}`}
                    >
                      <Button
                        variant="ghost"
                        onClick={() => handleUpdateQuantity(item, -1)}
                        loading={isLoading.update}
                        aria-label={`Diminuer la quantité de ${item.label}`}
                      >
                        −
                      </Button>
                      <span className="w-8 text-center font-bold tabular-nums">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        onClick={() => handleUpdateQuantity(item, +1)}
                        loading={isLoading.update}
                        aria-label={`Augmenter la quantité de ${item.label}`}
                      >
                        +
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      icon={Trash2}
                      onClick={() => handleDeleteItem(item.id)}
                      loading={isLoading.delete}
                      aria-label={`Supprimer ${item.label}`}
                    />
                  </CardWrapper>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <FooterWrapper />
    </div>
  );
};
