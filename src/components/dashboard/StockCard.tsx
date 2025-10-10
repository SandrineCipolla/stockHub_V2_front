import React from 'react';
import {Edit3, Eye, Trash2} from 'lucide-react';
import {Card} from '@/components/common/Card';
import {Button} from '@/components/common/Button';
import {StatusBadge} from '@/components/common/StatusBadge';
import {useTheme} from '@/hooks/useTheme.ts';
import {STOCK_STATUS_CONFIG, type StockStatus} from '@/types/stock';
import type {StockCardProps} from '@/types';

export const StockCard: React.FC<StockCardProps> = ({
                                                        stock,
                                                        index = 0,
                                                        isLoaded = true,
                                                        onView,
                                                        onEdit,
                                                        onDelete,
                                                        isUpdating = false,
                                                        isDeleting = false,
                                                        className = ''
                                                    }) => {
    const { theme } = useTheme();

    // Récupération de la config du statut pour les couleurs
    const statusConfig = STOCK_STATUS_CONFIG[stock.status];
    const statusColors = theme === 'dark' ? statusConfig.colors.dark : statusConfig.colors.light;

    const themeClasses = {
        textSubtle: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    };

    // Mapping des couleurs de bordure par statut (fixe, ne change pas au hover)
    const borderColorMap: Record<StockStatus, string> = {
        optimal: 'border-l-emerald-500/30 hover:border-l-emerald-500/50',
        low: 'border-l-amber-500/30 hover:border-l-amber-500/50',
        critical: 'border-l-red-500/40 hover:border-l-red-500/60',
        outOfStock: 'border-l-gray-500/50 hover:border-l-gray-500/70',
        overstocked: 'border-l-blue-500/30 hover:border-l-blue-500/50'
    };

    // Mapping des couleurs de fond par statut (uniquement au hover)
    const backgroundColorMap: Record<StockStatus, string> = {
        optimal: 'hover:bg-emerald-500/10',
        low: 'hover:bg-amber-500/10',
        critical: 'hover:bg-red-500/10',
        outOfStock: 'hover:bg-gray-500/10',
        overstocked: 'hover:bg-blue-500/10'
    };

    return (
        <article
            className={`transform transition-all duration-500 ${
                isLoaded
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
            } ${className}`}
            style={{ transitionDelay: `${index * 150}ms` }}
            aria-labelledby={`stock-${stock.id}-name`}
        >
            <Card className={`
                border-l-4 ${borderColorMap[stock.status]}
                ${backgroundColorMap[stock.status]}
                transition-colors duration-200
            `}>
                {/* Indicateur de statut accessible avec couleurs dynamiques */}
                <div
                    className={`absolute top-0 left-6 w-12 h-1 rounded-b-full ${statusColors.border} ${
                        statusConfig.animate ? 'animate-pulse' : ''
                    }`}
                    aria-label={`Statut du stock: ${statusConfig.label}`}
                />

                {/* Header avec nom et statut */}
                <header className="flex items-start justify-between mb-4 pt-2">
                    <div>
                        <h3 id={`stock-${stock.id}-name`} className="text-lg font-semibold">
                            {stock.name}
                        </h3>
                        <p className={`text-sm ${themeClasses.textSubtle}`}>
                            Mis à jour il y a {stock.lastUpdate}
                        </p>
                        {stock.category && (
                            <p className={`text-xs ${themeClasses.textSubtle} mt-1`}>
                                Catégorie: {stock.category}
                            </p>
                        )}
                    </div>
                    {/* ✨ Utilisation du nouveau StatusBadge */}
                    <StatusBadge status={stock.status} size="sm" />
                </header>

                {/* Métriques avec description accessible */}
                <div className="grid grid-cols-2 gap-4 mb-6" role="group" aria-label="Informations du stock">
                    <div className="text-center">
                        <div
                            className="text-2xl font-bold"
                            aria-label={`Quantité: ${stock.quantity} unités`}
                        >
                            {stock.quantity}
                        </div>
                        <div className={`text-xs uppercase tracking-wide ${themeClasses.textSubtle}`}>
                            Quantité
                        </div>
                    </div>
                    <div className="text-center">
                        <div
                            className="text-2xl font-bold"
                            aria-label={`Valeur: ${stock.value} euros`}
                        >
                            €{stock.value.toLocaleString()}
                        </div>
                        <div className={`text-xs uppercase tracking-wide ${themeClasses.textSubtle}`}>
                            Valeur
                        </div>
                    </div>
                </div>

                {/* Actions avec labels accessibles */}
                <div className="flex gap-2" role="group" aria-label={`Actions pour ${stock.name}`}>
                    {onView && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1"
                            icon={Eye}
                            onClick={() => onView(stock.id)}
                            aria-label={`Voir les détails de ${stock.name}`}
                        >
                            Détails
                        </Button>
                    )}

                    {onEdit && (
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={Edit3}
                            onClick={() => onEdit(stock.id)}
                            loading={isUpdating}
                            disabled={isUpdating || isDeleting}
                            aria-label={`Modifier ${stock.name}`}
                        />
                    )}

                    {onDelete && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className={
                                theme === 'dark'
                                    ? 'text-red-400 hover:text-red-300 hover:bg-red-500/20'
                                    : 'text-red-600 hover:text-red-700 hover:bg-red-100'
                            }
                            icon={Trash2}
                            onClick={() => onDelete(stock.id)}
                            loading={isDeleting}
                            disabled={isUpdating || isDeleting}
                            aria-label={`Supprimer ${stock.name}`}
                        />
                    )}
                </div>
            </Card>
        </article>
    );
};