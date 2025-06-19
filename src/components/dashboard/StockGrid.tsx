import { StockCard } from "./StockCard"
import type { Stock } from "@/types"

interface StockGridProps {
    stocks: Stock[]
    isLoaded: boolean
}

export function StockGrid({ stocks, isLoaded }: StockGridProps) {
    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {stocks.map((stock, index) => (
                <StockCard key={stock.id} stock={stock} index={index} isLoaded={isLoaded} />
            ))}
        </section>
    )
}
