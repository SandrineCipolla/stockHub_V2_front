import React, { useCallback } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '@/config/authConfig';
import { HeaderWrapper } from '@/components/layout/HeaderWrapper';
import { FooterWrapper } from '@/components/layout/FooterWrapper';
import { ButtonWrapper } from '@/components/common/ButtonWrapper';
import { StockPrediction } from '@/components/ai/StockPrediction';
import { useTheme } from '@/hooks/useTheme';
import type { StockPrediction as StockPredictionData } from '@/utils/mlSimulation';

const DEMO_PREDICTIONS: StockPredictionData[] = [
  {
    stockId: 'demo-1',
    stockName: 'Sauce tomate',
    riskLevel: 'critical',
    daysUntilRupture: 3,
    dateOfRupture: new Date(Date.now() + 3 * 86400000),
    confidence: 87,
    dailyConsumptionRate: 0.7,
    currentQuantity: 2,
    daysUntilRupturePessimistic: 2,
    daysUntilRuptureOptimistic: 4,
    recommendedReorderDate: new Date(Date.now() + 86400000),
    recommendedReorderQuantity: 6,
  },
  {
    stockId: 'demo-2',
    stockName: 'Doliprane 1000mg',
    riskLevel: 'high',
    daysUntilRupture: 8,
    dateOfRupture: new Date(Date.now() + 8 * 86400000),
    confidence: 72,
    dailyConsumptionRate: 0.1,
    currentQuantity: 1,
    daysUntilRupturePessimistic: 6,
    daysUntilRuptureOptimistic: 10,
    recommendedReorderDate: new Date(Date.now() + 3 * 86400000),
    recommendedReorderQuantity: 3,
  },
];

const FEATURES: {
  icon: string;
  color: 'primary' | 'success' | 'warning';
  bgColor: string;
  title: string;
  description: string;
}[] = [
  {
    icon: 'LayoutDashboard',
    color: 'primary',
    bgColor: 'bg-purple-500/10',
    title: 'Tableau de bord temps réel',
    description:
      "Visualisez l'état de tous vos stocks en un coup d'œil : métriques clés, articles en sous-stock, alertes actives — tout sur une seule page.",
  },
  {
    icon: 'Activity',
    color: 'success',
    bgColor: 'bg-green-500/10',
    title: 'Prédictions IA de rupture',
    description:
      "L'analyse prédictive calcule automatiquement les délais avant rupture pour chaque article à risque, classés par niveau de confiance.",
  },
  {
    icon: 'AlertTriangle',
    color: 'warning',
    bgColor: 'bg-amber-500/10',
    title: 'Alertes de réapprovisionnement',
    description:
      'Recevez des recommandations automatiques classées par urgence : articles critiques, en stock bas, ou approchant du seuil minimum.',
  },
  {
    icon: 'Package',
    color: 'primary',
    bgColor: 'bg-purple-500/10',
    title: 'Gestion article par article',
    description:
      'Suivez chaque article avec son statut visuel (OK / Stock bas / Critique / Rupture), sa quantité et son seuil minimum personnalisable.',
  },
  {
    icon: 'Layers',
    color: 'success',
    bgColor: 'bg-green-500/10',
    title: 'Catégories dédiées',
    description:
      'Organisez vos stocks par domaine, chacun avec ses propres articles, métriques et alertes.',
  },
  {
    icon: 'Download',
    color: 'warning',
    bgColor: 'bg-amber-500/10',
    title: 'Export CSV',
    description:
      "Téléchargez votre inventaire complet en CSV pour l'analyser dans vos outils existants ou l'archiver.",
  },
];

const TECH_STACK = [
  'React 19',
  'TypeScript',
  'Node.js 22',
  'Prisma ORM',
  'Azure B2C',
  'Design System Lit',
  'DDD / CQRS',
];

const HERO_STATS = [
  { value: '100%', label: 'Catégories personnalisables' },
  { value: 'IA', label: 'Prédictions de rupture' },
  { value: 'CSV', label: 'Export de données' },
  { value: 'RGPD', label: 'Données hébergées en France' },
];

export const LandingPage: React.FC = () => {
  const { instance } = useMsal();
  const { theme } = useTheme();

  const handleLogin = useCallback(() => {
    instance.loginRedirect(loginRequest).catch(console.error);
  }, [instance]);

  const scrollToFeatures = useCallback(() => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      <HeaderWrapper isLoggedIn={false} />

      <main id="main-content">
        {/* HERO */}
        <section className="text-center px-6 py-24 max-w-4xl mx-auto" aria-labelledby="hero-title">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-300 text-sm font-medium px-4 py-1.5 rounded-full mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" aria-hidden="true" />
            Alimenté par l'IA — Prédit les ruptures avant qu'elles arrivent
          </div>

          <h1
            id="hero-title"
            className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-5 bg-gradient-to-br from-slate-900 dark:from-slate-50 to-purple-600 dark:to-purple-300 bg-clip-text text-transparent"
          >
            Gérez vos stocks familiaux, intelligemment
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-9 leading-relaxed">
            StockHub centralise vos inventaires, anticipe les ruptures et vous alerte au bon moment.
            Fini les produits périmés ou les placards vides.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <ButtonWrapper variant="primary" onClick={handleLogin}>
              Se connecter
            </ButtonWrapper>
            <ButtonWrapper variant="ghost" onClick={scrollToFeatures}>
              Voir les fonctionnalités
            </ButtonWrapper>
          </div>

          <div
            className="flex items-center justify-center gap-8 mt-14 pt-10 border-t border-purple-500/20 flex-wrap"
            aria-label="Statistiques clés"
          >
            {HERO_STATS.map(stat => (
              <div key={stat.value} className="text-center">
                <span className="block text-3xl font-bold text-purple-600 dark:text-purple-400 tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-500 mt-0.5 block">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="px-6 py-20" aria-labelledby="features-title">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-500 mb-3">
                Fonctionnalités
              </p>
              <h2 id="features-title" className="text-4xl font-bold tracking-tight mb-3">
                Tout ce dont vous avez besoin
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-base max-w-lg leading-relaxed">
                De la gestion quotidienne aux alertes intelligentes — StockHub couvre l'ensemble du
                cycle de vie de vos stocks.
              </p>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" role="list">
              {FEATURES.map(feature => (
                <li
                  key={feature.title}
                  className="bg-gray-50 dark:bg-slate-800 border border-purple-500/20 rounded-xl p-7 hover:bg-gray-100 dark:hover:bg-slate-700/50 hover:border-purple-500/50 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 ${feature.bgColor}`}
                    aria-hidden="true"
                  >
                    {React.createElement('sh-icon', {
                      name: feature.icon,
                      size: 'md',
                      color: feature.color,
                    })}
                  </div>
                  <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* DEMO */}
        <section
          className="px-6 py-20 bg-gray-100 dark:bg-slate-800 border-y border-purple-500/20"
          aria-labelledby="demo-title"
        >
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-500 mb-3">
                Prédictions IA
              </p>
              <h2 id="demo-title" className="text-3xl font-bold tracking-tight mb-4">
                Anticipez les ruptures avant qu'elles arrivent
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Le moteur d'analyse calcule en temps réel les délais estimés avant rupture pour
                chaque article, avec un niveau de confiance associé. Vous savez exactement quoi
                réapprovisionner et quand.
              </p>
              <ButtonWrapper variant="ghost" onClick={handleLogin}>
                Essayer avec le compte démo
              </ButtonWrapper>
            </div>

            <div
              className="flex flex-col gap-4"
              aria-label="Exemples de prédictions IA"
              data-theme={theme}
            >
              {DEMO_PREDICTIONS.map(prediction => (
                <StockPrediction
                  key={prediction.stockId}
                  prediction={prediction}
                  showDetails={false}
                />
              ))}
            </div>
          </div>
        </section>

        {/* TECH STACK */}
        <section className="px-6 py-16 text-center" aria-labelledby="stack-title">
          <p
            id="stack-title"
            className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-7"
          >
            Stack technique
          </p>
          <ul className="flex items-center justify-center gap-x-3 gap-y-4 flex-wrap" role="list">
            {TECH_STACK.map(tech => (
              <li key={tech}>
                <span className="bg-gray-100 dark:bg-slate-800 border border-purple-500/20 rounded-full px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:border-purple-500/50 hover:text-slate-900 dark:hover:text-slate-50 transition-colors cursor-default">
                  {tech}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section
          className="px-6 py-20 text-center bg-gradient-to-br from-purple-950 via-purple-900 to-purple-700 border-y border-purple-500/40"
          aria-labelledby="cta-title"
        >
          <h2 id="cta-title" className="text-4xl font-extrabold tracking-tight mb-4">
            Prêt à reprendre le contrôle de vos stocks ?
          </h2>
          <p className="text-white/75 text-lg mb-9 max-w-md mx-auto">
            Connectez-vous et découvrez StockHub avec des données de démonstration déjà en place.
          </p>
          <ButtonWrapper variant="primary" onClick={handleLogin}>
            Accéder à l'application
          </ButtonWrapper>
        </section>
      </main>

      <FooterWrapper />
    </div>
  );
};
