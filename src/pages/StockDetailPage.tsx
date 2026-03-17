import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';

import { HeaderWrapper } from '@/components/layout/HeaderWrapper';
import { FooterWrapper } from '@/components/layout/FooterWrapper';
import { NavSection } from '@/components/layout/NavSection';
import { CardWrapper } from '@/components/common/CardWrapper';
import { ButtonWrapper as Button } from '@/components/common/ButtonWrapper';
import { MetricCardWrapper } from '@/components/dashboard/MetricCardWrapper';
import { StockFormModal } from '@/components/stocks/StockFormModal';

import { useStockDetail } from '@/hooks/useStockDetail';
import { useTheme } from '@/hooks/useTheme';
import { computePredictions } from '@/utils/stockPredictions';

export const StockDetailPage: React.FC = () => {
  const { stockId } = useParams<{ stockId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const numericId = Number(stockId);
  const { stock, isLoading, error, refetch } = useStockDetail(numericId);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const themeClasses = {
    background: theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50',
    text: theme === 'dark' ? 'text-white' : 'text-gray-900',
    textMuted: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
  };

  if (isLoading) {
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

  if (error || !stock) {
    return (
      <main
        className={`min-h-screen ${themeClasses.background} ${themeClasses.text} flex items-center justify-center`}
        role="alert"
      >
        <CardWrapper className="max-w-md text-center">
          <h2 className="text-xl font-bold mb-4">Stock introuvable</h2>
          <p className={`${themeClasses.textMuted} mb-4`}>
            {error ?? 'Le stock demandé n\u2019existe pas ou vous n\u2019y avez pas accès.'}
          </p>
          <Button onClick={() => navigate('/')}>Retour au tableau de bord</Button>
        </CardWrapper>
      </main>
    );
  }

  const predictions = computePredictions(stock.items);

  return (
    <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text}`}>
      <HeaderWrapper />

      <NavSection>
        <div className="flex flex-wrap items-center gap-4">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate('/')}
            aria-label="Retour au tableau de bord"
          >
            Retour
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold truncate">{stock.label}</h1>
            <p className={themeClasses.textMuted}>
              {stock.category ?? 'Sans catégorie'}
              {stock.description ? ` — ${stock.description}` : ''}
            </p>
          </div>
          <Button
            variant="secondary"
            icon={Edit}
            onClick={() => setIsEditOpen(true)}
            aria-label="Modifier ce stock"
          >
            Modifier le stock
          </Button>
        </div>
      </NavSection>

      <main id="main-content" className="max-w-7xl mx-auto px-6 py-8" role="main">
        {/* Métriques agrégées */}
        <section
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          aria-labelledby="metrics-heading"
        >
          <h2 id="metrics-heading" className="sr-only">
            Métriques du stock
          </h2>
          <MetricCardWrapper
            title="Nombre d'items"
            value={stock.totalItems}
            icon="package"
            color="info"
          />
          <MetricCardWrapper
            title="Quantité totale"
            value={stock.totalQuantity}
            icon="trending-up"
            color="success"
          />
          <MetricCardWrapper
            title="Items critiques"
            value={stock.criticalItemsCount}
            icon="alert-triangle"
            color={stock.criticalItemsCount > 0 ? 'warning' : 'success'}
          />
        </section>

        {/* Prédictions IA */}
        {predictions.length > 0 && (
          <section className="mb-10" aria-labelledby="predictions-heading">
            <h2 id="predictions-heading" className="text-2xl font-bold mb-4">
              Alertes intelligentes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictions.map(pred =>
                React.createElement('sh-stock-prediction-card', {
                  key: pred.stockId,
                  'stock-name': pred.stockName,
                  'stock-id': pred.stockId,
                  'risk-level': pred.riskLevel,
                  'days-until-rupture': pred.daysUntilRupture ?? undefined,
                  confidence: pred.confidence,
                  'daily-consumption-rate': pred.dailyConsumptionRate,
                  'current-quantity': pred.currentQuantity,
                  'recommended-reorder-quantity': pred.recommendedReorderQuantity,
                  'show-details': true,
                  'data-theme': theme,
                })
              )}
            </div>
          </section>
        )}

        {/* Liste des items */}
        <section aria-labelledby="items-heading">
          <h2 id="items-heading" className="text-2xl font-bold mb-6">
            Items ({stock.totalItems})
          </h2>

          {stock.items.length === 0 ? (
            <div className="text-center py-12" role="status">
              <div className="w-12 h-12 mx-auto mb-4 opacity-50">📦</div>
              <p className={themeClasses.textMuted}>Ce stock ne contient pas encore d'items.</p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-label="Liste des items">
              {stock.items.map(item => (
                <li key={item.id}>
                  {React.createElement('sh-stock-item-card', {
                    name: item.label,
                    sku: String(item.id),
                    quantity: item.quantity,
                    status: item.status,
                    location: item.description,
                    'data-theme': theme,
                  })}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <FooterWrapper />

      {isEditOpen && (
        <StockFormModal
          mode="edit"
          stock={stock}
          onSuccess={() => {
            void refetch();
            setIsEditOpen(false);
          }}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </div>
  );
};
