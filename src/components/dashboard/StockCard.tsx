import React from 'react';
import {Edit3, Eye, Trash2} from 'lucide-react';
import {Card} from '@/components/common/Card';
import {Button} from '@/components/common/Button';
import {Badge} from '@/components/common/Badge';
import {useTheme} from '@/hooks/useTheme.ts';
import type {StockCardProps, StockStatus} from '@/types';

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

    const themeClasses = {
        textSubtle: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    };

    const getStatusBadge = (status: StockStatus): React.ReactElement => {
        const statusMap: Record<StockStatus, { variant: 'success' | 'warning' | 'danger'; label: string }> = {
            optimal: { variant: 'success', label: 'Optimal' },
            low: { variant: 'warning', label: 'Faible' },
            critical: { variant: 'danger', label: 'Critique' },
        };

        const { variant, label } = statusMap[status];
        return <Badge variant={variant}>{label}</Badge>;
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
            <Card>
                {/* Indicateur de statut accessible */}
                <div
                    className={`absolute top-0 left-6 w-12 h-1 rounded-b-full ${
                        stock.status === 'optimal'
                            ? 'bg-emerald-400'
                            : stock.status === 'low'
                                ? 'bg-amber-400'
                                : 'bg-red-400'
                    }`}
                    aria-label={`Statut du stock: ${stock.status}`}
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
                    {getStatusBadge(stock.status)}
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