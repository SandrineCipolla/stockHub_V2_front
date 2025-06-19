import { useRef } from "react"
import { StockCard } from "./StockCard"
import type { Stock } from "@/types"

interface StockGridProps {
    stocks: Stock[]
    isLoaded: boolean
    id?: string
}

export function StockGrid({ stocks, isLoaded, id }: StockGridProps) {
    const stockRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Navigation dans la grille avec flèches
    const handleStockKeyDown = (e: React.KeyboardEvent, index: number) => {
        const cols = 3; // 3 colonnes dans xl:grid-cols-3
        const maxIndex = stocks.length - 1;

        switch(e.key) {
            case 'ArrowRight': {
                e.preventDefault();
                const nextIndex = Math.min(index + 1, maxIndex);
                stockRefs.current[nextIndex]?.focus();
                break;
            }
            case 'ArrowLeft': {
                e.preventDefault();
                const prevIndex = Math.max(index - 1, 0);
                stockRefs.current[prevIndex]?.focus();
                break;
            }
            case 'ArrowDown': {
                e.preventDefault();
                const downIndex = Math.min(index + cols, maxIndex);
                stockRefs.current[downIndex]?.focus();
                break;
            }
            case 'ArrowUp': {
                e.preventDefault();
                const upIndex = Math.max(index - cols, 0);
                stockRefs.current[upIndex]?.focus();
                break;
            }
            case 'Enter':
            case ' ': {
                e.preventDefault();
                handleStockDetails(stocks[index]);
                break;
            }
        }
    };

    const handleStockDetails = (stock: Stock) => {
        console.log('📦 Ouvrir détails stock:', stock.name, '(ID:', stock.id, ')');
        // Ici tu ajouteras ta logique d'ouverture des détails
    };

    return (
        <section id={id}>
            {/* ✅ AJOUTÉ : Titre de section pour structure sémantique */}
            <h3 className="sr-only">Liste détaillée des stocks</h3>

            {/* ✅ AJOUTÉ : Instructions pour navigation clavier */}
            <div className="sr-only" id="grid-instructions">
                Utilisez les flèches directionnelles pour naviguer dans la grille des stocks.
                Appuyez sur Entrée ou Espace pour consulter les détails d'un stock.
            </div>

            {/* ✅ AMÉLIORÉ : Structure de liste avec role et aria */}
            <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                role="grid"  // ✅ CHANGÉ : role="grid" pour navigation 2D
                aria-label={`Grille de ${stocks.length} stocks disponibles`}
                aria-describedby="grid-instructions"
            >
                {stocks.map((stock, index) => (
                    <div
                        key={stock.id}
                        ref={(el) => { stockRefs.current[index] = el; }}
                        role="gridcell"  // ✅ CHANGÉ : gridcell au lieu de button
                        tabIndex={index === 0 ? 0 : -1}  // ✅ AMÉLIORÉ : Seul le premier est focusable
                        className={`
                            cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-xl
                            transform transition-all duration-500
                            ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
                        `}
                        style={{ transitionDelay: `${index * 150}ms` }}
                        onClick={() => handleStockDetails(stock)}
                        onKeyDown={(e) => handleStockKeyDown(e, index)}
                        aria-label={`Stock ${stock.name}, quantité: ${stock.quantity} unités, valeur: ${stock.value} euros, statut: ${stock.status}`}
                        aria-rowindex={Math.floor(index / 3) + 1}  // ✅ AJOUTÉ : Position dans grille
                        aria-colindex={(index % 3) + 1}  // ✅ AJOUTÉ : Position dans grille
                    >
                        <StockCard
                            stock={stock}
                            index={index}
                            isLoaded={isLoaded}
                        />
                    </div>
                ))}
            </div>

            {/* ✅ AJOUTÉ : Message si aucun résultat */}
            {stocks.length === 0 && (
                <div
                    className="text-center py-12"
                    role="status"
                >
                    <p className="text-gray-500">Aucun stock trouvé</p>
                </div>
            )}
        </section>
    )
}