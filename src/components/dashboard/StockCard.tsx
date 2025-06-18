import React from 'react';
import { Eye, Edit3, Trash2 } from 'lucide-react';
import { StockItem } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { getStatusBadge } from '../ui/Badge';

interface StockCardProps {
    stock: StockItem;
    index: number;
    isLoaded: boolean;
}

const StockCard: React.FC<StockCardProps> = ({ stock, index, isLoaded }) => {
    const { theme, themeClasses } = useTheme();

    return (
        <div
            className={`transform transition-all duration-500 ${
                isLoaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            <Card className="">
                {/* Indicateur de statut - barre simple */}
                <div
                    className={`absolute top-0 left-6 w-12 h-1 rounded-b-full ${
                        stock.status === "optimal"
                            ? "bg-emerald-400"
                            : stock.status === "low"
                                ? "bg-amber-400"
                                : "bg-red-400"
                    }`}
                ></div>

                {/* Header avec nom et statut */}
                <div className="flex items-start justify-between mb-4 pt-2">
                    <div>
                        <h3 className="text-lg font-semibold">{stock.name}</h3>
                        <p className={`text-sm ${themeClasses.textSubtle}`}>
                            Mis à jour il y a {stock.lastUpdate}
                        </p>
                    </div>
                    {(["optimal", "low", "critical"].includes(stock.status) ? getStatusBadge(stock.status) : null)}
                </div>

                {/* Métriques */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold">{stock.quantity}</div>
                        <div
                            className={`text-xs uppercase tracking-wide ${themeClasses.textSubtle}`}
                        >
                            Quantité
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">
                            €{stock.value.toLocaleString()}
                        </div>
                        <div
                            className={`text-xs uppercase tracking-wide ${themeClasses.textSubtle}`}
                        >
                            Valeur
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        icon={Eye}
                        aria-label={`Voir les détails de ${stock.name}`}
                    >
                        Détails
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit3}
                        aria-label={`Modifier ${stock.name}`}
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        className={
                            theme === "dark"
                                ? "text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                : "text-red-600 hover:text-red-700 hover:bg-red-100"
                        }
                        icon={Trash2}
                        aria-label={`Supprimer ${stock.name}`}
                    />
                </div>
            </Card>
        </div>
    );
};

export default StockCard;