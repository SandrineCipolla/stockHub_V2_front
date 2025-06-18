import React from 'react';
import { Home, ChevronRight, Plus, BarChart3, Search } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import Button from '../ui/Button';

interface NavSectionProps {
    title?: string;
    subtitle?: string;
}

const NavSection: React.FC<NavSectionProps> = ({
                                                   title = "Tableau de Bord",
                                                   subtitle = "Bienvenue dans votre espace de gestion de stocks intelligent"
                                               }) => {
    const { themeClasses } = useTheme();

    return (
        <section className={themeClasses.navSection}>
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Breadcrumb */}
                <nav
                    className="flex items-center gap-2 text-sm mb-6"
                    aria-label="Fil d'Ariane"
                >
                    <Home className="w-4 h-4" />
                    <ChevronRight className="w-4 h-4 opacity-50" />
                    <span className="font-medium">{title}</span>
                </nav>

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{title}</h1>
                        <p className={themeClasses.textMuted}>
                            {subtitle}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button variant="primary" icon={Plus}>
                            Ajouter un Stock
                        </Button>
                        <Button variant="secondary" icon={BarChart3}>
                            Rapport Détaillé
                        </Button>
                        <Button variant="secondary" icon={Search}>
                            Recherche Avancée
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NavSection;