import React from 'react';
import {motion} from 'framer-motion';
import {StockCard} from './StockCard';
import type {StockGridProps} from '@/types';

export const StockGrid: React.FC<StockGridProps> = ({
                                                        stocks,
                                                        isLoaded = true,
                                                        onView,
                                                        onEdit,
                                                        onDelete,
                                                        isUpdating = false,
                                                        isDeleting = false,
                                                        className = ''
                                                    }) => {
    return (
        <motion.section
            className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 ${className}`}
            role="region"
            aria-labelledby="stocks-list-heading"
            layout // Animation fluide lors des changements de layout (filtrage/tri)
        >
            <h3 id="stocks-list-heading" className="sr-only">
                Liste des stocks ({stocks.length} éléments)
            </h3>

            {stocks.map((stock, index) => (
                <StockCard
                    key={stock.id}
                    stock={stock}
                    index={index}
                    isLoaded={isLoaded}
                    {...(onView && { onView })}
                    {...(onEdit && { onEdit })}
                    {...(onDelete && { onDelete })}
                    isUpdating={isUpdating}
                    isDeleting={isDeleting}
                />
            ))}
        </motion.section>
    );
};