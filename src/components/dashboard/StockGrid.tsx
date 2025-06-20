import React from 'react';
import { StockCard } from './StockCard';
import type { Stock } from '@/types';

// Types pour les props du composant
interface StockGridProps {
    stocks: Stock[];
    isLoaded?: boolean;
    onView?: (stockId: number) => void;
    onEdit?: (stockId: number) => void;
    onDelete?: (stockId: number) => void;
    isUpdating?: boolean;
    isDeleting?: boolean;
    className?: string;
}

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
        <section
            className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 ${className}`}
            role="region"
            aria-labelledby="stocks-list-heading"
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
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isUpdating={isUpdating}
                    isDeleting={isDeleting}
                />
            ))}
        </section>
    );
};