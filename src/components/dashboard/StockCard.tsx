"use client"

import { Eye, Edit3, Trash2 } from "lucide-react"
import { Card } from "@/components/common/Card"
import { Badge } from "@/components/common/Badge"
import { Button } from "@/components/common/Button"
import { useTheme } from "@/hooks/useTheme"
import { getThemeClasses } from "@/utils/theme"
import type { Stock, StockStatus, BadgeVariant } from "@/types"

interface StockCardProps {
    stock: Stock
    index: number
    isLoaded: boolean
}

export function StockCard({ stock, index, isLoaded }: StockCardProps) {
    const { theme } = useTheme()
    const themeClasses = getThemeClasses(theme)

    const getStatusBadge = (status: StockStatus) => {
        const statusMap: Record<StockStatus, { variant: BadgeVariant; label: string }> = {
            optimal: { variant: "success", label: "Optimal" },
            low: { variant: "warning", label: "Faible" },
            critical: { variant: "danger", label: "Critique" },
        }
        const { variant, label } = statusMap[status]
        return <Badge variant={variant}>{label}</Badge>
    }

    return (
        <div
            className={`transform transition-all duration-500 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            <Card className="relative">
                {/* Indicateur de statut */}
                <div
                    className={`absolute top-0 left-6 w-12 h-1 rounded-b-full ${
                        stock.status === "optimal" ? "bg-emerald-400" : stock.status === "low" ? "bg-amber-400" : "bg-red-400"
                    }`}
                />

                {/* Header avec nom et statut */}
                <div className="flex items-start justify-between mb-4 pt-2">
                    <div>
                        <h3 className={`text-lg font-semibold ${themeClasses.text}`}>{stock.name}</h3>
                        <p className={`text-sm ${themeClasses.textSubtle}`}>Mis à jour il y a {stock.lastUpdate}</p>
                    </div>
                    {getStatusBadge(stock.status)}
                </div>

                {/* Métriques */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold">{stock.quantity}</div>
                        <div className={`text-xs uppercase tracking-wide ${themeClasses.textSubtle}`}>Quantité</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">€{stock.value.toLocaleString()}</div>
                        <div className={`text-xs uppercase tracking-wide ${themeClasses.textSubtle}`}>Valeur</div>
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
                    <Button variant="ghost" size="sm" icon={Edit3} aria-label={`Modifier ${stock.name}`} />
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
    )
}
