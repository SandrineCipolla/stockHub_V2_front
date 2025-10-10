import React from 'react';
import {motion} from 'framer-motion';
import {Edit3, Eye, Trash2} from 'lucide-react';
import {Button} from '@/components/common/Button';
import {StatusBadge} from '@/components/common/StatusBadge';
import {useTheme} from '@/hooks/useTheme.ts';
import {useReducedMotion} from '@/hooks/useReducedMotion';
import {STOCK_STATUS_CONFIG, type StockStatus} from '@/types/stock';
import type {StockCardProps} from '@/types';

export const StockCard: React.FC<StockCardProps> = ({
                                                        stock,
                                                        index = 0,
                                                        onView,
                                                        onEdit,
                                                        onDelete,
                                                        isUpdating = false,
                                                        isDeleting = false,
                                                        className = ''
                                                    }) => {
    const { theme } = useTheme();
    const prefersReducedMotion = useReducedMotion();

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

    // Animations Framer Motion
    const cardVariants = {
        hidden: {
            opacity: 0,
            y: prefersReducedMotion ? 0 : 50, // Plus de mouvement vertical
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: prefersReducedMotion ? 0.01 : 0.8, // Animation plus lente
                delay: prefersReducedMotion ? 0 : index * 0.15, // Délai échelonné plus visible
                ease: [0.25, 0.46, 0.45, 0.94] as const, // easeOutQuad
            },
        },
        exit: {
            opacity: 0,
            y: prefersReducedMotion ? 0 : -16,
            transition: {
                duration: prefersReducedMotion ? 0.01 : 0.3,
                ease: 'easeOut' as const,
            },
        },
    };

    // Mapping des couleurs de fond par statut pour Framer Motion
    const getHoverBackground = () => {
        // En mode light, on utilise une opacité plus forte car le background est blanc
        const opacity = theme === 'dark' ? 0.1 : 0.15;

        const colorMap = {
            optimal: `rgb(16 185 129 / ${opacity})`,     // emerald-500
            low: `rgb(245 158 11 / ${opacity})`,         // amber-500
            critical: `rgb(239 68 68 / ${opacity})`,     // red-500
            outOfStock: `rgb(107 114 128 / ${opacity})`, // gray-500
            overstocked: `rgb(59 130 246 / ${opacity})`  // blue-500
        };
        return colorMap[stock.status];
    };

    const cardBaseClasses = theme === 'dark'
        ? "bg-white/5 border-white/10"
        : "bg-white/80 border-gray-200 shadow-sm";

    return (
        <motion.article
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileHover={
                prefersReducedMotion
                    ? undefined
                    : {
                          scale: 1.02,
                          y: -4,
                          transition: {
                              duration: 0.2,
                              ease: 'easeOut' as const,
                          },
                      }
            }
            className={className}
            aria-labelledby={`stock-${stock.id}-name`}
        >
            <motion.div
                className={`
                    ${cardBaseClasses}
                    backdrop-blur-sm border rounded-xl p-6
                    border-l-4 ${borderColorMap[stock.status]}
                    transition-all duration-200 h-full relative
                `}
                whileHover={
                    prefersReducedMotion
                        ? undefined
                        : {
                              backgroundColor: getHoverBackground(),
                              transition: {
                                  duration: 0.2,
                              },
                          }
                }
            >
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
            </motion.div>
        </motion.article>
    );
};