import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {Edit3, Eye, Trash2, Palette} from 'lucide-react';
import {Button} from '@/components/common/Button';
import {StatusBadge} from '@/components/common/StatusBadge';
import {StockAIBadge} from '@/components/ai/StockAIBadge';
import {useTheme} from '@/hooks/useTheme.ts';
import {useReducedMotion} from '@/hooks/useReducedMotion';
import {STOCK_STATUS_CONFIG, type StockStatus} from '@/types/stock';
import {STOCK_CARD_ANIMATION, REDUCED_MOTION_DURATION} from '@/constants/animations';
import {formatQuantityWithUnit} from '@/utils/unitFormatter';
import {getContainerLabel, recordUsage} from '@/utils/containerManager';
import type {StockCardProps} from '@/types';

export const StockCard: React.FC<StockCardProps> = ({
                                                        stock,
                                                        index = 0,
                                                        onView,
                                                        onEdit,
                                                        onDelete,
                                                        isUpdating = false,
                                                        isDeleting = false,
                                                        className = '',
                                                        aiSuggestions = []
                                                    }) => {
    const { theme } = useTheme();
    const prefersReducedMotion = useReducedMotion();
    const [localStock, setLocalStock] = useState(stock);
    const [actionFeedback, setActionFeedback] = useState<string | null>(null);

    const statusConfig = STOCK_STATUS_CONFIG[localStock.status];
    const statusColors = theme === 'dark' ? statusConfig.colors.dark : statusConfig.colors.light;

    const themeClasses = {
        textSubtle: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    };

    // Handler pour enregistrer une session d'utilisation
    const handleRecordSession = () => {
        if (localStock.unit !== 'percentage') return;

        try {
            const result = recordUsage(localStock);
            setLocalStock({
                ...localStock,
                quantity: result.newQuantity,
            });
            setActionFeedback(`🎨 ${result.message}`);
            setTimeout(() => setActionFeedback(null), 3000);
        } catch (error) {
            setActionFeedback(`❌ ${(error as Error).message}`);
            setTimeout(() => setActionFeedback(null), 3000);
        }
    };

    // Vérifier si c'est un stock avec containers (peinture)
    const hasContainers = localStock.unit === 'percentage' && localStock.containerCapacity !== undefined;

    const borderColorMap: Record<StockStatus, string> = {
        optimal: 'border-l-emerald-500/30 hover:border-l-emerald-500/50',
        low: 'border-l-amber-500/30 hover:border-l-amber-500/50',
        critical: 'border-l-red-500/40 hover:border-l-red-500/60',
        outOfStock: 'border-l-gray-500/50 hover:border-l-gray-500/70',
        overstocked: 'border-l-blue-500/30 hover:border-l-blue-500/50'
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: prefersReducedMotion ? 0 : STOCK_CARD_ANIMATION.INITIAL_Y_OFFSET,
            scale: prefersReducedMotion ? 1 : STOCK_CARD_ANIMATION.INITIAL_SCALE,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: prefersReducedMotion ? REDUCED_MOTION_DURATION : STOCK_CARD_ANIMATION.ENTRANCE_DURATION,
                delay: prefersReducedMotion ? 0 : index * STOCK_CARD_ANIMATION.CASCADE_DELAY,
                ease: STOCK_CARD_ANIMATION.EASING,
            },
        },
        exit: {
            opacity: 0,
            y: prefersReducedMotion ? 0 : STOCK_CARD_ANIMATION.EXIT_Y_OFFSET,
            scale: prefersReducedMotion ? 1 : STOCK_CARD_ANIMATION.EXIT_SCALE,
            transition: {
                duration: prefersReducedMotion ? REDUCED_MOTION_DURATION : STOCK_CARD_ANIMATION.EXIT_DURATION,
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
            layout
            whileHover={
                prefersReducedMotion
                    ? undefined
                    : {
                          scale: STOCK_CARD_ANIMATION.HOVER_SCALE,
                          y: STOCK_CARD_ANIMATION.HOVER_Y_OFFSET,
                          transition: {
                              duration: STOCK_CARD_ANIMATION.HOVER_DURATION,
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
                                  duration: STOCK_CARD_ANIMATION.HOVER_DURATION,
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
                    <div className="flex flex-col items-end gap-2">
                        <StatusBadge status={stock.status} size="sm" />
                        {aiSuggestions.length > 0 && (
                            <StockAIBadge
                                stockId={stock.id}
                                suggestions={aiSuggestions}
                            />
                        )}
                    </div>
                </header>

                {/* Métriques avec description accessible */}
                <div className="grid grid-cols-2 gap-4 mb-6" role="group" aria-label="Informations du stock">
                    <div className="text-center">
                        <div
                            className="text-2xl font-bold"
                            aria-label={`Quantité: ${formatQuantityWithUnit(localStock.quantity, localStock.unit)}`}
                        >
                            {formatQuantityWithUnit(localStock.quantity, localStock.unit)}
                        </div>
                        {/* Affichage nombre de containers pour unités en % */}
                        {localStock.unit === 'percentage' && localStock.containersOwned !== undefined && localStock.containersOwned > 0 && (
                            <div className={`text-xs ${themeClasses.textSubtle} mt-1`}>
                                {getContainerLabel(localStock.containersOwned)}
                            </div>
                        )}
                        <div className={`text-xs uppercase tracking-wide ${themeClasses.textSubtle} ${localStock.unit === 'percentage' && localStock.containersOwned ? '' : 'mt-1'}`}>
                            Quantité
                        </div>
                    </div>
                    <div className="text-center">
                        <div
                            className="text-2xl font-bold"
                            aria-label={`Valeur: ${localStock.value} euros`}
                        >
                            €{localStock.value.toLocaleString()}
                        </div>
                        <div className={`text-xs uppercase tracking-wide ${themeClasses.textSubtle}`}>
                            Valeur
                        </div>
                    </div>
                </div>

                {/* Action usage - uniquement pour les tubes */}
                {hasContainers && (
                    <div className="flex gap-2 mb-3" role="group" aria-label="Actions containers">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`flex-1 ${
                                theme === 'dark'
                                    ? 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/20'
                                    : 'text-purple-600 hover:text-purple-700 hover:bg-purple-100'
                            }`}
                            icon={Palette}
                            onClick={handleRecordSession}
                            aria-label="Enregistrer session de peinture"
                        >
                            Enregistrer session
                        </Button>
                    </div>
                )}

                {/* Feedback visuel des actions */}
                {actionFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`text-xs p-2 rounded mb-3 ${
                            theme === 'dark'
                                ? 'bg-white/10 text-gray-300'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                        {actionFeedback}
                    </motion.div>
                )}

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