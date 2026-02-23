import React from 'react';
import { Home } from 'lucide-react';
import { HeaderWrapper } from '@/components/layout/HeaderWrapper';
import { NavSection } from '@/components/layout/NavSection';
import { FooterWrapper } from '@/components/layout/FooterWrapper';
import { useTheme } from '@/hooks/useTheme';

export const Privacy: React.FC = () => {
  const { theme } = useTheme();

  const themeClasses = {
    background: theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50',
    text: theme === 'dark' ? 'text-white' : 'text-gray-900',
    textMuted: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    card: theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200',
    cardHeading: theme === 'dark' ? 'text-purple-300' : 'text-purple-700',
    tableHead: theme === 'dark' ? 'bg-slate-700 text-gray-200' : 'bg-gray-100 text-gray-700',
    tableRow: theme === 'dark' ? 'border-slate-700' : 'border-gray-200',
  };

  return (
    <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text}`}>
      <HeaderWrapper />

      <NavSection
        breadcrumbs={[
          { icon: Home, href: '/', label: 'Accueil' },
          { label: 'Politique de confidentialité', current: true },
        ]}
      >
        <h1 className="text-3xl font-bold mb-2">Politique de confidentialité</h1>
        <p className={themeClasses.textMuted}>
          Informations sur la collecte et le traitement de vos données personnelles.
        </p>
      </NavSection>

      <main id="main-content" className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Responsable du traitement */}
        <section
          className={`rounded-lg border p-6 ${themeClasses.card}`}
          aria-labelledby="responsable-heading"
        >
          <h2
            id="responsable-heading"
            className={`text-xl font-semibold mb-4 ${themeClasses.cardHeading}`}
          >
            Responsable du traitement
          </h2>
          <p className={`text-sm ${themeClasses.textMuted}`}>
            <strong className={themeClasses.text}>StockHub V2</strong> — projet personnel développé
            par Sandrine Cipolla dans le cadre du titre RNCP7 Expert en Ingénierie Logicielle. Ce
            projet est à vocation pédagogique et non commerciale.
          </p>
          <p className={`text-sm mt-2 ${themeClasses.textMuted}`}>
            Contact :{' '}
            <a
              href="https://github.com/SandrineCipolla/stockHub_V2_front/issues"
              className={`underline ${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Issues
            </a>
          </p>
        </section>

        {/* Données collectées */}
        <section
          className={`rounded-lg border p-6 ${themeClasses.card}`}
          aria-labelledby="donnees-heading"
        >
          <h2
            id="donnees-heading"
            className={`text-xl font-semibold mb-4 ${themeClasses.cardHeading}`}
          >
            Données collectées
          </h2>

          <h3 className={`font-medium mb-2 ${themeClasses.text}`}>
            Authentification — Azure AD B2C
          </h3>
          <p className={`text-sm mb-4 ${themeClasses.textMuted}`}>
            L'authentification est gérée par Microsoft Azure AD B2C. Les données traitées
            (identifiant de session, token d'accès) sont strictement nécessaires au fonctionnement
            du service. Aucun consentement supplémentaire n'est requis pour ces traitements (base
            légale : exécution du contrat / intérêt légitime).
          </p>

          <h3 className={`font-medium mb-2 ${themeClasses.text}`}>
            Mesure d'audience — Azure Application Insights
          </h3>
          <p className={`text-sm mb-4 ${themeClasses.textMuted}`}>
            Avec votre consentement, Azure Application Insights collecte des données de performance
            anonymisées : pages visitées, temps de chargement, erreurs JavaScript. Aucune donnée
            personnelle identifiante n'est collectée. Ces données sont hébergées dans l'Union
            Européenne.
          </p>
        </section>

        {/* Tableau récapitulatif */}
        <section
          className={`rounded-lg border p-6 ${themeClasses.card}`}
          aria-labelledby="tableau-heading"
        >
          <h2
            id="tableau-heading"
            className={`text-xl font-semibold mb-4 ${themeClasses.cardHeading}`}
          >
            Récapitulatif des traitements
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Tableau des traitements de données">
              <thead>
                <tr className={themeClasses.tableHead}>
                  <th className="text-left px-4 py-2 font-medium">Donnée / Cookie</th>
                  <th className="text-left px-4 py-2 font-medium">Finalité</th>
                  <th className="text-left px-4 py-2 font-medium">Base légale</th>
                  <th className="text-left px-4 py-2 font-medium">Consentement requis</th>
                </tr>
              </thead>
              <tbody>
                <tr className={`border-t ${themeClasses.tableRow}`}>
                  <td className="px-4 py-2">Token Azure B2C (localStorage)</td>
                  <td className={`px-4 py-2 ${themeClasses.textMuted}`}>Authentification</td>
                  <td className={`px-4 py-2 ${themeClasses.textMuted}`}>Strictement nécessaire</td>
                  <td className="px-4 py-2 text-emerald-500 font-medium">Non</td>
                </tr>
                <tr className={`border-t ${themeClasses.tableRow}`}>
                  <td className="px-4 py-2">stockhub_consent (localStorage)</td>
                  <td className={`px-4 py-2 ${themeClasses.textMuted}`}>Mémorisation du choix</td>
                  <td className={`px-4 py-2 ${themeClasses.textMuted}`}>Strictement nécessaire</td>
                  <td className="px-4 py-2 text-emerald-500 font-medium">Non</td>
                </tr>
                <tr className={`border-t ${themeClasses.tableRow}`}>
                  <td className="px-4 py-2">Azure Application Insights</td>
                  <td className={`px-4 py-2 ${themeClasses.textMuted}`}>Mesure de performance</td>
                  <td className={`px-4 py-2 ${themeClasses.textMuted}`}>Consentement</td>
                  <td className="px-4 py-2 text-amber-500 font-medium">Oui</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Durée de conservation */}
        <section
          className={`rounded-lg border p-6 ${themeClasses.card}`}
          aria-labelledby="duree-heading"
        >
          <h2
            id="duree-heading"
            className={`text-xl font-semibold mb-4 ${themeClasses.cardHeading}`}
          >
            Durée de conservation
          </h2>
          <ul className={`text-sm space-y-2 list-disc list-inside ${themeClasses.textMuted}`}>
            <li>Tokens Azure B2C : durée de la session (expiration automatique, max 1 heure)</li>
            <li>Préférence de consentement (localStorage) : jusqu'à effacement du navigateur</li>
            <li>Données Application Insights : 90 jours (politique Microsoft par défaut)</li>
          </ul>
        </section>

        {/* Droits RGPD */}
        <section
          className={`rounded-lg border p-6 ${themeClasses.card}`}
          aria-labelledby="droits-heading"
        >
          <h2
            id="droits-heading"
            className={`text-xl font-semibold mb-4 ${themeClasses.cardHeading}`}
          >
            Vos droits (RGPD)
          </h2>
          <p className={`text-sm mb-3 ${themeClasses.textMuted}`}>
            Conformément au Règlement Général sur la Protection des Données (RGPD — UE 2016/679),
            vous disposez des droits suivants :
          </p>
          <ul className={`text-sm space-y-1 list-disc list-inside ${themeClasses.textMuted}`}>
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement (« droit à l'oubli »)</li>
            <li>Droit de retirer votre consentement à tout moment</li>
            <li>Droit d'introduire une réclamation auprès de la CNIL</li>
          </ul>
          <p className={`text-sm mt-4 ${themeClasses.textMuted}`}>
            Pour exercer ces droits :{' '}
            <a
              href="https://github.com/SandrineCipolla/stockHub_V2_front/issues"
              className={`underline ${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800'}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              créer une issue sur GitHub
            </a>
            . Pour retirer votre consentement Analytics, effacez la clé{' '}
            <code className="font-mono text-xs bg-slate-700 px-1 rounded">stockhub_consent</code>{' '}
            dans le localStorage de votre navigateur.
          </p>
        </section>
      </main>

      <FooterWrapper />
    </div>
  );
};
