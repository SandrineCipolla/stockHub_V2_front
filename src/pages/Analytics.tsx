import React, { useMemo, useState } from 'react';
import { TrendingDown, CheckCircle, Filter, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { HeaderWrapper } from '@/components/layout/HeaderWrapper';
import { NavSection } from '@/components/layout/NavSection';
import { StockPrediction } from '@/components/ai/StockPrediction';
import { ButtonWrapper as Button } from '@/components/common/ButtonWrapper';

import { useStocks } from '@/hooks/useStocks';
import { useTheme } from '@/hooks/useTheme';
import { predictStockRuptures } from '@/utils/mlSimulation';

type RiskFilter = 'all' | 'critical' | 'high' | 'medium' | 'low';

export const Analytics: React.FC = () => {
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('all');
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { stocks } = useStocks();

  // Generate all ML predictions
  const allPredictions = useMemo(() => {
    return predictStockRuptures(stocks);
  }, [stocks]);

  // Filter predictions based on selected risk level
  const filteredPredictions = useMemo(() => {
    if (riskFilter === 'all') return allPredictions;
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
                Prédictions Machine Learning basées sur régression linéaire (30 jours d'historique simulé)
              </p>
            </div>
            <Button
              variant="ghost"
              icon={Home}
              onClick={() => navigate('/')}
            >
              Retour Dashboard
            </Button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button
              onClick={() => setRiskFilter('all')}
              className={`p-4 rounded-lg border-2 transition-all ${
                riskFilter === 'all'
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total Stocks</div>
            </button>

            <button
              onClick={() => setRiskFilter('critical')}
              className={`p-4 rounded-lg border-2 transition-all ${
                riskFilter === 'critical'
                  ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.critical}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Critique (≤3j)</div>
            </button>

            <button
              onClick={() => setRiskFilter('high')}
              className={`p-4 rounded-lg border-2 transition-all ${
                riskFilter === 'high'
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.high}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Élevé (4-7j)</div>
            </button>

            <button
              onClick={() => setRiskFilter('medium')}
              className={`p-4 rounded-lg border-2 transition-all ${
                riskFilter === 'medium'
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.medium}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Moyen (8-14j)</div>
            </button>

            <button
              onClick={() => setRiskFilter('low')}
              className={`p-4 rounded-lg border-2 transition-all ${
                riskFilter === 'low'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.low}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Faible (15j+)</div>
            </button>
          </div>
        </div>
      </NavSection>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {riskFilter === 'all' ? 'Toutes les prédictions' : `Prédictions : ${riskFilter}`}
            <span className={themeClasses.textMuted}> ({filteredPredictions.length})</span>
          </h2>

          {riskFilter !== 'all' && (
            <Button
              variant="ghost"
              icon={Filter}
              onClick={() => setRiskFilter('all')}
            >
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
        <div className="mt-8 p-6 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
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
                  <strong>Données :</strong> Simulation de 30 jours d'historique basée sur le status actuel
                </p>
                <p>
                  <strong>Intervalles de confiance :</strong> IC 95% (statistiquement, 95% de probabilité que la vraie valeur soit dans la fourchette)
                </p>
                <p>
                  <strong>Note :</strong> En production avec backend, les prédictions utiliseraient des données historiques réelles pour une précision accrue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
