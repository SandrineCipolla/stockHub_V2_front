// STOCKGRID.TSX CORRIGÉ - Remplace le contenu de src/components/dashboard/StockGrid.tsx par :

import { useRef } from "react"  // ✅ SUPPRIMÉ useState (pas utilisé)
import { StockCard } from "./StockCard"
import type { Stock } from "@/types"

interface StockGridProps {
    stocks: Stock[]
    isLoaded: boolean
    id?: string
}

export function StockGrid({ stocks, isLoaded, id }: StockGridProps) {
    // ✅ CORRIGÉ : Seulement les références (useState supprimé)
    const stockRefs = useRef<(HTMLDivElement | null)[]>([]);

    // ✅ NOUVEAU : Navigation dans la grille avec flèches
    const handleStockKeyDown = (e: React.KeyboardEvent, index: number) => {
        const cols = 3; // 3 colonnes dans xl:grid-cols-3
        const maxIndex = stocks.length - 1;

        switch(e.key) {
            case 'ArrowRight':
                e.preventDefault();
                const nextIndex = Math.min(index + 1, maxIndex);
                stockRefs.current[nextIndex]?.focus();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                const prevIndex = Math.max(index - 1, 0);
                stockRefs.current[prevIndex]?.focus();
                break;
            case 'ArrowDown':
                e.preventDefault();
                const downIndex = Math.min(index + cols, maxIndex);
                stockRefs.current[downIndex]?.focus();
                break;
            case 'ArrowUp':
                e.preventDefault();
                const upIndex = Math.max(index - cols, 0);
                stockRefs.current[upIndex]?.focus();
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                handleStockDetails(stocks[index]);
                break;
        }
    };

    // ✅ NOUVEAU : Gestionnaire pour ouvrir les détails
    const handleStockDetails = (stock: Stock) => {
        console.log('📦 Ouvrir détails stock:', stock.name, '(ID:', stock.id, ')');
        // Ici tu ajouteras ta logique d'ouverture des détails
        // Exemple : router.push(`/stocks/${stock.id}`)
    };

    return (
        <section
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            aria-label="Liste des stocks disponibles, navigable avec le clavier"
            id={id}
        >
            {stocks.map((stock, index) => (
                <div
                    key={stock.id}
                    ref={(el) => { stockRefs.current[index] = el; }}  // ✅ CORRIGÉ : Fonction void
                    tabIndex={0}
                    role="button"
                    className={`
                        cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-xl
                        transform transition-all duration-500
                        ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
                    `}
                    style={{ transitionDelay: `${index * 150}ms` }}
                    onClick={() => handleStockDetails(stock)}
                    onKeyDown={(e) => handleStockKeyDown(e, index)}
                    aria-label={`Stock ${stock.name}, quantité: ${stock.quantity} unités, valeur: ${stock.value} euros, statut: ${stock.status}. Utilisez les flèches pour naviguer, Entrée pour consulter les détails.`}
                >
                    <StockCard
                        stock={stock}
                        index={index}
                        isLoaded={isLoaded}
                    />
                </div>
            ))}
        </section>
    )
}