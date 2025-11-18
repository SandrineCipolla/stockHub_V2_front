import React, { useMemo, useState } from 'react';
import { TrendingDown, CheckCircle, Filter, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { HeaderWrapper } from '@/components/layout/HeaderWrapper';
import { NavSection } from '@/components/layout/NavSection';
import { StockPrediction } from '@/components/ai/StockPrediction';
import { ButtonWrapper as Button } from '@/components/common/ButtonWrapper';
import { StatCard } from '@/components/analytics/StatCard';
import { CardWrapper } from '@/components/common/CardWrapper';

import { useStocks } from '@/hooks/useStocks';
import { useTheme } from '@/hooks/useTheme';
import { predictStockRuptures } from '@/utils/mlSimulation';

type RiskFilter = 'all' | 'critical' | 'high' | 'medium' | 'low';

export const Analytics: React.FC = () => {
  const [riskFilter, setRiskFilter] = useState<RiskFilter | null>(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { stocks } = useStocks();

  // Generate all ML predictions
  const allPredictions = useMemo(() => {
    return predictStockRuptures(stocks);
  }, [stocks]);

  // Filter predictions based on selected risk level
  const filteredPredictions = useMemo(() => {
    if (riskFilter === 'all' || riskFilter === null) return allPredictions;
    return allPredictions.filter(p => p.riskLevel === riskFilter);
  }, [allPredictions, riskFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      critical: allPredictions.filter(p => p.riskLevel === 'critical').length,
      high: allPredictions.filter(p => p.riskLevel === 'high').length,
      medium: allPredictions.filter(p => p.riskLevel === 'medium').length,
      low: allPredictions.filter(p => p.riskLevel === 'low').length,
      total: allPredictions.length,
    };
  }, [allPredictions]);

  // Theme classes for elements not migrated to web components
  const themeClasses = {
    background: theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50',
    text: theme === 'dark' ? 'text-white' : 'text-gray-900',
    textMuted: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
  };

  return (
    <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text}`}>
      <HeaderWrapper />

      {/* Navigation Section */}
      <NavSection>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analyses IA & Prédictions</h1>
              <p className={themeClasses.textMuted}>
                Prédictions Machine Learning basées sur régression linéaire (30 jours d'historique
                simulé)
              </p>
            </div>
            <Button variant="ghost" icon={Home} onClick={() => navigate('/')}>
              Retour Dashboard
            </Button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard
              value={stats.total}
              label="Total Stocks"
              riskLevel="default"
              selected={riskFilter === 'all'}
              onClick={() => setRiskFilter('all')}
            />

            <StatCard
              value={stats.critical}
              label="Critique (≤3j)"
              riskLevel="critical"
              selected={riskFilter === 'critical'}
              onClick={() => setRiskFilter('critical')}
            />

            <StatCard
              value={stats.high}
              label="Élevé (4-7j)"
              riskLevel="high"
              selected={riskFilter === 'high'}
              onClick={() => setRiskFilter('high')}
            />

            <StatCard
              value={stats.medium}
              label="Moyen (8-14j)"
              riskLevel="medium"
              selected={riskFilter === 'medium'}
              onClick={() => setRiskFilter('medium')}
            />

            <StatCard
              value={stats.low}
              label="Faible (15j+)"
              riskLevel="low"
              selected={riskFilter === 'low'}
              onClick={() => setRiskFilter('low')}
            />
          </div>
        </div>
      </NavSection>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {riskFilter === 'all' || riskFilter === null
              ? 'Toutes les prédictions'
              : `Prédictions : ${riskFilter}`}
            <span className={themeClasses.textMuted}> ({filteredPredictions.length})</span>
          </h2>

          {riskFilter !== 'all' && riskFilter !== null && (
            <Button variant="ghost" icon={Filter} onClick={() => setRiskFilter(null)}>
              Réinitialiser filtre
            </Button>
          )}
        </div>

        {/* Predictions Grid */}
        {filteredPredictions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPredictions.map(prediction => (
              <StockPrediction
                key={prediction.stockId}
                prediction={prediction}
                showDetails={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-emerald-500 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Aucune prédiction dans cette catégorie</h3>
            <p className={themeClasses.textMuted}>
              {riskFilter === 'critical' && 'Aucun stock en situation critique détecté.'}
              {riskFilter === 'high' && 'Aucun stock à risque élevé détecté.'}
              {riskFilter === 'medium' && 'Aucun stock à risque moyen détecté.'}
              {riskFilter === 'low' && 'Aucun stock à faible risque détecté.'}
            </p>
          </div>
        )}

        {/* Info Box */}
        <CardWrapper variant="info" className="mt-8">
          <div className="flex items-start gap-3 p-6">
            <TrendingDown className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                À propos des prédictions ML
              </h3>
              <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                <p>
                  <strong>Algorithme :</strong> Régression linéaire avec méthode des moindres carrés
                </p>
                <p>
                  <strong>Données :</strong> Simulation de 30 jours d'historique basée sur le status
                  actuel
                </p>
                <p>
                  <strong>Intervalles de confiance :</strong> IC 95% (statistiquement, 95% de
                  probabilité que la vraie valeur soit dans la fourchette)
                </p>
                <p>
                  <strong>Note :</strong> En production avec backend, les prédictions utiliseraient
                  des données historiques réelles pour une précision accrue.
                </p>
              </div>
            </div>
          </div>
        </CardWrapper>
      </main>
    </div>
  );
};
