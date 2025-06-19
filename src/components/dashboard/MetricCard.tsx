// METRICSCARD.TSX AMÉLIORÉ - Remplace le contenu de src/components/dashboard/MetricCard.tsx par :

"use client"

import { Package, AlertTriangle, TrendingUp } from "lucide-react"
import { Card } from "@/components/common/Card"
import { useTheme } from "@/hooks/useTheme"
import { getIconBackground, getIconColor, getThemeClasses } from "@/utils/theme"
import type { MetricData } from "@/types"

interface MetricsCardProps {
    metric: MetricData
}

export function MetricsCard({ metric }: MetricsCardProps) {
    const { theme } = useTheme()
    const themeClasses = getThemeClasses(theme)

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "package":
                return Package
            case "alert-triangle":
                return AlertTriangle
            case "trending-up":
                return TrendingUp
            default:
                return Package
        }
    }

    const Icon = getIcon(metric.icon)

    // ✅ NOUVEAU : Messages descriptifs pour aria-label
    const getChangeMessage = () => {
        const changeText = metric.changeType === "increase" ? "Augmentation" : "Diminution";
        const valueText = Math.abs(metric.change).toString();

        switch (metric.id) {
            case "total-products":
                return `${changeText} de ${valueText} produits ce mois`;
            case "low-stock":
                return `${changeText} de ${valueText} stocks faibles ce mois`;
            case "growth":
                return `Croissance de ${valueText} pourcent ce mois`;
            default:
                return `${changeText} de ${valueText}`;
        }
    };

    return (
        <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`p-3 rounded-xl ${getIconBackground(metric.color, theme)}`}>
                    <Icon className={`w-6 h-6 ${getIconColor(metric.color, theme)}`} aria-hidden="true" />
                </div>
                <span
                    className={`text-sm flex items-center gap-1 ${
                        metric.changeType === "increase"
                            ? getIconColor("success", theme)
                            : theme === "dark"
                                ? "text-red-400"
                                : "text-red-600"
                    }`}
                    aria-label={getChangeMessage()}  // ✅ AMÉLIORÉ : Message descriptif
                >
                    <TrendingUp
                        className={`w-3 h-3 ${metric.changeType === "decrease" ? "rotate-180" : ""}`}
                        aria-hidden="true"
                    />
                    {metric.changeType === "increase" ? "+" : ""}
                    {metric.change}
                </span>
            </div>
            <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 ${themeClasses.text}`}>{metric.value}</div>

            <div className={`text-sm ${themeClasses.textSubtle}`}>{metric.label}</div>  {/* ✅ CORRIGÉ : Thème dynamique */}
        </Card>
    )
}